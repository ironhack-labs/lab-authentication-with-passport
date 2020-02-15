window.onload = () => {
  let alerts = document.querySelectorAll(".alert");
  alerts.forEach(e => {
    e.classList.toggle("showAlert");
    setTimeout(() => {
      e.classList.toggle("showAlert");
    }, 2000);
  });

  let artistPopularity = document.querySelectorAll(".artist-popularity div");
  artistPopularity.forEach(e => {
    e.classList.toggle("show-popularity");
  });
};
