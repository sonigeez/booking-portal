const express = require("express");
const { google } = require("googleapis");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require('cors');


dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());


const port = process.env.PORT || 4000;

function getAuthClient() {
  return new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    null,
    process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    ["https://www.googleapis.com/auth/spreadsheets"]
  );
}

const sheets = google.sheets({ version: "v4", auth: getAuthClient() });

// Book a slot
app.post("/api/book", async (req, res) => {
  try {
    const { userId, courtType, timeSlot } = req.body;
    console.log(req.body);

    // Validate input
    if (!userId || !courtType || !timeSlot) {
      return res.status(400).json({ message: "Missing required parameters." });
    }

    // Get bookings for the user
    const bookingsResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "A:D",
    });

    const existingBookings = bookingsResponse.data.values || [];


    // Check if user has reached maximum bookings
    const userBookings = existingBookings.filter(
      (booking) => booking[0] == userId
    );
    if (userBookings.length >= 3) {
      return res
        .status(400)
        .json({ message: "User has reached maximum booking limit." });
    }

    const conflictingBooking = userBookings.find(
      (booking) => booking[3] == timeSlot
    );
    if (conflictingBooking) {
      return res
        .status(400)
        .json({ message: "User has already booked a different court type for this time slot." });
    }



    // Book the slot
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "A:D",
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      resource: {
        values: [[userId, courtType, new Date().toISOString(), timeSlot]],
      },
    });

    res.status(200).json({ message: "Booking successful." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Get bookings for a user
app.get("/api/bookings/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate input
    if (!userId) {
      return res
        .status(400)
        .json({ message: "Missing required parameter: userId." });
    }

    // Get bookings for the user
    const bookingsResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "A:D",
    });

    const existingBookings = bookingsResponse.data.values || [];

    // Filter bookings for the specified user
    const userBookings = existingBookings
      .filter((booking) => booking[0] === userId)
      .map((booking) => {
        return {
          userId: booking[0],
          courtType: booking[1],
          bookingDate: booking[2],
          timeSlot: booking[3],
        };
      });

    res.status(200).json(userBookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
