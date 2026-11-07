import styled from 'styled-components';
import SportSection from '../components/SportSection';
import EventCard from '../components/EventCard';

export const Message = styled.div`
  padding: 40px 4vw;
  color: ${(p) => p.theme.mute};
  font-size: 14px;
`;

const Hero = styled.section`
  margin: 24px 4vw 32px;
  padding: 34px 36px;
  border-radius: 18px;
  border: 1px solid ${(p) => p.theme.line};
  background:
    radial-gradient(
      circle at 80% 20%,
      rgba(139,61,255,.24),
      transparent 35%
    ),
    linear-gradient(
      135deg,
      #181126,
      #0f0b18
    );
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    width: 220px;
    height: 220px;
    right: -70px;
    bottom: -100px;
    border-radius: 50%;
    background: ${(p) => p.theme.accent};
    opacity: .08;
    filter: blur(45px);
  }

  @media (max-width: 600px) {
    margin: 16px 4vw 25px;
    padding: 26px 22px;
  }
`;

const HeroTitle = styled.h1`
  position: relative;
  z-index: 1;
  margin: 0 0 9px;
  font-family: ${(p) => p.theme.display};
  font-size: clamp(32px, 5vw, 56px);
  letter-spacing: -1px;
`;

const HeroText = styled.div`
  position: relative;
  z-index: 1;
  max-width: 600px;
  color: ${(p) => p.theme.mute};
  font-size: 14px;
  line-height: 1.6;
`;

const Section = styled.section`
  margin: 35px 0;
  padding: 0 4vw;
`;

const Heading = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 16px;
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-family: ${(p) => p.theme.display};
  font-size: 24px;

  @media (max-width: 600px) {
    font-size: 21px;
  }
`;

const LiveBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: ${(p) => p.theme.live};
  font-size: 11px;
  font-weight: 900;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: 1250px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

export default function Home({
  matches,
  liveMatches,
  sports,
  loading,
  liveLoading,
  error,
  liveError,
  query
}) {
  if (loading) {
    return (
      <Message>
        Loading Matchday...
      </Message>
    );
  }

  if (error) {
    return (
      <Message>
        Could not load matches. Check that the server is running.
      </Message>
    );
  }

  const q = query.trim().toLowerCase();

  const matchesFiltered = matches.filter((match) => {
    if (!q) return true;

    return [
      match.title,
      match.home,
      match.away,
      match.league,
      match.sportName,
      match.sport
    ]
      .filter(Boolean)
      .some((value) =>
        String(value)
          .toLowerCase()
          .includes(q)
      );
  });

  const liveFiltered = liveMatches.filter((match) => {
    if (!q) return true;

    return [
      match.title,
      match.home,
      match.away,
      match.league,
      match.sportName,
      match.sport
    ]
      .filter(Boolean)
      .some((value) =>
        String(value)
          .toLowerCase()
          .includes(q)
      );
  });

  const sportSections = sports
    .map((sport) => {
      const sportMatches = matchesFiltered
        .filter(
          (match) => match.sport === sport.id
        )
        .sort((a, b) => {
          if (
            a.status === 'LIVE' &&
            b.status !== 'LIVE'
          ) {
            return -1;
          }

          if (
            b.status === 'LIVE' &&
            a.status !== 'LIVE'
          ) {
            return 1;
          }

          return (
            (a.kickoff || 0) -
            (b.kickoff || 0)
          );
        });

      return {
        ...sport,
        icon: getSportIcon(sport.id),
        matches: sportMatches
      };
    })
    .filter(
      (sport) => sport.matches.length
    );

  const popularLive = liveFiltered
    .filter((match) => match.popular)
    .slice(0, 4);

  const liveFallback = liveFiltered
    .filter(
      (match) =>
        !popularLive.some(
          (popular) =>
            popular.id === match.id
        )
    )
    .slice(0, 4);

  const liveToShow = popularLive.length
    ? popularLive
    : liveFallback;

  return (
    <>
      <Hero>
        <HeroTitle>
          All Sports.
        </HeroTitle>

        <HeroText>
          Your sports hub for matches, live events
          and streams. Follow what matters and
          jump straight into the action.
        </HeroText>
      </Hero>

      {!liveLoading &&
        !liveError &&
        liveToShow.length > 0 && (
          <Section>
            <Heading>
              <SectionTitle>
                Popular Live
              </SectionTitle>

              <LiveBadge>
                ● LIVE NOW
              </LiveBadge>
            </Heading>

            <Grid>
              {liveToShow.map((match) => (
                <EventCard
                  key={match.id}
                  match={match}
                />
              ))}
            </Grid>
          </Section>
        )}

      {sportSections.map((sport) => (
        <SportSection
          key={sport.id}
          sport={sport}
          matches={sport.matches}
          limit={4}
        />
      ))}

      {!sportSections.length && (
        <Message>
          No events found.
        </Message>
      )}
    </>
  );
}

function getSportIcon(id) {
  const icons = {
    football: '⚽',
    basketball: '🏀',
    'american-football': '🏈',
    hockey: '🏒',
    baseball: '⚾',
    'motor-sports': '🏎️',
    fight: '🥊',
    tennis: '🎾',
    rugby: '🏉',
    golf: '⛳',
    billiards: '🎱',
    afl: '🏉',
    darts: '🎯',
    cricket: '🏏',
    other: '🏆'
  };

  return icons[id] || '🏆';
}