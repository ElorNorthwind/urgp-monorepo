SELECT
	id,
	login,
	fio,
	password,
	refresh_token_version as "tokenVersion",
	roles,
	control_data as "controlData"
FROM renovation.users
WHERE id = ${id}