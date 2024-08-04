UPDATE renovation.users
   SET refresh_token_version = refresh_token_version + 1
WHERE id = ${id}
RETURNING refresh_token_version AS "tokenVersion";