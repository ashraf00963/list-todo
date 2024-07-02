import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from '../../redux/slices/authSlice';
import zxcvbn from "zxcvbn";
import '../../styles/Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '' });
    const [passwordStrength, setPasswordStrength] = useState(null);
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if( name === 'password') {
            const strength = zxcvbn(value);
            setPasswordStrength(strength);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if(formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        const { confirmPassword, ...registrationData } = formData;
        dispatch(registerUser(registrationData));
    };

    return (
        <div className="auth-container">
            <h2>Register</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                {passwordStrength && (
                    <div className="password-strength">
                        <progress value={passwordStrength.score} max='4' />
                        <p>{passwordStrength.feedback.suggestions.join(' ')}</p>
                    </div>
                )}
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Registering' : 'Regsiter'}
                </button>
            </form>
        </div>
    )
}

export default Register;