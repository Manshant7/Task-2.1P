const express = require('express');
const bodyParser = require('body-parser');
const formData = require('form-data');
const Mailgun = require('mailgun.js');
require('dotenv').config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public'));

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY || 'de24624ae88ec1c0e59407c5b2c75445-79295dd0-f9515b2e' 
});

app.get('/', function (request, response) {
    response.sendFile(__dirname + '/index.html'); 
});

// Route to handle form submission
app.post('/subscribe', (req, res) => {
    const { Email } = req.body;

    if (!Email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    mg.messages.create(process.env.MAILGUN_DOMAIN || 'sandbox5827e508c9bb4e39b10dd2847adbf843.mailgun.org', {
        from: `mailgunacc4793 <mailgun@${process.env.MAILGUN_DOMAIN}>`, 
        to: [Email],
        subject: 'Welcome to our Daily Insider!',
        text: 'Thank you for subscribing to our Daily Insider newsletter. Stay tuned for more updates!',
        html: '<h1>Thank you for subscribing to our Daily Insider newsletter. Stay tuned for more updates!</h1>'
    })
    .then(msg => {
        console.log(msg); // logs response data
        res.status(200).json({ message: 'Subscription successful, email sent!' });
    })
    .catch(err => {
        console.error(err); // logs any error
        res.status(500).json({ error: 'Failed to send email' });
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
