SELECT 
    c."CaseID"::integer as "id",
    c."CaseNum" as "caseNum",
    c."CaseDate"::date as "caseDate",
    c."ZamDueDate"::date as "dueDate",
    c."ResumeText" as "notes",
    exp."UserFIO" as "expert",
    u."UserFIO" as "user",
    c."EDO_Case_ID" as "edoId"
FROM public.cases c
LEFT JOIN public.users exp ON exp."UserID" = c."ExpertID"
LEFT JOIN public.users u ON u."UserID" = c."UserID"
WHERE c."ZamDoneDate" IS NULL
    AND c."EntryDate"::date = CURRENT_TIMESTAMP::date
    AND c."ZamDueDate"::date <= (CURRENT_TIMESTAMP::date + '1 day'::interval)
    AND c.new_urgent_notification_date IS NULL
    AND c."Archived" = false
    AND c."UprBossID" = 16
ORDER BY c."ZamDueDate", c."EntryDate"
LIMIT 20;