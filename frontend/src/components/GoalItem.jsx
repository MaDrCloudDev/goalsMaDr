import axios from 'axios';

function GoalItem({ goal, onGoalDeleted }) {
	const handleDelete = async () => {
		try {
			const token = localStorage.getItem('token');
			await axios.delete(`/api/goals/${goal._id}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			onGoalDeleted(goal._id);
		} catch (error) {
			console.error(
				error.response?.data?.error || 'Error deleting goal'
			);
		}
	};

	return (
		<li className='goal-item flex justify-between items-center'>
			<div>
				<span className='text-sm text-gray-400'>
					{new Date(goal.createdAt).toLocaleString('en-US')}
				</span>
				<h2 className='text-lg font-medium text-light'>{goal.text}</h2>
			</div>
			<button
				onClick={handleDelete}
				className='btn-danger text-sm'
				aria-label={`Delete goal: ${goal.text}`}>
				✕
			</button>
		</li>
	);
}

export default GoalItem;
