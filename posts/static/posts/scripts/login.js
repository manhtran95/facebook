
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


(function () {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
})();