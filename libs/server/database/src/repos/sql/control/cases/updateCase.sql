UPDATE control.cases_
SET
    -- class = ${class},
    type_id = ${typeId},
    -- author_id = ${authorId},
    updated_by_id = ${updatedById},

    approve_from_id = ${updatedById}, -- approve_from_id = ${approveFromId},
    approve_to_id = ${approveToId},
    approve_status = ${approveStatus},
    approve_date = ${approveDate},
    approve_notes = ${approveNotes},

    external_cases = ${externalCases},
    direction_ids = ${directionIds},
    title = ${title},
    notes = ${notes},
    extra = ${extra},
    -- archive_date = ${archiveDate},
    updated_at = NOW()
WHERE id = ${id}
RETURNING id