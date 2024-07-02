import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Intro from './components/Intro/Intro';
import './App.css';


function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path='/' element={<Intro />} />
        </Routes>
      </Router>
    </Provider>
  )
}

export default App
