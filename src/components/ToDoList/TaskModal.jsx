import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateTaskNote, deleteTask } from "../../redux/slices/taskSlice";
import { MdModeEdit, MdDelete } from "react-icons/md";
import { fetchAttachments, deleteAttachment } from "../../redux/slices/attachmentSlice";

const TaskModal = ({ task, isOpen, onClose }) => {
    const [editMode, setEditMode] = useState(false);
    const [editNote, setEditNote] = useState('');
    const dispatch = useDispatch();
    const taskId = task.id;
    const modalRef = useRef();
    const textareaRef = useRef(null);
    const lineNumbersRef = useRef(null);
    const attachmentsState = useSelector(state => state.attachments);
    const { attachments, loading, error } = attachmentsState;

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
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

    useEffect(() => {
        setEditNote(task.note);
        if (isOpen) {
            dispatch(fetchAttachments(task.id));
        }
    }, [task, isOpen, dispatch]);

    const handleEditClick = () => {
        setEditMode(true);
    };

    const handleUpdateClick = () => {
        if (editNote === task.note) {
            setEditMode(false);
            return;
        }

        dispatch(updateTaskNote({ taskId, note: editNote }));
        setEditMode(false);
        onClose();
    };

    const handleDeleteClick = () => {
        if (attachments.length === 0) {
            dispatch(deleteTask(taskId));
            onClose();
        } else {
            alert('You must delete all attachments before deleting the task.');
        }
    };

    const handleDeleteAttachment = (attachmentId) => {
        dispatch(deleteAttachment(attachmentId)); // Sending just the number as the payload
    };
    
    useEffect(() => {
        const updateLineNumbers = () => {
            const lines = editNote.split('\n').length;
            lineNumbersRef.current.innerHTML = Array(lines).fill(0).map((_, i) => `<span>${i + 1}</span>`).join('');
        };

        if (isOpen && textareaRef.current) {
            const textarea = textareaRef.current;
            textarea.addEventListener('input', updateLineNumbers);
            textarea.addEventListener('scroll', () => {
                lineNumbersRef.current.scrollTop = textarea.scrollTop;
            });
            updateLineNumbers(); // Initialize line numbers
        }

        return () => {
            if (textareaRef.current) {
                const textarea = textareaRef.current;
                textarea.removeEventListener('input', updateLineNumbers);
            }
        };
    }, [isOpen, editNote]);

    if (!isOpen) return null;

    return (
        <div className="ct-overlay">
            <div className="ct-content" ref={modalRef}>
                <h2>{task.name}</h2>
                {editMode ? (
                    <div className="textarea-container">
                        <div className="line-numbers" ref={lineNumbersRef}></div>
                        <textarea
                            ref={textareaRef}
                            value={editNote}
                            onChange={(e) => setEditNote(e.target.value)}
                            placeholder="Notes Here"
                        />
                    </div>
                ) : (
                    <textarea 
                        value={task.note}
                        readOnly
                        placeholder='No notes available'
                    />
                )}
                {attachments?.length > 0 && (
                    <div className="attachments">
                        <h3>Attachments</h3>
                        {error && <p>{error}</p>}
                        <ul>
                            {attachments.map(attachment => (
                                <li key={attachment.id}>
                                    <a href={`http://localhost/todo-app/${attachment.file_path}`} target="_blank" rel="noopener noreferrer">
                                        {attachment.file_path.split('/').pop()}
                                    </a>
                                    <MdDelete onClick={() => handleDeleteAttachment(attachment.id)} className='delete-icony' />
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <div className="tk-btns">
                    <MdDelete 
                        onClick={handleDeleteClick} 
                        className='delete-icones' 
                        style={{ color: attachments.length > 0 ? 'gray' : 'red', cursor: attachments.length > 0 ? 'not-allowed' : 'pointer' }} 
                    />
                    {editMode ? (
                        <button className="tk-up-btn" onClick={handleUpdateClick}>Update</button>
                    ) : (
                        <MdModeEdit onClick={handleEditClick} className='edit-icones' />
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskModal;
