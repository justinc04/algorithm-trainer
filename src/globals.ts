import { TwistyPlayer } from "cubing/twisty";
  
export const twistyPlayer = new TwistyPlayer({
  puzzle: '3x3x3',
  visualization: 'PG3D',
  alg: '',
  experimentalSetupAnchor: 'start',
  background: 'none',
  controlPanel: 'none',
  hintFacelets: 'none',
  experimentalDragInput: 'auto',
  cameraLatitude: 60,
  cameraLongitude: 30,
  cameraLatitudeLimit: 30,
  tempoScale: 5
});
