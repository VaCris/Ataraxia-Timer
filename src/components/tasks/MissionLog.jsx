import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, Loader2, Tag as TagIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { tasksService } from '../../api/tasks.service';
import { tagsService } from '../../api/tags.service';
import { useAuth } from '../../context/auth-context';
import { useAchievements } from '../../context/achievement-context';
import AdBanner from '../layout/AdBanner';

const MissionLog = ({ showAd }) => {
  const [tasks, setTasks] = useState([]);
  const [tags, setTags] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTag, setNewTaskTag] = useState('General');
  const [newTaskTagColor, setNewTaskTagColor] = useState('#8b5cf6');
  const [loading, setLoading] = useState(false);

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const inputRef = useRef(null);

  const { user, token, initialized } = useAuth();
  const { refreshAchievements } = useAchievements();

  const TITLE_REGEX = /^[a-zA-Z0-9\s\-_.,!?áéíóúÁÉÍÓÚñÑ]+$/;

  const loadData = async () => {
    if (!token || user?.isGuest) return;
    setLoading(true);
    try {
      const [tasksData, tagsData] = await Promise.all([
        tasksService.getAll(),
        tagsService.getAll()
      ]);
      setTasks(tasksData || []);
      setTags(tagsData || []);
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => setLoading(false), 600);
    }
  };

  useEffect(() => {
    if (initialized && token && user && !user.isGuest) {
      loadData();
    } else if (initialized && (user?.isGuest || !token)) {
      setTasks([]);
      setTags([]);
      setLoading(false);
    }
  }, [initialized, token, user?.id, user?.isGuest]);

  const MissionSkeleton = () => (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '12px',
      animation: 'pulse 1.5s infinite ease-in-out'
    }}>
      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
      <div style={{ flex: 1 }}>
        <div style={{ width: '60%', height: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginBottom: '8px' }} />
        <div style={{ width: '30%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
      </div>
    </div>
  );

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    if (!TITLE_REGEX.test(newTaskTitle)) return toast.error("Title contains invalid characters");

    try {
      const existingTag = tags.find(t => t.name.toLowerCase() === newTaskTag.toLowerCase());
      if (!existingTag) {
        const createdTag = await tagsService.create({ name: newTaskTag, color: newTaskTagColor });
        setTags([...tags, createdTag]);
      } else if (existingTag.color !== newTaskTagColor) {
        await tagsService.update(existingTag.id, { color: newTaskTagColor });
        setTags(tags.map(t => t.id === existingTag.id ? { ...t, color: newTaskTagColor } : t));
      }

      const savedTask = await tasksService.create({ title: newTaskTitle, tag: newTaskTag });
      setTasks([...tasks, savedTask]);
      setNewTaskTitle('');
      toast.success('Mission assigned! 🚀');
      refreshAchievements();
    } catch (error) { toast.error("Failed to sync"); }
  };

  const getTagColor = (tagName) => {
    const foundTag = tags.find(t => t.name === tagName);
    return foundTag?.color || 'var(--primary-color)';
  };

  const toggleTask = async (task) => {
    try {
      const updatedTask = await tasksService.update(task.id, { completed: !task.completed });
      setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
      if (updatedTask.completed) {
        toast.success('Mission accomplished! 🎯');
        refreshAchievements();
      }
    } catch (error) { toast.error("Update failed"); }
  };

  const deleteTask = async (id) => {
    try {
      await tasksService.delete(id);
      setTasks(tasks.filter(t => t.id !== id));
      toast.success('Mission deleted');
      refreshAchievements();
    } catch (error) { toast.error("Delete failed"); }
  };

  const saveEdit = async (id) => {
    const currentTask = tasks.find(t => t.id === id);
    if (editingText === currentTask.title || !editingText.trim()) {
      setEditingTaskId(null);
      return;
    }
    try {
      await tasksService.update(id, { title: editingText });
      setTasks(tasks.map(t => t.id === id ? { ...t, title: editingText } : t));
      toast.success('Mission updated', { icon: '✏️' });
    } catch (error) { toast.error("Edit failed"); }
    setEditingTaskId(null);
  };

  return (
    <div className="mission-log-container" style={{
      background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)',
      borderRadius: '24px', padding: '1.5rem', height: '100%',
      display: 'flex', flexDirection: 'column', backdropFilter: 'blur(10px)'
    }}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
      <h3 style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between' }}>
        Mission Log
        <span>{loading ? 'SYNCING...' : `${tasks.filter(t => t.completed).length}/${tasks.length}`}</span>
      </h3>

      <form onSubmit={addTask} style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '16px', border: '1px solid var(--glass-border)', gap: '8px' }}>
          <input
            type="text" placeholder="Add a new mission..."
            value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)}
            style={{ background: 'transparent', border: 'none', flex: 1, padding: '10px 15px', color: 'white', outline: 'none' }}
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-save"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              justifyContent: 'center',
              background: 'var(--primary-color)',
              boxShadow: '0 4px 12px var(--primary-glow)',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={20} />}
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

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {loading ? (
          <>
            <MissionSkeleton />
            <MissionSkeleton />
            <MissionSkeleton />
          </>
        ) : (
          tasks.map((task) => (
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
                    ref={inputRef} value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onBlur={() => saveEdit(task.id)}
                    onKeyDown={(e) => e.key === 'Enter' && saveEdit(task.id)}
                    style={{ background: 'rgba(0,0,0,0.3)', border: 'none', color: 'white', fontSize: '0.9rem', outline: 'none' }}
                  />
                ) : (
                  <span onDoubleClick={() => { setEditingTaskId(task.id); setEditingText(task.title); }} style={{ fontSize: '0.9rem', color: 'white', textDecoration: task.completed ? 'line-through' : 'none', cursor: 'text' }}>
                    {task.title}
                  </span>
                )}
                {task.tag && (
                  <span style={{ fontSize: '0.65rem', color: getTagColor(task.tag), display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold', marginTop: '2px' }}>
                    <TagIcon size={10} /> {task.tag.toUpperCase()}
                  </span>
                )}
              </div>
              <button onClick={() => deleteTask(task.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', opacity: 0.6 }}>
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
        {showAd && !loading && <AdBanner />}
      </div>
    </div>
  );
};

export default MissionLog;