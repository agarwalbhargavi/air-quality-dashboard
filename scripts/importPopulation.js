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

        try {

            for (const row of rows) {

                const city = row.City?.trim();
                const population = Number(row.Population);

                if (!city) {
                    skipped++;
                    continue;
                }

                const cityResult = await pool.query(
                    `
                    SELECT city_id
                    FROM city_master
                    WHERE LOWER(city)=LOWER($1)
                    `,
                    [city]
                );

                if (cityResult.rows.length === 0) {

                    console.log(`City not found : ${city}`);

                    skipped++;

                    continue;

                }

                const city_id = cityResult.rows[0].city_id;

                await pool.query(
                    `
                    INSERT INTO population
                    (
                        city_id,
                        population
                    )
                    VALUES
                    (
                        $1,
                        $2
                    )
                    ON CONFLICT (city_id)
                    DO UPDATE
                    SET population = EXCLUDED.population
                    `,
                    [
                        city_id,
                        population
                    ]
                );

                imported++;

            }

            console.log("--------------------------------");
            console.log("Population Imported Successfully!");
            console.log("Imported :", imported);
            console.log("Skipped :", skipped);

        }

        catch (err) {

            console.error("Import Failed");
            console.error(err);

        }

        finally {

            await pool.end();

        }

    })

    .on("error", (err) => {

        console.error(err);

    });