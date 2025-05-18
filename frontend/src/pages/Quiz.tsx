import QuizApp from '../components/Quiz/QuizApp';
import Header from '../components/Header/HeaderApp';
import ProgressBar from '../components/ProgressBar/ProgressBarApp';
import quizQuestions from '../components/Quiz/QuizQuestions';
import '../styles/PageTransitions.css';
import { useState } from 'react';

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const totalQuestions = quizQuestions.length;
  
  // Handle question change from QuizApp
  const handleQuestionChange = (index: number) => {
    setCurrentQuestion(index);
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-white fade-in">
      <Header />
      <ProgressBar currentStep={currentQuestion + 1} totalSteps={totalQuestions} />
      <main className="flex-grow w-full overflow-y-auto">
        <QuizApp onQuestionChange={handleQuestionChange} />
      </main>
    </div>
  );
};

export default Quiz;