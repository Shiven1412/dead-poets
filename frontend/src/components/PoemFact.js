// filepath: frontend/src/components/PoemFact.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { colors } from '../theme';

const FactCard = styled.div`
  background-color: ${colors.background};
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
  text-align: center;
`;

const FactText = styled.p`
  font-style: italic;
  color: ${colors.text};
`;

const PoemFact = () => {
  const [fact, setFact] = useState('');

  const poemFacts = [
    "Poetry is older than writing.",
    "The longest poem ever written is the Mahabharata.",
    "Shakespeare invented over 1700 common words.",
    // Add more facts here
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * poemFacts.length);
      setFact(poemFacts[randomIndex]);
    }, 5000); // Change fact every 5 seconds

    return () => clearInterval(intervalId); // Clear interval on unmount
  }, []);

  return (
    <FactCard>
      <FactText>{fact}</FactText>
    </FactCard>
  );
};

export default PoemFact;