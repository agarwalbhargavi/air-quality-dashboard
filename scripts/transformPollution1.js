const fs = require("fs");
const csv = require("csv-parser");
const { createObjectCsvWriter } = require("csv-writer");
const cityStateMap = require("../config/cityStateMap");

const inputFile = "./cleaned_data/pollution1_clean.csv";
const outputDir = "./transformed_data";
const outputFile = "./transformed_data/pollution1_transformed.csv";

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

const rows = [];

function getSeason(month) {
    if (month === 12 || month === 1 || month === 2) {
        return "Winter";
    }

    if (month >= 3 && month <= 5) {
        return "Summer";
    }

    if (month >= 6 && month <= 9) {
        return "Monsoon";
    }

    return "Post-Monsoon";
}

fs.createReadStream(inputFile)

.pipe(csv())

.on("data", (row) => {

    const date = new Date(row.Date);

    const year = date.getFullYear();

    const month = date.getMonth() + 1;

    const quarter = Math.ceil(month / 3);

    const season = getSeason(month);

    rows.push({

        city: row.City,

        state: cityStateMap[row.City] || "Unknown",

        station: "",

        latitude: "",

        longitude: "",

        pollution_date: row.Date,

        year: year,

        month: month,

        quarter: quarter,

        season: season,

        pm25: row["PM2.5"] || "",

        pm10: row.PM10 || "",

        no: row.NO || "",

        no2: row.NO2 || "",

        nox: row.NOx || "",

        nh3: row.NH3 || "",

        co: row.CO || "",

        so2: row.SO2 || "",

        o3: row.O3 || "",

        benzene: row.Benzene || "",

        toluene: row.Toluene || "",

        xylene: row.Xylene || "",

        aqi: row.AQI || "",

        aqi_bucket: row.AQI_Bucket || "",

        source: "Historical"

    });

})

.on("end", async () => {
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

    console.log("Transformation Completed Successfully!");

    console.log("Rows Written :", rows.length);

    console.log("Output :", outputFile);

})

.on("error",(err)=>{

    console.error("Transformation Failed");

    console.error(err);

});