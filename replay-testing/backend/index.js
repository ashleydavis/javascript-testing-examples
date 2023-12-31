// 
// A simple Node.js backend using Express created by ChatGPT.
//

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let messages = {
    '1234': 'Hello from the backend!',
};

app.get('/', (req, res) => {
    res.send('This is the backend!');
});

app.post('/api/greeting', (req, res) => {

    console.log(`HTTP POST /api/greeting from the frontend.`);

    const { message: newMessage } = req.body;
    let prevMessage = messages[req.query.id];
    messages[req.query.id] = newMessage;

    res.json({ 
        prevMessage: prevMessage,
        newMesssage: newMessage,
     });
});

app.get('/api/greeting', (req, res) => {

    console.log(`HTTP GET /api/greeting from the frontend.`);

    res.json({ message: messages[req.query.id] });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});