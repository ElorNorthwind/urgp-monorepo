UPDATE control.operations_ 
SET 
    updated_by_id = ${updatedById}, -- not really needed
    updated_at = NOW(),
    done_date = NOW(),
    revision = revision + 1
WHERE ${conditions:raw}
RETURNING id;