import { useState } from "react";
import { useHome, Appliance } from "@/context/HomeContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LightbulbIcon, FanIcon, AirVentIcon, Plug2Icon, DoorOpenIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import ProgressBar from "@/components/ProgressBar";
import DropdownSelect from "@/components/DropdownSelect";
import { v4 as uuidv4 } from "uuid";

// Appliance options with icons
const applianceOptions = [
  { value: "Light", label: "Light", icon: LightbulbIcon },
  { value: "Fan", label: "Fan", icon: FanIcon },
  { value: "Air Conditioner", label: "Air Conditioner", icon: AirVentIcon },
  { value: "Outlet", label: "Outlet", icon: Plug2Icon },
  { value: "Door Sensor", label: "Door Sensor", icon: DoorOpenIcon },
  { value: "Custom", label: "Custom Device", icon: Plug2Icon },
];

const SurveyStep3 = () => {
  const { rooms, updateRoom, prevStep, setSurveyCompleted } = useHome();
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [selectedAppliances, setSelectedAppliances] = useState<Array<{type: string, name: string, count: number}>>([]);
  const [customDeviceName, setCustomDeviceName] = useState("");
  const [customDeviceType, setCustomDeviceType] = useState("");
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [hasDoorSensor, setHasDoorSensor] = useState(false);
  const [error, setError] = useState("");

  const currentRoom = rooms[currentRoomIndex];

  // When component mounts, initialize with existing appliances if any
  useState(() => {
    if (currentRoom?.appliances?.length > 0) {
      // Group appliances by type and count them
      const applianceGroups: Record<string, {count: number, names: string[]}> = {};
      
      currentRoom.appliances.forEach(appliance => {
        if (!applianceGroups[appliance.type]) {
          applianceGroups[appliance.type] = { count: 0, names: [] };
        }
        applianceGroups[appliance.type].count++;
        applianceGroups[appliance.type].names.push(appliance.name);
      });
      
      // Convert to the format needed for selectedAppliances
      const applianceList = Object.entries(applianceGroups).map(([type, data]) => ({
        type,
        name: data.names[0], // Just use the first name for display
        count: data.count
      }));
      
      setSelectedAppliances(applianceList);
      
      // Check if this room has a door sensor
      setHasDoorSensor(currentRoom.hasDoorSensor || false);
    } else {
      setSelectedAppliances([]);
      setHasDoorSensor(false);
    }
  });

  const handleApplianceChange = (values: string | string[]) => {
    const applianceTypes = values as string[];
    
    // Get existing appliances that are already in selectedAppliances
    const existingAppliances = selectedAppliances.filter(
      app => applianceTypes.includes(app.type)
    );
    
    // Find new appliance types
    const newApplianceTypes = applianceTypes.filter(
      type => !existingAppliances.some(app => app.type === type)
    );
    
    // Create new appliance entries for the new types
    const newAppliances = newApplianceTypes.map(type => ({
      type,
      name: type === "Custom" ? "Custom Device" : type,
      count: 1
    }));
    
    // Update selected appliances
    setSelectedAppliances([...existingAppliances, ...newAppliances]);
    
    // If Custom is selected, show custom form
    if (newApplianceTypes.includes("Custom")) {
      setShowCustomForm(true);
    } else if (!applianceTypes.includes("Custom")) {
      setShowCustomForm(false);
    }
    
    // Check for Door Sensor
    if (applianceTypes.includes("Door Sensor")) {
      setHasDoorSensor(true);
    } else {
      setHasDoorSensor(false);
    }
    
    setError("");
  };
  
  const handleAddCustomDevice = () => {
    if (!customDeviceType.trim()) {
      setError("Please enter a device type");
      return;
    }
    
    // Add the custom device to selected appliances
    setSelectedAppliances(prev => [
      ...prev.filter(app => app.type !== "Custom"), // Remove the placeholder
      { type: customDeviceType, name: customDeviceType, count: 1 }
    ]);
    
    // Reset custom device form
    setCustomDeviceType("");
    setCustomDeviceName("");
    setShowCustomForm(false);
    toast({
      title: "Custom device added",
      description: `${customDeviceType} has been added to ${currentRoom.name}`
    });
  };
  
  const handleChangeCount = (index: number, change: number) => {
    const newAppliances = [...selectedAppliances];
    newAppliances[index].count = Math.max(1, newAppliances[index].count + change);
    setSelectedAppliances(newAppliances);
  };

  const saveAppliancesToRoom = () => {
    if (selectedAppliances.length === 0 && !hasDoorSensor) {
      setError("Please select at least one appliance");
      return false;
    }

    // Generate appliance objects from selections
    let applianceObjects: Appliance[] = [];
    
    selectedAppliances.forEach(selection => {
      if (selection.type === "Door Sensor") return; // Handle door sensor separately
      
      // Find any existing appliances of this type
      const existingAppliances = currentRoom.appliances.filter(a => a.type === selection.type);
      
      // Keep existing appliances up to the count
      for (let i = 0; i < Math.min(existingAppliances.length, selection.count); i++) {
        applianceObjects.push(existingAppliances[i]);
      }
      
      // Add new appliances if count increased
      for (let i = existingAppliances.length; i < selection.count; i++) {
        const newAppliance: Appliance = {
          id: uuidv4(),
          type: selection.type,
          name: `${selection.type} ${i + 1}`,
          isOn: false,
        };
        
        // Add specific properties based on type
        if (selection.type === 'Fan') {
          newAppliance.intensity = 1;
        } else if (selection.type === 'Air Conditioner') {
          newAppliance.temperature = 72;
        }
        
        applianceObjects.push(newAppliance);
      }
    });
    
    // Update room with new appliances and door status
    updateRoom(currentRoom.id, { 
      appliances: applianceObjects,
      hasDoorSensor: hasDoorSensor,
      doorOpen: hasDoorSensor ? false : undefined,
      temperature: Math.floor(Math.random() * 10) + 68, // Random temperature between 68-78°F
      energyUsage: Math.floor(Math.random() * 50) + 10, // Random energy usage between 10-60 units
    });
    
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
        // Group appliances by type and count them
        const applianceGroups: Record<string, {count: number, names: string[]}> = {};
        
        nextRoom.appliances.forEach(appliance => {
          if (!applianceGroups[appliance.type]) {
            applianceGroups[appliance.type] = { count: 0, names: [] };
          }
          applianceGroups[appliance.type].count++;
          applianceGroups[appliance.type].names.push(appliance.name);
        });
        
        // Convert to the format needed for selectedAppliances
        const applianceList = Object.entries(applianceGroups).map(([type, data]) => ({
          type,
          name: data.names[0], // Just use the first name for display
          count: data.count
        }));
        
        setSelectedAppliances(applianceList);
        setHasDoorSensor(nextRoom.hasDoorSensor || false);
      } else {
        setSelectedAppliances([]);
        setHasDoorSensor(false);
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
      
      if (prevRoom.appliances.length > 0) {
        // Group appliances by type and count them
        const applianceGroups: Record<string, {count: number, names: string[]}> = {};
        
        prevRoom.appliances.forEach(appliance => {
          if (!applianceGroups[appliance.type]) {
            applianceGroups[appliance.type] = { count: 0, names: [] };
          }
          applianceGroups[appliance.type].count++;
          applianceGroups[appliance.type].names.push(appliance.name);
        });
        
        // Convert to the format needed for selectedAppliances
        const applianceList = Object.entries(applianceGroups).map(([type, data]) => ({
          type,
          name: data.names[0],
          count: data.count
        }));
        
        setSelectedAppliances(applianceList);
        setHasDoorSensor(prevRoom.hasDoorSensor || false);
      } else {
        setSelectedAppliances([]);
        setHasDoorSensor(false);
      }
    }
  };

  // Get appliance types for dropdown
  const applTypeValues = applianceOptions.map(opt => opt.value);

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
                value={selectedAppliances.map(a => a.type)}
                onChange={handleApplianceChange}
                placeholder="Select appliances"
                multiple={true}
              />
              {error && (
                <p className="text-xs text-destructive mt-1">{error}</p>
              )}
            </div>
            
            {selectedAppliances.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Selected Appliances</h3>
                {selectedAppliances.map((appliance, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-secondary rounded-lg">
                    <span className="text-sm">{appliance.type}</span>
                    {appliance.type !== "Door Sensor" && (
                      <div className="flex items-center space-x-2">
                        <button 
                          type="button"
                          className="w-6 h-6 rounded-full bg-background text-foreground flex items-center justify-center"
                          onClick={() => handleChangeCount(index, -1)}
                        >
                          -
                        </button>
                        <span className="text-sm w-4 text-center">{appliance.count}</span>
                        <button
                          type="button"
                          className="w-6 h-6 rounded-full bg-background text-foreground flex items-center justify-center"
                          onClick={() => handleChangeCount(index, 1)}
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {showCustomForm && (
              <div className="space-y-3 p-3 bg-accent rounded-lg">
                <h3 className="text-sm font-medium">Add Custom Device</h3>
                <div className="space-y-2">
                  <label className="text-xs block">
                    Device Type
                  </label>
                  <Input
                    value={customDeviceType}
                    onChange={(e) => setCustomDeviceType(e.target.value)}
                    placeholder="e.g., Air Purifier"
                  />
                </div>
                <Button 
                  type="button"
                  size="sm"
                  onClick={handleAddCustomDevice}
                  className="w-full"
                >
                  Add Device
                </Button>
              </div>
            )}
            
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
