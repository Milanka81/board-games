import axios from "axios";
const token = localStorage.getItem("token");
const BASE_URL = "http://localhost:3001";
const GAMES = "games";

axios.defaults.headers.common = { jwt: token };

export const register = (values) => axios.post(`${BASE_URL}/register`, values);
export const login = (values) => axios.post(`${BASE_URL}/login`, values);
export const forgotPassword = (email) =>
  axios.post(`${BASE_URL}/forgot-password`, email);
export const resetPassword = (id, token, password) =>
  axios.put(`${BASE_URL}/reset-password/${id}/${token}`, password);

/* GAMES */

export const getAllGames = () => axios.get(`${BASE_URL}/${GAMES}`);

export const getFilteredGames = (page, limit, input, sortBy) =>
  axios.get(
    `${BASE_URL}/filteredGames?page=${page}&limit=${limit}&input=${input}&sortBy=${sortBy}`
  );

export const getListOfGames = () => axios.get(`${BASE_URL}/listOfGames`);

export const getMostLiked = () => axios.get(`${BASE_URL}/${GAMES}/mostLiked`);

export const getFavoriteGames = () =>
  axios.get(`${BASE_URL}/${GAMES}/favourite`);
export const getRecommendedGames = () =>
  axios.get(`${BASE_URL}/${GAMES}/recommended`);

export const getNewGames = () => axios.get(`${BASE_URL}/${GAMES}/new`);

/* ONE GAME */

export const getGame = (id) => axios.get(`${BASE_URL}/${GAMES}/${id}`);

export const addGame = (values) =>
  axios.post(`${BASE_URL}/addGame`, values, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const editGame = (values) => axios.put(`${BASE_URL}/editGame`, values);

export const deleteGame = (id) =>
  axios.delete(`${BASE_URL}/${GAMES}`, { data: { id } });

export const deleteComment = (id) =>
  axios.delete(`${BASE_URL}/${GAMES}/comment`, { data: { id } });

export const getGameComments = (id) =>
  axios.get(`${BASE_URL}/${GAMES}/${id}/comments`);

export const getUserComments = () => axios.get(`${BASE_URL}/${GAMES}/comments`);

export const getGameLike = (id) => axios.get(`${BASE_URL}/${GAMES}/${id}/like`);

export const getGameFavourite = (id) =>
  axios.get(`${BASE_URL}/${GAMES}/${id}/favourite`);

export const postLike = (id) =>
  axios.post(`${BASE_URL}/${GAMES}/${id}/like`, id);

export const postFavourite = (id) =>
  axios.post(`${BASE_URL}/${GAMES}/${id}/favourite`, id);

export const postComment = (id, comment) =>
  axios.post(`${BASE_URL}/${GAMES}/${id}/comment`, {
    id,
    comment,
  });
export const editComment = (comment, comment_id) =>
  axios.put(`${BASE_URL}/${GAMES}/comment`, {
    comment,
    comment_id,
  });

export const getRating = (id) => axios.get(`${BASE_URL}/${GAMES}/${id}/rating`);

export const getAvgRating = (id) =>
  axios.get(`${BASE_URL}/${GAMES}/${id}/avgRating`);

export const postRating = (id, rating) =>
  axios.post(`${BASE_URL}/${GAMES}/${id}/rating`, {
    id,
    rating,
  });

export const getGameCategories = () =>
  axios.get(`${BASE_URL}/${GAMES}/categories`);

/* USERS */

export const getAllUsers = () => axios.get(`${BASE_URL}/users`);

export const getFilteredUsers = (page, limit, input, sortBy) =>
  axios.get(
    `${BASE_URL}/filteredUsers?page=${page}&limit=${limit}&input=${input}&sortBy=${sortBy}`
  );

export const getLoggedUser = () => axios.get(`${BASE_URL}/profile`);

export const getUserById = (userId) =>
  axios.get(`${BASE_URL}/user?userId=${userId}`);

export const deleteUser = (id) =>
  axios.delete(`${BASE_URL}/users`, { data: { id } });

export const editUser = (values, id) =>
  axios.put(`${BASE_URL}/users`, { values, id });

/* PREFERENCES */

export const addPreferences = (values) =>
  axios.post(`${BASE_URL}/${GAMES}/preferences`, values);
export const editPreferences = (values) =>
  axios.put(`${BASE_URL}/${GAMES}/preferences`, values);
export const getPreferences = () =>
  axios.get(`${BASE_URL}/${GAMES}/preferences`);
export const getUserPreferences = () =>
  axios.get(`${BASE_URL}/${GAMES}/userPreferences`);

export const getSubscription = () =>
  axios.get(`${BASE_URL}/${GAMES}/subscribed`);

export const editSubscription = (boolean) =>
  axios.put(`${BASE_URL}/${GAMES}/subscribed`, { boolean });
