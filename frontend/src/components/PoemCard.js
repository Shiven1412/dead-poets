import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { colors } from '../theme';
import { FaHeart, FaRegHeart, FaComment, FaEllipsisV } from 'react-icons/fa'; // Import heart, comment, and ellipsis icons
import html2canvas from 'html2canvas';
import ReactDOM from 'react-dom/client'; // Import ReactDOM
import ShareablePoemCard from './ShareablePoemCard'; // Import the new component

const Card = styled.div`
  background-color:rgb(43, 43, 44);
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
  position: relative; /* Make card position relative */
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
    flex-direction: row;
    justify-content: space-between;
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

const CommentsContainer = styled.div`
  max-height: 160px; /* 8 lines of comment */
  overflow-y: auto;
  padding: 5px;
`;

const OptionsButton = styled.button`
  background: none;
  border: none;
  color: rgb(216, 213, 171);
  padding: 5px 8px;
  border-radius: 3px;
  cursor: pointer;
  transition: color 0.3s ease;
  font-size: 14px;
  position: absolute;
  top: 10px;
  right: 10px;

  &:hover {
    color: rgb(255, 191, 152);
  }
`;

const OptionsMenu = styled.div`
  position: absolute;
  top: 30px;
  right: 10px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  padding: 5px 0;
  display: ${props => (props.isOpen ? 'block' : 'none')};
  z-index: 10;
`;

const Option = styled.button`
  display: block;
  width: 100%;
  padding: 8px 15px;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  color: #333;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const PoemCard = ({ poem, onLike, updatePoem, currentUser, showEditDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(poem.content);
  const [commentText, setCommentText] = useState(''); // Add comment state
  const [comments, setComments] = useState(poem.comments || []); // Initialize comments
  const [showComments, setShowComments] = useState(false); // Add this line
  const [hasLiked, setHasLiked] = useState(poem.likes.includes(currentUser?._id)); // Check if user has liked
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
  const cardRef = useRef(null);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `https://dead-poets.onrender.com/api/poems/${poem._id}`,
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
      await axios.delete(`https://dead-poets.onrender.com/api/poems/${poem._id}`, {
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
        `https://dead-poets.onrender.com/api/poems/${poem._id}/comment`, // Use /comment endpoint
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

  const handleShareLink = () => {
    const poemUrl = window.location.origin + `/poem/${poem._id}`; // Adjust the URL as needed
    navigator.clipboard.writeText(poemUrl);
    alert('Poem link copied to clipboard!');
    setIsOptionsMenuOpen(false); // Close options menu
  };

  const handleShareImage = async () => {
    try {
      // Create a temporary container
      const container = document.createElement('div');
      document.body.appendChild(container);

      // Render the ShareablePoemCard into the container
      const root = ReactDOM.createRoot(container);
      root.render(<ShareablePoemCard poem={poem} />);

      // Use html2canvas on the container
      const canvas = await html2canvas(container, {
        useCORS: true,
        logging: true, // Enable logging
        letterRendering: 1,
        allowTaint: true,
      });

      // Clean up the temporary container
      root.unmount();
      document.body.removeChild(container);

      const dataURL = canvas.toDataURL('image/png');

      // Attempt to share with the Web Share API
      if (navigator.share) {
        try {
          await navigator.share({
            title: poem.title,
            text: poem.content.substring(0, 100) + '...',
            url: dataURL, // Share the Data URL
          });
          console.log('Shared successfully');
        } catch (error) {
          console.error('Error sharing:', error);
          // If native share fails, fall back to downloading the image
          downloadImage(dataURL, `poem_${poem._id}.png`);
        }
      } else {
        // If Web Share API is not supported, download the image
        downloadImage(dataURL, `poem_${poem._id}.png`);
      }
      setIsOptionsMenuOpen(false); // Close options menu
    } catch (error) {
      console.error('Error creating image:', error);
    }
  };

  const handleNativeShare = async () => {
    const poemUrl = window.location.origin + `/poem/${poem._id}`;
    const shareData = {
      title: poem.title,
      text: poem.content.substring(0, 100) + '...', // Short excerpt
      url: poemUrl,
    };

    try {
      await navigator.share(shareData);
      console.log('Shared successfully');
    } catch (err) {
      console.log('Error sharing:', err);
      // Fallback to copy link if sharing is not supported
      handleShareLink();
    }
    setIsOptionsMenuOpen(false); // Close options menu
  };

  const toggleOptionsMenu = () => {
    setIsOptionsMenuOpen(!isOptionsMenuOpen);
  };

  const downloadImage = (dataURL, filename) => {
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card ref={cardRef}>
      <Header>
        <Avatar>
          {poem.author?.username?.charAt(0).toUpperCase() || 'A'}
        </Avatar>
        <UserLink to={`/profile/${poem.author?._id}`}>
          {poem.author?.username || 'Anonymous'}
        </UserLink>
      </Header>
      <OptionsButton onClick={toggleOptionsMenu}>
        <FaEllipsisV />
      </OptionsButton>
      <OptionsMenu isOpen={isOptionsMenuOpen}>
        {navigator.share ? (
          <Option onClick={handleNativeShare}>Share</Option>
        ) : (
          <Option onClick={handleShareLink}>Copy Link</Option>
        )}
        <Option onClick={handleShareImage}>Share Image</Option>
      </OptionsMenu>
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