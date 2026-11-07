import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Link, NavLink, useLocation } from 'react-router-dom';

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  background: rgba(11, 9, 18, .94);
  border-bottom: 1px solid ${(p) => p.theme.line};
  backdrop-filter: blur(18px);
`;

const Inner = styled.div`
  min-height: 68px;
  padding: 0 4vw;
  display: flex;
  align-items: center;
  gap: 22px;
`;

const Brand = styled(Link)`
  flex-shrink: 0;
  color: ${(p) => p.theme.text};
  text-decoration: none;
  font-family: ${(p) => p.theme.display};
  font-size: 22px;
  letter-spacing: -1px;

  span {
    color: ${(p) => p.theme.accentLight};
  }
`;

const SearchWrap = styled.div`
  position: relative;
  flex: 1;
  max-width: 460px;

  @media (max-width: 800px) {
    display: none;
  }
`;

const Search = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 15px;
  border-radius: 10px;
  border: 1px solid ${(p) => p.theme.line};
  outline: none;
  background: ${(p) => p.theme.panel};
  color: ${(p) => p.theme.text};
  font-size: 13px;
  transition: .2s ease;

  &::placeholder {
    color: ${(p) => p.theme.mute};
  }

  &:focus {
    border-color: ${(p) => p.theme.accent};
    box-shadow: 0 0 0 3px ${(p) => p.theme.accentSoft};
  }
`;

const SearchResults = styled.div`
  position: absolute;
  top: 48px;
  left: 0;
  right: 0;
  max-height: 360px;
  overflow-y: auto;
  padding: 7px;
  border: 1px solid ${(p) => p.theme.line};
  border-radius: 12px;
  background: ${(p) => p.theme.panel};
  box-shadow: 0 18px 50px rgba(0,0,0,.45);
`;

const SearchItem = styled(Link)`
  display: block;
  padding: 11px;
  border-radius: 8px;
  color: ${(p) => p.theme.text};
  text-decoration: none;

  &:hover {
    background: ${(p) => p.theme.accentSoft};
  }

  strong {
    display: block;
    font-size: 13px;
    margin-bottom: 3px;
  }

  span {
    color: ${(p) => p.theme.mute};
    font-size: 11px;
  }
`;

const DesktopNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-left: auto;

  @media (max-width: 800px) {
    display: none;
  }
`;

const NavItem = styled(NavLink)`
  padding: 9px 11px;
  border-radius: 8px;
  color: ${(p) => p.theme.mute};
  text-decoration: none;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
  transition: .2s ease;

  &:hover {
    color: ${(p) => p.theme.text};
    background: ${(p) => p.theme.panel};
  }

  &.active {
    color: ${(p) => p.theme.text};
    background: ${(p) => p.theme.accentSoft};
  }
`;

const MenuButton = styled.button`
  display: none;
  margin-left: auto;
  width: 40px;
  height: 40px;
  border: 1px solid ${(p) => p.theme.line};
  border-radius: 9px;
  background: ${(p) => p.theme.panel};
  color: ${(p) => p.theme.text};
  cursor: pointer;
  font-size: 20px;

  @media (max-width: 800px) {
    display: grid;
    place-items: center;
  }
`;

const MobileMenu = styled.div`
  display: none;

  @media (max-width: 800px) {
    display: block;
    padding: 0 4vw 16px;
    border-top: 1px solid ${(p) => p.theme.line};
  }
`;

const MobileSearch = styled(Search)`
  display: none;

  @media (max-width: 800px) {
    display: block;
    margin-top: 14px;
  }
`;

const MobileLinks = styled.nav`
  display: grid;
  gap: 5px;
  margin-top: 12px;
`;

const MobileLink = styled(NavLink)`
  padding: 13px 12px;
  border-radius: 9px;
  color: ${(p) => p.theme.mute};
  text-decoration: none;
  font-size: 13px;
  font-weight: 700;

  &.active {
    color: ${(p) => p.theme.text};
    background: ${(p) => p.theme.accentSoft};
  }
`;

const SportBar = styled.div`
  display: flex;
  gap: 7px;
  overflow-x: auto;
  padding: 0 4vw 11px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const SportLink = styled(NavLink)`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 7px 10px;
  border: 1px solid ${(p) => p.theme.line};
  border-radius: 99px;
  color: ${(p) => p.theme.mute};
  text-decoration: none;
  font-size: 11px;
  font-weight: 700;
  background: ${(p) => p.theme.panel};

  &.active {
    color: ${(p) => p.theme.text};
    border-color: ${(p) => p.theme.accent};
    background: ${(p) => p.theme.accentSoft};
  }
`;

function getIcon(id) {
  const icons = {
    football: '⚽',
    basketball: '🏀',
    tennis: '🎾',
    hockey: '🏒',
    baseball: '⚾',
    'american-football': '🏈',
    'motor-sports': '🏎️',
    fight: '🥊',
    rugby: '🏉',
    golf: '⛳',
    billiards: '🎱',
    darts: '🎯',
    cricket: '🏏',
    afl: '🏉'
  };

  return icons[id] || '🏆';
}

export default function Navbar({
  query,
  onQuery,
  sports = [],
  matches = []
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return [];

    return matches
      .filter((match) =>
        [
          match.title,
          match.home,
          match.away,
          match.league,
          match.sportName,
          match.sport
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(q)
          )
      )
      .slice(0, 7);
  }, [query, matches]);

  return (
    <Header>
      <Inner>
        <Brand to="/">
          MATCH<span>DAY</span>
        </Brand>

        <SearchWrap>
          <Search
            value={query}
            onChange={(event) =>
              onQuery(event.target.value)
            }
            placeholder="Search teams, matches, leagues..."
          />

          {results.length > 0 && (
            <SearchResults>
              {results.map((match) => (
                <SearchItem
                  key={match.id}
                  to={`/match/${match.id}`}
                >
                  <strong>
                    {match.title ||
                      `${match.home} vs ${match.away}`}
                  </strong>

                  <span>
                    {match.sportName || match.sport}
                    {match.league
                      ? ` • ${match.league}`
                      : ''}
                  </span>
                </SearchItem>
              ))}
            </SearchResults>
          )}
        </SearchWrap>

        <DesktopNav>
          <NavItem to="/multistream">
            Multi Stream
          </NavItem>

          <NavItem to="/live">
            Live
          </NavItem>

          <NavItem to="/favourites">
            Favourites
          </NavItem>
        </DesktopNav>

        <MenuButton
          onClick={() => setMenuOpen((value) => !value)}
          aria-label="Toggle menu"
        >
          {menuOpen ? '×' : '☰'}
        </MenuButton>
      </Inner>

      {menuOpen && (
        <MobileMenu>
          <MobileSearch
            value={query}
            onChange={(event) =>
              onQuery(event.target.value)
            }
            placeholder="Search teams, matches, leagues..."
          />

          <MobileLinks>
            <MobileLink to="/multistream">
              Multi Stream
            </MobileLink>

            <MobileLink to="/live">
              Live Now
            </MobileLink>

            <MobileLink to="/favourites">
              Favourites
            </MobileLink>
          </MobileLinks>
        </MobileMenu>
      )}

      <SportBar>
        <SportLink to="/">
          🏠 All
        </SportLink>

        {sports.map((sport) => (
          <SportLink
            key={sport.id}
            to={`/sport/${sport.id}`}
          >
            {getIcon(sport.id)}
            {sport.name}
          </SportLink>
        ))}
      </SportBar>
    </Header>
  );
}