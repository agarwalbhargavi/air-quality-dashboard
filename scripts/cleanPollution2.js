const fs = require("fs");
const csv = require("csv-parser");
const { createObjectCsvWriter } = require("csv-writer");

const inputFile = "./raw_data/pollution2.csv";
const outputDir = "./cleaned_data";
const outputFile = "./cleaned_data/pollution2_clean.csv";

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

const rows = [];
const duplicateChecker = new Set();

function cleanValue(value) {
    if (value === undefined || value === null) return "";

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

.on("data",(row)=>{

    const cleanedRow={

        city:cleanValue(row.city),

        station:cleanValue(row.station),

        pollutant_id:cleanValue(row.pollutant_id),

        pollutant_avg:cleanValue(row.pollutant_avg),

        latitude:cleanValue(row.latitude),

        longitude:cleanValue(row.longitude),

        last_update:cleanValue(row.last_update)

    };

    const key=JSON.stringify(cleanedRow);

    if(!duplicateChecker.has(key)){

        duplicateChecker.add(key);

        rows.push(cleanedRow);

    }

})

.on("end",async()=>{

    const writer=createObjectCsvWriter({

        path:outputFile,

        header:[

            {id:"city",title:"city"},

            {id:"station",title:"station"},

            {id:"pollutant_id",title:"pollutant_id"},

            {id:"pollutant_avg",title:"pollutant_avg"},

            {id:"latitude",title:"latitude"},

            {id:"longitude",title:"longitude"},

            {id:"last_update",title:"last_update"}

        ]

    });

    await writer.writeRecords(rows);

    console.log("--------------------------------");

    console.log("Cleaning Completed Successfully!");

    console.log("Rows :",rows.length);

    console.log("Output :",outputFile);

});