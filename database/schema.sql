

DROP TABLE IF EXISTS pollution;
DROP TABLE IF EXISTS population;
DROP TABLE IF EXISTS city_anomaly;
DROP TABLE IF EXISTS city_master;



CREATE TABLE city_master (

    city_id SERIAL PRIMARY KEY,

    city VARCHAR(100) NOT NULL UNIQUE,

    state VARCHAR(100) NOT NULL

);



CREATE TABLE city_anomaly (

    anomaly_id SERIAL PRIMARY KEY,

    city_alias VARCHAR(150) NOT NULL UNIQUE,

    city_id INT NOT NULL,

    FOREIGN KEY(city_id)
    REFERENCES city_master(city_id)

);



CREATE TABLE population (

    population_id SERIAL PRIMARY KEY,

    city_id INT NOT NULL UNIQUE,

    population BIGINT,

    area DECIMAL(10,2),

    density DECIMAL(10,2),

    population_category VARCHAR(30),

    FOREIGN KEY(city_id)
    REFERENCES city_master(city_id)

);


CREATE TABLE pollution (

    pollution_id SERIAL PRIMARY KEY,

    city_id INT NOT NULL,

    station VARCHAR(255),

    latitude DECIMAL(10,6),

    longitude DECIMAL(10,6),

    pollution_date TIMESTAMP,

    year INT,

    month INT,

    quarter INT,

    season VARCHAR(30),

    pm25 DECIMAL(10,2),

    pm10 DECIMAL(10,2),

    no DECIMAL(10,2),

    no2 DECIMAL(10,2),

    nox DECIMAL(10,2),

    nh3 DECIMAL(10,2),

    co DECIMAL(10,2),

    so2 DECIMAL(10,2),

    o3 DECIMAL(10,2),

    benzene DECIMAL(10,2),

    toluene DECIMAL(10,2),

    xylene DECIMAL(10,2),

    aqi DECIMAL(10,2),

    aqi_bucket VARCHAR(30),

    source VARCHAR(30),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(city_id)
    REFERENCES city_master(city_id)

);



CREATE INDEX idx_city
ON pollution(city_id);

CREATE INDEX idx_pollution_date
ON pollution(pollution_date);

CREATE INDEX idx_source
ON pollution(source);

CREATE INDEX idx_city_alias
ON city_anomaly(city_alias);



ALTER TABLE pollution

ADD CONSTRAINT unique_pollution_record

UNIQUE
(
    city_id,
    station,
    pollution_date,
    source
);