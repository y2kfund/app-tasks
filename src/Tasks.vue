<template>
  <div class="tasks-card">
    <!-- Loading state -->
    <div v-if="isLoading" class="loading">
      <div class="loading-spinner"></div>
      Loading tasks...
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error">
      <h3>Error loading tasks</h3>
      <p>{{ error }}</p>
    </div>

    <!-- Task List View -->
    <div v-else-if="currentView === 'list'" class="tasks-container">
      <div class="tasks-header">
        <h2 
          :class="{ 'tasks-header-clickable': props.showHeaderLink }"
          @click="props.showHeaderLink && emit('navigate')"
        >
          Tasks Management
        </h2>
        <div class="tasks-header-actions">
          <button class="btn btn-primary" @click="showCreateView">
            <span class="icon">➕</span> New Task
          </button>
          <button 
            class="btn btn-minimize" 
            @click="emit('minimize')"
            title="Minimize"
          >
            ➖
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="tasks-filters">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search tasks..."
          class="filter-input"
        />
        <select v-model="statusFilter" class="filter-select">
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <!-- Tasks Table -->
      <div class="tasks-table-wrapper">
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
              <td class="editable-cell" @dblclick="startEditCell(task, 'summary')">
                <input
                  v-if="editingCell?.taskId === task.id && editingCell?.field === 'summary'"
                  ref="editInput"
                  v-model="editValue"
                  type="text"
                  @blur="saveEdit(task, 'summary')"
                  @keyup.enter="saveEdit(task, 'summary')"
                  @keyup.escape="cancelEdit"
                />
                <span v-else>{{ task.summary }}</span>
              </td>
              <td class="editable-cell" @dblclick="startEditCell(task, 'status')">
                <select
                  v-if="editingCell?.taskId === task.id && editingCell?.field === 'status'"
                  v-model="editValue"
                  @blur="saveEdit(task, 'status')"
                  @change="saveEdit(task, 'status')"
                  autofocus
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <span v-else :class="`status-badge status-${task.status}`">
                  {{ task.status.replace('_', ' ') }}
                </span>
              </td>
              <td class="editable-cell" @dblclick="startEditCell(task, 'priority')">
                <select
                  v-if="editingCell?.taskId === task.id && editingCell?.field === 'priority'"
                  v-model="editValue"
                  @blur="saveEdit(task, 'priority')"
                  @change="saveEdit(task, 'priority')"
                  autofocus
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <span v-else :class="`priority-badge priority-${task.priority}`">
                  {{ task.priority }}
                </span>
              </td>
              <td class="editable-cell" @dblclick="startEditCell(task, 'assigned_to')">
                <input
                  v-if="editingCell?.taskId === task.id && editingCell?.field === 'assigned_to'"
                  ref="editInput"
                  v-model="editValue"
                  type="text"
                  @blur="saveEdit(task, 'assigned_to')"
                  @keyup.enter="saveEdit(task, 'assigned_to')"
                  @keyup.escape="cancelEdit"
                />
                <span v-else>{{ task.assigned_to || '-' }}</span>
              </td>
              <td>{{ formatDate(task.created_at) }}</td>
              <td class="task-actions">
                <button 
                  class="btn btn-icon" 
                  @click="showTaskDetail(task.id)"
                  title="View details"
                >
                  👁️
                </button>
                <button 
                  class="btn btn-icon btn-danger" 
                  @click="deleteTask(task.id)"
                  title="Delete task"
                >
                  🗑️
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create Task View -->
    <div v-else-if="currentView === 'create'" class="task-form-container">
      <div class="form-header">
        <button class="btn btn-back" @click="backToList">
          ← Back to Tasks
        </button>
        <h2>Create New Task</h2>
      </div>

      <div class="form-body">
        <div class="form-group">
          <label for="task-summary">Summary *</label>
          <input
            id="task-summary"
            v-model="newTask.summary"
            type="text"
            placeholder="Enter task summary"
            autofocus
          />
        </div>

        <div class="form-group">
          <label for="task-description">Description</label>
          <textarea
            id="task-description"
            v-model="newTask.description"
            placeholder="Enter task description"
            rows="6"
          ></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="task-status">Status</label>
            <select id="task-status" v-model="newTask.status">
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div class="form-group">
            <label for="task-priority">Priority</label>
            <select id="task-priority" v-model="newTask.priority">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="task-assigned">Assigned To</label>
          <input
            id="task-assigned"
            v-model="newTask.assigned_to"
            type="text"
            placeholder="Enter assignee"
          />
        </div>

        <div class="form-actions">
          <button class="btn btn-cancel" @click="backToList">Cancel</button>
          <button 
            class="btn btn-primary" 
            @click="createTask"
            :disabled="!newTask.summary.trim()"
          >
            Create Task
          </button>
        </div>
      </div>
    </div>

    <!-- Task Detail View -->
    <TaskDetail
      v-else-if="currentView === 'detail' && selectedTaskId"
      :task-id="selectedTaskId"
      :user-id="userId"
      @close="backToList"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import {
  useTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  type Task,
} from '@y2kfund/core/tasks'
import TaskDetail from './TaskDetail.vue'

interface Props {
  userId?: string
  showHeaderLink?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  userId: 'default-user',
  showHeaderLink: false,
})

const emit = defineEmits<{ 
  'minimize': []
  'navigate': []
}>()

