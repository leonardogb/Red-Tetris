import { useState, useCallback } from 'react';

export  default usePlayer = () => {

  const updatePlayerPos = ({ x, y, collided }) => {
    setPlayer(prev => ({
      ...prev,
      pos: { x: (prev.pos.x += x), y: (prev.pos.y += y) },
      collided,
    }));
  };
  return [updatePlayerPos];
}
