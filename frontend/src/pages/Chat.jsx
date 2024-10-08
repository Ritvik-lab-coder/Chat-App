import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { allUsersRoute, host } from '../utils/APIRoutes.js';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Contacts from '../components/Contacts';
import Welcome from '../components/Welcome.jsx';
import ChatContainer from '../components/ChatContainer.jsx';
import { io } from 'socket.io-client'


const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;

const Chat = () => {
    const socket = useRef();
    const [contacts, setContacts] = useState([]);
    const [currentChat, setCurrentChat] = useState(undefined);
    const [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();
    const toastOptions = {
        position: "bottom-right",
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark"
    }
    const { user } = useSelector(store => store.auth);
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
        setIsLoaded(true);
    }, []);
    useEffect(() => {
        if (user) {
            socket.current = io(host);
            socket.current.emit('add-user', user._id);
        }
    }, [user]);
    useEffect(() => {
        if (user && !user.isAvatarImageSet) {
            navigate('/set-avatar');
        }
    }, []);
    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await axios.get(`${allUsersRoute}/${user._id}`, { withCredentials: true });
                if (response.data.success) {
                    setContacts(response.data.users);
                }
            } catch (error) {
                toast.error(error.response.data.message, toastOptions);
            }
        }
        getUsers();
    }, []);
    const handleChatChange = (chat) => {
        setCurrentChat(chat)
    }
    return (
        <>
            <Container>
                <div className="container">
                    <Contacts contacts={contacts} currentUser={user} changeChat={handleChatChange} />
                    {
                        isLoaded && currentChat === undefined ? <Welcome currentUser={user} /> : <ChatContainer currentChat={currentChat} currentUser={user} socket={socket} />
                    }

                </div>
            </Container>
            <ToastContainer />
        </>
    )
}

export default Chat
