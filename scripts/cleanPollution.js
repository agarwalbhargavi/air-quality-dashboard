const fs = require("fs");
const csv = require("csv-parser");
const { createObjectCsvWriter } = require("csv-writer");


if (!fs.existsSync("./cleaned_data")) {
    fs.mkdirSync("./cleaned_data");
}

const cleanedRows = [];

let totalRows = 0;
let duplicateRows = 0;
let invalidDates = 0;
let missingCities = 0;

const duplicateCheck = new Set();

fs.createReadStream("./raw_data/pollution.csv")
.pipe(csv())

.on("data",(row)=>{

    totalRows++;

    

    let city = row.City?.trim();

    if(!city){

        missingCities++;

        return;

    }

    city =
        city
        .toLowerCase()
        .split(" ")
        .map(word=>word.charAt(0).toUpperCase()+word.slice(1))
        .join(" ");

   

    const date = new Date(row.Date);

    if(isNaN(date)){

        invalidDates++;

        return;

    }



    const key = city + "-" + row.Date;

    if(duplicateCheck.has(key)){

        duplicateRows++;

        return;

    }

    duplicateCheck.add(key);



    const toNumber = (value)=>{

        if(value===undefined || value===null || value==="")
            return null;

        const number = Number(value);

        return isNaN(number) ? null : number;

    };

    cleanedRows.push({

        City: city,

        Date: row.Date,

        "PM2.5": toNumber(row["PM2.5"]),

        PM10: toNumber(row.PM10),

        NO: toNumber(row.NO),

        NO2: toNumber(row.NO2),

        NOx: toNumber(row.NOx),

        NH3: toNumber(row.NH3),

        CO: toNumber(row.CO),

        SO2: toNumber(row.SO2),

        O3: toNumber(row.O3),

        Benzene: toNumber(row.Benzene),

        Toluene: toNumber(row.Toluene),

        Xylene: toNumber(row.Xylene),

        AQI: toNumber(row.AQI),

        AQI_Bucket: row.AQI_Bucket || null

    });

})

.on("end",async()=>{

    const writer = createObjectCsvWriter({

        path:"./cleaned_data/pollution_clean.csv",

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

    await writer.writeRecords(cleanedRows);
    console.log("\n CLEANING REPORT \n");
    console.log("Total Rows :",totalRows);
    console.log("Clean Rows :",cleanedRows.length);
    console.log("Missing Cities :",missingCities);
    console.log("Invalid Dates :",invalidDates);
    console.log("Duplicate Rows :",duplicateRows);
    console.log("\nCleaned CSV Generated Successfully.");

});