import { createPostElement } from "./posts.js"

export function processNewPost(endpoint, mainFriendingState) {
    console.log('PROCESSING NEW POST')
    if (mainFriendingState != window.FRIENDING_STATE.Self) {
        return
    }
    let charCount = 0
    // add style to #new-post submit button
    let formButton = document.querySelector('#new-post .post-button')
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

    // process file-image input
    let inputField = document.querySelector(`#new-post input`)
    // console.log(inputField)
    // let currentFiles = []

    let imagePreviewParent = document.querySelector('#new-post .image-preview-parent')
    let eraseImageButton = document.querySelector('#new-post .erase-image-button')
    let imageBox = document.querySelector('#new-post .image-box')

    eraseImageButton.onclick = e => {
        inputField.value = ''
        console.log('inputField.files: ')
        console.log(inputField.files)
        imagePreviewParent.clearChildren()
        imageBox.style.display = 'none';
    };

    inputField.onchange = function (e) {
        imagePreviewParent.clearChildren()
        let imagePreviewTemplate = document.querySelector('#new-post .image-preview-template')
        let allFiles = []
        console.log('haha')
        console.log(inputField.files)
        allFiles.push(...inputField.files)
        allFiles.forEach((file, i) => {
            let newImagePreview = imagePreviewTemplate.cloneNode(true)
            newImagePreview.classList.remove('image-preview-template')
            newImagePreview.classList.add(`image-preview${i}`)
            imagePreviewParent.appendChild(newImagePreview)
            let image = document.querySelector(`#new-post .image-preview${i}>img`)
            image.src = URL.createObjectURL(file)
            console.log(image.src)
            newImagePreview.style.display = 'block'
        });
        if (imagePreviewParent.children.length > 0) {
            imageBox.style.display = 'block';
            let eraseImageContainer = document.querySelector('#new-post .erase-image-container')
            if (imagePreviewParent.children.length === 1) {
                eraseImageContainer.style.right = ''
                eraseImageContainer.style.left = '1rem'
            } else {
                eraseImageContainer.style.right = '1rem'
                eraseImageContainer.style.left = ''
            }
        } else {
            imageBox.style.display = 'none';
        }
        // if (file2) {
        //     imagePreview2.src = URL.createObjectURL(file2)
        // }
    }

    formButton.addEventListener('click', function (e) {
        let form = document.querySelector('#new-post form')
        let inputField = document.querySelector(`#new-post input`)
        const allPosts = document.querySelector('#posts .all-posts')
        e.preventDefault()
        e.stopPropagation()
        var formData = new FormData(form);

        console.log(inputField.files)

        formData.append("csrfmiddlewaretoken", window.CSRF_TOKEN)
        console.log(formData)

        let coverPopup = document.querySelector('#new-post .pop-up')
        coverPopup.style.display = 'block'

        axios.post(endpoint, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(function (response) {
                console.log('SUCCESS!');
                console.log(response.data);
                formInput.value = '';
                formInput.style.height = "56px";
                imageBox.style.display = 'none';
                coverPopup.style.display = 'none';
                createPostElement(response.data.new_post, 'new')
            })
            .catch(function (error) {
                console.log('ERROR!');
                console.log(error);
            });
    })

};