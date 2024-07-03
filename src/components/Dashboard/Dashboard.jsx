import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLists, addListAsync } from '../../redux/slices/listSlice';
import ListItem from './ListItem';
import Popup from '../UI/Popup';
import { v4 as uuidv4 } from "uuid";
import '../../styles/Dashboard.css';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { lists, loading, error } = useSelector((state) => state.lists);
    const [isAddListPopupOpen, setIsAddListPopupOpen] = useState(false);
    const [newlistName, setNewListName] = useState('');
    const userId = localStorage.getItem('userId');

    useEffect(() => {
         dispatch(fetchLists(userId));  
    }, [dispatch, userId]);

    const handleAddList = () => {
        const listId = uuidv4();
        dispatch(addListAsync({ user_id: userId, list_id: listId, name: newlistName }));
        setIsAddListPopupOpen(false);
        setNewListName('');
    };

    return (
        <div className="dashboard">
            <h1>Dashboard</h1>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            <div className="lists-container">
                <div className="lists-container-header">
                    <h2>My Lists</h2>
                    <button className="add-list-btn" onClick={() => setIsAddListPopupOpen(true)}>Create New List</button>
                </div>
                {lists.map((list) => (
                    <ListItem key={list.id} list={list} />
                ))}
            </div>
            {isAddListPopupOpen && (
                <Popup isOpen={isAddListPopupOpen} onClose={() => setIsAddListPopupOpen(false)}>
                    <h2>Add New List</h2>
                    <input
                        type="text"
                        placeholder="List Name"
                        value={newlistName}
                        onChange={(e) => setNewListName(e.target.value)}
                        maxLength={30}
                        required
                    />
                    <button onClick={handleAddList}>Add</button>
                </Popup>
            )}
        </div>
    );
} 

export default Dashboard;