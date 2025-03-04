UPDATE address.results AS r
    SET unom = a.unom
FROM address.address_registry AS a
    WHERE r.house_fias_guid = a.n_fias
      AND r.session_id = ${sessionId}
      AND r.unom IS NULL;