require("dotenv").config();

const fs = require("fs");
const csv = require("csv-parser");
const { Pool } = require("pg");

const pool = new Pool({

    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: {
        rejectUnauthorized: false
    }

});

const rows = [];

fs.createReadStream("./transformed_data/population_transformed.csv")

.pipe(csv())

.on("data", (row) => {

    rows.push(row);

})

.on("end", async () => {

    console.log(`Importing ${rows.length} population records...`);

    let imported = 0;
    let skipped = 0;
    let cityNotFound = 0;

    try {

        for (const row of rows) {

            const cityName = (row.city || "").trim();

            if (!cityName)
                continue;

            let cityResult = await pool.query(
`
SELECT city_id
FROM city_master
WHERE LOWER(city)=LOWER($1)
`,
[cityName]
);

if(cityResult.rows.length===0){

    cityResult = await pool.query(
    `
    SELECT city_id
    FROM city_anomaly
    WHERE LOWER(city_alias)=LOWER($1)
    `,
    [cityName]
    );

}

            

            if (cityResult.rows.length === 0) {

                console.log("City not found :", cityName);

                cityNotFound++;

                continue;

            }

            const city_id = cityResult.rows[0].city_id;

            const result = await pool.query(

                `
                INSERT INTO population
                (
                    city_id,
                    population,
                    area,
                    density,
                    population_category
                )
                VALUES
                (
                    $1,$2,$3,$4,$5
                )
                ON CONFLICT(city_id)
                DO NOTHING
                `,
                [

                    city_id,
                    Number(row.population),
                    Number(row.area),
                    Number(row.density),
                    row.population_category

                ]

            );

            if (result.rowCount === 1)
                imported++;
            else
                skipped++;

        }

        console.log("--------------------------------");
        console.log("Population Imported Successfully!");
        console.log("Imported :", imported);
        console.log("Skipped :", skipped);
        console.log("City Not Found :", cityNotFound);

    }

    catch (err) {

        console.error(err);

    }

    finally {

        await pool.end();

    }

});