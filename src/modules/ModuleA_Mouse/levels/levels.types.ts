import type { MouseLevel, Position } from "../MouseTrainer.types";

export interface LevelProps {
  level: MouseLevel;
  onTargetHit: (targetId: string) => void;
  onTargetMiss: () => void;
  onComplete: (result?: { accuracy: number; timeElapsed?: number }) => void;
  isActive: boolean;
}

export interface TrackingLevelProps extends LevelProps {
  trajectory: Position[];
}

export interface DropZone {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: 'green' | 'blue' | 'yellow' | 'red' | 'purple';
  label?: string;
  icon?: string;
  acceptedTypes?: string[];
}

export interface DraggableItem extends Position {
  id: string;
  radius: number;
  type: string;
  icon?: string;
  label?: string;
  color?: string;
  isActive?: boolean;
  isHit?: boolean;
  isDragging?: boolean;
}

export interface DragDropConfig {
  items: DraggableItem[];
  dropZones: DropZone[];
  showGhost?: boolean;
  snapToCenter?: boolean;
  requiredMatches?: Array<{
    itemType: string;
    zoneId: string;
  }>;
}

export interface DragDropLevelProps extends LevelProps {
  config: DragDropConfig;
}