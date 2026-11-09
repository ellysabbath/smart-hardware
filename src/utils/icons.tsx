import {
  Package,
  Box,
  Layers,
  Grid3x3,
  Hammer,
  PaintBucket,
  Wrench,
  Zap,
  Home,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { KundiBidhaa } from '../types'

const ICONS: Record<KundiBidhaa, LucideIcon> = {
  Saruji: Box,
  Nondo: Grid3x3,
  Mabati: Home,
  Mbao: Layers,
  Rangi: PaintBucket,
  Bomba: Wrench,
  Umeme: Zap,
  Zana: Hammer,
}

export function iconForKundi(kundi?: KundiBidhaa): LucideIcon {
  if (!kundi) return Package
  return ICONS[kundi] ?? Package
}