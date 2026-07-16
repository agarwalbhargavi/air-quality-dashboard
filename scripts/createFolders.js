const fs = require("fs");
const path = require("path");
require("dotenv").config();

const config = require("../config/schemaConfig.json");

function createFolders() {

    // Create Drop Folder
    fs.mkdirSync(process.env.DROP_FOLDER, { recursive: true });

    // Create Archive Folder
    fs.mkdirSync(process.env.ARCHIVE_FOLDER, { recursive: true });

    // Create Log Folder
    fs.mkdirSync(process.env.LOG_FOLDER, { recursive: true });

    // Create Agency folders
    for (const source of config.sources) {

        const dropAgencyFolder = path.join(
            process.env.DROP_FOLDER,
            source.folder
        );

        const archiveAgencyFolder = path.join(
            process.env.ARCHIVE_FOLDER,
            source.folder
        );

        fs.mkdirSync(dropAgencyFolder, { recursive: true });

        fs.mkdirSync(archiveAgencyFolder, { recursive: true });

    }

}

module.exports = createFolders;