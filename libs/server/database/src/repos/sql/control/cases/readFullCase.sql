WITH user_info AS (SELECT id, fio FROM renovation.users), -- (control_data->>'priority')::integer as priority
     operation_info AS (
		SELECT 
			o."caseId",
			array_agg(o.id) as "operationIds",
			MAX(o."controlLevel") FILTER (WHERE (o."class" = 'dispatch')) as "controlLevel",
			array_agg(DISTINCT o."controlFromId") FILTER (WHERE o."controlLevel" = o."maxControlLevel") as "controllerIds",
			(jsonb_agg(to_jsonb(o) - '{caseOrder, controlFromOrder, approveToOrder, maxControlLevel, controlLevel, controlFromId, approveToId}'::text[]) 
				FILTER (WHERE o."class" = 'reminder' AND o."controlFromOrder" = 1 AND o."controlFromId" =  ${userId}))->0  as "myReminder",
			(jsonb_agg(to_jsonb(o) - '{caseOrder, controlFromOrder, approveToOrder, maxControlLevel, controlLevel, controlFromId, approveToId}'::text[]) 
				FILTER (WHERE o."class" = 'stage' AND o."approveStatus" = 'pending' AND o."approveToOrder" = 1 AND o."approveToId" = ${userId}))->0  as "myPendingStage",
			(jsonb_agg(to_jsonb(o) - '{caseOrder, controlFromOrder, approveToOrder, maxControlLevel, controlLevel, controlFromId, approveToId}'::text[])
				FILTER (WHERE o."class" = 'stage' AND o."approveStatus" = ANY(ARRAY['approved', 'pending']) AND o."caseOrder" = 1))->0  as "lastStage",
			jsonb_agg(to_jsonb(o) - '{caseOrder, controlFromOrder, approveToOrder, maxControlLevel, controlLevel, controlFromId, approveToId}'::text[]
				ORDER BY (o."controlFrom"->>'priority')::integer DESC, o."dueDate" ASC )
				FILTER (WHERE o."class" = 'dispatch') as dispatches,
			COUNT(*) FILTER (WHERE (o."type"->>'id')::integer = 12 AND o."doneDate" IS NULL) as "escalations",
			MAX(o."updatedAt") FILTER (WHERE o."class" = ANY(ARRAY['stage', 'dispatch'])) as "lastEdit"
		FROM control.full_operations o
		WHERE o."archiveDate" IS NULL
GROUP BY o."caseId"),
	directions AS (
		SELECT  
			c.id,
			jsonb_agg(d) as val
		FROM control.cases_ c
		LEFT JOIN (SELECT id, name, category, fullname as "fullName", default_executor_id as "executorId" FROM control.direction_types) d ON d.id = ANY(c.direction_ids)
		WHERE d.id IS NOT NULL
		GROUP BY c.id)

