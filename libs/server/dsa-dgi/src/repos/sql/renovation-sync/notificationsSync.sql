INSERT INTO renovation.apartment_connections (old_apart_id, new_apart_id, inspection_date, inspection_response_date, inspection_response)
SELECT DISTINCT ON (n.affair_id, n.new_apart_id)
	ao.id as old_apart_id, 
	an.id as new_apart_id,
	n.document_date as inspection_date,
	n.document_answer_date as inspection_response_date,
	n.answer_for_offer as inspection_response
FROM public.notifications n
LEFT JOIN renovation.apartments_old ao ON ao.affair_id = n.affair_id
LEFT JOIN renovation.apartments_new an ON n.new_apart_id = an.rsm_new_id
WHERE ao.id IS NOT NULL AND an.id IS NOT NULL
ORDER BY n.affair_id, n.new_apart_id, n.document_date DESC
ON CONFLICT (old_apart_id, new_apart_id) DO UPDATE
SET	
	inspection_date = excluded.inspection_date, 
	inspection_response_date = excluded.inspection_response_date, 
	inspection_response = excluded.inspection_response;