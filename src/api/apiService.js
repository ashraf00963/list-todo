import axios from "axios";

const BASE_URL = 'https://list-todo.com';

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
    getTasks: async (listId, userId) => {
        const response = await axios.get(`${BASE_URL}/getList.php`, { params: { list_id: listId, user_id: userId } });
        return response.data;
    },
    getAttachments: async (taskId) => {
        const response = await axios.get(`${BASE_URL}/getAttachments.php`, { params: { task_id: taskId } });
        return response.data;
    },
    addList: async (list) => {
        const response = await axios.post(`${BASE_URL}/addList.php`, list);
        return response.data;
    },
    addTask: async (task) => {
        const response = await axios.post(`${BASE_URL}/addTask.php`, task);
        return response.data;
    },
    updateTaskNote: async (taskId, note) => {
        const response = await axios.put(`${BASE_URL}/updateTaskNote.php`, { id: taskId, note });
        return response.data;
    },
    updateTaskPositions: async (tasks) => {
        const response = await axios.put(`${BASE_URL}/updateTaskPositions.php`, { tasks });
        return response.data;
    },
    deleteList: async (listId) => {
        await axios.delete(`${BASE_URL}/deleteList.php`, { data: { list_id: listId } });
    },
    deleteTask: async (taskId) => {
        await axios.delete(`${BASE_URL}/deleteTask.php`, { data: { task_id: taskId }});
    },
    deleteAttachment: async (attachmentId) => {
        await axios.delete(`${BASE_URL}/deleteAttachment.php`, { data: attachmentId });
    },
    updateListOrder: async (userId, order) => {
        const response = await axios.put(`${BASE_URL}/updateListOrder.php`, { user_id: userId, order });
        return response.data;
    }
};

export default apiService;