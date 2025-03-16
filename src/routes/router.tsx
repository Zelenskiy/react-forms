import { createBrowserRouter } from 'react-router-dom';
import MainPage from '../components/MainPage';
import UncontrolledForm from '../components/UncontrolledForm';
import ReactHookForm from '../components/ReactHookForm';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />,
    children: [
      {
        path: 'uncontrolled-form',
        element: <UncontrolledForm />,
      },
      {
        path: 'react-hook-form',
        element: <ReactHookForm />,
      },
    ],
  },
]);

export default router;
