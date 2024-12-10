import DeviceProperty from './DeviceProperty';
import { CubeProperties } from '../App';

function DeviceProperties(cubeProperties: CubeProperties) {
    return (
      <div className="grid grid-flow-row-dense grid-cols-3 gap-4 w-[30rem] mx-auto mt-10">
        <DeviceProperty label="Device Name" value={cubeProperties?.deviceName || ''} />
        <DeviceProperty label="Device MAC" value={cubeProperties?.deviceMAC || ''} />
        <DeviceProperty label="Hardware Name" value={cubeProperties?.hardwareName || ''} />
        <DeviceProperty label="Hardware Version" value={cubeProperties?.hardwareVersion || ''} />
        <DeviceProperty label="Software Version" value={cubeProperties?.softwareVersion || ''} />
        <DeviceProperty label="Gyro Supported" value={cubeProperties?.gyroSupported || ''} />
        <DeviceProperty label="Battery" value={cubeProperties?.battery || ''} />
    </div>
    );
}

export default DeviceProperties;
