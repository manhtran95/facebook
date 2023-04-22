

function updatePhoto(section_id) {
    let image = document.querySelector(`${section_id} img`);
    let dropdownMenu = document.querySelector(`${section_id} .dropdown-menu`)
    let formButton = document.querySelector(`${section_id} .dropdown-menu button`)
    let form = document.querySelector(`${section_id} form`)
    formButton.addEventListener('click', function (e) {
        e.preventDefault()
        e.stopPropagation()
        dropdownMenu.classList.remove('show')

        var formData = new FormData();
        let fileInput = document.querySelector(`${section_id} .dropdown-menu .form-control`)
        if (fileInput.files.length == 0) {
            return
        }
        formData.append("image", fileInput.files[0]);
        formData.append("csrfmiddlewaretoken", window.CSRF_TOKEN)
        axios.post(form.action, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(function (response) {
            console.log('SUCCESS!!');
            image.src = response.data.url;
        })
            .catch(function (err) {
                console.log('FAILURE!!');
                console.log(err)
            });
    })
};


// function to 
// add styles to profile picture on hover and click events
// execute Axios Update profile API call
(function () {
    // 1. add styles to profile picture on hover and click events
    let coverButton = document.querySelector('#profile-picture .dropdown-toggle');
    let image = document.querySelector('#profile-picture img');

    coverButton.addEventListener('mouseover', function (e) {
        image.style.opacity = 0.95;
    });
    coverButton.addEventListener('mouseout', function (e) {
        image.style.opacity = 1;
    });

    coverButton.addEventListener('mousedown', function (e) {
        image.style.transform = 'translate(-50%, -50%) scale(0.96)';
    });
    coverButton.addEventListener('mouseup', function (e) {
        image.style.transform = 'translate(-50%, -50%) scale(1)';
    });

    let formButton = document.querySelector('#profile-picture .dropdown-menu button')
    let formInput = document.querySelector('#profile-picture .dropdown-menu .form-control')
    formInput.addEventListener('change', function (e) {
        if (e.target.files[0]) {
            formButton.disabled = false
        } else {
            formButton.disabled = true
        }
    });

    // 2. process Axios upload-profile API call
    updatePhoto('#profile-picture');
})();


// function to 
// add styles to profile picture on hover and click events
// execute Axios Update profile API call
(function () {
    // 1. add styles to profile picture on hover and click events
    let coverButton = document.querySelector('#cover-photo .dropdown-toggle');
    console.log(coverButton)

    coverButton.addEventListener('mousedown', function (e) {
        coverButton.style.transform = 'scale(0.96)';
        coverButton.style.opacity = 0.8;
    });
    coverButton.addEventListener('mouseup', function (e) {
        coverButton.style.transform = 'scale(1)';
        coverButton.style.opacity = 1;
    });

    let formButton = document.querySelector('#cover-photo .dropdown-menu button')
    let formInput = document.querySelector('#cover-photo .dropdown-menu .form-control')
    formInput.addEventListener('change', function (e) {
        if (e.target.files[0]) {
            formButton.disabled = false
        } else {
            formButton.disabled = true
        }
    });

    // 2. process Axios upload-profile API call
    updatePhoto('#cover-photo');

})();
