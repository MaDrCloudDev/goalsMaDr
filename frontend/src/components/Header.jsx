import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import axios from 'axios';

function Header() {
	const [user, setUser] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const token = localStorage.getItem('token');
				if (token) {
					const response = await axios.get('/api/users/me', {
						headers: { Authorization: `Bearer ${token}` },
					});
					setUser(response.data);
				} else {
					setUser(null);
				}
			} catch (error) {
				localStorage.removeItem('token');
				setUser(null);
			}
		};
		fetchUser();
	}, []);

	const handleLogout = () => {
		localStorage.removeItem('token');
		setUser(null);
		navigate('/login'); // Redirect to login page
	};

	return (
		<header className='bg-gray-800 py-4 px-6 shadow-lg'>
			<div className='container flex justify-between items-center'>
				<div className='logo'>
					<Link
						to='/'
						className='text-2xl font-bold text-blue-400'>
						goalsMaDr
					</Link>
				</div>
				<nav>
					<ul className='flex space-x-4'>
						{user ? (
							<li>
								<button
									onClick={handleLogout}
									className='btn-blue flex items-center gap-2'>
									<FaSignOutAlt />
									Logout
								</button>
							</li>
						) : (
							<>
								<li>
									<Link
										to='/login'
										className='link-blue flex items-center gap-2'>
										<FaSignInAlt />
										Login
									</Link>
								</li>
								<li>
									<Link
										to='/register'
										className='link-blue flex items-center gap-2'>
										<FaSignInAlt />
										Register
									</Link>
								</li>
							</>
						)}
					</ul>
				</nav>
			</div>
		</header>
	);
}

export default Header;
