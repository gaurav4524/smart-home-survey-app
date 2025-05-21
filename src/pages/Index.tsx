
import { useHome } from "@/context/HomeContext";
import SurveyStep1 from "../screens/SurveyStep1";
import SurveyStep2 from "../screens/SurveyStep2";
import SurveyStep3 from "../screens/SurveyStep3";
import HomeScreen from "../screens/HomeScreen";

const Index = () => {
  const { currentStep, surveyCompleted } = useHome();
  
  // Return the appropriate component based on survey status and current step
  if (surveyCompleted) {
    return <HomeScreen />;
  }
  
  switch (currentStep) {
    case 1:
      return <SurveyStep1 />;
    case 2:
      return <SurveyStep2 />;
    case 3:
      return <SurveyStep3 />;
    default:
      return <SurveyStep1 />;
  }
};

export default Index;
