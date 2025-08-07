SELECT 
    c.status, 
    COUNT(*)::integer as count
FROM vks.cases c
LEFT JOIN vks.services s ON c.service_id = s.id
LEFT JOIN vks.departments d ON s.department_id = d.id
WHERE c.date BETWEEN ${dateFrom}::date AND ${dateTo}::date
${conditions:raw}
GROUP BY status
ORDER BY status;