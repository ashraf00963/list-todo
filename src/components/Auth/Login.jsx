import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from '../../redux/slices/authSlice';
import '../../styles/Auth.css';

const Login = ({ isOpen, onClose, onRegisterOpen }) => {
    const [credentials, setCredentials] = useState({ username: '', password: ''});
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);
    const loginRef = useRef(null);

     //useEffect handling click out side to close login popup
     useEffect(() => {
        const handleOutsideClick = (event) => {
            if(loginRef.current && !loginRef.current.contains(event.target)) {
                onClose();
            }
        }

        if(isOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.removeEventListener('mousedown', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        }
      }, [isOpen, onClose]);

    if(!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value }); 
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser(credentials));
    }

    return (
        <div className="modal-overlay">
          <div className="modal-content" ref={loginRef}>
            <h2>Login</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={credentials.username}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={credentials.password}
                onChange={handleChange}
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            <p>Don't have an account? <span onClick={onRegisterOpen} className="switch-link">Register</span></p>
          </div>
        </div>
    );
}

export default Login;