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
      const response = await axios.post(
        'https://web-production-09e14.up.railway.app/api/users/register',
        { username, email, password }
      );

      if (response.status === 201) { // Check for 201 Created status
        onSignupSuccess(); // Call the onSignupSuccess prop
        // Optionally, navigate to a different page:
        // navigate('/login');
      } else {
        setError('Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('Signup failed');
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