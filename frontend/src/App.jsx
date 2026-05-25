import { useState, useEffect, useCallback } from 'react';
import './App.css'; 

const API_URL = 'http://localhost:8000';
const TAG_OPTIONS = ['Chore', 'Work', 'Study', 'Personal', 'Health', 'Random'];

function App() {
  const [tasks, setTasks] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [editComments, setEditComments] = useState([]);
  const [newsItems] = useState([
    { title: 'Global markets show cautious optimism', url: 'https://ground.news/markets-show-cautious-optimism' },
    { title: 'Tech firms launch new sustainability initiatives', url: 'https://ground.news/tech-sustainability-initiatives' },
    { title: 'Local infrastructure projects gain momentum', url: 'https://ground.news/infrastructure-projects-momentum' },
    { title: 'Energy headlines for the week', url: 'https://ground.news/energy-headlines-week' },
    { title: 'Security and governance updates', url: 'https://ground.news/security-governance-updates' }
  ]);

  const [backgroundVideos] = useState([
    '/videos/video1.mp4',
    '/videos/video2.mp4',
    '/videos/video3.mp4',
    '/videos/video4.mp4'
  ]);
  const [activeBgIndex, setActiveBgIndex] = useState(0);
  const [showBgDropdown, setShowBgDropdown] = useState(false);
  const [activeModalTask, setActiveModalTask] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPriority, setEditPriority] = useState('low');
  const [editDueDate, setEditDueDate] = useState('');
  const [editTag, setEditTag] = useState('Chore');
  const [editAttachments, setEditAttachments] = useState([]);

  const [searchFilter, setSearchFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [dueDateFilter, setDueDateFilter] = useState('all');

  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather] = useState({ temp: 24, condition: 'Partly Cloudy', city: 'Brasília' });

  const fetchTasks = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/tasks`);
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
        if (activeModalTask) {
          const updated = data.find(t => t.id === activeModalTask.id);
          if (updated) setActiveModalTask(updated);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }, [activeModalTask]);

  useEffect(() => {
    const loadTasks = async () => {
      await fetchTasks();
    };
    loadTasks();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [fetchTasks]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const fileObj = {
          name: file.name,
          type: file.type,
          data: reader.result
        };
        setEditAttachments(prev => [...prev, fileObj]);
      };
      reader.readAsDataURL(file);
    });
  };

  const getBackgroundLabel = (path) => {
    return path.split('/').pop().replace('.mp4', '');
  };

  const addTask = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!editTitle.trim()) return;
    setErrorMsg('');

    const payload = { 
      title: editTitle, 
      description: editDescription,
      priority: editPriority, 
      completed: false,
      due_date: editDueDate ? editDueDate : null,
      tag: editTag,
      attachments: editAttachments,
      comments: editComments
    };

    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (response.ok) {
        setEditTitle('');
        setEditDescription('');
        setEditPriority('low');
        setEditDueDate('');
        setEditTag('Chore');
        setEditAttachments([]);
        setEditComments([]);
        setCommentText('');
        setShowAddModal(false);
        setActiveModalTask(null);
        fetchTasks(); 
      } else {
        const errData = await response.json();
        setErrorMsg(JSON.stringify(errData));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const openJiraModal = (task) => {
    setActiveModalTask(task);
    setShowAddModal(false);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditPriority(task.priority);
    setEditDueDate(task.due_date ? task.due_date.split('T')[0] : '');
    setEditTag(task.tag || 'Chore');
    setEditAttachments(task.attachments || []);
    setEditComments(task.comments || []);
    setCommentText('');
  };

  const openAddModal = () => {
    setActiveModalTask(null);
    setShowAddModal(true);
    setEditTitle('');
    setEditDescription('');
    setEditPriority('low');
    setEditDueDate('');
    setEditTag('Chore');
    setEditAttachments([]);
    setEditComments([]);
    setCommentText('');
  };

  const addCommentToModal = () => {
    if (!commentText.trim()) return;
    const nextComment = {
      text: commentText.trim(),
      timestamp: new Date().toISOString()
    };
    setEditComments(prev => [...prev, nextComment]);
    setCommentText('');
  };

  const saveJiraChanges = async () => {
    if (!activeModalTask) return;

    const updatedTask = {
      ...activeModalTask,
      title: editTitle,
      description: editDescription,
      priority: editPriority,
      due_date: editDueDate || null,
      tag: editTag,
      attachments: editAttachments,
      comments: editComments
    };

    try {
      const response = await fetch(`${API_URL}/tasks/${activeModalTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
      });

      if (response.ok) {
        setTasks(prevTasks => prevTasks.map(t => t.id === activeModalTask.id ? updatedTask : t));
        setActiveModalTask(null);
        setShowAddModal(false);
        fetchTasks();
      } else {
        console.error("Failed to update task");
      }
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const toggleComplete = async (task, e) => {
    e.stopPropagation();
    try {
      const response = await fetch(`${API_URL}/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...task, completed: !task.completed }),
      });
      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error(error);
    }
  };

    const deleteTask = async (id, e) => {
      e.stopPropagation();
      try {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          if (activeModalTask?.id === id) setActiveModalTask(null);
          fetchTasks();
        }
      } catch (error) {
        console.error(error);
      }
    };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { day: '2-digit', month: 'short' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const renderDescriptionLinks = (text) => {
    if (!text) return null;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, i) => {
      if (part.match(urlRegex)) {
        return <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="desc-link">{part}</a>;
      }
      return part;
    });
  };

  const renderAttachmentPreview = (attachments) => {
    if (!attachments || attachments.length === 0) return null;
    return (
      <div className="task-attachment-preview-list">
        {attachments.slice(0, 3).map((file, idx) => (
          <span key={idx} className="task-attachment-preview">
            {file.type.startsWith('image/') ? (
              <img src={file.data} alt={file.name} />
            ) : (
              file.name.split('.').pop().toUpperCase()
            )}
          </span>
        ))}
        {attachments.length > 3 && (
          <span className="task-attachment-preview-more">+{attachments.length - 3}</span>
        )}
      </div>
    );
  };

  const filterTasks = (taskList) => {
    return taskList.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchFilter.toLowerCase()) || 
                            (task.description && task.description.toLowerCase().includes(searchFilter.toLowerCase()));
      const matchesPriority = priorityFilter === 'all' || task.priority.toLowerCase() === priorityFilter.toLowerCase();
      const matchesTag = tagFilter === 'all' || (task.tag && task.tag.toLowerCase() === tagFilter.toLowerCase());

      let matchesDueDate = true;
      if (dueDateFilter !== 'all') {
        if (!task.due_date) {
          matchesDueDate = false;
        } else {
          const normalizeDate = (value) => new Date(new Date(value).toDateString());
          const dueDate = normalizeDate(task.due_date);
          const today = normalizeDate(new Date());
          if (dueDateFilter === 'overdue') {
            matchesDueDate = dueDate < today;
          } else if (dueDateFilter === 'today') {
            matchesDueDate = dueDate.getTime() === today.getTime();
          } else if (dueDateFilter === 'week') {
            const nextWeek = new Date(today);
            nextWeek.setDate(nextWeek.getDate() + 7);
            matchesDueDate = dueDate >= today && dueDate <= nextWeek;
          }
        }
      }

      return matchesSearch && matchesPriority && matchesTag && matchesDueDate;
    });
  };

  const activeTasks = filterTasks(tasks.filter(t => !t.completed));
  const completedTasks = filterTasks(tasks.filter(t => t.completed));

  return (
    <>
      <div className="app-background-video-wrap">
        <video className="app-background-video" autoPlay muted loop playsInline>
          <source src={backgroundVideos[activeBgIndex]} type="video/mp4" />
        </video>
      </div>
      <div className="dashboard-grid">
        
        <div className="lane left-lane">
        <div className="widget-card greeting-card">
          <span className="live-clock">
            {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
          <h2 className="greeting-text">Good day, Noah</h2>
          <p className="system-date-text">
            {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </p>
        </div>

        <div className="widget-card weather-card">
          <div className="weather-meta">
            <span className="weather-city">{weather.city}</span>
            <span className="weather-condition">{weather.condition}</span>
          </div>
          <span className="weather-temp">{weather.temp}°C</span>
        </div>

        <div className="widget-card news-card">
          <div className="card-header">
            <h3 className="card-title-text">Ground News</h3>
          </div>
          {newsItems.map((item, idx) => (
            <a key={idx} href={item.url} className="news-item" target="_blank" rel="noopener noreferrer">
              {item.title}
              <span>ground.news</span>
            </a>
          ))}
          <div className="background-selector">
            <button
              type="button"
              className="bg-dropdown-toggle"
              onClick={() => setShowBgDropdown(prev => !prev)}
            >
              {getBackgroundLabel(backgroundVideos[activeBgIndex])}
              <span className="dropdown-arrow">{showBgDropdown ? '▴' : '▾'}</span>
            </button>
            {showBgDropdown && (
              <div className="bg-dropdown">
                {backgroundVideos.map((path, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`bg-dropdown-item ${idx === activeBgIndex ? 'selected' : ''}`}
                    onClick={() => {
                      setActiveBgIndex(idx);
                      setShowBgDropdown(false);
                    }}
                  >
                    {getBackgroundLabel(path)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="lane center-lane">
        <div className="dashboard-card">
          <div className="card-header tasks-header-bar">
            <div className="tasks-header-left">
              <div className="tasks-title-row">
                <h2 className="card-title-text">Tasks</h2>
                <span className="task-count-badge">{tasks.filter(t => !t.completed).length} active</span>
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
                    {TAG_OPTIONS.map(opt => <option key={opt} value={opt.toLowerCase()}>{opt}</option>)}
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
              <button className="btn-submit add-task-btn" onClick={openAddModal}>Add Task</button>
            </div>
          </div>

          {errorMsg && <div className="error-banner">{errorMsg}</div>}

          <div className="list-section">
            <ul className="task-list">
              {activeTasks.map((task) => (
                <li key={task.id} className="jira-task-card" onClick={() => openJiraModal(task)}>
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
                          <span className="task-card-description-preview">
                            {task.description}
                          </span>
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
            {activeTasks.length === 0 && <div className="empty-state">No active entries matching criteria.</div>}
          </div>
        </div>
      </div>

      <div className="lane right-lane">
        <div className="dashboard-card archiving-panel">
          <div className="card-header">
            <h2 className="card-title-text text-muted-header">Archived Work</h2>
            <span className="task-count-badge completion-count">{completedTasks.length} done</span>
          </div>

          {completedTasks.length === 0 ? (
            <div className="empty-state inline-empty">Done tasks arrange here automatically.</div>
          ) : (
            <ul className="task-list archiving">
              {completedTasks.map((task) => (
                <li key={task.id} className="jira-task-card completed" onClick={() => openJiraModal(task)}>
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
                          <span className="task-card-description-preview">
                            {task.description}
                          </span>
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
          )}
        </div>
      </div>

      {(showAddModal || activeModalTask) && (
        <div className="jira-overlay-backdrop" onClick={() => { setActiveModalTask(null); setShowAddModal(false); }}>
          <div className="jira-modal-window" onClick={(e) => e.stopPropagation()}>
            
            <div className="jira-modal-header">
              <span className="jira-issue-key">{showAddModal ? 'NEW TASK' : `TASK-${activeModalTask.id}`}</span>
              <div className="jira-modal-header-actions">
                <button type="button" className="jira-btn-save" onClick={showAddModal ? addTask : saveJiraChanges}>{showAddModal ? 'Create Task' : 'Save & Close'}</button>
                <button type="button" className="jira-btn-close" onClick={() => { setActiveModalTask(null); setShowAddModal(false); }}>✕</button>
              </div>
            </div>

            <div className="jira-modal-body-layout">
              <div className="jira-modal-main-content">
                <div className="jira-editable-group">
                  <label className="jira-modal-label">Summary</label>
                  <input 
                    type="text" 
                    className="jira-modal-title-input" 
                    value={editTitle} 
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                </div>

                <div className="jira-editable-group">
                  <label className="jira-modal-label">Description</label>
                  <textarea 
                    className="jira-modal-description-textarea" 
                    value={editDescription} 
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Provide deep details or attach operational context links..."
                  />
                  {editDescription && (
                    <div className="jira-rendered-links-preview">
                      <span className="preview-mini-title">Rendered Links Preview:</span>
                      <p>{renderDescriptionLinks(editDescription)}</p>
                    </div>
                  )}
                </div>

                <div className="jira-editable-group">
                  <label className="jira-modal-label">Attachments & Media Assets</label>
                  <div className="form-file-row modal-file-row">
                    <label className="file-upload-btn">
                      📎 Upload Asset Files
                      <input type="file" multiple onChange={handleFileChange} accept="image/*,video/*,application/pdf" />
                    </label>
                    {editAttachments.length > 0 && (
                      <button className="clear-files-btn" onClick={() => setEditAttachments([])}>Flush All Files</button>
                    )}
                  </div>

                  {editAttachments.length > 0 ? (
                    <div className="jira-modal-attachments-grid">
                      {editAttachments.map((file, idx) => (
                        <div key={idx} className="jira-attachment-tile">
                          {file.type.startsWith('image/') ? (
                            <img src={file.data} alt={file.name} className="jira-tile-media" />
                          ) : file.type.startsWith('video/') ? (
                            <video src={file.data} controls className="jira-tile-media" />
                          ) : (
                            <a href={file.data} download={file.name} className="jira-tile-fallback">
                              📄 {file.name}
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="jira-empty-media-placeholder">No assets loaded onto task container.</div>
                  )}
                </div>

                <div className="jira-editable-group">
<label className="jira-modal-label">Comments</label>
                  <textarea
                    className="jira-modal-description-textarea"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a progress update note..."
                  />
                  <button type="button" className="jira-btn-add-comment" onClick={addCommentToModal}>Add Comment</button>

                  {editComments.length > 0 ? (
                    <div className="comment-timeline">
                      {editComments.map((comment, idx) => (
                        <div key={idx} className="timeline-item">
                          <span className="timeline-time">{new Date(comment.timestamp).toLocaleString()}</span>
                          <p>{comment.text}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="jira-empty-media-placeholder">No comments yet.</div>
                  )}
                </div>
              </div>

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
                    {TAG_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>

                <div className="jira-sidebar-field">
                  <span className="field-meta-label">Due Date</span>
                  <input type="date" className="task-date field-meta-select" value={editDueDate} onChange={(e) => setEditDueDate(e.target.value)} />
                </div>

                <div className="jira-sidebar-field">
                  <span className="field-meta-label">Status</span>
                  <span className={`jira-status-pill ${showAddModal ? 'active' : activeModalTask?.completed ? 'done' : 'active'}`}>
                    {showAddModal ? 'NEW TASK' : activeModalTask?.completed ? 'ARCHIVED DONE' : 'IN FLIGHT'}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
    </>
  );
}

export default App;