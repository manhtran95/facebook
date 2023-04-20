
// alert()

window.onload = () => {
    console.log("hello")
    // FOR REGISTER
    // set day select options
    const daySelect = document.getElementById('daySelect')
    let options = daySelect.innerHTML;
    for (let i = 1; i < 31; i++) {
        options += "<option value=" + i + ">" + i + "</option>";
    }
    daySelect.innerHTML = options;

    // set month select options
    const monthSelect = document.getElementById('monthSelect')
    options = monthSelect.innerHTML;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    months.forEach(m => {
        options += "<option value=" + m + ">" + m + "</option>";
    })
    monthSelect.innerHTML = options;

    // set year select options
    const yearSelect = document.getElementById('yearSelect')
    options = yearSelect.innerHTML;
    for (let i = 2023; i >= 1900; i--) {
        options += "<option value=" + i + ">" + i + "</option>";
    }
    yearSelect.innerHTML = options;

};

function openRegisterPopup() {
    document.querySelector('#whole-popup').style.visibility = 'visible';

    // const activeItems = document.querySelectorAll(".active");

    // activeItems.forEach((item) => {
    //     item.disabled = true;
    // });
};

function closeRegisterPopup() {
    document.querySelector('#whole-popup').style.visibility = 'hidden';
};

/*
(function () {
    'use strict'
    let inputs = document.querySelectorAll('#popup input')
    console.log(inputs)

    Array.prototype.slice.call(inputs)
        .forEach(function (i) {
            i.addEventListener('input', function (event) {
                invalid = i.nextElementSibling;
                invalid.style.display = "None";
            }, false)
        })
})();
*/

// function to validate that only allow alphanumeric username for registration
(function () {
    let regUsernameInput = document.querySelector('#reg-username');
    let m = document.querySelector('.username-alphanumeric-message');

    regUsernameInput.addEventListener('input', function (e) {
        let input = e.target.value;
        // hide feedback if input is erased
        if (input === '') {
            m.style.display = "None";
            return;
        }

        // check last letter if valid
        regUsernameInput.value = input.replace(/[^a-z0-9A-Z]/gi, '');
        const regex = /[a-z0-9A-Z]/;
        const valid = input.substr(input.length - 1).match(regex);
        if (valid === null) {
            m.style.display = "block";
        }
    });
})();

// function to validate form
// for reg form, validate min lenth password and valid email address requirement
(function () {
    'use strict'
    const validateEmail = (email) => {
        return email.match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')
    let shortPwMess = document.querySelector('#pop-up .min-length-password');
    console.log(shortPwMess)

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                // check register password length
                // check valid email address
                let showShortPwMess = false;
                let showInvalidEmail = false;

                let pw = document.querySelector('#reg-password');
                if (pw.value.length > 0 && pw.value.length < 6) showShortPwMess = true;
                let em = document.querySelector('#reg-email');
                if (em.value.length > 0 && !validateEmail(em.value)) showInvalidEmail = true;

                if (!form.checkValidity() || showShortPwMess || showInvalidEmail) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                let shortPwMess = document.querySelector('#popup .min-length-password');
                if (showShortPwMess) {
                    shortPwMess.style.display = "Block";
                    pw.classList.add('my-invalid-input');
                } else {
                    shortPwMess.style.display = "None";
                    pw.classList.remove('my-invalid-input');
                }
                let invalidEmail = document.querySelector('#popup .invalid-email');
                if (showInvalidEmail) {
                    invalidEmail.style.display = "Block";
                    em.classList.add('my-invalid-input');
                } else {
                    invalidEmail.style.display = "None";
                    em.classList.remove('my-invalid-input');
                }
                form.classList.add('was-validated')
            }, false)
        })
})();