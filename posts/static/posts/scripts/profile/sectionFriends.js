import { showUsers } from "./../showUsers.js"

export function processSectionFriends() {
    function processSectionContentFriends(sectionName, contentBlock, friendingClass, parentSection = null) {
        let links = []
        let parentIdentifier = `.myselect-content[name=${sectionName}] [name="${contentBlock}"]`
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
                        showUsers(response.data.user_list, friendingClass, parentIdentifier);
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
}
