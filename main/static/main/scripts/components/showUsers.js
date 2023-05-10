
import { processFriending } from "./friending.js"
import { processProfileLink } from "../main.js"

export function showUsers(userList, sectionName, parentIdentifier) {
    let friendTemplate = document.querySelector(`.user-template`);
    let parent = document.querySelector(parentIdentifier)
    parent.clearChildren()
    userList.forEach((userInfo, i) => {
        let newFriend = friendTemplate.cloneNode(true);
        let thisUserClass = `friend${i}`
        newFriend.classList.add(thisUserClass)
        parent.appendChild(newFriend)
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
        let friendingTemplate = document.querySelector('.friending')
        let newFriending = friendingTemplate.cloneNode(true)

        newFriend.appendChild(newFriending)

        newFriending.classList.add(`${sectionName}${i}`)
        processFriending(`${sectionName}${i}`, userInfo.friend_state, false, userInfo.urls)
        newFriend.style.display = 'block'
    });
}