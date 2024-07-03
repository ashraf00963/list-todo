import { useEffect, useRef } from 'react';
import '../../styles/Popup.css';

const Popup = ({ children, onClose, isOpen }) => {
    const PopupRef = useRef(null);

    //useEffect handling click out side to close login popup
    useEffect(() => {
      const handleOutsideClick = (event) => {
          if(PopupRef.current && !PopupRef.current.contains(event.target)) {
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


    return (
        <div className="popup-overlay">
            <div className="popup-content" ref={PopupRef}>
                {children}
            </div>
        </div>
    );
};

export default Popup;
