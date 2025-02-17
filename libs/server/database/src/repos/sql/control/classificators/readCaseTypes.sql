SELECT     
	'Частные проблемы' as value,
    'Частные проблемы' as label,    
	JSONB_AGG(jsonb_build_object(
		'value', id,        
		'label', name,
        'fullname', fullname,
		'tags', jsonb_build_array(LOWER(fullname), LOWER(category)),
		'category', category
	)) as items
FROM control.case_types
WHERE category = 'control-incident';

-- SELECT 
-- 	id as value, 
-- 	name as label, 
-- 	fullname,
-- 	jsonb_build_array(LOWER(fullname), LOWER(category)) as tags
-- FROM control.case_types;