import { $axios } from '../utils';

export const getUserInformation = userId => $axios.get(`/user-info/${userId}?timestamp=${new Date().getTime()}`);
export const getTeams = () => $axios.get(`/team/me?timestamp=${new Date().getTime()}`);
export const getAvailableCategories = () => $axios.get(`/available-categories?timestamp=${new Date().getTime()}`);
export const getMappingCategories = () => $axios.get(`/conf/datalayer/getDatalayer?timestamp=${new Date().getTime()}`);
export const changeTokenWithTeamId = teamId => $axios.post('/user/jwt', { teamId });
