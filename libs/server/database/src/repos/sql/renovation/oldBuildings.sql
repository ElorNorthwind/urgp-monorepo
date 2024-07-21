WITH old_dates_ranked AS (
	SELECT building_id,
		   date_type,
		   control_date,
		   updated_at,
		   id,
		   rank() OVER (PARTITION BY building_id, date_type ORDER BY updated_at DESC, id) AS rank
	FROM renovation.dates_buildings_old
), old_dates_flat AS (
	SELECT building_id,
           json_build_object(
           'plan', json_build_object(
					'firstResetlementStart', min(control_date) FILTER (WHERE date_type = 5 AND rank = 1),
					'firstResetlementEnd', (min(control_date) FILTER (WHERE date_type = 5 AND rank = 1) + '8 mons'::interval)::date,
					'secontResetlementEnd', (min(control_date) FILTER (WHERE date_type = 5 AND rank = 1) + '9 mons'::interval)::date,
					'demolitionEnd', (min(control_date) FILTER (WHERE date_type = 5 AND rank = 1) + '1 year'::interval)::date),
           'actual', json_build_object(
					'firstResetlementStart', min(control_date) FILTER (WHERE date_type = 1 AND rank = 1),
					'firstResetlementEnd', min(control_date) FILTER (WHERE date_type = 2 AND rank = 1),
					'secontResetlementEnd', min(control_date) FILTER (WHERE date_type = 3 AND rank = 1),
					'demolitionEnd', min(control_date) FILTER (WHERE date_type = 4 AND rank = 1))
           ) as terms,
	CASE 
		WHEN min(control_date) FILTER (WHERE date_type = 1 AND rank = 1) IS NOT NULL THEN NOW() - min(control_date) FILTER (WHERE date_type = 1 AND rank = 1)
		ELSE null
	END as age
	FROM old_dates_ranked
	GROUP BY building_id
), new_dates_ranked AS (
	SELECT building_id,
		   date_type,
		   control_date,
		   updated_at,
		   id,
		   rank() OVER (PARTITION BY building_id, date_type ORDER BY updated_at DESC, id) AS rank
	FROM renovation.dates_buildings_new
), new_dates_flat AS (
	SELECT building_id,
			json_build_object(
				'plan', json_build_object(
						'commissioning', min(control_date) FILTER (WHERE date_type = 3 AND rank = 1),
						'settlement', min(control_date) FILTER (WHERE date_type = 4 AND rank = 1)),
				'actual', json_build_object(
						'commissioning', min(control_date) FILTER (WHERE date_type = 1 AND rank = 1),
						'settlement', min(control_date) FILTER (WHERE date_type = 2 AND rank = 1))
			) as terms
	FROM new_dates_ranked
	GROUP BY building_id
), constructions_ranked AS (
	SELECT c.old_building_id,
           RANK() OVER (PARTITION BY c.old_building_id, c.new_building_id ORDER BY nct.priority DESC, c.updated_at DESC, c.id) as rank,
           json_build_object('id', c.new_building_id, 
                             'adress', nc.adress,
                             'okrug', nc.okrug,
                             'district', nc.district,
                             'terms', d.terms,
                             'type', nct.type,
                             'priority', nct.priority
                             ) as construction,
           nc.adress || ' [' || nct.type || ']' AS construction_adress
	FROM renovation.connection_building_construction c
	LEFT JOIN renovation.buildings_new nc ON nc.id = c.new_building_id
	LEFT JOIN renovation.connection_building_construction_types nct ON nct.id = c.connection_type
	LEFT JOIN new_dates_flat d ON d.building_id = c.new_building_id
	WHERE c.is_cancelled = false
	ORDER BY nc.adress
), movements_ranked AS (
	SELECT m.old_building_id,
           RANK() OVER (PARTITION BY m.old_building_id, m.new_building_id ORDER BY nmt.priority DESC, m.updated_at DESC, m.id) as rank,
           json_build_object('id', m.new_building_id, 
                             'adress', nm.adress,
                             'okrug', nm.okrug,
                             'district', nm.district,
                             'terms', d.terms,
                             'type', nmt.type,
                             'priority', nmt.priority
                             ) as movement,
           nm.adress || ' [' || nmt.type || ']' AS movement_adress
	FROM renovation.connection_building_movement m
	LEFT JOIN renovation.buildings_new nm ON nm.id = m.new_building_id
	LEFT JOIN renovation.connection_building_movement_types nmt ON nmt.id = m.connection_type
	LEFT JOIN new_dates_flat d ON d.building_id = m.new_building_id
	WHERE m.is_cancelled = false
	ORDER BY nm.adress
), appartment_totals AS (
	SELECT 
		old_apart_building_id as building_id,
		COUNT(*) as total,
		-- классификаторы статуса
		COUNT(*) FILTER (WHERE status_id = 1) AS empty,
		COUNT(*) FILTER (WHERE status_id = 3) AS not_started,
		COUNT(*) FILTER (WHERE status_id = 2) AS mfr,
		COUNT(*) FILTER (WHERE status_id = 4) AS inspection,
		COUNT(*) FILTER (WHERE status_id = 5) AS rejected,
		COUNT(*) FILTER (WHERE status_id = 6) AS reinspection,
		COUNT(*) FILTER (WHERE status_id = 7) AS accepted,
		COUNT(*) FILTER (WHERE status_id = 8) AS rd,
		COUNT(*) FILTER (WHERE status_id = 9) AS litigations,
		COUNT(*) FILTER (WHERE status_id = 10) AS litigations_done,
		COUNT(*) FILTER (WHERE status_id = 11) AS contract_project,
		COUNT(*) FILTER (WHERE status_id = 12) AS contract_prelimenary_signing,
		COUNT(*) FILTER (WHERE status_id = 13) AS contract,
		-- классификаторы трудностей
		COUNT(*) FILTER (WHERE difficulty_id = 1) AS difficulty_normal,
		COUNT(*) FILTER (WHERE difficulty_id = 2) AS difficulty_problem,
		COUNT(*) FILTER (WHERE difficulty_id = 3) AS difficulty_rejected,
		COUNT(*) FILTER (WHERE difficulty_id = 4) AS difficulty_litigation,
		COUNT(*) FILTER (WHERE difficulty_id = 5) AS difficulty_mfr,
		-- классификаторы отклонений
		COUNT(*) FILTER (WHERE deviation = 'Работа завершена') AS deviation_done,
		COUNT(*) FILTER (WHERE deviation = 'Без отклонений') AS deviation_none,
		COUNT(*) FILTER (WHERE deviation = 'Требует внимания') AS deviation_attention,
		COUNT(*) FILTER (WHERE deviation = 'Риск') AS deviation_risk
		FROM renovation.apartments_classified -- УВЫ зависимость от иного представления
		GROUP BY old_apart_building_id
), full_data AS (
	SELECT 
		o.id, 
		o.okrug, 
		o.district, 
		o.adress, 
		o.relocation_type as "relocationTypeId", 
		t.type as "relocationType",
		COALESCE(at.total, 0) as "totalApartments",
		CASE
			WHEN at.deviation_risk > 0 THEN 'Есть риски'::text
			WHEN at.deviation_attention > 0 THEN 'Требует внимания'::text
			WHEN at.deviation_none + at.deviation_attention + at.deviation_risk = 0 AND at.deviation_done > 0 THEN 'Работа завершена'::text
			ELSE 'Без отклонений'::text
		END AS "buildingDeviation",
		CASE
			WHEN od.terms->'actual'->>'demolitionEnd' IS NOT NULL THEN 'Завершено'
			WHEN od.terms->'actual'->>'firstResetlementStart' IS NULL THEN 'Не начато'
			WHEN od.age < '1 month' THEN 'Менее месяца'
			WHEN od.age < '2 month' THEN 'От 1 до 2 месяцев'
			WHEN od.age < '5 month' THEN 'От 2 до 5 месяцев'
			WHEN od.age < '8 month' THEN 'От 5 до 8 месяцев'
			ELSE 'Более 8 месяцев'
		END as "buildingRelocationStartAge",
		CASE
			WHEN od.terms->'actual'->>'demolitionEnd' IS NOT NULL THEN 'Завершено'
			WHEN od.terms->'actual'->>'secontResetlementEnd' IS NOT NULL THEN 'Снос'
			WHEN od.terms->'actual'->>'firstResetlementEnd' IS NOT NULL THEN 'Отселение'
			WHEN od.terms->'actual'->>'firstResetlementStart' IS NULL THEN 'Не начато'
			ELSE 'Переселение'
		END as "buildingRelocationStatus",
		o.terms_reason as "termsReason", 
		od.terms as terms,
		nc.new_building_constructions as "newBuildingConstructions",
		nm.new_building_movements as "newBuildingMovements",
		json_build_object(
			'total', COALESCE(at.total, 0),
			'status', json_build_object(
				'empty', COALESCE(at.empty, 0),
				'notStarted', COALESCE(at.not_started, 0),
				'mfr', COALESCE(at.mfr, 0),
				'inspection', COALESCE(at.inspection, 0),
				'rejected', COALESCE(at.rejected, 0),
				'reinspection', COALESCE(at.reinspection, 0),
				'accepted', COALESCE(at.accepted, 0),
				'rd', COALESCE(at.rd, 0),
				'litigations', COALESCE(at.litigations, 0),
				'litigationsDone', COALESCE(at.litigations_done, 0),
				'contractProject', COALESCE(at.contract_project, 0),
				'contractPrelimenatySigning', COALESCE(at.contract_prelimenary_signing, 0),
				'contract', COALESCE(at.contract, 0)
			), 
			'difficulty', json_build_object(
				'normal', COALESCE(at.difficulty_normal, 0),
				'problem', COALESCE(at.difficulty_problem, 0),
				'rejected', COALESCE(at.difficulty_rejected, 0),
				'litigation', COALESCE(at.difficulty_litigation, 0),
				'mfr', COALESCE(at.difficulty_mfr, 0)
			),
			'deviation', json_build_object(
				'none', COALESCE(at.deviation_none, 0),
				'attention', COALESCE(at.deviation_attention, 0),
				'risk', COALESCE(at.deviation_risk, 0)
			)
		) as appartments
	FROM renovation.buildings_old o
	LEFT JOIN old_dates_flat od ON od.building_id = o.id
	LEFT JOIN renovation.relocation_types t ON t.id = o.relocation_type
	LEFT JOIN (
		SELECT old_building_id, 
			   JSON_AGG(construction) as new_building_constructions,
			   STRING_AGG(construction_adress, '; ') as new_building_construction_list
		FROM constructions_ranked 
		WHERE rank = 1
		GROUP BY old_building_id
	) as nc ON nc.old_building_id = o.id
	LEFT JOIN (
		SELECT old_building_id, 
			   JSON_AGG(movement) as new_building_movements,
			   STRING_AGG(movement_adress, '; ') as new_building_movement_list
		FROM movements_ranked 
		WHERE rank = 1
		GROUP BY old_building_id
	) as nm ON nm.old_building_id = o.id
	LEFT JOIN appartment_totals at ON at.building_id = o.id
)

SELECT *, COUNT(*) OVER() as "totalCount" FROM full_data
${conditions:raw}
LIMIT ${limit:raw} OFFSET ${offset:raw};