import { processCoverPhoto, processProfilePicture } from "./profile/images.js"
import { processNewPost } from "./profile/newPost.js";
import { processPostTasks } from "./profile/posts.js";
import { processFriending } from "./friending.js"
import { processSectionFriends } from "./profile/sectionFriends.js"

console.log(window.CSRF_TOKEN)

export function processProfile() {

    // process select-section
    function processSelectAndContentAll() {
        function processSelectAndContent(selectParent, selectContentParent) {
            let selectLinks = selectParent.children
            let selectContentBlocks = selectContentParent.children
            Array.from(selectLinks).forEach((link, i) => {
                if (Array.from(link.classList).includes('home-required')) {
                    if (window.currentUserId != window.userId) {
                        link.style.display = 'none'
                    }
                }
                link.addEventListener('click', e => {
                    e.preventDefault()
                    e.stopPropagation()
                    for (let j = 0; j < selectLinks.length; j++) {
                        if (j == i) {
                            selectLinks[j].classList.add('active')
                            selectContentBlocks[j].style.display = 'flex'
                        } else {
                            selectLinks[j].classList.remove('active')
                            selectContentBlocks[j].style.display = 'none'
                        }
                    }
                })
            })
            // auto click
            if (Array.from(selectLinks[0].classList).includes('click')) {
                selectLinks[0].click()
            }
        }

        let allSelectParents = document.querySelectorAll(`.myselect`)
        let allSelectContentParents = document.querySelectorAll(`.myselect-content`)
        for (let i = 0; i < allSelectParents.length; i++) {
            processSelectAndContent(allSelectParents[i], allSelectContentParents[i])
        }
    }

    function processHomeProfile() {
        let coverPhotoHome = document.querySelector(`#cover-photo .dropdown`)
        let profilePictureHome = document.querySelector(`#profile-picture .dropdown`)
        let newPostHome = document.querySelector(`#whole-new-post`)
        let homeSections = [coverPhotoHome, profilePictureHome, newPostHome]
        if (window.currentUserId == window.userId) {
            processCoverPhoto();
            processProfilePicture();
            processNewPost();
            homeSections.forEach(s => {
                s.style.display = 'block'
            })
        } else {
            homeSections.forEach(s => {
                s.style.display = 'none'
            })
        }
    }

    processHomeProfile()
    processSelectAndContentAll()
    processFriending('friending', window.mainFriendingState, true, null);
    // append
    processSectionFriends()
    processPostTasks();

}