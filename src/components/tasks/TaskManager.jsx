import React, { useState, useEffect } from 'react';
import { useTasks } from '@hooks/useTasks'; // Tu hook con estado local y persistencia
import { useTags } from '@hooks/useTags';   // Hook para gestionar etiquetas y colores
import EmptyTasks from './EmptyTasks';
import {
  Plus, Trash2, CheckCircle2, Circle,
  Tag as TagIcon, Hash, Loader2, Settings2
} from 'lucide-react';

const TaskManager = () => {
  // 1. Usamos tu hook useTasks y useTags
  const { tasks, loading: tasksLoading, addTask, toggleTask, removeTask } = useTasks();
  const { tags, addTag } = useTags();

  // 2. Estados locales para el diseño "Mission Log"
  const [name, setName] = useState('');
  const [est, setEst] = useState(1);
  const [tagName, setTagName] = useState('General');
  const [tagColor, setTagColor] = useState('#e11d48'); // Color predeterminado Ataraxia

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name.trim().length < 2) return;

    const cleanTagName = tagName.trim() || 'General';

    try {
      // 3. Verificamos si el tag existe para que el servidor guarde su color
      const existingTag = tags.find(t => t.name.toLowerCase() === cleanTagName.toLowerCase());

      // 4. Si es un tag nuevo, lo creamos primero (CreateTagDto: {name, color})
      if (!existingTag) {
        await addTag({ name: cleanTagName, color: tagColor });
      }

      // 5. Creamos la tarea (CreateTaskDto: {title, tag})
      // Solo enviamos lo que el DTO permite para evitar el error 400
      await addTask({
        title: name.trim(),
        tag: cleanTagName
      });

      // Reset campos
      setName('');
      setEst(1);
    } catch (err) {
      console.error("Error en la misión:", err);
    }
  };

  return (
    <div className="flex flex-col bg-[#0a0a0a]/80 shadow-2xl backdrop-blur-xl p-6 border border-white/5 rounded-[2.5rem] h-full overflow-hidden">

      {/* HEADER MISSION LOG */}
      <div className="flex justify-between items-center mb-6 px-2">
        <h2 className="flex items-center gap-3 font-black text-white text-sm uppercase tracking-[0.2em]">
          <span className="bg-[#00ffd5] shadow-[0_0_10px_#00ffd5] rounded-full w-2 h-2"></span>
          Mission Log
        </h2>
        <Settings2 size={18} className="text-white/20 hover:text-white transition-colors cursor-pointer" />
      </div>

      {/* FORMULARIO DE ENTRADA (DISEÑO EXACTO A LA IMAGEN) */}
      <form onSubmit={handleSubmit} className="space-y-3 mb-8 px-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="What's the next objective?"
          className="bg-black/40 shadow-inner px-5 py-4 border border-white/5 focus:border-[#00ffd5]/30 rounded-2xl focus:outline-none w-full text-white placeholder:text-white/10 text-sm transition-all"
          maxLength={40}
        />

        <div className="flex items-center gap-3">
          <div className="group relative flex flex-1 items-center bg-black/40 px-4 py-3 border border-white/5 focus-within:border-white/10 rounded-2xl">
            <TagIcon className="mr-3 text-white/20" size={14} />
            <input
              type="text"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              placeholder="Tag"
              className="bg-transparent outline-none w-full font-black text-white text-xs uppercase tracking-widest"
            />
          </div>
          {/* Botón de Color # */}
          <div className="group relative">
            <div
              className="flex justify-center items-center shadow-lg border border-white/10 rounded-xl w-10 h-10 hover:scale-105 transition-transform cursor-pointer"
              style={{ backgroundColor: tagColor }}
            >
              <Hash size={14} className="text-black/40" />
              <input
                type="color"
                value={tagColor}
                onChange={(e) => setTagColor(e.target.value)}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-1 justify-between items-center bg-black/40 px-5 py-3 border border-white/5 rounded-2xl">
            <span className="font-black text-[10px] text-white/20 uppercase tracking-widest">Est. Pomos</span>
            <div className="flex items-center gap-4 font-bold text-white">
              <button type="button" onClick={() => setEst(Math.max(1, est - 1))} className="opacity-40 hover:opacity-100">-</button>
              <span className="w-4 text-sm text-center">{est}</span>
              <button type="button" onClick={() => setEst(Math.min(10, est + 1))} className="opacity-40 hover:opacity-100">+</button>
            </div>
          </div>
          <button
            type="submit"
            disabled={tasksLoading}
            className="bg-white hover:bg-[#00ffd5] disabled:opacity-20 shadow-xl p-4 rounded-2xl text-black active:scale-95 transition-all"
          >
            {tasksLoading ? <Loader2 size={24} className="animate-spin" /> : <Plus size={24} strokeWidth={3} />}
          </button>
        </div>
      </form>

      {/* LISTA DE TAREAS (DISEÑO SOLICITADO) */}
      <div className="flex-1 space-y-3 px-2 overflow-y-auto custom-scrollbar">
        {tasks.length === 0 && !tasksLoading ? (
          <EmptyTasks />
        ) : (
          tasks.map((task) => {
            // VINCULACIÓN DE COLOR: Buscamos el color en el array global de tags por el nombre
            // Como el servidor guarda el tag, lo mapeamos aquí para recuperar el color al refrescar.
            const tagData = tags.find(t => t.name.toLowerCase() === (task.tag || '').toLowerCase());
            const displayColor = tagData?.color || '#5fbfff';

            return (
              <div key={task.id} className={`group flex items-center justify-between p-5 rounded-3xl border transition-all ${task.completed ? 'bg-black/20 border-white/5 opacity-40' : 'bg-[#121212]/40 border-white/5 hover:border-white/10'
                }`}>
                <div className="flex flex-1 items-center gap-4">
                  <button
                    onClick={() => toggleTask(task.id, task.completed)}
                    className="active:scale-90 transition-transform"
                  >
                    {task.completed ? <CheckCircle2 className="text-[#00ffd5]" size={22} /> : <Circle className="text-white/20" size={22} />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold tracking-tight transition-all ${task.completed ? 'line-through text-white/20' : 'text-white/80'}`}>
                      {task.title}
                    </p>

                    {/* TAG VISUAL DEBAJO (NOMBRE + COLOR DINÁMICO) */}
                    {task.tag && (
                      <div className="flex items-center gap-2 mt-1.5">
                        <TagIcon size={10} style={{ color: displayColor }} />
                        <span className="font-black text-[9px] uppercase tracking-widest" style={{ color: displayColor, opacity: 0.5 }}>
                          {task.tag}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => removeTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-white/5 hover:text-red-500 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TaskManager;