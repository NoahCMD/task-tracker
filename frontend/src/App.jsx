import { useState, useEffect, useCallback, useRef } from 'react';
import './App.css'; 
import BackgroundVideo from './components/BackgroundPanel';
import DashboardSidebar from './components/DashboardSidebar';
import TaskHeader from './components/TaskHeader';
import TaskList from './components/TaskList';
import TaskModal from './components/TaskModal';
import ArchivedTasksPanel from './components/ArchivedTasksPanel';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
const TAG_OPTIONS = ['Chore', 'Work', 'Study', 'Personal', 'Health', 'Random'];

function App() {
  const [tasks, setTasks] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [commentText, setCommentText] = useState('');
  const [editComments, setEditComments] = useState([]);
  const [newsItems] = useState([
    { title: 'Markets rally as investors await earnings', url: 'https://www.reuters.com/markets/', source: 'Reuters' },
    { title: 'Global tech policy moves forward', url: 'https://www.bbc.com/news/technology', source: 'BBC' },
    { title: 'Climate coverage and environment updates', url: 'https://www.nytimes.com/section/climate', source: 'NYTimes' },
    { title: 'New space missions and launch schedules', url: 'https://www.cnn.com/specials/space-science', source: 'CNN' },
    { title: 'Business headlines shaping today', url: 'https://www.bloomberg.com/markets', source: 'Bloomberg' }
  ]);

  const [backgroundVideos] = useState([
    '/videos/video1.mp4',
    '/videos/video2.mp4',
    '/videos/video3.mp4',
    '/videos/video4.mp4',
    '/videos/video5.mp4',
    '/videos/video6.mp4'
  ]);
  const [activeBgIndex, setActiveBgIndex] = useState(() => {
    if (typeof window === 'undefined') return 0;
    const saved = window.localStorage.getItem('taskTrackerBgIndex');
    return saved !== null && !Number.isNaN(Number(saved)) ? Number(saved) : 0;
  });
  const videoRef = useRef(null);
  const [showBgDropdown, setShowBgDropdown] = useState(false);
  const [modalState, setModalState] = useState({ visible: false, mode: 'add', task: null });
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
        if (modalState.visible && modalState.mode === 'edit' && modalState.task) {
          const updated = data.find(t => t.id === modalState.task.id);
          if (updated) setModalState(prev => ({ ...prev, task: updated }));
        }
      }
    } catch (error) {
      console.error(error);
    }
  }, [modalState.visible, modalState.mode, modalState.task]);

  useEffect(() => {
    const loadTasks = async () => {
      await fetchTasks();
    };
    loadTasks();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [fetchTasks]);

  useEffect(() => {
    videoRef.current?.load();
  }, [activeBgIndex]);

  useEffect(() => {
    window.localStorage.setItem('taskTrackerBgIndex', String(activeBgIndex));
  }, [activeBgIndex]);

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
        await fetchTasks();
        closeModal();
        setEditTitle('');
        setEditDescription('');
        setEditPriority('low');
        setEditDueDate('');
        setEditTag('Chore');
        setEditAttachments([]);
        setEditComments([]);
      } else {
        const errData = await response.json();
        setErrorMsg(JSON.stringify(errData));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const openJiraModal = (task) => {
    setErrorMsg('');
    setModalState({ visible: true, mode: 'edit', task });
    setEditTitle(task.title || '');
    setEditDescription(task.description || '');
    setEditPriority(task.priority || 'low');
    setEditDueDate(task.due_date ? task.due_date.split('T')[0] : '');
    setEditTag(task.tag || 'Chore');
    setEditAttachments(task.attachments || []);
    setEditComments(task.comments || []);
    setCommentText('');
  };

  const openAddModal = () => {
    setErrorMsg('');
    setModalState({ visible: true, mode: 'add', task: null });
    setEditTitle('');
    setEditDescription('');
    setEditPriority('low');
    setEditDueDate('');
    setEditTag('Chore');
    setEditAttachments([]);
    setEditComments([]);
    setCommentText('');
  };

  const closeModal = useCallback(() => {
    setModalState({ visible: false, mode: 'add', task: null });
    setEditTitle('');
    setEditDescription('');
    setEditPriority('low');
    setEditDueDate('');
    setEditTag('Chore');
    setEditAttachments([]);
    setEditComments([]);
    setCommentText('');
    setErrorMsg('');
  }, []);

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && modalState.visible) {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalState.visible, closeModal]);

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
    if (!modalState.task) return;

    const updatedTask = {
      ...modalState.task,
      title: editTitle,
      description: editDescription,
      priority: editPriority,
      due_date: editDueDate || null,
      tag: editTag,
      attachments: editAttachments,
      comments: editComments
    };

    try {
      const response = await fetch(`${API_URL}/tasks/${modalState.task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
      });

      if (response.ok) {
        const result = await response.json();
        setTasks(prevTasks => prevTasks.map(t => t.id === modalState.task.id ? result : t));
        await fetchTasks();
        closeModal();
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
          if (modalState.task?.id === id) closeModal();
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
              <a
                href={file.data}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <img src={file.data} alt={file.name} />
              </a>
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
      <BackgroundVideo
        backgroundVideos={backgroundVideos}
        activeBgIndex={activeBgIndex}
        videoRef={videoRef}
      />
      <div className="dashboard-grid">
        
        <DashboardSidebar
        currentTime={currentTime}
        weather={weather}
        newsItems={newsItems}
        backgroundVideos={backgroundVideos}
        activeBgIndex={activeBgIndex}
        showBgDropdown={showBgDropdown}
        setShowBgDropdown={setShowBgDropdown}
        setActiveBgIndex={setActiveBgIndex}
        getBackgroundLabel={getBackgroundLabel}
      />

      <div className="lane center-lane">
        <div className="dashboard-card">
          <TaskHeader
            activeCount={tasks.filter(t => !t.completed).length}
            searchFilter={searchFilter}
            setSearchFilter={setSearchFilter}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
            tagFilter={tagFilter}
            setTagFilter={setTagFilter}
            dueDateFilter={dueDateFilter}
            setDueDateFilter={setDueDateFilter}
            onAddTask={openAddModal}
            tagOptions={TAG_OPTIONS}
          />

          {errorMsg && <div className="error-banner">{errorMsg}</div>}

          <div className="list-section">
            <TaskList
              tasks={activeTasks}
              onTaskClick={openJiraModal}
              toggleComplete={toggleComplete}
              deleteTask={deleteTask}
              renderAttachmentPreview={renderAttachmentPreview}
              formatDate={formatDate}
            />
            {activeTasks.length === 0 && <div className="empty-state">No active entries matching criteria.</div>}
          </div>
        </div>
      </div>

      <ArchivedTasksPanel
        completedTasks={completedTasks}
        openJiraModal={openJiraModal}
        toggleComplete={toggleComplete}
        deleteTask={deleteTask}
        renderAttachmentPreview={renderAttachmentPreview}
        formatDate={formatDate}
      />

      {modalState.visible && (
        <TaskModal
          modalState={modalState}
          closeModal={closeModal}
          onBackdropClick={handleBackdropClick}
          addTask={addTask}
          saveJiraChanges={saveJiraChanges}
          editTitle={editTitle}
          editDescription={editDescription}
          commentText={commentText}
          editAttachments={editAttachments}
          editComments={editComments}
          editPriority={editPriority}
          editTag={editTag}
          editDueDate={editDueDate}
          setEditTitle={setEditTitle}
          setEditDescription={setEditDescription}
          setEditPriority={setEditPriority}
          setEditTag={setEditTag}
          setEditDueDate={setEditDueDate}
          setEditAttachments={setEditAttachments}
          setCommentText={setCommentText}
          addCommentToModal={addCommentToModal}
          renderDescriptionLinks={renderDescriptionLinks}
          handleFileChange={handleFileChange}
          tagOptions={TAG_OPTIONS}
        />
      )}

    </div>
    </>
  );
}

export default App;