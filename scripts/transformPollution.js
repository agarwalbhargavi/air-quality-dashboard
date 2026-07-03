const fs = require("fs");
const csv = require("csv-parser");
const { createObjectCsvWriter } = require("csv-writer");


if (!fs.existsSync("./transformed_data")) {
    fs.mkdirSync("./transformed_data");
}

const transformedRows = [];

fs.createReadStream("./cleaned_data/pollution_clean.csv")
.pipe(csv())

.on("data",(row)=>{

    const date = new Date(row.Date);

    const year = date.getFullYear();

    const month = date.getMonth() + 1;

    const day = date.getDate();

    const quarter = Math.ceil(month / 3);

    let season = "";

    if(month === 11 || month === 12 || month === 1 || month === 2){

        season = "Winter";

    }
    else if(month === 3 || month === 4 || month === 5 || month === 6){

        season = "Summer";

    }
    else{

        season = "Monsoon";

    }

    transformedRows.push({

        City : row.City,

        Date : row.Date,

        Year : year,

        Month : month,

        Day : day,

        Quarter : quarter,

        Season : season,

        "PM2.5" : row["PM2.5"],

        PM10 : row.PM10,

        NO : row.NO,

        NO2 : row.NO2,

        NOx : row.NOx,

        NH3 : row.NH3,

        CO : row.CO,

        SO2 : row.SO2,

        O3 : row.O3,

        Benzene : row.Benzene,

        Toluene : row.Toluene,

        Xylene : row.Xylene,

        AQI : row.AQI,

        AQI_Bucket : row.AQI_Bucket

    });

})

.on("end",async()=>{

    const writer = createObjectCsvWriter({

        path:"./transformed_data/pollution_transformed.csv",

        header:[

            {id:"City",title:"City"},
            {id:"Date",title:"Date"},
            {id:"Year",title:"Year"},
            {id:"Month",title:"Month"},
            {id:"Day",title:"Day"},
            {id:"Quarter",title:"Quarter"},
            {id:"Season",title:"Season"},

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

    await writer.writeRecords(transformedRows);

    console.log("\n========== TRANSFORMATION REPORT ==========\n");

    console.log("Rows Transformed :", transformedRows.length);

    console.log("Transformation Completed Successfully!");

});