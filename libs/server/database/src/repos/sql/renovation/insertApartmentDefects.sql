WITH values(unom, apart_num, complaint_date, entry_date, changed_done_date, actual_done_date, is_done, description, url)
AS (
VALUES
	$1:raw
)
UPDATE renovation.apartments_new a
SET 
	defect_complaint_date = v.complaint_date,
	defect_entry_date = v.entry_date,
	defect_changed_done_date = v.changed_done_date,
	defect_actual_done_date = v.actual_done_date,
	defect_is_done = v.is_done,
	defect_description = v.description,
	defect_url = v.url
FROM (
	SELECT DISTINCT ON(unom, apart_num) *
	FROM values
	ORDER BY unom, apart_num, complaint_date DESC, entry_date DESC
) v
WHERE a.unom = v.unom 
  AND a.apart_num = v.apart_num 
  AND v.complaint_date >= COALESCE(a.defect_complaint_date, '-infinity') 
  AND v.entry_date >= COALESCE(a.defect_entry_date, '-infinity');