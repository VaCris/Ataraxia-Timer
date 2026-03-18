import React, { useState } from 'react';
import { useTasks } from '@hooks/useTasks';
import { useTags } from '@hooks/useTags';
import TagInput from '../tags/TagInput';
import EmptyTasks from './EmptyTasks';
import { TaskResponse } from '@api/tasks/dto/task.dto';
import { Plus, Trash2, CheckCircle2, Circle, Tag as TagIcon, Loader2, Settings2, Edit2, Check, X } from 'lucide-react';

const TaskManager = () => {
  const { tasks, loading, addTask, toggleTask, removeTask, updateTask } = useTasks();
  const { tags, addTag, updateTag } = useTags();

  const [name, setName] = useState('');
  const [est, setEst] = useState(1);
  const [tagName, setTagName] = useState('General');
  const [tagColor, setTagColor] = useState('#e11d48');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name.trim().length < 2) return;

    const cleanTagName = tagName.trim() || 'General';
    const existingTag = tags.find(t => t.name.toLowerCase() === cleanTagName.toLowerCase());

    if (!existingTag) {
      await addTag({ name: cleanTagName, color: tagColor });
    } else if (existingTag.color !== tagColor) {
      await updateTag(existingTag.id, { color: tagColor });
    }

    await addTask({ title: name.trim(), tag: cleanTagName });

    setName('');
    setEst(1);
  };

  const handleStartEdit = (task: TaskResponse) => {
    setEditingId(task.id);
    setEditValue(task.title);
  };

  const handleSaveEdit = async (id: string) => {
    if (editValue.trim().length >= 2) {
      await updateTask(id, { title: editValue.trim() });
    }
    setEditingId(null);
  };

  return (
    <div className="flex flex-col bg-[#0a0a0a]/80 shadow-2xl backdrop-blur-xl p-6 border border-white/5 rounded-[2.5rem] h-full overflow-hidden">
      <div className="flex justify-between items-center mb-6 px-2">
        <h2 className="flex items-center gap-3 font-black text-white text-sm uppercase tracking-[0.2em]">
          <span className="bg-[#00ffd5] shadow-[0_0_10px_#00ffd5] rounded-full w-2 h-2"></span>
          Mission Log
        </h2>
        <Settings2 size={18} className="text-white/20 hover:text-white cursor-pointer" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 mb-8 px-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="What's the next objective?"
          className="bg-black/40 shadow-inner px-5 py-4 border border-white/5 focus:border-[#00ffd5]/30 rounded-2xl focus:outline-none w-full text-white placeholder:text-white/10 text-sm"
          maxLength={40}
        />

        <TagInput
          tagName={tagName}
          setTagName={setTagName}
          tagColor={tagColor}
          setTagColor={setTagColor}
        />

        <div className="flex items-center gap-3">
          <div className="flex flex-1 justify-between items-center bg-black/40 px-5 py-3 border border-white/5 rounded-2xl">
            <span className="font-black text-[10px] text-white/20 uppercase tracking-widest">Est. Pomos</span>
            <div className="flex items-center gap-4 font-bold text-white">
              <button type="button" onClick={() => setEst(Math.max(1, est - 1))} className="opacity-40 hover:opacity-100">-</button>
              <span className="w-4 text-sm text-center">{est}</span>
              <button type="button" onClick={() => setEst(Math.min(10, est + 1))} className="opacity-40 hover:opacity-100">+</button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="bg-white hover:bg-[#00ffd5] p-4 rounded-2xl text-black active:scale-95 transition-all">
            {loading ? <Loader2 className="animate-spin" size={24} /> : <Plus size={24} strokeWidth={3} />}
          </button>
        </div>
      </form>

      <div className="flex-1 space-y-3 px-2 overflow-y-auto custom-scrollbar">
        {tasks.length === 0 && !loading ? (
          <EmptyTasks />
        ) : (
          tasks.map(task => {
            const tagData = tags.find(t => t.name.toLowerCase() === (task.tag || '').toLowerCase());
            const displayColor = tagData?.color || '#5fbfff';
            const isEditing = editingId === task.id;

            return (
              <div key={task.id} className={`group flex items-center justify-between p-5 rounded-3xl border transition-all ${task.completed ? 'bg-black/20 border-white/5 opacity-40' : 'bg-surface/40 border-white/5 hover:border-white/10'}`}>
                <div className="flex flex-1 items-center gap-4">
                  <button onClick={() => toggleTask(task)}>
                    {task.completed ? <CheckCircle2 className="text-[#00ffd5]" size={22} /> : <Circle className="text-white/20" size={22} />}
                  </button>
                  <div className="flex-1 min-w-0">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input
                          autoFocus
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(task.id)}
                          className="flex-1 bg-black/40 py-1 border-[#00ffd5] border-b outline-none font-bold text-white text-sm"
                        />
                        <button onClick={() => handleSaveEdit(task.id)} className="p-1 text-[#00ffd5]">
                          <Check size={16} />
                        </button>
                        <button onClick={() => setEditingId(null)} className="p-1 text-white/20">
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <p
                        className={`text-sm font-bold truncate cursor-text ${task.completed ? 'line-through text-white/20' : 'text-white/80'}`}
                        onDoubleClick={() => handleStartEdit(task)}
                      >
                        {task.title}
                      </p>
                    )}
                    {task.tag && (
                      <div className="flex items-center gap-2 mt-1.5">
                        <TagIcon size={10} style={{ color: displayColor }} />
                        <span className="font-black text-[9px] uppercase tracking-widest" style={{ color: displayColor, opacity: 0.5 }}>{task.tag}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  {!isEditing && (
                    <button onClick={() => handleStartEdit(task)} className="p-2 text-white/10 hover:text-white">
                      <Edit2 size={16} />
                    </button>
                  )}
                  <button onClick={() => removeTask(task.id)} className="p-2 text-white/10 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TaskManager;