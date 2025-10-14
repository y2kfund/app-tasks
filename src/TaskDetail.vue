<template>
  <div class="detail-container">
    <div class="detail-header">
      <button class="btn btn-back" @click="emit('close')">
        ← Back to Tasks
      </button>
      <h2>Task Details</h2>
      <button class="btn btn-danger" @click="deleteTask">Delete Task</button>
    </div>

    <div v-if="isLoading" class="loading">Loading task details...</div>
    <div v-else-if="error" class="error">Error: {{ error }}</div>
    <div v-else-if="task" class="detail-content">
      <!-- Task Info -->
      <div class="task-info">
        <div class="info-row">
          <label>Summary</label>
          <div @dblclick="startEdit('summary', task.summary)">
            <input
              v-if="editingField === 'summary'"
              v-model="editValue"
              @blur="saveEdit"
              @keyup.enter="saveEdit"
              @keyup.esc="cancelEdit"
              class="inline-edit"
              ref="editInput"
            />
            <div v-else class="info-value">{{ task.summary }}</div>
          </div>
        </div>

        <div class="info-row">
          <label>Description</label>
          <div @dblclick="startEdit('description', task.description || '')">
            <textarea
              v-if="editingField === 'description'"
              v-model="editValue"
              @blur="saveEdit"
              @keyup.esc="cancelEdit"
              @paste="handlePaste"
              class="inline-edit"
              rows="4"
              ref="editInput"
            />
            <div v-else class="info-value" v-html="renderMarkdown(task.description || '')"></div>
          </div>
        </div>

        <div class="info-row">
          <label>Status</label>
          <div @dblclick="startEdit('status', task.status)">
            <select
              v-if="editingField === 'status'"
              v-model="editValue"
              @blur="saveEdit"
              @change="saveEdit"
              class="inline-edit"
              ref="editInput"
            >
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="closed">Closed</option>
            </select>
            <span v-else :class="`status-badge status-${task.status}`">
              {{ task.status }}
            </span>
          </div>
        </div>

        <div class="info-row">
          <label>Priority</label>
          <div @dblclick="startEdit('priority', task.priority)">
            <select
              v-if="editingField === 'priority'"
              v-model="editValue"
              @blur="saveEdit"
              @change="saveEdit"
              class="inline-edit"
              ref="editInput"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
            <span v-else :class="`priority-badge priority-${task.priority}`">
              {{ task.priority }}
            </span>
          </div>
        </div>

        <div class="info-row">
          <label>Assigned To</label>
          <div @dblclick="startEdit('assigned_to', task.assigned_to || '')">
            <select
              v-if="editingField === 'assigned_to'"
              v-model="editValue"
              @blur="saveEdit"
              @change="saveEdit"
              class="inline-edit"
              ref="editInput"
              :disabled="usersLoading"
            >
              <option value="">-- Unassigned --</option>
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.name }}
              </option>
            </select>
            <div v-else class="info-value">{{ getUserName(task.assigned_to) || '-' }}</div>
          </div>
        </div>
      </div>

      <!-- History Timeline -->
      <div class="history-section">
        <h3>History</h3>
        <div v-if="historyLoading" class="loading">Loading history...</div>
        <div v-else-if="history && history.length > 0" class="history-list">
          <div v-for="item in history" :key="item.id" class="history-item">
            <div class="history-meta">
              <strong>{{ item.changed_by }}</strong>
              <span class="history-date">{{ formatDateTime(item.changed_at) }}</span>
            </div>
            <div class="history-change">
              Changed <strong>{{ formatFieldName(item.field_name) }}</strong>
              <span class="change-values">
                from "<span class="old-value">{{ item.old_value }}</span>"
                to "<span class="new-value">{{ item.new_value }}</span>"
              </span>
            </div>
          </div>
        </div>
        <div v-else class="no-history">No history yet</div>
      </div>

      <!-- Comments Section -->
      <div class="comments-section">
        <h3>Comments</h3>
        <div v-if="commentsLoading" class="loading">Loading comments...</div>
        <div v-else-if="comments && comments.length > 0" class="comments-list">
          <div v-for="comment in comments" :key="comment.id" class="comment-item">
            <div class="comment-meta">
              <strong>{{ comment.created_by }}</strong>
              <span class="comment-date">{{ formatDateTime(comment.created_at) }}</span>
            </div>
            <div class="comment-text" v-html="renderMarkdown(comment.comment)"></div>
          </div>
        </div>
        <div v-else class="no-comments">No comments yet</div>

        <!-- Add Comment -->
        <div class="add-comment">
          <textarea
            v-model="newComment"
            placeholder="Add a comment..."
            rows="3"
            class="comment-input"
            @paste="handleCommentPaste"
          ></textarea>
          <small>Paste images from clipboard</small>
          <button @click="addComment" :disabled="!newComment.trim()" class="btn-primary">
            Add Comment
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import {
  useTaskQuery,
  useTaskCommentsQuery,
  useTaskHistoryQuery,
  useUpdateTaskMutation,
  useAddCommentMutation,
  useUsersQuery,
} from '@y2kfund/core/tasks'
import type { Task } from '@y2kfund/core/tasks'

