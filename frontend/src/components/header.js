import styled from 'styled-components';
import { Link } from 'react-router-dom'; // Import Link

// Import theme colors (assuming you have a theme file)
import { colors } from '../theme';

const HeaderWrapper = styled.header`
  font-family: serif;
  background-color: ${colors.background}; // Use theme color
  padding: 10px;
  border-bottom: 2px solid ${colors.primary}; // Use theme color
  color: ${colors.text}; // Use theme color
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 0.5em;
  font-style: italic;
  font-weight: normal;
  color: ${colors.primary}; // Use theme color
`;

const Nav = styled.nav`
  text-align: center;
`;

const List = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: inline-block;
`;

const ListItem = styled.li`
  display: inline;
  margin-right: 1em;
`;

const StyledLink = styled(Link)`  // Use Link from react-router-dom
  text-decoration: none;
  color: ${colors.text}; // Use theme color

  &:hover {
    color: ${colors.secondary}; // Use theme color
  }
`;

const Header = () => {
  return (
    <HeaderWrapper className="header">
      <Title>Dead Poets Society</Title>
      <Nav>
        <List>
          <ListItem><StyledLink to="/">Home</StyledLink></ListItem>
          <ListItem><StyledLink to="/about">About</StyledLink></ListItem>
          <ListItem><StyledLink to="/contact">Contact</StyledLink></ListItem>
        </List>
      </Nav>
    </HeaderWrapper>
  );
};

export default Header;