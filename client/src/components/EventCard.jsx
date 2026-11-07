import { memo } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Crest from './Crest';

const Card = styled(Link)`
  display: block;
  min-width: 0;
  overflow: hidden;
  position: relative;
  border: 1px solid
    ${(p) =>
      p.match.status === 'LIVE'
        ? 'rgba(255,77,109,.45)'
        : p.theme.line};
  border-radius: 14px;
  background: ${(p) => p.theme.panel};
  color: ${(p) => p.theme.text};
  text-decoration: none;
  transition: transform .2s ease, border-color .2s ease, box-shadow .2s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: ${(p) =>
      p.match.status === 'LIVE'
        ? p.theme.live
        : p.theme.accentLight};

    box-shadow:
      0 10px 35px rgba(0,0,0,.3),
      0 0 22px
        ${(p) =>
          p.match.status === 'LIVE'
            ? 'rgba(255,77,109,.18)'
            : 'rgba(139,61,255,.2)'};
  }
`;

const Visual = styled.div`
  height: 148px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background:
    radial-gradient(
      circle at 50% 50%,
      rgba(139,61,255,.45),
      transparent 55%
    ),
    linear-gradient(
      135deg,
      #261448,
      #3a2178 48%,
      #15101f
    );

  @media (max-width: 600px) {
    height: 135px;
  }
`;

const Glow = styled.div`
  position: absolute;
  width: 190px;
  height: 190px;
  border-radius: 50%;
  background: ${(p) => p.theme.accent};
  opacity: .11;
  filter: blur(45px);
`;

const Badge = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 2;
  padding: 5px 8px;
  border-radius: 6px;
  background: rgba(7,5,12,.72);
  border: 1px solid rgba(255,255,255,.1);
  color: rgba(255,255,255,.8);
  font-size: 10px;
  font-weight: 800;
`;

const Live = styled(Badge)`
  left: auto;
  right: 10px;
  color: #ff7188;
  border-color: rgba(255,77,109,.35);
  background: rgba(255,77,109,.13);
`;

const TeamsVisual = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 27px;
`;

const TeamVisual = styled.div`
  width: 66px;
  height: 66px;
  display: grid;
  place-items: center;

  > div {
    width: 66px;
    height: 66px;
    border-radius: 14px;
    background: rgba(255,255,255,.08);
  }

  @media (max-width: 600px) {
    width: 58px;
    height: 58px;

    > div {
      width: 58px;
      height: 58px;
    }
  }
`;

const Vs = styled.span`
  color: rgba(255,255,255,.58);
  font-size: 11px;
  font-weight: 900;
`;

const Body = styled.div`
  padding: 14px 15px 15px;
`;

const TeamList = styled.div`
  display: grid;
  gap: 6px;
`;

const Team = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;

  b {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 13px;
    font-weight: 700;
  }
`;

const Score = styled.strong`
  color: ${(p) =>
    p.live
      ? p.theme.accentLight
      : p.theme.text};
  font-size: 15px;
`;

const Title = styled.div`
  min-height: 42px;
  font-size: 14px;
  font-weight: 800;
  line-height: 1.45;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid ${(p) => p.theme.line};
`;

const League = styled.span`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${(p) => p.theme.mute};
  font-size: 10px;
`;

const Time = styled.span`
  flex-shrink: 0;
  color: ${(p) => p.theme.mute};
  font-size: 10px;
  font-weight: 700;
`;

function formatTime(match) {
  if (match.status === 'LIVE') return 'LIVE NOW';
  if (match.status === 'FINISHED') return 'FINISHED';

  if (!match.kickoff) return 'TBA';

  const date = new Date(match.kickoff);

  if (Number.isNaN(date.getTime())) {
    return 'TBA';
  }

  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function EventCard({ match }) {
  const hasTeams = Boolean(match.home && match.away);

  return (
    <Card
      to={`/match/${match.id}`}
      match={match}
    >
      <Visual>
        <Glow />

        <Badge>
          {match.sportName || match.sport || 'SPORT'}
        </Badge>

        {match.status === 'LIVE' && (
          <Live>● LIVE</Live>
        )}

        {hasTeams ? (
          <TeamsVisual>
            <TeamVisual>
              <Crest
                name={match.home}
                badge={match.homeBadge}
                size={66}
              />
            </TeamVisual>

            <Vs>VS</Vs>

            <TeamVisual>
              <Crest
                name={match.away}
                badge={match.awayBadge}
                size={66}
              />
            </TeamVisual>
          </TeamsVisual>
        ) : (
          <Title>{match.title}</Title>
        )}
      </Visual>

      <Body>
        {hasTeams ? (
          <TeamList>
            <Team>
              <b>{match.home}</b>

              {match.hs !== null &&
                match.hs !== undefined && (
                  <Score live={match.status === 'LIVE'}>
                    {match.hs}
                  </Score>
                )}
            </Team>

            <Team>
              <b>{match.away}</b>

              {match.as !== null &&
                match.as !== undefined && (
                  <Score live={match.status === 'LIVE'}>
                    {match.as}
                  </Score>
                )}
            </Team>
          </TeamList>
        ) : (
          <Title>{match.title}</Title>
        )}

        <Footer>
          <League>
            {match.league || match.sportName || 'Event'}
          </League>

          <Time>{formatTime(match)}</Time>
        </Footer>
      </Body>
    </Card>
  );
}

export default memo(EventCard);