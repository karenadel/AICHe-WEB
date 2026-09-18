const commonNavLinks = [
    { text: "Home", href: "#" },
    { text: "Workshops & Courses", href: "#" },
    { text: "Events & Site Visits", href: "#" },
    
];
const navLinksByRole = {
    guest: [
        ...commonNavLinks,
        { text: "About", href: "#" },
    { text: "Team", href: "#" },
    { text: "Contact Us", href: "#" }
    ],

    student: [
        ...commonNavLinks,
        { text: "About", href: "#" },
    { text: "Team", href: "#" },
    { text: "Contact Us", href: "#" }
    ],

    member: [
        ...commonNavLinks,
        { text: "Sessions", href: "#" },
        { text: "About", href: "#" },
    { text: "Team", href: "#" },
    { text: "Contact Us", href: "#" }
    ],

    admin: [
        ...commonNavLinks,
        { text: "Sessions", href: "#" },
        { text: "Database", href: "#" },
        { text: "About", href: "#" },
    { text: "Team", href: "#" },
    { text: "Contact Us", href: "#" }
    ]
};
const userNavLinksByRole = {
    guest: [
        { text: "Login", href: "#" },
        { text: "Sign Up", href: "#" }
    ],

    student: [
        { text: "Profile", href: "#" },
        { text: "Logout", href: "#" }
    ],

    member: [
        { text: "Profile", href: "#" },
        { text: "Logout", href: "#" }
    ],

    admin: [
        { text: "Dashboard", href: "#" },
        { text: "Logout", href: "#" }
    ]
};
fetch("../../components/navbar/navbar.html")
    .then(function (response) {
        return response.text();
    })
    .then(function (data) {

        const navbarContainer = document.querySelector("#navbar-container");

        navbarContainer.innerHTML = data;
        const brand = document.querySelector(".brand");

brand.addEventListener("click", function () {
    brand.classList.toggle("swap");
});

        // باقي كود الـ Navbar هنا
        const currentUserRole = "admin";

const mainNav = document.querySelector(".main-nav");
const userNav = document.querySelector(".user-nav");

const currentMainLinks = navLinksByRole[currentUserRole];
const currentUserLinks = userNavLinksByRole[currentUserRole];

function renderNavLinks(container, links) {

    links.forEach(function (item) {

        const li = document.createElement("li");

        const a = document.createElement("a");

        a.textContent = item.text;
        a.href = item.href;

        li.appendChild(a);

        container.appendChild(li);
    });
}

renderNavLinks(mainNav, currentMainLinks);
renderNavLinks(userNav, currentUserLinks);
const navPill = document.querySelector(".nav-pill");
const mainNavLinks = document.querySelectorAll(".main-nav a");

mainNavLinks.forEach(function (link) {

    link.addEventListener("click", function () {

        mainNavLinks.forEach(function (item) {
            item.classList.remove("active");
        });

        link.classList.add("active");

        navPill.style.left = link.parentElement.offsetLeft + "px";
        navPill.style.width = link.parentElement.offsetWidth + "px";
    });

});

if (mainNavLinks.length > 0) {

    const firstLink = mainNavLinks[0];

    firstLink.classList.add("active");

    navPill.style.left = firstLink.parentElement.offsetLeft + "px";
    navPill.style.width = firstLink.parentElement.offsetWidth + "px";
}

    });
