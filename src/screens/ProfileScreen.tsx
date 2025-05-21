
import { useHome } from "@/context/HomeContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  HomeIcon, 
  SlidersIcon, 
  LineChartIcon, 
  UserIcon, 
  SettingsIcon, 
  HelpCircleIcon,
  BellIcon,
  LogOutIcon,
  Plug2Icon,
  MoonIcon
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";

const ProfileScreen = () => {
  const { resetSurvey } = useHome();
  const navigate = useNavigate();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [powerSavingEnabled, setPowerSavingEnabled] = useState(false);
  
  const handleResetHome = () => {
    if (confirm("Are you sure you want to reset your home? This action cannot be undone.")) {
      resetSurvey();
      navigate('/');
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
      <motion.header 
        className="mb-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </motion.header>
      
      <motion.div 
        className="mb-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-smart-primary to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  U
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-bold">User</h2>
                  <p className="text-sm text-muted-foreground">user@example.com</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-lg font-medium mb-3">Settings</h2>
        <div className="space-y-3">
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white">
                      <BellIcon className="h-5 w-5" />
                    </div>
                    <span className="font-medium">Notifications</span>
                  </div>
                  <Switch 
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                    className="data-[state=checked]:animate-pulse"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-400 to-blue-600 flex items-center justify-center text-white">
                      <MoonIcon className="h-5 w-5" />
                    </div>
                    <span className="font-medium">Dark Mode</span>
                  </div>
                  <Switch 
                    checked={darkModeEnabled}
                    onCheckedChange={setDarkModeEnabled}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white">
                      <Plug2Icon className="h-5 w-5" />
                    </div>
                    <span className="font-medium">Power Saving</span>
                  </div>
                  <Switch 
                    checked={powerSavingEnabled}
                    onCheckedChange={setPowerSavingEnabled}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
      
      <motion.div
        className="mt-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-lg font-medium mb-3">Support</h2>
        <div className="space-y-3">
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white">
                    <HelpCircleIcon className="h-5 w-5" />
                  </div>
                  <span className="font-medium">Help & Support</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center text-white">
                    <LogOutIcon className="h-5 w-5" />
                  </div>
                  <span className="font-medium text-rose-600">Sign Out</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              variant="outline"
              className="w-full text-destructive border-destructive mt-4 hover:bg-destructive/10"
              onClick={handleResetHome}
            >
              Reset Home Setup
            </Button>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Bottom navigation bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border p-2 flex justify-around">
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
