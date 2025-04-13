import React from 'react';
import styled from 'styled-components';
import { colors } from '../theme';

const ContactContainer = styled.div`
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

const Contact = () => {
  return (
    <ContactContainer>
      <Title>Contact Us</Title>
      <Paragraph>
        If you have any questions, feedback, or suggestions, please feel free to contact us.
      </Paragraph>
      <Paragraph>
        You can reach us by email at: <a href="mailto:Shivendratripathi2876@gmail.com">support@deadpoetssociety.com</a>
      </Paragraph>
      <Paragraph>
        We'll do our best to respond to your inquiry as soon as possible.
      </Paragraph>
    </ContactContainer>
  );
};

export default Contact;