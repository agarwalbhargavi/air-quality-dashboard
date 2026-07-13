const fs = require("fs");
const csv = require("csv-parser");
const { createObjectCsvWriter } = require("csv-writer");

const outputDir = "./transformed_data";
const outputFile = "./transformed_data/pollution_final.csv";

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

const rows = [];

function readCSV(filePath) {
    return new Promise((resolve, reject) => {

        fs.createReadStream(filePath)
            .pipe(csv())

            .on("data", (row) => {

                rows.push(row);

            })

            .on("end", resolve)

            .on("error", reject);

    });
}

async function mergeDatasets() {

    try {

        console.log("Reading pollution1_transformed.csv...");

        await readCSV("./transformed_data/pollution1_transformed.csv");

        console.log("Reading pollution2_transformed.csv...");

        await readCSV("./transformed_data/pollution2_transformed.csv");

        console.log(`Total Rows : ${rows.length}`);

        const writer = createObjectCsvWriter({

            path: outputFile,

            header: [

                { id: "city", title: "city" },
                { id: "state", title: "state" },
                { id: "station", title: "station" },
                { id: "latitude", title: "latitude" },
                { id: "longitude", title: "longitude" },

                { id: "pollution_date", title: "pollution_date" },

                { id: "year", title: "year" },
                { id: "month", title: "month" },
                { id: "quarter", title: "quarter" },
                { id: "season", title: "season" },

                { id: "pm25", title: "pm25" },
                { id: "pm10", title: "pm10" },
                { id: "no", title: "no" },
                { id: "no2", title: "no2" },
                { id: "nox", title: "nox" },
                { id: "nh3", title: "nh3" },
                { id: "co", title: "co" },
                { id: "so2", title: "so2" },
                { id: "o3", title: "o3" },

                { id: "benzene", title: "benzene" },
                { id: "toluene", title: "toluene" },
                { id: "xylene", title: "xylene" },

                { id: "aqi", title: "aqi" },
                { id: "aqi_bucket", title: "aqi_bucket" },

                { id: "source", title: "source" }

            ]

        });

        await writer.writeRecords(rows);

        console.log("--------------------------------");

        console.log("Merge Completed Successfully!");

        console.log("Rows Written :", rows.length);

        console.log("Output :", outputFile);

    }

    catch (err) {

        console.error("Merge Failed");

        console.error(err);

    }

}

mergeDatasets();