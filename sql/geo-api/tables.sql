DROP TABLE IF EXISTS reon_local.layer155 CASCADE;
CREATE TABLE reon_local.layer155 (
    id BIGINT NOT NULL PRIMARY KEY, -- импорт из objectid
    egkoid BIGINT,
    state TEXT,
    address TEXT,
    type TEXT,
    name TEXT,
    vid TEXT,
    geo_data GEOMETRY,
    moddate TIMESTAMP WITHOUT TIME ZONE,
    center_point GEOMETRY GENERATED ALWAYS AS (ST_PointOnSurface(geo_data)) STORED,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (now())::timestamp(0) without time zone
);