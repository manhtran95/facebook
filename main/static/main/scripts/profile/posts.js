import { getFacebookDatetimeStr } from "./../helper/helper.js"
import { processProfileLink } from "./../main.js"
import { processPhotoLink } from "./photo.js"
import { processEditLink } from "./newPost.js"

export function createPostElement(p, mode = 'list') {
    const allPosts = document.querySelector('#posts .all-posts')
    const postTemplate = document.querySelector('#post-template');
    let curCounter = window.curCounter
    window.curCounter += 1
    const newPost = postTemplate.cloneNode(true);
    newPost.classList.add(`p${curCounter}`)
    if (mode === 'list') {
        allPosts.appendChild(newPost)
    } else if (mode === 'new') {
        allPosts.insertBefore(newPost, allPosts.firstChild)
    } else {
        console.log('ERROR!!')
        return
    }

    let links = document.querySelectorAll(`.p${curCounter} .post-info profile-link`)
    links.forEach(link => {
        link.href = p.author_main_url
        processProfileLink(link)
    })

    const authorImage = document.querySelector(`.p${curCounter} .post-info img`)
    authorImage.src = p.author_image
    const name = document.querySelector(`.p${curCounter} .post-info [name='name']`)
    name.innerText = p.author
    const pubDatetime = document.querySelector(`.p${curCounter} .post-info [name='datetime']`)
    pubDatetime.innerText = getFacebookDatetimeStr(new Date(p.pub_timestamp))

    // display edit/delete option
    if (mode === 'list' && p.post_edit_url) {
        const dropdown = document.querySelector(`.p${curCounter} .dropdown`)
        dropdown.style.display = 'block'
        const editLink = document.querySelector(`.p${curCounter} .edit-link`)
        editLink.href = p.post_edit_url
        processEditLink(editLink)
    }

    const postText = document.querySelector(`.p${curCounter} .post-text`)
    postText.innerText = p.post_text

    // process photos
    let imageTemplate = document.querySelector('#posts .image-template')
    let imageParent = document.querySelector(`.p${curCounter} .image-parent`)
    imageParent.clearChildren()
    p.photos.forEach((pt, i) => {
        let newImage = imageTemplate.cloneNode(true)
        newImage.classList.remove('image-template')
        newImage.classList.add(`image${i}`)
        imageParent.appendChild(newImage)
        let link = document.querySelector(`.p${curCounter} .image${i} a`)
        link.href = pt.link
        processPhotoLink(link)
        let image = document.querySelector(`.p${curCounter} .image${i} img`)
        image.src = pt.image_url

        newImage.style.display = 'block'
    })

    window.setTimeout(function () {
        newPost.classList.add('active')
    }, 50);
    newPost.style.marginTop = '1.25rem'
    newPost.style.marginBottom = '1.25rem'
}

export function processPostLoading(indexEndpoint, mainFriendingState) {
    // reset parameters
    window.curCounter = 0;
    let nextCounter = 0
    const NUM_LOAD = 8
    let curObserve = 5
    const allPosts = document.querySelector('#posts .all-posts')
    allPosts.clearChildren()
    const postTemplate = document.querySelector('#post-template');
    const observer = new IntersectionObserver(function (entries) {
        // isIntersecting is true when element and viewport are overlapping
        // isIntersecting is false when element and viewport don't overlap
        if (entries[0].isIntersecting === true) {
            console.log('Element has just become visible in screen');
            this.disconnect()
            loadPosts()
        }
    }, { threshold: [0] });

    (function () {
        function observe() {
        }
        window.setTimeout(observe, 50);
    })();

    function showPosts(posts) {
        posts.forEach(p => createPostElement(p))
    };

    // load next page
    function loadPosts() {
        const loading = document.querySelector('#posts .loading');
        const noMore = document.querySelector('#posts .no-more');

        console.log('LOADING NEXT PAGE!');
        loading.style.display = 'block'
        noMore.style.display = 'none'
        var formData = new FormData();
        let form = document.querySelector(`#hidden-info .index-form`)

        formData.append("counter", nextCounter);
        axios.get(indexEndpoint, {
            params: {
                counter: nextCounter
            }
        })
            .then(function (response) {
                if (response.data.error) {
                    console.log('ERROR!')
                    console.log(response.data.error)
                    return
                }

                console.log('Get Posts SUCCESS!!');
                console.log(indexEndpoint);
                loading.style.display = 'none'
                noMore.style.display = 'block'
                nextCounter = response.data.counter
                console.log(response.data.page);
                showPosts(response.data.page);
                // update observer if next page available
                if (nextCounter > 0) {
                    observer.observe(document.querySelector(`#posts .all-posts .p${curObserve}`));
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

    // first load
    (function () {
        let nonDisplayInfoNode = document.querySelector('#posts .posts-info .non-display')
        let displayInfoNode = document.querySelector('#posts .posts-info .display')
        if (mainFriendingState == window.FRIENDING_STATE.Self || mainFriendingState == window.FRIENDING_STATE.Friend) {
            nonDisplayInfoNode.style.display = 'none'
            displayInfoNode.style.display = 'block'
            loadPosts();
        } else {
            nonDisplayInfoNode.style.display = 'block'
            displayInfoNode.style.display = 'none'
            return
        }
    })();

}