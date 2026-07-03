

CREATE TABLE population (

    id SERIAL PRIMARY KEY,

    city VARCHAR(100) UNIQUE NOT NULL,

    population BIGINT,

    area NUMERIC,

    density NUMERIC,

    population_category VARCHAR(20)

);



CREATE TABLE pollution (

    id SERIAL PRIMARY KEY,

    city VARCHAR(100) NOT NULL,

    pollution_date DATE NOT NULL,

    year INTEGER,

    month INTEGER,

    day INTEGER,

    quarter INTEGER,

    season VARCHAR(30),

    pm25 NUMERIC,

    pm10 NUMERIC,

    no NUMERIC,

    no2 NUMERIC,

    nox NUMERIC,

    nh3 NUMERIC,

    co NUMERIC,

    so2 NUMERIC,

    o3 NUMERIC,

    benzene NUMERIC,

    toluene NUMERIC,

    xylene NUMERIC,

    aqi NUMERIC,

    aqi_bucket VARCHAR(50)

);

CREATE INDEX idx_city ON pollution(city);

CREATE INDEX idx_date ON pollution(pollution_date);

CREATE INDEX idx_year ON pollution(year);

CREATE INDEX idx_season ON pollution(season);