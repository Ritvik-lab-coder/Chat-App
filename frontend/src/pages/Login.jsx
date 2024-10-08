import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components'
import Logo from '../assets/logo.svg'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { loginRoute } from '../utils/APIRoutes.js';
import { setUser } from '../redux/authSlice.js';
import loader from '../assets/loader.gif'

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

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    email: '',
    password: ''
  });
  const { user } = useSelector(store => store.auth);
  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark"
  }
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, []);
  const handleValidation = () => {
    const { password, email } = values;
    if (password === "") {
      toast.error("Password is required", toastOptions);
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
        setLoading(true);
        const response = await axios.post(loginRoute, {
          email: values.email,
          password: values.password,
        }, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true
        });
        if (response.data.success) {
          toast.success("User logged in successfylly", toastOptions);
          navigate("/");
          dispatch(setUser(response.data.user));
          setLoading(false);
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
      {
        loading ? (<Container>
          <img src={loader} alt="" className='loader' />
        </Container>) : (
          <FormContainer>
            <form onSubmit={(event) => handleSubmit(event)}>
              <div className='brand'>
                <img src={Logo} alt="logo" />
                <h1>Chatty</h1>
              </div>
              <input type="email" placeholder='Email ID' name='email' onChange={(event) => handleChange(event)} />
              <input type="password" placeholder='Password' name='password' onChange={(event) => handleChange(event)} />
              <button type='submit'>Login</button>
              <span>Don't have an account ? <Link to={'/register'}>Register</Link></span>
            </form>
          </FormContainer>
        )
      }
      <ToastContainer />
    </>
  )
}

export default Register
