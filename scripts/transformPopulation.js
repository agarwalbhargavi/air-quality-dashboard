const fs = require("fs");
const csv = require("csv-parser");
const { createObjectCsvWriter } = require("csv-writer");

if (!fs.existsSync("./transformed_data")) {
    fs.mkdirSync("./transformed_data");
}

const transformedRows = [];

fs.createReadStream("./cleaned_data/population_clean.csv")
.pipe(csv())

.on("data",(row)=>{

    const population = Number(row.Population);
    const area = Number(row.Area);
    const density = Number(row.Density);

    let category="";

    if(population<1000000)
        category="Small";

    else if(population<5000000)
        category="Medium";

    else
        category="Large";

    transformedRows.push({

        city:row.City,

        population,

        area,

        density,

        population_category:category

    });

})

.on("end",async()=>{

    const writer=createObjectCsvWriter({

        path:"./transformed_data/population_transformed.csv",

        header:[

    {id:"city",title:"city"},

    {id:"population",title:"population"},

    {id:"area",title:"area"},

    {id:"density",title:"density"},

    {id:"population_category",title:"population_category"}

]

    });

    await writer.writeRecords(transformedRows);

    console.log("Population Transformation Completed");

});