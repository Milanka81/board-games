export const fakeGames = [
  {
    game_id: 1,
    name: "Monopoly",
    added_date: "2023-01-09T23:00:00.000Z",
    artist: "Edison Girard",
    category: "Family",
    designer: "Charles Darrow, Lizzie Magie",
    game_length: 90,
    max_players: 8,
    min_players: 2,
    year: 1935,
    img: "/img/monopoly.png",
  },
  {
    game_id: 2,
    name: "Risk",
    added_date: "2023-01-09T23:00:00.000Z",
    artist: "uncredited",
    category: "Strategy, War",
    designer: "Albert Lamorisse, Michael Levin",
    game_length: 120,
    max_players: 6,
    min_players: 2,
    year: 1957,
    img: "/img/risk.png",
  },
];

export const fakeUser = {
  user_id: 1,
  first_name: "John",
  last_name: "Smith",
  username: "john123",
  email: "john123@gmail.com",
  role: "user",
};
export const fakeUsers = [
  {
    user_id: 1,
    first_name: "John",
    last_name: "Smith",
    username: "john123",
    email: "john123@gmail.com",
    role: "admin",
  },
  {
    user_id: 2,
    first_name: "Mary",
    last_name: "Willson",
    username: "mery123",
    email: "mery123@gmail.com",
    role: "user",
  },
];

export const fakeGame = {
  game_id: 1,
  name: "Monopoly",
  added_date: "2023-01-09T23:00:00.000Z",
  artist: "Edison Girard",
  category: "Family",
  designer: "Charles Darrow, Lizzie Magie",
  game_length: 90,
  max_players: 8,
  min_players: 2,
  year: 1935,
  img: "/img/monopoly.png",
};

export const fakeComments = [
  {
    comm: "Love it!",
    comm_date: "2023-09-17T20:53:51.000Z",
    comment_id: 72,
    game_id: 1,
    user_id: 2,
    username: "user89",
  },
  {
    comm: "Interesting game!",
    comm_date: "2023-04-27T10:53:51.000Z",
    comment_id: 14,
    game_id: 1,
    user_id: 2,
    username: "user89",
  },
  {
    comm: "Not so impressed!",
    comm_date: "2022-11-18T20:13:51.000Z",
    comment_id: 9,
    game_id: 1,
    user_id: 8,
    username: "user76",
  },
];

export const myFakeComments = [
  {
    comm: "Love it!",
    comm_date: "2023-09-17T20:53:51.000Z",
    comment_id: 72,
    game_id: 1,
    user_id: 2,
    username: "user89",
  },
  {
    comm: "Interesting game!",
    comm_date: "2023-04-27T20:53:51.000Z",
    comment_id: 14,
    game_id: 4,
    user_id: 2,
    username: "user89",
  },
];

export const localStorageUser = () => {
  beforeEach(() => {
    const loggedUser = {
      email: "user@gmail.com",
      first_name: "John",
      last_name: "Smith",
      role: "user",
      user_id: 2,
      username: "user",
    };
    const token = 123456;
    localStorage.setItem("user", JSON.stringify(loggedUser));
    localStorage.setItem("token", token);
  });

  afterEach(() => {
    localStorage.clear();
  });
};

export const localStorageAdmin = () => {
  beforeEach(() => {
    const loggedAdmin = {
      email: "admin@gmail.com",
      first_name: "Paul",
      last_name: "Wilson",
      role: "admin",
      user_id: 1,
      username: "paul123",
    };
    const token = 12121212;
    localStorage.setItem("user", JSON.stringify(loggedAdmin));
    localStorage.setItem("token", token);
  });

  afterEach(() => {
    localStorage.clear();
  });
};
