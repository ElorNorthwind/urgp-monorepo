SELECT
	id,
	login,
	fio,
	password,
	salt,
	refresh_token_version as "tokenVersion",
	roles
FROM renovation.users
WHERE login = ${login}