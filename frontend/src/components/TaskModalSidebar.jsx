export default function TaskModalSidebar({
  modalState,
  editPriority,
  setEditPriority,
  editTag,
  setEditTag,
  editDueDate,
  setEditDueDate,
  tagOptions,
}) {
  return (
    <div className="jira-modal-sidebar">
      <h3 className="sidebar-section-title">Details</h3>

      <div className="jira-sidebar-field">
        <span className="field-meta-label">Priority</span>
        <select className="task-select field-meta-select" value={editPriority} onChange={(e) => setEditPriority(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="jira-sidebar-field">
        <span className="field-meta-label">Component Tag</span>
        <select className="task-select field-meta-select" value={editTag} onChange={(e) => setEditTag(e.target.value)}>
          {tagOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>

      <div className="jira-sidebar-field">
        <span className="field-meta-label">Due Date</span>
        <input type="date" className="task-date field-meta-select" value={editDueDate} onChange={(e) => setEditDueDate(e.target.value)} />
      </div>

      <div className="jira-sidebar-field">
        <span className="field-meta-label">Status</span>
        <span className={`jira-status-pill ${modalState.mode === 'add' ? 'active' : modalState.task?.completed ? 'done' : 'active'}`}>
          {modalState.mode === 'add' ? 'NEW TASK' : modalState.task?.completed ? 'ARCHIVED DONE' : 'IN FLIGHT'}
        </span>
      </div>
    </div>
  );
}
