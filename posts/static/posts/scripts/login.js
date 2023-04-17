
// alert()

window.onload = () => {
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
})()