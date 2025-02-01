-- 1. Гидрированный список операций
DROP VIEW IF EXISTS control.full_operations CASCADE;
CREATE OR REPLACE VIEW control.full_operations AS
WITH 
	operation_types AS (SELECT id, name, category, fullname, priority FROM control.operation_types), 
	user_info AS (SELECT id, fio, (control_data->>'priority')::integer as priority FROM renovation.users)

SELECT
  	-- Технические данные для свода
	ROW_NUMBER() OVER (PARTITION BY o.case_id, o.class 
					ORDER BY t.priority DESC, o.done_date DESC)  as "caseOrder",
	ROW_NUMBER() OVER (PARTITION BY o.case_id, o.class, o.approve_status, o.approve_to_id 
					ORDER BY o.created_at DESC) as "statusOrder",
	MAX(u3.priority) OVER (PARTITION BY o.case_id, o.class) as "maxControlLevel",
	u3.priority as "controlLevel",
	o.control_from_id as "controlFromId",
	o.approve_to_id as "approveToId",
	-- Полезная нагрузка
	o.id,
	o.case_id as "caseId",
	o.class,
	to_jsonb(t) as type,
	to_jsonb(u) as "author",
	to_jsonb(u2) as "updatedBy",
	to_jsonb(u3) as "controlFrom",
	to_jsonb(u4) as "controlTo",
	to_jsonb(u5) as "approveFrom",
	to_jsonb(u6) as "approveTo",
	o.approve_status as "approveStatus",
	o.approve_date as "approveDate",
	o.approve_notes as "approveNotes",
	o.created_at as "createdAt",
	o.updated_at as "updatedAt",
	o.due_date as "dueDate",
	o.done_date as "doneDate",
	o.title,
	o.notes,
	o.extra
FROM control.operations_ o
LEFT JOIN operation_types t ON t.id = o.type_id
LEFT JOIN user_info u ON u.id = o.author_id
LEFT JOIN user_info u2 ON u2.id = o.updated_by_id
LEFT JOIN user_info u3 ON u3.id = o.control_from_id
LEFT JOIN user_info u4 ON u4.id = o.control_to_id
LEFT JOIN user_info u5 ON u5.id = o.approve_from_id
LEFT JOIN user_info u6 ON u6.id = o.approve_to_id

WHERE o.archive_date IS NULL;

ALTER TABLE control.full_operations
    OWNER TO renovation_user;
	

-- 2. Гидрированный список дел
DROP VIEW IF EXISTS control.full_cases CASCADE;
CREATE OR REPLACE VIEW control.full_cases AS
WITH user_info AS (SELECT id, fio FROM renovation.users),
     operation_info AS (
		SELECT 
			o."caseId",
			MAX(o."controlLevel") FILTER (WHERE (o."class" = 'dispatch')) as "controlLevel",
			array_agg(DISTINCT o."controlFromId") FILTER (WHERE o."controlLevel" = o."maxControlLevel") as "controllerIds",
			(jsonb_agg(to_jsonb(o) - '{caseOrder, statusOrder, maxControlLevel, controlLevel, controlFromId, approveToId}'::text[]) 
				FILTER (WHERE o."class" = 'reminder' AND o."statusOrder" = 1 AND o."controlFromId" = 1))->0  as "myReminder",
			(jsonb_agg(to_jsonb(o) - '{caseOrder, statusOrder, maxControlLevel, controlLevel, controlFromId, approveToId}'::text[]) 
				FILTER (WHERE o."class" = 'stage' AND o."approveStatus" = 'pending' AND o."statusOrder" = 1 AND o."approveToId" = 1))->0  as "myPendingStage",
			(jsonb_agg(to_jsonb(o) - '{caseOrder, statusOrder, maxControlLevel, controlLevel, controlFromId, approveToId}'::text[])
				FILTER (WHERE o."class" = 'stage' AND o."caseOrder" = 1))->0  as "lastStage",
			json_agg(to_jsonb(o) - '{caseOrder, statusOrder, maxControlLevel, controlLevel, controlFromId, approveToId}'::text[]
				ORDER BY (o."controlFrom"->>'priority')::integer DESC, o."dueDate" ASC )
				FILTER (WHERE o."class" = 'dispatch') as dispatches,
			MAX(o."updatedAt") FILTER (WHERE o."class" = ANY(ARRAY['stage', 'dispatch'])) as "lastEdit"
		FROM control.full_operations o
GROUP BY o."caseId")

SELECT
	c.id,
	c.class,
	to_jsonb(t) as type,
	to_jsonb(u) as author,
	to_jsonb(u2) as updatedBy,
	to_jsonb(u3) as approveFrom,
	to_jsonb(u4) as approveTo,
	c.approve_status as "approveStatus",
	c.approve_date as "approveDate",
	c.approve_notes as "approveNotes",
	c.title,
	c.notes,
	c.extra,
	to_jsonb(s) as status,
	CASE
		WHEN o."myReminder" IS NULL OR o."myReminder"->>'doneDate' IS NOT NULL THEN 'unwatched'
		WHEN GREATEST(o."lastEdit", c.updated_at) <= (o."myReminder"->>'updatedAt')::timestamp with time zone THEN 'unchanged'
		WHEN (o."myReminder"->>'updatedAt')::timestamp with time zone = (o."myReminder"->>'createdAt')::timestamp with time zone  IS NULL THEN 'new'
		ELSE 'changed'
	END AS "viewStatus",
	GREATEST(o."lastEdit", c.updated_at) as "lastEdit",
	o."myReminder" as "myReminder",
	o."lastStage" as "lastStage",
	o."dispatches" as "dispatches",
	o."myPendingStage" as "myPendingStage"

FROM control.cases_ c

LEFT JOIN control.case_types t ON t.id = c.type_id
LEFT JOIN user_info u ON u.id = c.author_id
LEFT JOIN user_info u2 ON u2.id = c.updated_by_id
LEFT JOIN user_info u3 ON u3.id = c.approve_from_id
LEFT JOIN user_info u4 ON u4.id = c.approve_to_id
LEFT JOIN operation_info o ON o."caseId" = c.id
LEFT JOIN (SELECT id, name, category, fullname as "fullName" FROM control.case_status_types) s ON s.id = 
	CASE 
		WHEN c.approve_status = 'pendin' THEN 1 -- "на утверждении"
		WHEN c.approve_status = 'rejected' THEN 10 -- "отказано в согласовании"
		-- Эти вот штуки лучше бы прописать через специальное поле в control.operation_types ?
		WHEN (o."lastStage"->'type'->>'id')::integer = 7 AND o."lastStage"->>'approveStatus' = 'approved' THEN 5 -- "отклонено"
		WHEN (o."lastStage"->'type'->>'id')::integer = 8 AND o."lastStage"->>'approveStatus' = 'approved' THEN 6 -- "решено"
		WHEN (o."lastStage"->'type'->>'id')::integer = 9 AND o."lastStage"->>'approveStatus' = 'approved' THEN 7 -- "не решено"
		WHEN (o.dispatches->0->>'dueDate')::date < current_date THEN 11 -- "просрочка"
		WHEN o."lastStage"->>'approveStatus' = 'pending' THEN 4 -- "проект решения"
		WHEN o."lastStage" IS NOT NULL THEN 3 -- "в работе"
		ELSE 2 -- "направлено"
	END
WHERE c.archive_date IS NULL;