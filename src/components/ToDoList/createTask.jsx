import { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addTask } from "../../redux/slices/taskSlice";
import { uploadAttachment } from "../../redux/slices/attachmentSlice";
import { v4 as uuidv4 } from 'uuid';
import '../../styles/CreateTask.css';

const CreateTask = ({ isOpen, onClose, listId }) => {
    const [name, setName] = useState('');
    const [note, setNote] = useState('');
    const [error, setError] = useState(null);
    const [attachment, setAttachment] = useState(null);
    const dispatch = useDispatch();
    const modalRef = useRef(null);
    const textareaRef = useRef(null);
    const lineNumbersRef = useRef(null);

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
            setError(null);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isOpen, onClose]);

    useEffect(() => {
        const updateLineNumbers = () => {
            const lines = note.split('\n').length;
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
    }, [isOpen, note]);

    const handleFileChange = (e) => {
        setAttachment(e.target.files[0]);
    };

    const handleSubmit = async () => {
        if (!name) {
            setError('Task name can`t be empty');
            return;
        }
    
        // Generate a unique task ID
        const taskId = uuidv4();
    
        // Initialize the new task object
        const newTask = { id: taskId, list_id: listId, name: name, status: 'Todo', note: note };
    
        try {
            // Handle attachment upload first if there is an attachment
            if (attachment) {
                const formData = new FormData();
                formData.append('file', attachment);
                formData.append('task_id', taskId);
    
                const res = await fetch('https://list-todo.com/uploadAttachment.php', {
                    method: 'POST',
                    body: formData
                });
    
                const result = await res.json();
                if (result.message !== 'File uploaded successfully') {
                    console.error('Attachment upload failed');
                    setError(result.message || 'Failed to upload attachment');
                    return;
                }
            }
    
            // If attachment upload is successful or no attachment, proceed to create the task
            const response = await dispatch(addTask(newTask)).unwrap();
    
            setName('');
            setNote('');
            setAttachment(null);
            onClose();
        } catch (error) {
            console.error('Error creating task:', error);
            setError('Failed to create task');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="ct-overlay">
            <div className="ct-content" ref={modalRef}>
                <h2>Create new task</h2>
                {error && <p className="task-error">{error}</p>}
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Task Name"
                    maxLength={30}
                    required
                />
                <div className="textarea-container">
                    <div className="line-numbers" ref={lineNumbersRef}></div>
                    <textarea
                        ref={textareaRef}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Notes Here"
                    />
                </div>
                <input
                    type="file"
                    className="attach-upload-input"
                    onChange={handleFileChange}
                />
                <button onClick={handleSubmit}>Create</button>
            </div>
        </div>
    );
}

export default CreateTask;
