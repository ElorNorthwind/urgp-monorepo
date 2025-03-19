SELECT id 
FROM renovation.users 
WHERE telegram_chat_id IS NOT NULL
    AND control_settings->'notifications'->>'period' = $1;