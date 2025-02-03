INSERT INTO control.cases_ (
    class,
    type_id,
    author_id,
    -- updated_by_id,
    approve_from_id,
    approve_to_id,
    approve_status,
    approve_date,
    approve_notes,
    external_cases,
    direction_ids,
    title,
    notes,
    extra
)
VALUES (
    ${class},
    ${typeId},
    ${authorId},
    -- ${updatedById},
    ${approveFromId},
    ${approveToId},
    ${approveStatus},
    ${approveDate},
    ${approveNotes},
    ${externalCases:json}::jsonb
    -- ${externalCases:raw},
    ${directionIds:list},
    ${title},
    ${notes},
    ${extra}
)
RETURNING id;