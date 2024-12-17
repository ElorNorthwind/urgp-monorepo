WITH history_data AS (
	SELECT DISTINCT o.id, p.*
	FROM control.operations o
	JOIN LATERAL jsonb_to_recordset(o.payload) AS  
	  p("num" text, 
		"type" integer, 
		"approver" integer,
		"doneDate" date, 
		"approveBy" integer,
		"isDeleted" boolean, 
		"updatedAt" timestamp with time zone,
		"updatedBy" integer, 
		"approveDate" timestamp with time zone,
		"description" varchar, 
		"approveNotes" text,
		"approveStatus" varchar) 
	ON true
	WHERE o.id = ${id}
)
SELECT 
	h."id",
	h."num",
	h."doneDate",
	h."isDeleted",
	h."updatedAt",
	h."approveDate",
	h."description",
	h."approveNotes",
	h."approveStatus",
	to_jsonb(t) as "type",
	json_build_object('id', u.id, 'fio', u.fio) as "updatedBy",
	json_build_object('id', u2.id, 'fio', u2.fio) as "approver"
FROM history_data h
LEFT JOIN (SELECT id, name, category, fullname, priority FROM control.operation_types) t ON t.id = (h.type)::integer
LEFT JOIN renovation.users u ON u.id = h."updatedBy"
LEFT JOIN renovation.users u2 ON u2.id = COALESCE(h."approveBy", h."approver")
ORDER BY h."updatedAt" ASC;