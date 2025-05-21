
import { useHome } from "@/context/HomeContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  HomeIcon, 
  SliderIcon, 
  LineChartIcon, 
  UserIcon, 
  SettingsIcon, 
  HelpCircleIcon,
  BellIcon,
  LogOutIcon
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";

const ProfileScreen = () => {
  const { resetSurvey } = useHome();
  const navigate = useNavigate();
  
  const handleResetHome = () => {
    if (confirm("Are you sure you want to reset your home? This action cannot be undone.")) {
      resetSurvey();
      navigate('/');
    }
  };
  
  return (
    <div className="container max-w-md mx-auto py-6 px-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </header>
      
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-gradient-to-br from-smart-primary to-smart-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold">
              U
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-bold">User</h2>
              <p className="text-sm text-muted-foreground">user@example.com</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <h2 className="text-lg font-medium mb-3">Settings</h2>
      <div className="space-y-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BellIcon className="h-5 w-5 text-smart-primary" />
                <span>Notifications</span>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SettingsIcon className="h-5 w-5 text-smart-primary" />
                <span>Dark Mode</span>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-lg font-medium mt-6 mb-3">Support</h2>
      <div className="space-y-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <HelpCircleIcon className="h-5 w-5 text-smart-primary" />
              <span>Help & Support</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <LogOutIcon className="h-5 w-5 text-destructive" />
              <span className="text-destructive">Sign Out</span>
            </div>
          </CardContent>
        </Card>
        
        <Button 
          variant="outline"
          className="w-full text-destructive border-destructive"
          onClick={handleResetHome}
        >
          Reset Home Setup
        </Button>
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
          <SliderIcon className="h-5 w-5 mb-1" />
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
          className="flex-col h-auto py-2 text-smart-primary"
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

export default ProfileScreen;
