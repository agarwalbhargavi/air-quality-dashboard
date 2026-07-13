-- =====================================================
-- AIR QUALITY MONITORING DATABASE SCHEMA
-- =====================================================

DROP TABLE IF EXISTS pollution;
DROP TABLE IF EXISTS population;
DROP TABLE IF EXISTS city_master;

-- =====================================================
-- CITY MASTER TABLE
-- =====================================================

CREATE TABLE city_master (

    city_id SERIAL PRIMARY KEY,

    city VARCHAR(100) NOT NULL UNIQUE,

    state VARCHAR(100) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- =====================================================
-- POPULATION TABLE
-- =====================================================

CREATE TABLE population (

    population_id SERIAL PRIMARY KEY,

    city_id INT NOT NULL UNIQUE,

    population BIGINT NOT NULL,

    FOREIGN KEY(city_id)
    REFERENCES city_master(city_id)

);

-- =====================================================
-- POLLUTION TABLE
-- =====================================================

CREATE TABLE pollution (

    pollution_id SERIAL PRIMARY KEY,

    city_id INT NOT NULL,

    station VARCHAR(255),

    pollution_date TIMESTAMP NOT NULL,

    pollutant VARCHAR(50) NOT NULL,

    pollutant_value DECIMAL(12,4),

    pollutant_unit VARCHAR(20),

    latitude DECIMAL(10,6),

    longitude DECIMAL(10,6),

    source VARCHAR(30) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(city_id)
    REFERENCES city_master(city_id)

);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_city
ON pollution(city_id);

CREATE INDEX idx_date
ON pollution(pollution_date);

CREATE INDEX idx_pollutant
ON pollution(pollutant);

CREATE INDEX idx_source
ON pollution(source);

-- =====================================================
-- PREVENT DUPLICATE RECORDS
-- =====================================================

ALTER TABLE pollution
ADD CONSTRAINT unique_pollution_record
UNIQUE
(
    city_id,
    station,
    pollution_date,
    pollutant,
    source
);