interface Props {
  taskId: string
  userId: string
}

const props = defineProps<Props>()
const emit = defineEmits<{ close: [] }>()

// Queries
const { data: task, isLoading, error } = useTaskQuery(props.taskId)
const { data: comments, isLoading: commentsLoading } = useTaskCommentsQuery(props.taskId)
const { data: history, isLoading: historyLoading } = useTaskHistoryQuery(props.taskId)

// Mutations
const updateMutation = useUpdateTaskMutation()
const addCommentMutation = useAddCommentMutation()

// State
const editingField = ref<string | null>(null)
const editValue = ref('')
const editInput = ref<HTMLElement | null>(null)
const newComment = ref('')

// Add users query
const { data: users, isLoading: usersLoading } = useUsersQuery()

// Methods
async function startEdit(field: string, currentValue: string) {
  editingField.value = field
  editValue.value = currentValue
  await nextTick()
  // Use querySelector to safely focus the element
  const inputEl = editInput.value as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null
  if (inputEl && typeof inputEl.focus === 'function') {
    inputEl.focus()
  }
}

function cancelEdit() {
  editingField.value = null
  editValue.value = ''
}

async function saveEdit() {
  if (!editingField.value || !task.value) return
  
  const field = editingField.value
  const currentValue = task.value[field as keyof Task]
  
  if (editValue.value !== currentValue) {
    try {
      await updateMutation.mutateAsync({
        id: props.taskId,
        updates: { [field]: editValue.value },
        userId: props.userId,
      })
    } catch (err) {
      console.error('Failed to update task:', err)
    }
  }
  
  cancelEdit()
}

async function addComment() {
  if (!newComment.value.trim()) return
  
  try {
    await addCommentMutation.mutateAsync({
      task_id: props.taskId,
      comment: newComment.value,
      created_by: props.userId,
    })
    newComment.value = ''
  } catch (err) {
    console.error('Failed to add comment:', err)
  }
}

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString()
}

function formatFieldName(field: string) {
  return field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

function renderMarkdown(text: string) {
  // Simple markdown rendering for images
  return text.replace(/!\[.*?\]\((data:image\/[^)]+)\)/g, '<img src="$1" style="max-width: 100%; margin: 0.5rem 0;" />')
}

async function handlePaste(event: ClipboardEvent) {
  await handleImagePaste(event, (base64) => {
    editValue.value += `\n![image](${base64})\n`
  })
}

async function handleCommentPaste(event: ClipboardEvent) {
  await handleImagePaste(event, (base64) => {
    newComment.value += `\n![image](${base64})\n`
  })
}

async function handleImagePaste(event: ClipboardEvent, callback: (base64: string) => void) {
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
          callback(base64)
        }
        reader.readAsDataURL(blob)
      }
    }
  }
}

// Add helper function
function getUserName(userId: string | undefined) {
  if (!userId || !users.value) return ''
  const user = users.value.find(u => u.id === userId)
  return user?.name || userId
}
</script>

<style scoped>
.detail-container {
  width: 100%;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #dee2e6;
}

.detail-header h2 {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 600;
  color: #333;
  flex: 1;
  text-align: center;
}

.btn-back {
  background: #f8f9fa;
  color: #495057;
  border: 1px solid #dee2e6;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-back:hover {
  background: #e9ecef;
}

.detail-content {
  padding: 0 0.5rem;
}

.task-info {
  margin-bottom: 1rem;
}

.info-row {
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 1rem;
  padding: 0.25rem 0;
  border-bottom: 1px solid #eee;
}

.info-row label {
  font-weight: 600;
  color: #666;
}

.info-value {
  color: #333;
}

.inline-edit {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #007bff;
  border-radius: 4px;
  font-family: inherit;
}

.status-badge,
.priority-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
  display: inline-block;
}

.status-open { background: #e3f2fd; color: #1976d2; }
.status-in-progress { background: #fff3e0; color: #f57c00; }
.status-completed { background: #e8f5e9; color: #388e3c; }
.status-closed { background: #f5f5f5; color: #757575; }

.priority-low { background: #e8f5e9; color: #388e3c; }
.priority-medium { background: #fff3e0; color: #f57c00; }
.priority-high { background: #ffe0b2; color: #e64a19; }
.priority-critical { background: #ffebee; color: #c62828; }

.history-section,
.comments-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.history-list,
.comments-list {
  margin-top: 1rem;
}

.history-item,
.comment-item {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.history-meta,
.comment-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  color: #666;
  font-size: 0.875rem;
}

.history-change {
  color: #333;
  font-size: 0.9rem;
}

.change-values {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.875rem;
}

.old-value {
  color: #c62828;
  text-decoration: line-through;
}

.new-value {
  color: #388e3c;
}

.comment-text {
  color: #333;
  white-space: pre-wrap;
}

.add-comment {
  margin-top: 1rem;
}

.comment-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  font-family: inherit;
}

.btn-primary {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 0.5rem;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading,
.no-history,
.no-comments {
  color: #999;
  text-align: center;
  padding: 1rem;
}

.error {
  color: #c62828;
  text-align: center;
  padding: 1rem;
}
</style>