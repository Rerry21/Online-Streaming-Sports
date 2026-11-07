import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { fetchStreams } from '../services/api';
import { kickoffText } from '../components/StatusTag';

const Page = styled.main`
  padding: 28px 4vw 50px;
`;

const Header = styled.div`
  margin-bottom: 22px;
`;

const Title = styled.h1`
  margin: 0 0 8px;
  font-family: ${(p) => p.theme.display};
  font-size: clamp(30px, 5vw, 52px);
`;

const Subtitle = styled.p`
  margin: 0;
  color: ${(p) => p.theme.mute};
`;

const Search = styled.input`
  width: 100%;
  margin-top: 24px;
  padding: 14px 16px;
  background: ${(p) => p.theme.panel};
  color: ${(p) => p.theme.text};
  border: 1px solid ${(p) => p.theme.line};
  border-radius: 10px;
  outline: none;

  &:focus {
    border-color: ${(p) => p.theme.accent};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-top: 24px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

const Slot = styled.div`
  min-height: 340px;
  background: #050606;
  border: 1px dashed ${(p) => p.theme.line};
  border-radius: ${(p) => p.theme.radius};
  overflow: hidden;
  position: relative;
`;

const Empty = styled.button`
  width: 100%;
  min-height: 340px;
  border: 0;
  background: transparent;
  color: ${(p) => p.theme.mute};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    color: ${(p) => p.theme.text};
  }
`;

const Plus = styled.div`
  font-size: 42px;
  line-height: 1;
  color: ${(p) => p.theme.accent};
`;

const EmptyTitle = styled.strong`
  color: ${(p) => p.theme.text};
  font-size: 16px;
`;

const EmptyText = styled.span`
  font-size: 12px;
`;

const Player = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
`;

const Iframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: 0;
`;

const Overlay = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 40px 12px 12px;
  background: linear-gradient(transparent, rgba(0, 0, 0, .95));
  pointer-events: none;
`;

const EventName = styled.div`
  font-weight: 700;
  font-size: 13px;
`;

const EventMeta = styled.div`
  color: ${(p) => p.theme.mute};
  font-size: 11px;
  margin-top: 3px;
`;

const Controls = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 6px;
`;

const Control = styled.button`
  border: 1px solid rgba(255,255,255,.15);
  background: rgba(0,0,0,.8);
  color: ${(p) => p.theme.text};
  border-radius: 7px;
  padding: 6px 9px;
  cursor: pointer;
  font-size: 12px;

  &:hover {
    border-color: ${(p) => p.theme.accent};
    color: ${(p) => p.theme.accent};
  }
`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(0, 0, 0, .78);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Modal = styled.div`
  width: min(520px, 100%);
  max-height: min(720px, 90vh);
  background: #0a0b0b;
  border: 1px solid ${(p) => p.theme.line};
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 20px 80px rgba(0,0,0,.7);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px 12px;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 17px;
`;

const Close = styled.button`
  border: 0;
  background: transparent;
  color: ${(p) => p.theme.mute};
  font-size: 22px;
  cursor: pointer;
  padding: 0 3px;

  &:hover {
    color: ${(p) => p.theme.text};
  }
`;

const ModalBody = styled.div`
  padding: 0 20px 20px;
`;

const PickerSearch = styled.input`
  width: 100%;
  padding: 12px 14px;
  background: #080909;
  color: ${(p) => p.theme.text};
  border: 1px solid ${(p) => p.theme.line};
  border-radius: 8px;
  outline: none;

  &:focus {
    border-color: ${(p) => p.theme.accent};
  }
`;

const SectionTitle = styled.h3`
  margin: 14px 0 10px;
  font-size: 15px;
`;

const Categories = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 7px;

  @media (max-width: 500px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Category = styled.button`
  min-height: 68px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: #171818;
  color: ${(p) => p.theme.text};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 8px 4px;
  font-size: 11px;
  font-weight: 700;

  &:hover {
    background: #1d1f1f;
    border-color: ${(p) => p.theme.accent};
  }
`;

const CategoryIcon = styled.div`
  font-size: 21px;
`;

const Events = styled.div`
  max-height: 470px;
  overflow-y: auto;
  display: grid;
  gap: 7px;
  padding-right: 3px;
