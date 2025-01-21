UPDATE renovation.users 
SET control_settings =
    jsonb_set(control_settings, '{casesFilter}', ${filter:json}::jsonb)
WHERE id = ${id}
RETURNING control_settings as data;