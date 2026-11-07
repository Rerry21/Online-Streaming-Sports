import styled from 'styled-components';
import EventCard from './EventCard';

const Section = styled.section`
  margin: 30px 0;
  padding: 0 4vw;
`;

const Title = styled.h2`
  margin: 0 0 16px;
  font-family: ${(p) => p.theme.display};
  font-size: 24px;

  @media (max-width: 600px) {
    font-size: 21px;
  }
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

export default function EventRow({
  title,
  matches
}) {
  if (!matches || !matches.length) {
    return null;
  }

  return (
    <Section>
      <Title>{title}</Title>

      <Grid>
        {matches.map((match) => (
          <EventCard
            key={match.id}
            match={match}
          />
        ))}
      </Grid>
    </Section>
  );
}