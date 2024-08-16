import { useState } from 'react';
import { connectGanCube, GanCubeConnection, GanCubeEvent, MacAddressProvider } from 'gan-web-bluetooth';

type ConnectButtonProps = {
  connection: GanCubeConnection | null;
  updateConnection: (newConnection: GanCubeConnection | null) => void;
  handleCubeEvent: (event: GanCubeEvent) => void;
}

function ConnectButton({ connection, updateConnection, handleCubeEvent }: ConnectButtonProps) {
  const [buttonText, setButtonText] = useState('Connect');

  const customMacAddressProvider: MacAddressProvider = async (device, isFallbackCall): Promise<string | null> => {
    if (isFallbackCall) {
      return prompt('Unable to determine cube MAC address.\n\nEnter MAC address:');
    } 
    else {
      return typeof device.watchAdvertisements == 'function' ? null :
        prompt('chrome://flags/#enable-experimental-web-platform-features\n\n' +
          'Enter MAC address:', 
          'F8:F6:FA:B2:58:65');
    }
  };

  async function connectSmartCube() {
    if (connection) {
      connection.disconnect();
      updateConnection(null);
      setButtonText('Connect');
    } 
    else {
      let newConnection = await connectGanCube(customMacAddressProvider);
      newConnection.events$.subscribe(handleCubeEvent);
      await newConnection.sendCubeCommand({ type: 'REQUEST_HARDWARE' });
      await newConnection.sendCubeCommand({ type: 'REQUEST_BATTERY' });
      await newConnection.sendCubeCommand({ type: 'REQUEST_FACELETS' });
      updateConnection(newConnection);
      setButtonText('Disconnect');
    }
  }

  return (
    <button className="border-solid border-2 px-2 py-1" onClick={connectSmartCube}>
      {buttonText}
    </button>
  )
}

export default ConnectButton;