// State
const searchQuery = ref('')
const statusFilter = ref('')
const currentView = ref<'list' | 'detail' | 'create'>('list')
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

// Queries - Pass computed filters
const filters = computed(() => ({
  status: statusFilter.value || undefined,
  search: searchQuery.value || undefined,
}))

const { data: tasks, isLoading, error } = useTasksQuery(filters)
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
    resetForm()
    currentView.value = 'list'
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

function showCreateView() {
  resetForm()
  currentView.value = 'create'
}

function showTaskDetail(taskId: string) {
  selectedTaskId.value = taskId
  currentView.value = 'detail'
}

function backToList() {
  currentView.value = 'list'
  selectedTaskId.value = null
}

async function startEditCell(task: Task, field: keyof Task) {
  editingCell.value = { taskId: task.id, field }
  editValue.value = String(task[field] || '')
  await nextTick()
  editInput.value?.focus()
}

function cancelEdit() {
  editingCell.value = null
  editValue.value = ''
}

async function saveEdit(task: Task, field: keyof Task) {
  if (!editingCell.value) return

  try {
    await updateMutation.mutateAsync({
      id: task.id,
      updates: { [field]: editValue.value },
      userId: props.userId, // Add userId
    })
    cancelEdit()
  } catch (err) {
    console.error('Failed to update task:', err)
  }
}

async function deleteTask(taskId: string) {
  if (!confirm('Are you sure you want to delete this task?')) return

  try {
    await deleteMutation.mutateAsync(taskId)
  } catch (err) {
    console.error('Failed to delete task:', err)
  }
}
</script>

<style scoped>
.tasks-card {
  padding: 0.75rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(0,0,0,.1);
  box-shadow: 0 4px 12px rgba(0,0,0,.1);
  background: white;
}

.loading, .error {
  padding: 2rem;
  text-align: center;
  border-radius: 0.5rem;
  margin: 1rem 0;
}

.loading {
  background-color: #f8f9fa;
  color: #6c757d;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.loading-spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid #e9ecef;
  border-top: 3px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.tasks-container {
  width: 100%;
}

.tasks-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #dee2e6;
}

.tasks-header h2 {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 600;
  color: #333;
}

.tasks-header-clickable {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.2s ease;
}

.tasks-header-clickable:hover {
  color: #007bff;
}

.tasks-header-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  background: white;
}

.btn-primary {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
  border-color: #0056b3;
}

.btn-primary:disabled {
  background: #6c757d;
  border-color: #6c757d;
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-minimize {
  background: #fff;
  border-color: #6c757d;
}

.btn-minimize:hover {
  background: #545b62;
  border-color: #4e555b;
  color: white;
}

.btn-back {
  background: #f8f9fa;
  color: #495057;
  border-color: #dee2e6;
}

.btn-back:hover {
  background: #e9ecef;
}

.btn-cancel {
  background: white;
  color: #6c757d;
}

.btn-cancel:hover {
  background: #f8f9fa;
}

.btn-icon {
    padding: 0.375rem 0.5rem !important;
    font-size: 1rem;
    line-height: 10px;
}

.btn-danger {
  background: #dc3545;
  color: white;
  border-color: #dc3545;
}

.btn-danger:hover {
  background: #c82333;
  border-color: #bd2130;
}

.tasks-filters {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.filter-input,
.filter-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 0.875rem;
}

.filter-input {
  flex: 1;
}

.filter-select {
  min-width: 150px;
}

.tasks-table-wrapper {
  overflow-x: auto;
}

.tasks-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.tasks-table thead {
  background: #f8f9fa;
}

.tasks-table th {
  padding: 0.5rem;
  text-align: left;
  font-weight: 600;
  color: #495057;
  border-bottom: 2px solid #dee2e6;
}

.tasks-table td {
  padding: 0.5rem;
  border-bottom: 1px solid #e9ecef;
}

.tasks-table tbody tr:hover {
  background: #f8f9fa;
}

.editable-cell {
  cursor: pointer;
}

.editable-cell:hover {
  background: #e9ecef;
}

.editable-cell input,
.editable-cell select {
  width: 100%;
  padding: 0.25rem 0.5rem;
  border: 1px solid #007bff;
  border-radius: 4px;
  font-size: 0.875rem;
}

.status-badge,
.priority-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-open {
  background: #e7f3ff;
  color: #0066cc;
}

.status-in_progress {
  background: #fff3cd;
  color: #856404;
}

.status-completed {
  background: #d4edda;
  color: #155724;
}

.priority-low {
  background: #d1ecf1;
  color: #0c5460;
}

.priority-medium {
  background: #fff3cd;
  color: #856404;
}

.priority-high {
  background: #f8d7da;
  color: #721c24;
}

.task-actions {
  display: flex;
  gap: 0.25rem;
}

/* Form Styles */
.task-form-container {
  width: 100%;
}

.form-header {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #dee2e6;
}

.form-header h2 {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 600;
  color: #333;
}

.form-body {
  max-width: 800px;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  color: #333;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 0.9375rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.form-group textarea {
  resize: vertical;
  font-family: inherit;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #dee2e6;
}

@media (max-width: 768px) {
  .tasks-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>

<style>
.tasks-card button {
    width: auto;
    padding: .4rem .75rem !important;
}
</style>