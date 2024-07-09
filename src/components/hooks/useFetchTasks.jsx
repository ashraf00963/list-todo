import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from "../../redux/slices/taskSlice";
import sortTasks from '../ToDoList/sortTasks';

const useFetchTasks = (listId, userId) => {
    const dispatch = useDispatch();
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await dispatch(fetchTasks({ listId, userId }));
            } catch (err) {
                setError('Failed to fetch tasks. Please try again.');
            }
        };
        fetchData();
    }, [dispatch, userId, listId]);

    const tasks = useSelector(state => state.tasks.tasks) || [];
    const loading = useSelector(state => state.tasks.loading);

    const sortedTasks = useMemo(() => sortTasks(tasks), [tasks]);

    return { tasks: sortedTasks, loading, error };
};

export default useFetchTasks;
