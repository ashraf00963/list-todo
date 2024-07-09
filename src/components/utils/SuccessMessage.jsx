import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import '../../styles/SuccessMessage.css'; // Adjust the path as needed

const SuccessMessage = ({ message, clearMessage }) => {
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                clearMessage();
            }, 3000); // Clear the message after 3 seconds

            return () => clearTimeout(timer);
        }
    }, [message, clearMessage]);

    if (!message) return null;

    return (
        <div className="success-message">
            {message}
        </div>
    );
};

SuccessMessage.propTypes = {
    message: PropTypes.string.isRequired,
    clearMessage: PropTypes.func.isRequired,
};

export default SuccessMessage;
