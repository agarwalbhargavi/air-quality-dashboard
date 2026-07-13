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

fs.createReadStream("./generated/city_master.csv")
.pipe(csv())

.on("data",(row)=>{

    rows.push(row);

})

.on("end",async()=>{

    console.log(`Importing ${rows.length} cities...`);

    try{

        for(const row of rows){

            await pool.query(

                `
                INSERT INTO city_master
                (
                    city,
                    state
                )

                VALUES($1,$2)

                ON CONFLICT(city)

                DO NOTHING;
                `,

                [

                    row.city,

                    row.state

                ]

            );

        }

        console.log("--------------------------------");

        console.log("City Master Imported Successfully!");

        console.log("Cities Imported :",rows.length);

    }

    catch(err){

        console.log(err);

    }

    finally{

        await pool.end();

    }

});