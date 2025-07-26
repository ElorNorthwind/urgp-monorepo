-- ================= UPDATE CLAIM DENORMALIZATION ==================
WITH claim_info AS (
SELECT
    object_id,
    COUNT(*)::int as claim_count,
    MAX(claim_registry_date)::date as claim_date,
    MIN(first_registry_date)::date as first_claim_date,
    SUM(sum_unpaid) as sum_unpaid,
    TRANSLATE(STRING_AGG(DISTINCT creditor_name, '; '), ',', ';') as creditors,
    STRING_AGG(DISTINCT basis, '; ') as basis
FROM (
    SELECT
        c.id,
        c.object_id,
        c.claim_status,
        c.claim_item_type_id,
        c.claim_source_type_id,
        t.priority,
        MAX(t.priority) OVER (PARTITION BY c.object_id) as max_priority,
        c.num_project,
        c.claim_registry_date,
        MIN(c.claim_registry_date) OVER (PARTITION BY c.object_id, c.creditor_registry_num) as first_registry_date,
        c.sum_unpaid,
        c.creditor_name,
        c.basis
    FROM equity.claims c
    LEFT JOIN equity.claim_source_types t ON c.claim_source_type_id = t.id
) cl
WHERE claim_status = 'active' 
    AND priority = max_priority
GROUP BY object_id
)
UPDATE equity.objects o
SET
    claim_count = COALESCE(c.claim_count, 0),
    claim_first_date = c.first_claim_date,
    claim_sum_unpaid = COALESCE(c.sum_unpaid, 0),
    claim_creditors = c.creditors,
    claim_basis = c.basis
FROM claim_info c
WHERE o.id = c.object_id;