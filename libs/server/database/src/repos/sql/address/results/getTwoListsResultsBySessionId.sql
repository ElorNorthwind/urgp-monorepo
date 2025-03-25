WITH matched_results AS (
	SELECT 
		l1.id,
		l2.session_npp,
		l2.original_address,
		l2.id as id2
	FROM (SELECT id, original_address, fias_id FROM address.results WHERE session_id = ${sessionId} AND list_index = 0) l1
	LEFT JOIN (SELECT id, session_npp, original_address, fias_id FROM address.results WHERE session_id = ${sessionId} AND list_index = 1) l2
			ON (l1.fias_id <> -1 AND l1.fias_id = l2.fias_id) 
			OR (l1.original_address <> 'Адрес не найден' AND l1.original_address = l2.original_address)
), grouped_matches AS (
	SELECT 
		id, 
		STRING_AGG(session_npp::text, '; ') as session_npps,
		MIN(session_npp) as min_session_npp,
		STRING_AGG(original_address, '; ') as original_addresses
	FROM matched_results
	GROUP BY id
)
SELECT
    r.session_npp AS "№ в списке",
    r.original_address AS "Исходный адрес",
	
	r2.min_session_npp AS "Первый № во втором списке",
    r2.session_npps AS "№ во втором списке",
    r2.original_addresses AS "Исходный адрес во втором списке",
	
    CASE WHEN r.is_error IS DISTINCT FROM true THEN 'найден' ELSE 'не найден' END AS "Результат",
    CASE 
        WHEN r.confidence = 'high' THEN 'Высокая'
        WHEN r.confidence = 'medium' THEN 'Нормальная'
        WHEN r.confidence = 'low' THEN 'Низкая'
        WHEN r.confidence = 'none' THEN 'Никакой'
        ELSE 'Не установлена'
    END AS "Уверенность в результате",

    r.unom as "УНОМ",
    r.full_address AS "Полный адрес",
    r.postal as "Почтовый индекс",
    r.cad_num AS "Кадастровый номер объекта",
    r.house_cad_num AS "Кадастровый номер дома",

    r.fias_id AS "Объект - ID ФИАС",
    r.fias_guid AS "Объект - GUID ФИАС",
    r.fias_path AS "Объект - путь ФИАС",
    r.fias_level AS "Объект - уровень ФИАС",
    r.fias_is_active AS "Объект - активен в ФИАС",

    r.street_name AS "Улица - название",
    r.street_level AS "Улица - уровень",
    r.street_type AS "Улица - тип",
    r.street_fias_id AS "Улица - ID ФИАС",
    r.street_fias_guid AS "Улица - GUID ФИАС",
    r.street_kladr AS "Улица - код КЛАДР",

    r.house_name AS "Дом - полное наименование",
    -- house_type AS "Дом - тип",
    r.house_fias_id AS "Дом - ID ФИАС",
    r.house_fias_guid AS "Дом - GUID ФИАС",

    r.apartment_num AS "Квартира - номер",
    r.apartment_type AS "Квартира - тип", 
    r.apartment_fias_id AS "Квартира - ID ФИАС",
    r.apartment_fias_guid AS "Квартира - GUID ФИАС",

    r.response_source AS "Источник данных"

FROM (SELECT * FROM address.results WHERE session_id = ${sessionId} AND list_index = 0) r
LEFT JOIN grouped_matches r2 ON r.id = r2.id
-- ORDER BY r.session_npp ASC, r.id ASC

UNION

SELECT
    null AS "№ в списке",
    null AS "Исходный адрес",
	
	r2.session_npp AS "Первый № во втором списке",
    r2.session_npp::text AS "№ во втором списке",
    r2.original_address AS "Исходный адрес во втором списке",
	
    CASE WHEN r2.is_error IS DISTINCT FROM true THEN 'найден' ELSE 'не найден' END AS "Результат",
    CASE 
        WHEN r2.confidence = 'high' THEN 'Высокая'
        WHEN r2.confidence = 'medium' THEN 'Нормальная'
        WHEN r2.confidence = 'low' THEN 'Низкая'
        WHEN r2.confidence = 'none' THEN 'Никакой'
        ELSE 'Не установлена'
    END AS "Уверенность в результате",

    r2.unom as "УНОМ",
    r2.full_address AS "Полный адрес",
    r2.postal as "Почтовый индекс",
    r2.cad_num AS "Кадастровый номер объекта",
    r2.house_cad_num AS "Кадастровый номер дома",

    r2.fias_id AS "Объект - ID ФИАС",
    r2.fias_guid AS "Объект - GUID ФИАС",
    r2.fias_path AS "Объект - путь ФИАС",
    r2.fias_level AS "Объект - уровень ФИАС",
    r2.fias_is_active AS "Объект - активен в ФИАС",

    r2.street_name AS "Улица - название",
    r2.street_level AS "Улица - уровень",
    r2.street_type AS "Улица - тип",
    r2.street_fias_id AS "Улица - ID ФИАС",
    r2.street_fias_guid AS "Улица - GUID ФИАС",
    r2.street_kladr AS "Улица - код КЛАДР",

    r2.house_name AS "Дом - полное наименование",
    -- house_type AS "Дом - тип",
    r2.house_fias_id AS "Дом - ID ФИАС",
    r2.house_fias_guid AS "Дом - GUID ФИАС",

    r2.apartment_num AS "Квартира - номер",
    r2.apartment_type AS "Квартира - тип", 
    r2.apartment_fias_id AS "Квартира - ID ФИАС",
    r2.apartment_fias_guid AS "Квартира - GUID ФИАС",

    r2.response_source AS "Источник данных"

FROM (SELECT * FROM address.results WHERE session_id = ${sessionId} AND list_index = 1) r2
LEFT JOIN matched_results r ON r.id2 = r2.id
WHERE r.id2 IS NULL

ORDER BY "№ в списке", "Первый № во втором списке", "№ во втором списке";