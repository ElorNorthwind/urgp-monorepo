SELECT 
    c."CaseID"::integer as "id",
    c."CaseNum" as "caseNum",
    c."CaseDate"::date as "caseDate",
    c."ZamDueDate"::date as "dueDate",
    exp."UserFIO" as "expert",
    c.need_resolution_change_date::timestamp with time zone as "markedAt",
 c.need_resolution_change_notification_date::timestamp with time zone as "notifiedAt",
    c."EDO_Case_ID" as "edoId"
FROM public.cases c
LEFT JOIN public.users exp ON exp."UserID" = c."ExpertID"
LEFT JOIN public.telegram_messages tm ON c."CaseID" = tm.case_id AND tm.message_type = 'unchangedResolution'
WHERE c."ZamDoneDate" IS NULL -- Не закрыто
      AND (CURRENT_TIMESTAMP - c.need_resolution_change_date) > '1 hour'::interval -- Галочка "требуется прееписать" стоит дольше часа
      AND (c.need_resolution_change_notification_date IS NULL OR (CURRENT_TIMESTAMP - c.need_resolution_change_notification_date) > '4 hours'::interval) -- С момента прошлого уведомления прошло больше 4 часов
      AND tm.reply_user_id IS NULL
   AND c."UprBossID" = 16 -- Осталось на Лукьянове
ORDER BY c."ZamDueDate"::date ASC, c.need_resolution_change_date
LIMIT 19;