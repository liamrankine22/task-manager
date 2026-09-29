import axios from "axios";
import { BASE_URL, API_URL } from "./apigen";

const API_URL_TASK = `${API_URL}/tasks`;

export const getTasks = () => {return axios.get(API_URL_TASK, {withCredentials: true}); };
export const getTaskById = (taskId) => {return axios.get(`${API_URL_TASK}/${taskId}`, {withCredentials: true}); };
export const getTasksForUser = (userId) => {return axios.get(`${API_URL_TASK}/user/${userId}`, {withCredentials: true}); };

export const createTask = (taskData) => { return axios.post(`${API_URL_TASK}/create`, taskData, {withCredentials: true}); };
export const createTaskAssignment = (assignmentData) => { return axios.post(`${API_URL_TASK}/assignment/create`, assignmentData, {withCredentials: true}); };

export const modifyTaskData = (taskData) => { return axios.patch(`${API_URL_TASK}/update`, taskData, {withCredentials: true}); };

export const deleteTask = (taskId) => { return axios.delete(`${API_URL_TASK}/delete/${taskId}`, {withCredentials: true}); };
export const deleteTaskAssignment = (assignmentData) => { return axios.delete(`${API_URL_TASK}/assignment/delete/${assignmentData.taskId}/${assignmentData.userId}`, { data: assignmentData, withCredentials: true }); };