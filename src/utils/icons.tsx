import {
  Package, Layers, Home, PaintBucket, Wrench, Zap, Droplet, Box,
} from 'lucide-react'
import type { KundiBidhaa } from '../types'

const ICONS: Record<KundiBidhaa, React.ElementType> = {
  Saruji: Package,
  Nondo: Layers,
  Mabati: Home,
  Mbao: Layers,
  Rangi: PaintBucket,
  Bomba: Droplet,
  Umeme: Zap,
  Zana: Wrench,
}

export function iconForKundi(kundi?: KundiBidhaa): React.ElementType {
  return kundi ? ICONS[kundi] ?? Box : Box
}