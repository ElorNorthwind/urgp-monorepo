SELECT
    id,
    session_id AS "sessionId",
    created_at AS "createdAt",
    updated_at AS "updatedAt",
    is_error AS "isError",
    is_done AS "isDone",
    session_npp AS "sessionNpp",
    original_address AS "originalAddress",
    response_source AS "responseSource",
	
    unom,
    full_address AS "fullAddress",
    postal,
    cad_num AS "cadNum",

    fias_id AS "fiasId",
    fias_guid AS "fiasGuid",
    fias_path AS "fiasPath",
    fias_level AS "fiasLevel",
    fias_is_active AS "fiasIsActive",

    street_name AS "streetName",
    street_level AS "streetLevel",
    street_type AS "streetType",
    street_fias_id AS "streetFiasId",
    street_fias_guid AS "streetFiasGuid",
    street_kladr AS "streetKladr",

    house_num AS "houseNum",
    house_type AS "houseType",
    house_fias_id AS "houseFiasId",
    house_fias_guid AS "houseFiasGuid",

    apartment_num AS "apartmentNum",
    apartment_type AS "apartmentType",
    apartment_fias_id AS "apartmentFiasId",
    apartment_fias_guid AS "apartmentFiasGuid"
FROM address.results
WHERE session_id = ${sessionId};