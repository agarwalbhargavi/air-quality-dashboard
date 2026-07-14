const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { createObjectCsvWriter } = require("csv-writer");

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

async function cleanSchemaA(inputFile){

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

                City: cleanValue(row.City),

                Date: cleanValue(row.Date),

                "PM2.5": cleanValue(row["PM2.5"]),

                PM10: cleanValue(row.PM10),

                NO: cleanValue(row.NO),

                NO2: cleanValue(row.NO2),

                NOx: cleanValue(row.NOx),

                NH3: cleanValue(row.NH3),

                CO: cleanValue(row.CO),

                SO2: cleanValue(row.SO2),

                O3: cleanValue(row.O3),

                Benzene: cleanValue(row.Benzene),

                Toluene: cleanValue(row.Toluene),

                Xylene: cleanValue(row.Xylene),

                AQI: cleanValue(row.AQI),

                AQI_Bucket: cleanValue(row.AQI_Bucket)

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

                        {id:"City",title:"City"},
                        {id:"Date",title:"Date"},
                        {id:"PM2.5",title:"PM2.5"},
                        {id:"PM10",title:"PM10"},
                        {id:"NO",title:"NO"},
                        {id:"NO2",title:"NO2"},
                        {id:"NOx",title:"NOx"},
                        {id:"NH3",title:"NH3"},
                        {id:"CO",title:"CO"},
                        {id:"SO2",title:"SO2"},
                        {id:"O3",title:"O3"},
                        {id:"Benzene",title:"Benzene"},
                        {id:"Toluene",title:"Toluene"},
                        {id:"Xylene",title:"Xylene"},
                        {id:"AQI",title:"AQI"},
                        {id:"AQI_Bucket",title:"AQI_Bucket"}

                    ]

                });

                await writer.writeRecords(rows);

                console.log("--------------------------------");

                console.log("Schema A Cleaning Completed");

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

module.exports=cleanSchemaA;