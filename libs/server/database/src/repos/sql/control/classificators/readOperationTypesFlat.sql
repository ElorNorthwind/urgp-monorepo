SELECT     
	id,
	name,
	category,
	fullname,
	priority,
	auto_approve as  "autoApprove"
FROM control.operation_types
${operationClassText:raw};
-- WHERE category = ANY(ARRAY['рассмотрение', 'решение'])
-- GROUP BY category;


--   id: z.coerce.number(),
--   name: z.string(),
--   category: z.string().nullable().optional(),
--   fullname: z.string().nullable().optional(),
--   tags: z.array(z.string()).nullable().optional(),
--   priority: z.coerce.number().nullable().optional(),
--   autoApprove: z.coerce.boolean().nullable().optional(),