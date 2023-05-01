import { getFacebookDatetimeStr } from "./../helper.js"

export function processPostTasks() {
    let nextCounter = 0
    let curCounter = 0
    const NUM_LOAD = 8
    let curObserve = 5
    const allPosts = document.querySelector('#all-posts')
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

    function createPostElement(p) {
        curCounter += 1
        const newPost = postTemplate.cloneNode(true);
        const post = newPost.firstElementChild
        const postInfo = post.firstElementChild

        const image = postInfo.firstElementChild
        image.src = p.author_image
        const info = postInfo.lastElementChild
        const name = info.firstElementChild
        name.innerText = p.author
        const pubDatetime = info.lastElementChild
        pubDatetime.innerText = getFacebookDatetimeStr(new Date(p.pub_timestamp))

        const postText = post.lastElementChild
        postText.innerText = p.post_text
        window.setTimeout(function () {
            newPost.classList.add('active')
        }, 50);
        newPost.classList.add(`p${curCounter}`)
        newPost.style.marginTop = '1.25rem'
        newPost.style.marginBottom = '1.25rem'

        return newPost
    }

    function showPosts(posts) {
        posts.forEach(p => allPosts.appendChild(createPostElement(p)))
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
        axios.get(form.action, {
            params: {
                counter: nextCounter
            }
        })
            .then(function (response) {
                console.log('SUCCESS!!');
                loading.style.display = 'none'
                noMore.style.display = 'block'
                nextCounter = response.data.counter
                showPosts(response.data.page);
                // update observer if next page available
                if (nextCounter > 0) {
                    observer.observe(document.querySelector(`#all-posts .p${curObserve}`));
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
        loadPosts();
    })();

    // process #NEW-POST
    (function () {
        let charCount = 0
        // add style to #new-post submit button
        let formButton = document.querySelector('#new-post button')
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

        let form = document.querySelector('#new-post form')
        formButton.addEventListener('click', function (e) {
            e.preventDefault()
            e.stopPropagation()
            const content = formInput.value;
            formInput.value = '';
            formInput.style.height = "56px";
            formButton.disabled = true

            axios.post(form.action, {
                content: content,
                csrfmiddlewaretoken: window.CSRF_TOKEN
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(function (response) {
                    console.log('SUCCESS!');
                    console.log(response.data);
                    allPosts.insertBefore(createPostElement(response.data.new_post), allPosts.firstChild)
                })
                .catch(function (error) {
                    console.log('ERROR!');
                    console.log(error);
                });
        })

    })();
}