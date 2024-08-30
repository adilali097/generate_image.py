const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/generate-image', (req, res) => {
    const prompt = req.body.prompt;

    // Spawn the Python process
    const pythonProcess = spawn('python3', ['generate_image.py']);

    // Send JSON input to the Python process
    pythonProcess.stdin.write(JSON.stringify({ prompt: prompt }));
    pythonProcess.stdin.end();

    // Handle output from Python script
    pythonProcess.stdout.on('data', (data) => {
        const result = JSON.parse(data.toString());
        const imagePath = result.image_path;

        // Read the generated image and send it back to the client
        fs.readFile(imagePath, (err, imageData) => {
            if (err) {
                return res.status(500).send("Error reading image");
            }
            res.writeHead(200, { 'Content-Type': 'image/png' });
            res.end(imageData, 'binary');
        });
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Python error: ${data.toString()}`);
        res.status(500).send("Error generating image");
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
