WITH buildings_full AS (
		SELECT
			b.id,
			c.id as "complexId",
			c.name as "complexName",
			c.developer,
            c.developer_short as "developerShort",
            b.is_done as "isDone",
			b.unom,
			b.cad_num as "cadNum",
			b.address_short as "addressShort",
			b.address_full as "addressFull",
			b.address_construction as "addressConstruction"
		FROM equity.buildings b
		LEFT JOIN equity.complexes c ON b.complex_id = c.id
)

SELECT 
	to_jsonb(b) as building,
	to_jsonb(ot) as "objectType", 
	to_jsonb(st) as status,
	COUNT(*)::int as total
FROM equity.objects_full_view v
	LEFT JOIN buildings_full b ON b.id = v."buildingId"
	LEFT JOIN equity.object_types ot ON ot.id = v."objectTypeId"
	LEFT JOIN equity.object_status_types st ON st.id = v."statusId"
GROUP BY to_jsonb(b), v."objectTypeId", to_jsonb(ot), v."statusId", to_jsonb(st)
ORDER BY v."objectTypeId", v."statusId";