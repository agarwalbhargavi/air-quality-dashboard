const fs = require("fs");
const path = require("path");
require("dotenv").config();

const logger = require("./logger");

async function rejectFile(filePath, folder) {

    return new Promise((resolve, reject) => {

        try {

            const rejectedFolder = path.join(
                process.env.REJECTED_FOLDER,
                folder
            );

            // Create folder if it doesn't exist
            fs.mkdirSync(rejectedFolder, { recursive: true });

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
                rejectedFolder,
                `${timestamp}_${path.basename(filePath)}`
            );

            fs.renameSync(filePath, destination);

            logger.error(`File moved to rejected folder : ${destination}`);

            resolve(destination);

        }

        catch (err) {

            logger.error(err.message);

            reject(err);

        }

    });

}

module.exports = rejectFile;