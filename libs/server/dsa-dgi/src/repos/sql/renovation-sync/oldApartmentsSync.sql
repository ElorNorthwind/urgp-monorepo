INSERT INTO renovation.apartments_old (
    id, 
    building_id, 
    affair_id, 
    cad_num, 
    apart_num,
    apart_type,
    floor,
    area_obsh,
    room_count,
    fio,
    people_count,
    old_apart_status,
    kpu_num,
    notes,
    area_zhil,
    area_zhp,
    kpu_close_reason
)

SELECT 
    a.affair_id as id,
    a.unom as building_id,
    a.affair_id as affair_id,
    -- '!FIND_ME!' as unkv,
    a.cad_num as cad_num,
    a.apart_number as apart_num,
    a.apart_type as apart_type,
    a.floor as floor,
    a.total_living_area as area_obsh,
    a.room_count as room_count,
    a.fio as fio,
    a.people_in_family as people_count,
    -- '!FIND_ME!' as requirement,
    a.type_of_settlement as old_apart_status,
    a.kpu_number as kpu_num,
    ARRAY_TO_STRING(ARRAY_REMOVE(ARRAY[a.notes, a.rsm_notes], null), '; ') as notes,
    a.living_area as area_zhil,
    a.full_living_area as area_zhp,
    a.removal_reason as kpu_close_reason
FROM public.old_apart a
WHERE a.unom IN (SELECT id FROM renovation.buildings_old)
ON CONFLICT (id) DO UPDATE
    SET     
    building_id = excluded.building_id, 
    affair_id = excluded.affair_id, 
    cad_num = excluded.cad_num, 
    apart_num = excluded.apart_num,
    apart_type = excluded.apart_type,
    floor = excluded.floor,
    area_obsh = excluded.area_obsh,
    room_count = excluded.room_count,
    fio = excluded.fio,
    people_count = excluded.people_count,
    old_apart_status = excluded.old_apart_status,
    kpu_num = excluded.kpu_num,
    notes = excluded.notes,
    area_zhil = excluded.area_zhil,
    area_zhp = excluded.area_zhp,
    kpu_close_reason = excluded.kpu_close_reason
WHERE     
(
    renovation.apartments_old.building_id, 
    renovation.apartments_old.affair_id, 
    renovation.apartments_old.cad_num, 
    renovation.apartments_old.apart_num,
    renovation.apartments_old.apart_type,
    renovation.apartments_old.floor,
    renovation.apartments_old.area_obsh,
    renovation.apartments_old.room_count,
    renovation.apartments_old.fio,
    renovation.apartments_old.people_count,
    renovation.apartments_old.old_apart_status,
    renovation.apartments_old.kpu_num,
    renovation.apartments_old.notes,
    renovation.apartments_old.area_zhil,
    renovation.apartments_old.area_zhp,
    renovation.apartments_old.kpu_close_reason
) 
    <> 
(
    excluded.building_id, 
    excluded.affair_id, 
    excluded.cad_num, 
    excluded.apart_num,
    excluded.apart_type,
    excluded.floor,
    excluded.area_obsh,
    excluded.room_count,
    excluded.fio,
    excluded.people_count,
    excluded.old_apart_status,
    excluded.kpu_num,
    excluded.notes,
    excluded.area_zhil,
    excluded.area_zhp,
    excluded.kpu_close_reason
) ;