import { getFacebookDatetimeStr } from "./../helper/helper.js"
import { processProfileLink } from "./../profile.js"
import { processPhotoLink } from "./photo.js"
import { processEditLink } from "./newPost.js"
import { processLikeLink, setLikeActive, setLikeInactive, updateLikeNumber } from "./likes.js"

const imageTemplate = document.querySelector('.post-image-template')
let allPosts
const NUM_LOAD = 8
let curCounter
const postTemplate = document.querySelector('.post-template');

window.PostsSectionEnum = {
    'Profile': 'profile',
    'Newsfeed': 'newsfeed',
}

export function createPostElement(p, mode = 'list') {
    const newPost = postTemplate.cloneNode(true);
    newPost.classList.remove(`post-template`)
    newPost.classList.add(`post-instance`)
    newPost.classList.add(`p${curCounter}`)
    curCounter += 1

    const elePostId = `post${p.id}`
    newPost.id = elePostId
    if (mode === 'list') {
        allPosts.appendChild(newPost)
    } else if (mode === 'new') {
        allPosts.insertBefore(newPost, allPosts.firstChild)
    } else {
        console.log('ERROR!!')
        return
    }

    let links = document.querySelectorAll(`#${elePostId} .post-info profile-link`)
    links.forEach(link => {
        link.href = p.author_main_url
        processProfileLink(link)
    })

    const authorImage = document.querySelector(`#${elePostId} .post-info img`)
    authorImage.src = p.author_image
    const name = document.querySelector(`#${elePostId} .post-info [name='name']`)
    name.innerText = p.author
    const pubDatetime = document.querySelector(`#${elePostId} .post-info [name='datetime']`)
    pubDatetime.innerText = getFacebookDatetimeStr(new Date(p.pub_timestamp))

    // display edit/delete option
    if (mode === 'list' && p.post_edit_url) {
        const dropdown = document.querySelector(`#${elePostId} .dropdown`)
        dropdown.style.display = 'block'
        const editLink = document.querySelector(`#${elePostId} .edit-link`)
        editLink.href = p.post_edit_url
        processEditLink(editLink)

        const deleteLink = document.querySelector(`#${elePostId} .delete-link`)
        deleteLink.href = p.post_delete_url
        processDeleteLink(deleteLink)
    }

    const postText = document.querySelector(`#${elePostId} .post-text`)
    postText.innerText = p.post_text

    // process photos
    const imageParent = document.querySelector(`#${elePostId} .image-parent`)
    imageParent.clearChildren()
    p.photos.forEach((pt, i) => {
        let newImage = imageTemplate.cloneNode(true)
        newImage.classList.remove('image-template')
        newImage.classList.add(`image${i}`)
        imageParent.appendChild(newImage)
        let link = document.querySelector(`#${elePostId} .image${i} a`)
        link.href = pt.link
        processPhotoLink(link)
        let image = document.querySelector(`#${elePostId} .image${i} img`)
        image.src = pt.image_url

        newImage.style.display = 'block'
    })

    // process LIKES
    const likeLink = document.querySelector(`#${elePostId} .like-button`)
    const unlikeLink = document.querySelector(`#${elePostId} .like-button.active`)
    likeLink.href = p.like_create_url
    unlikeLink.href = p.like_delete_url
    processLikeLink(likeLink, 'like')
    processLikeLink(unlikeLink, 'unlike')
    if (p.like_state) {
        setLikeActive(p.id)
    } else {
        setLikeInactive(p.id)
    }
    updateLikeNumber(p.id, p.like_number)

    window.setTimeout(function () {
        newPost.classList.add('active')
    }, 50);
    newPost.style.marginTop = '1.25rem'
    newPost.style.marginBottom = '1.25rem'
}

