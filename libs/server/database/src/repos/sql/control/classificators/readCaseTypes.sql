SELECT 
	id as value, 
	name as label, 
	fullname,
	jsonb_build_array(LOWER(fullname), LOWER(category)) as tags
FROM control.case_types;