import React, { useRef, useState } from 'react';
import { TEXTS } from '@/shared/constants/texts.constants';
import { useTasks } from '@/features/tasks/hooks/useTasks';
import { useTags } from '@/features/tags/hooks/useTags';
import TagInput from '../../tags/components/TagInput';
import EmptyTasks from './EmptyTasks';
import TagSelector from '@/features/tags/components/TagSelector';
import { CreateTaskDto, TaskResponse } from '@/features/tasks/types/task.dto';
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
  const { tags, addTag, updateTag } = useTags();

  const missionInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [isAddingFirstTag, setIsAddingFirstTag] = useState(false);

  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [est, setEst] = useState(1);
  const [tagName, setTagName] = useState('General');
  const [tagColor, setTagColor] = useState('#e11d48');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [confirmDeleteTaskId, setConfirmDeleteTaskId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cleanName = name.trim();

    if (cleanName.length < 2) {
      setNameError('Enter at least 2 characters for the mission.');
      missionInputRef.current?.focus();
      return;
    }

    setNameError('');
    let finalTagId = selectedTagId;
    let finalTagName = '';

    if (selectedTagId) {
      const selectedTag = tags.find((tag) => tag.id === selectedTagId);
      if (selectedTag) finalTagName = selectedTag.name;
    } else {
      finalTagName = tagName.trim() || 'General';
      const existingTag = tags.find((tag) => tag.name.toLowerCase() === finalTagName.toLowerCase());

      if (!existingTag) {
        finalTagId = `local-tag-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        await addTag({ id: finalTagId, name: finalTagName, color: tagColor });
      } else {
        finalTagId = existingTag.id;
        if (existingTag.color !== tagColor) await updateTag(existingTag.id, { color: tagColor });
      }
    }

    const newTaskPayload: CreateTaskDto = { title: cleanName };
    if (finalTagId) newTaskPayload.tagIds = [finalTagId];
    await addTask(newTaskPayload);

    setName('');
    setEst(1);
    setSelectedTagId(null);
    setTagName('General');
    setIsAddingFirstTag(false);
  };

  const handleStartEdit = (task: TaskResponse) => {
    setEditingId(task.id);
    setEditValue(task.title);
  };

  const handleSaveEdit = async (id: string) => {
    if (editValue.trim().length >= 2) await updateTask(id, { title: editValue.trim() });
    setEditingId(null);
  };

  const focusMissionInput = () => {
    missionInputRef.current?.focus();
  };

  return (
    <div className="flex flex-col bg-[#0a0a0a]/80 shadow-2xl backdrop-blur-xl p-3 xs:p-4 lg:p-4 2xl:p-5 border border-white/5 rounded-[1.75rem] sm:rounded-[2rem] 2xl:rounded-[2.25rem] h-full min-h-0 overflow-hidden task-manager-card">
      <div className="flex justify-between items-center mb-3 2xl:mb-4 px-1 shrink-0">
        <h2 className="flex items-center gap-2.5 2xl:gap-3 font-black text-white text-[11px] 2xl:text-sm uppercase tracking-[0.18em] sm:tracking-[0.2em] min-w-0"><span className="bg-[#00ffd5] shadow-[0_0_10px_#00ffd5] rounded-full w-2 h-2 shrink-0" /><span className="truncate">{TEXTS.tasks.missionLog}</span></h2>
        <button type="button" className="task-icon-action flex items-center justify-center text-white/40 hover:text-white transition-colors" aria-label="Mission log settings"><Settings2 size={16} /></button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2 mb-3 2xl:mb-5 px-1 shrink-0" noValidate>
        <div className="space-y-1.5">
          <label htmlFor="mission-title" className="block px-1 font-bold text-[10px] text-white/60 uppercase tracking-[0.12em]">Mission title</label>
          <input
            ref={missionInputRef}
            id="mission-title"
            type="text"
            value={name}
            onChange={(e) => {
              const value = e.target.value;
              setName(value);
              if (nameError && value.trim().length >= 2) setNameError('');
            }}
            placeholder={TEXTS.tasks.nextObjective}
            className={`task-name-input bg-black/40 shadow-inner px-4 border rounded-2xl focus:outline-none w-full text-white placeholder:text-white/40 text-sm ${nameError ? 'border-red-500/70' : 'border-white/10 focus:border-[#00ffd5]/50'}`}
            maxLength={40}
            aria-invalid={Boolean(nameError)}
            aria-describedby={nameError ? 'mission-title-error' : undefined}
            autoComplete="off"
          />
          {nameError && <p id="mission-title-error" role="alert" className="px-1 text-[12px] text-red-400 leading-snug">{nameError}</p>}
        </div>

        {tags.length === 0 ? (!isAddingFirstTag ? (
          <button type="button" onClick={() => setIsAddingFirstTag(true)} className="flex justify-center items-center gap-2 border-white/10 hover:border-white/20 bg-black/40 min-h-12 px-4 border rounded-2xl w-full font-bold text-white/60 hover:text-white/90 text-xs uppercase transition-all tracking-[0.1em]"><Plus size={14} />{TEXTS.tags.addTag}</button>
        ) : (
          <TagInput tagName={tagName} setTagName={setTagName} tagColor={tagColor} setTagColor={setTagColor} />
        )) : (
          <><TagSelector selectedTagId={selectedTagId} onSelectTag={setSelectedTagId} />{!selectedTagId && <TagInput tagName={tagName} setTagName={setTagName} tagColor={tagColor} setTagColor={setTagColor} />}</>
        )}

        <div className="flex items-center gap-2">
          <div className="flex flex-1 justify-between items-center bg-black/40 px-3 min-h-12 border border-white/10 rounded-2xl min-w-0"><span className="font-black text-[10px] text-white/60 uppercase tracking-[0.1em] truncate">{TEXTS.tasks.estPomos}</span><div className="flex items-center gap-1 font-bold text-white shrink-0"><button type="button" onClick={() => setEst(Math.max(1, est - 1))} className="task-stepper-button text-white/60 hover:text-white transition-colors" aria-label="Decrease estimated pomodoros">−</button><span className="w-5 text-sm text-center tabular-nums" aria-live="polite">{est}</span><button type="button" onClick={() => setEst(Math.min(10, est + 1))} className="task-stepper-button text-white/60 hover:text-white transition-colors" aria-label="Increase estimated pomodoros">+</button></div></div>
          <button type="submit" disabled={loading} className="task-submit-button flex items-center justify-center bg-white hover:bg-[#00ffd5] disabled:opacity-60 rounded-2xl text-black active:scale-95 transition-all shrink-0" aria-label="Add mission">{loading ? <Loader2 className="animate-spin" size={21} /> : <Plus size={21} strokeWidth={3} />}</button>
        </div>
      </form>

      <div className="flex-1 space-y-2 px-1 overflow-y-auto custom-scrollbar min-h-0">
        {tasks.length === 0 && !loading ? <EmptyTasks onCreate={focusMissionInput} /> : tasks.map((task: TaskResponse) => {
          const tagData = tags.find((tag) => task.tags?.some((t) => t.id === tag.id) || task.tagIds?.includes(tag.id));
          const displayColor = tagData?.color || '#5fbfff';
          const isEditing = editingId === task.id;
          const isConfirmingDelete = confirmDeleteTaskId === task.id;

          return (
            <div key={task.id} className={`group flex items-center justify-between gap-2 px-3 py-3 2xl:px-4 2xl:py-3.5 border rounded-2xl transition-all min-h-[52px] ${task.status === 'DONE' ? 'bg-black/20 border-white/5 opacity-60' : 'bg-surface/40 border-white/10 hover:border-white/20'}`}>
              {isConfirmingDelete ? (
                <div className="flex flex-1 items-center justify-between min-w-0" onClick={(e) => e.stopPropagation()}><span className="font-bold text-red-500 text-xs truncate mr-2">Delete task?</span><div className="flex items-center gap-1 shrink-0 text-xs"><button type="button" onClick={() => { removeTask(task.id); setConfirmDeleteTaskId(null); }} className="task-icon-action font-bold text-red-400 hover:text-red-300 uppercase tracking-wider cursor-pointer">Yes</button><button type="button" onClick={() => setConfirmDeleteTaskId(null)} className="task-icon-action font-bold text-white/60 hover:text-white uppercase tracking-wider cursor-pointer">No</button></div></div>
              ) : (
                <><div className="flex flex-1 items-center gap-2.5 2xl:gap-3 min-w-0"><button type="button" onClick={() => toggleTask(task)} className="task-icon-action flex items-center justify-center shrink-0" aria-label={task.status === 'DONE' ? `Mark ${task.title} as pending` : `Mark ${task.title} as done`}>{task.status === 'DONE' ? <CheckCircle2 className="text-[#00ffd5]" size={20} /> : <Circle className="text-white/50" size={20} />}</button><div className="flex-1 min-w-0">{isEditing ? <div className="flex items-center gap-1 min-w-0"><input autoFocus type="text" value={editValue} onChange={(e) => setEditValue(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleSaveEdit(task.id); if (e.key === 'Escape') setEditingId(null); }} className="flex-1 bg-transparent py-1 border-[#00ffd5] border-b outline-none font-bold text-white text-sm min-w-0" aria-label="Edit mission title" /><button type="button" onClick={() => handleSaveEdit(task.id)} className="task-icon-action flex items-center justify-center text-[#00ffd5] shrink-0" aria-label="Save mission"><Check size={15} /></button><button type="button" onClick={() => setEditingId(null)} className="task-icon-action flex items-center justify-center text-white/50 hover:text-white shrink-0" aria-label="Cancel editing"><X size={15} /></button></div> : <p className={`font-bold text-[13px] 2xl:text-sm truncate cursor-text ${task.status === 'DONE' ? 'line-through text-white/50' : 'text-white/80'}`} onDoubleClick={() => handleStartEdit(task)}>{task.title}</p>}{tagData && <div className="flex items-center gap-1.5 mt-1 min-w-0"><TagIcon size={10} style={{ color: displayColor }} className="shrink-0" /><span className="font-black text-[9px] uppercase tracking-[0.1em] truncate" style={{ color: displayColor, opacity: 0.75 }}>{tagData.name}</span></div>}</div></div><div className="flex items-center gap-0.5 opacity-70 hover:opacity-100 transition-opacity shrink-0">{!isEditing && <button type="button" onClick={() => handleStartEdit(task)} className="task-icon-action flex items-center justify-center text-white/50 hover:text-white" aria-label={`Edit ${task.title}`}><Edit2 size={14} /></button>}<button type="button" onClick={() => setConfirmDeleteTaskId(task.id)} className="task-icon-action flex items-center justify-center text-white/50 hover:text-red-500" aria-label={`Delete ${task.title}`}><Trash2 size={14} /></button></div></>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskManager;
