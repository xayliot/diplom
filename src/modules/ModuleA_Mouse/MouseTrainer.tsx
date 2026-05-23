import React, { useState } from 'react';
import type { MouseTrainerProps, LevelState } from './MouseTrainer.types';
import { Level1_Tracking,Level2_ClickStatic,Level3_ClickDynamic,Level4_DragDrop } from './levels/index';

export const MouseTrainer: React.FC<MouseTrainerProps> = ({
  level,
  onComplete,
  className = ''
}) => {
  const [state, setState] = useState<LevelState>({
    targets: [],
    hits: 0,
    misses: 0,
    startTime: Date.now(),
    elapsedTime: 0,
    isCompleted: false
  });

  const handleTargetHit = () => {
    setState(prev => ({
      ...prev,
      hits: prev.hits + 1
    }));
  };

  const handleTargetMiss = () => {
    setState(prev => ({
      ...prev,
      misses: prev.misses + 1
    }));
  };

  const handleLevelComplete = () => {
    const accuracy = (state.hits / (state.hits + state.misses)) * 100;
    const elapsedTime = (Date.now() - state.startTime) / 1000;
    
    setState(prev => ({ ...prev, isCompleted: true }));
    onComplete(accuracy, elapsedTime);
  };

  const renderLevel = () => {
    const commonProps = {
      level,
      onTargetHit: handleTargetHit,
      onTargetMiss: handleTargetMiss,
      onComplete: handleLevelComplete,
      isActive: !state.isCompleted
    };

    switch (level.id) {
      case 'level1-tracking':
        return <Level1_Tracking {...commonProps} trajectory={[]} />;
      
      case 'level2-click-static':
        return <Level2_ClickStatic {...commonProps} />;
      
      case 'level3-click-dynamic':
        return <Level3_ClickDynamic {...commonProps} />;
      
      case 'level4-drag-drop':
        return (
          <Level4_DragDrop
            {...commonProps}
            config={{
              items: [],
              dropZones: [],
              showGhost: true,
              snapToCenter: true
            }}
          />
        );
      
      default:
        return <Level2_ClickStatic {...commonProps} />;
    }
  };

  return (
    <div className={`relative h-full bg-stone-300 ${className}`}>
      {renderLevel()}
    </div>
  );
};