import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../components/Spinner.jsx';

function ProtectedRoute({ children }) {
	const [isAuthenticated, setIsAuthenticated] = useState(null);

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const token = localStorage.getItem('token');
				if (!token) {
					setIsAuthenticated(false);
					return;
				}
				await axios.get('/api/users/me', {
					headers: { Authorization: `Bearer ${token}` },
				});
				setIsAuthenticated(true);
			} catch (error) {
				localStorage.removeItem('token');
				setIsAuthenticated(false);
			}
		};
		checkAuth();
	}, []);

	if (isAuthenticated === null) {
		return <Spinner />;
	}

	return isAuthenticated ? children : <Navigate to='/login' />;
}

export default ProtectedRoute;
