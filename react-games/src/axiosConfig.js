import axios from "axios";

const setAuthToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    return (axios.defaults.headers.common = { jwt: token });
  }
};

export default setAuthToken;
