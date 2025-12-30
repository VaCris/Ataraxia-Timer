import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, GripVertical } from 'lucide-react';
import useLocalStorage from '../../hooks/useLocalStorage';

const MissionLog = () => {
  const [tasks, setTasks] = useLocalStorage('dw-tasks', []);
  const [newTask, setNewTask] = useState('');
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const task = {
      id: Date.now(),
      text: newTask,
      completed: false
    };
    setTasks([...tasks, task]);
    setNewTask('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleDragStart = (index) => {
    setDraggedItemIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (index) => {
    if (draggedItemIndex === null || draggedItemIndex === index) return;
    const newTasks = [...tasks];
    const itemToMove = newTasks[draggedItemIndex];

    newTasks.splice(draggedItemIndex, 1);
    newTasks.splice(index, 0, itemToMove);

    setTasks(newTasks);
    setDraggedItemIndex(null);
  };

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid var(--glass-border)',
      borderRadius: '24px',
      padding: '1.5rem',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backdropFilter: 'blur(10px)'
    }}>
      <h3 style={{
        marginTop: 0,
        marginBottom: '1.5rem',
        fontSize: '0.9rem',
        letterSpacing: '2px',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        Mission Log
        <span style={{ opacity: 0.5 }}>{tasks.filter(t => t.completed).length}/{tasks.length}</span>
      </h3>

      <form onSubmit={addTask} style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="New Objective..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          style={{
            background: 'rgba(0,0,0,0.2)',
            border: '1px solid var(--glass-border)',
            padding: '12px 16px',
            borderRadius: '12px',
            color: 'white',
            width: '100%',
            outline: 'none',
            fontSize: '0.9rem'
          }}
        />
        <button
          type="submit"
          style={{
            background: 'var(--primary-color)',
            border: 'none',
            width: '45px',
            borderRadius: '12px',
            color: 'white',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          <Plus size={20} />
        </button>
      </form>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        paddingRight: '5px'
      }}>
        {tasks.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem', fontSize: '0.9rem', fontStyle: 'italic' }}>
            There are no active missions.
          </div>
        ) : (
          tasks.map((task, index) => (
            <div
              key={task.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(index)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: task.completed ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
                padding: '12px',
                borderRadius: '12px',
                transition: 'all 0.2s',
                opacity: draggedItemIndex === index ? 0.4 : (task.completed ? 0.6 : 1),
                border: draggedItemIndex === index ? '1px dashed var(--text-muted)' : '1px solid transparent',
                cursor: 'grab'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
              onMouseLeave={(e) => {
                if (draggedItemIndex !== index) e.currentTarget.style.borderColor = 'transparent'
              }}
            >
              <div style={{ cursor: 'grab', color: 'var(--text-muted)', display: 'flex' }}>
                <GripVertical size={14} />
              </div>

              <button
                onClick={() => toggleTask(task.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: task.completed ? 'var(--primary-color)' : 'var(--text-muted)', padding: 0, display: 'flex' }}
              >
                {task.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
              </button>

              <span style={{
                flex: 1,
                fontSize: '0.9rem',
                textDecoration: task.completed ? 'line-through' : 'none',
                color: task.completed ? 'var(--text-muted)' : 'white',
                wordBreak: 'break-word',
                userSelect: 'none'
              }}>
                {task.text}
              </span>

              <button
                onClick={() => deleteTask(task.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', opacity: 0.6, padding: 0, display: 'flex' }}
                title="Delete Mission"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>

      <style>{`
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
      `}</style>
    </div>
  );
};

export default MissionLog;