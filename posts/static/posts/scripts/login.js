
// alert()

window.onload = () => {
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

function hello() {
    alert('Hi Manh!')
    // const activeItems = document.querySelectorAll(".active");

    // activeItems.forEach((item) => {
    //     item.disabled = true;
    // });
}