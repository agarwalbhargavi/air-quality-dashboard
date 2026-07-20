const pool = require("../config/db");

async function getMasterData(type) {

    let query = "";

    switch (type.toLowerCase()) {

        case "cities":

            query = `
                SELECT
                    city_id,
                    city,
                    state
                FROM city_master
                ORDER BY city;
            `;
            break;

        case "states":

            query = `
                SELECT DISTINCT
                    state
                FROM city_master
                ORDER BY state;
            `;
            break;

        case "stations":

            query = `
                SELECT DISTINCT
                    station
                FROM pollution
                WHERE station IS NOT NULL
                ORDER BY station;
            `;
            break;

        default:
            throw new Error("Invalid master data type.");

    }

    const result = await pool.query(query);

    return result.rows;

}

module.exports = {
    getMasterData
};