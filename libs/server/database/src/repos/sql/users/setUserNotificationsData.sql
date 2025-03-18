UPDATE renovation.users 
SET control_settings =
    jsonb_set(control_settings, '{notifications}', ${notifications:json}::jsonb)
WHERE id = ${userId}
RETURNING control_settings as data;