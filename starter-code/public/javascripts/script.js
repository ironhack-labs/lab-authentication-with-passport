document.addEventListener(
  "DOMContentLoaded",
  () => {
    let alerts = document.querySelectorAll(".alert");
    alerts.forEach(e => {
      e.classList.toggle("showAlert");
      setTimeout(() => {
        e.classList.toggle("showAlert");
      }, 2000);
    });
  },
  false
);
