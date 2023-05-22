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