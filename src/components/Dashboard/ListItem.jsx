import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteListAsync } from '../../redux/slices/listSlice';
import Popup from '../UI/Popup';
import { FaTrashCan } from "react-icons/fa6";
import '../../styles/ListItem.css';

const ListItem = ({ list }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);

    const handleNavigate = () => {
        if (!isDeletePopupOpen) {
            navigate(`/list/${list.id}`);
        }
    };

    const handleDelete = () => {
        dispatch(deleteListAsync(list.id));
        setIsDeletePopupOpen(false);
    };

    return (
        <div className="list-item" onClick={handleNavigate}>
            <span>{list.name}</span>
            <FaTrashCan
                className="delete-icon"
                onClick={(e) => {
                    e.stopPropagation();
                    setIsDeletePopupOpen(true);
                }}
            />
            {isDeletePopupOpen && (
                <Popup onClose={() => setIsDeletePopupOpen(false)} isOpen={isDeletePopupOpen}>
                    <h3>Are you sure you want to delete this list?</h3>
                    <button onClick={handleDelete}>Yes</button>
                    <button onClick={() => setIsDeletePopupOpen(false)}>No</button>
                </Popup>
            )}
        </div>
    );
}

export default ListItem;