function processDeleteLink(link) {
    link.onclick = e => {
        e.preventDefault()
        e.stopPropagation()
        axios.post(link.href, {
            csrfmiddlewaretoken: window.CSRF_TOKEN
        }, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(function (response) {
                if (response.data.error) {
                    console.log('ERROR!')
                    console.log(response.data.error)
                    return
                }
                console.log('Post - Delete Post - SUCCESS!!');
                console.log(response.data.deleted_post_id)
                const post = document.querySelector(`#post${response.data.deleted_post_id}`)
                allPosts.removeChild(post)
            })
            .catch(function (err) {
                console.log('FAILURE!!');
                console.log(err)
            });
    }
}

export function updatePostElement(postInfo) {
    const elePostId = `post${postInfo.post_id}`
    const postText = document.querySelector(`#${elePostId} .post-text`)
    postText.innerText = postInfo.post_text

    // process photos
    let imageParent = document.querySelector(`#${elePostId} .image-parent`)
    imageParent.clearChildren()
    postInfo.photos.forEach((pt, i) => {
        let newImage = imageTemplate.cloneNode(true)
        newImage.classList.remove('image-template')
        newImage.classList.add(`image${i}`)
        imageParent.appendChild(newImage)
        let link = document.querySelector(`#${elePostId} .image${i} a`)
        link.href = pt.link
        processPhotoLink(link)
        let image = document.querySelector(`#${elePostId} .image${i} img`)
        image.src = pt.image_url

        newImage.style.display = 'block'
    })
}

const profileAllPosts = document.querySelector('#posts .all-posts')
const newsfeedAllPosts = document.querySelector('#newsfeed .all-posts')

export function processPostLoading(section, indexEndpoint, mainFriendingState) {
    // reset parameters
    curCounter = 0;     // counter used as index for post
    let offset = 0     // next post counter to get - received from server
    let curObserve = 5      // current post index to observe
    profileAllPosts.clearChildren()
    newsfeedAllPosts.clearChildren()
    let sectionId

    switch (section) {
        case window.PostsSectionEnum.Profile:
            allPosts = profileAllPosts
            sectionId = '#posts'
            break;
        case window.PostsSectionEnum.Newsfeed:
            allPosts = newsfeedAllPosts
            sectionId = '#newsfeed'
            break;
        default:
            console.log('Invalid PostsSectionEnum')
    }

    // FUNCTIONS
    const observer = new IntersectionObserver(function (entries) {
        // isIntersecting is true when element and viewport are overlapping
        // isIntersecting is false when element and viewport don't overlap
        if (entries[0].isIntersecting === true) {
            console.log('Element has just become visible in screen');
            this.disconnect()
            loadPosts()
        }
    }, { threshold: [0] });

    function showPosts(posts) {
        posts.forEach(p => createPostElement(p))
    };

    // load next page
    function loadPosts() {
        const loading = document.querySelector(`${sectionId} .loading`);
        const noMore = document.querySelector(`${sectionId} .no-more`);

        console.log('LOADING NEXT PAGE!');
        loading.style.display = 'block'
        noMore.style.display = 'none'

        axios.get(indexEndpoint, {
            params: {
                offset: offset
            }
        })
            .then(function (response) {
                if (response.data.error) {
                    console.log('ERROR!')
                    console.log(response.data.error)
                    return
                }

                console.log(`Get Posts SUCCESS: ${section}`);
                console.log(indexEndpoint);
                loading.style.display = 'none'
                noMore.style.display = 'block'
                offset = response.data.next_offset
                console.log(response.data.page);
                showPosts(response.data.page);
                // update observer if next page available
                if (offset > 0) {
                    observer.observe(document.querySelector(`${sectionId} .all-posts .p${curObserve}`));
                    curObserve += NUM_LOAD
                } else {
                    noMore.style.display = 'block'
                }
            })
            .catch(function (err) {
                console.log('FAILURE!!');
                console.log(err)
            });
    };

    // INITIATION
    const displayInfoNode = document.querySelector(`${sectionId} .posts-info .display`)
    const nonDisplayInfoNode = document.querySelector(`${sectionId} .posts-info .non-display`)

    const profileNonDisplay = section == window.PostsSectionEnum.Profile && mainFriendingState != window.FRIENDING_STATE.Self && mainFriendingState != window.FRIENDING_STATE.Friend

    if (profileNonDisplay) {
        nonDisplayInfoNode.displayBlock()
        displayInfoNode.displayNone()
        return
    }

    nonDisplayInfoNode.displayNone()
    displayInfoNode.displayBlock()
    loadPosts();

}