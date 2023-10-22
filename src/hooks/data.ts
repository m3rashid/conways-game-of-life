import { useCallback, useEffect, useLayoutEffect, useState } from 'react';

export const boxEdgeLength = 40;

export type Box = {
  active: boolean;
  // on iterating through the 2D data array,
  // use y as the outer iterator and x as the inner iterator
  // x: xPos, y: yPos
};

export type Data = Array<Box[]>;

export const useBoxes = () => {
  const [start, setStart] = useState(false);
  const [data, setData] = useState<Data>([]);

  const onWindowResize = useCallback(() => {
    const { innerHeight, innerWidth } = window;
    const rows = Math.floor(innerHeight / boxEdgeLength);
    const columns = Math.floor(innerWidth / boxEdgeLength);

    const newData: Data = [];
    for (let j = 0; j < rows; j++) {
      const row: Box[] = [];
      for (let i = 0; i < columns; i++) row.push({ active: false });
      newData.push(row);
    }
    setData(newData);
  }, []);

  useLayoutEffect(() => {
    onWindowResize();

    window.addEventListener('resize', onWindowResize);
    return () => window.removeEventListener('resize', onWindowResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!start) return;
    const interval = setInterval(playGame, 200);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start]);

  const onClickStart = () => {
    setStart(true);
  };

  const onClickStop = () => {
    setStart(false);
  };

  const onClickBox = (xPos: number, yPos: number) => {
    if (start) return;

    setData((prev) =>
      prev.map((row, y) =>
        row.map((box, x) =>
          x === xPos && y === yPos ? { ...box, active: !box.active } : box
        )
      )
    );
  };

  const adhereRules = (
    x: number,
    y: number,
    stateData: Data,
    isActive: boolean
  ): boolean => {
    let count = 0;
    const indices = [
      [x - 1, y - 1],
      [x - 1, y],
      [x - 1, y + 1],
      [x, y - 1],
      [x, y + 1],
      [x + 1, y - 1],
      [x + 1, y],
      [x + 1, y + 1],
    ];

    for (const [x, y] of indices) {
      if (!stateData[x] || !stateData[x][y]) continue;
      if (stateData[x][y].active) count++;
    }

    return isActive ? count === 2 || count === 3 : count === 3;
  };

  const playGame = () => {
    setData((prev) =>
      prev.map((row, y) =>
        row.map((box, x) => ({
          ...box,
          active: adhereRules(x, y, prev, box.active),
        }))
      )
    );
  };

  return {
    data,
    start,
    onClickBox,
    onClickStop,
    onClickStart,
  };
};
