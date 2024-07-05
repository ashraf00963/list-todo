import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { addTask } from "../../redux/slices/taskSlice";
import '../../styles/CreateTask.css';

const CreateTask = ({ isOpen, onClose, listId }) => {
    const [name, setName] = useState('');
    const [note, setNote] = useState('');
    const [error, setError] = useState(null);
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

    const handleSubmit = () => {
        if (name) {
            const newTask = { list_id: listId, name: name, status: 'Todo', note: note };
            dispatch(addTask(newTask));  
            onClose();
        }
        setError('Task name can`t be empty');
    }

    if(!isOpen) return null;

    return(
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
                <button onClick={handleSubmit}>Create</button>
            </div>
        </div>
    )
}

export default CreateTask;
