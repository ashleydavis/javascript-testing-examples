// 
// A simple Node.js backend using Express created by ChatGPT.
//

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('This is the backend!');
});

app.get('/api/greeting', (req, res) => {
    console.log(`Requesting greeting from the frontend.`);
    res.json({ message: 'Hello from the backend!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});