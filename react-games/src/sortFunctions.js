export const handleClickSort = (e, value, sortBy, setSortBy) => {
  e.preventDefault();
  sortBy.endsWith("asc")
    ? setSortBy(`${value} desc`)
    : setSortBy(`${value} asc`);
};
export const styleClass = (value, sortBy) =>
  sortBy.includes(value) ? "u-pointer u-color-primary" : "u-pointer";

export const arrows = (value, sortBy) =>
  sortBy.endsWith(`${value} desc`) ? "▼" : "▲";
