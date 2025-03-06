SELECT
    session_npp AS "№ п/п",
    original_address AS "Исходный адрес",

    CASE WHEN is_error IS DISTINCT FROM true THEN 'найден' ELSE 'не найден' END AS "Результат",
    unom as "УНОМ",
    full_address AS "Полный адрес",
    postal as "Почтовый индекс",
    cad_num AS "Кадастровый номер объекта",
    house_cad_num AS "Кадастровый номер дома",

    fias_id AS "Объект - ID ФИАС",
    fias_guid AS "Объект - GUID ФИАС",
    fias_path AS "Объект - путь ФИАС",
    fias_level AS "Объект - уровень ФИАС",
    fias_is_active AS "Объект - активен в ФИАС",

    street_name AS "Улица - название",
    street_level AS "Улица - уровень",
    street_type AS "Улица - тип",
    street_fias_id AS "Улица - ID ФИАС",
    street_fias_guid AS "Улица - GUID ФИАС",
    street_kladr AS "Улица - код КЛАДР",

    house_name AS "Дом - полное наименование",
    -- house_type AS "Дом - тип",
    house_fias_id AS "Дом - ID ФИАС",
    house_fias_guid AS "Дом - GUID ФИАС",

    apartment_num AS "Квартира - номер",
    apartment_type AS "Квартира - тип", 
    apartment_fias_id AS "Квартира - ID ФИАС",
    apartment_fias_guid AS "Квартира - GUID ФИАС",

    response_source AS "Источник данных",
    confidence AS "Уверенность в результате"

FROM address.results
WHERE session_id = ${sessionId}
ORDER BY session_npp ASC, id ASC;


-- SELECT
--     id,
--     session_id AS "sessionId",
--     created_at AS "createdAt",
--     updated_at AS "updatedAt",
--     is_error AS "isError",
--     is_done AS "isDone",
--     session_npp AS "sessionNpp",
--     original_address AS "originalAddress",
--     response_source AS "responseSource",
	
--     unom,
--     full_address AS "fullAddress",
--     postal,
--     cad_num AS "cadNum",

--     fias_id AS "fiasId",
--     fias_guid AS "fiasGuid",
--     fias_path AS "fiasPath",
--     fias_level AS "fiasLevel",
--     fias_is_active AS "fiasIsActive",

--     street_name AS "streetName",
--     street_level AS "streetLevel",
--     street_type AS "streetType",
--     street_fias_id AS "streetFiasId",
--     street_fias_guid AS "streetFiasGuid",
--     street_kladr AS "streetKladr",

--     house_num AS "houseNum",
--     house_type AS "houseType",
--     house_fias_id AS "houseFiasId",
--     house_fias_guid AS "houseFiasGuid",

--     apartment_num AS "apartmentNum",
--     apartment_type AS "apartmentType",
--     apartment_fias_id AS "apartmentFiasId",
--     apartment_fias_guid AS "apartmentFiasGuid"
-- FROM address.results
-- WHERE session_id = ${sessionId};