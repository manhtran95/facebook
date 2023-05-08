export function processNewPost(endpoint) {
    if (window.mainFriendingState != FRIENDING_STATE.Self) {
        return
    }
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

        axios.post(endpoint, {
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

};