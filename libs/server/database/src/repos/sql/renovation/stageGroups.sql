SELECT 
    group_name as value,
    group_name as label,
    JSONB_AGG(jsonb_build_object(
        'value', id,
        'label', name
    )) as items
FROM renovation.apartment_stages
WHERE is_manual = true
GROUP BY group_name;