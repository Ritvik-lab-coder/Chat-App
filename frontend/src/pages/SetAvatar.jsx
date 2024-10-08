import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components'
import loader from '../assets/loader.gif'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import { setAvatarRoute } from '../utils/APIRoutes.js'
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../redux/authSlice.js';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;

  .loader {
    max-inline-size: 100%;
  }

  .title-container {
    h1 {
      color: white;
    }
  }
  .avatars {
    display: flex;
    gap: 2rem;

    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
        transition: 0.5s ease-in-out;
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }
  .submit-btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
`;

const SetAvatar = () => {
    const api = `https://api.multiavatar.com/45678945`;
    const [avatar, setAvatar] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState(undefined);
    const toastOptions = {
        position: "bottom-right",
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark"
    }
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, []);
    const setProfilePicture = async () => {
        if (selectedAvatar === undefined) {
            return toast.error("Please select an avatar", toastOptions);
        } else {
            try {
                const response = await axios.put(`${setAvatarRoute}/${user._id}`, {
                    image: avatar[selectedAvatar]
                }, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true
                });
                if (response.data.success) {
                    toast.success("Avatar updated successfully", toastOptions);
                    dispatch(setUser(response.data.user));
                    navigate('/');
                }
            } catch (error) {
                toast.error(error.response.data.message, toastOptions);
            }
        }
    }
    useEffect(() => {
        const fetchAvatars = async () => {
            const data = [];
            for (let i = 0; i < 4; i++) {
                const image = await axios.get(`${api}/${Math.round(Math.random() * 1000)}`);
                const buffer = btoa(image.data);
                data.push(buffer.toString('base64'));
            }
            setAvatar(data);
            setLoading(false);
        }
        fetchAvatars();
    }, []);
    return (
        <>
            {
                loading ? <Container>
                    <img src={loader} alt="" className='loader' />
                </Container> : (
                    <Container>
                        <div className='title-container'>
                            <h1>Pick an avatar as your profile picture</h1>
                        </div>
                        <div className='avatars'>
                            {
                                avatar.map((ava, index) => {
                                    return (
                                        <div className={`avatar ${selectedAvatar === index ? "selected" : ""}`}>
                                            <img src={`data:image/svg+xml;base64,${ava}`} alt="" key={ava} onClick={() => setSelectedAvatar(index)} />
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <button className='submit-btn' onClick={setProfilePicture}>Set as Profile Picture</button>
                    </Container>
                )
            }
            <ToastContainer />
        </>
    )
}

export default SetAvatar
