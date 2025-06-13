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
                loginHandler();
            });

    } else if (contentType === "register") {

        fetch("loginActivity/registerView.html")
            .then(res => res.text())
            .then(html => {
                actionContainer.innerHTML = html;

                playAnimation(loginContainer, "fadeIn")
                inputsHandler(contentType);
                registerHandler();
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

function loginHandler() {
    const btn = document.querySelector('.loginBtn');

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); 
            btn.click(); 
        }
    });

    btn.addEventListener('click', async () => {
        const inputs = document.querySelectorAll('input');
        let allValid = true;
        let loginData = {};

        inputs.forEach(input => {
            setErrorMessage(input, null);
        });

        inputs.forEach(input => {
            const label = input.parentElement.querySelector('.labelInside');
            validateInput(input, label);

            if (label.classList.contains('errorInput')) {
                allValid = false;
            } else {
                loginData[input.id] = input.value.trim();
            }
        });

        if (!allValid) return; 

        const res = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: loginData.email,
                password: loginData.password
            })
        });

        const msg = await res.text();

        if (!res.ok) {
            let input = null;

            if (msg.toLowerCase().includes('hasło')) {
                input = document.querySelector('#password');
            } else {
                input = document.querySelector('#email');
            }

            const label = input.parentElement.querySelector('.labelInside');

            setErrorMessage(input, msg);
            label.classList.add('errorInput');
            input.parentElement.classList.add('errorInputParent');
        } else {
            document.cookie = "userIsLogIn=true; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT";

            ifUserLoginHendler();
        }
    });
}

function registerHandler() {
    const btn = document.querySelector('.registerBtn');
    document.querySelector(".actionContainer").appendChild(btn);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); 
            btn.click(); 
        }
    });

    btn.addEventListener('click', async () => {
        const inputs = document.querySelectorAll('input');
        let allValid = true;
        let userData = {};

        inputs.forEach(input => {
            const label = input.parentElement.querySelector('.labelInside');
            validateInput(input, label);
            if (label.classList.contains('errorInput')) {
                allValid = false;
            } else {
                userData[input.id] = input.value.trim();
            }
        });

        if (!allValid) return;

        const res = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: userData.email,
                password: userData.password,
                name: userData.name,
                surname: userData.surname,
                phone: userData.phone
            })
        });

        const msg = await res.text();

        if (!res.ok) {
            const input = document.querySelector('#email');
            const wrapper = input.closest('.input');
            const label = wrapper.querySelector('.labelInside'); 

            setErrorMessage(input, msg);
            label.classList.add('errorInput');
            wrapper.classList.add('errorInputParent');
        } else {
            location.reload(); 
        }
    });
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

function playAnimation(element,animationClass) {
    element.classList.add(animationClass);
    element.addEventListener("animationend", () => {
        element.classList.remove(animationClass);
    });

    return;
}