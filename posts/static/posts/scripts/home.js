import { getFacebookDatetimeStr } from "./helper.js"

let postCounter = 0
const allPosts = document.querySelector('#all-posts')
const postTemplate = document.querySelector('#post-template')

// #ALL-POSTS - show 1 psot / next page
function createPost(p) {
    const newPost = postTemplate.cloneNode(true);
    const post = newPost.firstElementChild
    const postInfo = post.firstElementChild

    const image = postInfo.firstElementChild
    image.src = p.author_image
    const info = postInfo.lastElementChild
    const name = info.firstElementChild
    name.innerText = p.author
    const pubDatetime = info.lastElementChild
    pubDatetime.innerText = getFacebookDatetimeStr(new Date(p.pub_timestamp))

    const postText = post.lastElementChild
    postText.innerText = p.post_text
    window.setTimeout(function () {
        newPost.classList.add('active')
    }, 50);
    newPost.style.marginTop = '1rem'
    newPost.style.marginBottom = '1rem'

    return newPost
}

function showPosts(posts) {
    posts.forEach(p => allPosts.appendChild(createPost(p)))
};

// #ALL-POSTS - load next page
function loadPosts() {
    var formData = new FormData();
    let form = document.querySelector(`#hidden-info .index-form`)

    formData.append("counter", postCounter);
    axios.get(form.action, {
        params: {
            counter: postCounter
        }
    })
        .then(function (response) {
            console.log('SUCCESS!!');
            postCounter = response.data.counter
            showPosts(response.data.page);
        })
        .catch(function (err) {
            console.log('FAILURE!!');
            console.log(err)
        });
};

// ALL-POSTS
(function () {
    loadPosts();

})();

// #NEW-POST Make a new post!
(function () {
    let charCount = 0
    // add style to #new-post submit button
    let formButton = document.querySelector('#new-post button')
    let formInput = document.querySelector('#new-post textarea')
    formInput.addEventListener('input', function (e) {
        if (this.value.length > 0) {
            formButton.disabled = false
        } else {
            formButton.disabled = true
        }
        this.style.height = 0;
        this.style.height = (this.scrollHeight + 20) + "px";
    });

    let form = document.querySelector('#new-post form')
    formButton.addEventListener('click', function (e) {
        e.preventDefault()
        e.stopPropagation()
        const content = formInput.value;
        formInput.value = '';
        formInput.style.height = "56px";
        formButton.disabled = true

        axios.post(form.action, {
            content: content,
            csrfmiddlewaretoken: window.CSRF_TOKEN
        }, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(function (response) {
                console.log('SUCCESS!');
                console.log(response.data);
                allPosts.insertBefore(createPost(response.data.new_post), allPosts.firstChild)
            })
            .catch(function (error) {
                console.log('ERROR!');
                console.log(error);
            });
    })



})();

// send API call to update a image field and update the UI image
function updateImage(section_id) {
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
        },).then(function (response) {
            console.log('SUCCESS!!');
            image.src = response.data.url;
        })
            .catch(function (err) {
                console.log('FAILURE!!');
                console.log(err)
            });
    })
};


// function for PROFILE PICTURE
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
    updateImage('#profile-picture');
})();


// function for COVER PHOTO
// add styles to cover photo button on hover and click events
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
    updateImage('#cover-photo');

})();
