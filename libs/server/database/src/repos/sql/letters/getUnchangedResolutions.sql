SELECT 
    c."CaseID"::integer as "id",
    c."CaseNum" as "caseNum",
    c."CaseDate"::date as "caseDate",
    c."ZamDueDate"::date as "dueDate",
    exp."UserFIO" as "expert",
    c.need_resolution_change_date::timestamp with time zone as "markedAt",
    c."EDO_Case_ID" as "edoId"
FROM public.cases c
LEFT JOIN public.users exp ON exp."UserID" = c."ExpertID"
WHERE c."ZamDoneDate" IS NULL -- Не закрыто
      AND (CURRENT_TIMESTAMP - c.need_resolution_change_date) > '1 minute'::interval -- Галочка "требуется прееписать" стоит дольше часа
      AND c."UprBossID" = 16 -- Осталось на Лукьянове