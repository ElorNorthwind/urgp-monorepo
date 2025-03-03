UPDATE address.results
	SET is_error = false,
	    is_done = false,
		response_source = null,
		response = null
WHERE is_error = true
  AND session_id = ${id};