`;

const EventButton = styled.button`
  width: 100%;
  padding: 12px;
  background: #090a0a;
  color: ${(p) => p.theme.text};
  border: 1px solid ${(p) => p.theme.line};
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  text-align: left;

  &:hover {
    border-color: ${(p) => p.theme.accent};
    background: #101212;
  }
`;

const EventInfo = styled.div`
  min-width: 0;

  strong {
    display: block;
    font-size: 13px;
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  span {
    display: block;
    color: ${(p) => p.theme.mute};
    font-size: 11px;
  }
`;

const Arrow = styled.span`
  color: ${(p) => p.theme.mute};
  font-size: 17px;
`;

const BackButton = styled.button`
  border: 0;
  background: transparent;
  color: ${(p) => p.theme.mute};
  padding: 0;
  margin-bottom: 10px;
  cursor: pointer;

  &:hover {
    color: ${(p) => p.theme.text};
  }
`;

const ErrorText = styled.div`
  color: #ff7777;
  padding: 12px 0 0;
  font-size: 12px;
`;

const Loading = styled.div`
  padding: 25px;
  text-align: center;
  color: ${(p) => p.theme.mute};
`;

const EmptyResults = styled.div`
  padding: 30px 10px;
  text-align: center;
  color: ${(p) => p.theme.mute};
  font-size: 13px;
`;

const icons = {
  basketball: '🏀',
  football: '⚽',
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
  other: '🎮'
};

function eventName(match) {
  if (match.home && match.away) {
    return `${match.home} vs ${match.away}`;
  }

  return match.title || 'Untitled event';
}

function eventTime(match) {
  return kickoffText(match.kickoff);
}

export default function MultiStream({ matches }) {
  const [slots, setSlots] = useState([null, null, null, null]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedSport, setSelectedSport] = useState(null);
  const [query, setQuery] = useState('');
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState(null);

  const sports = useMemo(() => {
    const map = new Map();

    matches.forEach((match) => {
      if (!match.sport) return;

      if (!map.has(match.sport)) {
        map.set(match.sport, {
          id: match.sport,
          name: match.sportName || match.sport
        });
      }
    });

    return Array.from(map.values());
  }, [matches]);

  const filteredMatches = useMemo(() => {
    const q = query.trim().toLowerCase();

    return matches
      .filter((match) => {
        if (selectedSport && match.sport !== selectedSport) {
          return false;
        }

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
            String(value).toLowerCase().includes(q)
          );
      })
      .slice(0, 50);
  }, [matches, selectedSport, query]);

  const popular = useMemo(() => {
    const live = matches.filter((match) => match.status === 'LIVE');

    if (live.length) {
      return live.slice(0, 5);
    }

    return matches
      .filter((match) => match.popular)
      .slice(0, 5);
  }, [matches]);

  function openPicker() {
    setPickerOpen(true);
    setSelectedSport(null);
    setQuery('');
    setError(null);
  }

  function closePicker() {
    setPickerOpen(false);
    setSelectedSport(null);
    setQuery('');
    setError(null);
  }

  function chooseSport(sport) {
    setSelectedSport(sport);
    setQuery('');
    setError(null);
  }

  async function addMatch(match) {
    if (slots.some((slot) => slot?.match?.id === match.id)) {
      setError('That event is already in Multi Stream.');
      return;
    }

    const index = slots.findIndex((slot) => slot === null);

    if (index === -1) {
      setError('All 4 stream slots are already in use.');
      return;
    }

    setLoadingId(match.id);
    setError(null);

    try {
      const data = await fetchStreams(match.id);
      const streams = data.streams || [];

      if (!streams.length) {
        throw new Error('No playable stream available for this event.');
      }

      setSlots((current) => {
        const next = [...current];

        next[index] = {
          match,
          streams,
          active: 0
        };

        return next;
      });

      closePicker();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingId(null);
    }
  }

  function removeSlot(index) {
    setSlots((current) => {
      const next = [...current];
      next[index] = null;
      return next;
    });
  }

  function nextStream(index) {
    setSlots((current) => {
      const next = [...current];
      const slot = next[index];

      if (!slot || slot.streams.length < 2) {
        return current;
      }

      next[index] = {
        ...slot,
        active: (slot.active + 1) % slot.streams.length
      };

      return next;
    });
  }

  return (
    <Page>
      <Header>
        <Title>Multi Stream</Title>
        <Subtitle>
          Watch up to 4 events at the same time.
        </Subtitle>
      </Header>

      <Grid>
        {slots.map((slot, index) => {
          if (!slot) {
            return (
              <Slot key={index}>
                <Empty onClick={openPicker}>
                  <Plus>+</Plus>
                  <EmptyTitle>Click to add stream</EmptyTitle>
                  <EmptyText>
                    You can add up to 4 streams to watch at the same time.
                  </EmptyText>
                </Empty>
              </Slot>
            );
          }

          const stream = slot.streams[slot.active];

          return (
            <Slot key={index}>
              <Player>
                {stream?.embedUrl && (
                  <Iframe
                    src={stream.embedUrl}
                    title={eventName(slot.match)}
                    allowFullScreen
                    allow="autoplay; fullscreen"
                  />
                )}
              </Player>

              <Controls>
                {slot.streams.length > 1 && (
                  <Control onClick={() => nextStream(index)}>
                    Stream {slot.active + 1}/{slot.streams.length}
                  </Control>
                )}

                <Control onClick={() => removeSlot(index)}>
                  Remove
                </Control>
              </Controls>

              <Overlay>
                <EventName>{eventName(slot.match)}</EventName>
                <EventMeta>
                  {slot.match.sportName || slot.match.sport}
                </EventMeta>
              </Overlay>
            </Slot>
          );
        })}
      </Grid>

      {pickerOpen && (
        <Backdrop onMouseDown={(e) => {
          if (e.target === e.currentTarget) {
            closePicker();
          }
        }}>
          <Modal>
            <ModalHeader>
              <ModalTitle>Add Stream</ModalTitle>

              <Close onClick={closePicker}>
                ×
              </Close>
            </ModalHeader>

            <ModalBody>
              <PickerSearch
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for a match..."
              />

              {!selectedSport && !query.trim() && (
                <>
                  <SectionTitle>Categories</SectionTitle>

                  <Categories>
                    {sports.map((sport) => (
                      <Category
                        key={sport.id}
                        onClick={() => chooseSport(sport.id)}
                      >
                        <CategoryIcon>
                          {icons[sport.id] || '🏆'}
                        </CategoryIcon>

                        <span>{sport.name}</span>
                      </Category>
                    ))}
                  </Categories>

                  {popular.length > 0 && (
                    <>
                      <SectionTitle>
                        ⭐ Popular Live
                      </SectionTitle>

                      <Events>
                        {popular.map((match) => (
                          <EventButton
                            key={match.id}
                            onClick={() => addMatch(match)}
                            disabled={loadingId === match.id}
                          >
                            <EventInfo>
                              <strong>
                                {eventName(match)}
                              </strong>

                              <span>
                                {eventTime(match)}
                              </span>
                            </EventInfo>

                            <Arrow>
                              {loadingId === match.id ? '...' : '⌄'}
                            </Arrow>
                          </EventButton>
                        ))}
                      </Events>
                    </>
                  )}
                </>
              )}

              {(selectedSport || query.trim()) && (
                <>
                  {selectedSport && (
                    <BackButton
                      onClick={() => {
                        setSelectedSport(null);
                        setQuery('');
                      }}
                    >
                      ← Back to categories
                    </BackButton>
                  )}

                  <SectionTitle>
                    {query.trim()
                      ? 'Search Results'
                      : `${sports.find((sport) => sport.id === selectedSport)?.name || 'Events'}`}
                  </SectionTitle>

                  <Events>
                    {filteredMatches.map((match) => (
                      <EventButton
                        key={match.id}
                        onClick={() => addMatch(match)}
                        disabled={loadingId === match.id}
                      >
                        <EventInfo>
                          <strong>
                            {eventName(match)}
                          </strong>

                          <span>
                            {eventTime(match)}
                          </span>
                        </EventInfo>

                        <Arrow>
                          {loadingId === match.id ? '...' : '⌄'}
                        </Arrow>
                      </EventButton>
                    ))}

                    {!filteredMatches.length && (
                      <EmptyResults>
                        No events found.
                      </EmptyResults>
                    )}
                  </Events>
                </>
              )}

              {error && (
                <ErrorText>
                  {error}
                </ErrorText>
              )}
            </ModalBody>
          </Modal>
        </Backdrop>
      )}
    </Page>
  );
}