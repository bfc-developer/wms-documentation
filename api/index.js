const app = require("../app");
const connectDB = require("../utils/db");

let db;

module.exports = async (req, res) => {
    if (!db) {
        db = connectDB();
    }

    await db;

    return app(req, res);
};