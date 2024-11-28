const modalHeaders = document.querySelectorAll(".modal-header-config-title");

modalHeaders.forEach((header) => {
  header.addEventListener("click", () => {
    modalHeaders.forEach((sibling) => {
      if (sibling !== header && sibling.classList.contains("is-active")) {
        sibling.classList.remove("is-active");
      }
    });
    header.classList.add("is-active");

    document.querySelectorAll(".authentication-section").forEach((item) => {
      if (!item.classList.contains("d-none")) {
        item.classList.add("d-none");
      }
    });

    // Show the targeted form
    const target = document.getElementById(header.getAttribute("data-target"));
    target.classList.remove("d-none");
  });
});

// If user already has account
const isRegistered = document.querySelector(".is-registered");

isRegistered.addEventListener("click", () => {
  const signin = document.getElementById("sign-in-section");
  const signup = document.getElementById("sign-up-section");

  if (signin.classList.contains("d-none")) {
    signin.classList.remove("d-none");
    signup.classList.add("d-none");

    const headers = document.querySelectorAll(".modal-header-config-title");
    headers.forEach((header) => {
      header.classList.remove("is-active");

      if (header.getAttribute("data-target") === "sign-in-section") {
        header.classList.add("is-active");
      }
    });
  }
});
