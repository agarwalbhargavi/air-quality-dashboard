const fs = require("fs");
const csv = require("csv-parser");

const schemaDefinition =
require("../config/schemaDefinition");

async function validateSchema(filePath,schema){

    return new Promise((resolve,reject)=>{

        const expectedColumns =
        schemaDefinition[schema];

        let validated=false;

        fs.createReadStream(filePath)

        .pipe(csv())

        .on("headers",(headers)=>{

            validated=true;

            const missingColumns = expectedColumns.filter(

                col=>!headers.includes(col)

            );

            if(missingColumns.length>0){

                reject(

                    new Error(

                        `Missing Columns : ${missingColumns.join(", ")}`

                    )

                );

            }

            else{

                resolve(true);

            }

        })

        .on("error",(err)=>{

            reject(err);

        });

    });

}

module.exports=validateSchema;