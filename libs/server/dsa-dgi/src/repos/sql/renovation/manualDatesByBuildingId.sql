SELECT 
    d.id, 
    d.building_id as "buildingId", 
    t.type, 
    t.priority, 
    d.control_date as "controlDate",
    d.created_at as "createdAt", 
    d.documents, 
    d.notes
FROM renovation.dates_buildings_old d
LEFT JOIN renovation.dates_buildings_old_types t ON t.id = d.date_type
WHERE is_manual = true AND d.building_id = ${buildingId};