const sportConfig = {
  football: {
    name: 'Football',
    icon: '⚽'
  },
  basketball: {
    name: 'Basketball',
    icon: '🏀'
  },
  tennis: {
    name: 'Tennis',
    icon: '🎾'
  },
  hockey: {
    name: 'Hockey',
    icon: '🏒'
  },
  baseball: {
    name: 'Baseball',
    icon: '⚾'
  },
  'american-football': {
    name: 'American Football',
    icon: '🏈'
  },
  'motor-sports': {
    name: 'Motorsport',
    icon: '🏎️'
  },
  motorsport: {
    name: 'Motorsport',
    icon: '🏎️'
  },
  fight: {
    name: 'Fight',
    icon: '🥊'
  },
  mma: {
    name: 'MMA',
    icon: '🥊'
  },
  boxing: {
    name: 'Boxing',
    icon: '🥊'
  },
  rugby: {
    name: 'Rugby',
    icon: '🏉'
  },
  golf: {
    name: 'Golf',
    icon: '⛳'
  },
  billiards: {
    name: 'Billiards',
    icon: '🎱'
  },
  darts: {
    name: 'Darts',
    icon: '🎯'
  },
  cricket: {
    name: 'Cricket',
    icon: '🏏'
  },
  afl: {
    name: 'AFL',
    icon: '🏉'
  },
  other: {
    name: 'Other',
    icon: '🏆'
  }
};

export function getSportConfig(id) {
    const key = String(id || '').toLowerCase();

    return (
        sportConfig[key] || {
            name: key
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, (char) => char.toUpperCase()),
          icon: '🏆'
        }
    );
}

export function getSportName(id) {
    return getSportIcon(id).name;
    }

export function getSportIcon(id) {
    return getSportConfig(id).icon;
}

export default sportConfig;