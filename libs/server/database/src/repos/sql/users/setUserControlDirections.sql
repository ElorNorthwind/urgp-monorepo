UPDATE renovation.users
SET control_settings = control_settings 
 || jsonb_build_object('directions', jsonb_build_array(${directions:list}))
WHERE id = ${id} 
RETURNING control_settings;