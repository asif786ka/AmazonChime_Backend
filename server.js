const express = require('express');
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

// Initialize Express app
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Configure AWS SDK with environment variables
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

// Create an instance of the Chime service
const chime = new AWS.Chime({ region: process.env.AWS_REGION });

// Set the endpoint for Chime SDK
chime.endpoint = new AWS.Endpoint('https://service.chime.aws.amazon.com/console');

// Create Meeting
app.post('/createMeeting', async (req, res) => {
    const clientRequestToken = uuidv4(); // Generate a new UUID as the client request token
    try {
        const meetingResponse = await chime.createMeeting({
            ClientRequestToken: clientRequestToken,
            MediaRegion: process.env.AWS_REGION
        }).promise();
        res.json(meetingResponse);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Join Meeting
app.post('/joinMeeting', async (req, res) => {
    const { meetingId, attendeeName } = req.body;
    try {
        const attendeeResponse = await chime.createAttendee({
            MeetingId: meetingId,
            ExternalUserId: attendeeName
        }).promise();
        res.json(attendeeResponse);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
