SELECT 
    c.old_apart_id as "oldApartId",
    a.id as "newApartId",
    a.adress,
    a.apart_num as "apartNum",
    a.defect_complaint_date as "conplaintDate",
    a.defect_entry_date as "entryDate",
    a.defect_changed_done_date as "changedDoneDate",
    a.defect_actual_done_date as "actualDoneDate",
    a.defect_is_done as "isDone",
    a.defect_description as "description",
    a.defect_url as "url"
FROM (SELECT new_apart_id, old_apart_id, status_prio, MAX(status_prio) OVER (PARTITION BY old_apart_id) as max_status FROM renovation.apartment_connections ) c
LEFT JOIN renovation.apartments_new a ON c.new_apart_id = a.id
WHERE c.old_apart_id = ${id} AND c.max_status = c.status_prio AND a.defect_complaint_date IS NOT NULL;