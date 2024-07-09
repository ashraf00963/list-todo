import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { DndContext, DragOverlay, closestCorners } from "@dnd-kit/core";
import Container from "./Container";
import { Item } from "./SortItem";
import CreateTask from "./createTask";
import TaskModal from "./TaskModal";
import Loading from "../UI/Loading";
import useDragAndDrop from '../hooks/useDragAndDrop';
import useFetchTasks from '../hooks/useFetchTasks';
import SuccessMessage from "../utils/SuccessMessage";
import '../../styles/ToDoList.css';

const ToDoList = () => {
    const { listId } = useParams();
    const [arras, setArras] = useState({ Todo: [], inProgress: [], completed: [] });
    const [taskModal, setTaskModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [loadingDelayer, setLoadingDelayer] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const location = useLocation();
    const { listName, userId } = location.state || {};
    const { tasks, loading, error: fetchError } = useFetchTasks(listId, userId);
    
    const {
        sensors,
        activeId,
        isDragging,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
        error: dragError
    } = useDragAndDrop(arras, setArras, listId);

    useEffect(() => {
        if (loading) {
            setLoadingDelayer(true);
            setTimeout(() => {
                setLoadingDelayer(false);
            }, 800);
        }
    }, [loading]);

    useEffect(() => {
        setArras(tasks);
    }, [tasks]);

    const handleTaskClick = (task) => {
        setSelectedTask(task);
        setTaskModal(true);
    };

    return (
        <>
            <SuccessMessage message={successMessage} clearMessage={() => setSuccessMessage('')} />
            <div className="TDL-page">
                {loadingDelayer && <Loading />}
                <div className="TDL-header">
                    <h1>{listName}</h1>
                    <div className="TDL-func">
                        <button className="create-task-btn" onClick={() => setIsOpen(true)}>Create New Task</button>
                        {fetchError && <p className="error-p">{fetchError}</p>}
                    </div>
                </div>
                <CreateTask isOpen={isOpen} onClose={() => setIsOpen(false)} listId={listId} />
                <div className="TDL-dnd">
                    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
                        <Container id='Todo' items={arras.Todo} onTaskClick={handleTaskClick} />
                        <Container id='inProgress' items={arras.inProgress} onTaskClick={handleTaskClick} />
                        <Container id='completed' items={arras.completed} onTaskClick={handleTaskClick} />
                        <DragOverlay>
                            {activeId ? (
                                <Item
                                    id={activeId}
                                    name={Object.keys(arras).reduce((name, key) => {
                                        const task = arras[key].find(task => task.id === activeId);
                                        return task ? task.name : name;
                                    }, '')}
                                />
                            ) : null}
                        </DragOverlay>
                    </DndContext>
                </div>
                {taskModal && selectedTask && (
                    <TaskModal 
                        task={selectedTask} 
                        isOpen={taskModal} 
                        onClose={() => setTaskModal(false)} 
                        setSuccessMessage={setSuccessMessage} 
                    />
                )}
            </div>
        </>
    );
};

export default ToDoList;
