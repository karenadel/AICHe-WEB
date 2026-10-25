
const navLinksByRole = {
    guest: [
        { text: "Home", href: "home1.html" }, 
        { text: "Workshops & Courses", href: "#" },
        { text: "Events & Site Visits", href: "#" },
        { text: "About", href: "#" },
        { text: "Team", href: "#" },
        { text: "Contact Us", href: "#" }
    ],

    student: [
        { text: "Home", href: "student-home.html" }, 
        { text: "Workshops & Courses", href: "#" },
        { text: "Events & Site Visits", href: "#" },
        { text: "About", href: "#" },
        { text: "Team", href: "#" },
        { text: "Contact Us", href: "#" }
    ],

    member: [
        { text: "Home", href: "member_home.html" }, 
        { text: "Workshops & Courses", href: "#" },
        { text: "Events & Site Visits", href: "#" },
        { text: "Sessions", href: "#" },
        { text: "Database", href: "#" },
        { text: "About", href: "#" },
        { text: "Team", href: "#" },
        { text: "Contact Us", href: "#" }
    ],

    admin: [
        { text: "Home", href: "admin-home.html" }, 
        { text: "Workshops & Courses", href: "#" },
        { text: "Events & Site Visits", href: "#" },
        { text: "Sessions", href: "#" },
        { text: "Database", href: "#" },
        { text: "About", href: "#" },
        { text: "Team", href: "#" },
        { text: "Contact Us", href: "#" }
    ]
};

const userNavLinksByRole = {
    guest: [
        { text: "Login", href: "autn.html" },
        { text: "Sign Up", href: "autn.html" }
    ],

    student: [
        { text: "Profile", href: "student_profile.html" },
        { text: "Logout", href: "#" }
    ],

    member: [
        { text: "Profile", href: "member_profile.html" },
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
        if (brand) {
            brand.addEventListener("click", function () {
                brand.classList.toggle("swap");
            });
        }

        const currentUserRole = navbarContainer.dataset.role || "guest";
        const mainNav = document.querySelector(".main-nav");
        const userNav = document.querySelector(".user-nav");

        const currentMainLinks = navLinksByRole[currentUserRole] || [];
        const currentUserLinks = userNavLinksByRole[currentUserRole] || [];

        function renderNavLinks(container, links) {
            if (!container) return;
            container.innerHTML = "";
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

        // --- الآن بعد بناء اللينكات، نقوم بتفعيل الـ Active والـ Pill بدقة ---

        const currentPath = window.location.pathname;
        const mainNavLinks = document.querySelectorAll(".main-nav a");
        const userNavLinks = document.querySelectorAll(".user-nav a");
        const navPill = document.querySelector(".nav-pill");


        // function movePill(link) {
        //     if (!navPill || !link) return;

        //     const navRect = mainNav.getBoundingClientRect();
        //     const linkRect = link.parentElement.getBoundingClientRect();

        //     navPill.style.display = "block";
        //     navPill.style.left = (linkRect.left - navRect.left) + "px";
        //     navPill.style.width = linkRect.width + "px";
        // }
        function movePill(link) {
            if (!navPill || !link || !mainNav) return;

            const linkItem = link.parentElement;
            const navRect = mainNav.getBoundingClientRect();
            const linkRect = linkItem.getBoundingClientRect();

            navPill.style.display = "block";
            navPill.style.width = linkRect.width + "px";
            navPill.style.left = (linkRect.left - navRect.left) + "px";
        }
        function hidePill() {
            if (navPill) {
                navPill.style.display = "none";
            }
        }

        // تحديد اللينك المطابق للصفحة الحالية
        let activeMainLink = null;
        let activeUserLink = null;

                
        mainNavLinks.forEach(function (link) {
            const linkPath = new URL(link.href, window.location.href).pathname;

            if (link.getAttribute("href") !== "#" &&
                linkPath === currentPath) {
                activeMainLink = link;
            }
        });

        userNavLinks.forEach(function (link) {
            const linkPath = new URL(link.href, window.location.href).pathname;

            if (link.getAttribute("href") !== "#" &&
                linkPath === currentPath) {
                activeUserLink = link;
            }
        });

        // لو الصفحة Profile
        if (activeUserLink) {
            userNavLinks.forEach(link => link.classList.remove("active"));
            mainNavLinks.forEach(link => link.classList.remove("active"));

            activeUserLink.classList.add("active");
            hidePill();
        } else {
            // لو الصفحة Home أو أي صفحة في القائمة الرئيسية
            const linkToActivate =
                activeMainLink || mainNavLinks[0];

            if (linkToActivate) {
                mainNavLinks.forEach(link => link.classList.remove("active"));
                userNavLinks.forEach(link => link.classList.remove("active"));

                linkToActivate.classList.add("active");

                // انتظري حتى يكتمل ترتيب عناصر الـ Navbar
                requestAnimationFrame(function () {
                    movePill(linkToActivate);
                });
            }
        }

        // تحريك الـ Pill عند الضغط على أي لينك رئيسي
        mainNavLinks.forEach(function (link) {
            link.addEventListener("click", function () {
                mainNavLinks.forEach(item => item.classList.remove("active"));
                userNavLinks.forEach(item => item.classList.remove("active"));

                link.classList.add("active");
                movePill(link);
            });
        });

        // إخفاء الـ Pill عند الضغط على Profile
        userNavLinks.forEach(function (link) {
            link.addEventListener("click", function () {
                mainNavLinks.forEach(item => item.classList.remove("active"));
                userNavLinks.forEach(item => item.classList.remove("active"));

                link.classList.add("active");
                hidePill();
            });
        });

    });