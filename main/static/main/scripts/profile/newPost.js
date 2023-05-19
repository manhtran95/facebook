import { createPostElement } from "./posts.js"

export function processNewPost(endpoint, mainFriendingState) {
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
        this.style.height = (this.scrollHeight + 20) + "px";
    });

    processImages()

    function processImages() {
        let inputField = document.querySelector(`#new-post input`)
        const imagePreviewParent = document.querySelector('#new-post .image-preview-parent')

        // hold all files
        let dt = new DataTransfer()
        let numImages = 0

        // START
        function processRemoveImage(removeIdx) {
            console.log('START REMOVE IMAGE')
            // 1. process input
            numImages -= 1
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
            for (let i = 0; i < numImages; i++) {
                const imagePreview = imagePreviewParent.children[i]
                imagePreview.id = `image-preview${i}`
                let removeButton = document.querySelector(`#image-preview${i} button`)
                removeButton.onclick = e => {
                    processRemoveImage(i)
                }
            }

            if (numImages > 0) {
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
                numImages += 1
                const newIdx = numImages - 1
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