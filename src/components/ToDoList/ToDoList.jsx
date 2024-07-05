import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { fetchTasks } from "../../redux/slices/taskSlice";
import { DndContext, DragOverlay, PointerSensor, closestCorners, useSensor, useSensors } from "@dnd-kit/core";
import Container from "./Container";
import { Item } from "./SortItem";
import apiService from '../../api/apiService';
import { arrayMove } from "@dnd-kit/sortable";
import CreateTask from "./createTask";
import TaskModal from "./TaskModal";
import Loading from "../UI/Loading";
import '../../styles/ToDoList.css';

const ToDoList = () => {
    const { listId } = useParams();
    const [arras, setArras] = useState({ Todo: [], inProgress: [], completed: [] });
    const [activeId, setActiveId] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [taskModal, setTaskModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const tasks = useSelector(state => state.tasks.tasks) || []; // Default to an empty array if tasks is not defined
    const loading = useSelector(state => state.tasks.loading);
    const error = useSelector(state => state.tasks.error);
    const [loadingDelayer, setLoadingDelayer] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const userId = localStorage.getItem('userId');
    const dispatch = useDispatch();
    const location = useLocation();
    const { listName } = location.state || {};

    const dragActivationDistance = 10;

    // Define sensors with activation distance for dragging
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: dragActivationDistance
            }
        })
    );

    // Fetch tasks when component mounts or when listId or userId changes
    useEffect(() => {
        dispatch(fetchTasks({ listId, userId }));
    }, [dispatch, userId, listId]);

    useEffect(() => {
        if(loading){
            setLoadingDelayer(true);
            setTimeout(() => {
                setLoadingDelayer(false);
            }, 800)
        }
    }, [loading]);

    // Update arras state when tasks change
    useEffect(() => {
        const Todo = [];
        const inProgress = [];
        const completed = [];

        // Ensure tasks is an array and then process
        if (Array.isArray(tasks)) {
            tasks.forEach(item => {
                switch (item.status) {
                    case 'completed':
                        completed.push(item);
                        break;
                    case 'inProgress':
                        inProgress.push(item);
                        break;
                    case 'Todo':
                    default:
                        Todo.push(item);
                }
            });
        }

        setArras({
            Todo: Todo.sort((a, b) => a.position - b.position),
            inProgress: inProgress.sort((a, b) => a.position - b.position),
            completed: completed.sort((a, b) => a.position - b.position)
        });
    }, [tasks]);

    // Handle drag start
    const handleDragStart = (event) => {
        const { active } = event;
        setActiveId(active.id);
        setIsDragging(true);
    };

    // Handle drag over
    const handleDragOver = (event) => {
        const { active, over, draggingRect } = event;
        const activeId = active.id;
        const overId = over?.id;

        if (!over || !draggingRect) {
            return;
        }

        const activeContainer = findContainer(activeId);
        const overContainer = findContainer(overId);

        if (!activeContainer || !overContainer || activeContainer === overContainer) {
            return;
        }

        // Update arras state with new positions
        setArras(prev => {
            const activeItems = prev[activeContainer];
            const overItems = prev[overContainer];

            const activeIndex = activeItems.findIndex(item => item.id === activeId);
            const overIndex = overItems.findIndex(item => item.id === overId);

            let newIndex;
            if (overId in prev) {
                newIndex = overItems.length + 1;
            } else {
                const isBelowLastItem = overIndex === overItems.length - 1 && draggingRect.offsetTop > over.rect.offsetTop + over.rect.height;
                const modifier = isBelowLastItem ? 1 : 0;
                newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
            }

            return {
                ...prev,
                [activeContainer]: activeItems.filter((item, index) => index !== activeIndex),
                [overContainer]: [
                    ...overItems.slice(0, newIndex),
                    activeItems[activeIndex],
                    ...overItems.slice(newIndex)
                ]
            };
        });
    };

    // Handle drag end
    const handleDragEnd = async (event) => {
        const { active, over } = event;
        const activeId = active.id;
        const overId = over?.id;

        const activeContainer = findContainer(activeId);
        const overContainer = over ? (over.id in arras ? over.id : findContainer(over.id)) : null;

        if (!activeContainer || !overContainer) {
            setIsDragging(false);
            return;
        }

        const activeIndex = arras[activeContainer].findIndex(item => item.id === activeId);
        const overIndex = overId ? arras[overContainer].findIndex(item => item.id === overId) : arras[overContainer].length;

        let newArras = { ...arras };

        if (activeContainer !== overContainer) {
            // Update task status and position
            const movedTask = {
                ...newArras[activeContainer][activeIndex],
                status: overContainer // Set the new status based on the target container
            };

            newArras[activeContainer] = newArras[activeContainer].filter((item, index) => index !== activeIndex);
            newArras[overContainer] = [
                ...newArras[overContainer].slice(0, overIndex),
                movedTask,
                ...newArras[overContainer].slice(overIndex)
            ];
        } else if (activeIndex !== overIndex) {
            // Only update positions within the same container
            newArras = {
                ...newArras,
                [overContainer]: arrayMove(newArras[overContainer], activeIndex, overIndex)
            };
        }

        // Update positions in the new array and sort by position
        Object.keys(newArras).forEach(key => {
            newArras[key] = newArras[key].map((item, index) => ({
                ...item,
                position: index + 1
            })).sort((a, b) => a.position - b.position);
        });

        setArras(newArras);

        // Prepare tasks with new positions and statuses to send to the server
        const tasksToUpdate = [];
        Object.keys(newArras).forEach(key => {
            newArras[key].forEach((item) => {
                tasksToUpdate.push({
                    task_id: item.id,
                    position: item.position,
                    status: item.status,
                    list_id: listId
                });
            });
        });
        const response = await apiService.updateTaskPositions(tasksToUpdate);
        setIsDragging(false);
        setActiveId(null);
    };

    // Find container by task id
    const findContainer = (id) => {
        if (id in arras) {
            return id;
        }

        return Object.keys(arras).find((key) => arras[key].some(item => item.id === id));
    };

    // Handle task click
    const handleTaskClick = (task) => {
        setSelectedTask(task);
        setTaskModal(true);
    };

    return (
        <div className="TDL-page">  
            {loadingDelayer && <Loading />}
            <div className="TDL-header">
                <h1>{listName}</h1>
                <div className="TDL-func">
                    <button className="create-task-btn" onClick={() => setIsOpen(true)}>Create New Task</button>
                    {error && <p className="error-p">{error}</p>}
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
                <TaskModal task={selectedTask} isOpen={taskModal} onClose={() => setTaskModal(false)} />
            )}
        </div>
    );
};

export default ToDoList;
