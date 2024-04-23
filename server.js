const fs = require('fs').promises;
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
 
const app = express();
const PORT = 3000;
 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
 
app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'page', 'message.html');
    res.sendFile(filePath);
});
 
app.get('/exists', (req, res) => {
    const filePath = path.join(__dirname, 'page', 'exists.html');
    res.sendFile(filePath);
});
 
app.post('/create', async (req, res) => {
    const { title, text } = req.body;
 
    try {
        const tempFilePath = path.join(__dirname, 'temp', `${title}.txt`);
        const finalFilePath = path.join(__dirname, 'message', `${title}.txt`);
 
        await fs.writeFile(tempFilePath, text);
        const exists = await fs.exists(finalFilePath);
 
        if (exists) {
            res.redirect('/exists');
        } else {
            await fs.rename(tempFilePath, finalFilePath);
            res.redirect('/');
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});
 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
