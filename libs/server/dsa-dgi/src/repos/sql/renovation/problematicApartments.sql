SELECT 
    building_id,
    jsonb_agg(
        json_build_object(
            'id', id, 
            'apartNum', apart_num, 
            'fio', fio, 
            'apartStatus', old_apart_status, 
            'newAdress', new_aparts, 
            'stageId', (classificator->>'stageId')::int, 
            'stage', classificator->>'stageName', 
            'action', classificator->>'action', 
            'problems', classificator->>'problems', 
            'deviation', classificator->>'deviation', 
            'stages', stages_dates,
            'messages', messages)
        ORDER BY  apart_npp)
        FILTER (WHERE (classificator->>'deviation')::text = ANY (ARRAY['Требует внимания'::text, 'Риск'::text]) 
    ) AS "problematicAparts" 
FROM (SELECT 
        ap.id, 
        ap.building_id, 
        ap.apart_num, 
        ap.fio, 
        ap.old_apart_status, 
        ap.new_aparts, 
        ap.stages_dates, 
        ap.classificator,
        m.messages,
        ROW_NUMBER() OVER (PARTITION BY ap.building_id ORDER BY ap.building_id, CAST(substring(ap.apart_num, '\d+') AS integer), ap.fio) as apart_npp 
    FROM renovation.apartments_old ap
    LEFT JOIN (
        SELECT
            m.apartment_id,
            array_agg(
                jsonb_build_object(
                    'id', m.id,
                    'createdAt', m.created_at,
                    'updatedAt', m.updated_at,
                    'needsAnswer', m.needs_answer,
                    'answerDate', m.answer_date,
                    'authorId', m.author_id,
                    'authorFio', u.fio,
                    'isBoss', CASE WHEN 'boss' = ANY(roles) THEN true ELSE false END,
                    'messageContent', m.message_content,
                    'validUntil', m.valid_until
                    -- message_payload->-1->>'text', m.message_content
                )
				ORDER BY apartment_id, created_at ASC
            ) as messages
        FROM renovation.messages m
        LEFT JOIN renovation.users u ON u.id = m.author_id
        WHERE (message_payload->-1->>'deleted')::boolean IS DISTINCT FROM true AND m.message_type = 'comment'
	
        GROUP BY m.apartment_id
        ) m ON m.apartment_id = ap.id
    ) a
WHERE building_id = ${id}
GROUP BY building_id;