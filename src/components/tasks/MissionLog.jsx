import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, GripVertical, Loader2 } from 'lucide-react';
import { tasksService } from '../../api/tasks.service';

const MissionLog = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await tasksService.getAll();
      setTasks(data);
    } catch (error) {
      console.error("Error loading tasks", error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const savedTask = await tasksService.create({ title: newTask });
      setTasks([...tasks, savedTask]);
      setNewTask('');
    } catch (error) {
      console.error("Error adding task", error);
    }
  };

  const toggleTask = async (task) => {
    try {
      const updatedTask = await tasksService.update(task.id, { completed: !task.completed });
      setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
    } catch (error) {
      console.error("Error toggling task", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await tasksService.delete(id);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error("Error deleting task", error);
    }
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
        <span style={{ opacity: 0.5 }}>
          {loading ? '...' : `${tasks.filter(t => t.completed).length}/${tasks.length}`}
        </span>
      </h3>

      <form onSubmit={addTask} style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="New Objective..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          disabled={loading}
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
          disabled={loading}
          style={{
            background: 'var(--primary-color)',
            border: 'none',
            width: '45px',
            borderRadius: '12px',
            color: 'white',
            cursor: loading ? 'wait' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: loading ? 0.7 : 1
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
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '20px', color: 'var(--text-muted)' }}>
            <Loader2 className="animate-spin" />
          </div>
        ) : tasks.length === 0 ? (
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
                onClick={() => toggleTask(task)}
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
                {task.title}
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
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default MissionLog;