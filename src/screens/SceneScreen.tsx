import { useState } from "react";
import { useHome } from "@/context/HomeContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SlidersIcon, PlusIcon, HomeIcon, UserIcon, LineChartIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SceneScreen = () => {
  const { rooms } = useHome();
  const navigate = useNavigate();
  
  // For future implementation - these are placeholders
  const builtInScenes = [
    { id: "1", name: "Good Morning", icon: "☀️", color: "from-yellow-400 to-orange-300" },
    { id: "2", name: "Movie Time", icon: "🎬", color: "from-purple-400 to-indigo-400" },
    { id: "3", name: "Night Mode", icon: "🌙", color: "from-indigo-900 to-blue-900" },
    { id: "4", name: "Away Mode", icon: "🏠", color: "from-gray-400 to-gray-600" },
  ];
  
  const [customScenes, setCustomScenes] = useState<{id: string, name: string, icon: string, color: string}[]>([]);
  
  return (
    <div className="container max-w-md mx-auto py-6 px-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Scenes</h1>
        <p className="text-muted-foreground">Create and manage automated scenes</p>
      </header>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-lg font-medium mb-3">Built-in Scenes</h2>
          <div className="grid grid-cols-2 gap-3">
            {builtInScenes.map((scene) => (
              <Card key={scene.id} className={`cursor-pointer bg-gradient-to-br ${scene.color} text-white overflow-hidden`}>
                <CardContent className="flex items-center p-4">
                  <div className="text-2xl mr-2">{scene.icon}</div>
                  <h3 className="font-medium">{scene.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        
        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-medium">Custom Scenes</h2>
            <Button size="sm" variant="outline" className="flex items-center gap-1">
              <PlusIcon className="h-4 w-4" />
              <span>Create</span>
            </Button>
          </div>
          
          {customScenes.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {customScenes.map((scene) => (
                <Card key={scene.id}>
                  <CardContent className="p-4">
                    <div className="text-2xl mb-2">{scene.icon}</div>
                    <h3 className="font-medium">{scene.name}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <SlidersIcon className="h-10 w-10 text-muted-foreground mb-3" />
                <h3 className="font-medium mb-1">No Custom Scenes</h3>
                <p className="text-sm text-muted-foreground">
                  Create your own scenes to automate multiple devices at once
                </p>
                <Button className="mt-4" variant="outline">
                  Create Your First Scene
                </Button>
              </CardContent>
            </Card>
          )}
        </section>
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
          className="flex-col h-auto py-2 text-smart-primary"
        >
          <SlidersIcon className="h-5 w-5 mb-1" />
          <span className="text-xs">Scenes</span>
        </Button>
        <Button 
          variant="ghost" 
          className="flex-col h-auto py-2"
          onClick={() => navigate('/monitoring')}
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

export default SceneScreen;
