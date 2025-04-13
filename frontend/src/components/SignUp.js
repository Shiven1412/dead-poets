import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const SignupContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
`;

const Input = styled.input`
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #3e8e41;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 10px;
`;

const Signup = ({ onSignupSuccess }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('web-production-09e14.up.railway.app/api/users/register', {
        username,
        email,
        password,
      });
      
      // Check for successful response
      if (response.data && response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userId', response.data._id);
        onSignupSuccess(); // This should trigger navigation in parent
      } else {
        setError('Registration successful but no token received');
      }
    } catch (error) {
      console.error('Signup error:', error.response?.data);
      setError(error.response?.data?.message || 'Signup failed. Please try again.');
    }
  
  };

  return (
    <SignupContainer>
      <h2>Sign Up</h2>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">Sign Up</Button>
      </form>
    </SignupContainer>
  );
};

export default Signup;