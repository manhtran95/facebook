import { processUploadCoverPhoto, processUploadProfilePicture } from "./profile/images.js"
import { processNewOrEditPost } from "./profile/newPost.js";
import { processPostLoading } from "./profile/posts.js";
import { processFriending } from "./components/friending.js"
import { processSectionFriends } from "./profile/sectionFriends.js"
import { processPhoto } from "./profile/photo.js"
import { pluralizeWord } from "./helper/helper.js"
import { mainProcessProfile } from "./main.js"

console.log(window.CSRF_TOKEN)

window.vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
window.vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
console.log(vh)

window.ProfileSectionEnum = {
    'Main': 'main',
    'Photo': 'photo',
}

function setModeMain() {
    const main = document.querySelector('#section-profile-main')
    const photo = document.querySelector('#section-profile-photo')
    main.style.display = 'block'
    photo.style.display = 'none'
}
function setModePhoto() {
    const main = document.querySelector('#section-profile-main')
    const photo = document.querySelector('#section-profile-photo')
    main.style.display = 'none'
    photo.style.display = 'block'
}


const sectionProfileMap = {
    'main': setModeMain,
    'photo': setModePhoto,
};

export function processProfileLink(link) {
    link.addEventListener('click', e => {
        e.preventDefault()
        e.stopPropagation()
        mainProcessProfile(`${link.href}/profile`, link.href)
    })
}

export function setProfileSection(sectionName = window.ProfileSectionEnum.Main) {
    if (!(Object.values(window.ProfileSectionEnum).includes(sectionName))) {
        console.log("ERROR!! INVALID SECTION NAME!!")
    }
    const action = sectionProfileMap[sectionName]
    action()
}



export function processProfile(secondUserProfileUrl) {

    function processSelectAndContentAll(pr) {
        function processSelectAndContent(selectParent, selectContentParent) {
            let selectLinks = selectParent.children
            let selectContentBlocks = selectContentParent.children
            Array.from(selectLinks).forEach((link, i) => {
                if (Array.from(link.classList).includes('home-required')) {
                    if (window.currentUserId != pr.second_user_id) {
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
    function processHomeProfile(pr) {
        let fullname = document.querySelector(`#info .full-name`)
        fullname.innerText = `${pr.first_name} ${pr.last_name}`
        let numFriends = document.querySelector(`#info .num-friends`)
        let numFriend = parseInt(pr.num_friends)
        numFriends.innerHTML = numFriend + ' ' + pluralizeWord('friend', 'friends', numFriend)
        let profilePicture = document.querySelector('#profile-picture>img');
        profilePicture.src = pr.profile_picture_url_round
        let coverPhoto = document.querySelector('#cover-photo>img');
        coverPhoto.src = pr.cover_url
        let coverPhotoHome = document.querySelector(`#cover-photo .dropdown`)
        let profilePictureHome = document.querySelector(`#profile-picture .dropdown`)
        let newPostHome = document.querySelector(`#whole-new-post-link`)
        let homeSections = [coverPhotoHome, profilePictureHome, newPostHome]
        // home profile
        if (window.currentUserId == pr.second_user_id) {
            processUploadCoverPhoto(pr.upload_cover_photo_url);
            processUploadProfilePicture(pr.upload_profile_picture_url);
            processNewOrEditPost(pr.main_friending_state, false, pr.posts_create_url);
            homeSections.forEach(s => {
                s.style.display = 'block'
            })
        } else {
            homeSections.forEach(s => {
                s.style.display = 'none'
            })
        }
    }
    function process(pr) {
        setProfileSection()
        // setTimeout(e => {
        // }, 1000)
        // setProfileSection(window.ProfileSectionEnum.Photo)
        processHomeProfile(pr)
        processSelectAndContentAll(pr)
        processFriending('mainFriending', pr.main_friending_state, true, null);
        // append
        processSectionFriends(pr.friending_index_url, pr.friending_requests_url)
        processPostLoading(window.PostsSectionEnum.Profile, pr.posts_index_url, pr.main_friending_state);
        processPhoto();
    }

    axios.get(secondUserProfileUrl, {
        params: {}
    })
        .then(function (response) {
            if (response.data.error) {
                console.log('ERROR!')
                console.log(response.data.error)
                return
            }
            console.log('Get Profile - SUCCESS!!');
            console.log(response.data.profile)
            process(response.data.profile)
            return response.data.profile
        })
        .catch(function (err) {
            console.log('FAILURE!!');
            console.log(err)
        });

}

