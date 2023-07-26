import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getFilteredUsers } from "../service";
import ViewUsers from "../components/ViewUsers";
import EditUser from "../components/EditUser";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import { useTranslation } from "react-i18next";
import Loader from "../components/Loader";
import { alertMessage } from "../utils";
import style from "./List.module.css";

const ListOfUsers = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(["profile", "common", "home"]);
  const [userId, setUserId] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("user_id");
  const [isLoading, setIsLoading] = useState(true);
  const limit = 10;

  const serialNum = (i) => (currentPage - 1) * limit + i;

  const fetchUsers = useCallback(() => {
    getFilteredUsers(currentPage, limit, searchInput, sortBy)
      .then((res) => {
        setFilteredUsers(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        alertMessage("error", err.message);
        setIsLoading(false);
      });
  }, [currentPage, searchInput, sortBy]);

  useEffect(() => {
    const filter = setTimeout(() => {
      fetchUsers();
    }, 1000);
    return () => clearTimeout(filter);
  }, [fetchUsers]);

  const handleChange = (e) => {
    setSearchInput(e.target.value);
    setCurrentPage(1);
  };
  const handleEdit = (e, user) => {
    e.preventDefault();
    setUserId(user.user_id);
  };
  const handleClick = (e, value) => {
    e.preventDefault();
    sortBy.endsWith("asc")
      ? setSortBy(`${value} desc`)
      : setSortBy(`${value} asc`);
  };
  const styleClass = (value) =>
    sortBy.includes(value)
      ? `${`${style.pointer} ${style.sort}`}`
      : `${style.pointer}`;

  const arrows = (value) => (sortBy.endsWith(`${value} desc`) ? "▼" : "▲");

  return (
    <>
      {isLoading ? (
        <Loader message={t("home:loading")} />
      ) : (
        <>
          <div className={style.flex}>
            <button
              className={style.navBtn}
              onClick={() => {
                navigate("/games");
              }}
            >
              🎲 {t("home:games")}
            </button>
            <SearchBar
              handleChange={handleChange}
              placeholder={t("profile:searchuser")}
            />
          </div>
          <form>
            <table className={style.tableList}>
              <thead>
                <tr>
                  <th></th>
                  <th
                    className={styleClass("first_name")}
                    onClick={(e) => handleClick(e, "first_name")}
                  >
                    {arrows("first_name")} {t("profile:firstname")}
                  </th>
                  <th
                    className={styleClass("last_name")}
                    onClick={(e) => handleClick(e, "last_name")}
                  >
                    {arrows("last_name")} {t("profile:lastname")}
                  </th>
                  <th
                    className={styleClass("username")}
                    onClick={(e) => handleClick(e, "username")}
                  >
                    {arrows("username")} {t("profile:username")}
                  </th>
                  <th
                    className={styleClass("email")}
                    onClick={(e) => handleClick(e, "email")}
                  >
                    {arrows("email")} {t("profile:email")}
                  </th>
                  <th>{t("profile:role")}</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user, i) => (
                  <React.Fragment key={user.user_id}>
                    {userId === user.user_id ? (
                      <EditUser
                        user={user}
                        i={serialNum(i)}
                        handleCancel={() => setUserId(null)}
                        fetchUsers={fetchUsers}
                      />
                    ) : (
                      <ViewUsers
                        user={user}
                        i={serialNum(i)}
                        handleEdit={handleEdit}
                        fetchUsers={fetchUsers}
                      />
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </form>
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            limit={limit}
            list="usersList"
          />
        </>
      )}
    </>
  );
};
export default ListOfUsers;
