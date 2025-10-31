${insert:raw}
ON CONFLICT (id)
DO UPDATE SET
    name = excluded.name,
    on_territory_of_moscow = excluded.on_territory_of_moscow,
    adm_area = excluded.adm_area,
    district = excluded.district,
    vestibule_type = excluded.vestibule_type,
    name_of_station = excluded.name_of_station,
    line = excluded.line,
    cultural_heritage_site_status = excluded.cultural_heritage_site_status,
    object_status = excluded.object_status,
    geo_data = excluded.geo_data,
    station_type = excluded.station_type;