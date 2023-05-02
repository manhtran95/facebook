

export function processFriending() {
    if (friendingState == window.FRIENDING_STATE.Self) {
        return
    }

    let nonFriendNode = document.querySelector('.friending .friending-non-friend')
    let requestSentNode = document.querySelector('.friending .friending-request-sent')
    let requestReceivedNode = document.querySelector('.friending .friending-request-received')
    let friendNode = document.querySelector('.friending .friending-friend')
    let nodes = {
        'NON-FRIEND': nonFriendNode,
        'REQUEST-SENT': requestSentNode,
        'REQUEST-RECEIVED': requestReceivedNode,
        'FRIEND': friendNode
    }

    // display the correct state block
    function processFriendingState(state) {
        for (const [nodeState, node] of Object.entries(nodes)) {
            if (nodeState == state) {
                node.style.display = 'block'
            } else {
                node.style.display = 'none'
            }
        }
    }

    // make AJAX calls to server for 5 actions
    function processFormButtons() {
        let formButtons = document.querySelectorAll('.friending form button')
        formButtons.forEach(formButton => {
            let form = formButton.parentNode;
            formButton.addEventListener('click', function (e) {
                e.preventDefault()
                e.stopPropagation()
                formButton.disabled = true

                axios.post(form.action, {
                    csrfmiddlewaretoken: window.CSRF_TOKEN
                }, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                    .then(function (response) {
                        formButton.disabled = false
                        console.log('SUCCESS!');
                        console.log(response.data);
                        if (response.data.error) {
                            return
                        }
                        window.friendingState = response.data.state
                        processFriendingState(window.friendingState)
                    })
                    .catch(function (error) {
                        console.log('ERROR!');
                        console.log(error);
                    });
            })
        })
    }

    processFormButtons();
    processFriendingState(friendingState);
}