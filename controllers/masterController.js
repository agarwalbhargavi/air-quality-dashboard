const masterService = require("../services/masterService");

async function getMasterData(req, res) {

    try {

        const type = req.query.type;

        if (!type) {
            return res.status(400).json({
                success: false,
                message: "Query parameter 'type' is required."
            });
        }

        const data = await masterService.getMasterData(type);

        res.status(200).json({
            success: true,
            count: data.length,
            data: data
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

}

module.exports = {
    getMasterData
};