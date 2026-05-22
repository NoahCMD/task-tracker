import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');

  const fetchTasks = () => {
    axios.get('http://localhost:8000/tasks')
      .then(response => setTasks(response.data))
      .catch(error => console.error("Error:", error));
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    axios.post('http://localhost:8000/tasks', { title })
      .then(() => {
        setTitle('');
        fetchTasks(); 
      })
      .catch(error => console.error("Error adding:", error));
  };

  useEffect(() => { fetchTasks(); }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Task Tracker</h1>
        
        {/* Add Task Form */}
        <form onSubmit={addTask} className="mb-8 flex gap-2">
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 p-3 rounded-lg border border-gray-200 outline-none focus:border-blue-500"
          />
          <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add</button>
        </form>

        {/* Task List */}
        <div className="grid gap-4">
          {tasks.map(task => (
            <div key={task.id} className="p-6 bg-white shadow-sm rounded-xl border border-gray-100">
              <h2 className="font-semibold text-gray-800">{task.title}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;