import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { colors } from '../theme';

// Common styled components for both login and signup
const AuthContainer = styled.div`
  max-width: 400px;
  margin: 40px auto;
  padding: 30px;
  background-color: ${colors.background};
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  font-family: 'Merriweather', serif;

  @media (max-width: 480px) {
    margin: 20px auto;
    padding: 20px;
    width: 90%;
  }
`;

const AuthTitle = styled.h2`
  color: ${colors.primary};
  text-align: center;
  margin-bottom: 25px;
  font-weight: 700;
`;

const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const AuthInput = styled.input`
  padding: 12px 15px;
  border: 1px solid ${colors.border};
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;

  &:focus {
    border-color: ${colors.primary};
    outline: none;
  }
`;

const AuthButton = styled.button`
  background-color: ${colors.primary};
  color: white;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 10px;

  &:hover {
    background-color: ${colors.secondary};
  }
`;

const AuthFooter = styled.div`
  text-align: center;
  margin-top: 20px;
  color: ${colors.text};
`;

const AuthLink = styled(Link)`
  color: ${colors.primary};
  text-decoration: none;
  font-weight: 600;
  margin-left: 5px;

  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  color: ${colors.error};
  background-color: ${colors.errorBackground};
  padding: 10px 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  font-size: 14px;
`;


  const Signup = ({ onSignupSuccess }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(
        'https://dead-poets.onrender.com/api/users/register',
        { username, email, password }
      );

      if (response.status === 201) {
        onSignupSuccess?.();
        navigate('/login');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.response?.data?.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <AuthContainer>
      <AuthTitle>Sign Up</AuthTitle>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <AuthForm onSubmit={handleSubmit}>
        <AuthInput
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <AuthInput
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <AuthInput
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <AuthButton type="submit">Sign Up</AuthButton>
      </AuthForm>
      <AuthFooter>
        Already have an account? <AuthLink to="/login">Login here</AuthLink>
        <br></br>
        <AuthLink to="/forgotpassword">Forgot Password?</AuthLink>
      </AuthFooter>
    </AuthContainer>
  );
};

export default Signup;