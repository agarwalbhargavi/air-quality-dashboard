const fs = require("fs");
const csv = require("csv-parser");
const pool = require("../config/db");

const rows = [];

fs.createReadStream("./transformed_data/population_transformed.csv")
.pipe(csv())

.on("data",(row)=>{
    rows.push(row);
})

.on("end", async () => {

    try{

        for(const row of rows){

            await pool.query(

                `INSERT INTO population
                (
                    city,
                    population,
                    area,
                    density,
                    population_category
                )
                VALUES($1,$2,$3,$4,$5)`,

                [
                    row.City,
                    row.Population,
                    row.Area,
                    row.Density,
                    row["Population Category"]
                ]

            );

        }

        console.log("✅ Population Imported Successfully");

    }
    catch(err){

        console.error(err);

    }
    finally{

        await pool.end();

    }

});