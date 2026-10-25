fetch("../../components/footer/footer.html")
  .then(response => {
    if (!response.ok) {
      throw new Error("Footer file could not be loaded");
    }
    return response.text();
  })
  .then(html => {
    const placeholder = document.getElementById("footer-placeholder");

    if (!placeholder) return;

    placeholder.innerHTML = html;

    const backToTop = placeholder.querySelector(".back-to-top");

    if (backToTop) {
      backToTop.addEventListener("click", event => {
        event.preventDefault();

        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      });
    }
  })
//   .catch(error => {
//     console.error("Error loading footer:", error);
//   });
