import 'fake-indexeddb/auto'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { db } from '@/infrastructure/database/db'
import { tasksLocalRepository } from '@/features/tasks/repositories/tasks.local.repository'
import { settingsLocalRepository } from '@/features/settings/repositories/settings.local.repository'
import { addToSyncQueue, getSyncQueueSize } from '@/infrastructure/sync/syncManager'

const setProfile = (id: string, name: string) => {
  localStorage.setItem('ataraxia_local_profile', JSON.stringify({ id, name }))
}

const baseSettings = {
  id: 'me',
  pomodoroLength: 25,
  shortBreakLength: 5,
  longBreakLength: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  soundEnabled: true,
  volume: 50,
  theme: 'dark' as const,
  language: 'en',
  timeFormat: '24h' as const,
  weekStart: 'monday' as const,
  notificationsEnabled: true,
  syncStatus: 'synced' as const,
  updatedAt: 1,
}

describe('local owner isolation', () => {
  beforeEach(async () => {
    localStorage.clear()
    await db.open()
    await Promise.all([
      db.tasks.clear(),
      db.tags.clear(),
      db.settings.clear(),
      db.syncQueue.clear(),
      db.timerSessions.clear(),
    ])
  })

  afterEach(async () => {
    localStorage.clear()
    await Promise.all([
      db.tasks.clear(),
      db.tags.clear(),
      db.settings.clear(),
      db.syncQueue.clear(),
      db.timerSessions.clear(),
    ])
  })

  it('keeps tasks, settings and queued mutations isolated across local profiles', async () => {
    setProfile('account-a', 'Account A')

    const taskA = await tasksLocalRepository.create({
      title: 'Private task A',
      tagIds: [],
    })
    await settingsLocalRepository.save({ ...baseSettings, pomodoroLength: 35 })
    await addToSyncQueue({
      method: 'POST',
      url: '/tasks',
      entity: 'tasks',
      entityId: taskA.id,
      data: taskA,
    })

    expect((await tasksLocalRepository.getAll()).map((task) => task.title)).toEqual(['Private task A'])
    expect((await settingsLocalRepository.get())?.pomodoroLength).toBe(35)
    expect(await getSyncQueueSize()).toBe(1)

    setProfile('account-b', 'Account B')

    expect(await tasksLocalRepository.getAll()).toEqual([])
    expect(await settingsLocalRepository.get()).toBeNull()
    expect(await getSyncQueueSize()).toBe(0)

    const taskB = await tasksLocalRepository.create({
      title: 'Private task B',
      tagIds: [],
    })
    await settingsLocalRepository.save({ ...baseSettings, pomodoroLength: 20 })
    await addToSyncQueue({
      method: 'POST',
      url: '/tasks',
      entity: 'tasks',
      entityId: taskB.id,
      data: taskB,
    })

    expect((await tasksLocalRepository.getAll()).map((task) => task.title)).toEqual(['Private task B'])
    expect((await settingsLocalRepository.get())?.pomodoroLength).toBe(20)
    expect(await getSyncQueueSize()).toBe(1)

    setProfile('account-a', 'Account A')

    expect((await tasksLocalRepository.getAll()).map((task) => task.title)).toEqual(['Private task A'])
    expect((await settingsLocalRepository.get())?.pomodoroLength).toBe(35)
    expect(await getSyncQueueSize()).toBe(1)
  })
})
