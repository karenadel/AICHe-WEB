const brand = document.querySelector(".brand");

console.log(brand);

brand.addEventListener("click", function () {
    brand.classList.toggle("swap");
});
const navPill = document.querySelector(".nav-pill");
const navLinks = document.querySelectorAll(".main-nav a");

console.log(navPill);
console.log(navLinks);
navLinks.forEach(function (link) {

    link.addEventListener("click", function () {
        console.log("Clicked:", link.textContent);
        console.log("Position:", link.parentElement.offsetLeft);
        
        navLinks.forEach(function (item) {
            item.classList.remove("active");
        });

        link.classList.add("active");
        navPill.style.left = link.parentElement.offsetLeft + "px";
        navPill.style.width = link.parentElement.offsetWidth + "px";
    });

});