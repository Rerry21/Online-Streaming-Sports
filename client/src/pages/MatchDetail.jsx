import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Link, useParams } from 'react-router-dom';
import Crest from '../components/Crest';

const Page = styled.main`
  padding: 25px 4vw 55px;
`;

const Back = styled(Link)`
  display: inline-flex;
  margin-bottom: 18px;
  color: ${(p) => p.theme.mute};
  text-decoration: none;
  font-size: 12px;
  font-weight: 700;

  &:hover {
    color: ${(p) => p.theme.text};
  }
`;

const Hero = styled.section`
  overflow: hidden;
  border: 1px solid ${(p) => p.theme.line};
  border-radius: 18px;
  background:
    radial-gradient(
      circle at 50% 35%,
      rgba(139,61,255,.32),
      transparent 45%
    ),
    linear-gradient(
      135deg,
      #201136,
      #100c17
    );
`;

const Top = styled.div`
  padding: 12px 15px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255,255,255,.08);
`;

const Sport = styled.span`
  color: ${(p) => p.theme.accentLight};
  font-size: 11px;
  font-weight: 800;
`;

const Status = styled.span`
  color: ${(p) =>
    p.live
      ? p.theme.live
      : p.theme.mute};
  font-size: 11px;
  font-weight: 900;
`;

const Main = styled.div`
  padding: 38px 25px 32px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 25px;

  @media (max-width: 650px) {
    grid-template-columns: 1fr;
    gap: 18px;
  }
`;

const Team = styled.div`
  display: grid;
  justify-items: center;
  gap: 11px;
  text-align: center;
`;

const TeamName = styled.strong`
  max-width: 240px;
  font-size: 17px;
`;

const Score = styled.div`
  font-family: ${(p) => p.theme.display};
  font-size: 38px;
`;

const Vs = styled.div`
  color: ${(p) => p.theme.mute};
  font-size: 12px;
  font-weight: 900;

  @media (max-width: 650px) {
    order: 2;
  }
`;

const Meta = styled.div`
  padding: 0 25px 24px;
  display: flex;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
  color: ${(p) => p.theme.mute};
  font-size: 11px;
`;

const FollowRow = styled.div`
  padding: 15px 20px;
  border-top: 1px solid rgba(255,255,255,.08);
  display: flex;
  justify-content: center;
`;

const Follow = styled.button`
  border: 1px solid
    ${(p) =>
      p.active
        ? p.theme.accent
        : p.theme.line};
  border-radius: 9px;
  padding: 9px 15px;
  background:
    ${(p) =>
      p.active
        ? p.theme.accentSoft
        : p.theme.panel};
  color: ${(p) => p.theme.text};
  cursor: pointer;
  font-size: 12px;
  font-weight: 800;
`;

const StreamSection = styled.section`
  margin-top: 25px;
  padding: 22px;
  border: 1px solid ${(p) => p.theme.line};
  border-radius: 15px;
  background: ${(p) => p.theme.panel};
`;

const StreamTitle = styled.h2`
  margin: 0 0 14px;
  font-family: ${(p) => p.theme.display};
  font-size: 20px;
`;

const Player = styled.div`
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 11px;
  background: #050408;
  border: 1px solid ${(p) => p.theme.line};

  iframe {
    width: 100%;
    height: 100%;
    border: 0;
  }
`;

const StreamList = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
`;

const StreamButton = styled.button`
  padding: 8px 11px;
  border: 1px solid ${(p) => p.theme.line};
  border-radius: 8px;
  background: ${(p) =>
    p.active
      ? p.theme.accentSoft
      : p.theme.panelAlt};
  color: ${(p) => p.theme.text};
  cursor: pointer;
  font-size: 11px;
  font-weight: 700;
`;

const Message = styled.div`
  padding: 45px;
  border: 1px solid ${(p) => p.theme.line};
  border-radius: 14px;
  background: ${(p) => p.theme.panel};
  color: ${(p) => p.theme.mute};
  text-align: center;
