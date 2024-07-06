import { useState, useEffect } from "react";
import { evaluatePassword } from 'password-strength';
import '../../styles/PasswordStrengthChecker.css';

const rules = [
    { id: 'minLength', text: 'At least 9 characters', test: (password) => password.length >= 8 },
    { id: 'lowercase', text: 'At least one lowercase letter', test: (password) => /[a-z]/.test(password) },
    { id: 'uppercase', text: 'At least one uppercase letter', test: (password) => /[A-Z]/.test(password) },
    { id: 'number', text: 'At least one number', test: (password) => /[0-9]/.test(password) },
    { id: 'specialChar', text: 'At least one special character', test: (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password) },
];

function PasswordStrengthChecker({ password, setPassword }) {
    const [results, setResults] = useState([]);

    useEffect(() => {
        setResults(rules.map(rule => ({ ...rule, passed: rule.test(password) })));
    }, [password]);

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
    };

    return (
        <div className="password-strength-checker">
            <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter your password"
                required
            />
            <ul className="password-rules">
                {results.map((result) => (
                    <li key={result.id} className={result.passed ? 'passed' : 'failed'}>
                        {result.passed ? 
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2" className="checkmark1">
                                <circle className="path circle" fill="none" stroke="#73AF55" stroke-width="6" stroke-miterlimit="10" cx="65.1" cy="65.1" r="62.1"/>
                                <polyline className="path check" fill="none" stroke="#73AF55" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 "/>
                            </svg>
                        : 
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2" className="xmark">
                                <circle className="path circle" fill="none" stroke="#D06079" stroke-width="6" stroke-miterlimit="10" cx="65.1" cy="65.1" r="62.1"/>
                                <line className="path line" fill="none" stroke="#D06079" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" x1="34.4" y1="37.9" x2="95.8" y2="92.3"/>
                                <line className="path line" fill="none" stroke="#D06079" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" x1="95.8" y1="38" x2="34.4" y2="92.2"/>
                            </svg>
                        } <span className="rules-lis">{result.text}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default PasswordStrengthChecker;