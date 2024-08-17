import { TwistyPlayer, TwistyPlayerConfig } from "cubing/twisty";
import { GanCubeMove } from "gan-web-bluetooth";
  
const defaultTwistyConfig: TwistyPlayerConfig = {
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
};

let twistyPlayers: TwistyPlayer[] = [];

function addTwistyPlayer(twistyPlayer: TwistyPlayer) {
  twistyPlayers.push(twistyPlayer);
}

function handleMoveEvent(event: GanCubeMove) {
  twistyPlayers.forEach(twistyPlayer => {
    twistyPlayer.experimentalAddMove(event.move, { cancel: false });
  });
}

function resetCubeState() {
  twistyPlayers.forEach(twistyPlayer => twistyPlayer.alg = '');
}

export {
  defaultTwistyConfig,
  addTwistyPlayer,
  handleMoveEvent,
  resetCubeState
}
