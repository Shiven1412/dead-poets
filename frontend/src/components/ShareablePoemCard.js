import React from 'react';
import styled from 'styled-components';

const ShareableCardContainer = styled.div`
  background-color: #fff; /* Or any background you prefer */
  border-radius: 15px;
  padding: 20px;
  width: 300px; /* Adjust width as needed */
  font-family: sans-serif;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ShareableUsername = styled.div`
  font-weight: bold;
  margin-bottom: 10px;
`;

const ShareableContent = styled.div`
  white-space: pre-line;
  line-height: 1.4;
  margin-bottom: 15px;
`;

const ShareableCaption = styled.div`
  font-style: italic;
  text-align: right;
`;

const ShareablePoemCard = ({ poem }) => {
  return (
    <ShareableCardContainer>
      <ShareableUsername>{poem.author?.username || 'Anonymous'}</ShareableUsername>
      <ShareableContent>{poem.content}</ShareableContent>
      <ShareableCaption>{poem.title}</ShareableCaption>
    </ShareableCardContainer>
  );
};

export default ShareablePoemCard;