const signUpBtn = document.querySelector(".btn-signup");
const loginBtn = document.querySelector(".btn-login");
const boxSwap = document.querySelector(".Box-swap");
const right = document.querySelector(".right");
const left = document.querySelector(".left");   

signUpBtn.addEventListener("click", () => {

    boxSwap.classList.remove("login-active");
    boxSwap.classList.add("active");

    right.style.right = "-400px";

    right.classList.remove("hide");
    void right.offsetWidth;
    right.classList.add("show");

    left.style.transform = "translateX(0)";

    left.classList.remove("show");
    void left.offsetWidth;
    left.classList.add("hide");
});

loginBtn.addEventListener("click", () => {

    boxSwap.classList.remove("active");
    boxSwap.classList.add("login-active");

    right.style.right = "0px";

    right.classList.remove("show");
    void right.offsetWidth;
    right.classList.add("hide");

    left.style.transform = "translateX(-400px)";

    left.classList.remove("hide");
    void left.offsetWidth;
    left.classList.add("show");
});
