export const COLORS = {
  bg:         '#0a0a0f',
  bgCard:     '#13131a',
  bgElevated: '#1a1a24',
  accent:     '#7c3aed',
  accentLight:'#a78bfa',
  neon:       '#00f5d4',
  neonGlow:   'rgba(0,245,212,0.15)',
  warning:    '#f59e0b',
  danger:     '#ef4444',
  success:    '#10b981',
  text:       '#f1f1f3',
  textMuted:  '#6b6b85',
  textSub:    '#9999b3',
  border:     'rgba(255,255,255,0.07)',
}

export const GRADIENTS = {
  accent:  ['#7c3aed', '#4f46e5'],
  neon:    ['#00f5d4', '#00b4d8'],
  fire:    ['#f97316', '#ef4444'],
  purple:  ['#7c3aed', '#ec4899'],
  gold:    ['#f59e0b', '#f97316'],
}

export const FONTS = {
  sizes: {
    xs:   11,
    sm:   13,
    md:   15,
    lg:   18,
    xl:   22,
    xxl:  28,
    hero: 40,
  },
  weights: {
    regular: '400',
    medium:  '500',
    bold:    '700',
    black:   '900',
  }
}

export const GAME_MODES = [
  {
    id: 'memory',
    name: 'Mémoire',
    icon: '🧠',
    description: 'Mémorise et reproduis la séquence',
    color: '#7c3aed',
    gradient: ['#7c3aed', '#4f46e5'],
  },
  {
    id: 'sequence',
    name: 'Séquence',
    icon: '⚡',
    description: 'Suis l\'ordre des couleurs',
    color: '#00f5d4',
    gradient: ['#00f5d4', '#00b4d8'],
  },
  {
    id: 'math',
    name: 'Calcul Rapide',
    icon: '🔢',
    description: 'Réponds aux calculs le plus vite possible',
    color: '#f59e0b',
    gradient: ['#f59e0b', '#f97316'],
  },
  {
    id: 'speed',
    name: 'Vitesse',
    icon: '🎯',
    description: 'Touche la bonne cible avant le temps',
    color: '#ef4444',
    gradient: ['#ef4444', '#dc2626'],
  },
]

export const AVATARS = ['🧠', '🦊', '🐉', '🦁', '🐺', '🦅', '🐬', '🦄', '👾', '🤖', '👻', '🎭']