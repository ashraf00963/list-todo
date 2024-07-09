const sortTasks = (tasks) => {
    const Todo = [];
    const inProgress = [];
    const completed = [];

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

    return {
        Todo: Todo.sort((a, b) => a.position - b.position),
        inProgress: inProgress.sort((a, b) => a.position - b.position),
        completed: completed.sort((a, b) => a.position - b.position),
    };
};

export default sortTasks;
