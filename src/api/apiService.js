import axios from "axios";

const BASE_URL = 'http://localhost/todo-app';

const apiService = {
    login: async (credentials) => {
        const response = await axios.post(`${BASE_URL}/login.php`, credentials);
        return response.data;
    },
    register: async (userData) => {
        const response = await axios.post(`${BASE_URL}/register.php`, userData);
        return response.data;
    },
    getLists: async (userId) => {
        const response = await axios.get(`${BASE_URL}/getLists.php`, { params: { user_id: userId} });
        return response.data;
    },
    getTasks: async (listId) => {
        const response = await axios.get(`${BASE_URL}/getTasks.php`, { params: { list_id: listId } });
        return response.data;
    },
    addTask: async (task) => {
        const response = await axios.post(`${BASE_URL}/addTask.php`, task);
        return response.data;
    },
    updateTask: async (task) => {
        const response = await axios.put(`${BASE_URL}/updateTask.php`, task);
        return response.data;
    },
    deleteTask: async (taskId) => {
        await axios.delete(`${BASE_URL}/deleteTask.php`, { data: { task_id: taskId }});
    },
};

export default apiService;