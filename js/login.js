"use strict";
createView();

function createView() {
    const actionButon = document.querySelectorAll(".actionButon");

    insertContent("login")

    actionButon.forEach(btn => {
        btn.addEventListener("click", () => {
            btn.classList.add("selected");

            actionButon.forEach(otherBtn => {
                if (otherBtn !== btn) {
                    otherBtn.classList.remove("selected");
                }
            });

            insertContent(btn.id)
        });
    });
}

function insertContent(contentType) {
    const actionContainer = document.querySelector(".actionContainer");
    const loginContainer = document.querySelector(".loginContainer");

    if (contentType === "login") {

        fetch("loginActivity/loginView.html")
            .then(res => res.text())
            .then(html => {
                actionContainer.innerHTML = html;

                playAnimation(loginContainer, "fadeIn")
                inputsHandler(contentType);
            });

    } else if (contentType === "register") {

        fetch("loginActivity/registerView.html")
            .then(res => res.text())
            .then(html => {
                actionContainer.innerHTML = html;

                playAnimation(loginContainer, "fadeIn")
                inputsHandler(contentType);
            });

    }
}

function inputsHandler(contentType) {
    const inputWrappers = document.querySelectorAll(".input");

    inputWrappers.forEach(wrapper => {
        const input = wrapper.querySelector("input");
        const label = wrapper.querySelector(".labelInside");

        input.addEventListener("focus", () => {
            label.classList.add("labelInsideActive");
        });

        input.addEventListener("focusout", () => {
            label.classList.remove("labelInsideActive");
            validateInput(input, label);
        });
    });
}

function playAnimation(element,animationClass) {
    element.classList.add(animationClass);
    element.addEventListener("animationend", () => {
        element.classList.remove(animationClass);
    });

    return;
}

function validateInput(input, label) {
    const id = input.id;
    const val = input.value.trim();
    let valid = true;
    let errorText = '';

    switch (id) {
        case 'email':
            valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
            if (!valid) errorText = 'Niepoprawny adres email';
            break;
        case 'password':
            valid = val.length >= 6;
            if (!valid) errorText = 'Hasło musi być dłuższe niz 6 znaków';
            break;
        case 'passwordRepeat':
            const passVal = document.getElementById('password').value.trim();
            valid = val === passVal && val.length >= 6;
            if (!valid) errorText = 'Hasła muszą być takie same';
            break;
        case 'name':
        case 'surname':
            valid = /^[A-Za-ząćęłńóśźżĄĘŁŃÓŚŹŻ'-]{2,}$/.test(val);
            if (!valid) errorText = 'Minimum 2 litery, bez cyfr';
            break;
        case 'phone':
            valid = /^\d{9,15}$/.test(val);
            if (!valid) errorText = 'Zły numer';
            break;
        default:
            valid = true;
    }

    if (!valid) {
        label.classList.add('errorInput');
        input.parentElement.classList.add('errorInputParent');
        setErrorMessage(input, errorText);
    } else {
        label.classList.remove('errorInput');
        input.parentElement.classList.remove('errorInputParent');
        setErrorMessage(input, null);
    }
}


function setErrorMessage(input, message) {
    const label = document.querySelector(`label.label[for="${input.id}"]`);
    if (!label) return;

    if (!label.hasAttribute('data-default-text')) {
        label.setAttribute('data-default-text', label.textContent);
    }

    if (message) {
        label.textContent = message;
        label.classList.add('labelError');
    } else {
        label.textContent = label.getAttribute('data-default-text');
        label.classList.remove('labelError');
    }
}