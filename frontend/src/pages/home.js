import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import PoemCard from '../components/PoemCard';
import { colors } from '../theme';

// Styled Components
const PageContainer = styled.div`
  font-family: 'Merriweather', serif;
  line-height: 1.6;
  color: ${colors.text};
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: ${colors.background};

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Title = styled.h1`
  color: ${colors.text};
  border-bottom: 2px solid ${colors.primary};
  padding-bottom: 8px;
`;

const Nav = styled.nav`
  display: flex;
  gap: 15px;

  @media (max-width: 480px) {
    margin-top: 10px;
    flex-direction: column;
    align-items: flex-start;
  }
`;

const NavLink = styled(Link)`
  color: ${colors.primary};
  text-decoration: none;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.3s ease;

  &:hover {
    color: white;
    background-color: ${colors.secondary};
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

const SectionTitle = styled.h2`
  border-bottom: 2px solid ${colors.primary};
  padding-bottom: 8px;
  margin: 30px 0 25px;
  font-weight: 700;
  color: ${colors.text};
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

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 20px;
  margin-right: 10px;
  width: 200px;
`;

const SearchButton = styled.button`
  background-color: ${colors.primary};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
`;

const SearchResults = styled.div`
  margin-top: 20px;
`;

const SearchResultItem = styled(Link)`
  display: block;
  padding: 10px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
  text-decoration: none;
  color: ${colors.text};

  &:hover {
    background-color: #f0f0f0;
  }
`;

const Home = () => {
  const [poems, setPoems] = useState([]);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
      fetchCurrentUser(token);
      fetchPoems();
    }
  }, []);

  const fetchCurrentUser = async (token) => {
    try {
      const response = await axios.get('web-production-09e14.up.railway.app/api/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCurrentUser(response.data);
      localStorage.setItem('userId', response.data._id);
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const fetchPoems = async () => {
    try {
      const res = await axios.get('web-production-09e14.up.railway.app/api/poems');
      setPoems(res.data);
    } catch (error) {
      console.error('Error fetching poems:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('web-production-09e14.up.railway.app/api/poems',
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );
      setContent('');
      setTitle('');
      setShowForm(false);
      fetchPoems();
    } catch (error) {
      console.error('Error posting poem:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    navigate('/');
  };

  const handleLike = async (poemId) => {
    try {
      await axios.post(
        `web-production-09e14.up.railway.app/api/poems/${poemId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );
      fetchPoems();
    } catch (error) {
      console.error('Error liking poem:', error);
    }
  };

  const updatePoem = (updatedPoem) => {
    setPoems(poems.map(poem => poem._id === updatedPoem._id ? updatedPoem : poem));
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`web-production-09e14.up.railway.app/api/users/search?search=${searchTerm}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching users:', error);
      alert('Error searching users. Please try again.');
    }
  };

  return (
    <PageContainer>
      <Header>
        <Title>Dead Poet's Society</Title>
        <Nav>
          {isLoggedIn ? (
            <>
              <NavLink to={`/profile/${currentUser?._id}`}>
                {currentUser?.username}
              </NavLink>
              <NavLink as="button" onClick={handleLogout}>Logout</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/signup">Signup</NavLink>
            </>
          )}
        </Nav>
      </Header>

      {isLoggedIn && (
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

      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Search for users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <SearchButton onClick={handleSearch}>Search</SearchButton>
      </SearchContainer>

      <SearchResults>
        {searchResults.map(user => (
          <SearchResultItem key={user._id} to={`/profile/${user._id}`}>
            {user.username}
          </SearchResultItem>
        ))}
      </SearchResults>

      <SectionTitle>Recent Poems</SectionTitle>
      {poems.length > 0 ? (
        poems.map(poem => (
          <PoemCard
            key={poem._id}
            poem={poem}
            onLike={handleLike}
            updatePoem={updatePoem}
            currentUser={currentUser}
          />
        ))
      ) : (
        <p>No poems yet. Be the first to post!</p>
      )}
    </PageContainer>
  );
};

export default Home;