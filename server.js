const express = require('express');
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Configure AWS SDK with your credentials and region
AWS.config.update({
    accessKeyId: 'your-access-key-id',
    secretAccessKey: 'your-secret-access-key',
    region: 'us-east-1'
});

// Create an instance of the Chime service
const chime = new AWS.Chime({ region: 'us-east-1' });

// Set the endpoint for Chime SDK
chime.endpoint = new AWS.Endpoint('https://service.chime.aws.amazon.com/console');

// Create Meeting
app.post('/createMeeting', async (req, res) => {
    const { clientRequestToken } = req.body;
    try {
        const meetingResponse = await chime.createMeeting({
            ClientRequestToken: clientRequestToken,
            MediaRegion: 'us-east-1'
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
