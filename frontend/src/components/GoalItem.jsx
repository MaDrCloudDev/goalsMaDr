import axios from 'axios';

import { useState } from 'react';

function GoalItem({ goal, onGoalDeleted, onGoalUpdated }) {
	const [editing, setEditing] = useState(false);
	const [text, setText] = useState(goal.text);
	const [note, setNote] = useState(goal.note || '');
	const [completed, setCompleted] = useState(!!goal.completed);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState('');

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

	const handleSave = async () => {
		if (!text.trim()) {
			setError('Text is required');
			return;
		}
		try {
			setSaving(true);
			setError('');
			const token = localStorage.getItem('token');
			const { data } = await axios.put(
				`/api/goals/${goal._id}`,
				{ text, note },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			onGoalUpdated?.(data);
			setEditing(false);
		} catch (err) {
			setError(err.response?.data?.error || 'Failed to save');
		} finally {
			setSaving(false);
		}
	};

	const toggleCompleted = async () => {
		try {
			const token = localStorage.getItem('token');
			const { data } = await axios.put(
				`/api/goals/${goal._id}`,
				{ completed: !completed },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			setCompleted(data.completed);
			onGoalUpdated?.(data);
		} catch (err) {
			setError(err.response?.data?.error || 'Failed to update');
		}
	};

	const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
	const formatRelative = (dateLike) => {
		try {
			const d = new Date(dateLike);
			const now = new Date();
			const diffMs = d.getTime() - now.getTime();
			const abs = Math.abs(diffMs);
			const minutes = Math.round(diffMs / (60 * 1000));
			const hours = Math.round(diffMs / (60 * 60 * 1000));
			const days = Math.round(diffMs / (24 * 60 * 60 * 1000));
			if (abs < 60 * 1000) return 'just now';
			if (abs < 60 * 60 * 1000) return rtf.format(minutes, 'minute');
			if (abs < 24 * 60 * 60 * 1000) return rtf.format(hours, 'hour');
			return rtf.format(days, 'day');
		} catch {
			return '';
		}
	};

	return (
		<div
			className={`goal-item card h-full flex flex-col text-left transition duration-200 transform hover:-translate-y-0.5 hover:shadow-lg ${
				completed ? 'border-green-500 bg-green-800/20' : ''
			}`}
		>
			{editing ? (
				<>
					<input
						type='text'
						value={text}
						onChange={(e) => setText(e.target.value)}
						className='w-full'
						aria-label='Edit goal text'
					/>
					<textarea
						value={note}
						onChange={(e) => setNote(e.target.value)}
						className='w-full p-3 rounded-lg border border-gray-600 bg-dark text-light focus:outline-none focus:ring-2 focus:ring-secondary transition min-h-[96px]'
						placeholder='Details (optional)'
						aria-label='Edit goal details'
					/>
					{error && <p className='error-text text-sm'>{error}</p>}
					<div className='mt-auto flex justify-end gap-2'>
						<button
							onClick={() => setEditing(false)}
							className='btn-secondary text-xs'
							disabled={saving}
						>
							Cancel
						</button>
						<button
							onClick={handleSave}
							className='btn-primary text-xs'
							disabled={saving}
						>
							Save
						</button>
					</div>
				</>
			) : (
				<>
					<div className='flex items-start justify-between gap-3'>
						<h2 className={`text-lg font-semibold transition-colors ${completed ? 'text-green-400 line-through' : 'text-light'}`}>{text}</h2>
						<span
							className={`text-green-500 transition-opacity duration-200 ${completed ? 'opacity-100' : 'opacity-0'}`}
							aria-hidden={!completed}
							title={completed ? 'Completed' : ''}
						>
							<svg width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='3' strokeLinecap='round' strokeLinejoin='round'>
								<path d='M20 6L9 17l-5-5' />
							</svg>
						</span>
					</div>
					{note && <p className='text-sm text-gray-300 whitespace-pre-wrap'>{note}</p>}
					<div className='flex justify-between items-center'>
						{completed ? (
							<span className='text-xs text-green-400' title={goal.completedAt ? new Date(goal.completedAt).toLocaleString('en-US') : ''}>
								Completed {formatRelative(goal.completedAt || new Date().toISOString())}
							</span>
						) : (
							<span className='text-xs text-gray-400' title={new Date(goal.createdAt).toLocaleString('en-US')}>
								Created {formatRelative(goal.createdAt)}
							</span>
						)}
					</div>
					<div className='flex-1'></div>
					<div className='mt-3 flex justify-between items-center'>
						<button
							onClick={toggleCompleted}
							className={`text-xs px-3 py-1 rounded transition-colors ${completed ? 'bg-green-600 text-light hover:bg-green-700' : 'bg-gray-700 text-light hover:bg-gray-600'}`}
							aria-pressed={completed}
							aria-label={`Mark as ${completed ? 'incomplete' : 'completed'}`}
						>
							{completed ? 'Completed' : 'Mark complete'}
						</button>
						<div className='flex gap-2'>
							<button
								onClick={() => setEditing(true)}
								className='btn-secondary text-xs'
								aria-label={`Edit goal: ${goal.text}`}
							>
								Edit
							</button>
							<button
								onClick={handleDelete}
								className='btn-danger text-xs'
								aria-label={`Delete goal: ${goal.text}`}
							>
								Delete
							</button>
						</div>
					</div>
				</>
			)}
		</div>
	);
}

export default GoalItem;
