import React, { useState } from "react";
import User from "../components/User";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import { useTranslation } from "react-i18next";
import Loader from "../components/Loader";
import { useDebounce } from "../hooks/utilsHooks";
import { useFilteredUsers } from "../hooks/users";
import NavBtn from "../components/NavBtn";
import { handleClickSort, arrows, styleClass } from "../sortFunctions";
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
        <table>
          <thead>
            <tr>
              <th className="u-field-width-s"></th>
              <th
                className={styleClass("first_name", sortBy)}
                onClick={(e) =>
                  handleClickSort(e, "first_name", sortBy, setSortBy)
                }
              >
                {arrows("first_name", sortBy)} {t("profile:firstname")}
              </th>
              <th
                className={styleClass("last_name", sortBy)}
                onClick={(e) =>
                  handleClickSort(e, "last_name", sortBy, setSortBy)
                }
              >
                {arrows("last_name", sortBy)} {t("profile:lastname")}
              </th>
              <th
                className={styleClass("username", sortBy)}
                onClick={(e) =>
                  handleClickSort(e, "username", sortBy, setSortBy)
                }
              >
                {arrows("username", sortBy)} {t("profile:username")}
              </th>
              <th
                className={styleClass("email", sortBy)}
                onClick={(e) => handleClickSort(e, "email", sortBy, setSortBy)}
              >
                {arrows("email", sortBy)} {t("profile:email")}
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
                    <User
                      user={user}
                      i={serialNum(i)}
                      handleCancel={() => setUserId(null)}
                      fetchUsers={refetch}
                      isEditing={true}
                    />
                  ) : (
                    <User
                      user={user}
                      i={serialNum(i)}
                      handleEdit={handleEdit}
                      fetchUsers={refetch}
                      isViewing={true}
                    />
                  )}
                </React.Fragment>
              ))}
          </tbody>
        </table>
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
