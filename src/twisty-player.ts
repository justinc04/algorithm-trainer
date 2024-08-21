import { TwistyPlayer, TwistyPlayerConfig } from 'cubing/twisty';
import { experimentalSolve3x3x3IgnoringCenters } from 'cubing/search';
import { GanCubeMove, GanCubeEvent } from 'gan-web-bluetooth';
import { faceletsToPattern, patternToFacelets } from './utils/utils';

const SOLVED_STATE = 'UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB';

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
  cameraLongitude: 20,
  cameraLatitudeLimit: 30,
  tempoScale: 5
};

let twistyPlayers: TwistyPlayer[] = [];

function addTwistyPlayer(twistyPlayer: TwistyPlayer) {
  twistyPlayer.experimentalModel.currentPattern.addFreshListener(async (kpattern) => {
    const facelets = patternToFacelets(kpattern);

    if (facelets == SOLVED_STATE) {
      twistyPlayer.alg = '';
    }
  });
  
  twistyPlayers.push(twistyPlayer);
}

function handleMoveEvent(event: GanCubeMove) {
  twistyPlayers.forEach(twistyPlayer => {
    twistyPlayer.experimentalAddMove(event.move, { cancel: false });
  });
}

let cubeStateInitialized = false;

async function handleFaceletsEvent(event: GanCubeEvent) {
  if (event.type == 'FACELETS' && !cubeStateInitialized) {
    if (event.facelets != SOLVED_STATE) {
      const kpattern = faceletsToPattern(event.facelets);
      const solution = await experimentalSolve3x3x3IgnoringCenters(kpattern);
      const scramble = solution.invert().toString();
      setCubeState(scramble);
    } 
    else {
      setCubeState('');
    }

    cubeStateInitialized = true;
  }
}

function uninitializeState() {
  cubeStateInitialized = false;
}

function setCubeState(alg: string) {
  twistyPlayers.forEach(twistyPlayer => twistyPlayer.alg = alg);
}

export {
  defaultTwistyConfig,
  addTwistyPlayer,
  handleMoveEvent,
  handleFaceletsEvent,
  uninitializeState,
  setCubeState
}
