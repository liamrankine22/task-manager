import axios from "axios";
import { BASE_URL, API_URL } from "./apigen";

const API_URL_USER = `${API_URL}/users`;

export const getUserById = (userId) => { return axios.get(`${API_URL_USER}/${userId}` , { withCredentials: true }); };
export const getUsersByGroupId = (groupId) => { return axios.get(`${API_URL_USER}/group/${groupId}`, {withCredentials: true}); };

export const registerUser = (userData) => {
  return axios.post(`${BASE_URL}/register`, userData, { withCredentials: true });
};

export const updateUserInfo = (userId, updatedInfo) => {
  return axios.patch(`${API_URL_USER}/update/${userId}`, updatedInfo, { withCredentials: true });
};