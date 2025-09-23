import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import GoalForm from '../components/GoalForm.jsx';
import GoalItem from '../components/GoalItem.jsx';
import Header from '../components/Header.jsx';

function Dashboard() {
	const [goals, setGoals] = useState([]);
	const [nextCursor, setNextCursor] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const fetchGoals = async (cursor = null) => {
		try {
			setLoading(true);
			setError('');
			const token = localStorage.getItem('token');
			const params = new URLSearchParams();
			params.set('limit', '20');
			if (cursor) params.set('cursor', cursor);
			const response = await axios.get(`/api/goals?${params.toString()}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			const { items, nextCursor: nc } = response.data;
			setGoals((prev) => (cursor ? [...prev, ...items] : items));
			setNextCursor(nc);
		} catch (error) {
			if (error.response?.status === 401) {
				localStorage.removeItem('token');
				navigate('/login');
			}
			setError(error.response?.data?.error || 'Error fetching goals');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchGoals();
	}, []);

	const handleGoalAdded = (newGoal) => {
		setGoals((prev) => [newGoal, ...prev]);
	};

	const handleGoalDeleted = (id) => {
		setGoals((prev) => prev.filter((goal) => goal._id !== id));
	};

	const handleGoalUpdated = (updated) => {
		setGoals((prev) => prev.map((g) => (g._id === updated._id ? updated : g)));
	};

	useEffect(() => {
		if (!nextCursor) return;
		const sentinel = document.getElementById('goals-sentinel');
		if (!sentinel) return;
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && !loading && nextCursor) {
					fetchGoals(nextCursor);
				}
			},
			{ rootMargin: '200px' }
		);
		observer.observe(sentinel);
		return () => observer.disconnect();
	}, [nextCursor, loading]);

	return (
		<div>
			<Header />
			<div className='container text-center'>
				<h1 className='underline decoration-secondary'>Dashboard</h1>
				<GoalForm onGoalAdded={handleGoalAdded} />
				{error && <p className='error-text mb-4'>{error}</p>}
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
					{goals.map((goal) => (
						<GoalItem
							key={goal._id}
							goal={goal}
							onGoalDeleted={handleGoalDeleted}
							onGoalUpdated={handleGoalUpdated}
						/>
					))}
				</div>
				<div id='goals-sentinel' className='h-10'></div>
				{loading && <p className='text-sm text-gray-400 mt-2'>Loading…</p>}
			</div>
		</div>
	);
}

export default Dashboard;

