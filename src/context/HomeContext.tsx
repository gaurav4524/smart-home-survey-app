
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define types for our context
export type Appliance = {
  id: string;
  type: string;
  name: string;
  isOn: boolean;
  intensity?: number; // For fans and dimmable lights
  temperature?: number; // For air conditioners
};

export type Room = {
  id: string;
  name: string;
  appliances: Appliance[];
  temperature?: number; // Room temperature
  energyUsage?: number; // Energy usage in units
  hasDoorSensor?: boolean;
  doorOpen?: boolean; // Door status if sensor exists
};

type HomeContextType = {
  rooms: Room[];
  numRooms: number;
  currentStep: number;
  setNumRooms: (num: number) => void;
  setRooms: (rooms: Room[]) => void;
  addRoom: (room: Room) => void;
  updateRoom: (id: string, room: Partial<Room>) => void;
  addApplianceToRoom: (roomId: string, appliance: Appliance) => void;
  updateAppliance: (roomId: string, applianceId: string, updates: Partial<Appliance>) => void;
  toggleAppliance: (roomId: string, applianceId: string) => void;
  toggleAllAppliances: (isOn: boolean) => void;
  toggleNightMode: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  resetSurvey: () => void;
  surveyCompleted: boolean;
  setSurveyCompleted: (completed: boolean) => void;
  isNightMode: boolean;
};

// Create context with default values
const HomeContext = createContext<HomeContextType>({
  rooms: [],
  numRooms: 0,
  currentStep: 1,
  setNumRooms: () => {},
  setRooms: () => {},
  addRoom: () => {},
  updateRoom: () => {},
  addApplianceToRoom: () => {},
  updateAppliance: () => {},
  toggleAppliance: () => {},
  toggleAllAppliances: () => {},
  toggleNightMode: () => {},
  nextStep: () => {},
  prevStep: () => {},
  goToStep: () => {},
  resetSurvey: () => {},
  surveyCompleted: false,
  setSurveyCompleted: () => {},
  isNightMode: false,
});

// Create provider component
export const HomeProvider = ({ children }: { children: ReactNode }) => {
  // Get stored data from localStorage if available
  const storedData = localStorage.getItem('homeData');
  const initialData = storedData ? JSON.parse(storedData) : null;

  const [rooms, setRooms] = useState<Room[]>(initialData?.rooms || []);
  const [numRooms, setNumRooms] = useState<number>(initialData?.numRooms || 0);
  const [currentStep, setCurrentStep] = useState<number>(initialData?.currentStep || 1);
  const [surveyCompleted, setSurveyCompleted] = useState<boolean>(initialData?.surveyCompleted || false);
  const [isNightMode, setIsNightMode] = useState<boolean>(initialData?.isNightMode || false);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('homeData', JSON.stringify({ 
      rooms, 
      numRooms, 
      currentStep,
      surveyCompleted,
      isNightMode
    }));
  }, [rooms, numRooms, currentStep, surveyCompleted, isNightMode]);

  // Add a new room
  const addRoom = (room: Room) => {
    setRooms((prevRooms) => [...prevRooms, room]);
  };

  // Update an existing room
  const updateRoom = (id: string, updates: Partial<Room>) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) => (room.id === id ? { ...room, ...updates } : room))
    );
  };

  // Add an appliance to a room
  const addApplianceToRoom = (roomId: string, appliance: Appliance) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === roomId
          ? {
              ...room,
              appliances: [...room.appliances, appliance],
            }
          : room
      )
    );
  };

  // Update an appliance
  const updateAppliance = (roomId: string, applianceId: string, updates: Partial<Appliance>) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === roomId
          ? {
              ...room,
              appliances: room.appliances.map((appliance) =>
                appliance.id === applianceId ? { ...appliance, ...updates } : appliance
              ),
            }
          : room
      )
    );
  };

  // Toggle an appliance's on/off state
  const toggleAppliance = (roomId: string, applianceId: string) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === roomId
          ? {
              ...room,
              appliances: room.appliances.map((appliance) =>
                appliance.id === applianceId 
                  ? { ...appliance, isOn: !appliance.isOn } 
                  : appliance
              ),
            }
          : room
      )
    );
  };

  // Toggle all appliances on/off
  const toggleAllAppliances = (isOn: boolean) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) => ({
        ...room,
        appliances: room.appliances.map((appliance) => ({
          ...appliance,
          isOn: isOn
        }))
      }))
    );
  };

  // Toggle night mode
  const toggleNightMode = () => {
    setIsNightMode((prev) => !prev);
    // When night mode is activated, turn off all appliances except essential ones
    if (!isNightMode) {
      setRooms((prevRooms) =>
        prevRooms.map((room) => ({
          ...room,
          appliances: room.appliances.map((appliance) => ({
            ...appliance,
            isOn: appliance.type.includes('Night Light') ? true : false
          }))
        }))
      );
    }
  };

  // Navigation functions for the survey
  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => Math.max(1, prev - 1));
  const goToStep = (step: number) => setCurrentStep(step);

  // Reset the survey
  const resetSurvey = () => {
    setRooms([]);
    setNumRooms(0);
    setCurrentStep(1);
    setSurveyCompleted(false);
    setIsNightMode(false);
  };

  return (
    <HomeContext.Provider
      value={{
        rooms,
        numRooms,
        currentStep,
        setNumRooms,
        setRooms,
        addRoom,
        updateRoom,
        addApplianceToRoom,
        updateAppliance,
        toggleAppliance,
        toggleAllAppliances,
        toggleNightMode,
        nextStep,
        prevStep,
        goToStep,
        resetSurvey,
        surveyCompleted,
        setSurveyCompleted,
        isNightMode,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};

// Custom hook to use the context
export const useHome = () => useContext(HomeContext);
