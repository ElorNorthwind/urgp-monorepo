WITH 
    values(from_id, to_id) AS 
        (
            SELECT UNNEST(ARRAY[${fromIds:list}]::integer[]), ${toId}
        )
    , delete_extra_from AS 
        (
            DELETE
            FROM control.case_connections
            WHERE to_id = ${toId} AND NOT (from_id = ANY(ARRAY[${fromIds:list}]::integer[]))
        )

INSERT INTO control.case_connections (from_id, to_id, class, author_id, notes)
(SELECT from_id, to_id, 'incident-to-problem', ${userId}, 'Связь инцидента с системной проблемой' FROM values)

ON CONFLICT ON CONSTRAINT unique_connection DO UPDATE
SET (updated_at, updated_by_id) = (NOW(), ${userId})
RETURNING id;