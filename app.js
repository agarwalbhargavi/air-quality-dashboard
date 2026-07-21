const express = require("express");
require("dotenv").config();

const app = express();
const masterRoutes = require("./routes/masterRoutes");




app.use(express.json());
app.use(express.urlencoded({ extended: true }));





app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Air Quality Monitoring Dashboard API is running."
    });
});








app.use("/api/master", masterRoutes);



app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found."
    });
});

module.exports = app;