// require("dotenv").config();
// const express = require('express');
// const cors = require('cors');
// const connectDB = require("./utils/db");
// const { router } = require('./routes/routes')
// const { pingServer } = require('./utils/runner')

// const app = express();
// const PORT = process.env.PORT || 12000;

// // Middleware
// app.use(cors({
//   origin: true,
//   credentials: true
// }));
// app.use(express.json());
// app.use(express.static('frontend/public'));

// app.use("/", router);

// // Start server
// connectDB().then(() => {
//   app.listen(PORT, () => {
//     console.log(`✅ Server running on http://localhost:${process.env.PORT}`);
//     // pingServer();
//     // setInterval(pingServer, 30 * 1000);
//   });
// });

require("dotenv").config();

const connectDB = require("./utils/db");
const app = require("./app");

const PORT = process.env.PORT || 12000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on ${PORT}`);
    });
});