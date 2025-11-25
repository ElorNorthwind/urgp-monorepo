SELECT  
	a.id,
	b.okrug, 
	b.district,
	a.fio,
	b.adress, 
	a.apart_num as num,
	a.apart_type as type, 
	a.area_zhil as "areaZhil",
	a.area_obsh as "areaObsh", 
	a.old_apart_status as status,
	a.kpu_num as kpu, 
	a.new_aparts as newAparts,
	a.classificator
FROM renovation.apartments_old a
LEFT JOIN renovation.buildings_old b ON a.building_id = b.id
WHERE a.id = ${id};