SELECT 
    m.id,
    m.created_at as "createdAt",
    m.updated_at as "updatedAt",
    m.message_content as "messageContent",
    m.message_type as "messateType",
    m.author_id as "authorId",
    u.fio,
    u.roles,
    a.old_apart_id as "apartmentId", 
    a.building_id as "buildingId",
    a.adress,
    a.apart_num as "apartNum",
    a.apart_type as "apartType",
    a.fio,
    a.kpu_num as "kpuNum",
    a.stage,
    a.action_text as "actionText",
    a.deviation,
    a.problems
FROM renovation.messages m 
LEFT JOIN renovation.apartments_full a ON a.old_apart_id = m.apartment_id
LEFT JOIN renovation.users u ON m.author_id = u.id
WHERE m.apartment_id IS NOT NULL AND m.is_deleted <> true
  AND needs_answer = true AND answer_date IS NULL
  ${conditions:raw};