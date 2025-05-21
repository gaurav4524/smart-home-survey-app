
import { useState } from "react";
import { useHome, Appliance } from "@/context/HomeContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LightbulbIcon, FanIcon, AirVentIcon, Plug2Icon } from "lucide-react";
import ProgressBar from "@/components/ProgressBar";
import DropdownSelect from "@/components/DropdownSelect";
import { v4 as uuidv4 } from "uuid";

// Appliance options with icons
const applianceOptions = [
  { value: "Light", label: "Light", icon: LightbulbIcon },
  { value: "Fan", label: "Fan", icon: FanIcon },
  { value: "Air Conditioner", label: "Air Conditioner", icon: AirVentIcon },
  { value: "Outlet", label: "Outlet", icon: Plug2Icon },
];

const SurveyStep3 = () => {
  const { rooms, updateRoom, prevStep, setSurveyCompleted } = useHome();
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [selectedAppliances, setSelectedAppliances] = useState<string[]>([]);
  const [error, setError] = useState("");

  const currentRoom = rooms[currentRoomIndex];

  // When component mounts, initialize with existing appliances if any
  useState(() => {
    if (currentRoom?.appliances?.length > 0) {
      setSelectedAppliances(
        currentRoom.appliances.map(appliance => appliance.type)
      );
    }
  });

  const handleApplianceChange = (values: string | string[]) => {
    setSelectedAppliances(values as string[]);
    setError("");
  };

  const saveAppliancesToRoom = () => {
    if (selectedAppliances.length === 0) {
      setError("Please select at least one appliance");
      return false;
    }

    // Convert selected appliances to actual appliance objects
    const applianceObjects: Appliance[] = selectedAppliances.map(type => {
      // Find if there's an existing appliance of this type
      const existingAppliance = currentRoom.appliances.find(a => a.type === type);
      
      if (existingAppliance) {
        return existingAppliance;
      }
      
      // Create new appliance with defaults based on type
      const newAppliance: Appliance = {
        id: uuidv4(),
        type: type as Appliance['type'],
        isOn: false,
      };
      
      // Add specific properties based on type
      if (type === 'Fan') {
        newAppliance.intensity = 1;
      } else if (type === 'Air Conditioner') {
        newAppliance.temperature = 72;
      }
      
      return newAppliance;
    });
    
    // Update room with new appliances
    updateRoom(currentRoom.id, { appliances: applianceObjects });
    return true;
  };

  const handleNext = () => {
    if (!saveAppliancesToRoom()) return;
    
    if (currentRoomIndex < rooms.length - 1) {
      // Move to the next room
      setCurrentRoomIndex(currentRoomIndex + 1);
      
      // Initialize selected appliances for the next room
      const nextRoom = rooms[currentRoomIndex + 1];
      if (nextRoom.appliances.length > 0) {
        setSelectedAppliances(nextRoom.appliances.map(a => a.type));
      } else {
        setSelectedAppliances([]);
      }
    } else {
      // Final step completed
      setSurveyCompleted(true);
    }
  };

  const handleBack = () => {
    if (currentRoomIndex === 0) {
      prevStep();
    } else {
      saveAppliancesToRoom();
      setCurrentRoomIndex(currentRoomIndex - 1);
      
      // Set selected appliances for the previous room
      const prevRoom = rooms[currentRoomIndex - 1];
      setSelectedAppliances(prevRoom.appliances.map(a => a.type));
    }
  };

  // Display options with icons
  const optionsWithIcons = applianceOptions.map(option => ({
    value: option.value,
    label: (
      <div className="flex items-center">
        <option.icon className="w-4 h-4 mr-2" />
        <span>{option.label}</span>
      </div>
    )
  }));

  return (
    <div className="container max-w-md mx-auto py-8 px-4 page-transition">
      <h1 className="text-2xl font-bold text-center mb-2">Appliance Setup</h1>
      <p className="text-center text-muted-foreground mb-6">
        Select appliances for each room
      </p>
      
      <ProgressBar currentStep={3} totalSteps={3} />
      
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-medium mb-1">{currentRoom?.name}</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Room {currentRoomIndex + 1} of {rooms.length}
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm block mb-2">
                What appliances are in this room?
              </label>
              <DropdownSelect
                options={applianceOptions}
                value={selectedAppliances}
                onChange={handleApplianceChange}
                placeholder="Select appliances"
                multiple={true}
              />
              {error && (
                <p className="text-xs text-destructive mt-1">{error}</p>
              )}
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button 
                onClick={handleBack} 
                variant="outline"
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={handleNext} 
                className="flex-1 bg-smart-primary hover:bg-smart-secondary"
              >
                {currentRoomIndex < rooms.length - 1 ? "Next Room" : "Finish Setup"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SurveyStep3;
