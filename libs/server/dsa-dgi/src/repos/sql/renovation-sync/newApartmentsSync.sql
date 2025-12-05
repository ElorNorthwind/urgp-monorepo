INSERT INTO renovation.apartments_new
(
	rsm_new_id,
    rsm_object_id,
    building_id,
    unom,
    adress,
    apart_num,
    room_count,
    area_obsh,
    unkv,
    notes,
    area_zhil,
    area_zhp,
    cad_num
)
SELECT 
	DISTINCT ON (a.unom, a.apart_number)
	a.new_apart_id,
    a.rsm_apart_id,
    a.unom as building_id,
    a.unom as unom,
    a.house_address as adress,
    a.apart_number as apart_num,
    a.room_count as room_count,
    a.living_area as area_obsh,
    a.un_kv as unkv,
    a.owner as notes,
    a.living_area as area_zhil,
    a.full_living_area as area_zhp,
    a.cad_num as cad_num
FROM public.new_apart a
ORDER BY a.unom, a.apart_number, a.rsm_apart_id DESC
ON CONFLICT (rsm_new_id) DO UPDATE
SET 
	rsm_object_id = excluded.rsm_object_id,
    building_id = excluded.building_id,
    unom = excluded.unom,
    adress = excluded.adress,
    apart_num = excluded.apart_num,
    room_count = excluded.room_count,
    area_obsh = excluded.area_obsh,
    unkv = excluded.unkv,
    notes = excluded.notes,
    area_zhil = excluded.area_zhil,
    area_zhp = excluded.area_zhp,
    cad_num = excluded.cad_num;
-- WHERE 
-- (
-- 	renovation.apartments_new.rsm_object_id,
--     renovation.apartments_new.building_id,
--     renovation.apartments_new.unom,
--     renovation.apartments_new.adress,
--     renovation.apartments_new.apart_num,
--     renovation.apartments_new.room_count,
--     renovation.apartments_new.area_obsh,
--     renovation.apartments_new.unkv,
--     renovation.apartments_new.notes,
--     renovation.apartments_new.area_zhil,
--     renovation.apartments_new.area_zhp,
--     renovation.apartments_new.cad_num
-- )
--     <>
-- (
-- 	excluded.rsm_object_id,
--     excluded.building_id,
--     excluded.unom,
--     excluded.adress,
--     excluded.apart_num,
--     excluded.room_count,
--     excluded.area_obsh,
--     excluded.unkv,
--     excluded.notes,
--     excluded.area_zhil,
--     excluded.area_zhp,
--     excluded.cad_num
-- );