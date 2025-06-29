SELECT 
	building,
	"objectType", 
	status,
	COUNT(*)::int as total
FROM equity.objects_full_view
GROUP BY building, "objectType", status
ORDER BY ("objectType"->>'id')::int, (status->>'id')::int;