import { useId } from 'react';

type DevicePropertyProps = {
  label: string;
  value: string;
}

function DeviceProperty({ label, value }: DevicePropertyProps) {
  const inputId = useId();

  return (
    <>
      <label htmlFor={inputId} className="col-span-1 flex items-center justify-end">
        {label}
      </label>
      
      <input 
        id={inputId} 
        className="col-span-2 border-solid border-2 p-1" 
        type="text" 
        readOnly value={value}
      />
    </>
  );
}

export default DeviceProperty;