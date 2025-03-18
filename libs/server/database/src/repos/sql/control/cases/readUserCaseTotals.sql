WITH operation_info AS (
		SELECT 
			o."caseId",
			MAX(o."controlLevel") FILTER (WHERE (o."class" = 'dispatch')) as "controlLevel",
			(jsonb_agg(to_jsonb(o) - '{caseOrder, controlFromOrder, approveToOrder, maxControlLevel, controlLevel, controlFromId, controlToId, approveToId}'::text[]) 
				FILTER (WHERE o."class" = 'reminder' AND o."controlFromOrder" = 1 AND o."controlFromId" =  ${userId}))->0  as "myReminder",
			(jsonb_agg(to_jsonb(o) - '{caseOrder, controlFromOrder, approveToOrder, maxControlLevel, controlLevel, controlFromId, controlToId, approveToId}'::text[]) 
				FILTER (WHERE o."class" = 'stage' AND o."approveStatus" = 'pending' AND o."approveToOrder" = 1 AND o."approveToId" = ${userId}))->0  as "myPendingStage",
			(jsonb_agg(to_jsonb(o) - '{caseOrder, controlFromOrder, approveToOrder, maxControlLevel, controlLevel, controlFromId, controlToId, approveToId}'::text[])
				FILTER (WHERE o."class" = 'stage' AND o."approveStatus" = ANY(ARRAY['approved', 'pending']) AND o."caseOrder" = 1))->0  as "lastStage",
			COALESCE(COUNT(*) FILTER (WHERE (o."type"->>'id')::integer = 12 AND o."doneDate" IS NULL) > 0, false) as "hasEscalations",
			COALESCE(COUNT(*) FILTER (WHERE o."class" = 'dispatch' AND o."controlFromId" = ${userId} AND o."controlToId" <> ${userId}) > 0, false) as "hasControlFromMe",
			COALESCE(COUNT(*) FILTER (WHERE o."class" = 'dispatch' AND o."controlToId" = ${userId}) > 0, false) as "hasControlToMe",
            MAX(COALESCE(o."createdAt", o."updatedAt")) FILTER (WHERE o."class" = ANY(ARRAY['stage', 'dispatch'])) as "lastEdit"

        FROM control.full_operations o
		WHERE o."archiveDate" IS NULL
GROUP BY o."caseId")

SELECT
	COUNT(*) FILTER (WHERE c.approve_status = 'pending' AND c.approve_to_id = ${userId})::integer as case_approve,
	COUNT(*) FILTER (WHERE c.approve_status = 'rejected' AND c.author_id = ${userId})::integer as case_rejected,
	COUNT(*) FILTER (WHERE c.approve_status = 'project' AND c.author_id = ${userId})::integer as case_project,
	COUNT(*) FILTER (WHERE o."myPendingStage" IS NOT NULL)::integer as operation_pprove,
	COUNT(*) FILTER (WHERE o."lastStage"->'type'->>'category' = 'решение' AND o."lastStage"->>'approveStatus' = 'approved' AND o."myReminder" IS NOT NULL AND o."myReminder"->>'doneDate' IS NULL AND o."hasEscalations" IS DISTINCT FROM true)::integer as reminder_done,
	COUNT(*) FILTER (WHERE (o."lastStage"->'type'->>'category' <> 'решение' AND (o."myReminder"->>'dueDate')::date < current_date) AND o."hasEscalations" IS DISTINCT FROM true)::integer as reminder_overdue,
	COUNT(*) FILTER (WHERE (o."myReminder"->'type'->>'id')::integer = 12 AND o."myReminder"->>'doneDate' IS NULL AND COALESCE(o."controlLevel", 0) < ${controlThreshold})::integer as escalation,
	COUNT(*) FILTER (WHERE (o."hasControlToMe" AND NOT (o."hasControlFromMe" OR o."lastStage"->'type'->>'category' IS NOT DISTINCT FROM 'решение')))::integer as control_to_me,

	COUNT(*) FILTER (WHERE (o."myReminder" IS NOT NULL AND o."myReminder"->>'doneDate' IS NULL) AND((o."myReminder"->>'updatedAt' IS NULL AND o."myReminder"->>'createdAt' IS NOT NULL) OR (COALESCE(GREATEST(o."lastEdit", c.updated_at), c.created_at) >= (o."myReminder"->>'updatedAt')::timestamp with time zone)) )::integer as updated

FROM control.cases_ c
LEFT JOIN operation_info o ON o."caseId" = c.id
WHERE c.archive_date IS NULL
	AND (c.approve_status = 'approved' OR ${userId} = ANY(ARRAY[c.author_id,c.approve_from_id,c.approve_to_id]::integer[]) )