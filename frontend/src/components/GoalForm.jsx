import { useState } from 'react';
import axios from 'axios';

function GoalForm({ onGoalAdded }) {
	const [text, setText] = useState('');
	const [note, setNote] = useState('');
	const [error, setError] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!text.trim()) {
			setError('Please enter a goal');
			return;
		}
		try {
			const token = localStorage.getItem('token');
			const response = await axios.post('/api/goals', { text, note }, {
				headers: { Authorization: `Bearer ${token}` },
			});
			onGoalAdded(response.data);
			setText('');
			setNote('');
			setError('');
		} catch (err) {
			setError(err.response?.data?.error || 'Failed to create goal');
		}
	};

	return (
		<section className='mb-6 max-w-4xl mx-auto'>
			<form
				onSubmit={handleSubmit}
				className='flex flex-col gap-4'>
				<div>
					<label
						htmlFor='goal-text'
						className='block text-sm font-medium mb-1'>
						What's your next goal?
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
				<div>
					<label htmlFor='goal-note' className='block text-sm font-medium mb-1'>
						Details (optional)
					</label>
					<textarea
						id='goal-note'
						value={note}
						onChange={(e) => setNote(e.target.value)}
						placeholder='Add any details for this goal'
						className='w-full p-3 rounded-lg border border-gray-600 bg-dark text-light focus:outline-none focus:ring-2 focus:ring-secondary transition min-h-[96px]'
					/>
				</div>
				<button
					type='submit'
					className='btn-primary w-60 mx-auto mb-2'>
					Add Goal
				</button>
			</form>
		</section>
	);
}

export default GoalForm;

