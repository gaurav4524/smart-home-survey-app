import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useHome } from "@/context/HomeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RoomCard from "@/components/RoomCard";
import { CloudSunIcon, BedIcon, HomeIcon, UserIcon, SlidersIcon, LineChartIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const HomeScreen = () => {
  const { rooms, resetSurvey, toggleAllAppliances, toggleNightMode, isNightMode } = useHome();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState({ temp: 72, condition: "Sunny" });
  const navigate = useNavigate();
  
  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Simulate fetching weather data
  useEffect(() => {
    const conditions = ["Sunny", "Cloudy", "Rainy", "Clear", "Partly Cloudy"];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    const randomTemp = Math.floor(Math.random() * 30) + 60; // 60-90°F
    
    setWeather({
      temp: randomTemp,
      condition: randomCondition
    });
  }, []);
  
  // Filter rooms based on search term
  const filteredRooms = rooms.filter(room => 
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Count total devices and active devices
  const totalDevices = rooms.reduce(
    (total, room) => total + room.appliances.length, 
    0
  );
  
  const activeDevices = rooms.reduce(
    (total, room) => total + room.appliances.filter(a => a.isOn).length, 
    0
  );

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };
  
  const handleAllOff = () => {
    toggleAllAppliances(false);
    toast({
      title: "All appliances turned off",
      description: "All appliances have been turned off successfully."
    });
  };
  
  const handleNightMode = () => {
    toggleNightMode();
    toast({
      title: isNightMode ? "Night mode deactivated" : "Night mode activated",
      description: isNightMode 
        ? "Night mode has been turned off."
        : "Night mode has been activated. All non-essential appliances have been turned off."
    });
  };
  
  const handleRoomClick = (roomId: string) => {
    navigate(`/room/${roomId}`);
  };

  return (
    <div className={`container max-w-4xl mx-auto py-6 px-4 transition-colors duration-500 ${isNightMode ? "bg-gray-900 text-white" : ""}`}>
      <header className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">HomeControl</h1>
          <Button 
            variant="outline" 
            size="sm"
            onClick={resetSurvey}
          >
            Reset Home
          </Button>
        </div>
        
        {/* Weather and greeting section */}
        <div className="mt-4 p-6 bg-gradient-to-br from-smart-light to-white rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-smart-dark">{getGreeting()}</h2>
              <p className="text-sm text-muted-foreground">
                {currentTime.toLocaleDateString(undefined, { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="text-center">
              <CloudSunIcon size={32} className="text-smart-primary mx-auto mb-1" />
              <p className="text-lg font-medium">{weather.temp}°F</p>
              <p className="text-sm text-muted-foreground">{weather.condition}</p>
            </div>
          </div>
        </div>
        
        {/* Control buttons */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <Button 
            onClick={handleAllOff}
            className="bg-gray-700 hover:bg-gray-800 text-white py-4 rounded-xl shadow-sm"
          >
            Turn All Off
          </Button>
          <Button 
            onClick={handleNightMode}
            className={`py-4 rounded-xl shadow-sm ${isNightMode 
              ? "bg-orange-300 hover:bg-orange-400 text-gray-900" 
              : "bg-indigo-900 hover:bg-indigo-800 text-white"}`}
          >
            <BedIcon className="mr-2 h-5 w-5" />
            {isNightMode ? "Exit Night Mode" : "Night Mode"}
          </Button>
        </div>
        
        <div className="mt-6 p-4 bg-smart-light rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium">Home Summary</h2>
              <p className="text-sm text-muted-foreground">
                {rooms.length} {rooms.length === 1 ? 'room' : 'rooms'} • 
                {' '}{totalDevices} {totalDevices === 1 ? 'device' : 'devices'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-medium">{activeDevices} active</p>
              <p className="text-sm text-muted-foreground">
                {Math.round((activeDevices / totalDevices) * 100) || 0}% of devices on
              </p>
            </div>
          </div>
        </div>
      </header>
      
      <div className="mb-6">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search rooms..."
            className="w-full px-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              onClick={() => setSearchTerm("")}
            >
              ✕
            </button>
          )}
        </div>
      </div>
      
      {filteredRooms.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {filteredRooms.map(room => (
            <div key={room.id} onClick={() => handleRoomClick(room.id)} className="cursor-pointer">
              <RoomCard room={room} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">
            {searchTerm ? "No rooms match your search" : "No rooms found"}
          </p>
        </div>
      )}
      
      {/* Bottom navigation bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-2 flex justify-around">
        <Button variant="ghost" className="flex-col h-auto py-2">
          <HomeIcon className="h-5 w-5 mb-1" />
          <span className="text-xs">Home</span>
        </Button>
        <Button variant="ghost" className="flex-col h-auto py-2">
          <SlidersIcon className="h-5 w-5 mb-1" />
          <span className="text-xs">Scenes</span>
        </Button>
        <Button variant="ghost" className="flex-col h-auto py-2">
          <LineChartIcon className="h-5 w-5 mb-1" />
          <span className="text-xs">Monitor</span>
        </Button>
        <Button variant="ghost" className="flex-col h-auto py-2">
          <UserIcon className="h-5 w-5 mb-1" />
          <span className="text-xs">Profile</span>
        </Button>
      </div>
      
      {/* Add bottom padding to account for the navigation bar */}
      <div className="h-20"></div>
    </div>
  );
};

export default HomeScreen;
