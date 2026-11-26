// Evidence photo catalogue (Teamfight Tactics screenshots).
// Files live in /public/photos as <id>-480.webp (grid) and <id>-1200.webp (lightbox, original width).
export const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'board', label: 'Board' },
  { id: 'shop', label: 'Shop' },
  { id: 'choices', label: 'Choices' },
  { id: 'lobby', label: 'Lobby & results' },
];

// Screenshots collected from public web sources; game assets © Riot Games
const SOURCE = 'Public web screenshot – Teamfight Tactics © Riot Games';

export const PHOTOS = [
  { id: 'p01', category: 'board', title: 'Combat at stage 3-1', description: 'Mid-game fight on the board with eight players still alive.', source: SOURCE },
  { id: 'p02', category: 'board', title: 'Mobile board at stage 3-5', description: 'Positioning before combat on the mobile client.', source: SOURCE },
  { id: 'p03', category: 'shop', title: 'Mobile shop roll', description: 'Shop offering Thresh, Xin Zhao, Vi, Nami and Kennen with 50 gold banked.', source: SOURCE },
  { id: 'p04', category: 'shop', title: 'Level 8 shop', description: 'Level 8 shop odds and the champion bench during a fight.', source: SOURCE },
  { id: 'p05', category: 'choices', title: 'Shared draft carousel', description: 'All players pick a champion from the shared carousel.', source: SOURCE },
  { id: 'p06', category: 'choices', title: 'Augment choice', description: 'Three augment options on the Vietnamese client ("Chọn một Nâng cấp").', source: SOURCE },
  { id: 'p07', category: 'lobby', title: 'Party lobby', description: 'Four-player party lobby before starting a normal game.', source: SOURCE },
  { id: 'p08', category: 'lobby', title: 'Eighth place result', description: 'End-of-game standings for a ranked match finished in eighth place.', source: SOURCE },
  { id: 'p09', category: 'lobby', title: 'Match history', description: 'Recent games list showing three first-place finishes.', source: SOURCE },
];

// Grid uses the small file, lightbox uses the large one
export const thumbSrc = (photo) => `/photos/${photo.id}-480.webp`;
export const fullSrc = (photo) => `/photos/${photo.id}-1200.webp`;