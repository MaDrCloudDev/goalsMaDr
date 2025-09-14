import { useState } from 'react';
import axios from 'axios';

function GoalForm({ onGoalAdded }) {
	const [text, setText] = useState('');
	const [error, setError] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!text.trim()) {
			setError('Please enter a goal');
			return;
		}
		try {
			const token = localStorage.getItem('token');
			const response = await axios.post(
				'/api/goals',
				{ text },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			onGoalAdded(response.data);
			setText('');
			setError('');
		} catch (err) {
			setError(err.response?.data?.error || 'Failed to create goal');
		}
	};

	return (
		<section className='mb-6'>
			<form
				onSubmit={handleSubmit}
				className='flex flex-col gap-4'>
				<div>
					<label
						htmlFor='goal-text'
						className='block text-sm font-medium mb-1'>
						What's your goal?
					</label>
					<input
						type='text'
						id='goal-text'
						value={text}
						onChange={(e) => setText(e.target.value)}
						placeholder='Enter your goal'
						className='w-full'
						aria-describedby={error ? 'goal-error' : undefined}
					/>
					{error && (
						<p
							id='goal-error'
							className='error-text mt-1'>
							{error}
						</p>
					)}
				</div>
				<button
					type='submit'
					className='btn-blue'>
					Add Goal
				</button>
			</form>
		</section>
	);
}

export default GoalForm;
