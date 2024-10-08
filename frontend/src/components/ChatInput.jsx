import React, { useState } from 'react'
import styled from 'styled-components';
import { IoMdSend } from 'react-icons/io'
import { BsEmojiSmileFill } from 'react-icons/bs'

const Container = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 95%;
  background-color: #080420;
  padding: 0 2rem;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    padding: 0 1rem;
    gap: 1rem;
  }
  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;
    .emoji {
      position: relative; /* Ensure this is relative */
      svg {
        font-size: 1.5rem;
        color: #ffff00c8;
        cursor: pointer;
      }
      .emoji-picker-react {
        position: absolute !important; /* Use !important to override default */
        top: -400px !important; /* Push it further above */
        z-index: 1000 !important; /* Ensure it appears on top */
        background-color: #080420 !important;
        box-shadow: 0 5px 10px #9a86f3 !important;
        border-color: #9a86f3 !important;
        
        .emoji-scroll-wrapper::-webkit-scrollbar {
          background-color: #080420 !important;
          width: 5px !important;
          &-thumb {
            background-color: #9a86f3 !important;
          }
        }
        .emoji-categories {
          button {
            filter: contrast(0) !important;
          }
        }
        .emoji-search {
          background-color: transparent !important;
          border-color: #9a86f3 !important;
        }
        .emoji-group:before {
          background-color: #080420 !important;
        }
      }
    }
  }
  .input-container {
    width: 100%;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    background-color: #ffffff34;
    input {
      width: 90%;
      height: 60%;
      background-color: transparent;
      color: white;
      border: none;
      padding-left: 1rem;
      font-size: 1.2rem;

      &::selection {
        background-color: #9a86f3;
      }
      &:focus {
        outline: none;
      }
    }
    button {
      padding: 0.3rem 2rem;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #9a86f3;
      border: none;
      @media screen and (min-width: 720px) and (max-width: 1080px) {
        padding: 0.3rem 1rem;
        svg {
          font-size: 1rem;
        }
      }
      svg {
        font-size: 2rem;
        color: white;
      }
    }
  }
`;

const ChatInput = ({ handleSendMessage }) => {
    const [message, setMessage] = useState("");
    const sendChat = async (event) => {
        event.preventDefault();
        if (message.length > 0) {
            handleSendMessage(message);
            setMessage("");
        }
    }
    return (
        <Container>
            <form className='input-container' onSubmit={(event) => sendChat(event)}>
                <input type="text" placeholder="Type a message..." value={message} onChange={(event) => setMessage(event.target.value)} />
                <button className="submit">
                    <IoMdSend />
                </button>
            </form>
        </Container>
    )
}

export default ChatInput
