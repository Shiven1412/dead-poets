import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import PoemCard from '../components/PoemCard';

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
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
`;

const Username = styled.h1`
  margin: 0;
  color: #2D3748;
`;

const Bio = styled.p`
  color: #718096;
  margin: 10px 0;
`;

const Stats = styled.div`
  display: flex;
  margin-top: 15px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
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
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #718096;
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

const PoemsContainer = styled.div`
  margin-top: 30px;
`;

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [poems, setPoems] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [userRes, poemsRes] = await Promise.all([
          axios.get(`web-production-09e14.up.railway.app/api/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
          }),
          axios.get(`web-production-09e14.up.railway.app/api/poems?author=${userId}`, { // Corrected URL
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
      await axios.post(`web-production-09e14.up.railway.app/api/users/${userId}/follow`, {}, {
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
        `web-production-09e14.up.railway.app/api/users/profile`,
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
    setPoems(poems.filter(poem => poem._id !== poemId));
  };

  const updatePoem = async (updatedPoem) => {
    setPoems(poems.map(poem => poem._id === updatedPoem._id ? updatedPoem : poem));
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
              <button onClick={handleUpdateBio}>Save</button>
              <button onClick={() => setIsEditingBio(false)}>Cancel</button>
            </div>
          ) : (
            <>
              <Bio>{user.bio || 'No bio yet.'}</Bio>
              {localStorage.getItem('userId') === userId && (
                <button onClick={() => {
                  setIsEditingBio(true);
                  setBioInput(user.bio || '');
                }}>
                  Edit Bio
                </button>
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