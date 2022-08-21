//index.js
const express = require("express");
const axios = require("axios");
const app = express();
const port = 3500;
const appId = "app-id";
const secretKey = "secret-key";

app.get("/transcript/:conversationId/generate", (req, res) => {
  //Define TalkJS API call options
  const options = {
    method: "GET",
    url: "https://api.talkjs.com/v1/" +
      appId +
      "/conversations/" +
      req.params.conversationId +
      "/messages?limit=100",
    headers: {
      Authorization: "Bearer " + secretKey,
    },
  };

  //make API call to fetch messages of the given conversationID
  axios(options)
    .then(function (response) {

      res.status(response.status); //set status send by TalkJS API response

      //set CORS headers
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Content-Type,Content-Length, Authorization, Accept,X-Requested-With"
      );
      res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");

      let senderIDs = new Set(); //store unique set of senderIDs
      //Build unique set of senderIds from messages response and sort messages (latest message is last)
      let messages = response.data.data.sort((a, b) => {
        senderIDs.add(a.senderId);
        senderIDs.add(b.senderId);
        return a.createdAt - b.createdAt
      });

      console.log("Here")

      let promises = [];
      //store senderdetail promises
      senderIDs.forEach((value) => {
        promises.push(getSenderDetails(value));

      });

      console.log("Hereagain")


      //resolve promises and add sender name, email & photourl to output
      Promise.all(promises).then((responses) => {
        const senderNames = {};
        for (let response of responses) {
          senderNames[response.data.id] = response.data.name;
        }
        for (let message of messages) {
          //add datetime
          message.createdDateTime = new Date(
            message.createdAt
          ).toGMTString();

          //add sender name
          message.senderName = senderNames[message.senderId];

          //delete unnecessary attributes
          [
            "attachment",
            "conversationId",
            "editedAt",
            "custom",
            "id",
            "location",
            "origin",
            "readBy",
            "referencedMessageId",
            "type",
            "createdAt",
            "senderId",
          ].forEach((attribute) => delete message[attribute]);
        }

        res.json(messages);
      });
    })
    .catch(function (error) {
      throw new Error(error);
    });
});

//returns a promise to make API call for sender details from senderID
function getSenderDetails(senderId) {
  const options = {
    method: "GET",
    url: "https://api.talkjs.com/v1/" + appId + "/users/" + senderId,
    headers: {
      Authorization: "Bearer " + secretKey,
    },
  };
  return axios(options);
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});