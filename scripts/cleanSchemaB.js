const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { createObjectCsvWriter } = require("csv-writer");

function cleanValue(value){

    if(value === undefined || value === null)
        return "";

    value = String(value).trim();

    if(
        value === "" ||
        value.toLowerCase() === "na" ||
        value.toLowerCase() === "null" ||
        value.toLowerCase() === "undefined"
    ){
        return "";
    }

    return value;

}

async function cleanSchemaB(inputFile){

    return new Promise((resolve,reject)=>{

        const outputDir="./cleaned_data";

        if(!fs.existsSync(outputDir)){
            fs.mkdirSync(outputDir);
        }

        const agencyFolder = path.basename(path.dirname(inputFile));

        const outputFile = path.join(
            outputDir,
            `${agencyFolder}_${path.basename(inputFile).replace(".csv","_clean.csv")}`
        );

        const rows=[];

        const duplicateChecker=new Set();

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

            try{

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

                console.log("Schema B Cleaning Completed");

                console.log("Rows Written :",rows.length);

                console.log("Output :",outputFile);

                resolve(outputFile);

            }

            catch(err){

                reject(err);

            }

        })

        .on("error",(err)=>{

            reject(err);

        });

    });

}

module.exports = cleanSchemaB;