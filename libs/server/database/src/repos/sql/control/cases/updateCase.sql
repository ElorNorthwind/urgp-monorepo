UPDATE control.cases_ 
SET
    type_id = ${typeId},
    updated_by_id = ${updatedById},

    approve_from_id = ${updatedById},
    approve_to_id = ${approveToId},
    approve_status = ${approveStatus},
    approve_date = ${approveDate},
    approve_notes = ${approveNotes},

    external_cases = ${externalCases:json}::jsonb,
    direction_ids = ${directionIds}::integer[],
    title = ${title},
    notes = ${notes},
    extra = ${extra},
    updated_at = NOW()
WHERE id = ${id}
RETURNING id::integer;