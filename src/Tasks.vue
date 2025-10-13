<template>
  <div class="tasks-container">
    <!-- Header with Search and Filters -->
    <div class="tasks-header">
      <h1>Tasks</h1>
      <div class="tasks-controls">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search tasks..."
          class="search-input"
        />
        <select v-model="statusFilter" class="status-filter">
          <option value="">All Statuses</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="closed">Closed</option>
        </select>
        <button @click="showCreateModal = true" class="btn-primary">
          + New Task
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading">Loading tasks...</div>

    <!-- Error State -->
    <div v-else-if="error" class="error">
      Error loading tasks: {{ error.message }}
    </div>

    <!-- Tasks Table -->
    <div v-else class="tasks-table-wrapper">
      <table class="tasks-table">
        <thead>
          <tr>
            <th>Summary</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Assigned To</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in filteredTasks" :key="task.id">
            <td @dblclick="startEdit(task.id, 'summary', task.summary)">
              <div v-if="editingCell?.taskId === task.id && editingCell?.field === 'summary'">
                <input
                  v-model="editValue"
                  @blur="saveEdit(task)"
                  @keyup.enter="saveEdit(task)"
                  @keyup.esc="cancelEdit"
                  class="inline-edit"
                  ref="editInput"
                />
              </div>
              <div v-else>{{ task.summary }}</div>
            </td>
            <td @dblclick="startEdit(task.id, 'status', task.status)">
              <div v-if="editingCell?.taskId === task.id && editingCell?.field === 'status'">
                <select
                  v-model="editValue"
                  @blur="saveEdit(task)"
                  @change="saveEdit(task)"
                  class="inline-edit"
                  ref="editInput"
                >
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <span v-else :class="`status-badge status-${task.status}`">
                {{ task.status }}
              </span>
            </td>
            <td @dblclick="startEdit(task.id, 'priority', task.priority)">
              <div v-if="editingCell?.taskId === task.id && editingCell?.field === 'priority'">
                <select
                  v-model="editValue"
                  @blur="saveEdit(task)"
                  @change="saveEdit(task)"
                  class="inline-edit"
                  ref="editInput"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <span v-else :class="`priority-badge priority-${task.priority}`">
                {{ task.priority }}
              </span>
            </td>
            <td @dblclick="startEdit(task.id, 'assigned_to', task.assigned_to || '')">
              <div v-if="editingCell?.taskId === task.id && editingCell?.field === 'assigned_to'">
                <input
                  v-model="editValue"
                  @blur="saveEdit(task)"
                  @keyup.enter="saveEdit(task)"
                  @keyup.esc="cancelEdit"
                  class="inline-edit"
                  ref="editInput"
                />
              </div>
              <div v-else>{{ task.assigned_to || '-' }}</div>
            </td>
            <td>{{ formatDate(task.created_at) }}</td>
            <td>
              <button @click="viewTaskDetail(task.id)" class="btn-icon" title="View Details">
                🔍
              </button>
              <button @click="deleteTask(task.id)" class="btn-icon btn-danger" title="Delete">
                🗑️
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create Task Modal -->
    <div v-if="showCreateModal" class="modal-overlay" @click.self="showCreateModal = false">
      <div class="modal">
        <h2>Create New Task</h2>
        <form @submit.prevent="createTask">
          <div class="form-group">
            <label>Summary *</label>
            <input v-model="newTask.summary" required class="form-input" />
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea
              v-model="newTask.description"
              rows="4"
              class="form-input"
              @paste="handlePaste"
            ></textarea>
            <small>Paste images from clipboard</small>
          </div>
          <div class="form-group">
            <label>Status *</label>
            <select v-model="newTask.status" required class="form-input">
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div class="form-group">
            <label>Priority *</label>
            <select v-model="newTask.priority" required class="form-input">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div class="form-group">
            <label>Assigned To</label>
            <input v-model="newTask.assigned_to" class="form-input" />
          </div>
          <div class="form-actions">
            <button type="button" @click="showCreateModal = false" class="btn-secondary">
              Cancel
            </button>
            <button type="submit" class="btn-primary">Create Task</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Task Detail Modal -->
    <TaskDetail
      v-if="selectedTaskId"
      :task-id="selectedTaskId"
      :user-id="userId"
      @close="selectedTaskId = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import {
  useTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation, // ✅ Add this
  type Task,
} from '@y2kfund/core/tasks'
import TaskDetail from './TaskDetail.vue'

