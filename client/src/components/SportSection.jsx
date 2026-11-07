import styled from 'styled-components';
import { Link } from 'react-router-dom';
import EventCard from './EventCard';

const Section = styled.section`
  margin: 38px 0;
  padding: 0 4vw;
`;

const Heading = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 16px;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

const Icon = styled.span`
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 9px;
  background: ${(p) => p.theme.accentSoft};
  border: 1px solid rgba(139,61,255,.25);
  font-size: 16px;
`;

const Title = styled.h2`
  margin: 0;
  font-family: ${(p) => p.theme.display};
  font-size: 23px;
  white-space: nowrap;
`;

const Count = styled.span`
  color: ${(p) => p.theme.mute};
  font-size: 11px;
  font-weight: 700;
`;

const ViewAll = styled(Link)`
  flex-shrink: 0;
  color: ${(p) => p.theme.accentLight};
  text-decoration: none;
  font-size: 12px;
  font-weight: 800;

  &:hover {
    text-decoration: underline;
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

export default function SportSection({
  sport,
  matches,
  limit = 4,
  title
}) {
  if (!matches?.length) {
    return null;
  }

  const visible = matches.slice(0, limit);

  return (
    <Section>
      <Heading>
        <Left>
          <Icon>{sport.icon}</Icon>

          <Title>
            {title || sport.name}
          </Title>

          <Count>
            {matches.length}
          </Count>
        </Left>

        {matches.length > limit && (
          <ViewAll to={`/sport/${sport.id}`}>
            View all →
          </ViewAll>
        )}
      </Heading>

      <Grid>
        {visible.map((match) => (
          <EventCard
            key={match.id}
            match={match}
          />
        ))}
      </Grid>
    </Section>
  );
}