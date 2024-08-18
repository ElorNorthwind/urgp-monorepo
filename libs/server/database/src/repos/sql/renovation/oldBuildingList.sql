SELECT b.id as value, b.adress as label
FROM renovation.buildings_old b
LEFT JOIN (SELECT building_id, COUNT(*) as apartments FROM renovation.apartments_old_temp GROUP BY building_Id) a ON a.building_id = b.id
WHERE a.apartments > 0;