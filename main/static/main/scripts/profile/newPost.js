import { createPostElement } from "./posts.js"

const newPost = document.querySelector('#section-profile-new-post')
const remove = document.querySelector('#section-profile-new-post .remove-container')
const basePopup = document.querySelector('#base-popup')
const body = document.querySelector('body')
let numPreviewImages = 0
const inputField = document.querySelector(`#new-post input`)
// hold all files
const dt = new DataTransfer()

export function setModeNewPost() {
    let scrollTop = $(window).scrollTop()
    newPost.style.display = 'block'
    basePopup.style.display = 'block'
    newPost.style.top = `${scrollTop}px`
    basePopup.style.top = `${scrollTop}px`
    body.style.overflow = 'hidden'

    basePopup.onclick = e => {
        cancelModeNewPost()
    }
    remove.onclick = e => {
        cancelModeNewPost()
    }
}

function cancelModeNewPost() {
    newPost.style.display = 'none'
    basePopup.style.display = 'none'
    body.style.overflow = 'auto'
}

export function processNewPost(endpoint, mainFriendingState) {
    function processNewPostLink() {
        const textarea = document.querySelector('#new-post-link textarea')
        const photoButton = document.querySelector('#new-post-link .photo-button')
        console.log('DASDASDSADASDASD')
        console.log(textarea)
        textarea.addEventListener('click', e => {
            setModeNewPost()
        })
        photoButton.onclick = e => {
            setModeNewPost()
        }
    }
    processNewPostLink()


    const imageBox = document.querySelector('#new-post .image-box')

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
        this.style.height = (this.scrollHeight + 40) + "px";
    });

    processImages()

    function processImages() {
        const imagePreviewParent = document.querySelector('#new-post .image-preview-parent')



        // START
        function processRemoveImage(removeIdx) {
            console.log('START REMOVE IMAGE')
            // 1. process input
            numPreviewImages -= 1
            const { files } = inputField
            var clonedFiles = structuredClone(files);

            dt.clearData()
            for (let i = 0; i < clonedFiles.length; i++) {
                const file = clonedFiles[i]
                if (i != removeIdx) {
                    dt.items.add(file) // here you exclude the file. thus removing it.
                }
            }
            inputField.files = dt.files // Assign the updated list with new photos
            console.log(inputField.files)

            // 2. process preview
            // remove image preview
            imagePreviewParent.removeChild(imagePreviewParent.children[removeIdx]);
            // reindex button id
            for (let i = 0; i < numPreviewImages; i++) {
                const imagePreview = imagePreviewParent.children[i]
                imagePreview.id = `image-preview${i}`
                let removeButton = document.querySelector(`#image-preview${i} button`)
                removeButton.onclick = e => {
                    processRemoveImage(i)
                }
            }

            if (numPreviewImages > 0) {
                imageBox.style.display = 'block';
            } else {
                imageBox.style.display = 'none';
            }
        }
        // END

        inputField.onchange = function (e) {
            console.log('INPUT CHANGED!!')
            let imagePreviewTemplate = document.querySelector('#new-post .image-preview-template')

            // PROCESS ADDING PHOTOS
            // FOR FILE INPUT
            const { files } = inputField
            for (let i = 0; i < files.length; i++) {
                numPreviewImages += 1
                const newIdx = numPreviewImages - 1
                const file = files[i]
                dt.items.add(file)
                // add to preview
                let newImagePreview = imagePreviewTemplate.cloneNode(true)
                newImagePreview.classList.remove('image-preview-template')
                newImagePreview.id = `image-preview${newIdx}`
                imagePreviewParent.appendChild(newImagePreview)
                let image = document.querySelector(`#image-preview${newIdx}>img`)
                image.src = URL.createObjectURL(file)
                // remove button with id
                let removeButton = document.querySelector(`#image-preview${newIdx} button`)
                removeButton.onclick = e => {
                    processRemoveImage(newIdx)
                }
                newImagePreview.style.display = 'block'
            }
            inputField.files = dt.files // Assign the updated list with new photos

            console.log(inputField.files)

            if (imagePreviewParent.children.length > 0) {
                imageBox.style.display = 'block';
            } else {
                imageBox.style.display = 'none';
            }
        }

    }

    formButton.addEventListener('click', function (e) {
        let form = document.querySelector('#new-post form')
        let inputField = document.querySelector(`#new-post input`)
        const allPosts = document.querySelector('#posts .all-posts')
        e.preventDefault()
        e.stopPropagation()
        var formData = new FormData(form);

        console.log("SUBMITING REQUEST!")
        console.log(inputField.files)

        formData.append("csrfmiddlewaretoken", window.CSRF_TOKEN)

        let coverPopup = document.querySelector('#section-profile-new-post .pop-up')
        coverPopup.style.display = 'block'

        axios.post(endpoint, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(function (response) {
                console.log('SUCCESS!');
                console.log(response.data);
                // reset
                formInput.value = '';
                formInput.style.height = "76px";
                imageBox.style.display = 'none';

                const imagePreviewParent = document.querySelector('#new-post .image-preview-parent')
                imagePreviewParent.clearChildren()
                numPreviewImages = 0;
                dt.clearData()

                coverPopup.style.display = 'none';
                cancelModeNewPost()
                createPostElement(response.data.new_post, 'new')
            })
            .catch(function (error) {
                console.log('ERROR!');
                console.log(error);
            });
    })

};