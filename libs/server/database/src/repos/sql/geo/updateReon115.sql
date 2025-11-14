BEGIN;

-- запрос на переливку данных семантики и основного полигона (долгий)
INSERT INTO reon_local.layer155 (id, egkoid, state, address, type, name, vid, geo_data, moddate) 
SELECT 
    objectid::bigint,
    egkoid::bigint,
    state,
    address,
    type,
    name,
    vid,
    polygon_5::geometry,
    moddate
FROM reon.layer155
    WHERE parentid IS NULL 
 -- AND id BETWEEN 0 AND 100000 -- Если запрашивать кусками, указываем диапазон (всего чуть больше 820 000 записей)
 -- ORDER BY id -- Если запрашивать кусками лучше дать явную сортировку
ON CONFLICT (id) DO UPDATE SET
    egkoid = EXCLUDED.egkoid,
    state = EXCLUDED.state,
    address = EXCLUDED.address,
    type = EXCLUDED.type,
    name = EXCLUDED.name,
    vid = EXCLUDED.vid,
    geo_data = EXCLUDED.geo_data,
    moddate = EXCLUDED.moddate
WHERE layer155.moddate <> EXCLUDED.moddate; -- чтобы не переписывать точно не обновленные записи

-- Запрос на добавление вырезорв и мультиполигонов (быстрый)
UPDATE reon_local.layer155 l
	SET geo_data = ST_Collect(ARRAY[l.geo_data] || e.geometries)
FROM (
	SELECT 
		extra.objectid::bigint,
		ARRAY_AGG(extra.polygon_5::geometry) as geometries
	FROM reon.layer155 extra
	WHERE extra.parentid IS NOT NULL
	GROUP BY extra.objectid::bigint) e
WHERE e.objectid = l.id;

COMMIT;