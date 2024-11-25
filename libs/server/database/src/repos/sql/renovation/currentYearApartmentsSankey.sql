WITH apartments AS (
 SELECT
  CASE
   WHEN LOWER(a.old_apart_status) LIKE ANY (ARRAY['%аренда%', '%служебн%', '%общежит%']) THEN 'Закрепление' -- 0
   WHEN LOWER(a.old_apart_status) LIKE ANY (ARRAY['%федеральная%']) THEN 'Федералка' -- 1
   ELSE 'Обычное переселение' -- 2
  END as start_pull,
  CASE
   WHEN a.classificator->'problems' ? 'Иск граждан' THEN 'Иск граждан' -- 3
   WHEN a.classificator->'problems' ? 'Суды' THEN 'Иск ДГИ' -- 4
   WHEN a.classificator->'problems' ? 'МФР' THEN 'МФР' -- 5
   WHEN a.classificator->'problems' ? 'Отказ' THEN 'Отказ' -- 6
   ELSE null 
  END as problem_pull,
  CASE
   WHEN (a.classificator->>'stageId')::integer = ANY(ARRAY[27, 26]) THEN 'Переселён' -- 9
   WHEN (a.classificator->>'stageId')::integer = 1 THEN 'Освобождено без переселения' -- 8
   ELSE 'В работе' -- 7
  END as status_pull,
  CASE
   WHEN NOT((a.classificator->>'stageId')::integer = ANY(ARRAY[27, 26])) THEN null
   WHEN AGE(COALESCE(a.stages_dates->'contract'->>'date', a.stages_dates->'contract'->>'execution', a.stages_dates->'contract'->>'free')::date, (a.stages_dates->'resettlementStart'->>'date')::date) < '5 month'::interval THEN 'Быстрее 5 месяцев' -- 12
   WHEN AGE(COALESCE(a.stages_dates->'contract'->>'date', a.stages_dates->'contract'->>'execution', a.stages_dates->'contract'->>'free')::date, (a.stages_dates->'resettlementStart'->>'date')::date) < '8 month'::interval THEN 'От 5 до 8 месяцев' -- 11
   ELSE 'Дольше 8 месяцев' -- 10
  END as age_pull
 FROM renovation.apartments_old_temp a
--  LEFT JOIN renovation.buildings_old b ON a.building_id = b.id WHERE b.id = 5873
 WHERE DATE_PART('year', (a.stages_dates->'resettlementStart'->>'date')::date) = DATE_PART('year', NOW())
), raw_data AS (
 SELECT 
  COUNT(*)::integer as value,
  start_pull as source,
  problem_pull as target
 FROM apartments
 WHERE start_pull IS NOT NULL AND problem_pull IS NOT NULL
 GROUP BY start_pull, problem_pull
 
 
 UNION

 SELECT 
  COUNT(*)::integer as value,
  start_pull as source,
  status_pull as target
 FROM apartments
 WHERE status_pull IS NOT NULL AND start_pull IS NOT NULL
 GROUP BY start_pull, status_pull

 UNION

 SELECT 
  COUNT(*)::integer as value,
  problem_pull as source,
  status_pull as target
 FROM apartments
 WHERE status_pull IS NOT NULL AND problem_pull IS NOT NULL
 GROUP BY problem_pull, status_pull

 
 UNION

 SELECT 
  COUNT(*)::integer as value,
  status_pull as source,
  age_pull as target
 FROM apartments
 WHERE status_pull IS NOT NULL AND age_pull IS NOT NULL
 GROUP BY status_pull, age_pull
), node_list(name, index) AS (
 VALUES
    ('Закрепление', 0),
    ('Федералка', 1),
    ('Обычное переселение', 2 ),
    ('Иск граждан', 3),
    ('Иск ДГИ', 4),
    ('МФР', 5),
    ('Отказ', 6),
    ('В работе', 7),
    ('Освобождено без переселения', 8),
    ('Переселён', 9),
    ('Дольше 8 месяцев', 10),
    ('От 5 до 8 месяцев', 11),
    ('Быстрее 5 месяцев', 12)
)


SELECT 
    JSONB_BUILD_ARRAY(
  JSONB_BUILD_OBJECT('name', 'Закрепление'), -- 0 
  JSONB_BUILD_OBJECT('name', 'Федералка'), -- 1
  JSONB_BUILD_OBJECT('name', 'Обычное переселение'), -- 2 
  JSONB_BUILD_OBJECT('name', 'Иск граждан'), -- 3
  JSONB_BUILD_OBJECT('name', 'Иск ДГИ'), -- 4
  JSONB_BUILD_OBJECT('name', 'МФР'), -- 5
  JSONB_BUILD_OBJECT('name', 'Отказ'), -- 5
  JSONB_BUILD_OBJECT('name', 'В работе'), -- 6
  JSONB_BUILD_OBJECT('name', 'Освобождено без переселения'), -- 7
  JSONB_BUILD_OBJECT('name', 'Переселён'), -- 8
  JSONB_BUILD_OBJECT('name', 'Дольше 8 месяцев'), -- 9
  JSONB_BUILD_OBJECT('name', 'От 5 до 8 месяцев'), -- 10
  JSONB_BUILD_OBJECT('name', 'Быстрее 5 месяцев') -- 11
    ) as nodes, 
    JSONB_AGG(
        JSONB_BUILD_OBJECT(
--     'sourceName', r.source,
--     'targetName', r.target,
                'source', s.index,        
                'target', t.index, 
                'value', r.value)
            ) 
  as links
FROM raw_data r
LEFT JOIN node_list s ON r.source = s.name
LEFT JOIN node_list t ON r.target = t.name;