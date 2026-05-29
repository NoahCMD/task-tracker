import TaskList from './TaskList';

export default function ArchivedTasksPanel({
  completedTasks,
  openJiraModal,
  toggleComplete,
  deleteTask,
  renderAttachmentPreview,
  formatDate,
}) {
  return (
    <div className="lane right-lane">
      <div className="dashboard-card archiving-panel">
        <div className="card-header">
          <h2 className="card-title-text text-muted-header">Archived Work</h2>
          <span className="task-count-badge completion-count">{completedTasks.length} done</span>
        </div>

        {completedTasks.length === 0 ? (
          <div className="empty-state inline-empty">Done tasks arrange here automatically.</div>
        ) : (
          <TaskList
            tasks={completedTasks}
            onTaskClick={openJiraModal}
            toggleComplete={toggleComplete}
            deleteTask={deleteTask}
            renderAttachmentPreview={renderAttachmentPreview}
            formatDate={formatDate}
            listClassName="archiving"
          />
        )}
      </div>
    </div>
  );
}
