
import { useState } from "react";
import { useHome } from "@/context/HomeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import ProgressBar from "@/components/ProgressBar";

const SurveyStep1 = () => {
  const { numRooms, setNumRooms, nextStep } = useHome();
  const [inputValue, setInputValue] = useState(numRooms.toString() || "");
  const [error, setError] = useState("");

  const handleNext = () => {
    const value = parseInt(inputValue);
    
    if (isNaN(value) || value <= 0) {
      setError("Please enter a valid number greater than 0");
      return;
    }
    
    if (value > 10) {
      setError("Please enter a number less than or equal to 10");
      return;
    }
    
    setNumRooms(value);
    nextStep();
  };

  return (
    <div className="container max-w-md mx-auto py-8 px-4 page-transition">
      <h1 className="text-2xl font-bold text-center mb-2">Welcome to HomeControl</h1>
      <p className="text-center text-muted-foreground mb-6">
        Let's set up your smart home in just a few steps
      </p>
      
      <ProgressBar currentStep={1} totalSteps={3} />
      
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-medium mb-4">How many rooms do you have?</h2>
          
          <div className="space-y-4">
            <Input
              type="number"
              min="1"
              max="10"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setError("");
              }}
              placeholder="Enter number of rooms"
              className={error ? "border-destructive" : ""}
            />
            
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            
            <Button 
              onClick={handleNext} 
              className="w-full bg-smart-primary hover:bg-smart-secondary"
            >
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SurveyStep1;
