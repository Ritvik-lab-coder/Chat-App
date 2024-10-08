import React from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import axios from 'axios'
import { setUser } from '../redux/authSlice.js';
import { logoutRoute } from '../utils/APIRoutes.js';
import { useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { BiPowerOff } from 'react-icons/bi'

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #9a86f3;
  border: none;
  cursor: pointer;
  svg {
    font-size: 1.3rem;
    color: #ebe7ff;
  }
`;

const Logout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const toastOptions = {
        position: "bottom-right",
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark"
    }
    const handleLogout = async () => {
        try {
            const response = await axios.get(`${logoutRoute}`, { withCredentials: true });
            if (response.data.success) {
                dispatch(setUser(null));
                toast.success(response.data.message, toastOptions);
                navigate('/login');
            }
        } catch (error) {
            toast.error(error.response.data.message, toastOptions);
        }
    }
    return (
        <>
            <Button onClick={handleLogout}>
                <BiPowerOff />
            </Button>
            <ToastContainer />
        </>
    )
}

export default Logout
