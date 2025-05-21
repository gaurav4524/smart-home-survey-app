
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useHome, Room } from "@/context/HomeContext";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, ThermometerIcon, ZapIcon, DoorOpenIcon, DoorClosedIcon } from "lucide-react";
import { ApplianceControl } from "@/components/ApplianceButtons";
import { toast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

const RoomDetailScreen = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { rooms, toggleAppliance, updateAppliance } = useHome();
  const navigate = useNavigate();
  
  // Find the current room
  const room = rooms.find(r => r.id === roomId) as Room | undefined;
  
  useEffect(() => {
    // Redirect to home if room not found
    if (!room && roomId) {
      toast({
        title: "Room not found",
        description: "The requested room could not be found.",
        variant: "destructive"
      });
      navigate('/');
    }
  }, [room, roomId, navigate]);
  
  if (!room) {
    return <div className="p-8 text-center">Loading...</div>;
  }
  
  // Group appliances by type
  const groupedAppliances: Record<string, typeof room.appliances> = {};
  room.appliances.forEach(appliance => {
    if (!groupedAppliances[appliance.type]) {
      groupedAppliances[appliance.type] = [];
    }
    groupedAppliances[appliance.type].push(appliance);
  });
  
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
  
  // Function to toggle door status
  const toggleDoorStatus = () => {
    if (room.hasDoorSensor) {
      updateAppliance(room.id, room.id, { 
        doorOpen: !room.doorOpen 
      });
      
      toast({
        title: room.doorOpen ? "Door closed" : "Door opened",
        description: `The door in ${room.name} has been ${room.doorOpen ? "closed" : "opened"}.`
      });
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      } 
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="container max-w-md mx-auto py-6 px-4">
      <div className="flex items-center mb-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/')}
          className="mr-2"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">{room.name}</h1>
      </div>
      
      <motion.div 
        className="grid grid-cols-2 gap-4 mb-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Room temperature card */}
        <motion.div 
          className="bg-gradient-to-br from-blue-100 to-blue-50 p-4 rounded-xl shadow-sm"
          variants={itemVariants}
        >
          <div className="flex items-center">
            <ThermometerIcon className="h-8 w-8 text-blue-500 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-blue-700">Temperature</h3>
              <p className="text-2xl font-bold">{room.temperature || 72}°F</p>
            </div>
          </div>
        </motion.div>
        
        {/* Energy usage card */}
        <motion.div 
          className="bg-gradient-to-br from-yellow-100 to-yellow-50 p-4 rounded-xl shadow-sm"
          variants={itemVariants}
        >
          <div className="flex items-center">
            <ZapIcon className="h-8 w-8 text-yellow-500 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-yellow-700">Energy Usage</h3>
              <p className="text-2xl font-bold">{room.energyUsage || 0} <span className="text-sm">units</span></p>
            </div>
          </div>
        </motion.div>
        
        {/* Door status (if applicable) */}
        {room.hasDoorSensor && (
          <motion.div 
            className="col-span-2 bg-gradient-to-br from-purple-100 to-purple-50 p-4 rounded-xl shadow-sm"
            variants={itemVariants}
            onClick={toggleDoorStatus}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center">
                {room.doorOpen ? 
                  <DoorOpenIcon className="h-8 w-8 text-purple-500 mr-2" /> : 
                  <DoorClosedIcon className="h-8 w-8 text-purple-500 mr-2" />
                }
                <div>
                  <h3 className="text-sm font-medium text-purple-700">Door Status</h3>
                  <p className="text-lg font-bold">{room.doorOpen ? "Open" : "Closed"}</p>
                </div>
              </div>
              <div className="bg-white rounded-full px-3 py-1 text-xs text-purple-700">
                Tap to toggle
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
      
      <h2 className="text-xl font-bold mb-4">Appliances</h2>
      
      {/* Appliance controls by type */}
      <motion.div 
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {Object.entries(groupedAppliances).map(([type, appliances]) => (
          <motion.div key={type} variants={itemVariants}>
            <h3 className="text-lg font-medium mb-3">{type}s</h3>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className="grid grid-cols-3 gap-6">
                {appliances.map((appliance) => (
                  <div key={appliance.id} className="flex flex-col items-center">
                    <ApplianceControl
                      appliance={appliance}
                      onToggle={() => handleToggle(appliance.id)}
                      onIntensityChange={(value) => handleIntensityChange(appliance.id, value)}
                      onTemperatureChange={(value) => handleTemperatureChange(appliance.id, value)}
                    />
                    <p className="text-xs mt-2 text-center">
                      {appliance.name}
                      <span className="block text-muted-foreground">
                        {appliance.isOn ? "On" : "Off"}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
        
        {Object.keys(groupedAppliances).length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No appliances in this room</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default RoomDetailScreen;
