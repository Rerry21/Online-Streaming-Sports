import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import GlobalStyle from './styles/GlobalStyle';
import useSports from './hooks/useSports';
import useMatches from './hooks/useMatches';
import useLiveMatches from './hooks/useLiveMatches';
import useFavourites from './hooks/useFavourites';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Sport from './pages/Sport';
import Live from './pages/Live';
import Favourites from './pages/Favourites';
import MatchDetail from './pages/MatchDetail';
import MultiStream from './pages/MultiStream';

export default function App() {
  const [query, setQuery] = useState('');

  const sportsState = useSports();
  const matchesState = useMatches();
  const liveState = useLiveMatches();
  const { favs, toggle, isFavMatch } = useFavourites();

  const sports = sportsState.sports || [];
  const matches = matchesState.matches || [];
  const liveMatches = liveState.matches || [];

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />

      <BrowserRouter>
        <Navbar
          query={query}
          onQuery={setQuery}
          sports={sports}
          matches={matches}
        />

        <Routes>
          <Route
            path="/"
            element={
              <Home
                matches={matches}
                liveMatches={liveMatches}
                sports={sports}
                loading={matchesState.loading || sportsState.loading}
                liveLoading={liveState.loading}
                error={matchesState.error || sportsState.error}
                liveError={liveState.error}
                query={query}
              />
            }
          />

          <Route
            path="/sport/:sport"
            element={
              <Sport
                matches={matches}
                sports={sports}
                loading={matchesState.loading}
                error={matchesState.error}
                query={query}
              />
            }
          />

          <Route
            path="/live"
            element={
              <Live
                matches={liveMatches}
                loading={liveState.loading}
                error={liveState.error}
              />
            }
          />

          <Route
            path="/favourites"
            element={
              <Favourites
                matches={matches}
                favs={favs}
                isFavMatch={isFavMatch}
              />
            }
          />

          <Route
            path="/match/:id"
            element={
              <MatchDetail
                matches={matches}
                favs={favs}
                toggle={toggle}
              />
            }
          />

          <Route
            path="/multistream"
            element={
              <MultiStream
                matches={matches}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}