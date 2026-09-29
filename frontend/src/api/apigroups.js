import axios from "axios";
import { BASE_URL, API_URL } from "./apigen";

const API_URL_GROUP = `${API_URL}/groups`;

export const getGroupById = (groupId) => {return axios.get(`${API_URL_GROUP}/${groupId}`, {withCredentials: true});};
export const getGroupsForUser = (userId) => {return axios.get(`${API_URL_GROUP}/user/${userId}`, {withCredentials: true});};
export const getInviteByToken = (token) => {return axios.get(`${API_URL_GROUP}/invite/${token}`, {withCredentials: true});};

export const createGroup = (groupData) => { return axios.post(`${API_URL_GROUP}/register`, groupData, {withCredentials: true});};
export const createInvite = (groupId, inviteData) => { return axios.post(`${API_URL_GROUP}/${groupId}/invite`, inviteData, {withCredentials: true});};
export const acceptInvite = (token) => { return axios.post(`${API_URL_GROUP}/invite/${token}/accept`, {}, {withCredentials: true});};

export const editGroup = (groupId, groupData) => { return axios.patch(`${API_URL_GROUP}/update/${groupId}`, groupData, {withCredentials: true});};
export const editRole = (membershipDetails) => { return axios.patch(`${API_URL_GROUP}/membership/update`, membershipDetails, {withCredentials: true});};

export const deleteGroup = (groupId) => { return axios.delete(`${API_URL_GROUP}/delete/${groupId}`, {withCredentials: true});};
export const deleteMembership = (groupId, memberId) => { return axios.delete(`${API_URL_GROUP}/membership/delete/${groupId}/${memberId}`, {withCredentials: true});};