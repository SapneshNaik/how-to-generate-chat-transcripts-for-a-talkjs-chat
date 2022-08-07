//index.js
const express = require("express");
const axios = require("axios");
const app = express();
const port = 3500;
const appId = "app-id";
const secretKey = "secret-key";

app.get("/transcript/:conversationId/generate", (req, res) => {
  //Define TalkJS API call options
  var options = {
    method: "GET",
    url:
      "https://api.talkjs.com/v1/" +
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
      var senderIDs = new Set(); //store unique set of senderIDs
      var senderDetails = {}; //store unique set of senderIDs
      var promises = [];

      res.status(response.status); //set status send by TalkJS API response

      //set CORS headers
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Content-Type,Content-Length, Authorization, Accept,X-Requested-With"
      );
      res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");

      //Build unique set of senderIds from messages response and sort messages (latest message is last)
      var tempData = response.data.data.sort((a, b) => {
        senderIDs.add(a.senderId);
        senderIDs.add(b.senderId);

        if (a.createdAt > b.createdAt) return 1;
        else return -1;
      });

      //store senderdetail promises
      var senderIDArr = [...senderIDs];
      for (var i = 0; i < senderIDArr.length; i++) {
        promises.push(getSenderDetails(senderIDArr[i]));
      }

      //resolve promises and add sender name, email & photourl to output
      Promise.all(promises).then((responses) => {
        for (var i = 0; i < responses.length; i++) {
          senderDetails[responses[i].data.id] = responses[i].data.name;
        }

        for (var k = 0; k < tempData.length; k++) {
          //add datetime
          tempData[k].createdDateTime = new Date(
            tempData[k].createdAt
          ).toGMTString();

          //add name
          tempData[k].senderName = senderDetails[tempData[k].senderId];

          //delete unnecessary information
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
          ].forEach((e) => delete tempData[k][e]);
        }

        res.json(tempData);
      });
    })
    .catch(function (error) {
      throw new Error(error);
    });
});

//returns a promise to make API call for sender details from senderID
function getSenderDetails(senderId) {
  var options = {
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
