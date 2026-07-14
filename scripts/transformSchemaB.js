const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { createObjectCsvWriter } = require("csv-writer");

function getSeason(month) {

    if(month === 12 || month === 1 || month === 2)
        return "Winter";

    if(month >= 3 && month <= 5)
        return "Summer";

    if(month >= 6 && month <= 9)
        return "Monsoon";

    return "Post-Monsoon";
}

async function transformSchemaB(inputFile){

    return new Promise((resolve,reject)=>{

        const outputDir="./transformed_data";

        if(!fs.existsSync(outputDir)){
            fs.mkdirSync(outputDir);
        }

        const agencyFolder = path.basename(path.dirname(inputFile));

const originalName = path.basename(inputFile)
    .replace("_clean", "");

const outputFile = path.join(
    outputDir,
    `${agencyFolder}_${originalName.replace(".csv","_transformed.csv")}`
);

        const grouped={};

        fs.createReadStream(inputFile)

        .pipe(csv())

        .on("data",(row)=>{

            const key =
                row.city + "|" +
                row.station + "|" +
                row.last_update;

            if(!grouped[key]){

                const date = new Date(row.last_update);

                const year = date.getFullYear();

                const month = date.getMonth()+1;

                const quarter = Math.ceil(month/3);

                const season = getSeason(month);

                grouped[key]={

                    city:row.city,

                    state:row.state,

                    station:row.station,

                    latitude:row.latitude,

                    longitude:row.longitude,

                    pollution_date:row.last_update,

                    year:year,

                    month:month,

                    quarter:quarter,

                    season:season,

                    pm25:"",

                    pm10:"",

                    no:"",

                    no2:"",

                    nox:"",

                    nh3:"",

                    co:"",

                    so2:"",

                    o3:"",

                    benzene:"",

                    toluene:"",

                    xylene:"",

                    aqi:"",

                    aqi_bucket:"",

                    source:"Realtime"

                };

            }

            switch(row.pollutant_id){

                case "PM2.5":
                    grouped[key].pm25=row.pollutant_avg;
                    break;

                case "PM10":
                    grouped[key].pm10=row.pollutant_avg;
                    break;

                case "CO":
                    grouped[key].co=row.pollutant_avg;
                    break;

                case "NO2":
                    grouped[key].no2=row.pollutant_avg;
                    break;

                case "SO2":
                    grouped[key].so2=row.pollutant_avg;
                    break;

                case "NH3":
                    grouped[key].nh3=row.pollutant_avg;
                    break;

                case "OZONE":
                    grouped[key].o3=row.pollutant_avg;
                    break;

            }

        })

        .on("end",async()=>{

            try{

                const rows = Object.values(grouped);

                const writer = createObjectCsvWriter({

                    path:outputFile,

                    header:[

                        { id:"city",title:"city"},
                        { id:"state",title:"state"},
                        { id:"station",title:"station"},
                        { id:"latitude",title:"latitude"},
                        { id:"longitude",title:"longitude"},
                        { id:"pollution_date",title:"pollution_date"},
                        { id:"year",title:"year"},
                        { id:"month",title:"month"},
                        { id:"quarter",title:"quarter"},
                        { id:"season",title:"season"},
                        { id:"pm25",title:"pm25"},
                        { id:"pm10",title:"pm10"},
                        { id:"no",title:"no"},
                        { id:"no2",title:"no2"},
                        { id:"nox",title:"nox"},
                        { id:"nh3",title:"nh3"},
                        { id:"co",title:"co"},
                        { id:"so2",title:"so2"},
                        { id:"o3",title:"o3"},
                        { id:"benzene",title:"benzene"},
                        { id:"toluene",title:"toluene"},
                        { id:"xylene",title:"xylene"},
                        { id:"aqi",title:"aqi"},
                        { id:"aqi_bucket",title:"aqi_bucket"},
                        { id:"source",title:"source"}

                    ]

                });

                await writer.writeRecords(rows);

                console.log("--------------------------------");

                console.log("Schema B Transformation Completed");

                console.log("Rows Written :",rows.length);

                console.log("Output :",outputFile);

                resolve(outputFile);

            }

            catch(err){

                reject(err);

            }

        })

        .on("error",(err)=>{

            console.error("Transformation Failed");

            reject(err);

        });

    });

}

module.exports = transformSchemaB;