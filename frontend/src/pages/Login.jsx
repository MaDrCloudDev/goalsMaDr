import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header.jsx';

function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post('/api/users/login', {
				email,
				password,
			});
			localStorage.setItem('token', response.data.token);
			navigate('/');
		} catch (err) {
			setError(err.response?.data?.error || 'Login failed');
		}
	};

	return (
		<div>
			<Header />
			<div className='container flex justify-center items-center min-h-[calc(100vh-80px)]'>
				<div className='w-full max-w-sm'>
					<h1>Login</h1>
					{error && <p className='error-text'>{error}</p>}
					<form
						onSubmit={handleSubmit}
						className='flex flex-col gap-4'>
						<input
							type='email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder='Email'
						/>
						<input
							type='password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder='Password'
						/>
						<button
							type='submit'
							className='btn-primary'>
							Login
						</button>
					</form>
					<p className='mt-4'>
						Don't have an account?{' '}
						<a
							href='/register'
							className='link-secondary'>
							Register
						</a>
					</p>
				</div>
			</div>
		</div>
	);
}

export default Login;
