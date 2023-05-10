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
};

function closeRegisterPopup() {
    document.querySelector('#whole-popup').style.visibility = 'hidden';
};

// POST_REQ - REGISTER - AJAX
(function () {


})();


// VALIDATE that only allow alphanumeric username for registration
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
        } else {
            m.style.display = "None";
        }
    });
})();



// function to VALIDATE form
// for reg form, validate min lenth password and valid email address requirement
function validateRegisterForm() {
    // 'use strict'
    const validateEmail = (email) => {
        return email.match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };
    const checkEntirelyNumericPassword = (pw) => {
        if (pw.length >= 6 && pw.match(/^[1-9]+$/)) {
            return true
        };
        return false;
    };

    function sendRegisterRequestAjax() {
        let popup = document.querySelector('#popup')
        let regButton = document.querySelector('#popup form button')
        let form = document.querySelector('#popup form')
        let usernameError = document.querySelector('#popup .server-username-exists')

        popup.disabled = true
        let formData = new FormData(form)
        formData.append("csrfmiddlewaretoken", window.CSRF_TOKEN)
        axios.post(form.action, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(function (response) {
                console.log('Register SUCCESS!!');
                console.log(response.data);
                if (response.data.error) {
                    usernameError.innerText = response.data.error
                    usernameError.style.display = 'block'
                } else {
                    window.location.replace(response.data.url);
                }
            })
            .catch(function (err) {
                console.log('FAILURE!!');
                console.log(err)
            })
            .finally(() => {
                popup.disabled = false
            });
    }

    function checkAndDisplayErrors() {
        // check register password length
        // check valid email address
        let emailInvalid = false;
        let passwordShort = false;
        let passwordNumeric = false;

        let passwordInput = document.querySelector('#reg-password');
        let emailInput = document.querySelector('#reg-email');

        if (emailInput.value.length > 0 && !validateEmail(emailInput.value)) emailInvalid = true;
        if (passwordInput.value.length > 0 && passwordInput.value.length < 6) passwordShort = true;
        if (checkEntirelyNumericPassword(passwordInput.value)) passwordNumeric = true;

        let invalidEmailMessage = document.querySelector('#popup .invalid-email');
        let shortPasswordMessage = document.querySelector('#popup .min-length-password');
        let numericPasswordMessage = document.querySelector('#popup .numeric-password');

        errorsInfo = [
            {
                'isInvalid': emailInvalid,
                'message': invalidEmailMessage,
                'input': emailInput
            },
            {
                'isInvalid': passwordShort,
                'message': shortPasswordMessage,
                'input': passwordInput
            },
            {
                'isInvalid': passwordNumeric,
                'message': numericPasswordMessage,
                'input': passwordInput
            }
        ]

        errorsInfo.forEach(e => {
            if (e.isInvalid) {
                e.message.style.display = "Block";
                e.input.classList.add('my-invalid-input');
            } else {
                e.message.style.display = "None";
                e.input.classList.remove('my-invalid-input');
            }
        })

        form.classList.add('was-validated')

        if (!form.checkValidity() || emailInvalid || passwordShort || passwordNumeric) {
            return true
        }
        return false
    }

    var form = document.querySelector('form.needs-validation')

    // Loop over them and prevent submission

    form.addEventListener('submit', function (e) {
        e.preventDefault()
        e.stopPropagation()

        let invalid = checkAndDisplayErrors()
        if (!invalid) {
            sendRegisterRequestAjax()
        }
    });
};

validateRegisterForm()