import { useEffect, useState } from 'react';
import { GanCubeConnection, GanCubeEvent } from 'gan-web-bluetooth';
import { shuffle } from './utils/array.ts';
import * as twistyPlayer from './twisty-player';
import algs from './data/algs.json'

import Cube from './components/Cube';
import ConnectButton from './components/ConnectButton';
import ResetStateButton from './components/ResetStateButton';
import DeviceProperties from './components/DeviceProperties.tsx';

export type CubeProperties = {
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
  const [showDeviceProperties, setShowDeviceProperties] = useState(false);
  const [algIndex, setAlgIndex] = useState(-1);
  const [isTraining, setIsTraining] = useState(false);

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
      twistyPlayer.handleMoveEvent(event);
    } 
    else if (event.type == 'FACELETS') {
      twistyPlayer.handleFaceletsEvent(event);
    } 
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
      twistyPlayer.setCubeState('');
      setCubeProperties({});
      twistyPlayer.uninitializeState();
    }
  }

  function startTraining() {
    twistyPlayer.addCubeSolvedCallback(applyNextAlgorithm, 400);
    shuffle(algs);
    applyNextAlgorithm();
    setIsTraining(true);
  }

  function applyNextAlgorithm() {
    setAlgIndex(prevIndex => {
      let nextIndex = prevIndex + 1;
      
      if (nextIndex === algs.length) {
        nextIndex = 0;
        shuffle(algs);
      }

      twistyPlayer.applyAlgorithm(algs[nextIndex]);
  
      return nextIndex;
    });
  }

  useEffect(() => {
    document.addEventListener('keydown', e => {
      if (e.key === ' ') {
        e.preventDefault();
        twistyPlayer.reapplyAlgorithm();
      }
    });
  }, []);

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <div className="flex my-10 text-3xl font-semibold">
        {algIndex + 1}/{algs.length}
      </div>

      <div className="flex justify-center">
        <Cube customTwistyConfig={{ cameraLongitude: -20 }} />
        <Cube />
      </div>

      <button className="border-solid border-2 px-2 py-1 w-60 mt-10 disabled:bg-gray-200" onClick={startTraining} disabled={isTraining}>
        Train
      </button>
      
      <div className="grid grid-rows-3 gap-4 w-60 mt-10">
        <ConnectButton connection={connection} updateConnection={updateConnection} handleCubeEvent={handleCubeEvent}/>
        <ResetStateButton connection={connection}/>
        <button 
          className="border-solid border-2 px-2 py-1 disabled:bg-gray-200" 
          onClick={() => setShowDeviceProperties(prev => !prev)} 
        >
          Device Properties
        </button>
      </div>

      {showDeviceProperties && <DeviceProperties {...cubeProperties} />}
    </div>
  );
}

export default App;