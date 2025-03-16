import { Link, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { resetNewFlag } from '../store/formSlice';
import { RootState } from '../types/types';

const MainPage = () => {
  const uncontrolledFormData = useSelector(
    (state: RootState) => state.forms.uncontrolled
  );
  const reactHookFormData = useSelector(
    (state: RootState) => state.forms.reactHookForm
  );
  const dispatch = useDispatch();

  // Reset the 'isNew' flag after a few seconds to stop highlighting
  useEffect(() => {
    if (uncontrolledFormData.isNew) {
      const timer = setTimeout(() => {
        dispatch(resetNewFlag('uncontrolled'));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [uncontrolledFormData.isNew, dispatch]);

  useEffect(() => {
    if (reactHookFormData.isNew) {
      const timer = setTimeout(() => {
        dispatch(resetNewFlag('reactHookForm'));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [reactHookFormData.isNew, dispatch]);

  return (
    <header className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6" hidden>
        React Forms Application
      </h1>

      <nav className="flex gap-4 mb-4 ml-4">
        <Link to="/" className="px-4 py-2 text-white rounded hover:bg-blue-600">
          Main
        </Link>
        <Link
          to="/uncontrolled-form"
          className="px-4 py-2 text-white rounded hover:bg-blue-600"
        >
          Uncontrolled Form
        </Link>
        <Link
          to="/react-hook-form"
          className="px-4 py-2 text-white rounded hover:bg-blue-600"
        >
          React Hook Form
        </Link>
      </nav>
      <Outlet />
    </header>
  );
};

export default MainPage;
