import "./App.css";
import Talk from "talkjs";
import { useEffect, useRef, useState } from "react";
import React from "react";
import Button from "react-bootstrap/Button";
import { Col, Container, Row, Stack } from "react-bootstrap";
import axios from "axios";

const TalkJsUser = (props) => {
  const talkjsContainer = useRef(null);
  const [talkSession, setTalkSession] = useState(null);
  const [me, setMe] = useState(null);
  const [conversation, setConversation] = useState(null);
  const appId = "app-id";

  useEffect(() => {
    Talk.ready
      .then(() => {
        console.log("talk ready");
        var meUser = new Talk.User({
          id: props.me.id,
          name: props.me.name,
          email: props.me.email,
          photoUrl: props.me.photo,
        });

        setTalkSession(
          new Talk.Session({
            appId: appId,
            me: meUser,
          })
        );

        setMe(meUser);
      })
      .catch((err) => {
        console.log("Error in TalkJs.Ready");
        console.log(err);
      });
  }, [props.me.id, props.me.name, props.me.email, props.me.photo]);

  useEffect(() => {
    if (talkSession != null && me != null) {
      var other = new Talk.User({
        id: props.other.id,
        name: props.other.name,
        email: props.other.email,
        photoUrl: props.other.photo,
      });

      var conversation = talkSession.getOrCreateConversation(
        Talk.oneOnOneId(me, other)
      );
      conversation.setParticipant(me);
      conversation.setParticipant(other);

      var inbox = talkSession.createInbox({ selected: conversation });
      inbox.mount(talkjsContainer.current);

      setConversation(conversation);
    }
  }, [
    talkSession,
    me,
    props.other.id,
    props.other.name,
    props.other.email,
    props.other.photo,
  ]);

  const downloadChatTranssript = () => {
    var config = {
      method: "get",
      url: "http://localhost:3500/transcript/" + conversation.id + "/generate",
      headers: {},
    };

    axios(config)
      .then(function (response) {
        var transcript = "";

        response.data.forEach((element) => {
          transcript =
            transcript +
            "[" +
            element.createdDateTime +
            "] " +
            "[" +
            element.senderName +
            "] - " +
            element.text +
            "\n";
        });

        const element = document.createElement("a");
        const file = new Blob([transcript], {
          type: "text/plain",
        });
        element.href = URL.createObjectURL(file);
        element.download = "talk_js_transcript_chat_"+conversation.id+".txt";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <Container>
      <Row>
        <Col>
          <Stack direction="vertical" gap={2}>
            <Button
              onClick={downloadChatTranssript}
              variant="light"
              style={{ textAlign: "left", paddingTop: "0" }}
            >
              <span
                style={{
                  fontSize: "x-large",
                  fontWeight: "bold",
                  paddingRight: "8px",
                }}
              >
                ↓
              </span>
              <span style={{ fontSize: "small", verticalAlign: "text-top" }}>
                Download Chat Transcript
              </span>
            </Button>
            <div
              style={{ height: "500px" }}
              ref={talkjsContainer}
              className="chatbox-container"
            ></div>
          </Stack>
        </Col>
      </Row>
    </Container>
  );
};

export default TalkJsUser;
