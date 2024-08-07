SELECT  
	old_apart_id as id,
	okrug, 
	district,
	fio,
	adress, 
	apart_num as num,
	apart_type as type, 
	area_zhil as "areaZhil",
	area_obsh as "areaObsh", 
	old_apart_status as status,
	kpu_num as kpu, 
	new_aparts as newAparts,
	classificator
FROM renovation.apartments_full
WHERE old_apart_id = ${id}