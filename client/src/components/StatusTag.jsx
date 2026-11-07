import styled from 'styled-components';

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 8px;
  border-radius: 99px;
  font-size: 11px;
  font-weight: 700;

  background:
    ${(p) =>
      p.live
        ? 'rgba(255,77,109,.14)'
        : p.finished
          ? 'rgba(139,61,255,.12)'
          : p.theme.panelAlt};

  color:
    ${(p) =>
      p.live
        ? '#ff7188'
        : p.finished
          ? p.theme.accentLight
          : p.theme.mute};
`;

export function kickoffText(value) {
  if (!value) return 'TBA';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'TBA';
  }

  return date.toLocaleString([], {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default function StatusTag({ match }) {
  const status = String(
    match?.status || ''
  ).toUpperCase();

  if (status === 'LIVE') {
    return <Tag live>● LIVE</Tag>;
  }

  if (status === 'FINISHED') {
    return <Tag>POSTPONED</Tag>;
  }

  if (status === 'CANCELLED') {
    return <Tag>CANCELLED</Tag>
  }

  return <Tag>{kickoffText(match?.kickoff)}</Tag>;
}