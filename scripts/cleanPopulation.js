const fs = require("fs");
const csv = require("csv-parser");
const { createObjectCsvWriter } = require("csv-writer");

const inputFile = "./raw_data/population.csv";
const outputDir = "./cleaned_data";
const outputFile = "./cleaned_data/population_clean.csv";

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

const rows = [];
const duplicateChecker = new Set();

function cleanValue(value) {

    if (value === undefined || value === null)
        return "";

    value = String(value).trim();

    if (
        value === "" ||
        value.toLowerCase() === "na" ||
        value.toLowerCase() === "null" ||
        value.toLowerCase() === "undefined"
    ) {
        return "";
    }

    return value;
}

fs.createReadStream(inputFile)

.pipe(csv())

.on("data", (row) => {

    const city = cleanValue(row.City);

    // Ignore unwanted rows
    if (
        city === "" ||
        city.toLowerCase() === "total" ||
        city.toLowerCase() === "average"
    ) {
        return;
    }

   const cleanedRow = {

    City: city,

    Population: cleanValue(row["ABD Population"]),

    Area: cleanValue(row["ABD Area (sq. km)"]),

    Density: cleanValue(row["ABD Population Density"])

};

    const key = JSON.stringify(cleanedRow);

    if (!duplicateChecker.has(key)) {

        duplicateChecker.add(key);
        rows.push(cleanedRow);

    }

})

.on("end", async () => {

    const writer = createObjectCsvWriter({

        path: outputFile,

        header: [

            { id: "City", title: "City" },
            { id: "Population", title: "Population" },
            { id: "Area", title: "Area" },
            { id: "Density", title: "Density" }

        ]

    });

    await writer.writeRecords(rows);

    console.log("--------------------------------");
    console.log("Population Cleaning Completed");
    console.log("Rows Written :", rows.length);
    console.log("Output :", outputFile);

});