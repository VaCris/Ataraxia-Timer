import { useState } from 'react';
import { Plus, Circle, CheckCircle } from 'lucide-react';

const MissionLog = () => {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');

  const addTask = () => {
    if (!input.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: input, done: false }]);
    setInput('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  return (
    <div className="glass-panel" style={{ height: '100%', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ marginTop: 0, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        Tasks Log
      </h3>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
          placeholder="New objective..."
          style={{
            flex: 1,
            background: 'rgba(0,0,0,0.2)',
            border: '1px solid var(--glass-border)',
            borderRadius: '12px',
            padding: '12px',
            color: 'white',
            outline: 'none'
          }}
        />
        <button 
          onClick={addTask}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: 'none',
            borderRadius: '12px',
            color: 'var(--primary-color)',
            cursor: 'pointer'
          }}
        >
          <Plus size={20} />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {tasks.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontStyle: 'italic', marginTop: '2rem' }}>There are no tasks</p>}
        
        {tasks.map(task => (
          <div 
            key={task.id} 
            style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', 
              padding: '12px 0', borderBottom: '1px solid var(--glass-border)',
              opacity: task.done ? 0.5 : 1
            }}
          >
            <button onClick={() => toggleTask(task.id)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: task.done ? 'var(--success)' : '#555' }}>
              {task.done ? <CheckCircle size={20} /> : <Circle size={20} />}
            </button>
            <span style={{ textDecoration: task.done ? 'line-through' : 'none' }}>{task.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MissionLog;