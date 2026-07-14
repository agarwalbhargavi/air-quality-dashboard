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

async function importPollution(inputFile) {

    return new Promise((resolve, reject) => {

        const rows = [];

        fs.createReadStream(inputFile)

            .pipe(csv())

            .on("data", (row) => {

                rows.push(row);

            })

            .on("end", async () => {

                console.log("--------------------------------");
                console.log(`Importing ${rows.length} records...`);

                let imported = 0;
                let skipped = 0;
                let cityNotFound = 0;

                try {

                    for (const row of rows) {

                        const cityResult = await pool.query(
                            `
                            SELECT city_id
                            FROM city_master
                            WHERE LOWER(city)=LOWER($1)
                            `,
                            [row.city.trim()]
                        );

                        if (cityResult.rows.length === 0) {

                            console.log(`City Not Found : ${row.city}`);
                            cityNotFound++;
                            continue;

                        }

                        const city_id = cityResult.rows[0].city_id;

                        const result = await pool.query(

                            `
                            INSERT INTO pollution
                            (
                                city_id,
                                station,
                                latitude,
                                longitude,
                                pollution_date,
                                year,
                                month,
                                quarter,
                                season,
                                pm25,
                                pm10,
                                no,
                                no2,
                                nox,
                                nh3,
                                co,
                                so2,
                                o3,
                                benzene,
                                toluene,
                                xylene,
                                aqi,
                                aqi_bucket,
                                source
                            )

                            VALUES
                            (
                                $1,$2,$3,$4,$5,$6,$7,$8,$9,
                                $10,$11,$12,$13,$14,$15,$16,
                                $17,$18,$19,$20,$21,$22,$23,$24
                            )

                            ON CONFLICT
                            (
                                city_id,
                                station,
                                pollution_date,
                                source
                            )
                            DO NOTHING
                            `,

                            [

                                city_id,

                                row.station || null,

                                row.latitude ? Number(row.latitude) : null,

                                row.longitude ? Number(row.longitude) : null,

                                row.pollution_date || null,

                                row.year ? Number(row.year) : null,

                                row.month ? Number(row.month) : null,

                                row.quarter ? Number(row.quarter) : null,

                                row.season || null,

                                row.pm25 ? Number(row.pm25) : null,

                                row.pm10 ? Number(row.pm10) : null,

                                row.no ? Number(row.no) : null,

                                row.no2 ? Number(row.no2) : null,

                                row.nox ? Number(row.nox) : null,

                                row.nh3 ? Number(row.nh3) : null,

                                row.co ? Number(row.co) : null,

                                row.so2 ? Number(row.so2) : null,

                                row.o3 ? Number(row.o3) : null,

                                row.benzene ? Number(row.benzene) : null,

                                row.toluene ? Number(row.toluene) : null,

                                row.xylene ? Number(row.xylene) : null,

                                row.aqi ? Number(row.aqi) : null,

                                row.aqi_bucket || null,

                                row.source || null

                            ]

                        );

                        if (result.rowCount === 1)
                            imported++;
                        else
                            skipped++;

                    }

                    console.log("--------------------------------");
                    console.log("Pollution Import Completed!");
                    console.log("Inserted :", imported);
                    console.log("Duplicates :", skipped);
                    console.log("City Not Found :", cityNotFound);

                    resolve({
                        imported,
                        skipped,
                        cityNotFound
                    });

                }

                catch (err) {

                    reject(err);

                }

            })

            .on("error", (err) => {

                reject(err);

            });

    });

}

module.exports = importPollution;