UPDATE address.results AS r
    SET unom = a.unom
FROM address.oks_unoms AS s
    WHERE r.cad_num = s.cad_num
      AND r.session_id = ${sessionId}
      AND r.unom IS NULL;