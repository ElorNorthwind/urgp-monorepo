-- Описанное в ТЗ представление по делам
DROP VIEW IF EXISTS dm.documents_view CASCADE;
CREATE OR REPLACE VIEW dm.documents_view  AS
----------------------------------------------------------------------
    SELECT DISTINCT ON (r.control_date, r.document_id)
        r.id,
        r.document_id as "id_documents",
        d.reg_num,
        r.control_date as "kontr_data",
        r.done_date as "ispol_data",
        r.resolution_text as "resolution",
        CASE WHEN r.is_original_given THEN 'да' ELSE 'нет' END as "original_peredan",
        r.updated_at as "updated_at",
        dep.display_name as "department",
        c.category_code as "id_rubr",
        z.full_name as "zam"
    FROM dm.resolutions r
    LEFT JOIN dm.documents d ON r.document_id = d.id
    LEFT JOIN dm.categories c ON d.category_id = c.id
    LEFT JOIN dm.departments dep ON c.department_id = dep.id
    LEFT JOIN dm.zams z ON dep.zam_id = z.id
    WHERE r.control_date >= '01.01.2025'::timestamp with time zone AND c.id IS NOT NULL
    ORDER BY control_date DESC;
  ----------------------------------------------------------------------



-- Представление до 3 последних рабочих дней
DROP VIEW IF EXISTS dm.documents_dated_view CASCADE;
CREATE OR REPLACE VIEW dm.documents_dated_view  AS
----------------------------------------------------------------------
    WITH date_limit AS (
        SELECT date
        FROM dm.calendar
        WHERE is_workday = true AND date < CURRENT_TIMESTAMP::date
        ORDER BY date DESC
        LIMIT 1 OFFSET 2
    )
    SELECT DISTINCT ON (r.control_date, r.document_id)
        r.id,
        r.document_id as "id_documents",
        d.reg_num,
        r.control_date as "kontr_data",
        r.done_date as "ispol_data",
        r.resolution_text as "resolution",
        CASE WHEN r.is_original_given THEN 'да' ELSE 'нет' END as "original_peredan",
        r.updated_at as "updated_at",
        dep.display_name as "department",
        c.category_code as "id_rubr",
        z.full_name as "zam"
    FROM dm.resolutions r
    LEFT JOIN dm.documents d ON r.document_id = d.id
    LEFT JOIN dm.categories c ON d.category_id = c.id
    LEFT JOIN dm.departments dep ON c.department_id = dep.id
    LEFT JOIN dm.zams z ON dep.zam_id = z.id, date_limit
    WHERE c.id IS NOT NULL AND r.control_date BETWEEN '01.01.2025'::timestamp AND date_limit.date
    ORDER BY control_date;
----------------------------------------------------------------------

