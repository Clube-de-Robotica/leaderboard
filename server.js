const express = require("express");
const fs = require("fs");
const axios = require("axios");
const xlsx = require("xlsx");

const app = express();
const PORT = 80;

// XLSX Source: Google Sheets or Microsoft 365
const XLSX_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR9sEuviCEycT2X98PZOo9bBuIngv_KJg6WDWWb_hX7bmOsalyDkMLO9uwdi0aniiPoeZxl4Rajh4F2/pub?output=xlsx"; // Replace with your actual XLSX URL
const LOCAL_XLSX = "leaderboard.xlsx";

app.set("view engine", "ejs");
app.use(express.static("public"));

// Fetch XLSX file every 5 minutes
async function fetchXLSX() {
    try {
        const response = await axios({ url: XLSX_URL, responseType: "arraybuffer" });
        fs.writeFileSync(LOCAL_XLSX, response.data);
        console.log("XLSX updated!");
    } catch (error) {
        console.error("Error fetching XLSX:", error);
    }
}

// Parse XLSX and return data from all sheets
function readXLSX() {
    const workbook = xlsx.readFile(LOCAL_XLSX);
    const leaderboardData = {};
    const whitelist = ["Equipa", "Bónus", "1ª Manga - Penalizações", "1ª Manga - Pontuações", "2ª Manga - Penalização", "2ª Manga - Pontuações", "Pontuação Final"];

    workbook.SheetNames.forEach((sheetName) => {
        const sheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
        
        sheet.forEach((row, index) => {
            sheet[index] = Object.fromEntries(
                Object.entries(row).filter(([key]) => whitelist.includes(key))
            );
        });

        leaderboardData[sheetName] = sheet.sort((a, b) => (b.Score || 0) - (a.Score || 0)); // Sort by score descending
    });

    return leaderboardData;
}

// Fetch XLSX initially and schedule updates
fetchXLSX();
setInterval(fetchXLSX, 1 * 60 * 1000);

// Route to display leaderboard
app.get("/", (req, res) => {
    const leaderboardData = readXLSX();
    res.render("index", { leaderboardData });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
