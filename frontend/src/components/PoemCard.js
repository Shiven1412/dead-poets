import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { colors } from '../theme';
import { FaHeart, FaRegHeart, FaComment } from 'react-icons/fa'; // Import heart and comment icons

const Card = styled.div`
  background-color:rgb(43, 43, 44);
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
  color:rgb(224, 224, 224);
  text-decoration: none;

  &:hover {
    color: #FF6B9D;
  }
`;

const Content = styled.div`
  white-space: pre-line;
  line-height: 1.6;
  margin-bottom: 15px;
  color:rgb(216, 213, 171)
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
 color:rgb(216, 213, 171);
  padding: 5px 8px;
  border-radius: 3px;
  cursor: pointer;
  transition: color 0.3s ease;
  font-size: 14px;
  display: flex;
  align-items: center;

  &:hover {
    color:rgb(255, 191, 152);
  }

  svg {
    margin-right: 5px;
  }

  @media (max-width: 480px) {
    margin-bottom: 5px;
  }
`;

const PoemFooter = styled.div`
  border-top: 0.5px solid #E2E8F0;
  padding-top: 10px;
  font-size: 14px;
  color:rgb(205, 205, 205);
  font-style: italic; /* Add italic style */
  text-align: center; /* Align to the right */
`;

const CommentForm = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
`;

const CommentInput = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 20px;
  margin-right: 10px;
  flex: 1;
`;

const CommentButton = styled.button`
  background-color: ${colors.primary};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${colors.secondary};
  }
`;

const CommentsSection = styled.div`
  margin-top: 10px;
  color:rgb(219, 219, 219)
`;

const Comment = styled.div`
  max-height: 160px; /* 8 lines of comment */
  overflow-y: auto;
  padding: 5px;
`;

// const Comment = styled.div`
//   padding: 8px;
//   border-bottom: 1px solid #eee;
// `;
const CommentsContainer = styled.div`
  max-height: 160px; /* 8 lines of comment */
  overflow-y: auto;
  padding: 5px;
`;

const PoemCard = ({ poem, onLike, updatePoem, currentUser, showEditDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(poem.content);
  const [commentText, setCommentText] = useState(''); // Add comment state
  const [comments, setComments] = useState(poem.comments || []); // Initialize comments
  const [showComments, setShowComments] = useState(false); // Add this line
  const [hasLiked, setHasLiked] = useState(poem.likes.includes(currentUser?._id)); // Check if user has liked

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
        `https://web-production-09e14.up.railway.app/api/poems/${poem._id}/comment`, // Use /comment endpoint
        { text: commentText },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );
      setComments(response.data.comments); // Update comments state
      setCommentText(''); // Clear input
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleLikeClick = () => {
    onLike(poem._id); // Call the onLike function
    setHasLiked(!hasLiked); // Toggle the hasLiked state
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
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
      ) : (
        <Content>{poem.content}</Content>
      )}
      <PoemFooter>{poem.title}</PoemFooter> {/* Display title in footer */}
      <Actions>
        {showEditDelete && currentUser && currentUser._id === poem.author._id && (
          <>
            {isEditing ? (
              <ActionButton onClick={handleSave}>Save</ActionButton>
            ) : (
              <ActionButton onClick={handleEdit}>Edit</ActionButton>
            )}
            <ActionButton onClick={handleDelete}>Delete</ActionButton>
          </>
        )}
        <ActionButton onClick={handleLikeClick}>
          {hasLiked ? <FaHeart color="red" /> : <FaRegHeart />}
          {poem.likes.length} {/* Display number of likes */}
        </ActionButton>
        <ActionButton onClick={() => setShowComments(!showComments)}>
          <FaComment />
        </ActionButton>
      </Actions>
      {showComments && (
        <CommentsSection>
          <CommentForm>
            <CommentInput
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <CommentButton onClick={handleCommentSubmit}>Post</CommentButton>
          </CommentForm>
          <CommentsContainer>
            {comments.map((comment) => (
              <Comment key={comment._id}>
                {comment.user.username}: {comment.text}
              </Comment>
            ))}
          </CommentsContainer>
        </CommentsSection>
      )}
    </Card>
  );
};

export default PoemCard;