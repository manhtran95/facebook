
import { processFriending } from "./friending.js"
import { processProfileLink } from "../profile.js"

export function showUsers(userList, sectionName, parentIdentifier) {
    let userTemplate = document.querySelector(`.original-user-template`);
    let parent = document.querySelector(parentIdentifier)
    parent.clearChildren()
    userList.forEach((userInfo, i) => {
        let newUser = userTemplate.cloneNode(true);
        newUser.classList.remove('original-user-template')
        let thisUserClass = `user${i}`
        newUser.classList.add(thisUserClass)
        newUser.classList.add(`${sectionName}-user`)
        parent.appendChild(newUser)
        let img = document.querySelector(`${parentIdentifier} .${thisUserClass} img`)
        img.src = userInfo.profile_picture
        let imageLink = document.querySelector(`${parentIdentifier} .${thisUserClass} a[name='pic']`)
        imageLink.href = userInfo.main_url
        processProfileLink(imageLink)
        let nameLink = document.querySelector(`${parentIdentifier} .${thisUserClass} a[name='name']`)
        nameLink.href = userInfo.main_url
        nameLink.innerHTML = userInfo.full_name
        processProfileLink(nameLink)
        // process Friending
        let friendingTemplate = document.querySelector('.original-friending')
        let newFriending = friendingTemplate.cloneNode(true)
        newFriending.classList.remove('original-friending')

        newUser.appendChild(newFriending)

        newFriending.classList.add(`${sectionName}${i}`)
        processFriending(`${sectionName}${i}`, userInfo.friend_state, false, userInfo.urls)
        newUser.style.display = 'block'
    });
}