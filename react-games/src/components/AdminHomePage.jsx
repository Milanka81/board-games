import { useNavigate } from "react-router-dom";
import UserHomePage from "./UserHomePage";

const AdminHomePage = () => {
  const navigate = useNavigate();
  return (
    <>
      <div>
        <button
          className="icon-btn navigation-btn"
          onClick={() => {
            navigate("/users");
          }}
        >
          👤 USERS
        </button>
        <button
          className="icon-btn navigation-btn"
          onClick={() => {
            navigate("/games");
          }}
        >
          🎲 GAMES
        </button>
      </div>
      <UserHomePage />
    </>
  );
};
export default AdminHomePage;
