INSERT INTO renovation.apartment_connections (old_apart_id, new_apart_id, order_date, order_series, order_num, order_reason, rd_num, rd_date)
SELECT DISTINCT ON (ao.id, an.id)
    ao.id as old_apart_id, 
    an.id as new_apart_id, 
    CASE WHEN o.is_cancelled THEN null::date ELSE o.order_date END as order_date,
    CASE WHEN o.is_cancelled THEN null::varchar ELSE o.collateral_type END as order_series,
    CASE WHEN o.is_cancelled THEN null::text ELSE substring(o.order_number_full, '^(\d+)') END as order_num,
    CASE WHEN o.is_cancelled THEN null::text ELSE substring(o.accounting_article, '(?<=\s)(.*)') END as order_reason,
    CASE WHEN o.is_cancelled THEN null::varchar ELSE o.decision_number END as rd_num,
    CASE WHEN o.is_cancelled THEN null::date ELSE o.decision_date END as rd_date
FROM
(
    SELECT string_to_array(unnest(address_list), '_')::bigint[] as unom_unkv, *
    FROM public.order_decisions
) o
LEFT JOIN renovation.apartments_new an ON an.unom = o.unom_unkv[1] AND an.unkv = o.unom_unkv[2]
LEFT JOIN renovation.apartments_old ao ON ao.affair_id = o.affair_id
WHERE an.id IS NOT NULL 
  AND ao.id IS NOT NULL
ORDER BY ao.id, an.id, o.is_cancelled DESC, o.order_draft_date DESC
ON CONFLICT (old_apart_id, new_apart_id) DO UPDATE
SET 
    order_date = excluded.order_date,
    order_series = excluded.order_series,
    order_num = excluded.order_num,
    order_reason = excluded.order_reason,
    rd_num = excluded.rd_num,
    rd_date = excluded.rd_date;
-- WHERE (
--         renovation.apartment_connections.order_date,
--         renovation.apartment_connections.order_series,
--         renovation.apartment_connections.order_num,
--         renovation.apartment_connections.order_reason,
--         renovation.apartment_connections.rd_num,
--         renovation.apartment_connections.rd_date
--     )
--         <>
--     (
--         excluded.order_date,
--         excluded.order_series,
--         excluded.order_num,
--         excluded.order_reason,
--         excluded.rd_num,
--         excluded.rd_date
--     );