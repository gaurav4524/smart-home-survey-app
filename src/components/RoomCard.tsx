import { useState } from "react";
import { Appliance, Room, useHome } from "@/context/HomeContext";
import { ApplianceControl } from "./ApplianceButtons";
import { cn } from "@/lib/utils";
import { LightbulbIcon, FanIcon, AirVentIcon, Plug2Icon } from "lucide-react";

const RoomCard = ({ room }: { room: Room }) => {
  const { toggleAppliance, updateAppliance } = useHome();
  const [isExpanded, setIsExpanded] = useState(false);

  // Get summary of appliances
  const applianceCounts = room.appliances.reduce(
    (counts, appliance) => {
      counts[appliance.type] = (counts[appliance.type] || 0) + 1;
      return counts;
    },
    {} as Record<string, number>
  );
  
  // Count how many appliances are on
  const onCount = room.appliances.filter(a => a.isOn).length;
  
  // Function to handle appliance toggling
  const handleToggle = (applianceId: string) => {
    toggleAppliance(room.id, applianceId);
  };
  
  // Function to handle intensity change for fans
  const handleIntensityChange = (applianceId: string, intensity: number) => {
    updateAppliance(room.id, applianceId, { intensity });
  };
  
  // Function to handle temperature change for AC
  const handleTemperatureChange = (applianceId: string, temperature: number) => {
    updateAppliance(room.id, applianceId, { temperature });
  };
  
  // Group appliances by type
  const groupedAppliances: Record<string, Appliance[]> = {};
  room.appliances.forEach(appliance => {
    if (!groupedAppliances[appliance.type]) {
      groupedAppliances[appliance.type] = [];
    }
    groupedAppliances[appliance.type].push(appliance);
  });

  return (
    <div className={cn(
      "bg-card rounded-xl shadow-sm border overflow-hidden transition-all duration-300",
      isExpanded ? "shadow-md" : ""
    )}>
      {/* Room header */}
      <div
        className="p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">{room.name}</h3>
          <span className="text-sm text-muted-foreground">
            {onCount} of {room.appliances.length} on
          </span>
        </div>
        
        {/* Appliance summary */}
        <div className="flex gap-4 mt-3">
          {Object.entries(applianceCounts).map(([type, count]) => (
            <div key={type} className="flex items-center gap-1 text-sm text-muted-foreground">
              {type === 'Light' && <LightbulbIcon className="w-4 h-4" />}
              {type === 'Fan' && <FanIcon className="w-4 h-4" />}
              {type === 'Air Conditioner' && <AirVentIcon className="w-4 h-4" />}
              {type === 'Outlet' && <Plug2Icon className="w-4 h-4" />}
              {count}
            </div>
          ))}
        </div>
      </div>
      
      {/* Expanded section with controls */}
      {isExpanded && (
        <div className="p-4 pt-0 border-t border-border mt-2">
          {Object.entries(groupedAppliances).map(([type, appliances]) => (
            <div key={type} className="mb-4 last:mb-0">
              <h4 className="text-sm font-medium mb-2">{type}s</h4>
              <div className="flex flex-wrap gap-4">
                {appliances.map((appliance) => (
                  <div key={appliance.id} className="text-center">
                    <ApplianceControl
                      appliance={appliance}
                      onToggle={() => handleToggle(appliance.id)}
                      onIntensityChange={(value) => handleIntensityChange(appliance.id, value)}
                      onTemperatureChange={(value) => handleTemperatureChange(appliance.id, value)}
                    />
                    <p className="text-xs mt-1 text-muted-foreground">
                      {appliance.isOn ? "On" : "Off"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomCard;
