const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3000;

app.get("/api/v1/health", (req, res) => {
    res.json({
        status: "healthy",
        versao: "1.0.0",
        timestamp: new Date().toISOString()
    });
});
