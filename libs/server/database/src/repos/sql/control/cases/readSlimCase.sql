SELECT
	id,
	class,
	type_id as "typeId",
	author_id as "authorId",
	updated_by_id as "updatedById",
	approve_from_id as "approveFromId",
	approve_to_id as "approveToId",
	approve_status as "approveStatus",
	approve_date as "approveDate",
	approve_notes as "approveNotes",
	created_at as "createdAt",
	updated_at as "updatedAt",
	external_cases as "externalCases",
	direction_ids::integer[] as "directionIds",
	title,
	notes,
	extra,
revision
FROM control.cases_ c
WHERE archive_date IS NULL
${conditions:raw};