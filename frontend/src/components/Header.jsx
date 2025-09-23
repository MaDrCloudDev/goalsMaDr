import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
		navigate('/login');
	};

	return (
		<header className='py-4 px-6 max-w-4xl mx-auto'>
			<div className='flex justify-between items-center'>
				<div className='logo'>
					<Link
						to='/'
						className='text-2xl font-bold text-secondary'>
						goalsMaDr
					</Link>
				</div>
				<nav>
					<ul className='flex space-x-4'>
						{user ? (
							<li>
								<button
									onClick={handleLogout}
									className='btn-secondary flex items-center gap-2'>
									Sign out
								</button>
							</li>
						) : (
							<>
								<li>
									<Link
										to='/login'
										className='nav-link flex items-center gap-2'>
										Sign in
									</Link>
								</li>
								<li>
									<Link
										to='/register'
										className='nav-link flex items-center gap-2'>
										Sign up
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

