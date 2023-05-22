

export function setLikeActive(postId) {
    const like = document.querySelector(`#post${postId} .like`)
    const unlike = document.querySelector(`#post${postId} .unlike`)
    like.displayNone()
    unlike.displayBlock()
}

export function setLikeInactive(postId) {
    const like = document.querySelector(`#post${postId} .like`)
    const unlike = document.querySelector(`#post${postId} .unlike`)
    unlike.displayNone()
    like.displayBlock()
}


export function updateLikeNumber(postId, n) {
    const numLikes = document.querySelector(`#post${postId} .liking-users`)
    numLikes.innerText = `${n} people liked this.`
}

export function processLikeLink(link, mode) {
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
                if (mode === 'like') {
                    console.log('Post - Like Create - SUCCESS!!');
                    setLikeActive(response.data.post_id)
                } else {
                    console.log('Post - Unlike - SUCCESS!!');
                    setLikeInactive(response.data.post_id)
                }
                console.log(response.data)
                updateLikeNumber(response.data.post_id, response.data.liked_users)
            })
            .catch(function (err) {
                console.log('FAILURE!!');
                console.log(err)
            });
    }
}