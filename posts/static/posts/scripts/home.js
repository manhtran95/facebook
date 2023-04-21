// function to 
// add styles to profile picture on hover and click events
// execute Axios Update profile API call
(function () {
    // 1. add styles to profile picture on hover and click events
    let profileButton = document.querySelector('#profile-picture .dropdown-toggle');
    let profilePictureImage = document.querySelector('#profile-picture img');

    profileButton.addEventListener('mouseover', function (e) {
        profilePictureImage.style.opacity = 0.95;
    });
    profileButton.addEventListener('mouseout', function (e) {
        profilePictureImage.style.opacity = 1;
    });

    profileButton.addEventListener('mousedown', function (e) {
        profilePictureImage.style.transform = 'translate(-50%, -50%) scale(0.96)';
    });
    profileButton.addEventListener('mouseup', function (e) {
        profilePictureImage.style.transform = 'translate(-50%, -50%) scale(1)';
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
    let dropdownMenu = document.querySelector('#profile-picture .dropdown-menu')
    let form = document.querySelector('#profile-picture form')
    formButton.addEventListener('click', function (e) {
        e.preventDefault()
        e.stopPropagation()
        dropdownMenu.classList.remove('show')

        var formData = new FormData();
        let fileInput = document.querySelector('#profile-picture .dropdown-menu .form-control')
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
            console.log(response.data.resp);
            profilePictureImage.src = response.data.url;
        })
            .catch(function (err) {
                console.log('FAILURE!!');
                console.log(err)
            });
    })

})();
