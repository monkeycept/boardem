/**
 * Named colours from Sanzo Wada's "A Dictionary of Color Combinations" (1933–34),
 * values from the MIT-licensed dataset github.com/mattdesl/dictionary-of-colour-combinations.
 * The app UI is built on combination 155; lofts, posters and album art use others.
 */
export const wada = {
  deepIndigo: '#051230',
  benzolGreen: '#00978d',
  jasperRed: '#eb5324',
  darkTyrianBlue: '#12354e',
  orange: '#f37420',
  yellowGreen: '#afd472',
  redViolet: '#59256a',
  rosolancPurple: '#b73f74',
  orangeYellow: '#fcb315',
  deepSlateGreen: '#112f2c',
  oliveOcher: '#d6b43e',
  violetBlue: '#40456a',
  cerulianBlue: '#0093a5',
  fawn: '#d1b0a7',
  deepLyonsBlue: '#1c4286',
  yellowOcher: '#e2b540',
  ivoryBuff: '#ebd3a2',
  vandarPoelsBlue: '#064f6e',
  ecru: '#c2ae93',
  paleKingsBlue: '#a7d4e4',
  vandykeBrown: '#4b3317',
  plumbeous: '#70727c',
  creamYellow: '#fdbf68',
  calamineBlue: '#78cdd0',
  hermosaPink: '#f9c1ce',
  seashellPink: '#fdd4bd',
  cossackGreen: '#437742',
  salviaBlue: '#97acc8',
  sulpherYellow: '#f5ecc2',
  paleRawUmber: '#71502f',
  neutralGray: '#b6bfc1',
  lincolnGreen: '#555832',
  deepGrayishOlive: '#635a3a',
  slateColor: '#34454c',
  darkMediciBlue: '#547076',
  oliveYellow: '#a6a159',
  rawSienna: '#bb7125',
  diamineGreen: '#1a7444',
  khaki: '#bc892b',
  cobaltGreen: '#96d1aa',
} as const

/** Colours the canvas and other non-Tailwind code draw with. */
export const ui = {
  ground: wada.deepIndigo,
  accent: wada.benzolGreen,
  accentLight: '#7bd7cd', // sea-300
  warm: wada.jasperRed,
  paper: '#f3f7fe', // ink-50
  shadow: '#020817',
}
