import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import type { DragDropLevelProps, DraggableItem, DropZone } from './levels.types';

interface DragItem {
  id: string;
  type: string;
  color?: string;
}

const STATS_PANEL_WIDTH = 320;
const STATS_PANEL_HEIGHT = 220;
const STATS_PANEL_PADDING = 25;

const DraggableItemComponent: React.FC<{
  item: DraggableItem;
  isActive: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onDrag: (id: string, x: number, y: number) => void;
  onDragStart: () => void;
  onDragEnd: (itemId: string, dropZoneId: string | null) => void;
}> = ({ item, isActive, containerRef, onDrag, onDragStart, onDragEnd }) => {
  const [{ isDragging }, dragRef] = useDrag<DragItem, { zoneId: string }, { isDragging: boolean }>(() => ({
    type: 'ITEM',
    item: { id: item.id, type: item.type, color: item.color },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    canDrag: isActive && !item.isHit,
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<{ zoneId: string }>();
      onDragEnd(item.id, dropResult?.zoneId || null);
    },
  }), [item.id, item.type, item.color, isActive, item.isHit, onDragEnd]);

  useEffect(() => {
    if (isDragging) {
      const handleDragMove = (e: MouseEvent) => {
        if (!containerRef.current) return;
        
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - item.radius;
        const y = e.clientY - rect.top - item.radius;
        
        onDrag(item.id, x, y);
      };

      window.addEventListener('mousemove', handleDragMove);
      
      return () => {
        window.removeEventListener('mousemove', handleDragMove);
      };
    }
  }, [isDragging, item.id, item.radius, containerRef, onDrag]);

  const getItemColor = () => {
    return item.type === 'red' ? 'bg-red-500' : 'bg-green-500';
  };

  if (item.isHit) return null;

  return (
    <div
      ref={dragRef as unknown as React.RefObject<HTMLDivElement>}
      onMouseDown={onDragStart}
      className={`
        absolute rounded-xl shadow-lg cursor-grab
        active:cursor-grabbing transition-all duration-150
        ${getItemColor()}
        ${isDragging ? 'shadow-2xl scale-110 z-50 opacity-70' : 'hover:scale-105'}
        ${!isActive ? 'pointer-events-none opacity-50' : ''}
      `}
      style={{
        left: item.x,
        top: item.y,
        width: item.radius * 2,
        height: item.radius * 2,
      }}
    />
  );
};

