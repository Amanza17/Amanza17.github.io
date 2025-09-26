const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const stickersFilePath = path.join(__dirname, 'stickers.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/load-stickers', (req, res) => {
    fs.readFile(stickersFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error loading stickers');
        }
        res.json(JSON.parse(data));
    });
});

app.post('/save-stickers', (req, res) => {
    fs.writeFile(stickersFilePath, JSON.stringify(req.body), 'utf8', err => {
        if (err) {
            return res.status(500).send('Error saving stickers');
        }
        res.sendStatus(200);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
