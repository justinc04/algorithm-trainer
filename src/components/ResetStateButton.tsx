import { GanCubeConnection } from 'gan-web-bluetooth';
import { twistyPlayer } from '../globals';

function ResetState({ connection }: { connection: GanCubeConnection | null}) {
  async function resetState() {
    await connection?.sendCubeCommand({ type: 'REQUEST_RESET' });
    twistyPlayer.alg = '';
  }

  return (
    <button className="border-solid border-2 px-2 py-1" onClick={resetState}>
      Reset State
    </button>
  )  
}

export default ResetState;