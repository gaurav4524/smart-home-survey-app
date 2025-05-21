import { useHome } from "@/context/HomeContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { HomeIcon, SlidersIcon, LineChartIcon, UserIcon, ZapIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Dummy data for charts
const energyData = [
  { name: 'Mon', usage: 10 },
  { name: 'Tue', usage: 15 },
  { name: 'Wed', usage: 13 },
  { name: 'Thu', usage: 18 },
  { name: 'Fri', usage: 20 },
  { name: 'Sat', usage: 12 },
  { name: 'Sun', usage: 8 },
];

const temperatureData = [
  { name: 'Mon', temp: 72 },
  { name: 'Tue', temp: 74 },
  { name: 'Wed', temp: 73 },
  { name: 'Thu', temp: 71 },
  { name: 'Fri', temp: 70 },
  { name: 'Sat', temp: 69 },
  { name: 'Sun', temp: 72 },
];

const MonitorScreen = () => {
  const { rooms } = useHome();
  const navigate = useNavigate();
  
  // Calculate total energy usage
  const totalEnergy = rooms.reduce((sum, room) => sum + (room.energyUsage || 0), 0);
  
  // Calculate average temperature across rooms
  const totalTemperature = rooms.reduce((sum, room) => sum + (room.temperature || 0), 0);
  const avgTemperature = rooms.length ? (totalTemperature / rooms.length).toFixed(1) : "N/A";
  
  return (
    <div className="container max-w-md mx-auto py-6 px-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Monitoring</h1>
        <p className="text-muted-foreground">Track your home's energy usage</p>
      </header>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <ZapIcon className="h-5 w-5 text-yellow-500" />
              <h3 className="text-sm font-medium">Energy Usage</h3>
            </div>
            <p className="text-2xl font-bold">{totalEnergy} <span className="text-sm font-normal text-muted-foreground">units</span></p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <LineChartIcon className="h-5 w-5 text-blue-500" />
              <h3 className="text-sm font-medium">Avg. Temperature</h3>
            </div>
            <p className="text-2xl font-bold">{avgTemperature} <span className="text-sm font-normal text-muted-foreground">°F</span></p>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardContent className="p-4">
            <h3 className="text-md font-medium mb-4">Weekly Energy Usage</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={energyData}
                  margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="usage" stroke="#9b87f5" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h3 className="text-md font-medium mb-4">Temperature History</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={temperatureData}
                  margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="temp" stroke="#33C3F0" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Bottom navigation bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-2 flex justify-around">
        <Button 
          variant="ghost" 
          className="flex-col h-auto py-2"
          onClick={() => navigate('/')}
        >
          <HomeIcon className="h-5 w-5 mb-1" />
          <span className="text-xs">Home</span>
        </Button>
        <Button 
          variant="ghost" 
          className="flex-col h-auto py-2"
          onClick={() => navigate('/scenes')}
        >
          <SlidersIcon className="h-5 w-5 mb-1" />
          <span className="text-xs">Scenes</span>
        </Button>
        <Button 
          variant="ghost" 
          className="flex-col h-auto py-2 text-smart-primary"
        >
          <LineChartIcon className="h-5 w-5 mb-1" />
          <span className="text-xs">Monitor</span>
        </Button>
        <Button 
          variant="ghost" 
          className="flex-col h-auto py-2"
          onClick={() => navigate('/profile')}
        >
          <UserIcon className="h-5 w-5 mb-1" />
          <span className="text-xs">Profile</span>
        </Button>
      </div>
      
      {/* Add bottom padding to account for the navigation bar */}
      <div className="h-20"></div>
    </div>
  );
};

export default MonitorScreen;
