"use strict";
ifUserLoginHendler();

function ifUserLoginHendler() {
    const cookies = document.cookie.split(";");
    const body = document.querySelector("body");

    for (let cookie of cookies) {
        const [cookieName] = cookie.trim().split("=");

        if (cookieName === "userIsLogIn") {
            console.log("User is logged in");

            fetch("mainActivity/main.html")
            .then(res => res.text())
            .then(html => {body.innerHTML = html;})
            .then(() => {
                document.title = "SideBuildForFun";
            })
        } else {
            fetch("/loginActivity/login.html")
                .then(res => res.text())
                .then(html => {body.innerHTML = html;})
                .then(() => {
                    document.title = "Logowanie";
                    
                    const loginContainer = document.querySelector(".loginContainer");
                    loginContainer.classList.add("fadeIn");
                    loginContainer.addEventListener("animationend", () => {
                        loginContainer.classList.remove("fadeIn");
                    });

                    const script = document.createElement("script");
                    script.src = "./js/login.js";
                    document.body.appendChild(script);
            });
        }
    }
}