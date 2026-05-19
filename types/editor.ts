import type { TextEffects } from './template';

export interface ZoneState {
  id: string;
  label: string;
  text: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  bold: boolean;
  italic: boolean;
  align: 'left' | 'center' | 'right';
  letterSpacing: number;
  lineHeight: number;
  caps: boolean;
  x: number;
  y: number;
  w: number;
  h: number;
  isSelected: boolean;
  effects?: TextEffects;
}

export type ToolbarAction =
  | { type: 'SET_FONT'; fontFamily: string }
  | { type: 'SET_SIZE'; fontSize: number }
  | { type: 'SET_COLOR'; color: string }
  | { type: 'TOGGLE_BOLD' }
  | { type: 'TOGGLE_ITALIC' }
  | { type: 'SET_ALIGN'; align: 'left' | 'center' | 'right' }
  | { type: 'SET_LINE_HEIGHT'; lineHeight: number }
  | { type: 'SET_LETTER_SPACING'; letterSpacing: number }
  | { type: 'TOGGLE_CAPS' }
  | { type: 'DUPLICATE' }
  | { type: 'DELETE' };

export interface EditorState {
  templateId: string | null;
  zones: ZoneState[];
  selectedZoneId: string | null;
  undoStack: ZoneState[][];
  redoStack: ZoneState[][];
}
