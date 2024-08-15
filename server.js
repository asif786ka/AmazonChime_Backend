require('dotenv').config();  // Add this line at the top of your file

const express = require('express');
const { ChimeClient, CreateMeetingCommand, CreateAttendeeCommand } = require('@aws-sdk/client-chime');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

// Initialize Express app
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Load AWS credentials from environment variables
const chimeClient = new ChimeClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    endpoint: 'https://meetings-chime.us-east-1.amazonaws.com'
});

// Create Meeting endpoint
app.post('/createMeeting', async (req, res) => {
    const clientRequestToken = uuidv4(); // Generate a new UUID as the client request token
    const externalMeetingId = uuidv4(); // Generate a unique ID for the external meeting ID

    try {
        const createMeetingCommand = new CreateMeetingCommand({
            ClientRequestToken: clientRequestToken,
            MediaRegion: 'us-east-1',
            ExternalMeetingId: externalMeetingId // Provide the external meeting ID
        });

        const meetingResponse = await chimeClient.send(createMeetingCommand);
        res.json(meetingResponse);
    } catch (err) {
        console.error("Error creating meeting:", err);
        res.status(500).json({ error: err.message });
    }
});

// Join Meeting endpoint
app.post('/joinMeeting', async (req, res) => {
    const { meetingId, attendeeName } = req.body;

    try {
        const createAttendeeCommand = new CreateAttendeeCommand({
            MeetingId: meetingId,
            ExternalUserId: attendeeName
        });

        const attendeeResponse = await chimeClient.send(createAttendeeCommand);
        res.json(attendeeResponse);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start the server
const PORT = process.env.PORT || 5026;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
