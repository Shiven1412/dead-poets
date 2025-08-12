// filepath: frontend/src/components/PoemFact.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { colors } from '../theme';

const FactCard = styled.div`
  background-color: ${colors.poemfcard};
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 260px;
  margin-bottom: 20px;
  text-align: center;
`;

const FactText = styled.p`
  font-style: italic;
  color: ${colors.poemftext};
  font-size: 36px;
`;

const PoemFact = () => {
  const [fact, setFact] = useState('');

  const poemFacts = [
    "Poetry is older than writing.",
    "The longest poem ever written is the Mahabharata.",
    "Shakespeare invented over 1700 common words.",
    "The oldest known literary work, the Epic of Gilgamesh, is a poem from ancient Mesopotamia that was composed nearly 4,000 years ago.",
    "Emily Dickinson wrote nearly 1,800 poems, but only a handful were published during her lifetime.",
    "The word 'poetry' comes from the Greek word 'poiesis', which means 'making' or 'creating'.",
    "The haiku, a traditional form of Japanese poetry, consists of three lines with a 5-7-5 syllable structure.",
    "Metrophobia is the term for a specific and intense fear or hatred of poetry."
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