import React from "react";
import { MdModeEdit, MdDelete } from "react-icons/md";

const TaskActions = ({ editMode, handleDeleteClick, handleEditClick, handleUpdateClick, isLoading, attachments }) => {
    return (
        <div className="tk-btns">
            <MdDelete 
                onClick={handleDeleteClick} 
                className='delete-icones' 
                data-cy='delete-task-button'
                style={{ color: attachments.length > 0 ? 'gray' : 'red', cursor: attachments.length > 0 ? 'not-allowed' : 'pointer' }} 
            />
            {editMode ? (
                <button className="tk-up-btn" onClick={handleUpdateClick} disabled={isLoading}>
                    {isLoading ? 'Updating...' : 'Update Note'}
                </button>
            ) : (
                <MdModeEdit onClick={handleEditClick} className='edit-icones' />
            )}
        </div>
    );
};

export default TaskActions;
