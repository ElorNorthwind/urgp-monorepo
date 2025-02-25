SELECT COUNT(*)::integer as total
FROM public.address_registry
WHERE updated_at IS NOT NULL;