export default function TaskList({
  tasks,
  onTaskClick,
  toggleComplete,
  deleteTask,
  renderAttachmentPreview,
  formatDate,
  listClassName = '',
}) {
  return (
    <ul className={`task-list ${listClassName}`.trim()}>
      {tasks.map((task) => (
        <li key={task.id} className="jira-task-card" onClick={() => onTaskClick(task)}>
          <div className="task-card-core">
            <div className="task-left-section">
              <input
                type="checkbox"
                className="task-checkbox"
                checked={task.completed}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => toggleComplete(task, e)}
              />
              <div className="task-text-group">
                <span className="task-title">{task.title}</span>
                {task.description && (
                  <span className="task-card-description-preview">{task.description}</span>
                )}
                <div className="task-meta-subline">
                  {task.due_date && <span className="due-date-display">⏱ {formatDate(task.due_date)}</span>}
                  {task.tag && <span className="tag-label">#{task.tag}</span>}
                  {renderAttachmentPreview(task.attachments)}
                  {task.attachments && task.attachments.length > 0 && (
                    <span className="card-attachment-indicator">📎 {task.attachments.length}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="task-right-section">
              <span className={`badge ${task.priority.toLowerCase()}`}>{task.priority}</span>
              <button className="btn-delete" onClick={(e) => deleteTask(task.id, e)}>✕</button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
