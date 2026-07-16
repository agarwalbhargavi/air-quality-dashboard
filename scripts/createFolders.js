const fs = require("fs");
const path = require("path");
require("dotenv").config();

const config = require("../config/schemaConfig.json");

function createFolders() {

    // Create main runtime folders

    fs.mkdirSync(process.env.DROP_FOLDER, { recursive: true });

    fs.mkdirSync(process.env.ARCHIVE_FOLDER, { recursive: true });

    fs.mkdirSync(process.env.REJECTED_FOLDER, { recursive: true });

    fs.mkdirSync(process.env.LOG_FOLDER, { recursive: true });

    // Create agency-wise folders

    for (const source of config.sources) {

        const dropAgencyFolder = path.join(
            process.env.DROP_FOLDER,
            source.folder
        );

        const archiveAgencyFolder = path.join(
            process.env.ARCHIVE_FOLDER,
            source.folder
        );

        const rejectedAgencyFolder = path.join(
            process.env.REJECTED_FOLDER,
            source.folder
        );

        fs.mkdirSync(dropAgencyFolder, { recursive: true });

        fs.mkdirSync(archiveAgencyFolder, { recursive: true });

        fs.mkdirSync(rejectedAgencyFolder, { recursive: true });

    }

}

module.exports = createFolders;