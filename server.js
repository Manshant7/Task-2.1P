const express = require('express');
const bodyParser = require('body-parser');
const mailgun = require('mailgun-js');

const app = express();
const port = 3000;

const mg = mailgun({
    apiKey: 'b352b1189739e8dbb6825968c75a1841-826eddfb-2e2752e6',
    domain: 'sandbox9f4e35851d244dafb3da9ad4766bf91f.mailgun.org'
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/subscribe', function(req, res) {
    const { email } = req.body;

    const data = {
        from: 'manshant@sandbox9f4e35851d244dafb3da9ad4766bf91f.mailgun.org',
        to: email,
        subject: 'Welcome to DEV@Deakin!',
        text: 'Thank you for joining DEV@Deakin. We\'re excited to have you!',
        html: '<strong>Thank you for joining DEV@Deakin. We\'re excited to have you!</strong>'
    };

    mg.messages().send(data, function (error, body) {
        if (error) {
            console.error(error);
            res.send('Failed to send welcome email.');
        } else {
            res.send('Welcome email sent successfully!');
        }
    });
});

app.listen(port, function() {
    console.log(`Server running at http://localhost:${port}`);
});
