CREATE TABLE addresses
(
    id BIGSERIAL PRIMARY KEY,
    person_id bigint NOT NULL REFERENCES people(id),
    line1 varchar(256) NOT NULL,
    line2 varchar(256) NOT NULL,
    city varchar(256) NOT NULL,
    state varchar(256) NOT NULL,
    zip varchar(256) NOT NULL,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ
)