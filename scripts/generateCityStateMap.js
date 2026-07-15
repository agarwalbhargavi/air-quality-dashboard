const fs = require("fs");
const csv = require("csv-parser");

const cityStateMap = {};

fs.createReadStream("./raw_data/city-state-mapping.csv")
    .pipe(csv())
    .on("data", (row) => {

        const city = (row.City || row.city || "").trim();
        const state = (row.State || row.state || "").trim();

        if (city && state) {
            cityStateMap[city] = state;
        }

    })
    .on("end", () => {

        const output =
`module.exports = ${JSON.stringify(cityStateMap, null, 4)};`;

        fs.writeFileSync(
            "./config/cityStateMap.js",
            output
        );

        console.log("--------------------------------");
        console.log("cityStateMap.js generated successfully!");
        console.log("Total Cities :", Object.keys(cityStateMap).length);
        console.log("Output : ./config/cityStateMap.js");

    });