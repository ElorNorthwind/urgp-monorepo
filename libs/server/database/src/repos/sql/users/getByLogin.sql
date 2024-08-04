SELECT
	id,
	login,
	fio,
	password,
	refresh_token_version as "tokenVersion",
	roles
FROM renovation.users
WHERE login = ${login}