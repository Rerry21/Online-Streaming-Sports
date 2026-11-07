import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import EventRow from '../components/EventRow';

const Page = styled.main`
  padding-bottom: 35px;
`;

const Hero = styled.section`
  margin: 24px 4vw 30px;
  padding: 30px 32px;
  border: 1px solid ${(p) => p.theme.line};
  border-radius: 18px;
  background:
    radial-gradient(
      circle at 85% 20%,
      rgba(139,61,255,.23),
      transparent 35%
    ),
    ${(p) => p.theme.panel};
`;

const Icon = styled.div`
  width: 45px;
  height: 45px;
  display: grid;
  place-items: center;
  margin-bottom: 13px;
  border-radius: 11px;
  background: ${(p) => p.theme.accentSoft};
  font-size: 22px;
`;

const Title = styled.h1`
  margin: 0 0 7px;
  font-family: ${(p) => p.theme.display};
  font-size: clamp(32px, 5vw, 52px);
`;

const Text = styled.p`
  margin: 0;
  color: ${(p) => p.theme.mute};
  font-size: 13px;
`;

const Stats = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 20px;
  flex-wrap: wrap;
`;

const Stat = styled.div`
  min-width: 90px;
  padding: 10px 12px;
  border: 1px solid ${(p) => p.theme.line};
  border-radius: 9px;
  background: rgba(255,255,255,.025);

  strong {
    display: block;
    font-size: 17px;
  }

  span {
    color: ${(p) => p.theme.mute};
    font-size: 10px;
  }
`;

const Message = styled.div`
  padding: 45px 4vw;
  color: ${(p) => p.theme.mute};
  text-align: center;
`;

function icon(id) {
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

export default function Sport({
  matches = [],
  sports = [],
  loading,
  error,
  query = ''
}) {
  const { sport: sportId } = useParams();

  const sport = sports.find(
    (item) => item.id === sportId
  );

  if (loading) {
    return (
      <Message>
        Loading sport...
      </Message>
    );
  }

  if (error) {
    return (
      <Message>
        {error.message ||
          'Could not load this sport.'}
      </Message>
    );
  }

  if (!sport) {
    return (
      <Message>
        Sport not found.
      </Message>
    );
  }

  const q = query.trim().toLowerCase();

  const filtered = matches
    .filter(
      (match) => match.sport === sportId
    )
    .filter((match) => {
      if (!q) return true;

      return [
        match.title,
        match.home,
        match.away,
        match.league
      ]
        .filter(Boolean)
        .some((value) =>
          String(value)
            .toLowerCase()
            .includes(q)
        );
    });

  const live = filtered.filter(
    (match) => match.status === 'LIVE'
  );

  const upcoming = filtered.filter(
    (match) =>
      match.status === 'SCHEDULED'
  );

  const finished = filtered.filter(
    (match) =>
      match.status === 'FINISHED'
  );

  const other = filtered.filter(
    (match) =>
      !['LIVE', 'SCHEDULED', 'FINISHED'].includes(
        match.status
      )
  );

  return (
    <Page>
      <Hero>
        <Icon>
          {icon(sport.id)}
        </Icon>

        <Title>
          {sport.name}
        </Title>

        <Text>
          Explore {sport.name.toLowerCase()} events,
          live action and upcoming matches.
        </Text>

        <Stats>
          <Stat>
            <strong>{filtered.length}</strong>
            <span>Total events</span>
          </Stat>

          <Stat>
            <strong>{live.length}</strong>
            <span>Live now</span>
          </Stat>

          <Stat>
            <strong>{upcoming.length}</strong>
            <span>Upcoming</span>
          </Stat>

          <Stat>
            <strong>{finished.length}</strong>
            <span>Results</span>
          </Stat>
        </Stats>
      </Hero>

      {live.length > 0 && (
        <EventRow
          title="Live Now"
          matches={live}
        />
      )}

      {upcoming.length > 0 && (
        <EventRow
          title="Upcoming"
          matches={upcoming}
        />
      )}

      {finished.length > 0 && (
        <EventRow
          title="Results"
          matches={finished}
        />
      )}

      {other.length > 0 && (
        <EventRow
          title="Other Events"
          matches={other}
        />
      )}

      {!filtered.length && (
        <Message>
          No {sport.name.toLowerCase()} events found.
        </Message>
      )}
    </Page>
  );
}