UPDATE address.results
	SET is_error = false,
	    is_done = false,
		response_source = null,
		confidence = null,
		response = null
WHERE is_error = true OR confidence = 'low'
  AND session_id = ${id};