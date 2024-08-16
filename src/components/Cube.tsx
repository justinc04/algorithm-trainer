import { useEffect, useRef } from 'react';
import { twistyPlayer } from '../globals';

function Cube() {
  const cubeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    cubeRef.current?.replaceWith(twistyPlayer);
  }, []);

  return (
    <div ref={cubeRef} />
  );
}

export default Cube;