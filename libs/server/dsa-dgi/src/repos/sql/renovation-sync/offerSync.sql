WITH connections AS (
    SELECT 
        ofr.offer_id,
        ofr.affair_id,
        jsonb_object_keys(ofr.new_aparts)::bigint as new_apart_id, 
        ofr.order_id_unnested as order_id,
        ofr.status_id,
        ofr.outgoing_offer_number,
        ofr.outcoming_date,
        ofr.offer_date,
        ofr.updated_at::date
    FROM (SELECT UNNEST(COALESCE(order_ids, ARRAY[null]::integer[])) as order_id_unnested, * FROM public.offer) ofr
)
INSERT INTO renovation.apartment_connections (old_apart_id, new_apart_id, inspection_date, inspection_response, inspection_response_date, inspection_response_input_date)
SELECT DISTINCT ON(c.affair_id, c.new_apart_id) 
    oa.id as old_apart_id,
    na.id as new_apart_id,
    COALESCE(c.offer_date, c.outcoming_date) as inspection_date,
    s.status as inspection_response,
    c.updated_at as inspection_response_date,
    c.updated_at as inspection_response_input_date
FROM connections c
LEFT JOIN public.status s ON s.status_id = c.status_id
LEFT JOIN renovation.apartments_new na ON na.rsm_new_id = c.new_apart_id
LEFT JOIN renovation.apartments_old oa ON oa.affair_id = c.affair_id
WHERE c.status_id = ANY(ARRAY[1,2]) AND na.id IS NOT NULL AND oa.id IS NOT NULL
ORDER BY c.affair_id, c.new_apart_id

ON CONFLICT (old_apart_id, new_apart_id) DO UPDATE
SET 
    inspection_date = COALESCE(renovation.apartment_connections.inspection_date, excluded.inspection_date),
    inspection_response = excluded.inspection_response,
    inspection_response_date = COALESCE(renovation.apartment_connections.inspection_response_date, excluded.inspection_response_date), 
    inspection_response_input_date = COALESCE(renovation.apartment_connections.inspection_response_input_date, excluded.inspection_response_input_date);
-- WHERE (
--         renovation.apartment_connections.inspection_date,
--         renovation.apartment_connections.inspection_response,
--         renovation.apartment_connections.inspection_response_date,
--         renovation.apartment_connections.inspection_response_input_date
--     )
--         <>
--     (
--         excluded.inspection_date,
--         excluded.inspection_response,
--         excluded.inspection_response_date,
--         excluded.inspection_response_input_date
--     );