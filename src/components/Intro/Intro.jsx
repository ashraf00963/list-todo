import { useState } from "react";
import Login from "../Auth/Login";
import Register from "../Auth/Register";
import SuccessMessage from "../utils/SuccessMessage";
import '../../styles/Intro.css';

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
                <h1>To-Do List</h1>
                <div className='intro-header-btn'>
                    <button className='intro-login-btn' onClick={handleLoginPopup}>Login</button>
                    <button className='intro-register-btn' onClick={handleRegisterPopup}>Join Now</button>
                </div>
            </div>
            <div className='intro-content'>
                <h2 className='intro-h2'>Are You Ready To-Do?</h2>
                <p className='intro-p'>Start now:</p>
                <ul className='intro-content-list'>
                    <li>Create as many lists as you want.</li>
                    <li>Lists can contain as many tasks as needed.</li>
                    <li>Free Of Charge, Join us now.</li>
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
