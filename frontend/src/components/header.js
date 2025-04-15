import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { colors } from '../theme';
import { useState } from 'react'; // Import useState hook

const HeaderWrapper = styled.header`
  font-family: serif;
  background-color: ${colors.background};
  padding: 10px;
  border-bottom: 2px solid ${colors.primary};
  color: ${colors.text};
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 0.5em;
  font-style: italic;
  font-weight: normal;
  color: ${colors.text};
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

const StyledLink = styled(Link)`
  text-decoration: none;
  color: ${colors.text};

  &:hover {
    color: ${colors.secondary};
  }
`;

const SortContainer = styled.div`
  text-align: center;
  margin-top: 10px;
`;

const SortSelect = styled.select`
  padding: 5px;
  border-radius: 4px;
  border: 1px solid ${colors.primary};
  background-color: ${colors.background};
  color: ${colors.text};
  cursor: pointer;
`;

const Header = ({ onSortChange }) => {
  const [sortOption, setSortOption] = useState('latest');

  const handleSortChange = (e) => {
    const selectedOption = e.target.value;
    setSortOption(selectedOption);
    onSortChange(selectedOption); // Notify parent component about the sort change
  };

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
      {/* <SortContainer>
        <SortSelect value={sortOption} onChange={handleSortChange}>
          <option value="latest">Latest First</option>
          <option value="oldest">Oldest First</option>
          <option value="random">Random Order</option>
        </SortSelect>
      </SortContainer> */}
    </HeaderWrapper>
  );
};

export default Header;