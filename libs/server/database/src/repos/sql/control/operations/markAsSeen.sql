UPDATE control.operations_ 
SET 
    updated_by_id = ${updatedById}, -- not really needed
    updated_at = NOW()
WHERE ${conditions:raw}
RETURNING id;