`;

export default function MatchDetail({
  matches = [],
  favs = new Set(),
  toggle
}) {
  const { id } = useParams();

  const match = useMemo(
    () =>
      matches.find(
        (item) => String(item.id) === String(id)
      ),
    [matches, id]
  );

  const [streams, setStreams] = useState([]);
  const [streamIndex, setStreamIndex] = useState(0);
  const [streamLoading, setStreamLoading] = useState(false);
  const [streamError, setStreamError] = useState(null);

  useEffect(() => {
    setStreams([]);
    setStreamIndex(0);
    setStreamError(null);
  }, [id]);

  useEffect(() => {
    if (!match) return;

    let active = true;

    setStreamLoading(true);
    setStreamError(null);

    fetch(
      `/api/matches/${encodeURIComponent(match.id)}/stream`
    )
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error ||
            'No stream is currently available.'
          );
        }

        return data;
      })
      .then((data) => {
        if (!active) return;

        const playable = Array.isArray(data?.streams)
          ? data.streams.filter(
              (stream) =>
                typeof stream?.embedUrl === 'string' &&
                stream.embedUrl.trim()
            )
          : [];

        setStreams(playable);

        if (!playable.length) {
          setStreamError(
            'No playable stream is currently available.'
          );
        }
      })
      .catch((error) => {
        if (!active) return;

        setStreamError(
          error.message ||
          'Could not load the stream.'
        );
      })
      .finally(() => {
        if (active) {
          setStreamLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [match]);

  if (!match) {
    return (
      <Page>
        <Back to="/">← Back</Back>

        <Message>
          This event could not be found.
        </Message>
      </Page>
    );
  }

  const favourite =
    Boolean(match.home && favs.has(match.home)) ||
    Boolean(match.away && favs.has(match.away));

  const selectedStream = streams[streamIndex];

  return (
    <Page>
      <Back to="/">← Back to all events</Back>

      <Hero>
        <Top>
          <Sport>
            {match.sportName || match.sport}
          </Sport>

          <Status live={match.status === 'LIVE'}>
            {match.status === 'LIVE'
              ? '● LIVE NOW'
              : match.status}
          </Status>
        </Top>

        <Main>
          <Team>
            <Crest
              name={match.home}
              badge={match.homeBadge}
              size={82}
            />

            <TeamName>
              {match.home || match.title}
            </TeamName>

            {match.hs !== null &&
              match.hs !== undefined && (
                <Score>{match.hs}</Score>
              )}
          </Team>

          <Vs>
            VS
          </Vs>

          <Team>
            <Crest
              name={match.away}
              badge={match.awayBadge}
              size={82}
            />

            <TeamName>
              {match.away || 'Event'}
            </TeamName>

            {match.as !== null &&
              match.as !== undefined && (
                <Score>{match.as}</Score>
              )}
          </Team>
        </Main>

        <Meta>
          <span>
            {match.league || match.sportName}
          </span>

          {match.kickoff && (
            <span>
              {new Date(match.kickoff).toLocaleString()}
            </span>
          )}
        </Meta>

        <FollowRow>
          <Follow
            active={favourite}
            onClick={() => {
              if (match.home) toggle(match.home);
            }}
          >
            {favourite
              ? '★ Following'
              : '☆ Follow'}
          </Follow>
        </FollowRow>
      </Hero>

      <StreamSection>
        <StreamTitle>
          Watch
        </StreamTitle>

        {streamLoading ? (
          <Message>
            Finding available streams...
          </Message>
        ) : streamError ? (
          <Message>
            {streamError}
          </Message>
        ) : selectedStream ? (
          <>
            <Player>
              <iframe
                src={selectedStream.embedUrl}
                title={match.title}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </Player>

            {streams.length > 1 && (
              <StreamList>
                {streams.map((stream, index) => (
                  <StreamButton
                    key={`${stream.embedUrl}-${index}`}
                    active={index === streamIndex}
                    onClick={() =>
                      setStreamIndex(index)
                    }
                  >
                    Stream {index + 1}
                    {stream.language
                      ? ` • ${stream.language}`
                      : ''}
                  </StreamButton>
                ))}
              </StreamList>
            )}
          </>
        ) : (
          <Message>
            No playable stream is currently available.
          </Message>
        )}
      </StreamSection>
    </Page>
  );
}