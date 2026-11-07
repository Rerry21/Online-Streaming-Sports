import styled from 'styled-components';
import EventRow from '../components/EventRow';

const Page = styled.main`
  padding-top: 8px;
`;

const Hero = styled.section`
  margin: 24px 4vw 30px;
  padding: 30px 32px;
  border: 1px solid ${(p) => p.theme.line};
  border-radius: 18px;
  background:
    radial-gradient(
      circle at 85% 25%,
      rgba(255,77,109,.18),
      transparent 35%
    ),
    linear-gradient(
      135deg,
      #191020,
      #0e0b16
    );
`;

const Eyebrow = styled.div`
  margin-bottom: 9px;
  color: ${(p) => p.theme.live};
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 1px;
`;

const Title = styled.h1`
  margin: 0 0 8px;
  font-family: ${(p) => p.theme.display};
  font-size: clamp(32px, 5vw, 52px);
`;

const Text = styled.p`
  max-width: 650px;
  margin: 0;
  color: ${(p) => p.theme.mute};
  font-size: 13px;
  line-height: 1.6;
`;

const Message = styled.div`
  padding: 45px 4vw;
  color: ${(p) => p.theme.mute};
  text-align: center;
`;

const Groups = styled.div`
  padding-bottom: 30px;
`;

export default function Live({
  matches = [],
  loading,
  error
}) {
  if (loading) {
    return (
      <Message>
        Loading live events...
      </Message>
    );
  }

  if (error) {
    return (
      <Message>
        {error.message || 'Could not load live events.'}
      </Message>
    );
  }

  const groups = matches.reduce((result, match) => {
    const key = match.sport || 'other';

    if (!result[key]) {
      result[key] = [];
    }

    result[key].push(match);

    return result;
  }, {});

  const entries = Object.entries(groups);

  return (
    <Page>
      <Hero>
        <Eyebrow>● LIVE NOW</Eyebrow>

        <Title>
          Live Events
        </Title>

        <Text>
          Jump straight into the action across every
          sport currently available on Matchday.
        </Text>
      </Hero>

      {!entries.length ? (
        <Message>
          There are no live events right now.
        </Message>
      ) : (
        <Groups>
          {entries.map(([sport, sportMatches]) => (
            <EventRow
              key={sport}
              title={
                sportMatches[0]?.sportName ||
                sport
              }
              matches={sportMatches}
            />
          ))}
        </Groups>
      )}
    </Page>
  );
}