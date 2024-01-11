/* eslint-disable */
/* eslint-disable promise/always-return */

// Deploy functions
// firebase use functions
// firebase deploy --only functions:notificationService

// Deploy hosting
// firebase use default
// ionic build
// firebase deploy --only hosting

const express = require("express");

const app = express();
const cors = require("cors");
const { onRequest } = require("firebase-functions/v1/https");
const { urlencoded, json } = require("body-parser");

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

const {
  initializeApp,
  applicationDefault,
  getApp,
  cert,
} = require("firebase-admin/app");
const { getMessaging } = require("firebase-admin/messaging");

const serviceAccount = require("./firebase account key file.json");

const firebaseApp = initializeApp({
  credential: cert(serviceAccount),
});

// parse application/x-www-form-urlencoded
app.use(urlencoded({ extended: false }));

// parse application/json
app.use(json());

app.use(cors(corsOptions)); // Use this after the variable declaration

app.post("/attendance-submitted", (req, res) => {
  console.log(req.body);
  const message = {
    notification: {
      title: "Attendance submitted",
      body: req.body.cg + "'s attendance has been submitted.",
    },
    topic: "topic",
  };
  // Send a message to the device corresponding to the provided
  // registration token.
  getMessaging()
    .send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      console.log("Error sending message:", error);
    });

  res.send("OK");
});

app.post("/flwup-status-submitted", (req, res) => {
  console.log(req.body);
  const message = {
    notification: {
      title: "Received new follow up status",
      body:
        "Follow up status of " + req.body.sheepName + " has been submitted.",
    },
    topic: "topic",
  };

  getMessaging()
    .send(message)
    .then((response) => {
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      console.log("Error sending message:", error);
    });

  res.send("OK");
});

// app.listen(3000, () => {
//   console.log("Started");
// });

exports.notificationService = onRequest(app);
