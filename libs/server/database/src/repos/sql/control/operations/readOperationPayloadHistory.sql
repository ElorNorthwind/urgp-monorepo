WITH history_data AS (
	SELECT DISTINCT o.id, o.class, o.case_id as "caseId", p.*
	FROM control.operations o
	JOIN LATERAL jsonb_to_recordset(o.payload) AS  
	  p("num" text, 
		"typeId" integer, 
		"approverId" integer,
		"doneDate" date, 
		"approveById" integer,
		"isDeleted" boolean, 
		"updatedAt" timestamp with time zone,
		"updatedById" integer, 
		"approveDate" timestamp with time zone,
		"description" varchar, 
		"approveNotes" text,
		"approveStatus" varchar) 
	ON true
	WHERE o.id = ${id}
)
SELECT 
	h."id",
	h."class",
	h."caseId",
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
	json_build_object('id', u2.id, 'fio', u2.fio) as "approver",
	json_build_object('id', u3.id, 'fio', u3.fio) as "approveBy"
FROM history_data h
LEFT JOIN (SELECT id, name, category, fullname, priority FROM control.operation_types) t ON t.id = (h."typeId")::integer
LEFT JOIN renovation.users u ON u.id = h."updatedById"
LEFT JOIN renovation.users u2 ON u2.id = h."approverId"
LEFT JOIN renovation.users u3 ON u3.id = h."approveById"
ORDER BY h."updatedAt" ASC;