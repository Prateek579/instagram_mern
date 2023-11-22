import React, { useContext, useEffect, useRef, useState } from "react";
import "./message.css";

import io from "socket.io-client";
import storeContext from "../../context/store";
const ENDPOINT = "http://localhost:8022";
var socket;

const Message = () => {
  const context = useContext(storeContext);
  const { loginUserID, userToken } = context;

  const [profileDetails, setProfileDetails] = useState([]);
  const [messageDetails, setMessageDetails] = useState({
    personId: "",
    imagePath: "",
    userName: "",
  });
  const [displayMessages, setDisplayMessages] = useState(false);
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [active, setActive] = useState("");

  const containerRef = useRef(null);

  // fetching the chat history
  const fetchChatHistory = async (data) => {
    // set the data of user which want to fetch chat history
    setActive(data._id);
    setMessageDetails({
      personId: data._id,
      imagePath: data.photo,
      userName: data.name,
    });
    setDisplayMessages(true);
    // requesting to server for chat history
    const request = await fetch(
      `http://localhost:8022/api/message/chathistory/${data._id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": userToken,
        },
      }
    );
    const response = await request.json();
    if (response.success == true) {
      // set the response data
      setAllMessages(response.chatHistory[0].content);
      setRoomId(response.chatHistory[0].roomId);

      // joining the room
      socket.emit("join chat", response.chatHistory[0].roomId);
    } else {
      setAllMessages("");
    }
  };

  // sending a new message
  const handleSendMessage = async () => {
    const newMessage = {
      message: message,
      to: loginUserID,
    };
    // sending new message in the room
    socket.emit("new message", newMessage, roomId);
    setAllMessages((preMessage) => [...preMessage, newMessage]);
    const sendMessage = await fetch(
      "http://localhost:8022/api/message/messagestart",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": userToken,
        },
        body: JSON.stringify({
          reciever: messageDetails.personId,
          message: message,
        }),
      }
    );
    const response = await sendMessage.json();
    setMessage("");
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    let isMounted = true;
    const fetchData = async () => {
      try {
        const request = await fetch(
          "http://localhost:8022/api/user/allprofile",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const response = await request.json();
        const filterUserLogin = response.profiles.filter(
          (element) => element._id === loginUserID
        );

        const filteredProfiles = response.profiles.filter((element) =>
          filterUserLogin[0].following.includes(element._id)
        );

        if (isMounted) {
          setProfileDetails(filteredProfiles);
        }
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    socket.on("message", (data) => {
      const newMessage = {
        message: data.message,
        sender: data.to,
      };
      setAllMessages((preMessage) => [...preMessage, newMessage]);
    });
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [allMessages]);

  return (
    // ALL USERS PROFILE SECITON
    <div className="message_container">
      <div className="message_contacts">
        {profileDetails.length === 0
          ? ""
          : profileDetails.map((item) => {
              return (
                <div
                  className={`message_card ${
                    active === item._id && "active_background"
                  }`}
                  key={item.name}
                  onClick={() => fetchChatHistory(item)}
                >
                  <div className="message_user_image">
                    <img
                      src={`http://localhost:8022/` + item.photo}
                      alt="message user image"
                    />
                    <div className="message_user_details">
                      <p>{item.name}</p>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>

      {/* SPECIFIC USER PROFILE SECTION */}
      {displayMessages ? (
        <div className="message_container_right">
          <div className="message_per">
            <div className="message_per_details">
              <img
                src={`http://localhost:8022/` + messageDetails.imagePath}
                alt="per image"
              />
              <p>{messageDetails.userName}</p>
            </div>
          </div>

          {/* MESSAGE SECTION */}
          <div className="message_content" ref={containerRef}>
            {allMessages.length === 0
              ? ""
              : allMessages.map((item) => {
                  return (
                    <div>
                      {item.sender === messageDetails.personId ? (
                        <div className="message_reciver message_modify">
                          <p className="message_modify">{item.message}</p>
                        </div>
                      ) : (
                        <div className="message_sender message_modify">
                          <p className="message_modify">{item.message}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
          </div>

          {/* INPUT SECTION */}
          <div className="message_input">
            <i className="fa-regular fa-face-smile"></i>
            <input
              type="text"
              id="messageinput"
              placeholder="Message..."
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            />
            <i
              className="fa-regular fa-paper-plane"
              onClick={() => handleSendMessage()}
            ></i>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Message;
