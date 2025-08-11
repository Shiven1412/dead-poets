import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { colors } from '../theme';
import { supabase } from '../App';

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


 const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'https://dead-poets.onrender.com/api/users/login',
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userId', response.data._id);
        onLogin?.();
        navigate('/');
      } else {
        setError('Login failed: No token received');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) {
        console.error('Google login error:', error);
        setError(error.message);
      } else {
        // Redirect user to the URL provided by Supabase
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Unexpected error during Google login:', err);
      setError('An unexpected error occurred during Google login.');
    }
  };

  const handleInstagramLogin = async () => {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'instagram',
        });
        if (error) {
            console.error('Instagram login error:', error);
            setError(error.message);
        } else {
            // Redirect user to the URL provided by Supabase
            window.location.href = data.url;
        }
    } catch (err) {
        console.error('Unexpected error during Instagram login:', err);
        setError('An unexpected error occurred during Instagram login.');
    }
};

  return (
    <AuthContainer>
      <AuthTitle>Login</AuthTitle>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <AuthForm onSubmit={handleSubmit}>
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
        <AuthButton type="submit">Log In</AuthButton>
        <AuthButton type="button" onClick={handleGoogleLogin}>
  Login with Google
</AuthButton>
<AuthButton type="button" onClick={handleInstagramLogin}>
  Login with Instagram
</AuthButton>
      </AuthForm>
      <AuthFooter>
        New user? <AuthLink to="/signup">Register here</AuthLink>
        <br></br>
        <AuthLink to="/forgotpassword">Forgot Password?</AuthLink>
      </AuthFooter>
    </AuthContainer>
  );
};

export default Login;