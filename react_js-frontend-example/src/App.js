import "./App.css";
import React from "react";
import TalkJsUser from "./TalkJsUser";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { Image } from "react-bootstrap";

function App() {
  const userA = {
    id: "464854854",
    name: "Jane Doe",
    email: "sapnesh+TalkJsUseA@kerneldev.com",
    photo: "https://i.pravatar.cc/300?img=45",
  };

  const userB = {
    id: "484575757",
    name: "David Webb",
    email: "sapnesh+TalkJsUserB@kerneldev.com",
    photo: "https://i.pravatar.cc/300?img=3",
  };

  return (
    <div className="App">
      <div className="App-header">
        <Tabs>
          <TabList>
            <Tab>
              <Image
                src={userA.photo}
                roundedCircle={true}
                fluid={true}
                style={{ height: "30px" }}
              />{" "}
              {userA.name}
            </Tab>
            <Tab>
              <Image
                src={userB.photo}
                roundedCircle={true}
                fluid={true}
                style={{ height: "30px" }}
              />{" "}
              {userB.name}
            </Tab>
          </TabList>

          <TabPanel>
            <TalkJsUser me={userA} other={userB} />
          </TabPanel>
          <TabPanel>
            <TalkJsUser me={userB} other={userA} />
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
}

export default App;
