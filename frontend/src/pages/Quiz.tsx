import QuizApp from '../components/Quiz/QuizApp';
import Header from '../components/Header/HeaderApp';

const Quiz = () => {
  return (
    <div className="flex flex-col min-h-screen w-full bg-white">
      <Header />
      <main className="flex-grow w-full overflow-y-auto">
        <QuizApp />
      </main>
    </div>
  );
};

export default Quiz;