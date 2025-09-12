-- Описанное в ТЗ представление по делам
DROP VIEW IF EXISTS dm.documents_view CASCADE;
CREATE OR REPLACE VIEW dm.documents_view  AS
----------------------------------------------------------------------
    SELECT DISTINCT ON (r.control_date, r.document_id)
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
    ORDER BY control_date DESC;
  ----------------------------------------------------------------------