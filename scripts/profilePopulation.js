const fs = require("fs");
const csv = require("csv-parser");

// ===============================
// Create reports folder if missing
// ===============================
if (!fs.existsSync("./reports")) {
    fs.mkdirSync("./reports");
}

const rows = [];

// ===============================
// Read CSV
// ===============================
fs.createReadStream("./raw_data/population.csv")
    .pipe(csv())
    .on("data", (row) => {
        rows.push(row);
    })

    .on("end", () => {

        console.log("\n==============================");
        console.log("POPULATION DATA PROFILE");
        console.log("==============================\n");

        // -------------------------------
        // Total Rows
        // -------------------------------
        console.log("Total Rows:", rows.length);

        // -------------------------------
        // Total Columns
        // -------------------------------
        const columns = Object.keys(rows[0]);

        console.log("Total Columns:", columns.length);

        console.log("\nColumn Names:");

        columns.forEach((column) => {
            console.log("-", column);
        });

        // -------------------------------
        // Unique Cities
        // -------------------------------
        const cities = new Set();

        rows.forEach((row) => {
            cities.add(row.City);
        });

        console.log("\nUnique Cities:", cities.size);

        // -------------------------------
        // Missing Population
        // -------------------------------
        let missingPopulation = 0;

        rows.forEach((row) => {

            if (!row["ABD Population"]) {
                missingPopulation++;
            }

        });

        console.log("Missing Population:", missingPopulation);

        // -------------------------------
        // Minimum Population
        // -------------------------------
        let minimumPopulation = Infinity;

        rows.forEach((row) => {

            const value = Number(row["ABD Population"]);

            if (value < minimumPopulation) {
                minimumPopulation = value;
            }

        });

        console.log("Minimum Population:", minimumPopulation);

        // -------------------------------
        // Maximum Population
        // -------------------------------
        let maximumPopulation = -Infinity;

        rows.forEach((row) => {

            const value = Number(row["ABD Population"]);

            if (value > maximumPopulation) {
                maximumPopulation = value;
            }

        });

        console.log("Maximum Population:", maximumPopulation);

        // -------------------------------
        // Report Object
        // -------------------------------
        const report = {

            totalRows: rows.length,

            totalColumns: columns.length,

            columnNames: columns,

            uniqueCities: cities.size,

            missingPopulation,

            minimumPopulation,

            maximumPopulation

        };

        // -------------------------------
        // Save JSON Report
        // -------------------------------
        fs.writeFileSync(

            "./reports/population_profile.json",

            JSON.stringify(report, null, 4)

        );

        console.log("\nReport saved successfully!");
        console.log("Location: reports/population_profile.json");

    });