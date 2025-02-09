UPDATE control.operations_ 
SET 
    -- case_id = ${caseId}, 
    -- class = ${classType}, 
    type_id = ${typeId}, 
    -- author_id = ${authorId}, 
    updated_by_id = ${updatedById}, 

    approve_from_id = ${updatedById}, -- approve_from_id = ${approveFromId}, 
    approve_to_id = ${approveToId}, 
    approve_status = ${approveStatus}, 
    approve_date = ${approveDate}, 
    approve_notes = ${approveNotes}, 

    -- created_at = ${createdAt}, 
    updated_at = NOW(), 
    due_date = ${dueDate}, 
    done_date = ${doneDate}, 
    control_from_id = ${controlFromId},
    control_to_id = ${controlToId}, 
    title = ${title}, 
    notes = ${notes}, 
    extra = ${extra}
    -- archive_date = ${archiveDate} 
WHERE id = ${id} 
RETURNING id;