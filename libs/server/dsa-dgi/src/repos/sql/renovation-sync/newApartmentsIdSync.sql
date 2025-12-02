UPDATE renovation.apartments_new a
SET rsm_object_id = exp.rsm_apart_id,
    rsm_new_id = exp.new_apart_id,
	unkv = exp.un_kv
FROM (
    SELECT DISTINCT ON (unom, apart_number) 
        unom, 
        apart_number, 
		un_kv,
        rsm_apart_id, 
        new_apart_id 
    FROM public.new_apart 
    ORDER BY unom, apart_number, rsm_apart_id DESC
    ) exp
WHERE a.building_id = exp.unom 
  AND a.apart_num = exp.apart_number::varchar;