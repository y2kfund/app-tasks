<template>
  <div class="detail-container">
    <div class="detail-header">
      <button class="btn btn-back" @click="emit('close')">
        ← Back to Tasks
      </button>
      <div style="flex:1;">
        <h2
          v-if="editingField !== 'summary'"
          class="header-summary"
          @dblclick="startEdit('summary', task?.summary || '')"
          :title="'Double-click to edit summary'"
        >
          {{ task?.summary || 'Task Details' }}
        </h2>
        <input
          v-else
          v-model="editValue"
          @blur="saveEdit"
          @keyup.esc="cancelEdit"
          @keyup.enter="saveEdit"
          ref="editInput"
          class="inline-edit"
          style="font-size:1rem;width:100%;"
          :placeholder="'Task Summary'"
        />
      </div>
      <button
        class="btn"
        :class="task?.archived ? 'btn-success' : 'btn-danger'"
        @click="toggleArchiveTask"
      >
        {{ task?.archived ? 'Unarchive' : 'Archive' }} Task
      </button>
    </div>
    <div v-if="savedMessage" class="saved-message">{{ savedMessage }}</div>

    <div v-if="isLoading" class="loading">Loading task details...</div>
    <div v-else-if="error" class="error">Error: {{ error }}</div>
    <div v-else-if="task" class="detail-content">
      <!-- Task Info -->
      <div class="task-info">
        <!-- Summary moved to header; removed duplicate summary row -->

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
            <div v-else class="info-value" v-html="extractImageFromContent(task.description || '')"></div>
          </div>
        </div>

        <!-- combined Status / Priority / Assigned To in one row -->
        <div class="info-row">
          <label>Details</label>
          <div class="info-value details-row">
            <div class="detail-item">
              <div class="small-label">Status</div>
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

            <div class="detail-item">
              <div class="small-label">Priority</div>
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

            <div class="detail-item">
              <div class="small-label">Assigned</div>
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
        </div>
      </div>

      <!-- History Timeline -->
      <div class="history-section">
        <div class="section-header" @click="isHistoryExpanded = !isHistoryExpanded">
          <h3>
            <span class="expand-icon">{{ isHistoryExpanded ? '▼' : '▶' }}</span>
            History
          </h3>
        </div>
        
        <div v-if="isHistoryExpanded">
          <div v-if="historyLoading" class="loading">Loading history...</div>
          <div v-else-if="history && history.length > 0" class="history-list">
            <div v-for="item in history" :key="item.id" class="history-item">
              <div class="history-meta">
                <strong>{{ getUserName(item.changed_by) }}</strong>
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
      </div>

      <!-- Comments Section -->
      <div class="comments-section">
        <h3>Comments</h3>
        <div v-if="commentsLoading" class="loading">Loading comments...</div>
        <div v-else-if="comments && comments.length > 0" class="comments-list">
          <div v-for="comment in comments" :key="comment.id" class="comment-item">
            <div class="comment-meta">
              <strong>{{ getUserName(comment.created_by) }}</strong>
              <span class="comment-date">{{ formatDateTime(comment.created_at) }}</span>
              <div class="comment-menu" v-if="comment.created_by === props.userId">
                <button class="menu-btn" @click="toggleCommentMenu(comment.id)">⋮</button>
                <div v-if="openCommentMenu === comment.id" class="menu-dropdown">
                  <button @click="startEditComment(comment)">Edit</button>
                </div>
              </div>
            </div>
            <div v-if="editingCommentId === comment.id">
              <textarea v-model="editCommentValue" rows="3" class="comment-input"></textarea>
              <button class="btn-primary" @click="saveEditComment(comment.id)">Save</button>
              <button class="btn" @click="cancelEditComment">Cancel</button>
            </div>
            <div v-else>
              <div
                class="comment-text"
                v-if="comment.created_by === 'Analyze'"
                v-html="renderMarkdown(comment.comment)"
              ></div>
              <div
                class="comment-text"
                v-else
                v-html="extractImageFromContent(comment.comment)"
              ></div>
            </div>
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
            :disabled="aiLoading"
          ></textarea>
          <small>Paste images from clipboard</small>
          <button @click="addComment" :disabled="!newComment.trim() || aiLoading" class="btn-primary">
            <span v-if="aiLoading">Analyzing...</span>
            <span v-else>Add Comment</span>
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
  useUpdateCommentMutation,
  useUsersQuery,
} from '@y2kfund/core/tasks'
import type { Task } from '@y2kfund/core/tasks'
import { marked } from 'marked'

interface Props {
  taskId: string
  userId: string
}

const props = defineProps<Props>()
const emit = defineEmits<{ close: [] }>()
const savedMessage = ref('')
const editingCommentId = ref<string | null>(null)
const editCommentValue = ref('')
const openCommentMenu = ref<string | null>(null)

