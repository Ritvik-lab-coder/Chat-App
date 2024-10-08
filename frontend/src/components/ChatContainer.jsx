import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import Logout from './Logout';
import ChatInput from './ChatInput';
import axios from 'axios';
import { getAllMessages, sendMessageRoute } from '../utils/APIRoutes.js';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { v4 as uuidv4 } from 'uuid'

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;

const ChatContainer = ({ currentChat, currentUser, socket }) => {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (currentChat) {
          setLoading(true);
          const response = await axios.get(getAllMessages, {
            headers: {
              'from': `${currentUser._id}`,
              'to': `${currentChat._id}`
            },
            withCredentials: true
          });
          if (response.data.success) {
            setMessages(response.data.messages);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchMessages();
  }, [currentChat])
  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark"
  }
  const handleSendMessage = async (message) => {
    try {
      const response = await axios.post(sendMessageRoute, {
        from: currentUser._id,
        to: currentChat._id,
        message: message,
      }, { withCredentials: true });
      if (response.data.success) {
        socket.current.emit('send-message', {
          to: currentChat._id,
          from: currentUser._id,
          message: message
        });
        const msgs = [...messages];
        msgs.push({ fromSelf: true, message: message });
        setMessages(msgs);
      }
    } catch (error) {
      toast.error(error.response.data.message, toastOptions);
    }
  }
  useEffect(() => {
    if (socket.current) {
      socket.current.on('msg-recieved', (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      })
    }
  }, []);
  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);
  return (
    <>
      {
        currentChat && (
          <Container>
            <div className="chat-header">
              <div className="user-details">
                <div className="avatar">
                  <img src={`data:image/svg+xml;base64,${currentChat.avatarImage}`} alt="" />
                </div>
                <div className="username">
                  <h3>{currentChat.username}</h3>
                </div>
                <Logout />
              </div>
            </div>
            {
              loading ? (
                <div className='chat-messages'>
                  <h1 style={{ "color": "#4e0eff" }}>Loading messages, please wait...</h1>
                </div>) : (
                <div className="chat-messages">
                  {
                    messages.map((message) => {
                      return (
                        <div ref={scrollRef} key={uuidv4()}>
                          <div className={`message ${message.fromSelf ? "sended" : "recieved"}`}>
                            <div className="content">
                              <p>
                                {message.message}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              )
            }
            <ChatInput handleSendMessage={handleSendMessage} />
          </Container>
        )
      }
    </>
  )
}

export default ChatContainer
