import ListOfUsers from "./ListOfUsers";
import ListOfGames from "./ListOfGames";
import Game from "./Game";
import AddGame from "./AddGame";
import EditGame from "./EditGame";
import Profile from "./Profile";
import Preferences from "./Preferences";
import PageNotFound from "./PageNotFound";
import HomePage from "./HomePage";
import { Routes, Route } from "react-router-dom"; // Assuming you're using React Router
import { useAuth } from "../components/AuthContext";
const ConditionalRoutes = () => {
  const { admin } = useAuth();
  const [isAdmin] = admin;

  const commonRoutes = (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/game/:id" element={<Game />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );

  // Define the admin-only routes
  const adminRoutes = (
    <Routes>
      <Route path="/users" element={<ListOfUsers />} />
      <Route path="/games" element={<ListOfGames />} />
      <Route path="/addGame" element={<AddGame />} />
      <Route path="/editGame/:id" element={<EditGame />} />
    </Routes>
  );

  // Define the non-admin routes
  const nonAdminRoutes = (
    <Routes>
      <Route path="/preferences" element={<Preferences />} />
    </Routes>
  );

  return (
    <>
      {commonRoutes}
      {isAdmin ? adminRoutes : nonAdminRoutes}
    </>
  );
};

export default ConditionalRoutes;
