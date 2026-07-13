const fs = require("fs");
const csv = require("csv-parser");

if (!fs.existsSync("./reports")) {
    fs.mkdirSync("./reports");
}

const rows = [];

fs.createReadStream("./raw_data/pollution2.csv")
    .pipe(csv())

    .on("data", (row) => {
        rows.push(row);
    })

    .on("end", () => {

        console.log("\n========== POLLUTION DATASET 2 PROFILE ==========\n");

        console.log("Total Rows :", rows.length);

        const columns = Object.keys(rows[0]);

        console.log("Total Columns :", columns.length);

        console.log("\nColumns:");

        columns.forEach(column => {
            console.log("-", column);
        });

        // ---------- Unique Countries ----------

        const countries = new Set();

        rows.forEach(row => {

            if(row.country)
                countries.add(row.country.trim());

        });

        console.log("\nUnique Countries :", countries.size);

        // ---------- Unique States ----------

        const states = new Set();

        rows.forEach(row => {

            if(row.state)
                states.add(row.state.trim());

        });

        console.log("Unique States :", states.size);

        // ---------- Unique Cities ----------

        const cities = new Set();

        rows.forEach(row => {

            if(row.city)
                cities.add(row.city.trim());

        });

        console.log("Unique Cities :", cities.size);

        // ---------- Unique Stations ----------

        const stations = new Set();

        rows.forEach(row => {

            if(row.station)
                stations.add(row.station.trim());

        });

        console.log("Unique Stations :", stations.size);

        // ---------- Missing Values ----------

        const missing = {};

        columns.forEach(column => {

            missing[column] = 0;

        });

        rows.forEach(row => {

            columns.forEach(column => {

                if(
                    row[column] === "" ||
                    row[column] === null ||
                    row[column] === undefined
                ){

                    missing[column]++;

                }

            });

        });

        console.log("\n========== MISSING VALUES ==========\n");

        console.table(missing);

        // ---------- Duplicate Records ----------

        const seen = new Set();

        let duplicates = 0;

        rows.forEach(row => {

            const key =
                `${row.city}-${row.station}-${row.last_update}-${row.pollutant_id}`;

            if(seen.has(key)){

                duplicates++;

            }
            else{

                seen.add(key);

            }

        });

        console.log("\nDuplicate Records :", duplicates);

        // ---------- Date Range ----------

        const dates = rows

            .map(row => new Date(row.last_update))

            .filter(date => !isNaN(date));

        const earliest = new Date(Math.min(...dates));

        const latest = new Date(Math.max(...dates));

        console.log("\nEarliest Reading :", earliest);

        console.log("Latest Reading :", latest);

        // ---------- Pollutant Distribution ----------

        const pollutantCount = {};

        rows.forEach(row => {

            const pollutant = row.pollutant_id;

            if(!pollutantCount[pollutant]){

                pollutantCount[pollutant] = 0;

            }

            pollutantCount[pollutant]++;

        });

        console.log("\n========== POLLUTANT DISTRIBUTION ==========\n");

        console.table(pollutantCount);

        // ---------- Average Pollutant Values ----------

        const pollutantStats = {};

        rows.forEach(row => {

            const pollutant = row.pollutant_id;

            const value = Number(row.pollutant_avg);

            if(isNaN(value))
                return;

            if(!pollutantStats[pollutant]){

                pollutantStats[pollutant] = {

                    count:0,

                    sum:0,

                    min:value,

                    max:value

                };

            }

            pollutantStats[pollutant].count++;

            pollutantStats[pollutant].sum += value;

            pollutantStats[pollutant].min =
                Math.min(pollutantStats[pollutant].min,value);

            pollutantStats[pollutant].max =
                Math.max(pollutantStats[pollutant].max,value);

        });

        console.log("\n========== POLLUTANT STATISTICS ==========\n");

        Object.keys(pollutantStats).forEach(pollutant=>{

            const stats = pollutantStats[pollutant];

            console.log(pollutant);

            console.log("Count :",stats.count);

            console.log("Minimum :",stats.min);

            console.log("Maximum :",stats.max);

            console.log(
                "Average :",
                (stats.sum/stats.count).toFixed(2)
            );

            console.log("-----------------------------");

        });

        // ---------- Save Report ----------

        const report = {

            totalRows:rows.length,

            totalColumns:columns.length,

            columns,

            uniqueCountries:countries.size,

            uniqueStates:states.size,

            uniqueCities:cities.size,

            uniqueStations:stations.size,

            duplicateRecords:duplicates,

            earliestReading:earliest,

            latestReading:latest,

            missingValues:missing,

            pollutantDistribution:pollutantCount

        };

        fs.writeFileSync(

            "./reports/pollution2_profile.json",

            JSON.stringify(report,null,4)

        );

        console.log("\nProfile Saved Successfully!");

        console.log("Location : reports/pollution2_profile.json");

    });