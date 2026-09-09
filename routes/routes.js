const express = require("express");
const verifyJwtTokenMiddleware = require("../middleware/verify_token");
const {getFileTree, getDocument, healthCheck, home, getFile} = require("../controllers/app");
const {login} = require("../controllers/auth");

const router = express.Router();

// auth routes
router.post("/login", login);


// app routes
router.get('/health', verifyJwtTokenMiddleware, healthCheck);
router.get('/api/docs', verifyJwtTokenMiddleware, getFileTree);
router.get('/api/docs/*', verifyJwtTokenMiddleware, getDocument);
router.get('/', home);
router.get('/*.md', getFile);



module.exports = {router};
