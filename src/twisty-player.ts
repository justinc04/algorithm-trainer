import { TwistyPlayer, TwistyPlayerConfig } from 'cubing/twisty';
import { experimentalSolve3x3x3IgnoringCenters } from 'cubing/search';
import { GanCubeMove, GanCubeEvent } from 'gan-web-bluetooth';
import { faceletsToPattern, patternToFacelets } from './utils/facelets.ts';
import { Alg } from 'cubing/alg';

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
let isCubeTurned = false;

function addTwistyPlayer(twistyPlayer: TwistyPlayer) {
  twistyPlayers.push(twistyPlayer);
}

function handleMoveEvent(event: GanCubeMove) {
  isCubeTurned = true;

  twistyPlayers.forEach(twistyPlayer => {
    twistyPlayer.experimentalAddMove(event.move, { cancel: false });
  });
}

let isCubeStateInitialized = false;

async function handleFaceletsEvent(event: GanCubeEvent) {
  // Only initialize state to hardware state once after connecting
  if (event.type == 'FACELETS' && !isCubeStateInitialized) {
    if (event.facelets != SOLVED_STATE) {
      const kpattern = faceletsToPattern(event.facelets);
      const solution = await experimentalSolve3x3x3IgnoringCenters(kpattern);
      const scramble = solution.invert().toString();
      setCubeState(scramble);
    } 
    else {
      setCubeState('');
    }

    isCubeStateInitialized = true;
  }
}

function uninitializeState() {
  isCubeStateInitialized = false;
}

function setCubeState(alg: string) {
  twistyPlayers.forEach(twistyPlayer => twistyPlayer.alg = alg);
}

function addCubeSolvedCallback(callback: () => void, delay: number) {
  isCubeTurned = false;

  twistyPlayers.forEach(twistyPlayer => {
    twistyPlayer.experimentalModel.currentPattern.addFreshListener(async (kpattern) => {
      const facelets = patternToFacelets(kpattern);
  
      if (facelets == SOLVED_STATE && isCubeTurned) {
        setTimeout(callback, delay);
        isCubeTurned = false;
      }
    });
  });
}

function applyAlgorithm(alg: string) {
  const preAuf = 'U '.repeat(Math.random() * 4);
  const postAuf = ' U'.repeat(Math.random() * 4);
  const scramble = preAuf + new Alg(alg).invert().toString() + postAuf;
  setCubeState(scramble);
}

export {
  defaultTwistyConfig,
  addTwistyPlayer,
  handleMoveEvent,
  handleFaceletsEvent,
  uninitializeState,
  setCubeState,
  addCubeSolvedCallback,
  applyAlgorithm
}