interface Props {
  userId?: string
}

const props = withDefaults(defineProps<Props>(), {
  userId: 'default-user',
})

// State
const searchQuery = ref('')
const statusFilter = ref('')
const showCreateModal = ref(false)
const selectedTaskId = ref<string | null>(null)
const editingCell = ref<{ taskId: string; field: string } | null>(null)
const editValue = ref('')
const editInput = ref<HTMLInputElement | null>(null)

const newTask = ref({
  summary: '',
  description: '',
  status: 'open',
  priority: 'medium',
  assigned_to: '',
  created_by: props.userId,
})

// Queries
const filters = computed(() => ({
  status: statusFilter.value || undefined,
  search: searchQuery.value || undefined,
}))

const { data: tasks, isLoading, error } = useTasksQuery(filters.value)
const createMutation = useCreateTaskMutation()
const updateMutation = useUpdateTaskMutation()
const deleteMutation = useDeleteTaskMutation()

// Computed
const filteredTasks = computed(() => tasks.value || [])

// Methods
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString()
}

async function createTask() {
  try {
    await createMutation.mutateAsync(newTask.value)
    showCreateModal.value = false
    resetForm()
  } catch (err) {
    console.error('Failed to create task:', err)
  }
}

function resetForm() {
  newTask.value = {
    summary: '',
    description: '',
    status: 'open',
    priority: 'medium',
    assigned_to: '',
    created_by: props.userId,
  }
}

async function startEdit(taskId: string, field: string, currentValue: string) {
  editingCell.value = { taskId, field }
  editValue.value = currentValue
  await nextTick()
  editInput.value?.focus()
}

function cancelEdit() {
  editingCell.value = null
  editValue.value = ''
}

async function saveEdit(task: Task) {
  if (!editingCell.value) return
  
  const { field } = editingCell.value
  
  if (editValue.value !== task[field as keyof Task]) {
    try {
      await updateMutation.mutateAsync({
        id: task.id,
        updates: { [field]: editValue.value },
        userId: props.userId,
      })
    } catch (err) {
      console.error('Failed to update task:', err)
    }
  }
  
  cancelEdit()
}

function viewTaskDetail(taskId: string) {
  selectedTaskId.value = taskId
}

async function deleteTask(taskId: string) {
  if (confirm('Are you sure you want to delete this task?')) {
    try {
      await deleteMutation.mutateAsync(taskId)
    } catch (err) {
      console.error('Failed to delete task:', err)
    }
  }
}

async function handlePaste(event: ClipboardEvent) {
  const items = event.clipboardData?.items
  if (!items) return

  for (const item of items) {
    if (item.type.indexOf('image') !== -1) {
      event.preventDefault()
      const blob = item.getAsFile()
      if (blob) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const base64 = e.target?.result as string
          newTask.value.description += `\n![image](${base64})\n`
        }
        reader.readAsDataURL(blob)
      }
    }
  }
}
</script>

<style scoped>
.tasks-container {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.tasks-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.tasks-controls {
  display: flex;
  gap: 1rem;
}

.search-input,
.status-filter {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.search-input {
  min-width: 300px;
}

.tasks-table-wrapper {
  overflow-x: auto;
}

.tasks-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.tasks-table th,
.tasks-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.tasks-table th {
  background: #f8f9fa;
  font-weight: 600;
}

.tasks-table tbody tr:hover {
  background: #f8f9fa;
}

.inline-edit {
  width: 100%;
  padding: 0.25rem;
  border: 1px solid #007bff;
  border-radius: 4px;
}

.status-badge,
.priority-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-open { background: #e3f2fd; color: #1976d2; }
.status-in-progress { background: #fff3e0; color: #f57c00; }
.status-completed { background: #e8f5e9; color: #388e3c; }
.status-closed { background: #f5f5f5; color: #757575; }

.priority-low { background: #e8f5e9; color: #388e3c; }
.priority-medium { background: #fff3e0; color: #f57c00; }
.priority-high { background: #ffe0b2; color: #e64a19; }
.priority-critical { background: #ffebee; color: #c62828; }

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0.25rem;
  margin: 0 0.25rem;
}

.btn-icon:hover {
  opacity: 0.7;
}

.btn-primary {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-secondary {
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.loading,
.error {
  text-align: center;
  padding: 2rem;
}

.error {
  color: #c62828;
}
</style>