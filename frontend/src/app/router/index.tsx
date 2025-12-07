import { AdminPanel } from '@/pages/admin';
import { DirectorPanel } from '@/pages/director';
import { ErrorPage } from '@/pages/error';
import { LoginPage } from '@/pages/login';
import { TeacherPanel } from '@/pages/teacher';
import { createBrowserRouter } from 'react-router-dom';

/**
 * Application router configuration
 * Uses React Router v7 with createBrowserRouter for best practices
 */
export const router = createBrowserRouter([
	{
		path: '/admin',
		element: <AdminPanel />,
		errorElement: <ErrorPage />,
	},
	{
		path: '/',
		element: <LoginPage />,
		errorElement: <ErrorPage />,
	},
	{
		path: '/me/director',
		element: <DirectorPanel />,
		errorElement: <ErrorPage />,
	},
	{
		path: '/me/teacher',
		element: <TeacherPanel />,
		errorElement: <ErrorPage />,
	},
	{
		path: '*',
		element: <ErrorPage />,
	},
]);
