// server.js
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const upload = multer({ dest: "uploads/" });

// Middleware
app.use(express.static("public"));
app.use(express.json());

// Upload route with added error handling
app.post("/upload", upload.array("resumes"), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "No files were uploaded." });
        }

        // Process each uploaded file
        const profiles = req.files.map(file => {
            console.log(`Processing file: ${file.originalname}`);
            return parseResume(file.path);
        });

        // Send back processed profiles
        res.json({ profiles });
    } catch (error) {
        console.error("Error processing upload:", error);
        res.status(500).json({ error: "An error occurred while uploading files." });
    }
});

// Parse resume function (simple example with logging)
// const fs = require("fs");

const parseResume = (filePath) => {
    const data = fs.readFileSync(filePath, "utf8");

    // Improved regular expressions to match each field based on provided resume structure
    const nameMatch = data.match(/^(.*?)\s*-\s*Freelance Web Developer/i);
    const emailMatch = data.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    const linkedInMatch = data.match(/linkedin\.com\/in\/[-a-zA-Z0-9]+/i);

    // Extracting skill sections individually
    const hardSkillsMatch = data.match(/Hard Skills:\s*(.*)/i);
    const certificationsMatch = data.match(/Certifications:\s*(.*)/i);
    const softSkillsMatch = data.match(/Soft Skills:\s*(.*)/i);
    const languagesMatch = data.match(/Languages:\s*(.*)/i);

    // Organizing skills in an array to present each category clearly
    let skills = [];
    if (hardSkillsMatch && hardSkillsMatch[1]) {
        skills.push("Hard Skills: " + hardSkillsMatch[1].trim());
    }
    if (certificationsMatch && certificationsMatch[1]) {
        skills.push("Certifications: " + certificationsMatch[1].trim());
    }
    if (softSkillsMatch && softSkillsMatch[1]) {
        skills.push("Soft Skills: " + softSkillsMatch[1].trim());
    }
    if (languagesMatch && languagesMatch[1]) {
        skills.push("Languages: " + languagesMatch[1].trim());
    }

    // Returning the extracted data in a structured format
    return {
        name: nameMatch ? nameMatch[1].trim() : "Unknown",
        email: emailMatch ? emailMatch[0] : "Not Found",
        linkedIn: linkedInMatch ? `https://${linkedInMatch[0]}` : "Not Found",
        skills: skills
    };
};



// Start the server
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
