const fs = require("fs");
const csv = require("csv-parser");
const schemaDefinition = require("../config/schemaDefinition");
const logger = require("./logger");

async function validateSchema(inputFile, schemaName) {

    return new Promise((resolve, reject) => {

        const expectedColumns = schemaDefinition[schemaName];

        if (!expectedColumns) {

            logger.error(`Schema '${schemaName}' not found.`);

            return reject(new Error(`Schema '${schemaName}' not found.`));

        }

        let checked = false;

        fs.createReadStream(inputFile)

            .pipe(csv())

            .on("headers", (headers) => {

                checked = true;

                logger.info(`Validating Schema : ${schemaName}`);
                logger.info(`File : ${inputFile}`);

                const missingColumns = expectedColumns.filter(
                    column => !headers.includes(column)
                );

                if (missingColumns.length > 0) {

                    logger.error(
                        `Schema Validation Failed. Missing Columns : ${missingColumns.join(", ")}`
                    );

                    reject(
                        new Error(
                            `Missing Columns : ${missingColumns.join(", ")}`
                        )
                    );

                    return;

                }

                logger.info("Schema Validation Passed");

                resolve(true);

            })

            .on("end", () => {

                if (!checked) {

                    logger.warning("Empty CSV File");

                }

            })

            .on("error", (err) => {

                logger.error(err.message);

                reject(err);

            });

    });

}

module.exports = validateSchema;