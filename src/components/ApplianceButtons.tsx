
import { LightbulbIcon, FanIcon, AirVentIcon, Plug2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Appliance } from "@/context/HomeContext";

// SwitchButton for lights
export const SwitchButton = ({ 
  appliance, 
  onToggle 
}: { 
  appliance: Appliance; 
  onToggle: () => void 
}) => {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300",
        appliance.isOn 
          ? "bg-yellow-400 text-yellow-900 shadow-lg shadow-yellow-200" 
          : "bg-gray-200 text-gray-400"
      )}
      aria-label={`Toggle ${appliance.isOn ? 'off' : 'on'}`}
    >
      <LightbulbIcon className={cn(
        "w-6 h-6 transition-all duration-300",
        appliance.isOn && "animate-pulse-slow"
      )} />
      {appliance.isOn && (
        <div className="absolute inset-0 rounded-full bg-yellow-400 opacity-30 animate-ping" />
      )}
    </button>
  );
};

// FanButton component
export const FanButton = ({ 
  appliance, 
  onToggle,
  onSpeedChange
}: { 
  appliance: Appliance; 
  onToggle: () => void;
  onSpeedChange?: (speed: number) => void;
}) => {
  const speed = appliance.intensity || 1;
  
  const handleSpeedClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSpeedChange && appliance.isOn) {
      const newSpeed = (speed % 3) + 1;
      onSpeedChange(newSpeed);
    }
  };
  
  return (
    <div className="flex flex-col items-center">
      <button
        onClick={onToggle}
        className={cn(
          "relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300",
          appliance.isOn 
            ? "bg-blue-400 text-blue-900 shadow-lg shadow-blue-200" 
            : "bg-gray-200 text-gray-400"
        )}
        aria-label={`Toggle ${appliance.isOn ? 'off' : 'on'}`}
      >
        <FanIcon className={cn(
          "w-6 h-6 transition-all",
          appliance.isOn && "animate-spin-slow",
          speed === 1 && "animate-[spin-slow_12s_linear_infinite]",
          speed === 2 && "animate-[spin-slow_8s_linear_infinite]",
          speed === 3 && "animate-[spin-slow_4s_linear_infinite]",
        )} />
      </button>
      
      {appliance.isOn && onSpeedChange && (
        <div 
          className="mt-2 px-2 py-1 text-xs bg-blue-100 rounded-full cursor-pointer text-blue-800"
          onClick={handleSpeedClick}
        >
          Speed: {speed}
        </div>
      )}
    </div>
  );
};

// AirConditionerButton component
export const AirConditionerButton = ({ 
  appliance, 
  onToggle,
  onTempChange
}: { 
  appliance: Appliance; 
  onToggle: () => void;
  onTempChange?: (temp: number) => void;
}) => {
  const temp = appliance.temperature || 72;
  
  const handleTempChange = (change: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onTempChange && appliance.isOn) {
      onTempChange(temp + change);
    }
  };
  
  return (
    <div className="flex flex-col items-center">
      <button
        onClick={onToggle}
        className={cn(
          "relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300",
          appliance.isOn 
            ? "bg-cyan-400 text-cyan-900 shadow-lg shadow-cyan-200" 
            : "bg-gray-200 text-gray-400"
        )}
        aria-label={`Toggle ${appliance.isOn ? 'off' : 'on'}`}
      >
        <AirVentIcon className="w-6 h-6" />
        {appliance.isOn && (
          <span className="absolute -bottom-1 -right-1 flex items-center justify-center w-6 h-6 text-[10px] font-bold bg-white rounded-full border-2 border-cyan-400">
            {temp}°
          </span>
        )}
      </button>
      
      {appliance.isOn && onTempChange && (
        <div className="mt-2 flex items-center space-x-1">
          <button 
            className="w-6 h-6 flex items-center justify-center bg-cyan-100 rounded-full text-cyan-800 text-xs"
            onClick={handleTempChange(-1)}
          >
            -
          </button>
          <span className="text-xs text-cyan-800">{temp}°</span>
          <button 
            className="w-6 h-6 flex items-center justify-center bg-cyan-100 rounded-full text-cyan-800 text-xs"
            onClick={handleTempChange(1)}
          >
            +
          </button>
        </div>
      )}
    </div>
  );
};

// OutletButton component
export const OutletButton = ({ 
  appliance, 
  onToggle 
}: { 
  appliance: Appliance; 
  onToggle: () => void 
}) => {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300",
        appliance.isOn 
          ? "bg-green-400 text-green-900 shadow-lg shadow-green-200" 
          : "bg-gray-200 text-gray-400"
      )}
      aria-label={`Toggle ${appliance.isOn ? 'off' : 'on'}`}
    >
      <Plug2Icon className="w-6 h-6" />
      {appliance.isOn && (
        <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full">
          <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
        </div>
      )}
    </button>
  );
};

// ApplianceControl combines all buttons
export const ApplianceControl = ({
  appliance,
  onToggle,
  onIntensityChange,
  onTemperatureChange
}: {
  appliance: Appliance;
  onToggle: () => void;
  onIntensityChange?: (value: number) => void;
  onTemperatureChange?: (value: number) => void;
}) => {
  switch (appliance.type) {
    case 'Light':
      return <SwitchButton appliance={appliance} onToggle={onToggle} />;
    case 'Fan':
      return (
        <FanButton 
          appliance={appliance} 
          onToggle={onToggle} 
          onSpeedChange={onIntensityChange} 
        />
      );
    case 'Air Conditioner':
      return (
        <AirConditionerButton 
          appliance={appliance} 
          onToggle={onToggle} 
          onTempChange={onTemperatureChange} 
        />
      );
    case 'Outlet':
      return <OutletButton appliance={appliance} onToggle={onToggle} />;
    default:
      return null;
  }
};