const DropZoneComponent: React.FC<{
  zone: DropZone;
}> = ({ zone }) => {
  const [{ isOver }, dropRef] = useDrop<DragItem, { zoneId: string }, { isOver: boolean }>(() => ({
    accept: 'ITEM',
    drop: () => ({ zoneId: zone.id }),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [zone.id]);

  const getZoneColor = () => {
    return zone.color === 'red' 
      ? 'border-red-400' 
      : 'border-green-400';
  };

  return (
    <div
      id={`zone-${zone.id}`}
      ref={dropRef as unknown as React.RefObject<HTMLDivElement>}
      className={`
        absolute border-4 border-dashed rounded-xl transition-all duration-300
        ${getZoneColor()}
        ${isOver ? 'ring-4 ring-blue-400 scale-105 bg-opacity-75' : ''}
        hover:bg-opacity-50
      `}
      style={{
        left: zone.x,
        top: zone.y,
        width: zone.width,
        height: zone.height,
      }}
    />
  );
};

const Level4_DragDropContent: React.FC<DragDropLevelProps> = ({
  level,
  onTargetHit,
  onTargetMiss,
  onComplete,
  isActive
}) => {
  const [items, setItems] = useState<DraggableItem[]>([]);
  const [dropZones, setDropZones] = useState<DropZone[]>([]);
  const [completedItems, setCompletedItems] = useState<string[]>([]);
  const [correctPlacements, setCorrectPlacements] = useState(0);
  const [wrongPlacements, setWrongPlacements] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [screenFlash, setScreenFlash] = useState<'red' | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout>>(0);

  const generateRandomPosition = useCallback((containerWidth: number, containerHeight: number, padding: number, excludeArea?: { x: number; y: number; width: number; height: number }) => {
    let attempts = 0;
    const maxAttempts = 100;
    
    while (attempts < maxAttempts) {
      const x = padding + Math.random() * (containerWidth - 2 * padding - 150);
      const y = padding + Math.random() * (containerHeight - 2 * padding - 150);
      
      if (!excludeArea) return { x, y };
      
      const isInExcludedArea = 
        x + 150 > excludeArea.x && 
        x < excludeArea.x + excludeArea.width &&
        y + 150 > excludeArea.y && 
        y < excludeArea.y + excludeArea.height;
      
      if (!isInExcludedArea) return { x, y };
      
      attempts++;
    }
    
    return {
      x: padding + Math.random() * (containerWidth - 2 * padding - 150),
      y: padding + Math.random() * (containerHeight - 2 * padding - 150)
    };
  }, []);

  useEffect(() => {
    if (!isActive || !containerRef.current) {
      setShowCompletion(false);
      setCompletedItems([]);
      setCorrectPlacements(0);
      setWrongPlacements(0);
      setDraggedItemId(null);
      return;
    }

    const container = containerRef.current.getBoundingClientRect();
    const padding = 50;
    const zoneWidth = 150;
    const zoneHeight = 150;

    const excludeArea = {
      x: STATS_PANEL_PADDING,
      y: STATS_PANEL_PADDING,
      width: STATS_PANEL_WIDTH,
      height: STATS_PANEL_HEIGHT
    };

    let redZonePos, greenZonePos;
    let attempts = 0;
    const maxAttempts = 50;
    
    do {
      redZonePos = generateRandomPosition(container.width, container.height, padding, excludeArea);
      attempts++;
    } while (!redZonePos && attempts < maxAttempts);
    
    attempts = 0;
    do {
      greenZonePos = generateRandomPosition(container.width, container.height, padding, excludeArea);
      attempts++;
    } while (
      (!greenZonePos || 
       (Math.abs(greenZonePos.x - redZonePos.x) < zoneWidth + 50 &&
        Math.abs(greenZonePos.y - redZonePos.y) < zoneHeight + 50) ||
       (greenZonePos.x + zoneWidth > excludeArea.x && 
        greenZonePos.x < excludeArea.x + excludeArea.width &&
        greenZonePos.y + zoneHeight > excludeArea.y && 
        greenZonePos.y < excludeArea.y + excludeArea.height)) &&
      attempts < maxAttempts
    );

    const newDropZones: DropZone[] = [
      {
        id: 'red-zone',
        x: redZonePos.x,
        y: redZonePos.y,
        width: zoneWidth,
        height: zoneHeight,
        color: 'red',
        acceptedTypes: ['red']
      },
      {
        id: 'green-zone',
        x: greenZonePos.x,
        y: greenZonePos.y,
        width: zoneWidth,
        height: zoneHeight,
        color: 'green',
        acceptedTypes: ['green']
      }
    ];
    setDropZones(newDropZones);

    const MIN_ITEMS = 10;
    const MAX_ITEMS = 15;
    const itemCount = MIN_ITEMS + Math.floor(Math.random() * (MAX_ITEMS - MIN_ITEMS + 1));
    const itemRadius = 35;
    
    const newItems: DraggableItem[] = [];
    
    for (let i = 0; i < itemCount; i++) {
      const type = Math.random() < 0.5 ? 'red' : 'green';
      const color = type;
      
      let pos;
      let itemAttempts = 0;
      do {
        pos = {
          x: padding + Math.random() * (container.width - 2 * padding - itemRadius * 2),
          y: padding + Math.random() * (container.height - 2 * padding - itemRadius * 2)
        };
        itemAttempts++;
      } while (
        itemAttempts < 50 &&
        ((pos.x + itemRadius * 2 > excludeArea.x && 
          pos.x < excludeArea.x + excludeArea.width &&
          pos.y + itemRadius * 2 > excludeArea.y && 
          pos.y < excludeArea.y + excludeArea.height) ||
         (pos.x + itemRadius * 2 > redZonePos.x && 
          pos.x < redZonePos.x + zoneWidth &&
          pos.y + itemRadius * 2 > redZonePos.y && 
          pos.y < redZonePos.y + zoneHeight) ||
         (pos.x + itemRadius * 2 > greenZonePos.x && 
          pos.x < greenZonePos.x + zoneWidth &&
          pos.y + itemRadius * 2 > greenZonePos.y && 
          pos.y < greenZonePos.y + zoneHeight))
      );
      
      newItems.push({
        id: `${type}-${i}-${Date.now()}`,
        x: pos.x,
        y: pos.y,
        radius: itemRadius,
        type: type,
        color: color,
        isActive: true,
        isHit: false,
        isDragging: false
      });
    }

    setItems(newItems);
    setTotalItems(newItems.length);
  }, [isActive, generateRandomPosition]);

  useEffect(() => {
    if (completedItems.length === totalItems && totalItems > 0 && !showCompletion) {
      setShowCompletion(true);
    }
  }, [completedItems.length, totalItems, showCompletion]);

  const handleDrag = (id: string, x: number, y: number) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, x, y } : item
    ));
  };

  const handleDragEnd = (itemId: string, zoneId: string | null) => {
    setDraggedItemId(null);

    const draggedItem = items.find(i => i.id === itemId);
    if (!draggedItem) return;

    if (!zoneId) {
      return;
    }

    const targetZone = dropZones.find(z => z.id === zoneId);
    if (!targetZone) {
      return;
    }

    const isCorrect = targetZone.acceptedTypes?.includes(draggedItem.type) || false;

    if (isCorrect) {
      setItems(prev => prev.filter(item => item.id !== itemId));
      setCompletedItems(prev => [...prev, itemId]);
      setCorrectPlacements(prev => prev + 1);
      onTargetHit(itemId);
    } else {
      setItems(prev => prev.filter(item => item.id !== itemId));
      setCompletedItems(prev => [...prev, itemId]);
      setWrongPlacements(prev => prev + 1);
      setScreenFlash('red');
      onTargetMiss();
      
      clearTimeout(flashTimerRef.current);
      flashTimerRef.current = setTimeout(() => {
        setScreenFlash(null);
      }, 500);
      
      const zoneElement = document.getElementById(`zone-${targetZone.id}`);
      zoneElement?.classList.add('ring-4', 'ring-red-400', 'scale-105');
      setTimeout(() => {
        zoneElement?.classList.remove('ring-4', 'ring-red-400', 'scale-105');
      }, 300);
    }
  };

  if (showCompletion) {
    const totalAttempts = correctPlacements + wrongPlacements;
    const accuracy = totalAttempts > 0 ? (correctPlacements / totalAttempts) * 100 : 0;
    const isPassed = accuracy >= (level.requiredAccuracy || 70);

    return (
      <div className="relative w-full h-full min-h-125 bg-linear-to-b from-blue-50 to-green-50 rounded-lg overflow-hidden flex items-center justify-center">
        <div className="bg-white p-10 rounded-2xl shadow-2xl text-center max-w-2xl">
          <div className="text-7xl mb-6">{isPassed ? '🏆' : '📊'}</div>
          <h2 className={`text-4xl font-bold mb-6 ${isPassed ? 'text-green-600' : 'text-orange-600'}`}>
            {isPassed ? 'Уровень пройден!' : 'Уровень завершён'}
          </h2>
          
          <div className="space-y-4 mb-8 text-xl">
            <div className="flex justify-between">
              <span className="text-gray-600">Всего предметов:</span>
              <span className="font-bold text-gray-800">{totalItems}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Правильно размещено:</span>
              <span className="font-bold text-green-600">{correctPlacements}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Неправильно размещено:</span>
              <span className="font-bold text-red-600">{wrongPlacements}</span>
            </div>
            <div className="flex justify-between border-t pt-4 text-2xl">
              <span className="text-gray-600">Точность:</span>
              <span className={`font-bold ${isPassed ? 'text-blue-600' : 'text-orange-600'}`}>
                {accuracy.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="text-gray-600">Требовалось:</span>
              <span className="font-bold text-gray-600">{level.requiredAccuracy || 70}%</span>
            </div>
          </div>

          <button
            onClick={() => onComplete()}
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl text-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Вернуться к выбору уровня
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full min-h-125 rounded-lg overflow-hidden"
    >
      {screenFlash === 'red' && (
        <>
          <div className="absolute inset-x-0 top-0 h-16 bg-red-500 bg-opacity-30 animate-pulse z-30 pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-red-500 bg-opacity-30 animate-pulse z-30 pointer-events-none" />
          <div className="absolute inset-y-0 left-0 w-16 bg-red-500 bg-opacity-30 animate-pulse z-30 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 bg-red-500 bg-opacity-30 animate-pulse z-30 pointer-events-none" />
        </>
      )}

      <div className="absolute top-5 left-5 bg-white p-6 rounded-xl shadow-lg z-20" style={{ width: STATS_PANEL_WIDTH }}>
        <h3 className="text-2xl font-bold text-gray-800 mb-3">{level.title}</h3>
        <p className="text-gray-600 text-base max-w-md mb-3">{level.description}</p>
        <div className="space-y-2 text-base">
          <div className="text-gray-700 font-medium">
            Перемещено: {completedItems.length} / {totalItems}
          </div>
          <div className="flex gap-6 text-lg">
            <span className="text-green-600 font-bold">✓ {correctPlacements}</span>
            <span className="text-red-600 font-bold">✗ {wrongPlacements}</span>
          </div>
        </div>
      </div>

      {dropZones.map((zone) => (
        <DropZoneComponent
          key={zone.id}
          zone={zone}
        />
      ))}

      {items.map((item) => (
        !item.isHit && (
          <DraggableItemComponent
            key={item.id}
            item={item}
            isActive={isActive}
            containerRef={containerRef}
            onDrag={handleDrag}
            onDragStart={() => setDraggedItemId(item.id)}
            onDragEnd={handleDragEnd}
          />
        )
      ))}

      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-80 bg-white rounded-full h-4 shadow-md overflow-hidden">
        <div 
          className="h-full bg-linear-to-r from-green-400 to-blue-500 transition-all duration-300"
          style={{ width: `${(completedItems.length / totalItems) * 100}%` }}
        />
      </div>

      {items.filter(i => !i.isHit).length > 0 && !draggedItemId && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 
          bg-yellow-100 text-yellow-800 px-6 py-3 rounded-xl animate-pulse shadow-lg text-lg font-medium">
          👆 Перетащите предметы в соответствующие зоны
        </div>
      )}
    </div>
  );
};

export const Level4_DragDrop: React.FC<DragDropLevelProps> = (props) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <Level4_DragDropContent {...props} />
    </DndProvider>
  );
};