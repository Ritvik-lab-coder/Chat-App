import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components'
import Logo from '../assets/logo.svg'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import { registerRoute } from '../utils/APIRoutes.js';

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  button {
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
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;

const Register = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark"
  }
  const handleValidation = () => {
    const { username, email, password, confirmPassword } = values;
    if (password !== confirmPassword) {
      toast.error("Password and Confirm password do not match", toastOptions);
      return false;
    } else if (username.length < 3) {
      toast.error("Username should be greater than 3 characters", toastOptions);
      return false;
    } else if (password.length < 6) {
      toast.error("Password should be atleast 6 characters", toastOptions);
      return false;
    } else if (email === "") {
      toast.error("Email is required", toastOptions);
      return false;
    }
    return true;
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      try {
        const response = await axios.post(registerRoute, {
          username: values.username,
          email: values.email,
          password: values.password,
        }, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true
        });
        if (response.data.success) {
          toast.success("User created successfully", toastOptions);
          navigate("/login");
        }
      } catch (error) {
        toast.error(error.response.data.message, toastOptions);
      }
    }
  }
  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  }
  return (
    <>
      <FormContainer>
        <form onSubmit={(event) => handleSubmit(event)}>
          <div className='brand'>
            <img src={Logo} alt="logo" />
            <h1>Chatty</h1>
          </div>
          <input type="text" placeholder='Username' name='username' onChange={(event) => handleChange(event)} />
          <input type="email" placeholder='Email ID' name='email' onChange={(event) => handleChange(event)} />
          <input type="password" placeholder='Password' name='password' onChange={(event) => handleChange(event)} />
          <input type="password" placeholder='Confirm Password' name='confirmPassword' onChange={(event) => handleChange(event)} />
          <button type='submit'>Create User</button>
          <span>Already have an account ? <Link to={'/login'}>Login</Link></span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  )
}

export default Register
