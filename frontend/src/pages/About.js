import React from 'react';
import styled from 'styled-components';
import { colors } from '../theme';

const AboutContainer = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  background-color: ${colors.background};
  color: ${colors.text};
`;

const Title = styled.h2`
  color: ${colors.primary};
  border-bottom: 2px solid ${colors.primary};
  padding-bottom: 10px;
  margin-bottom: 20px;
`;

const Paragraph = styled.p`
  line-height: 1.6;
`;

const About = () => {
  return (
    <AboutContainer>
      <Title>About Dead Poet's Society</Title>
      <Paragraph>
        This website is a platform for sharing and discovering poetry. 
        It's inspired by the spirit of the Dead Poets Society, encouraging users to express themselves creatively and connect with others through the power of words.
      </Paragraph>
      <Paragraph>
        Our mission is to provide a space where poets of all levels can share their work, receive feedback, and find inspiration.
      </Paragraph>
    </AboutContainer>
  );
};

export default About;