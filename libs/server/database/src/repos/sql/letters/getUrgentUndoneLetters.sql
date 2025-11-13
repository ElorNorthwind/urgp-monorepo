SELECT 
    c."CaseID"::integer as "id",
    c."CaseNum" as "caseNum",
    c."CaseDate"::date as "caseDate",
    c."ZamDueDate"::date as "dueDate",
    CASE WHEN u."UserID" IS NULL THEN 'Не расписано на исполнителя' ELSE 'Не запущен согл (предположительно)' END as "notes",
    exp."UserFIO" as "expert",
    u."UserFIO" as "user",
    c."EDO_Case_ID" as "edoId"

FROM public.cases c
LEFT JOIN public.users exp ON exp."UserID" = c."ExpertID"
LEFT JOIN public.users u ON u."UserID" = c."UserID"
WHERE c."ZamDoneDate" IS NULL
    AND (
        (c."ReplyNum" = 0 AND c."ZamDueDate"::date BETWEEN CURRENT_TIMESTAMP::date - '10 day'::interval AND CURRENT_TIMESTAMP::date) 
     OR (c."UserID" IS NULL AND c."ZamDueDate"::date <= (CURRENT_TIMESTAMP::date + '3 day'::interval))
    )
    AND c."Archived" = false
    AND c."UprBossID" = 16
ORDER BY c."ZamDueDate", c."EntryDate";