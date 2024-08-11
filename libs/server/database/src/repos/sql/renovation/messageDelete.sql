UPDATE renovation.messages
SET is_deleted = true
WHERE id = ${id}
RETURNING is_deleted AS "isDeleted";