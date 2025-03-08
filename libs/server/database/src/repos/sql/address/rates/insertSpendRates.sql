WITH rate_info AS (
	SELECT 
		id as session_id,
		user_id,
		${responseSource} as response_source,
		${amount} as amount
	FROM address.sessions
	WHERE id = ${sessionId}
)

INSERT INTO address.rates (session_id, user_id, response_source, amount)
(SELECT r.session_id, r.user_id, r.response_source, r.amount
FROM rate_info as r);

-- DROP TABLE IF EXISTS address.rates CASCADE;
-- CREATE TABLE address.rates (
--     id INTEGER GENERATED ALWAYS AS IDENTITY,
--     session_id INTEGER REFERENCES address.sessions(id) ON DELETE SET NULL,
--     user_id INTEGER REFERENCES renovation.users(id) ON DELETE SET NULL,
--     response_source VARCHAR(255),
--     amount INTEGER,
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT (now())::timestamp(0) with time zone,
--     PRIMARY KEY (id)
-- );

-- ALTER TABLE address.rates
--     OWNER to renovation_user;