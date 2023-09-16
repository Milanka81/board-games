import React, { useState } from "react";
import ViewUsers from "../components/ViewUsers";
import EditUser from "../components/EditUser";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import { useTranslation } from "react-i18next";
import Loader from "../components/Loader";
import { useDebounce } from "../hooks/utilsHooks";
import { useFilteredUsers } from "../hooks/users";
import NavBtn from "../components/NavBtn";

const ListOfUsers = () => {
  const { t } = useTranslation(["profile", "common", "home"]);
  const [userId, setUserId] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("user_id");
  const limit = 5;
  const search = useDebounce(searchInput);
  const { filteredUsers, isLoading, isSuccess, refetch, pageCount } =
    useFilteredUsers(currentPage, limit, search, sortBy);

  const serialNum = (i) => (currentPage - 1) * limit + i;

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
    sortBy.includes(value) ? "u-pointer u-color-primary" : "u-pointer";

  const arrows = (value) => (sortBy.endsWith(`${value} desc`) ? "▼" : "▲");

  return (
    <>
      <div className="table__flex">
        <NavBtn path="/games" />
        <SearchBar
          handleChange={handleChange}
          placeholder={t("profile:searchuser")}
        />
      </div>
      <Loader isLoading={isLoading}>
        <form>
          <table className="table__list">
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
              {isSuccess &&
                filteredUsers.map((user, i) => (
                  <React.Fragment key={user.user_id}>
                    {userId === user.user_id ? (
                      <EditUser
                        user={user}
                        i={serialNum(i)}
                        handleCancel={() => setUserId(null)}
                        fetchUsers={refetch}
                      />
                    ) : (
                      <ViewUsers
                        user={user}
                        i={serialNum(i)}
                        handleEdit={handleEdit}
                        fetchUsers={refetch}
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
          count={pageCount}
        />
      </Loader>
    </>
  );
};
export default ListOfUsers;
