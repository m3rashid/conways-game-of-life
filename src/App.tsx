import { boxEdgeLength, useBoxes } from './hooks/data';

const App = () => {
  const { data, start, onClickStart, onClickStop, onClickBox } = useBoxes();

  return (
    <div className='relative'>
      <div className='absolute flex mt-2 items-end justify-center gap-10 w-full'>
        <h1 className='text-3xl font-bold'>Conway's Game of Life</h1>

        <button
          className={`px-4 py-2 right-0 top-0 mr-2  rounded-md text-white ${
            start ? 'bg-red-600' : 'bg-green-600'
          }`}
          onClick={start ? onClickStop : onClickStart}
        >
          {start ? 'STOP' : 'START'}
        </button>
      </div>

      {data.map((row, y) => (
        <div key={y} className='flex items-center justify-center'>
          {row.map((box, x) => (
            <div
              onClick={() => onClickBox(x, y)}
              onMouseEnter={() => onClickBox(x, y)}
              key={`${x}--${y}`}
              className={`border-2 ${box.active ? 'bg-black' : 'bg-white'}`}
              style={{ height: boxEdgeLength, width: boxEdgeLength }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default App;
