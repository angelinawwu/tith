import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Quiz from './pages/Quiz'
import LandingPage from './pages/LandingPage'
import './App.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/quiz',
    element: <Quiz />,
  },
])

const App = () => {
  return (
    <RouterProvider router={router} />
  );
};

export default App;