const fs = require("fs");
const csv = require("csv-parser");
const { createObjectCsvWriter } = require("csv-writer");

const inputFile = "./raw_data/city-state-mapping.csv";
const outputDir = "./cleaned_data";
const outputFile = "./cleaned_data/city_master_clean.csv";

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

const rows = [];
const duplicateChecker = new Set();

function cleanText(value) {

    if (!value) return "";

    return String(value)
        .trim()
        .normalize("NFD")                    // Split accented characters
        .replace(/[\u0300-\u036f]/g, "")     // Remove accents
        .replace(/\s+/g, " ");               // Remove extra spaces
}

fs.createReadStream(inputFile)
.pipe(csv())

.on("data", (row) => {

    const cleanedRow = {

        city: cleanText(row.city),
        state: cleanText(row.state)

    };

    // Remove duplicate city-state combinations
    const key =
        cleanedRow.city.toLowerCase() +
        "|" +
        cleanedRow.state.toLowerCase();

    if (!duplicateChecker.has(key)) {

        duplicateChecker.add(key);
        rows.push(cleanedRow);

    }

})

.on("end", async () => {

    rows.sort((a, b) => {

        if (a.city === b.city)
            return a.state.localeCompare(b.state);

        return a.city.localeCompare(b.city);

    });

    const writer = createObjectCsvWriter({

        path: outputFile,

        header: [

            { id: "city", title: "city" },
            { id: "state", title: "state" }

        ]

    });

    await writer.writeRecords(rows);

    console.log("--------------------------------");
    console.log("City Master Cleaning Completed");
    console.log("Rows Written :", rows.length);
    console.log("Output :", outputFile);

})

.on("error", (err) => {

    console.error(err);

});