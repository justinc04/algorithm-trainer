import { useState } from 'react';
import { GanCubeConnection, GanCubeEvent } from 'gan-web-bluetooth';
import { twistyPlayer } from './globals';

import Cube from './components/Cube';
import ConnectButton from './components/ConnectButton';
import DeviceProperty from './components/DeviceProperty';
import ResetStateButton from './components/ResetStateButton';

type CubeProperties = {
  deviceName?: string;
  deviceMAC?: string;
  hardwareName?: string;
  hardwareVersion?: string;
  softwareVersion?: string;
  gyroSupported?: string;
  battery?: string;
}

function App() {
  const [connection, setConnection] = useState<GanCubeConnection | null>(null);
  const [cubeProperties, setCubeProperties] = useState<CubeProperties>();

  function updateConnection(newConnection: GanCubeConnection | null) {
    setConnection(newConnection);
    updateCubeProperties({ 
      deviceName: newConnection?.deviceName, 
      deviceMAC: newConnection?.deviceMAC
    });
  }

  function updateCubeProperties(newProperties: CubeProperties) {
    setCubeProperties(properties => ({
      ...properties,
      ...newProperties
    }));
  }

  function handleCubeEvent(event: GanCubeEvent) {
    if (event.type == 'MOVE') {
      twistyPlayer.experimentalAddMove(event.move, { cancel: false });
    } 
    // else if (event.type == 'FACELETS') {
    //   handleFaceletsEvent(event);
    // } 
    else if (event.type == 'HARDWARE') {
      updateCubeProperties({
        hardwareName: event.hardwareName,
        hardwareVersion: event.hardwareVersion,
        softwareVersion: event.softwareVersion,
        gyroSupported: event.gyroSupported ? 'Yes' : 'No'
      });
    }  
    else if (event.type == 'BATTERY') {
      updateCubeProperties({
        battery: `${event.batteryLevel}%`
      });
    } 
    else if (event.type == 'DISCONNECT') {
      twistyPlayer.alg = '';
      setCubeProperties({});
    }
  }

  return (
    <>
      <Cube />

      <div className="grid grid-flow-row-dense grid-cols-3 gap-4 w-[30rem] mx-auto mt-10">
        <DeviceProperty label="Device Name" value={cubeProperties?.deviceName || ''} />
        <DeviceProperty label="Device MAC" value={cubeProperties?.deviceMAC || ''} />
        <DeviceProperty label="Hardware Name" value={cubeProperties?.hardwareName || ''} />
        <DeviceProperty label="Hardware Version" value={cubeProperties?.hardwareVersion || ''} />
        <DeviceProperty label="Software Version" value={cubeProperties?.softwareVersion || ''} />
        <DeviceProperty label="Gyro Supported" value={cubeProperties?.gyroSupported || ''} />
        <DeviceProperty label="Battery" value={cubeProperties?.battery || ''} />
      </div>

      <div className="grid grid-cols-2 mx-auto gap-4 w-[30rem] mt-10">
        <ConnectButton connection={connection} updateConnection={updateConnection} handleCubeEvent={handleCubeEvent}/>
        <ResetStateButton connection={connection}/>
      </div>
    </>
  );
}

export default App;