const fs = require("fs");
const csv = require("csv-parser");


if (!fs.existsSync("./reports")) {
    fs.mkdirSync("./reports");
}

const rows = [];

fs.createReadStream("./raw_data/pollution.csv")
    .pipe(csv())
    .on("data", (row) => {
        rows.push(row);
    })
    .on("end", () => {

        console.log("\nPOLLUTION PROFILE \n");

  
        console.log("Total Rows :", rows.length);

    
        const columns = Object.keys(rows[0]);

        console.log("Total Columns :", columns.length);

        console.log("\nColumns:");

        columns.forEach(col => console.log("-", col));


        const cities = new Set();

        rows.forEach(row => {

            cities.add(row.City);

        });

        console.log("\nUnique Cities :", cities.size);


        const missing = {};

        columns.forEach(column => {

            missing[column] = 0;

        });

        rows.forEach(row => {

            columns.forEach(column => {

                if (
                    row[column] === "" ||
                    row[column] === null ||
                    row[column] === undefined
                ) {

                    missing[column]++;

                }

            });

        });

        console.log("\nMissing Values");

        console.table(missing);



        const seen = new Set();

        let duplicates = 0;

        rows.forEach(row => {

            const key =
                `${row.City}-${row.Date}`;

            if (seen.has(key)) {

                duplicates++;

            } else {

                seen.add(key);

            }

        });

        console.log("\nDuplicate Records :", duplicates);



        const dates = rows
            .map(row => new Date(row.Date))
            .filter(date => !isNaN(date));

        const earliest = new Date(Math.min(...dates));

        const latest = new Date(Math.max(...dates));

        console.log("\nEarliest Date :", earliest);

        console.log("Latest Date :", latest);



        const aqi = rows
            .map(row => Number(row.AQI))
            .filter(value => !isNaN(value));

        const minimumAQI = Math.min(...aqi);

        const maximumAQI = Math.max(...aqi);

        const averageAQI =
            aqi.reduce((sum, value) => sum + value, 0) / aqi.length;

        console.log("\nMinimum AQI :", minimumAQI);

        console.log("Maximum AQI :", maximumAQI);

        console.log("Average AQI :", averageAQI.toFixed(2));

  
        const pollutants = [

            "PM2.5",

            "PM10",

            "NO",

            "NO2",

            "NOx",

            "NH3",

            "CO",

            "SO2",

            "O3",

            "Benzene",

            "Toluene",

            "Xylene"

        ];

        console.log("\n========== POLLUTANT SUMMARY ==========\n");

        pollutants.forEach(pollutant => {

            const values = rows

                .map(row => Number(row[pollutant]))

                .filter(value => !isNaN(value));

            console.log(pollutant);

            console.log("Count :", values.length);

            console.log("Minimum :", Math.min(...values));

            console.log("Maximum :", Math.max(...values));

            console.log(
                "Average :",
                (
                    values.reduce((a, b) => a + b, 0) /
                    values.length
                ).toFixed(2)
            );

            console.log("-------------------------");

        });



        const report = {

            totalRows: rows.length,

            totalColumns: columns.length,

            columns,

            uniqueCities: cities.size,

            duplicateRecords: duplicates,

            missingValues: missing,

            earliestDate: earliest,

            latestDate: latest,

            minimumAQI,

            maximumAQI,

            averageAQI

        };

        fs.writeFileSync(

            "./reports/pollution_profile.json",

            JSON.stringify(report, null, 4)

        );

        console.log("\nProfile Saved Successfully!");
    });