const fs = require("fs");
const path = require("path");
const archiveFile = require("./archiveFile");
const logger = require("./logger");
const config = require("../config/schemaConfig.json");
const importPollution = require("./importPollution");
const validateSchema = require("./validateSchema");

const cleanSchemaA = require("./cleanSchemaA");
const cleanSchemaB = require("./cleanSchemaB");

const transformSchemaA = require("./transformSchemaA");
const transformSchemaB = require("./transformSchemaB");

async function processFiles() {

    console.log("========================================");
    console.log("Starting ETL Process...");
    console.log("========================================");

    for (const source of config.sources) {

        console.log("\n========================================");
        console.log("Agency :", source.agency);
        console.log("Schema :", source.schema);
        console.log("Folder :", source.inputFolder);

        if (!fs.existsSync(source.inputFolder)) {

            logger.info("Folder does not exist.");
            continue;

        }

        const files = fs.readdirSync(source.inputFolder);

        if (files.length === 0) {

            logger.info("No files found.");
            continue;

        }

        for (const file of files) {

            const fullPath = path.join(source.inputFolder, file);

            console.log("\n----------------------------------------");
            console.log("Processing File :", fullPath);

            try {

                // STEP 1 : Validate Schema

                await validateSchema(fullPath, source.schema);

                console.log("Schema Validation Passed");

                let cleanedFile;
                let transformedFile;

                switch (source.schema) {

                    case "SchemaA":

                        // STEP 2 : Cleaning

                       cleanedFile = await cleanSchemaA(fullPath);

transformedFile = await transformSchemaA(cleanedFile);

await importPollution(transformedFile);

                        break;

                    case "SchemaB":

                        // STEP 2 : Cleaning

                        cleanedFile = await cleanSchemaB(fullPath);

                        // STEP 3 : Transformation

                        transformedFile = await transformSchemaB(cleanedFile);
                        await importPollution(transformedFile);
                        break;

                    default:

                        logger.info("Unsupported Schema :", source.schema);
                        continue;

                }

                console.log("----------------------------------------");
                await archiveFile(fullPath, source.agency);
                console.log("File Processed Successfully");
                console.log("Clean File      :", cleanedFile);
                console.log("Transformed File:", transformedFile);

            }

            catch (err) {

                console.log("----------------------------------------");
                logger.info("Processing Failed");
                logger.error(err.message);

            }

        }

    }

    console.log("\n========================================");
    console.log("ETL Process Completed");
    console.log("========================================");

}

processFiles();