import { createPostElement, updatePostElement } from "./posts.js"


const newPost = document.querySelector('#section-profile-new-post')
const remove = document.querySelector('#section-profile-new-post .remove-container')
const basePopup = document.querySelector('#base-popup')
const body = document.querySelector('body')
const imageBox = document.querySelector('#new-post .image-box')
// hold all files
const form = document.querySelector('#new-post form')
const inputField = document.querySelector(`#new-post input`)
const dt = new DataTransfer()
const imagePreviewParent = document.querySelector('#new-post .image-preview-parent')
const imagePreviewTemplate = document.querySelector('#new-post .image-preview-template')
const title = document.querySelector(`#section-profile-new-post .title`)
const formButton = document.querySelector('#new-post .post-button')
const formTextInput = document.querySelector('#new-post textarea')
let numNewImages = 0
// for edit
let numOldImages = 0    // used in part 1 and 4
const removedOldPhotoIds = []
let lastMode = ''

const MODE = {
    EDIT: 'edit',
    NEW: 'new',
}


// START
// profile level functions
function setModeNewOrEditPost(mode) {
    if (mode == MODE.EDIT || lastMode == MODE.EDIT && mode == MODE.NEW) {
        resetForm()
    }
    lastMode = mode

    if (mode === MODE.EDIT) {
        title.innerText = 'Edit Post'
        formButton.innerText = 'Update'
    } else {
        title.innerText = 'Create Post'
        formButton.innerText = 'Post'
    }

    let scrollTop = $(window).scrollTop()
    newPost.style.display = 'block'
    basePopup.style.display = 'block'
    newPost.style.top = `${scrollTop}px`
    basePopup.style.top = `${scrollTop}px`
    body.style.overflow = 'hidden'

    formTextInput.focus()

    basePopup.onclick = e => {
        cancelModeNewOrEditPost()
    }
    remove.onclick = e => {
        cancelModeNewOrEditPost()
    }
}
function cancelModeNewOrEditPost() {
    newPost.style.display = 'none'
    basePopup.style.display = 'none'
    body.style.overflow = 'auto'
}
// END
// profile level functions

// process edit initiation
export function processEditLink(link) {
    link.onclick = e => {
        e.preventDefault()
        e.stopPropagation()
        axios.get(link.href, {
            params: {}
        })
            .then(function (response) {
                if (response.data.error) {
                    console.log('ERROR!')
                    console.log(response.data.error)
                    return
                }
                console.log('Get Edit Post - SUCCESS!!');
                console.log(response.data.post)
                setModeNewOrEditPost(MODE.EDIT)
                processNewOrEditPost(window.FRIENDING_STATE.Self, true, response.data.post.post_update_url, response.data.post)
            })
            .catch(function (err) {
                console.log('FAILURE!!');
                console.log(err)
            });
    }
}

function resetForm() {
    formTextInput.value = '';
    formTextInput.style.height = "76px";
    imageBox.style.display = 'none';
    imagePreviewParent.clearChildren()
    updateImageBox()
    dt.clearData()
    numNewImages = 0
    numOldImages = 0
    removedOldPhotoIds.length = 0
    form.classList.remove('was-validated')
}

function updateImageBox() {
    if (imagePreviewParent.children.length > 0) {
        imageBox.style.display = 'block';
    } else {
        imageBox.style.display = 'none';
    }
}

// main function
export function processNewOrEditPost(mainFriendingState, isEdit, endpoint, editInfo = null) {
    console.log('PROCESSING NEW POST')
    if (mainFriendingState != window.FRIENDING_STATE.Self) {
        return
    }

    let editPhotos = null
    let editText = null

    // 1. process edit part
    if (isEdit) {
        editPhotos = editInfo.photos
        editText = editInfo.post_text
        numOldImages = editPhotos.length
        function removeOldImage(photo_id) {
            imagePreviewParent.removeChild(document.querySelector(`#old-image${photo_id}`));
            removedOldPhotoIds.push(photo_id)
            numOldImages -= 1
            updateImageBox()
        }
        // set post text value
        formTextInput.value = editText
        // add old photos to image parent
        editPhotos.forEach((photo, i) => {
            // add to preview
            let newImagePreview = imagePreviewTemplate.cloneNode(true)
            newImagePreview.classList.remove('image-preview-template')
            newImagePreview.id = `old-image${photo.id}`
            imagePreviewParent.appendChild(newImagePreview)
            let image = document.querySelector(`#old-image${photo.id}>img`)
            image.src = photo.image_url
            // remove button with id
            let removeButton = document.querySelector(`#old-image${photo.id} button`)
            removeButton.onclick = e => {
                removeOldImage(photo.id)
            }
            newImagePreview.style.display = 'block'
        })
        updateImageBox()
    }

    // click new-post part on wall -> will open new-post popup
    processNewPostLink()


    // c. add style to #new-post submit button
    formTextInput.addEventListener('input', function (e) {
        this.style.height = 0;
        this.style.height = (this.scrollHeight + 40) + "px";
    });

    // 2
    processImages()
    function processImages() {
        // START
        function processRemoveImage(removeIdx) {
            console.log('START REMOVE IMAGE')
            // 1. process input
            numNewImages -= 1
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
            const parentRemoveIdx = removeIdx + numOldImages
            imagePreviewParent.removeChild(imagePreviewParent.children[parentRemoveIdx]);
            // reindex button id
            for (let i = 0; i < numNewImages; i++) {
                const imagePreview = imagePreviewParent.children[i + numOldImages]
                imagePreview.id = `image-preview${i}`
                let removeButton = document.querySelector(`#image-preview${i} button`)
                removeButton.onclick = e => {
                    processRemoveImage(i)
                }
            }

            if (numNewImages > 0) {
                imageBox.style.display = 'block';
            } else {
                imageBox.style.display = 'none';
            }
        }
        // END

        // PROCESS ADD IMAGES
        inputField.onchange = function (e) {
            console.log('INPUT CHANGED!!')

            // FOR FILE INPUT
            const { files } = inputField
            for (let i = 0; i < files.length; i++) {
                numNewImages += 1
                const newIdx = numNewImages - 1
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

            updateImageBox()

        }

    }
    // 3. PROCESS NEW POST SUBMIT
    formButton.onclick = function (e) {
        e.preventDefault()
        e.stopPropagation()
        form.classList.add('was-validated')
        if (!form.checkValidity()) {
            return
        }
        var formData = new FormData(form);

        console.log("SUBMITING REQUEST!")
        console.log(inputField.files)

        if (isEdit) {
            formData.append("removedPhotoIds", JSON.stringify(removedOldPhotoIds))
            console.log("removed Old Photos")
            console.log(removedOldPhotoIds)
        }
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
                resetForm()

                coverPopup.style.display = 'none';
                cancelModeNewOrEditPost()
                if (isEdit) {
                    updatePostElement(response.data.updated_post)
                } else {
                    createPostElement(response.data.new_post, 'new')
                }
            })
            .catch(function (error) {
                console.log('ERROR!');
                console.log(error);
            });
    }

    function processNewPostLink() {
        const textarea = document.querySelector('#new-post-link textarea')
        const photoButton = document.querySelector('#new-post-link .photo-button')
        textarea.addEventListener('click', e => {
            setModeNewOrEditPost(MODE.NEW)
        })
        photoButton.onclick = e => {
            setModeNewOrEditPost(MODE.NEW)
        }
    }


};