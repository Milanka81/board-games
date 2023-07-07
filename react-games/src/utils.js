import Swal from "sweetalert2";

const colors = {
  background: "#fcecde",
  confirmButton: "#cf1f1f",
  cancelButton: "#4a50c7",
};

export const numberPlayers = (min, max) => {
  if (min === max) {
    return min;
  }
  return `${min} - ${max}`;
};

export const imgSrc = (img) => {
  if (!img) return;
  return `data:image/png;base64,${img}`;
};

export const handleEmpty = (str) => {
  return str || "";
};
export const refreshPage = () => {
  window.location.reload(false);
};
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const alertDelete = (deleteFunction, id, refresh, logout = null) => {
  Swal.fire({
    title: "Delete?",
    text: "You won't be able to revert this!",
    background: colors.background,
    color: "#000",
    showCancelButton: true,
    confirmButtonColor: colors.confirmButton,
    cancelButtonColor: colors.cancelButton,
    confirmButtonText: "DELETE",
  })
    .then(async (result) => {
      if (!result.isConfirmed) return;

      deleteFunction(id);
      await Swal.fire({
        background: colors.background,
        icon: "success",
        title: "Deleted",
        showConfirmButton: false,
        timer: 1500,
      });

      refresh();
      if (logout !== null) {
        logout();
      }
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        background: colors.background,
        title: "Something went wrong!",
        showConfirmButton: false,
        timer: 2000,
      });
    });
};

export const alertMessage = (icon, message) => {
  Swal.fire({
    icon: `${icon}`,
    background: colors.background,
    title: `${message}`,
    showConfirmButton: false,
    timer: 1500,
  });
};
