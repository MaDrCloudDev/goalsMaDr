import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import GoalForm from '../components/GoalForm.jsx';
import GoalItem from '../components/GoalItem.jsx';
import Header from '../components/Header.jsx';

function Dashboard() {
	const [goals, setGoals] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchGoals = async () => {
			try {
				const token = localStorage.getItem('token');
				const response = await axios.get('/api/goals', {
					headers: { Authorization: `Bearer ${token}` },
				});
				setGoals(response.data);
			} catch (error) {
				if (error.response?.status === 401) {
					localStorage.removeItem('token');
					navigate('/login');
				}
				console.error(
					error.response?.data?.error || 'Error fetching goals'
				);
			}
		};
		fetchGoals();
	}, [navigate]);

	const handleGoalAdded = (newGoal) => {
		setGoals([...goals, newGoal]);
	};

	const handleGoalDeleted = (id) => {
		setGoals(goals.filter((goal) => goal._id !== id));
	};

	return (
		<div>
			<Header />
			<div className='container'>
				<h1>Dashboard</h1>
				<GoalForm onGoalAdded={handleGoalAdded} />
				<ul>
					{goals.map((goal) => (
						<GoalItem
							key={goal._id}
							goal={goal}
							onGoalDeleted={handleGoalDeleted}
						/>
					))}
				</ul>
			</div>
		</div>
	);
}

export default Dashboard;
