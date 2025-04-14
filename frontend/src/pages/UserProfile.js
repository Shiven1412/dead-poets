import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import PoemCard from '../components/PoemCard';
import { colors } from '../theme'; // Import theme colors

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  box-shadow: 0 1px 7px rgba(0, 0, 0, 0.1);
  

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background-color: ${colors.background};
  border-radius: 15px;
  box-shadow: 0 3px 13px rgba(0, 0, 0, 0.1);

  @media (max-width: 480px) {
    flex-direction: column; /* Stack vertically on small screens */
    align-items: center; /* Center items */
    text-align: center; /* Center text */
    padding: 10px;
  }
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #00C9C8;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: bold;
  margin-right: 30px;

  @media (max-width: 480px) {
    margin-right: 0;
    margin-bottom: 15px;
    width: 80px;
    height: 80px;
    font-size: 28px;
  }
`;

const ProfileInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* Align items to the start */

  @media (max-width: 480px) {
    align-items: center; /* Center items on small screens */
  }
`;

const Username = styled.h1`
  margin: 0;
  color: #2D3748;
  font-size: 24px; /* Adjust font size */

  @media (max-width: 480px) {
    font-size: 20px; /* Smaller font size on small screens */
  }
`;

const Bio = styled.p`
  color:rgb(74, 18, 18);
  margin: 10px 0;
  font-size: 16px; /* Adjust font size */

  @media (max-width: 480px) {
    font-size: 14px; /* Smaller font size on small screens */
  }
`;

const Stats = styled.div`
  display: flex;
  margin-top: 15px;
  justify-content: center; /* Center the stats */

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center; /* Center items on small screens */
  }
`;

const StatItem = styled.div`
  margin-right: 20px;
  text-align: center;

  @media (max-width: 480px) {
    margin-right: 0;
    margin-bottom: 10px;
  }
`;

const StatNumber = styled.div`
  font-weight: bold;
  font-size: 18px;

  @media (max-width: 480px) {
    font-size: 16px; /* Smaller font size on small screens */
  }
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #718096;

  @media (max-width: 480px) {
    font-size: 12px; /* Smaller font size on small screens */
  }
`;

const FollowButton = styled.button`
  background-color: ${props => props.isFollowing ? '#FF6B9D' : '#00C9C8'};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  margin-top: 10px;
`;

const EditBioButton = styled.button`
  background-color: ${colors.primary};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-top: 10px;

  &:hover {
    background-color: ${colors.secondary};
    transform: translateY(-2px);
  }
`;

const CancelButton = styled.button`
  background-color: #ccc;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-left: 10px;

  &:hover {
    background-color: #999;
    transform: translateY(-2px);
  }
`;

const PoemsContainer = styled.div`
  margin-top: 30px;
`;

const Input = styled.input`
  padding: 12px;
  margin-bottom: 15px;
  border: 1.5px solid #ddd;
  border-radius: 10px;
  font-family: 'Merriweather', serif;
  font-size: 16px;
  width: 85%;

  &:focus {
    border-color: ${colors.primary};
    outline: none;
  }
`;

const TextArea = styled.textarea`
  width: 85%;
  padding: 15px;
  border: 1px solid #E2E8F0;
  border-radius: 10px;
  margin-bottom: 15px;
  font-family: 'Merriweather', serif;
  font-size: 16px;
  resize: vertical;
  min-height: 150px;

  &:focus {
    border-color: ${colors.primary};
    outline: none;
  }
`;

const SubmitButton = styled.button`
  background-color: ${colors.primary};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${colors.secondary};
    transform: translateY(-2px);
  }
`;

