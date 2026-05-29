export default function TaskHeader({
  activeCount,
  searchFilter,
  setSearchFilter,
  priorityFilter,
  setPriorityFilter,
  tagFilter,
  setTagFilter,
  dueDateFilter,
  setDueDateFilter,
  onAddTask,
  tagOptions,
}) {
  return (
    <div className="card-header tasks-header-bar">
      <div className="tasks-header-left">
        <div className="tasks-title-row">
          <h2 className="card-title-text">Tasks</h2>
          <span className="task-count-badge">{activeCount} active</span>
        </div>
        <div className="tasks-filter-toolbar">
          <input
            type="text"
            className="search-input"
            placeholder="Search tasks..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
          />
          <div className="filter-selects-row compact-row">
            <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <select value={tagFilter} onChange={(e) => setTagFilter(e.target.value)}>
              <option value="all">All Tags</option>
              {tagOptions.map(opt => (
                <option key={opt} value={opt.toLowerCase()}>{opt}</option>
              ))}
            </select>
            <select value={dueDateFilter} onChange={(e) => setDueDateFilter(e.target.value)}>
              <option value="all">All Dates</option>
              <option value="overdue">Overdue</option>
              <option value="today">Today</option>
              <option value="week">Next 7 days</option>
            </select>
          </div>
        </div>
      </div>
      <div className="tasks-header-right">
        <button className="btn-submit add-task-btn" onClick={onAddTask}>Add Task</button>
      </div>
    </div>
  );
}
