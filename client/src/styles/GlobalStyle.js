import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html {
    background: ${(p) => p.theme.bg};
    scroll-behavior: smooth;
  }

  body {
    margin: 0;
    min-width: 320px;
    background:
      radial-gradient(
        circle at 50% -10%,
        rgba(139,61,255,.06),
        transparent 35%
      ),
      ${(p) => p.theme.bg};
    color: ${(p) => p.theme.text};
    font-family: Arial, sans-serif;
    overflow-x: hidden;
  }

  body,
  button,
  input {
    font-family: Arial, sans-serif;
  }

  button,
  input {
    font: inherit;
  }

  button {
    -webkit-tap-highlight-color: transparent;
  }

  a {
    -webkit-tap-highlight-color: transparent;
  }

  img {
    max-width: 100%;
  }

  ::selection {
    background: ${(p) => p.theme.accent};
    color: #fff;
  }

  ::-webkit-scrollbar {
    width: 7px;
    height: 7px;
  }

  ::-webkit-scrollbar-track {
    background: ${(p) => p.theme.bg};
  }

  ::-webkit-scrollbar-thumb {
    background: #40364d;
    border-radius: 99px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${(p) => p.theme.accent};
  }

  @media (max-width: 600px) {
    ::-webkit-scrollbar {
      width: 4px;
      height: 4px;
    }
  }
`;

export default GlobalStyle;