WITH unoms AS (
	SELECT r.id, COALESCE(a.unom, o.unom) as unom
	FROM address.results AS r
	LEFT JOIN  address.address_registry AS a ON r.house_fias_guid = a.n_fias
	LEFT JOIN address.oks_unoms AS o ON r.house_cad_num = o.cad_num
	WHERE r.session_id = ${sessionId} AND r.unom IS NULL AND r.is_done IS true AND r.is_error IS DISTINCT FROM true
)

UPDATE address.results AS r
   SET unom = u.unom
  FROM unoms AS u
 WHERE u.id = r.id;