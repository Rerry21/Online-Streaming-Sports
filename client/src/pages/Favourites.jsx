import styled from 'styled-components';
import EventCard from '../components/EventCard';

const Page = styled.main`
  padding-bottom: 40px;
`;

const Hero = styled.section`
  margin: 24px 4vw 30px;
  padding: 30px 32px;
  border: 1px solid ${(p) => p.theme.line};
  border-radius: 18px;
  background:
    radial-gradient(
      circle at 85% 20%,
      rgba(139,61,255,.2),
      transparent 35%
    ),
    ${(p) => p.theme.panel};
`;

const Eyebrow = styled.div`
  margin-bottom: 8px;
  color: ${(p) => p.theme.accentLight};
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
  margin: 0;
  color: ${(p) => p.theme.mute};
  font-size: 13px;
`;

const Section = styled.section`
  padding: 0 4vw;
`;

const Heading = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const Count = styled.span`
  color: ${(p) => p.theme.mute};
  font-size: 12px;
  font-weight: 700;
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

const Empty = styled.div`
  padding: 55px 25px;
  border: 1px dashed ${(p) => p.theme.line};
  border-radius: 14px;
  background: ${(p) => p.theme.panel};
  color: ${(p) => p.theme.mute};
  text-align: center;

  strong {
    display: block;
    margin-bottom: 7px;
    color: ${(p) => p.theme.text};
    font-size: 15px;
  }

  span {
    font-size: 12px;
  }
`;

export default function Favourites({
  matches = [],
  favs = new Set(),
  isFavMatch
}) {
  const favouriteMatches = matches.filter((match) =>
    isFavMatch(match)
  );

  return (
    <Page>
      <Hero>
        <Eyebrow>★ YOUR PICKS</Eyebrow>

        <Title>
          Favourites
        </Title>

        <Text>
          Keep track of the teams and events you care
          about most.
        </Text>
      </Hero>

      <Section>
        <Heading>
          <strong>
            Followed Events
          </strong>

          <Count>
            {favs.size} followed
          </Count>
        </Heading>

        {!favouriteMatches.length ? (
          <Empty>
            <strong>
              Nothing here yet
            </strong>

            <span>
              Follow a team from a match page and it
              will appear here.
            </span>
          </Empty>
        ) : (
          <Grid>
            {favouriteMatches.map((match) => (
              <EventCard
                key={match.id}
                match={match}
              />
            ))}
          </Grid>
        )}
      </Section>
    </Page>
  );
}