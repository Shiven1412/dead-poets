import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import PoemCard from '../components/PoemCard';
import { colors } from '../theme';
import { FaSearch, FaUserCircle, FaChevronDown, FaSignOutAlt } from 'react-icons/fa';

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
  flex-wrap: wrap;
  gap: 15px;

  @media (max-width: 768px) {
    flex-direction: row;
    align-items: center;
    margin-bottom: 20px;
  }
`;

const Title = styled.h1`
  color: ${colors.text};
  border-bottom: 2px solid ${colors.primary};
  padding-bottom: 6px;
  margin: 0;
  font-size: 1.5rem;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 1rem;
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 15px;
  align-items: center;

  @media (max-width: 768px) {
    gap: 10px;
  }
`;

const NavLink = styled(Link)`
  color: ${colors.text};
  text-decoration: none;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    color: white;
    background-color: ${colors.secondary};
  }

  @media (max-width: 768px) {
    display: ${props => (props.hideOnMobile ? 'none' : 'block')};
    padding: 6px 12px;
    font-size: 0.9rem;
  }
`;

const MobileNavLink = styled(Link)`
  color: ${colors.text};
  text-decoration: none;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  font-size: 0.9rem;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const SectionTitle = styled.h2`
  border-bottom: 2px solid ${colors.primary};
  padding-bottom: 8px;
  margin: 30px 0 25px;
  font-weight: 700;
  color: ${colors.text};
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-right: 15px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileSearchContainer = styled.div`
  display: none;
  align-items: center;
  margin-left: auto;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const SearchInput = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 20px;
  margin-right: 10px;
  width: 200px;
  transition: all 0.3s ease;
  opacity: ${props => (props.show ? '1' : '0')};
  width: ${props => (props.show ? '200px' : '0')};
  padding: ${props => (props.show ? '10px' : '0')};
  border: ${props => (props.show ? '1px solid #ddd' : 'none')};
  margin-right: ${props => (props.show ? '10px' : '0')};
`;

const SearchButton = styled.button`
  background-color: ${colors.primary};
  color: white;
  border: none;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  min-height: 36px;
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

const UserDropdown = styled.div`
  position: relative;
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

const DropdownToggle = styled.button`
  background: none;
  border: none;
  color: ${colors.primary};
  font-weight: 600;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  min-height: 36px;
`;

const DropdownMenu = styled.div`
  position: absolute;
  right: 0;
  top: 100%;
  background-color:rgb(168, 165, 142);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 200px;
  z-index: 100;
  display: ${props => (props.isOpen ? 'block' : 'none')};
`;

const DropdownItem = styled.div`
  padding: 10px 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
   box-shadow: 0 2px 10px rgba(0, 0, 0, 0.19);
  border-radius: 8px;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const Home = () => {
  const [poems, setPoems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

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
      const response = await axios.get('https://web-production-09e14.up.railway.app/api/users/me', {
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
      const res = await axios.get('https://web-production-09e14.up.railway.app/api/poems');
      setPoems(res.data);
    } catch (error) {
      console.error('Error fetching poems:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    setDropdownOpen(false);
    navigate('/');
  };

  const handleLike = async (poemId) => {
    try {
      await axios.post(
        `https://web-production-09e14.up.railway.app/api/poems/${poemId}/like`,
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
      const response = await axios.get(
        `https://web-production-09e14.up.railway.app/api/users/search?search=${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );
      setSearchResults(response.data);
      setMobileSearchOpen(false);
    } catch (error) {
      console.error('Error searching users:', error);
      alert('Error searching users. Please try again.');
    }
  };

  return (
    <PageContainer>
      <Header>
        <Title>Dead Poets Society</Title>
        
        {/* <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Search for users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            show={true}
          /> */}
          {/* <SearchButton onClick={handleSearch}>
            <FaSearch />
          </SearchButton>
        </SearchContainer> */}

        <Nav>
          {isLoggedIn ? (
            <>
              <NavLink to={`/profile/${currentUser?._id}`} hideOnMobile>
                {currentUser?.username}
              </NavLink>
              <NavLink as="button" onClick={handleLogout} hideOnMobile>
                Logout
              </NavLink>
              
              {/* <MobileSearchContainer>
                <SearchButton onClick={() => setMobileSearchOpen(!mobileSearchOpen)}>
                  <FaSearch />
                </SearchButton>
                <SearchInput
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  show={mobileSearchOpen}
                />
              </MobileSearchContainer> */}
              
              <UserDropdown>
                <DropdownToggle onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <FaUserCircle size={20} />
                </DropdownToggle>
                <DropdownMenu isOpen={dropdownOpen}>
                  <MobileNavLink 
                    to={`/profile/${currentUser?._id}`} 
                    onClick={() => setDropdownOpen(false)}
                  >
                    <FaUserCircle /> Profile
                  </MobileNavLink>
                  <DropdownItem onClick={handleLogout}>
                    <FaSignOutAlt /> Logout
                  </DropdownItem>
                </DropdownMenu>
              </UserDropdown>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/signup">Signup</NavLink>
            </>
          )}
        </Nav>
      </Header>

      {mobileSearchOpen && (
        <SearchResults>
          {searchResults.map(user => (
            <SearchResultItem key={user._id} to={`/profile/${user._id}`}>
              {user.username}
            </SearchResultItem>
          ))}
        </SearchResults>
      )}
      
      {isLoggedIn ? (
        <> 
          <SectionTitle>Recent Poems</SectionTitle>
          {poems.length > 0 ? (
            poems.map(poem => (
              <PoemCard
                key={poem._id}
                poem={poem}
                onLike={handleLike}
                updatePoem={updatePoem}
                currentUser={currentUser}
                showEditDelete={false}
              />
            ))
          ) : (
            <p>No poems yet. Be the first to post!</p>
          )}
        </>
      ) : (
        <>
          <SectionTitle></SectionTitle>
          <p>Please SignUp to be a part of The Dead Poets Society!</p>
        </>
      )}
    </PageContainer>
  );
};

export default Home;