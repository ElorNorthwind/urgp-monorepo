WITH directions AS (
	SELECT  
		c.id,
		jsonb_agg(to_jsonb(d)) as val
	FROM control.cases c
	LEFT JOIN control.direction_types d ON c.payload->-1->'directionIds' @> to_jsonb(d.id)
	GROUP BY c.id
), dispatches AS (
	SELECT 
		o.case_id,
		jsonb_agg(jsonb_build_object(
			'id', o.id,
			'class', o.class,
			'dueDate', (o.payload->-1->>'dueDate')::date,
			-- 'description', o.payload->-1->>'description',
			'executor', to_jsonb(e),
			'controller', to_jsonb(c)
		) ORDER BY c.priority DESC, (o.payload->-1->>'dueDate')::date ASC ) as dispatches
	FROM control.operations o
	LEFT JOIN (SELECT id, fio, (control_data->>'priority')::integer as priority FROM renovation.users) e ON e.id = (o.payload->-1->>'executorId')::integer
	LEFT JOIN (SELECT id, fio, (control_data->>'priority')::integer as priority FROM renovation.users) c ON c.id = (o.payload->-1->>'controllerId')::integer
	WHERE class = 'dispatch' AND (o.payload->-1->>'isDeleted')::boolean IS NOT DISTINCT FROM false
	GROUP BY o.case_id
), last_stage AS (
	SELECT case_id, id, class, "doneDate", "approveStatus", type
	FROM ( SELECT
		o.case_id,
		ROW_NUMBER() OVER (PARTITION BY case_id ORDER BY t.priority DESC, (o.payload->-1->>'doneDate')::date DESC) as num,
		o.id,
		o.class,
		(o.payload->-1->>'doneDate')::date as "doneDate",
		o.payload->-1->>'approveStatus' as "approveStatus",
		to_jsonb(t) as "type"
	FROM control.operations o 
	LEFT JOIN (SELECT id, name, category, priority FROM control.operation_types) t ON t.id = (o.payload->-1->>'typeId')::integer
		  WHERE o.class = 'stage' AND (o.payload->-1->>'isDeleted')::boolean IS NOT DISTINCT FROM false AND o.payload->-1->>'approveStatus' IS DISTINCT FROM 'rejected'
	) op WHERE op.num = 1 
)

SELECT  
	c.id,
	c.class,
	to_jsonb(u) as author,
	c.created_at as "createdAt", 
	GREATEST((c.payload->-1->>'updatedAt')::timestamp with time zone, o.updated) as "lastEdit",
	rem.seen as "lastSeen",
	CASE
		WHEN rem.seen IS NULL OR rem.done IS NOT NULL THEN 'unwatched'
		WHEN GREATEST((c.payload->-1->>'updatedAt')::timestamp with time zone, o.updated) <= rem.seen THEN 'unchanged'
		WHEN rem.count = 1 THEN 'new'
		ELSE 'changed'
	END AS "viewStatus",
	jsonb_build_object(
		'id', s.id,
		'name', s.name,
		'category', s.category,
		'fullName', s.fullname
	) as status,
	dis.dispatches as dispatches,
-- 	to_jsonb(ls) as "lastStage",
	ls.id as "lastStageId",
	c.payload->-1 
		#- '{typeId, directionIds, problemIds, approverId, approveById, updatedById}'
		|| jsonb_build_object('directions', d.val)
		|| jsonb_build_object('type', to_jsonb(t))
		|| jsonb_build_object('problems', null)   
		|| jsonb_build_object('approver', to_jsonb(u2)) 
		|| jsonb_build_object('approveBy', to_jsonb(u3)) 
		|| jsonb_build_object('updatedBy', to_jsonb(u4)) 
	as payload
FROM control.cases c
LEFT JOIN control.case_types t ON t.id = (c.payload->-1->'typeId')::integer
LEFT JOIN directions d ON d.id = c.id
LEFT JOIN last_stage ls ON ls.case_id = c.id
LEFT JOIN (SELECT id, fio FROM renovation.users) u ON u.id = c.author_id
LEFT JOIN (SELECT id, fio FROM renovation.users) u2 ON u2.id = (c.payload->-1->>'approverId')::integer
LEFT JOIN (SELECT id, fio FROM renovation.users) u3 ON u3.id = (c.payload->-1->>'approveById')::integer
LEFT JOIN (SELECT id, fio FROM renovation.users) u4 ON u4.id = (c.payload->-1->>'updatedById')::integer
LEFT JOIN (SELECT case_id, COUNT(*) as count, MAX((payload->-1->>'updatedAt')::timestamp with time zone) as updated FROM control.operations WHERE class = ANY(ARRAY['stage', 'dispatch']) GROUP BY case_id) o ON o.case_id = c.id
LEFT JOIN (SELECT DISTINCT ON(case_id) case_id, 
                                       jsonb_array_length(payload) as count, 
									   MAX((payload->-1->>'lastSeenDate')::timestamp with time zone) as seen,
									   MAX((payload->-1->>'doneDate')::timestamp with time zone) as done
			FROM control.operations WHERE class = ANY(ARRAY['reminder']) AND (payload->-1->>'observerId')::integer = ${userId} GROUP BY case_id, jsonb_array_length(payload)) rem ON rem.case_id = c.id
LEFT JOIN dispatches dis ON dis.case_id = c.id
LEFT JOIN control.case_status_types s ON s.id = 
	CASE 
		WHEN c.payload->-1->>'approveStatus' = 'pending' THEN 1 -- "на утверждении"
		WHEN c.payload->-1->>'approveStatus' = 'rejected' THEN 10 -- "отказано в согласовании"
		-- Эти вот штуки лучше бы прописать через специальное поле в control.operation_types ?
		WHEN (ls.type->>'id')::integer = 7 AND ls."approveStatus" = 'approved' THEN 5 -- "отклонено"
		WHEN (ls.type->>'id')::integer = 8 AND ls."approveStatus" = 'approved' THEN 6 -- "решено"
		WHEN (ls.type->>'id')::integer = 9 AND ls."approveStatus" = 'approved' THEN 7 -- "не решено"
		WHEN (dis.dispatches->0->>'dueDate')::date < current_date THEN 11 -- "просрочка"
		WHEN ls."approveStatus" = 'pending' THEN 4 -- "проект решения"
		WHEN ls.id IS NOT NULL THEN 3 -- "в работе"
		ELSE 2 -- "направлено"
	END
WHERE c.id = ${id};