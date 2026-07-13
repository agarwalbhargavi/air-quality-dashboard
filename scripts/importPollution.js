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

    ssl:{
        rejectUnauthorized:false
    }

});

const rows=[];

fs.createReadStream("./transformed_data/pollution_final.csv")

.pipe(csv())

.on("data",(row)=>{

    rows.push(row);

})

.on("end",async()=>{

    console.log(`Importing ${rows.length} records...`);

    try{

        for(const row of rows){

            const cityResult = await pool.query(

                `

                SELECT city_id

                FROM city_master

                WHERE city=$1

                `,

                [

                    row.city

                ]

            );

            if(cityResult.rows.length===0){

                console.log(`City not found : ${row.city}`);

                continue;

            }

            const city_id = cityResult.rows[0].city_id;
                        await pool.query(

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
                    $10,$11,$12,$13,$14,$15,$16,$17,$18,
                    $19,$20,$21,$22,$23,$24
                )

                ON CONFLICT DO NOTHING
                `,
                [
                    city_id,
                    row.station || null,
                    row.latitude || null,
                    row.longitude || null,
                    row.pollution_date || null,
                    row.year || null,
                    row.month || null,
                    row.quarter || null,
                    row.season || null,
                    row.pm25 || null,
                    row.pm10 || null,
                    row.no || null,
                    row.no2 || null,
                    row.nox || null,
                    row.nh3 || null,
                    row.co || null,
                    row.so2 || null,
                    row.o3 || null,
                    row.benzene || null,
                    row.toluene || null,
                    row.xylene || null,
                    row.aqi || null,
                    row.aqi_bucket || null,
                    row.source || null
                ]

            );

        }

        console.log("--------------------------------");
        console.log("Pollution Data Imported Successfully!");
        console.log("Rows Imported :", rows.length);

    }
    catch(err){

        console.error("Import Failed");
        console.error(err);

    }
    finally{

        await pool.end();

    }

})

.on("error",(err)=>{

    console.error(err);

});