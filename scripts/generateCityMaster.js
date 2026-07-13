const fs = require("fs");
const csv = require("csv-parser");
const { createObjectCsvWriter } = require("csv-writer");
const cityStateMap = require("../config/cityStateMap");

const pollution1File = "./raw_data/pollution.csv";
const pollution2File = "./raw_data/pollution2.csv";
const populationFile = "./raw_data/population.csv";

if (!fs.existsSync("./generated")) {
    fs.mkdirSync("./generated");
}

const cityMap = new Map();

function normalizeCity(city) {
    if (!city) return null;

    return city
        .trim()
        .toLowerCase()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

function processFile(filePath, cityColumn, source) {

    return new Promise((resolve, reject) => {

        fs.createReadStream(filePath)
            .pipe(csv())

            .on("data", row => {

                const city = normalizeCity(row[cityColumn]);

                if (!city) return;

                if (!cityMap.has(city)) {

                    cityMap.set(city, {

                        city,

                        state: cityStateMap[city] || "Unknown",

                        source

                    });

                }

            })

            .on("end", resolve)

            .on("error", reject);

    });

}

async function generate() {

    console.log("Reading Pollution Dataset 1...");

    await processFile(
        pollution1File,
        "City",
        "Pollution1"
    );

    console.log("Reading Pollution Dataset 2...");

    await processFile(
        pollution2File,
        "city",
        "Pollution2"
    );

    console.log("Reading Population Dataset...");

    await processFile(
        populationFile,
        "City",
        "Population"
    );

    const records = Array.from(cityMap.values());

    records.sort((a, b) => a.city.localeCompare(b.city));

    const writer = createObjectCsvWriter({

        path: "./generated/city_master.csv",

        header: [

            { id: "city", title: "city" },

            { id: "state", title: "state" },

            { id: "source", title: "source" }

        ]

    });

    await writer.writeRecords(records);

    console.log("--------------------------------");

    console.log("City Master Generated Successfully!");

    console.log("Total Cities :", records.length);

    console.log("Location : generated/city_master.csv");

}

generate();