
import { useState } from "react";
import { useHome } from "@/context/HomeContext";
import { Button } from "@/components/ui/button";
import RoomCard from "@/components/RoomCard";

const HomeScreen = () => {
  const { rooms, resetSurvey } = useHome();
  const [searchTerm, setSearchTerm] = useState("");
  
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

  return (
    <div className="container max-w-4xl mx-auto py-6 px-4">
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
        
        <div className="mt-4 p-4 bg-smart-light rounded-lg">
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
          <input
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
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">
            {searchTerm ? "No rooms match your search" : "No rooms found"}
          </p>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
