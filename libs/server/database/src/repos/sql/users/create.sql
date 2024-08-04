INSERT INTO renovation.users AS U
(login, password, fio) VALUES
(${login}, ${password}, ${fio})
RETURNING 
	id,
	login,
	fio,
	password,
	refresh_token_version as "tokenVersion",
	roles;