const PostForm = styled.form`
  background-color: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  border: 2px solid ${colors.primary};

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [poems, setPoems] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState('');
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [userRes, poemsRes] = await Promise.all([
          axios.get(`https://web-production-09e14.up.railway.app/api/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
          }),
          axios.get(`https://web-production-09e14.up.railway.app/api/poems?author=${userId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
          })
        ]);
        setUser(userRes.data);
        setPoems(poemsRes.data);
        setIsFollowing(userRes.data.followers.includes(localStorage.getItem('userId')));
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleFollow = async () => {
    try {
      await axios.post(`https://web-production-09e14.up.railway.app/api/users/${userId}/follow`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUpdateBio = async () => {
    try {
      await axios.put(
        `https://web-production-09e14.up.railway.app/api/users/profile`,
        { bio: bioInput },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );
      setUser({ ...user, bio: bioInput });
      setIsEditingBio(false);
    } catch (error) {
      console.error('Error updating bio:', error);
    }
  };

 const handleDeletePoem = async (poemId) => {
  try {
    await axios.delete(
      `https://web-production-09e14.up.railway.app/api/poems/${poemId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      }
    );
    // Only update local state after successful API call
    setPoems(poems.filter(poem => poem._id !== poemId));
  } catch (error) {
    console.error('Error deleting poem:', error);
    // Optionally show error message to user
  }
};

  const updatePoem = async (updatedPoem) => {
    setPoems(poems.map(poem => poem._id === updatedPoem._id ? updatedPoem : poem));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'https://web-production-09e14.up.railway.app/api/poems',
        { title, content, author: userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );
      setContent('');
      setTitle('');
      setShowForm(false);
      const poemsRes = await axios.get(`https://web-production-09e14.up.railway.app/api/poems?author=${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      setPoems(poemsRes.data);
    } catch (error) {
      console.error('Error posting poem:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <ProfileContainer>
      <ProfileHeader>
        <Avatar>
          {user.username.charAt(0).toUpperCase()}
        </Avatar>
        <ProfileInfo>
          <Username>{user.username}</Username>
          {isEditingBio ? (
            <div>
              <textarea
                value={bioInput}
                onChange={(e) => setBioInput(e.target.value)}
                style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
              />
              <SubmitButton onClick={handleUpdateBio}>Save</SubmitButton>
              <CancelButton onClick={() => setIsEditingBio(false)}>Cancel</CancelButton>
            </div>
          ) : (
            <>
              <Bio>{user.bio || 'No bio yet.'}</Bio>
              {localStorage.getItem('userId') === userId && (
                <EditBioButton onClick={() => {
                  setIsEditingBio(true);
                  setBioInput(user.bio || '');
                }}>
                  Edit Bio
                </EditBioButton>
              )}
            </>
          )}
          <Stats>
            <StatItem>
              <StatNumber>{poems.length}</StatNumber>
              <StatLabel>Poems</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>{user.followers.length}</StatNumber>
              <StatLabel>Followers</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>{user.following.length}</StatNumber>
              <StatLabel>Following</StatLabel>
            </StatItem>
          </Stats>
          {localStorage.getItem('userId') !== userId && (
            <FollowButton 
              onClick={handleFollow}
              isFollowing={isFollowing}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </FollowButton>
          )}
        </ProfileInfo>
      </ProfileHeader>

      {localStorage.getItem('userId') === userId && (
        <>
          {showForm ? (
            <PostForm onSubmit={handleSubmit}>
              <Input
                type="text"
                placeholder="Poem Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <TextArea
                placeholder="Write your poem here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
              <div>
                <SubmitButton type="submit">Post Poem</SubmitButton>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{
                    marginLeft: '10px',
                    background: 'none',
                    border: 'none',
                    color: colors.lightText,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </PostForm>
          ) : (
            <SubmitButton onClick={() => setShowForm(true)}>
              Create New Poem
            </SubmitButton>
          )}
        </>
      )}

      <PoemsContainer>
        <h2>Poems</h2>
        {poems.length > 0 ? (
          poems.map(poem => (
            <PoemCard
              key={poem._id}
              poem={poem}
              currentUser={user}
              updatePoem={updatePoem}
              onDelete={handleDeletePoem}
              showEditDelete={localStorage.getItem('userId') === userId} // Add this line
            />
          ))
        ) : (
          <p>No poems yet.</p>
        )}
      </PoemsContainer>
    </ProfileContainer>
  );
};

export default UserProfile;