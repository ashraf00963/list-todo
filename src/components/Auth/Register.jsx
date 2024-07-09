import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from '../../redux/slices/authSlice';
import PasswordStrengthChecker from "./PasswordStrengthChecker";
import '../../styles/Auth.css';

const Register = ({ isOpen, onClose, onLoginOpen, setSuccessMessage }) => {
    const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '' });
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);
    const loginRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (loginRef.current && !loginRef.current.contains(event.target)) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.removeEventListener('mousedown', handleOutsideClick);
        }
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handlePasswordChange = (password) => {
        setFormData({ ...formData, password });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        const { confirmPassword, ...registrationData } = formData;
        const resultAction = await dispatch(registerUser(registrationData));
        if (registerUser.fulfilled.match(resultAction)) {
            setSuccessMessage('Registered successfully');
            onClose();
            onLoginOpen();
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" ref={loginRef}>
                <h2>Register</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    <PasswordStrengthChecker
                        password={formData.password}
                        setPassword={handlePasswordChange}
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>
                <p>Already have an account? <span onClick={onLoginOpen} className="switch-link">Login</span></p>
            </div>
        </div>
    );
};

export default Register;
