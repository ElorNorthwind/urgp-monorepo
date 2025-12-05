INSERT INTO renovation.apartment_connections (old_apart_id, new_apart_id, contract_status, contract_date, contract_num, contract_creation_date, contract_notification_date, contract_notification_num)
SELECT DISTINCT ON (ao.id, an.id)
    ao.id as old_apart_id,
    an.id as new_apart_id,
    c.contract_status as contract_status,
    c.contract_date as contract_date,
	c.contract_number as contract_num,
    c.contract_date_created as contract_creation_date,
    CASE WHEN c.appids IS NOT NULL THEN c.contract_date_created ELSE NULL END as contract_notification_date,
    CASE WHEN c.appids IS NOT NULL THEN ARRAY_TO_STRING(c.appids, '; ') ELSE NULL END as contract_notification_num
FROM public.contracts c 
LEFT JOIN public.new_apart a ON c.area_id = a.rsm_apart_id
                             OR (a.unom = c.new_apart_unom AND a.un_kv = c.new_apart_unkv)
                             OR (a.cad_num = c.new_apart_cad_num)
LEFT JOIN renovation.apartments_new an ON a.new_apart_id = an.rsm_new_id
LEFT JOIN renovation.apartments_old ao ON ao.affair_id = c.affair_id
WHERE ao.id IS NOT NULL AND an.id IS NOT NULL
ORDER BY ao.id, an.id, c.contract_date_created DESC
ON CONFLICT (old_apart_id, new_apart_id) DO UPDATE
SET
    contract_status = excluded.contract_status,
    contract_date = excluded.contract_date,
    contract_num = excluded.contract_num,
    contract_creation_date = excluded.contract_creation_date,
    contract_notification_date = excluded.contract_notification_date,
    contract_notification_num = excluded.contract_notification_num;
-- WHERE (
--         renovation.apartment_connections.contract_status,
--         renovation.apartment_connections.contract_date,
--         renovation.apartment_connections.contract_num,
--         renovation.apartment_connections.contract_creation_date,
--         renovation.apartment_connections.contract_notification_date,
--         renovation.apartment_connections.contract_notification_num
--     )
--         <>
--     (
--         excluded.contract_status,
--         excluded.contract_date,
--         excluded.contract_num,
--         excluded.contract_creation_date,
--         excluded.contract_notification_date,
--         excluded.contract_notification_num
--     );





