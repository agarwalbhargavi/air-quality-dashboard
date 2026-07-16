const fs = require("fs");
const path = require("path");

const logFolder = "./logs";

if (!fs.existsSync(logFolder)) {
    fs.mkdirSync(logFolder);
}

const today = new Date();

const logFile = path.join(
    logFolder,
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}.log`
);

function getTime() {

    return new Date().toLocaleString();

}

function write(level, message) {

    const log = `[${getTime()}] [${level}] ${message}\n`;

    fs.appendFileSync(logFile, log);

}

module.exports = {

    info(message) {

        console.log(message);

        write("INFO", message);

    },

    error(message) {

        console.error(message);

        write("ERROR", message);

    },

    warning(message) {

        console.warn(message);

        write("WARNING", message);

    }

};