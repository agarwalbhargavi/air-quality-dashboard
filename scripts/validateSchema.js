const fs = require("fs");
const csv = require("csv-parser");

const schemaDefinition = require("../config/schemaDefinition");
const logger = require("./logger");

async function validateSchema(inputFile, schemaName) {

    return new Promise((resolve, reject) => {

        const expectedColumns = schemaDefinition[schemaName];

        if (!expectedColumns) {

            logger.error(`Schema '${schemaName}' not found.`);

            return reject(
                new Error(`Schema '${schemaName}' not found.`)
            );

        }

        let schemaChecked = false;

        fs.createReadStream(inputFile)

            .pipe(csv())

            .on("headers", (headers) => {

                schemaChecked = true;

                logger.info("--------------------------------");
                logger.info(`Validating Schema : ${schemaName}`);
                logger.info(`File : ${inputFile}`);

                const missingColumns = expectedColumns.filter(
                    column => !headers.includes(column)
                );

                if (missingColumns.length > 0) {

                    logger.error(
                        `Schema Validation Failed`
                    );

                    logger.error(
                        `Missing Columns : ${missingColumns.join(", ")}`
                    );

                    return reject(
                        new Error(
                            `Missing Columns : ${missingColumns.join(", ")}`
                        )
                    );

                }

                logger.info("Schema Validation Passed");

                resolve(true);

            })

            .on("end", () => {

                if (!schemaChecked) {

                    logger.warning("CSV File is Empty");

                }

            })

            .on("error", (err) => {

                logger.error(err.message);

                reject(err);

            });

    });

}

module.exports = validateSchema;