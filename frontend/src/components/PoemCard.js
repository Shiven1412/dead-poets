import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { colors } from '../theme';

const Card = styled.div`
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #00C9C8;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 10px;

  @media (max-width: 480px) {
    margin-right: 0;
    margin-bottom: 5px;
  }
`;

const UserLink = styled(Link)`
  font-weight: 600;
  color: #2D3748;
  text-decoration: none;

  &:hover {
    color: #FF6B9D;
  }
`;

const Content = styled.div`
  white-space: pre-line;
  line-height: 1.6;
  margin-bottom: 15px;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const ActionButton = styled.button`
  background-color: ${colors.primary};
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${colors.secondary};
  }
`;

const PoemCard = ({ poem, onLike, updatePoem, currentUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(poem.content);
  const [commentText, setCommentText] = useState(''); // Add comment state
  const [comments, setComments] = useState(poem.comments || []); // Initialize comments

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `https://web-production-09e14.up.railway.app/api/poems/${poem._id}`,
        { content: editedContent },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );
      updatePoem(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating poem:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`https://web-production-09e14.up.railway.app/api/poems/${poem._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      // After deleting, fetch the poems again to update the list
      // You might want to pass a fetchPoems function as a prop instead
      window.location.reload(); // Simplest way to refresh the poem list
    } catch (error) {
      console.error('Error deleting poem:', error);
    }
  };

  const handleCommentSubmit = async () => {
    try {
      const response = await axios.post(
        `https://web-production-09e14.up.railway.app/api/poems/${poem._id}/comments`,
        { text: commentText },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );
      setComments([...comments, response.data]); // Add new comment to state
      setCommentText(''); // Clear input
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <Card>
      <Header>
        <Avatar>{poem.author.username.charAt(0).toUpperCase()}</Avatar>
        <UserLink to={`/profile/${poem.author._id}`}>{poem.author.username}</UserLink>
      </Header>
      {isEditing ? (
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
      ) : (
        <Content>{poem.content}</Content>
      )}
      <footer>{poem.caption}</footer> {/* Display caption */}
      <Actions>
        {currentUser && currentUser._id === poem.author._id && (
          <>
            {isEditing ? (
              <ActionButton onClick={handleSave}>Save</ActionButton>
            ) : (
              <ActionButton onClick={handleEdit}>Edit</ActionButton>
            )}
            <ActionButton onClick={handleDelete}>Delete</ActionButton>
          </>
        )}
        <ActionButton onClick={() => onLike(poem._id)}>
          Like ({poem.likes.length})
        </ActionButton>
      </Actions>
      <div>
        <input
          type="text"
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button onClick={handleCommentSubmit}>Post Comment</button>
      </div>
      <div>
        {comments.map((comment) => (
          <div key={comment._id}>
            {comment.user.username}: {comment.text}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default PoemCard;