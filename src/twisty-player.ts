import { TwistyPlayer, TwistyPlayerConfig } from 'cubing/twisty';
import { experimentalSolve3x3x3IgnoringCenters } from 'cubing/search';
import { Alg } from 'cubing/alg';
import { GanCubeMove, GanCubeEvent } from 'gan-web-bluetooth';
import { faceletsToPattern, patternToFacelets } from './utils/utils';
import algs from './data/algs.json'

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
  twistyPlayer.experimentalModel.currentPattern.addFreshListener(async (kpattern) => {
    const facelets = patternToFacelets(kpattern);

    if (facelets == SOLVED_STATE && isCubeTurned) {
      setTimeout(applyNextAlgorithm, 500);
      isCubeTurned = false;
    }
  });
  
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

let algIndex = 0;

function applyNextAlgorithm() {
  const preAuf = 'U '.repeat(Math.random() * 4);
  const postAuf = ' U'.repeat(Math.random() * 4);
  const scramble = preAuf + new Alg(algs[algIndex].alg).invert().toString() + postAuf;
  setCubeState(scramble);
  algIndex = (algIndex + 1) % algs.length;
}

export {
  defaultTwistyConfig,
  addTwistyPlayer,
  handleMoveEvent,
  handleFaceletsEvent,
  uninitializeState,
  setCubeState
}
