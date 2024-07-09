import React, { useRef, useEffect } from "react";

const EditNote = ({ isOpen, editNote, setEditNote }) => {
    const textareaRef = useRef(null);
    const lineNumbersRef = useRef(null);

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

    return (
        <div className="textarea-container">
            <div className="line-numbers" ref={lineNumbersRef}></div>
            <textarea
                ref={textareaRef}
                value={editNote}
                onChange={(e) => setEditNote(e.target.value)}
                placeholder="Notes Here"
            />
        </div>
    );
};

export default EditNote;
