const fs = require("fs");
const csv = require("csv-parser");
const { createObjectCsvWriter } = require("csv-writer");



if (!fs.existsSync("./cleaned_data")) {
    fs.mkdirSync("./cleaned_data");
}

const cleanedRows = [];

let totalRows = 0;
let droppedRows = 0;

fs.createReadStream("./raw_data/population.csv")
    .pipe(csv())
    .on("data", (row) => {

        totalRows++;

        let city = row.City?.trim();

        if (!city) {
            droppedRows++;
            return;
        }

        city =
            city.charAt(0).toUpperCase() +
            city.slice(1).toLowerCase();

        const area = Number(row["ABD Area (sq. km)"]);
        const population = Number(row["ABD Population"]);
        const density = Number(row["ABD Population Density"]);

        if (population <= 0) {
            droppedRows++;
            return;
        }

        cleanedRows.push({
            city,
            area,
            population,
            density
        });

    })
    .on("end", async () => {

        const csvWriter = createObjectCsvWriter({

            path: "./cleaned_data/population_clean.csv",

            header: [

                { id: "city", title: "City" },

                { id: "area", title: "Area" },

                { id: "population", title: "Population" },

                { id: "density", title: "Density" }

            ]

        });

        await csvWriter.writeRecords(cleanedRows);

        console.log("Population Cleaning Complete");

        console.log("Total Rows :", totalRows);

        console.log("Clean Rows :", cleanedRows.length);

        console.log("Dropped :", droppedRows);

    });