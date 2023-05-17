import { setProfileSection } from "./../profile.js"


export function processPhoto() {
    let background = document.querySelector('#photo-display .background')
    let escapeButton = document.querySelector('#photo-display .erase-image-button')
    background.onclick = e => {
        setProfileSection(window.ProfileSectionEnum.Main)
    }

    escapeButton.onclick = e => {
        setProfileSection(window.ProfileSectionEnum.Main)
    }

}