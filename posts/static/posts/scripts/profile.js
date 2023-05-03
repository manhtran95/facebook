import { processCoverPhoto, processProfilePicture } from "./profile/images.js"
import { processPostTasks } from "./profile/posts.js";
import { processFriending } from "./profile/friending.js"

console.log(window.CSRF_TOKEN)

let firstLoad = false

// process section-select
let sectionPostsLink = document.querySelector('#section-select .posts')
let sectionFriendsLink = document.querySelector('#section-select .friends')
let sectionPostsContent = document.querySelector('#section-content .section-posts')
let sectionFriendsContent = document.querySelector('#section-content .section-friends')

sectionPostsLink.addEventListener('click', e => {
    e.preventDefault()
    e.stopPropagation()
    console.log('posts')
    sectionPostsLink.classList.add('active')
    sectionFriendsLink.classList.remove('active')
    sectionPostsContent.style.display = 'flex'
    sectionFriendsContent.style.display = 'none'
})

function showFriends(friendList) {
    let friendTemplate = document.querySelector('.section-friends .friend-template');
    let parent = document.querySelector('.section-friends')
    friendList.forEach((friendInfo, i) => {
        let newFriend = friendTemplate.cloneNode(true);
        newFriend.classList.add(`friend${i}`)
        parent.appendChild(newFriend)
        let img = document.querySelector(`.section-friends .friend${i} img`)
        img.src = friendInfo.friend_profile_picture
        let link = document.querySelector(`.section-friends .friend${i} a`)
        link.href = friendInfo.friend_profile_url
        link.innerHTML = friendInfo.full_name
        newFriend.style.display = 'block'
    });

}

sectionFriendsLink.addEventListener('click', e => {
    e.preventDefault()
    e.stopPropagation()
    if (firstLoad) {
        return
    }
    console.log('friends')
    sectionFriendsLink.classList.add('active')
    sectionPostsLink.classList.remove('active')
    sectionPostsContent.style.display = 'none'
    sectionFriendsContent.style.display = 'flex'

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




processFriending();
processPostTasks();
processCoverPhoto();
processProfilePicture();