INSERT INTO renovation.apartments_new (unom, unkv, cad_num, adress)
SELECT DISTINCT ON (o.unom_unkv[1], o.unom_unkv[2])
	o.unom_unkv[1] as unom,
	o.unom_unkv[2]::int as unkv,
	o.cad_num,
	'Квартира не в ресурсе ДГИ'
FROM
(
    SELECT string_to_array(unnest(address_list), '_')::bigint[] as unom_unkv, 
	unnest(cad_num_list) as cad_num,
	*
    FROM public.order_decisions
) o
LEFT JOIN renovation.apartments_new an ON an.unom = o.unom_unkv[1] AND an.unkv = o.unom_unkv[2]
WHERE an.id IS NULL
ORDER BY o.unom_unkv[1], o.unom_unkv[2];