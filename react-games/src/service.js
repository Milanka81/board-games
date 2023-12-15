import axios from "axios";
import { alertMessage } from "./utils";
import setAuthToken from "./axiosConfig";
// const token = localStorage.getItem("token");
const BASE_URL = "http://localhost:3001";
const GAMES = "games";

// axios.defaults.headers.common = { jwt: token };
setAuthToken();
const catchError = (fn) => {
  return async (...values) => {
    try {
      const data = await fn(...values);
      return data;
    } catch (err) {
      alertMessage("error", err.message);
      throw err;
    }
  };
};

export const register = catchError((values) =>
  axios.post(`${BASE_URL}/register`, values)
);

//export const login = (values) => axios.post(`${BASE_URL}/login`, values);
export const login = catchError((values) =>
  axios.post(`${BASE_URL}/login`, values)
);

export const forgotPassword = catchError((email) =>
  axios.post(`${BASE_URL}/forgot-password`, email)
);
export const resetPassword = catchError((id, token, password) =>
  axios.put(`${BASE_URL}/reset-password/${id}/${token}`, password)
);

/* GAMES */

export const getAllGames = catchError(() => axios.get(`${BASE_URL}/${GAMES}`));

export const getFilteredGames = catchError((page, limit, input, sortBy) =>
  axios.get(
    `${BASE_URL}/filteredGames?page=${page}&limit=${limit}&input=${input}&sortBy=${sortBy}`
  )
);

export const getMostLiked = catchError(() =>
  axios.get(`${BASE_URL}/${GAMES}/mostLiked`)
);

export const getFavoriteGames = catchError(() =>
  axios.get(`${BASE_URL}/${GAMES}/favourite`)
);
export const getRecommendedGames = catchError(() =>
  axios.get(`${BASE_URL}/${GAMES}/recommended`)
);

export const getNewGames = catchError(() =>
  axios.get(`${BASE_URL}/${GAMES}/new`)
);

/* ONE GAME */

export const getGame = catchError((id) =>
  axios.get(`${BASE_URL}/${GAMES}/${id}`)
);

export const addGame = catchError((values) =>
  axios.post(`${BASE_URL}/addGame`, values, {
    headers: { "Content-Type": "multipart/form-data" },
  })
);
export const editGame = catchError((values) =>
  axios.put(`${BASE_URL}/editGame`, values)
);

export const deleteGame = catchError((id) =>
  axios.delete(`${BASE_URL}/${GAMES}`, { data: { id } })
);

export const deleteComment = catchError((id) =>
  axios.delete(`${BASE_URL}/${GAMES}/comment`, { data: { id } })
);

export const getGameComments = catchError((id) =>
  axios.get(`${BASE_URL}/${GAMES}/${id}/comments`)
);

export const getUserComments = catchError(() =>
  axios.get(`${BASE_URL}/${GAMES}/comments`)
);

export const getGameLike = catchError((id) =>
  axios.get(`${BASE_URL}/${GAMES}/${id}/like`)
);

export const getGameFavourite = catchError((id) =>
  axios.get(`${BASE_URL}/${GAMES}/${id}/favourite`)
);

export const postLike = catchError((id) =>
  axios.post(`${BASE_URL}/${GAMES}/${id}/like`, id)
);

export const postFavourite = catchError((id) =>
  axios.post(`${BASE_URL}/${GAMES}/${id}/favourite`, id)
);

export const postComment = catchError((id, comment) =>
  axios.post(`${BASE_URL}/${GAMES}/${id}/comment`, {
    id,
    comment,
  })
);
export const editComment = catchError((comment, comment_id) =>
  axios.put(`${BASE_URL}/${GAMES}/comment`, {
    comment,
    comment_id,
  })
);

export const getRating = catchError((id) =>
  axios.get(`${BASE_URL}/${GAMES}/${id}/rating`)
);

export const getAvgRating = catchError((id) =>
  axios.get(`${BASE_URL}/${GAMES}/${id}/avgRating`)
);

export const postRating = catchError((id, rating) =>
  axios.post(`${BASE_URL}/${GAMES}/${id}/rating`, {
    id,
    rating,
  })
);
export const getGameCategories = catchError(() =>
  axios.get(`${BASE_URL}/${GAMES}/categories`)
);

/* USERS */

export const getAllUsers = catchError(() => axios.get(`${BASE_URL}/users`));

export const getFilteredUsers = catchError((page, limit, input, sortBy) =>
  axios.get(
    `${BASE_URL}/filteredUsers?page=${page}&limit=${limit}&input=${input}&sortBy=${sortBy}`
  )
);

export const getLoggedUser = catchError(() => axios.get(`${BASE_URL}/profile`));

export const getUserById = catchError((userId) =>
  axios.get(`${BASE_URL}/user?userId=${userId}`)
);

export const deleteUser = catchError((id) =>
  axios.delete(`${BASE_URL}/users`, { data: { id } })
);

export const editUser = catchError((values, id) =>
  axios.put(`${BASE_URL}/users`, { values, id })
);

/* PREFERENCES */

export const addPreferences = catchError((values) =>
  axios.post(`${BASE_URL}/${GAMES}/preferences`, values)
);
export const editPreferences = catchError((values) =>
  axios.put(`${BASE_URL}/${GAMES}/preferences`, values)
);
export const getPreferences = catchError(() =>
  axios.get(`${BASE_URL}/${GAMES}/preferences`)
);
export const getIsPreferences = catchError(() =>
  axios.get(`${BASE_URL}/${GAMES}/userPreferences`)
);

export const getSubscription = catchError(() =>
  axios.get(`${BASE_URL}/${GAMES}/subscribed`)
);

export const editSubscription = catchError((boolean) =>
  axios.put(`${BASE_URL}/${GAMES}/subscribed`, { boolean })
);
