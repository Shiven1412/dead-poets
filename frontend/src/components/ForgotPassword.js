import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { colors } from '../theme';

// Common styled components (you can reuse from Login/Signup)
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

const ErrorMessage = styled.div`
  color: ${colors.error};
  background-color: ${colors.errorBackground};
  padding: 10px 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  font-size: 14px;
`;

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const config = {
        header: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        'https://web-production-09e14.up.railway.app/api/users/forgotpassword',
        { email },
        config
      );

      setMessage(data.message);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to request password reset.');
    }
  };

  return (
    <AuthContainer>
      <AuthTitle>Forgot Password</AuthTitle>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {message && <div>{message}</div>}
      <AuthForm onSubmit={handleSubmit}>
        <AuthInput
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <AuthButton type="submit">Request Password Reset</AuthButton>
      </AuthForm>
    </AuthContainer>
  );
};

export default ForgotPassword;