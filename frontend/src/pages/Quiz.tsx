import QuizApp from '../components/Quiz/QuizApp';
import Header from '../components/Header/HeaderApp';
import '../styles/PageTransitions.css';

const Quiz = () => {
  return (
    <div className="flex flex-col min-h-screen w-full bg-white fade-in">
      <Header />
      <main className="flex-grow w-full overflow-y-auto">
        <QuizApp />
      </main>
    </div>
  );
};

export default Quiz;