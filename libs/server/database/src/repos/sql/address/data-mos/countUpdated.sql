SELECT COUNT(*)::integer as total
FROM address.address_registry
WHERE updated_at IS NOT NULL;