/*
MIT License

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import isUnicodeSupported from './is-unicode-supported';

const common = {
  circleQuestionMark: '(?)',
  questionMarkPrefix: '(?)',
  square: '█',
  squareDarkShade: '▓',
  squareMediumShade: '▒',
  squareLightShade: '░',
  squareTop: '▀',
  squareBottom: '▄',
  squareLeft: '▌',
  squareRight: '▐',
  squareCenter: '■',
  bullet: '●',
  dot: '․',
  ellipsis: '…',
  pointerSmall: '›',
  triangleUp: '▲',
  triangleUpSmall: '▴',
  triangleDown: '▼',
  triangleDownSmall: '▾',
  triangleLeftSmall: '◂',
  triangleRightSmall: '▸',
  home: '⌂',
  heart: '♥',
  musicNote: '♪',
  musicNoteBeamed: '♫',
  arrowUp: '↑',
  arrowDown: '↓',
  arrowLeft: '←',
  arrowRight: '→',
  arrowLeftRight: '↔',
  arrowUpDown: '↕',
  almostEqual: '≈',
  notEqual: '≠',
  lessOrEqual: '≤',
  greaterOrEqual: '≥',
  identical: '≡',
  infinity: '∞',
  subscriptZero: '₀',
  subscriptOne: '₁',
  subscriptTwo: '₂',
  subscriptThree: '₃',
  subscriptFour: '₄',
  subscriptFive: '₅',
  subscriptSix: '₆',
  subscriptSeven: '₇',
  subscriptEight: '₈',
  subscriptNine: '₉',
  oneHalf: '½',
  oneThird: '⅓',
  oneQuarter: '¼',
  oneFifth: '⅕',
  oneSixth: '⅙',
  oneEighth: '⅛',
  twoThirds: '⅔',
  twoFifths: '⅖',
  threeQuarters: '¾',
  threeFifths: '⅗',
  threeEighths: '⅜',
  fourFifths: '⅘',
  fiveSixths: '⅚',
  fiveEighths: '⅝',
  sevenEighths: '⅞',
  line: '─',
  lineBold: '━',
  lineDouble: '═',
  lineDashed0: '┄',
  lineDashed1: '┅',
  lineDashed2: '┈',
  lineDashed3: '┉',
  lineDashed4: '╌',
  lineDashed5: '╍',
  lineDashed6: '╴',
  lineDashed7: '╶',
  lineDashed8: '╸',
  lineDashed9: '╺',
  lineDashed10: '╼',
  lineDashed11: '╾',
  lineDashed12: '−',
  lineDashed13: '–',
  lineDashed14: '‐',
  lineDashed15: '⁃',
  lineVertical: '│',
  lineVerticalBold: '┃',
  lineVerticalDouble: '║',
  lineVerticalDashed0: '┆',
  lineVerticalDashed1: '┇',
  lineVerticalDashed2: '┊',
  lineVerticalDashed3: '┋',
  lineVerticalDashed4: '╎',
  lineVerticalDashed5: '╏',
  lineVerticalDashed6: '╵',
  lineVerticalDashed7: '╷',
  lineVerticalDashed8: '╹',
  lineVerticalDashed9: '╻',
  lineVerticalDashed10: '╽',
  lineVerticalDashed11: '╿',
  lineDownLeft: '┐',
  lineDownLeftArc: '╮',
  lineDownBoldLeftBold: '┓',
  lineDownBoldLeft: '┒',
  lineDownLeftBold: '┑',
  lineDownDoubleLeftDouble: '╗',
  lineDownDoubleLeft: '╖',
  lineDownLeftDouble: '╕',
  lineDownRight: '┌',
  lineDownRightArc: '╭',
  lineDownBoldRightBold: '┏',
  lineDownBoldRight: '┎',
  lineDownRightBold: '┍',
  lineDownDoubleRightDouble: '╔',
  lineDownDoubleRight: '╓',
  lineDownRightDouble: '╒',
  lineUpLeft: '┘',
  lineUpLeftArc: '╯',
  lineUpBoldLeftBold: '┛',
  lineUpBoldLeft: '┚',
  lineUpLeftBold: '┙',
  lineUpDoubleLeftDouble: '╝',
  lineUpDoubleLeft: '╜',
  lineUpLeftDouble: '╛',
  lineUpRight: '└',
  lineUpRightArc: '╰',
  lineUpBoldRightBold: '┗',
  lineUpBoldRight: '┖',
  lineUpRightBold: '┕',
  lineUpDoubleRightDouble: '╚',
  lineUpDoubleRight: '╙',
  lineUpRightDouble: '╘',
  lineUpDownLeft: '┤',
  lineUpBoldDownBoldLeftBold: '┫',
  lineUpBoldDownBoldLeft: '┨',
  lineUpDownLeftBold: '┥',
  lineUpBoldDownLeftBold: '┩',
  lineUpDownBoldLeftBold: '┪',
  lineUpDownBoldLeft: '┧',
  lineUpBoldDownLeft: '┦',
  lineUpDoubleDownDoubleLeftDouble: '╣',
  lineUpDoubleDownDoubleLeft: '╢',
  lineUpDownLeftDouble: '╡',
  lineUpDownRight: '├',
  lineUpBoldDownBoldRightBold: '┣',
  lineUpBoldDownBoldRight: '┠',
  lineUpDownRightBold: '┝',
  lineUpBoldDownRightBold: '┡',
  lineUpDownBoldRightBold: '┢',
  lineUpDownBoldRight: '┟',
  lineUpBoldDownRight: '┞',
  lineUpDoubleDownDoubleRightDouble: '╠',
  lineUpDoubleDownDoubleRight: '╟',
  lineUpDownRightDouble: '╞',
  lineDownLeftRight: '┬',
  lineDownBoldLeftBoldRightBold: '┳',
  lineDownLeftBoldRightBold: '┯',
  lineDownBoldLeftRight: '┰',
  lineDownBoldLeftBoldRight: '┱',
  lineDownBoldLeftRightBold: '┲',
  lineDownLeftRightBold: '┮',
  lineDownLeftBoldRight: '┭',
  lineDownDoubleLeftDoubleRightDouble: '╦',
  lineDownDoubleLeftRight: '╥',
  lineDownLeftDoubleRightDouble: '╤',
  lineUpLeftRight: '┴',
  lineUpBoldLeftBoldRightBold: '┻',
  lineUpLeftBoldRightBold: '┷',
  lineUpBoldLeftRight: '┸',
  lineUpBoldLeftBoldRight: '┹',
  lineUpBoldLeftRightBold: '┺',
  lineUpLeftRightBold: '┶',
  lineUpLeftBoldRight: '┵',
  lineUpDoubleLeftDoubleRightDouble: '╩',
  lineUpDoubleLeftRight: '╨',
  lineUpLeftDoubleRightDouble: '╧',
  lineUpDownLeftRight: '┼',
  lineUpBoldDownBoldLeftBoldRightBold: '╋',
  lineUpDownBoldLeftBoldRightBold: '╈',
  lineUpBoldDownLeftBoldRightBold: '╇',
  lineUpBoldDownBoldLeftRightBold: '╊',
  lineUpBoldDownBoldLeftBoldRight: '╉',
  lineUpBoldDownLeftRight: '╀',
  lineUpDownBoldLeftRight: '╁',
  lineUpDownLeftBoldRight: '┽',
  lineUpDownLeftRightBold: '┾',
  lineUpBoldDownBoldLeftRight: '╂',
  lineUpDownLeftBoldRightBold: '┿',
  lineUpBoldDownLeftBoldRight: '╃',
  lineUpBoldDownLeftRightBold: '╄',
  lineUpDownBoldLeftBoldRight: '╅',
  lineUpDownBoldLeftRightBold: '╆',
  lineUpDoubleDownDoubleLeftDoubleRightDouble: '╬',
  lineUpDoubleDownDoubleLeftRight: '╫',
  lineUpDownLeftDoubleRightDouble: '╪',
  lineCross: '╳',
  lineBackslash: '╲',
  lineSlash: '╱',
};

const specialMainSymbols = {
  tick: '✔',
  info: 'ℹ',
  warning: '⚠',
  cross: '✘',
  squareSmall: '◻',
  squareSmallFilled: '◼',
  circle: '◯',
  circleFilled: '◉',
  circleDotted: '◌',
  circleDouble: '◎',
  circleCircle: 'ⓞ',
  circleCross: 'ⓧ',
  circlePipe: 'Ⓘ',
  radioOn: '◉',
  radioOff: '◯',
  checkboxOn: '☒',
  checkboxOff: '☐',
  checkboxCircleOn: 'ⓧ',
  checkboxCircleOff: 'Ⓘ',
  pointer: '❯',
  triangleUpOutline: '△',
  triangleLeft: '◀',
  triangleRight: '▶',
  lozenge: '◆',
  lozengeOutline: '◇',
  hamburger: '☰',
  smiley: '㋡',
  mustache: '෴',
  star: '★',
  play: '▶',
  nodejs: '⬢',
  oneSeventh: '⅐',
  oneNinth: '⅑',
  oneTenth: '⅒',
};

const specialFallbackSymbols = {
  tick: '√',
  info: 'i',
  warning: '‼',
  cross: '×',
  squareSmall: '□',
  squareSmallFilled: '■',
  circle: '( )',
  circleFilled: '(*)',
  circleDotted: '( )',
  circleDouble: '( )',
  circleCircle: '(○)',
  circleCross: '(×)',
  circlePipe: '(│)',
  radioOn: '(*)',
  radioOff: '( )',
  checkboxOn: '[×]',
  checkboxOff: '[ ]',
  checkboxCircleOn: '(×)',
  checkboxCircleOff: '( )',
  pointer: '>',
  triangleUpOutline: '∆',
  triangleLeft: '◄',
  triangleRight: '►',
  lozenge: '♦',
  lozengeOutline: '◊',
  hamburger: '≡',
  smiley: '☺',
  mustache: '┌─┐',
  star: '✶',
  play: '►',
  nodejs: '♦',
  oneSeventh: '1/7',
  oneNinth: '1/9',
  oneTenth: '1/10',
};

export const mainSymbols = { ...common, ...specialMainSymbols };
export const fallbackSymbols = { ...common, ...specialFallbackSymbols };

const shouldUseMain = isUnicodeSupported();
const figures = shouldUseMain ? mainSymbols : fallbackSymbols;
export default figures;

const replacements = Object.entries(specialMainSymbols);

// On terminals which do not support Unicode symbols, substitute them to other symbols
export const replaceSymbols = (
  string,
  { useFallback = !shouldUseMain } = {}
) => {
  if (useFallback) {
    for (const [key, mainSymbol] of replacements) {
      string = string.replaceAll(mainSymbol, fallbackSymbols[key]);
    }
  }

  return string;
};
