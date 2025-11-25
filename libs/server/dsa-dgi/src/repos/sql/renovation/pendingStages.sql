SELECT 
	s.id,
	s.created_at as "createdAt",
	s.author_id as "authorId",
	u.fio as "authorFio",
	(s.message_payload->-1->>'docDate')::date as "pendingDocDate",
	s.message_payload->-1->>'docNumber' as "pendingDocNum",
	s.message_payload->-1->>'text' as "pendingDocNotes",
	(s.message_payload->-1->>'stageId')::integer as "pendingStageId",
	st.name as "pendingStageName",
	st.next_action_text as "pendingAction",
	a.id as "apartmentId", 
	a.building_id as "buildingId",
	b.adress,
	b.okrug,
	b.district,
	a.apart_num as "apartNum",
	a.apart_type as "apartType",
	a.fio,
	a.kpu_num as "kpuNum",
	a.old_apart_status as "apartStatus",
	(a.classificator->>'stageName')::varchar as stage,
	(a.classificator->>'action')::varchar as "action",
	(a.classificator->>'deviation')::varchar as deviation,
	(a.classificator->>'problems')::varchar as problems
FROM renovation.messages s
LEFT JOIN renovation.apartments_old a ON a.id = s.apartment_id
LEFT JOIN renovation.buildings_old b ON a.building_id = b.id
LEFT JOIN renovation.users u ON s.author_id = u.id
LEFT JOIN renovation.apartment_stages st ON st.id = (s.message_payload->-1->>'stageId')::integer
WHERE s.message_type = 'stage' 
		AND (message_payload->-1->>'deleted')::boolean IS DISTINCT FROM true 
		AND s.message_payload->-1->>'approveStatus' IS NOT DISTINCT FROM 'pending'
ORDER BY created_at DESC;