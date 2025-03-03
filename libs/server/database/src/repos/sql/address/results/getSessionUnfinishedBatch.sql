SELECT id, session_id as sessionId, original_address as address
FROM address.results
WHERE session_id = ${sessionId}
AND is_done IS DISTINCT FROM true
LIMIT ${limit};