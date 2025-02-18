WITH 
    values(from_id, to_id) AS 
        (
            SELECT ${fromId}, UNNEST(ARRAY[${toIds:list}]::integer[])

        )
    , delete_extra_to AS 
        (
            DELETE
            FROM control.case_connections
            WHERE from_id = ${fromId} AND NOT (to_id = ANY(ARRAY[${toIds:list}]::integer[]))
        )

INSERT INTO control.case_connections (from_id, to_id, class, author_id, notes)
(SELECT from_id, to_id, 'incident-to-problem', ${userId}, 'Связь инцидента с системной проблемой' FROM values)

ON CONFLICT ON CONSTRAINT unique_connection DO UPDATE
SET (updated_at, updated_by_id) = (NOW(), ${userId})
RETURNING id;