import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
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
  justify-content: space-between;
  border-top: 1px solid #E2E8F0;
  padding-top: 15px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #718096;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 14px;

  &:hover {
    color: #00C9C8;
  }

  svg {
    margin-right: 5px;
  }

  @media (max-width: 480px) {
    margin-bottom: 5px;
  }
`;

const PoemFooter = styled.div`
  border-top: 1px solid #E2E8F0;
  padding-top: 10px;
  font-size: 14px;
  color: ${colors.lightText};
`;

const PoemCard = ({ poem, onLike, updatePoem, currentUser, onDelete }) => {
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [isLiked, setIsLiked] = useState(poem.likes.includes(currentUser?._id));
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(poem.content);
  const [editTitle, setEditTitle] = useState(poem.title);

  const handleLike = async () => {
    try {
      const response = await axios.post(
        `https://web-production-09e14.up.railway.app/api/poems/${poem._id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );
      const updatedPoem = response.data;
      updatePoem(updatedPoem);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error liking poem:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `https://web-production-09e14.up.railway.app/api/poems/${poem._id}/comment`,
        { text: comment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );
      const updatedPoem = response.data;
      updatePoem(updatedPoem);
      setComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await axios.delete(
        `https://web-production-09e14.up.railway.app/api/poems/${poem._id}/comments/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );
      const updatedPoem = response.data;
      updatePoem(updatedPoem);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `https://web-production-09e14.up.railway.app/api/poems/${poem._id}`,
        { title: editTitle, content: editContent },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );
      const updatedPoem = response.data;
      updatePoem(updatedPoem);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating poem:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `https://web-production-09e14.up.railway.app/api/poems/${poem._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );
      onDelete(poem._id);
    } catch (error) {
      console.error('Error deleting poem:', error);
    }
  };

  return (
    <Card>
      <Header>
        <Avatar>
          {poem.author?.username?.charAt(0).toUpperCase() || 'A'}
        </Avatar>
        <UserLink to={`/profile/${poem.author?._id}`}>
          {poem.author?.username || 'Anonymous'}
        </UserLink>
      </Header>

      {isEditing ? (
        <div>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
          <button onClick={handleUpdate}>Update</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <Content>{poem.content}</Content>
      )}

      <Actions>
        <ActionButton onClick={handleLike}>
          <FontAwesomeIcon icon={isLiked ? faHeart : faHeartRegular} style={{ color: isLiked ? 'red' : 'inherit' }} />
          {poem.likes.length} Likes
        </ActionButton>

        <ActionButton onClick={() => setShowComments(!showComments)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
          {poem.comments?.length || 0} Comments
        </ActionButton>
        {currentUser?._id === poem.author?._id && !isEditing && (
          <div>
            <button onClick={handleEdit}>Edit</button>
            <button onClick={handleDelete}>Delete</button>
          </div>
        )}
      </Actions>

      {showComments && (
        <div style={{ marginTop: '15px' }}>
          <div style={{ marginBottom: '15px' }}>
            {poem.comments?.map((comment, i) => (
              <div key={i} style={{ marginBottom: '10px', padding: '10px', background: '#F7FAFC', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <UserLink to={`/profile/${comment.user?._id}`}>
                    {comment.user?.username || 'Anonymous'}:
                  </UserLink>
                  <span style={{ marginLeft: '5px' }}>{comment.text}</span>
                </div>
                {(currentUser?._id === comment.user?._id || currentUser?._id === poem.user?._id) && (
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'red',
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleCommentSubmit} style={{ display: 'flex' }}>
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              style={{
                flex: 1,
                padding: '10px',
                border: '1px solid #E2E8F0',
                borderRadius: '20px',
                marginRight: '10px'
              }}
            />
            <button
              type="submit"
              style={{
                background: '#00C9C8',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                padding: '0 15px',
                cursor: 'pointer'
              }}
            >
              Post
            </button>
          </form>
        </div>
      )}
      <PoemFooter>{poem.title}</PoemFooter>
    </Card>
  );
};

export default PoemCard;