const fs = require("fs");
const csv = require("csv-parser");
const pool = require("../config/db");

const rows = [];

fs.createReadStream("./transformed_data/pollution_transformed.csv")
  .pipe(csv())
  .on("data", (row) => {
    rows.push(row);
  })
  .on("end", async () => {
    console.log(`Importing ${rows.length} rows...`);

    try {
      for (const row of rows) {
        await pool.query(
          `
          INSERT INTO pollution (
            city,
            pollution_date,
            year,
            month,
            day,
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
            aqi_bucket
          )
          VALUES (
            $1,$2,$3,$4,$5,$6,$7,
            $8,$9,$10,$11,$12,
            $13,$14,$15,$16,
            $17,$18,$19,$20,$21
          )
          `,
          [
            row.City,
            row.Date,
            Number(row.Year),
            Number(row.Month),
            Number(row.Day),
            Number(row.Quarter),
            row.Season,

            row["PM2.5"] || null,
            row.PM10 || null,
            row.NO || null,
            row.NO2 || null,
            row.NOx || null,
            row.NH3 || null,
            row.CO || null,
            row.SO2 || null,
            row.O3 || null,
            row.Benzene || null,
            row.Toluene || null,
            row.Xylene || null,
            row.AQI || null,
            row.AQI_Bucket || null
          ]
        );
      }

      console.log("✅ Import Completed Successfully!");

    } catch (err) {
      console.error("❌ Import Failed");
      console.error(err);
    } finally {
      await pool.end();
    }
  });