import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, GripVertical, Loader2 } from 'lucide-react';
import { tasksService } from '../../api/tasks.service';
import { useAuth } from '../../context/auth-context';

const MissionLog = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(false);
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const inputRef = useRef(null);

  const { user, token, loading: authLoading, initialized } = useAuth();

  useEffect(() => {
    if (!initialized) return;
    if (loading) return;
    if (!token) return;
    if (user?.isGuest) return;

    loadTasks();
  }, [initialized, loading, token, user]);

  useEffect(() => {
    if (editingTaskId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingTaskId]);

  const loadTasks = async () => {
    try {
      const data = await tasksService.getAll();
      setTasks(data || []);
    } catch (error) {
      console.error("Error loading tasks", error);
      setTasks([]);
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

  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setEditingText(task.title);
  };

  const saveEdit = async (id) => {
    if (!editingText.trim()) {
      setEditingTaskId(null);
      return;
    }

    const oldTasks = [...tasks];
    setTasks(tasks.map(t => t.id === id ? { ...t, title: editingText } : t));
    setEditingTaskId(null);

    try {
      await tasksService.update(id, { title: editingText });
    } catch (error) {
      console.error("Error updating task title", error);
      setTasks(oldTasks);
    }
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditingText('');
  };

  const handleEditKeyDown = (e, id) => {
    if (e.key === 'Enter') {
      saveEdit(id);
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  const handleDragStart = (index) => {
    if (editingTaskId !== null) return;
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
              draggable={editingTaskId === null}
              onDragStart={() => handleDragStart(index)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(index)}
              onDoubleClick={() => startEditing(task)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: task.completed ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
                padding: '12px',
                borderRadius: '12px',
                transition: 'all 0.2s',
                opacity: draggedItemIndex === index ? 0.4 : (task.completed ? 0.6 : 1),
                border: draggedItemIndex === index ? '1px dashed var(--text-muted)' : (editingTaskId === task.id ? '1px solid var(--primary-color)' : '1px solid transparent'),
                cursor: editingTaskId === task.id ? 'text' : 'grab'
              }}
              onMouseEnter={(e) => { if (editingTaskId !== task.id) e.currentTarget.style.borderColor = 'var(--glass-border)' }}
              onMouseLeave={(e) => {
                if (draggedItemIndex !== index && editingTaskId !== task.id) e.currentTarget.style.borderColor = 'transparent'
              }}
            >
              <div style={{ cursor: 'grab', color: 'var(--text-muted)', display: 'flex' }}>
                <GripVertical size={14} />
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); toggleTask(task); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: task.completed ? 'var(--primary-color)' : 'var(--text-muted)', padding: 0, display: 'flex' }}
              >
                {task.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
              </button>

              {editingTaskId === task.id ? (
                <input
                  ref={inputRef}
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  onBlur={() => saveEdit(task.id)}
                  onKeyDown={(e) => handleEditKeyDown(e, task.id)}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    color: 'white',
                    fontSize: '0.9rem',
                    outline: 'none',
                    fontFamily: 'inherit',
                    padding: 0,
                    margin: 0
                  }}
                />
              ) : (
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
              )}

              <button
                onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
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