import { useState, useCallback } from 'react';
import { useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import apiService from '../../api/apiService';

const useDragAndDrop = (arras, setArras, listId) => {
    const [activeId, setActiveId] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState(null);

    const dragActivationDistance = 10;
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: dragActivationDistance
            }
        })
    );

    const findContainer = (id) => {
        if (id in arras) {
            return id;
        }
        return Object.keys(arras).find((key) => arras[key].some(item => item.id === id));
    };

    const handleDragStart = (event) => {
        const { active } = event;
        setActiveId(active.id);
        setIsDragging(true);
    };

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
            const movedTask = {
                ...newArras[activeContainer][activeIndex],
                status: overContainer
            };

            newArras[activeContainer] = newArras[activeContainer].filter((item, index) => index !== activeIndex);
            newArras[overContainer] = [
                ...newArras[overContainer].slice(0, overIndex),
                movedTask,
                ...newArras[overContainer].slice(overIndex)
            ];
        } else if (activeIndex !== overIndex) {
            newArras = {
                ...newArras,
                [overContainer]: arrayMove(newArras[overContainer], activeIndex, overIndex)
            };
        }

        Object.keys(newArras).forEach(key => {
            newArras[key] = newArras[key].map((item, index) => ({
                ...item,
                position: index + 1
            })).sort((a, b) => a.position - b.position);
        });

        setArras(newArras);

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

        try {
            await apiService.updateTaskPositions(tasksToUpdate);
        } catch (err) {
            setError('Failed to update task positions. Please try again.');
        }

        setIsDragging(false);
        setActiveId(null);
    };

    return {
        sensors,
        activeId,
        isDragging,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
        error
    };
};

export default useDragAndDrop;
