import { processCoverPhoto, processProfilePicture } from "./profile/images.js"
import { processPostTasks } from "./profile/posts.js";
import { processFriending } from "./profile/friending.js"

console.log(window.CSRF_TOKEN)


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

function processSectionContentFriends(sectionName, contentBlock, friendingClass, parentSection = null) {
    let links = []
    let sectionFriendsLink = document.querySelector(`.myselect[name=${sectionName}] [name="${contentBlock}"]`)
    links.push(sectionFriendsLink)
    if (parentSection) {
        let parentFriendsLink = document.querySelector(`.myselect[name=${parentSection}] [name="${sectionName}"]`)
        links.push(parentFriendsLink)
    }
    let firstLoad = false

    links.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault()
            e.stopPropagation()
            if (firstLoad) {
                return
            }
            function showFriends(friendList) {
                let friendTemplate = document.querySelector(`.friend-template`);
                let parent = document.querySelector(`.myselect-content[name=${sectionName}] [name="${contentBlock}"]`)
                friendList.forEach((friendInfo, i) => {
                    let newFriend = friendTemplate.cloneNode(true);
                    newFriend.classList.add(`friend${i}`)
                    parent.appendChild(newFriend)
                    let img = document.querySelector(`.myselect-content[name=${sectionName}] [name="${contentBlock}"] .friend${i} img`)
                    img.src = friendInfo.friend_profile_picture
                    let imageLink = document.querySelector(`.myselect-content[name=${sectionName}] [name="${contentBlock}"] .friend${i} a[name='pic']`)
                    imageLink.href = friendInfo.friend_profile_url
                    let nameLink = document.querySelector(`.myselect-content[name=${sectionName}] [name="${contentBlock}"] .friend${i} a[name='name']`)
                    nameLink.href = friendInfo.friend_profile_url
                    nameLink.innerHTML = friendInfo.full_name
                    // process Friending
                    let friendingTemplate = document.querySelector('.friending')
                    let newFriending = friendingTemplate.cloneNode(true)

                    newFriend.appendChild(newFriending)

                    newFriending.classList.add(`${friendingClass}${i}`)
                    processFriending(`${friendingClass}${i}`, friendInfo.friend_state, false, friendInfo.urls)
                    newFriend.style.display = 'block'
                });
            }
            axios.get(sectionFriendsLink.href, {
                params: {}
            })
                .then(function (response) {
                    if (response.data.error) {
                        console.log('ERROR!')
                        console.log(response.data.error)
                        return
                    }
                    console.log('SUCCESS!!');
                    console.log(response.data)
                    showFriends(response.data.friend_list);
                    firstLoad = true
                })
                .catch(function (err) {
                    console.log('FAILURE!!');
                    console.log(err)
                });
        })
    })

}

processSectionContentFriends('friends', 'all-friends', 'friending', 'section')
processSectionContentFriends('friends', 'friend-requests', 'request-friending')
processSelectAndContentAll()
processFriending('friending', window.mainFriendingState, true, null);
processPostTasks();
processCoverPhoto();
processProfilePicture();