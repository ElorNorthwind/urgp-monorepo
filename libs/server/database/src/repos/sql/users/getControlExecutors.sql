SELECT id as value, fio as label
FROM renovation.users
WHERE control_data->'roles' ? 'executor';