// Queries
const { data: task, isLoading, error } = useTaskQuery(props.taskId)
const { data: comments, isLoading: commentsLoading } = useTaskCommentsQuery(props.taskId)
const { data: history, isLoading: historyLoading } = useTaskHistoryQuery(props.taskId)
const updateCommentMutation = useUpdateCommentMutation()

// Mutations
const updateMutation = useUpdateTaskMutation()
const addCommentMutation = useAddCommentMutation()

// State
const editingField = ref<string | null>(null)
const editValue = ref('')
const editInput = ref<HTMLElement | null>(null)
const newComment = ref('')
const isHistoryExpanded = ref(false)
const aiLoading = ref(false)

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
      savedMessage.value = 'Saved!'
      setTimeout(() => {
        savedMessage.value = ''
      }, 1200)
    } catch (err) {
      console.error('Failed to update task:', err)
    }
  }
  
  cancelEdit()
}

async function addComment() {
  if (!newComment.value.trim()) return

  // Check for @analyze
  if (newComment.value.trim().startsWith('@analyze')) {
    const question = newComment.value.trim().replace(/^@analyze\s*/, '')
    if (!question) return

    aiLoading.value = true
    try {
      // Call AI API
      const res = await fetch('https://www.y2k.fund/api/ai-analyze-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId: props.taskId,
          userId: props.userId,
          question,
        }),
      })
      const data = await res.json()
      // Add AI response as a comment
      await addCommentMutation.mutateAsync({
        task_id: props.taskId,
        comment: `${data.reply}`,
        created_by: 'Analyze', // or props.userId if you want to attribute to user
      })
      newComment.value = ''
    } catch (err) {
      console.error('AI analysis failed:', err)
    } finally {
      aiLoading.value = false
    }
    return
  }

  // Normal comment
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

async function toggleArchiveTask() {
  if (!task.value) return
  try {
    await updateMutation.mutateAsync({
      id: task.value.id,
      updates: { archived: !task.value.archived },
      userId: props.userId,
    })
  } catch (err) {
    console.error('Failed to archive/unarchive task:', err)
  }
}

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString()
}

function formatFieldName(field: string) {
  return field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

function extractImageFromContent(text: string) {
  // Render images as small thumbnails that open full image in a new tab when clicked.
  // Use data-src + this.dataset.src to avoid quoting/escaping issues in onclick.
  return text
    .replace(
      /!\[.*?\]\((https?:\/\/[^)]+|data:image\/[^)]+)\)/g,
      `<img src="$1" class="img-thumb" data-src="$1" onclick="window.open(this.dataset.src,'_blank')" />`
    )
    // keep line breaks for simple markdown-like rendering
    .replace(/\n/g, '<br/>')
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

function renderMarkdown(md: string) {
  return marked.parse(md)
}

function toggleCommentMenu(id: string) {
  openCommentMenu.value = openCommentMenu.value === id ? null : id
}

function startEditComment(comment: any) {
  editingCommentId.value = comment.id
  editCommentValue.value = comment.comment
  openCommentMenu.value = null
}

function cancelEditComment() {
  editingCommentId.value = null
  editCommentValue.value = ''
}

async function saveEditComment(commentId: string) {
  if (!editCommentValue.value.trim()) return
  try {
    await updateCommentMutation.mutateAsync({
      id: commentId,
      comment: editCommentValue.value,
    })
    editingCommentId.value = null
    editCommentValue.value = ''
  } catch (err) {
    console.error('Failed to edit comment:', err)
  }
}
</script>

<style scoped>
.detail-container {
  width: 100%;
  font-size: 13px; /* overall slightly smaller */
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
  padding: 0.35rem 0;
  border-bottom: 1px solid #e9ecef;
}

.detail-header h2 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  flex: 1;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-summary {
  padding: 0 0.5rem;
}

