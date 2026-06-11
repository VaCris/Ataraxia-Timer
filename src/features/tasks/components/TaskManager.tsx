import React, { useState } from 'react';
import { useTasks } from '@/features/tasks/hooks/useTasks';
import { useTags } from '@/features/tags/hooks/useTags';
import EmptyTasks from './EmptyTasks';
import TagSelector from '@/features/tags/components/TagSelector';
import { TaskResponse } from '@/features/tasks/types/task.dto';
import {
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Tag as TagIcon,
  Loader2,
  Settings2,
  Edit2,
  Check,
  X,
} from 'lucide-react';

const TaskManager = () => {
  const { tasks, loading, addTask, toggleTask, removeTask, updateTask } = useTasks();
  const { tags } = useTags();
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [est, setEst] = useState(1);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (name.trim().length < 2) return;

    // Buscamos la categoría seleccionada para extraer su nombre string
    const selectedTag = tags.find((tag) => tag.id === selectedTagId);
    const cleanTagName = selectedTag ? selectedTag.name : '';

    await addTask({
      title: name.trim(),
      tag: cleanTagName,
    });

    setName('');
    setEst(1);
    setSelectedTagId(null);
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
    <div className="flex flex-col bg-[#0a0a0a]/80 shadow-2xl backdrop-blur-xl p-3 xs:p-4 lg:p-4 2xl:p-5 border border-white/5 rounded-[1.75rem] sm:rounded-[2rem] 2xl:rounded-[2.25rem] h-full min-h-0 overflow-hidden">
      <div className="flex justify-between items-center mb-3 2xl:mb-4 px-1 shrink-0">
        <h2 className="flex items-center gap-2.5 2xl:gap-3 font-black text-white text-[11px] 2xl:text-sm uppercase tracking-[0.18em] sm:tracking-[0.2em] min-w-0">
          <span className="bg-[#00ffd5] shadow-[0_0_10px_#00ffd5] rounded-full w-2 h-2 shrink-0" />
          <span className="truncate">Mission Log</span>
        </h2>

        <Settings2
          size={16}
          className="text-white/20 hover:text-white transition-colors cursor-pointer shrink-0"
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-2 mb-3 2xl:mb-5 px-1 shrink-0">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="What's the next objective?"
          className="bg-black/40 shadow-inner px-4 py-3 2xl:py-3.5 border border-white/5 focus:border-[#00ffd5]/30 rounded-2xl focus:outline-none w-full text-white placeholder:text-white/10 text-sm"
          maxLength={40}
        />

        {/* Reemplazo de TagInput por tu nuevo TagSelector */}
        <TagSelector
          selectedTagId={selectedTagId}
          onSelectTag={setSelectedTagId}
        />

        <div className="flex items-center gap-2">
          <div className="flex flex-1 justify-between items-center bg-black/40 px-3 py-2 2xl:py-2.5 border border-white/5 rounded-2xl min-w-0">
            <span className="font-black text-[8px] xs:text-[9px] text-white/20 uppercase tracking-widest truncate">
              Est. Pomos
            </span>

            <div className="flex items-center gap-2 font-bold text-white shrink-0">
              <button
                type="button"
                onClick={() => setEst(Math.max(1, est - 1))}
                className="opacity-40 hover:opacity-100 px-1 transition-opacity"
              >
                -
              </button>

              <span className="w-4 text-sm text-center">{est}</span>

              <button
                type="button"
                onClick={() => setEst(Math.min(10, est + 1))}
                className="opacity-40 hover:opacity-100 px-1 transition-opacity"
              >
                +
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-white hover:bg-[#00ffd5] disabled:opacity-60 p-3 2xl:p-3.5 rounded-2xl text-black active:scale-95 transition-all shrink-0"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={21} />
            ) : (
              <Plus size={21} strokeWidth={3} />
            )}
          </button>
        </div>
      </form>

      <div className="flex-1 space-y-2 px-1 overflow-y-auto custom-scrollbar min-h-0">
        {tasks.length === 0 && !loading ? (
          <EmptyTasks />
        ) : (
          tasks.map((task) => {
            const tagData = tags.find(
              (tag) => tag.name.toLowerCase() === (task.tag || '').toLowerCase()
            );

            const displayColor = tagData?.color || '#5fbfff';
            const isEditing = editingId === task.id;

            return (
              <div
                key={task.id}
                className={`group flex items-center justify-between gap-2 px-3 py-3 2xl:px-4 2xl:py-3.5 border rounded-2xl transition-all ${task.completed
                  ? 'bg-black/20 border-white/5 opacity-40'
                  : 'bg-surface/40 border-white/5 hover:border-white/10'
                  }`}
              >
                <div className="flex flex-1 items-center gap-2.5 2xl:gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={() => toggleTask(task)}
                    className="shrink-0"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="text-[#00ffd5]" size={20} />
                    ) : (
                      <Circle className="text-white/20" size={20} />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    {isEditing ? (
                      <div className="flex items-center gap-2 min-w-0">
                        <input
                          autoFocus
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleSaveEdit(task.id);
                            }
                          }}
                          className="flex-1 bg-black/40 py-1 border-[#00ffd5] border-b outline-none font-bold text-white text-sm min-w-0"
                        />

                        <button
                          type="button"
                          onClick={() => handleSaveEdit(task.id)}
                          className="p-1 text-[#00ffd5] shrink-0"
                        >
                          <Check size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="p-1 text-white/20 hover:text-white/60 shrink-0"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    ) : (
                      <p
                        className={`font-bold text-[13px] 2xl:text-sm truncate cursor-text ${task.completed
                          ? 'line-through text-white/20'
                          : 'text-white/80'
                          }`}
                        onDoubleClick={() => handleStartEdit(task)}
                      >
                        {task.title}
                      </p>
                    )}

                    {task.tag && (
                      <div className="flex items-center gap-1.5 mt-1 min-w-0">
                        <TagIcon size={10} style={{ color: displayColor }} className="shrink-0" />

                        <span
                          className="font-black text-[8px] uppercase tracking-widest truncate"
                          style={{
                            color: displayColor,
                            opacity: 0.55,
                          }}
                        >
                          {task.tag}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-0.5 opacity-100 sm:group-hover:opacity-100 sm:opacity-0 transition-all shrink-0">
                  {!isEditing && (
                    <button
                      type="button"
                      onClick={() => handleStartEdit(task)}
                      className="p-1.5 text-white/20 sm:text-white/15 hover:text-white"
                    >
                      <Edit2 size={14} />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => removeTask(task.id)}
                    className="p-1.5 text-white/20 sm:text-white/15 hover:text-red-500"
                  >
                    <Trash2 size={14} />
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