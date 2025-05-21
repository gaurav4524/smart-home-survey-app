
import { useState, useEffect } from "react";
import { useHome } from "@/context/HomeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import ProgressBar from "@/components/ProgressBar";
import { v4 as uuidv4 } from "uuid";

const SurveyStep2 = () => {
  const { numRooms, rooms, setRooms, nextStep, prevStep } = useHome();
  const [roomNames, setRoomNames] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  // Initialize room names from existing rooms or create empty array
  useEffect(() => {
    if (rooms.length > 0 && rooms.length === numRooms) {
      setRoomNames(rooms.map(room => room.name));
    } else {
      setRoomNames(Array(numRooms).fill(""));
    }
    setErrors(Array(numRooms).fill(""));
  }, [numRooms, rooms]);

  const handleRoomNameChange = (index: number, value: string) => {
    const newRoomNames = [...roomNames];
    newRoomNames[index] = value;
    setRoomNames(newRoomNames);
    
    // Clear error when user types
    if (errors[index]) {
      const newErrors = [...errors];
      newErrors[index] = "";
      setErrors(newErrors);
    }
  };

  const validateRoomNames = () => {
    const newErrors = roomNames.map(name => 
      name.trim() === "" ? "Room name is required" : ""
    );
    
    setErrors(newErrors);
    return newErrors.every(error => error === "");
  };

  const handleNext = () => {
    if (!validateRoomNames()) return;
    
    // Create room objects with names
    const updatedRooms = roomNames.map((name, index) => {
      // Check if this room already exists in the rooms array
      const existingRoom = rooms.find((r, i) => i === index);
      
      if (existingRoom) {
        // Update existing room name
        return {
          ...existingRoom,
          name: name.trim()
        };
      } else {
        // Create new room
        return {
          id: uuidv4(),
          name: name.trim(),
          appliances: []
        };
      }
    });
    
    setRooms(updatedRooms);
    nextStep();
  };

  return (
    <div className="container max-w-md mx-auto py-8 px-4 page-transition">
      <h1 className="text-2xl font-bold text-center mb-2">Room Setup</h1>
      <p className="text-center text-muted-foreground mb-6">
        Name each room in your home
      </p>
      
      <ProgressBar currentStep={2} totalSteps={3} />
      
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-medium mb-4">What are your rooms called?</h2>
          
          <div className="space-y-4">
            {roomNames.map((name, index) => (
              <div key={index} className="space-y-1">
                <label htmlFor={`room-${index}`} className="text-sm">
                  Room {index + 1}
                </label>
                <Input
                  id={`room-${index}`}
                  value={name}
                  onChange={(e) => handleRoomNameChange(index, e.target.value)}
                  placeholder={`Room ${index + 1} name`}
                  className={errors[index] ? "border-destructive" : ""}
                />
                {errors[index] && (
                  <p className="text-xs text-destructive">{errors[index]}</p>
                )}
              </div>
            ))}
            
            <div className="flex gap-2 pt-2">
              <Button 
                onClick={prevStep} 
                variant="outline"
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={handleNext} 
                className="flex-1 bg-smart-primary hover:bg-smart-secondary"
              >
                Continue
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SurveyStep2;
