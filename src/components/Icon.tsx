import {
  Activity, ArrowLeftRight, AtSign, Blocks, BookOpen, Box, Boxes, Braces,
  Circle, CircleDot, Clapperboard, Compass, Dice5, Flame, FlaskConical,
  Gauge, Globe, Grid3x3, Hash, Library, Lock, Menu, Mountain, Move3d,
  Palette, PartyPopper, Plus, RotateCcw, Ruler, Shuffle, SlidersHorizontal,
  Sparkle, Spline, Sun, Target, Thermometer, Triangle, Waves, X, Zap,
  type LucideIcon,
} from 'lucide-react'

// ─── One icon set ─────────────────────────────────────────────────────────────
//
// Emoji render as somebody else's artwork: a different style per platform, a
// weight that never matches the text beside them, and no way to take the
// interface's own colour. Every mark in the UI comes from here instead.
//
// Lesson, module and recipe icons live in the curriculum as emoji because that
// is how the content was written. Rather than rewrite a hundred data entries,
// the emoji is treated as the NAME of an icon and looked up here. Anything not
// in the table falls back to a neutral mark, so new content never breaks.

const BY_EMOJI: Record<string, LucideIcon> = {
  // chrome
  '🧪': FlaskConical,   // playground
  '📕': Library,        // codex
  '🔁': RotateCcw,      // review
  '📘': BookOpen,       // learn card
  '🎬': Clapperboard,   // "in production"
  '🔒': Lock,
  '🔥': Flame,          // streak
  '⚡': Zap,
  '☰': Menu,
  '✕': X,
  '↺': RotateCcw,
  '🎉': PartyPopper,
  '✦': Sparkle,

  // lessons and modules
  '📖': BookOpen,
  '🔢': Hash,
  '📐': Ruler,
  '@': AtSign,
  '➕': Plus,
  '🎚': SlidersHorizontal,
  '🎚️': SlidersHorizontal,
  '↗': Move3d,
  '✳': Sparkle,
  '❓': Compass,
  '🎲': Dice5,
  '🌡': Thermometer,
  '🔵': Circle,
  '⭕': CircleDot,
  '♟': Blocks,
  '🏷': Braces,
  '🔀': Shuffle,
  '🔮': Globe,
  '🏔': Mountain,
  '🌊': Waves,
  '🎯': Target,

  // playground recipes
  '🌅': Sun,
  '🪨': Mountain,
  '🏁': Grid3x3,
  '🧬': Spline,
  '💡': Gauge,
  '🪐': Globe,
  '🎨': Palette,
  '📊': Activity,
  '⇄': ArrowLeftRight,
  '◺': Triangle,
  '▣': Box,
  '⊙': CircleDot,
  '〜': Waves,
  '∑': Hash,
  '⚙': SlidersHorizontal,
  '[ ]': Boxes,
}

const FALLBACK = Box

interface Props {
  /** The emoji the content uses, or any key in the table above. */
  name: string
  /** Pixel size; 16 unless the slot is bigger. */
  size?: number
  className?: string
  /** Decorative by default — set a label when the icon is the only content. */
  label?: string
  strokeWidth?: number
}

export function Icon({ name, size = 16, className = '', label, strokeWidth = 1.8 }: Props) {
  const Glyph = BY_EMOJI[name] ?? FALLBACK
  return (
    <Glyph
      size={size}
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden={label ? undefined : true}
      role={label ? 'img' : undefined}
      aria-label={label}
    />
  )
}

/** True when the curriculum's icon string has a real glyph behind it. */
export function hasIcon(name: string): boolean {
  return name in BY_EMOJI
}
