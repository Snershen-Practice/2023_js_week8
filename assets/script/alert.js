export const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timerProgressBar: true,
  timer: 2000,
  showCloseButton: true,
  showClass: {
    popup: "animate__animated animate__fadeInRight",
  },
  hideClass: {
    popup: "animate__animated animate__fadeOutRight",
  },
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});
