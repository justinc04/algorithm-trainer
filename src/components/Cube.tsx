import { useEffect, useRef } from 'react';
import { TwistyPlayer, TwistyPlayerConfig } from 'cubing/twisty';
import { defaultTwistyConfig, addTwistyPlayer } from '../twisty-player';

function Cube({ customTwistyConfig } : { customTwistyConfig?: TwistyPlayerConfig }) {
  const cubeRef = useRef<HTMLDivElement>(null);

  const twistyConfig = {
    ...defaultTwistyConfig,
    ...customTwistyConfig
  };

  const twistyPlayer = new TwistyPlayer(twistyConfig);
  addTwistyPlayer(twistyPlayer);

  useEffect(() => {
    cubeRef.current?.replaceWith(twistyPlayer);
  }, []);

  return (
    <div ref={cubeRef} />
  );
}

export default Cube;