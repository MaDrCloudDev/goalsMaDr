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
			<div className='container'>
				<h1>Login</h1>
				{error && <p className='error-text'>{error}</p>}
				<form
					onSubmit={handleSubmit}
					className='flex flex-col gap-4 max-w-sm'>
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
						className='btn-blue'>
						Login
					</button>
				</form>
				<p className='mt-4'>
					Don't have an account?{' '}
					<a
						href='/register'
						className='link-blue'>
						Register
					</a>
				</p>
			</div>
		</div>
	);
}

export default Login;
