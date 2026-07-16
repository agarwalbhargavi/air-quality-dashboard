const fs = require("fs");
const path = require("path");
const logger = require("./logger");

async function archiveFile(filePath, agency) {

    return new Promise((resolve, reject) => {

        try {

            const archiveFolder = path.join("./archive", agency);

            // Automatically creates archive/agencyA, archive/agencyB etc.
            fs.mkdirSync(archiveFolder, { recursive: true });

            const now = new Date();

            const timestamp =
                now.getFullYear() +
                String(now.getMonth() + 1).padStart(2, "0") +
                String(now.getDate()).padStart(2, "0") +
                "_" +
                String(now.getHours()).padStart(2, "0") +
                String(now.getMinutes()).padStart(2, "0") +
                String(now.getSeconds()).padStart(2, "0");

            const destination = path.join(

                archiveFolder,

                `${timestamp}_${path.basename(filePath)}`

            );

            fs.renameSync(filePath, destination);

            logger.info(`File Archived Successfully`);
            logger.info(`Archived To : ${destination}`);

            resolve(destination);

        }

        catch (err) {

            logger.error(err.message);

            reject(err);

        }

    });

}

module.exports = archiveFile;