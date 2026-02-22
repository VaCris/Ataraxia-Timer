import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Plus, Trash2, CheckCircle2, Circle,
  Tag as TagIcon, CloudOff, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

import { useAchievements } from '../../context/achievement-context';
import AdBanner from '../layout/AdBanner';

import {
  addTaskRequest, updateTaskRequest, deleteTaskRequest
} from '../../store/slices/tasksSlice';

const MissionLog = ({ showAd }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTag, setNewTaskTag] = useState('General');
  const [newTaskTagColor, setNewTaskTagColor] = useState('#8b5cf6');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingText, setEditingText] = useState('');

  const dispatch = useDispatch();
  const { tasks, tags, loading } = useSelector(state => state.tasks);
  const { refreshAchievements } = useAchievements();

  const TITLE_REGEX = /^[a-zA-Z0-9\s\-_.,!?áéíóúÁÉÍÓÚñÑ]+$/;

  const addTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    if (!TITLE_REGEX.test(newTaskTitle)) return toast.error("Title contains invalid characters");

    const tempId = `temp-${Date.now()}`;
    dispatch(addTaskRequest({
      id: tempId,
      title: newTaskTitle,
      tag: newTaskTag,
      tagColor: newTaskTagColor,
      completed: false,
      isSyncing: true,
      isOptimistic: true
    }));

    setNewTaskTitle('');
    toast.success('Mission assigned!');
    refreshAchievements();
  };

  const toggleTask = (task) => {
    if (task.isOptimistic) return;

    dispatch(updateTaskRequest({
      id: task.id,
      updates: { completed: !task.completed }
    }));

    if (!task.completed) {
      toast.success('Mission accomplished!');
      refreshAchievements();
    }
  };

  const deleteTask = (id) => {
    dispatch(deleteTaskRequest(id));
    toast.success('Mission deleted');
  };

  const saveEdit = (id, isOffline) => {
    if (isOffline) return toast.error("Cannot edit offline missions");

    const currentTask = tasks.find(t => t.id === id);
    if (!currentTask || editingText === currentTask.title || !editingText.trim()) {
      setEditingTaskId(null);
      return;
    }

    dispatch(updateTaskRequest({ id, updates: { title: editingText } }));
    toast.success('Mission updated');
    setEditingTaskId(null);
  };

  const getTagColor = (tagName) => {
    const foundTag = tags.find(t => t.name === tagName);
    return foundTag?.color || 'var(--primary-color)';
  };

  return (
    <div className="mission-log-container" style={{
      background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)',
      borderRadius: '24px', padding: '1.5rem', height: '100%',
      display: 'flex', flexDirection: 'column', backdropFilter: 'blur(10px)'
    }}>
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .animate-spin-slow { animation: spin 3s linear infinite; }
      `}</style>

      <h3 style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between' }}>
        Mission Log
        <span style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {loading && <RefreshCw size={12} className="animate-spin" />}
          {tasks.filter(t => t.completed).length}/{tasks.length}
        </span>
      </h3>

      <form onSubmit={addTask} style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '16px', border: '1px solid var(--glass-border)', gap: '8px' }}>
          <input
            type="text" placeholder="Add a new mission..."
            value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)}
            style={{ background: 'transparent', border: 'none', flex: 1, padding: '10px 15px', color: 'white', outline: 'none' }}
          />
          <button type="submit" className="btn-save" style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--primary-color)', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Plus size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '0 12px', border: '1px solid var(--glass-border)' }}>
            <TagIcon size={14} style={{ color: newTaskTagColor, marginRight: '8px' }} />
            <input
              type="text" placeholder="Tag label"
              value={newTaskTag}
              onChange={(e) => {
                setNewTaskTag(e.target.value);
                const match = tags.find(t => t.name.toLowerCase() === e.target.value.toLowerCase());
                if (match) setNewTaskTagColor(match.color);
              }}
              style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '0.8rem', padding: '8px 0', outline: 'none', flex: 1 }}
            />
          </div>
          <div style={{ position: 'relative', width: '36px', height: '36px', borderRadius: '10px', border: '2px solid white', backgroundColor: newTaskTagColor, cursor: 'pointer', overflow: 'hidden' }}>
            <input type="color" value={newTaskTagColor} onChange={(e) => setNewTaskTagColor(e.target.value)} style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', cursor: 'pointer', opacity: 0 }} />
          </div>
        </div>
      </form>

      {/* Lista de Tareas */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {tasks.map((task) => (
          <div key={task.id} className="task-item" style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px',
            opacity: task.completed ? 0.6 : 1,
            border: editingTaskId === task.id ? '1px solid var(--primary-color)' : '1px solid transparent'
          }}>
            <button onClick={() => toggleTask(task)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: task.completed ? 'var(--primary-color)' : 'var(--text-muted)' }}>
              {task.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
            </button>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {editingTaskId === task.id ? (
                <input
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  onBlur={() => saveEdit(task.id, task.isOffline)}
                  onKeyDown={(e) => e.key === 'Enter' && saveEdit(task.id, task.isOffline)}
                  autoFocus
                  style={{ background: 'rgba(0,0,0,0.3)', border: 'none', color: 'white', fontSize: '0.9rem', outline: 'none' }}
                />
              ) : (
                <span
                  onDoubleClick={() => { if (!task.isOffline) { setEditingTaskId(task.id); setEditingText(task.title); } }}
                  style={{ fontSize: '0.9rem', color: 'white', textDecoration: task.completed ? 'line-through' : 'none', cursor: task.isOffline ? 'default' : 'text' }}
                >
                  {task.title}
                </span>
              )}
              {task.tag && (
                <span style={{ fontSize: '0.65rem', color: getTagColor(task.tag), display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' }}>
                  <TagIcon size={10} /> {task.tag.toUpperCase()}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {(task.isOffline || task.isSyncing) && !task.isOptimistic && (
                <div title="Saved offline">
                  <CloudOff size={14} style={{ color: '#fb923c' }} />
                </div>
              )}
              {task.isOptimistic && (
                <RefreshCw size={14} className="animate-spin" style={{ color: 'var(--primary-color)' }} />
              )}

              <button onClick={() => deleteTask(task.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', opacity: 0.6 }}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {showAd && !loading && <AdBanner />}
      </div>
    </div>
  );
};

export default MissionLog;