export default function TaskModalHeader({ modalState, addTask, saveJiraChanges, closeModal }) {
  return (
    <div className="jira-modal-header">
      <span className="jira-issue-key">
        {modalState.mode === 'add' ? 'NEW TASK' : `TASK-${modalState.task?.id}`}
      </span>
      <div className="jira-modal-header-actions">
        <button
          type="button"
          className="jira-btn-save"
          onClick={modalState.mode === 'add' ? addTask : saveJiraChanges}
        >
          {modalState.mode === 'add' ? 'Create Task' : 'Save & Close'}
        </button>
        <button type="button" className="jira-btn-close" onClick={closeModal}>✕</button>
      </div>
    </div>
  );
}
