const fs = require("fs");
const path = require("path");

async function archiveFile(filePath, agency) {

    return new Promise((resolve, reject) => {

        try {

            const archiveFolder = path.join("./archive", agency);

            // Create archive folder if it doesn't exist
            if (!fs.existsSync("./archive")) {
                fs.mkdirSync("./archive");
            }

            if (!fs.existsSync(archiveFolder)) {
                fs.mkdirSync(archiveFolder);
            }

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

            console.log("--------------------------------");
            console.log("File Archived Successfully");
            console.log("Archived To :", destination);

            resolve(destination);

        }

        catch (err) {

            reject(err);

        }

    });

}

module.exports = archiveFile;