import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Intro from './components/Intro/Intro';
import './App.css';
import Dashboard from './components/Dashboard/Dashboard';
import ToDoList from './components/ToDoList/ToDoList';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path='/' element={<Intro />} />
          <Route path='/dashboard/:userId' element={<Dashboard />} />
          <Route path='/list/:listId' element={<ToDoList />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
