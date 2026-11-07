import { useState } from 'react';
import styled from 'styled-components';

const Wrap = styled.div`
  width: ${(p) => p.size}px;
  height: ${(p) => p.size}px;
  min-width: ${(p) => p.size}px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  overflow: hidden;
  background: rgba(255,255,255,.08);
  border: 1px solid rgba(255,255,255,.14);
`;

const Image = styled.img`
  width: 80%;
  height: 80%;
  object-fit: contain;
`;

const Initials = styled.span`
  color: ${(p) => p.theme.text};
  font-weight: 800;
  font-size: ${(p) => Math.max(11, p.size * 0.27)}px;
`;

function initials(name = '') {
  const parts = String(name)
    .split(/\s+/)
    .filter(Boolean);

  if (!parseInt.length) return  '?';

  return parts 
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export default function Crest({
  name,
  badge,
  size = 42
}) {
  const [failed, setFailed] = useState(false);

  const src = badge && !failed
    ? `http://streamed.pk/api/images/badge/${badge}.webp`
    :  null;

  return (
    <Wrap size={size}>
      {src ? (
        <Image
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) :(
        <Initials size={size}>
          {initials(name)}
        </Initials>
      )}
    </Wrap>
  );
}