.btn-back {
  background: #f8f9fa;
  color: #495057;
  border: 1px solid #dee2e6;
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-back:hover {
  background: #e9ecef;
}

.detail-content {
  padding: 0 0.25rem;
}

.task-info {
  margin-bottom: 0.5rem;
}

.info-row {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 0.5rem;
  padding: 0.125rem 0;
  border-bottom: 1px solid #f2f2f2;
}

.info-row label {
  font-weight: 600;
  color: #666;
  font-size: 12px;
  padding-top: 0.4rem;
}

.info-value {
  color: #333;
  font-size: 13px;
  padding: 0.25rem 0;
}

.inline-edit {
  width: 100%;
  padding: 0.45rem;
  border: 1px solid #bcd0ff;
  border-radius: 4px;
  font-family: inherit;
  font-size: 13px;
}

.details-row {
  display: flex;
  gap: 0.8rem;
  align-items: flex-start;
  flex-wrap: wrap;
}

.detail-item {
  flex: 1 1 100px; /* allow items to shrink on small screens */
  min-width: 0;
}

.detail-item .small-label {
  font-weight: 600;
  color: #666;
  font-size: 12px;
  margin-bottom: 0.12rem;
  display: block;
}

/* tighten select/inline-edit height in the compact row */
.details-row .inline-edit {
  padding: 0.35rem;
  font-size: 13px;
}

.status-badge,
.priority-badge {
  padding: 0.18rem 0.5rem;
  border-radius: 10px;
  font-size: 0.78rem;
  font-weight: 500;
  display: inline-block;
}

.status-open { background: #eaf4ff; color: #1976d2; }
.status-in-progress { background: #fff8ef; color: #f57c00; }
.status-completed { background: #f0fbf4; color: #388e3c; }
.status-closed { background: #fafafa; color: #757575; }

.priority-low { background: #f0fbf4; color: #388e3c; }
.priority-medium { background: #fff8ef; color: #f57c00; }
.priority-high { background: #fff4e8; color: #e64a19; }
.priority-critical { background: #fff0f0; color: #c62828; }

.history-section,
.comments-section {
  margin-top: 0.75rem;
  padding-top: 0.5rem;
  border-top: 1px solid #f2f2f2;
}

.section-header {
  cursor: pointer;
  user-select: none;
  transition: background-color 0.15s ease;
  padding: 0.25rem;
  margin: -0.25rem 0 0;
  border-radius: 4px;
}

.section-header:hover {
  background-color: #fafafa;
}

.section-header h3 {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 13px;
}

.expand-icon {
  display: inline-block;
  font-size: 0.7rem;
  color: #666;
  transition: transform 0.15s ease;
}

.history-list,
.comments-list {
  margin-top: 0.6rem;
}

.history-item,
.comment-item {
  padding: 0.6rem;
  background: #fbfbfb;
  border-radius: 6px;
  margin-bottom: 0.6rem;
  font-size: 13px;
}

.history-meta,
.comment-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.35rem;
  color: #666;
  font-size: 12px;
}

.history-change {
  color: #333;
  font-size: 12.5px;
}

.change-values {
  display: block;
  margin-top: 0.18rem;
  font-size: 12px;
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
  font-size: 13px;
}

.add-comment {
  margin-top: 0.6rem;
}

.comment-input {
  width: 100%;
  padding: 0.55rem;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  margin-bottom: 0.35rem;
  font-family: inherit;
  font-size: 13px;
}

.btn-primary {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 0.25rem;
  font-size: 13px;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading,
.no-history,
.no-comments {
  color: #888;
  text-align: center;
  padding: 0.6rem;
  font-size: 13px;
}

.error {
  color: #c62828;
  text-align: center;
  padding: 0.6rem;
  font-size: 13px;
}
</style>

<style>
.img-thumb {
  max-width: 120px;
  max-height: 90px;
  object-fit: cover;
  margin: 0.25rem 0;
  cursor: pointer;
  border-radius: 4px;
  border: 1px solid #e9ecef;
  display: inline-block;
}

/* ensure any rendered images inside description/comments are constrained */
.info-value .img-thumb,
.comment-text .img-thumb {
  vertical-align: middle;
}
.comments-section h3 {
    margin: 0;
}
.comment-text p, .comment-text h1, .comment-text h2, .comment-text h3, .comment-text ul, .comment-text ol {
    margin: 0;
    line-height: 1.5rem;
}

.comment-text h1 {
    font-size: 1.1rem;
}

.comment-text h2 {
    font-size: 1rem;
}

.comment-text h3 {
    font-size: 0.9rem;
}
.saved-message {
  color: #388e3c;
  background: #f0fbf4;
  border-radius: 4px;
  padding: 0.25rem 0.75rem;
  margin: 0.5rem 0;
  text-align: center;
  font-size: 13px;
  font-weight: 500;
  transition: opacity 0.3s;
}
.comment-menu {
  position: relative;
  display: inline-block;
}

.menu-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0 0.3rem;
}

.menu-dropdown {
  position: absolute;
  right: 0;
  top: 1.2rem;
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  z-index: 10;
  min-width: 80px;
}

.menu-dropdown button {
  display: block;
  width: 100%;
  background: none;
  border: none;
  padding: 0.4rem 0.8rem;
  text-align: left;
  cursor: pointer;
  font-size: 13px;
}

.menu-dropdown button:hover {
  background: #f5f5f5;
}
.comment-menu button {
    color: #000;
}
</style>