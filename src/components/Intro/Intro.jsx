import { useState } from "react";
import Login from "../Auth/Login";
import Register from "../Auth/Register";
import SuccessMessage from "../utils/SuccessMessage";
import '../../styles/Intro.css';
import logo from '../../assets/logo.png';

function Intro() {
    const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
    const [isRegisterPopupOpen, setIsRegisterPopupOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // funcs to handle which popup is open
    const handleLoginPopup = () => {
        setIsLoginPopupOpen(true);
        setIsRegisterPopupOpen(false);
    };

    const handleRegisterPopup = () => {
        setIsRegisterPopupOpen(true);
        setIsLoginPopupOpen(false);
    };

    return (
        <div className='intro-page'>
            {successMessage && <SuccessMessage message={successMessage} clearMessage={() => setSuccessMessage('')} />}
            <div className='intro-page-header'>
                <img src={logo} style={{ width: '200px'}} />
                <div className='intro-header-btn'>
                    <button className='intro-login-btn' onClick={handleLoginPopup}>Login</button>
                    <button className='intro-register-btn' onClick={handleRegisterPopup}>Join Now</button>
                </div>
            </div>
            <div className='intro-content'>
                <h2 className='intro-h2'>Are You Ready <span className="gold-touch">To-Do</span>?</h2>
                <p className="intro-sent">Unlock your productivity potential with our seamless task management tools.</p>
                <p className='intro-p'>Start now:</p>
                <ul className='intro-content-list'>
                    <li>Effortlessly Create and Manage Unlimited Lists and Tasks.</li>
                    <li>Organize Your Projects Your Way.</li>
                    <li><span className="gold-touch" onClick={() => setIsRegisterPopupOpen(true)} style={{ cursor: 'pointer'}}>Join Us Now</span> and Boost Your Productivity Today!</li>
                </ul>
                <Login 
                    isOpen={isLoginPopupOpen}
                    onClose={() => setIsLoginPopupOpen(false)}
                    onRegisterOpen={handleRegisterPopup}
                    setSuccessMessage={setSuccessMessage} // Pass the handler
                />
                <Register
                    isOpen={isRegisterPopupOpen}
                    onClose={() => setIsRegisterPopupOpen(false)}
                    onLoginOpen={handleLoginPopup}
                    setSuccessMessage={setSuccessMessage} // Pass the handler
                />
            </div>
        </div>
    );
}

export default Intro;
