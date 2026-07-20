require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(" Air Quality Monitoring Dashboard");
    console.log(`Server running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});