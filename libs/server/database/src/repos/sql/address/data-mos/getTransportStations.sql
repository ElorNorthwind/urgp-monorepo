SELECT
	id,
	name,
	on_territory_of_moscow,
	adm_area,
	district,
	vestibule_type,
	name_of_station,
	line,
	cultural_heritage_site_status,
	object_status,
	ST_AsGeoJSON(geo_data) as geo_data,
	station_type,
	updated_at
FROM address.transport_stations;