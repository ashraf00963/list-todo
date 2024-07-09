import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateTaskNote, deleteTask } from "../../redux/slices/taskSlice";
import { fetchAttachments, uploadAttachment } from "../../redux/slices/attachmentSlice";
import AttachmentList from "./AttachmentList";
import EditNote from "./EditNote";
import TaskActions from "./TaskActions";
import '../../styles/TaskModal.css';

const TaskModal = ({ task, isOpen, onClose, setSuccessMessage }) => {
    const [editMode, setEditMode] = useState(false);
    const [editNote, setEditNote] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [uploadError, setUploadError] = useState(null);
    const [fetchError, setFetchError] = useState(null);
    const [uploadMode, setUploadMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const taskId = task.id;
    const modalRef = useRef();
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
            dispatch(fetchAttachments(task.id))
                .unwrap()
                .catch((err) => setFetchError(err.message));
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

        setIsLoading(true);
        dispatch(updateTaskNote({ taskId, note: editNote }))
            .unwrap()
            .then(() => {
                setEditMode(false);
                setIsLoading(false);
                setSuccessMessage(`Task "${task.name}" updated successfully.`);
                onClose();
            })
            .catch((err) => {
                setIsLoading(false);
                setFetchError('Failed to update task note');
            });
    };

    const handleDeleteClick = () => {
        if (attachments.length === 0) {
            dispatch(deleteTask(taskId))
                .unwrap()
                .then(onClose)
                .catch((err) => setFetchError('Failed to delete task'));
        } else {
            alert('You must delete all attachments before deleting the task.');
        }
    };

    const handleFileChange = (e) => {
        setAttachment(e.target.files[0]);
    };

    const handleUploadAttachment = async () => {
        if (attachment) {
            const formData = new FormData();
            formData.append('file', attachment);
            formData.append('task_id', taskId);
            setIsLoading(true);
            try {
                const res = await fetch('https://list-todo.com/uploadAttachment.php', {
                    method: 'POST',
                    body: formData
                });

                const result = await res.json();
                if (result.message === 'File uploaded successfully') {
                    dispatch(fetchAttachments(task.id))
                        .unwrap()
                        .then(() => {
                            setAttachment(null);
                            setUploadError(null);
                            setFetchError(null);
                            setUploadMode(false);
                            setIsLoading(false);
                            setSuccessMessage('Attachment uploaded successfully.');
                        })
                        .catch((err) => {
                            setFetchError(err.message);
                            setIsLoading(false);
                        });
                } else {
                    throw new Error(result.message || 'Attachment upload failed');
                }
            } catch (error) {
                setUploadError(error.message);
                setIsLoading(false);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="tm-overlay">
            <div className="tm-content" ref={modalRef}>
                <h2>{task.name}</h2>
                <button onClick={onClose} className="close-btn">X</button>
                {fetchError && <p className="error-message">{fetchError}</p>}
                {editMode ? (
                    <>
                        <EditNote isOpen={isOpen} editNote={editNote} setEditNote={setEditNote} />
                        {uploadMode ? (
                            <>
                                {uploadError && <p className="error-message">{uploadError}</p>}
                                <div className='attach-tm'>
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                    />
                                    <button onClick={handleUploadAttachment} disabled={isLoading}>
                                        {isLoading ? 'Uploading...' : 'Upload Attachment'}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <button onClick={() => setUploadMode(true)}>Upload Attachments</button>
                        )}
                    </>
                ) : (
                    <textarea 
                        value={task.note}
                        readOnly
                        placeholder='No notes available'
                    />
                )}
                {attachments?.length > 0 && !editMode && (
                    <AttachmentList
                        taskId={taskId}
                        attachments={attachments}
                        setFetchError={setFetchError}
                        setUploadError={setUploadError}
                    />
                )}
                <TaskActions
                    editMode={editMode}
                    handleDeleteClick={handleDeleteClick}
                    handleEditClick={handleEditClick}
                    handleUpdateClick={handleUpdateClick}
                    isLoading={isLoading}
                    attachments={attachments}
                />
            </div>
        </div>
    );
};

export default TaskModal;