SELECT
	c.id,
	c.class,
	to_jsonb(t) as type,
	to_jsonb(u) as author,
	to_jsonb(u2) as "updatedBy",
	to_jsonb(u3) as "approveFrom",
	to_jsonb(u4) as "approveTo",
	c.approve_status as "approveStatus",
	c.approve_date as "approveDate",
	c.approve_notes as "approveNotes",
	c.external_cases as "externalCases",
	COALESCE(d.val, '[]'::jsonb) as directions,
	c.title,
	c.notes,
	c.extra,
	o."operationIds",
	to_jsonb(s) as status,
	CASE
		WHEN o."myReminder" IS NULL OR o."myReminder"->>'doneDate' IS NOT NULL THEN 'unwatched'
		WHEN COALESCE(GREATEST(o."lastEdit", c.updated_at), c.created_at) <= (o."myReminder"->>'updatedAt')::timestamp with time zone THEN 'unchanged'
		WHEN o."myReminder"->>'updatedAt' IS NULL AND o."myReminder"->>'createdAt' IS NOT NULL THEN 'new'
		ELSE 'changed'
	END AS "viewStatus",
	COALESCE(GREATEST(o."lastEdit", c.updated_at), c.created_at) as "lastEdit",
	o."myReminder" as "myReminder",
	o."lastStage" as "lastStage",
	COALESCE(o."dispatches", '[]'::jsonb) as "dispatches",
	o."myPendingStage" as "myPendingStage",
	ARRAY_REMOVE(
		ARRAY[
			  CASE WHEN c.approve_status = 'pending' THEN 'case-approve' ELSE null END
			, CASE WHEN c.approve_status = 'rejected' THEN 'case-rejected' ELSE null END
			, CASE WHEN o."myPendingStage" IS NOT NULL THEN 'operation-approve' ELSE null END
			, CASE WHEN o."lastStage"->'type'->>'category' = 'решение' AND o."myReminder" IS NOT NULL AND o."myReminder"->>'doneDate' IS NULL THEN 'reminder-done' ELSE null END
			, CASE WHEN (o."lastStage"->'type'->>'category' <> 'решение' AND (o."myReminder"->>'dueDate')::date < current_date) THEN 'reminder-overdue' ELSE null END
			, CASE WHEN (o."myReminder"->'type'->>'id')::integer = 12 AND o."myReminder"->>'doneDate' IS NULL THEN 'escalation' ELSE null END
		]
	, null) as actions,
	c.revision,
	COALESCE(o.escalations, 0) as escalations,
	o."controlLevel"
FROM control.cases_ c

LEFT JOIN control.case_types t ON t.id = c.type_id
LEFT JOIN user_info u ON u.id = c.author_id
LEFT JOIN user_info u2 ON u2.id = c.updated_by_id
LEFT JOIN user_info u3 ON u3.id = c.approve_from_id
LEFT JOIN user_info u4 ON u4.id = c.approve_to_id
LEFT JOIN operation_info o ON o."caseId" = c.id
LEFT JOIN directions d ON d.id = c.id
LEFT JOIN (SELECT id, name, category, fullname as "fullName" FROM control.case_status_types) s ON s.id = 
	CASE 
		WHEN c.approve_status = 'pending' THEN 1 -- "на утверждении"
		WHEN c.approve_status = 'rejected' THEN 10 -- "отказано в согласовании"
		WHEN c.approve_status = 'project' THEN 12 -- "проект"
		-- Эти вот штуки лучше бы прописать через специальное поле в control.operation_types ?
		WHEN o.escalations > 0 THEN 8 -- "запрошено заключение"
		WHEN (o."lastStage"->'type'->>'id')::integer = 7 AND o."lastStage"->>'approveStatus' = 'approved' AND COALESCE(o."controlLevel", 0) <= COALESCE((o."lastStage"->'approveFrom'->>'priority')::integer, 0) THEN 5 -- "отклонено"
		WHEN (o."lastStage"->'type'->>'id')::integer = 8 AND o."lastStage"->>'approveStatus' = 'approved' AND COALESCE(o."controlLevel", 0) <= COALESCE((o."lastStage"->'approveFrom'->>'priority')::integer, 0) THEN 6 -- "решено"
		WHEN (o."lastStage"->'type'->>'id')::integer = 9 AND o."lastStage"->>'approveStatus' = 'approved' AND COALESCE(o."controlLevel", 0) <= COALESCE((o."lastStage"->'approveFrom'->>'priority')::integer, 0) THEN 7 -- "не решено"
		WHEN COALESCE(o."controlLevel", 0) >= ${controlThreshold} THEN 9 -- "на контроле руководства"
		WHEN (o.dispatches->0->>'dueDate')::date < current_date THEN 11 -- "просрочка"
		WHEN o."lastStage"->>'approveStatus' = 'pending' THEN 4 -- "проект решения"
		WHEN o."lastStage" IS NOT NULL THEN 3 -- "в работе"
		ELSE 2 -- "направлено"
	END
WHERE c.archive_date IS NULL
${conditions:raw};