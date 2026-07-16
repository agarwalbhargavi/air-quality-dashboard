const fs = require("fs");
const path = require("path");
require("dotenv").config();
const createFolders = require("./createFolders");
const config = require("../config/schemaConfig.json");

const logger = require("./logger");
const archiveFile = require("./archiveFile");

const validateSchema = require("./validateSchema");
const importPollution = require("./importPollution");

const cleanSchemaA = require("./cleanSchemaA");
const cleanSchemaB = require("./cleanSchemaB");

const transformSchemaA = require("./transformSchemaA");
const transformSchemaB = require("./transformSchemaB");

async function processFiles() {

    createFolders();

    logger.info("========================================");
    logger.info("Starting ETL Process...");
    logger.info("========================================");

    for (const source of config.sources) {

        const inputFolder = path.join(
            process.env.DROP_FOLDER,
            source.folder
        );

        logger.info("========================================");
        logger.info(`Agency : ${source.agency}`);
        logger.info(`Schema : ${source.schema}`);
        logger.info(`Folder : ${inputFolder}`);

        if (!fs.existsSync(inputFolder)) {

            logger.warning("Folder does not exist.");

            continue;

        }

        const files = fs.readdirSync(inputFolder);

        if (files.length === 0) {

            logger.info("No files found.");

            continue;

        }

        for (const file of files) {

            const fullPath = path.join(inputFolder, file);

            logger.info("----------------------------------------");
            logger.info(`Processing File : ${fullPath}`);

            try {

                // STEP 1 : Schema Validation

                await validateSchema(fullPath, source.schema);

                let cleanedFile;
                let transformedFile;

                switch (source.schema) {

                    case "SchemaA":

                        cleanedFile = await cleanSchemaA(fullPath);

                        transformedFile = await transformSchemaA(cleanedFile);

                        await importPollution(transformedFile);

                        break;

                    case "SchemaB":

                        cleanedFile = await cleanSchemaB(fullPath);

                        transformedFile = await transformSchemaB(cleanedFile);

                        await importPollution(transformedFile);

                        break;

                    default:

                        logger.warning(
                            `Unsupported Schema : ${source.schema}`
                        );

                        continue;

                }

                // STEP 5 : Archive Processed File

                await archiveFile(fullPath, source.agency);

                logger.info("----------------------------------------");
                logger.info("File Processed Successfully");
                logger.info(`Clean File : ${cleanedFile}`);
                logger.info(`Transformed File : ${transformedFile}`);

            }

            catch (err) {

                logger.error("----------------------------------------");
                logger.error("Processing Failed");
                logger.error(err.message);

            }

        }

    }

    logger.info("========================================");
    logger.info("ETL Process Completed");
    logger.info("========================================");

}

processFiles();