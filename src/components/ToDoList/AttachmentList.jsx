import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { useDispatch } from "react-redux";
import { fetchAttachments, deleteAttachment } from "../../redux/slices/attachmentSlice";

const AttachmentList = ({ taskId, attachments, setFetchError, setUploadError }) => {
    const dispatch = useDispatch();
    const [showAttachments, setShowAttachments] = useState(false);
    const [hidingAttachments, setHidingAttachments] = useState(false);

    useEffect(() => {
        if (attachments.length > 0) {
            setHidingAttachments(false);
            setShowAttachments(true);
        } else if (showAttachments) {
            setHidingAttachments(true);
            setTimeout(() => {
                setShowAttachments(false);
            }, 500); // Duration of bounceOut animation
        }
    }, [attachments, showAttachments]);

    const handleDeleteAttachment = (attachmentId) => {
        dispatch(deleteAttachment(attachmentId))
            .unwrap()
            .then(() => {
                dispatch(fetchAttachments(taskId))
                    .unwrap()
                    .catch((err) => setFetchError(err.message));
            })
            .catch((err) => setUploadError(err.message));
    };

    return (
        <div className={`attachments ${showAttachments ? "show" : ""} ${hidingAttachments ? "hide" : ""}`}>
            <h3>Attachments</h3>
            <ul>
                {attachments.map((attachment) => (
                    <li key={attachment.id}>
                        <a href={`https://list-todo.com/${attachment.file_path}`} target="_blank" rel="noopener noreferrer">
                            {attachment.file_path.split('/').pop()}
                        </a>
                        <MdDelete onClick={() => handleDeleteAttachment(attachment.id)} className='attach-delete-btn' />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AttachmentList;
