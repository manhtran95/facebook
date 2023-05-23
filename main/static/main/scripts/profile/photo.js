import { setProfileSection } from "./../profile.js"
import { processProfileLink } from "../profile.js"
import { getFacebookDatetimeStr } from "./../helper/helper.js"


function profileProcessPhoto(photoDataUrl) {
    console.log('processing' + photoDataUrl)

    window.vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    window.vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

    let section = document.querySelector('#section-profile-photo')
    section.style.height = '' + (window.vh - 55) + 'px'
    let ptWidth = window.vw - 59 - 440
    let ptHeight = window.vh - 55
    let widthToHeight = ptWidth / ptHeight

    // to process infor
    function process(photo) {
        let image = document.querySelector('#photo-display .image')
        image.addEventListener('load', e => {
            let w = image.clientWidth
            let h = image.clientHeight
            if (w / h > widthToHeight) {
                image.style.width = '100%';
                image.style.height = 'auto';
            } else {
                image.style.width = 'auto';
                image.style.height = '100%';
            }
        })

        image.src = photo.full_url

        let links = document.querySelectorAll(`#photo-info .post-info a`)
        links.forEach(link => {
            link.href = photo.author_main_url
            processProfileLink(link)
        })

        const authorImage = document.querySelector(`#photo-info .post-info img`)
        authorImage.src = photo.author_image


        const name = document.querySelector(`#photo-info .post-info [name='name']`)
        name.innerText = photo.author
        const pubDatetime = document.querySelector(`#photo-info .post-info [name='datetime']`)
        pubDatetime.innerText = getFacebookDatetimeStr(new Date(photo.pub_timestamp))
    }

    // make ajax call
    axios.get(photoDataUrl, {
        params: {}
    })
        .then(function (response) {
            if (response.data.error) {
                console.log('ERROR!')
                console.log(response.data.error)
                return
            }
            console.log('Get Photo - SUCCESS!!');
            console.log(response.data.photo)
            setProfileSection(window.ProfileSectionEnum.Photo)
            process(response.data.photo)
        })
        .catch(function (err) {
            console.log('FAILURE!!');
            console.log(err)
        });
}

export function processPhotoLink(link) {
    link.addEventListener('click', e => {
        e.preventDefault()
        e.stopPropagation()

        profileProcessPhoto(link.href)
    })
}

export function processPhoto() {
    let background = document.querySelector('#photo-display .background')
    let escapeButton = document.querySelector('#photo-display .remove-button')
    background.onclick = e => {
        setProfileSection(window.ProfileSectionEnum.Main)
    }

    escapeButton.onclick = e => {
        setProfileSection(window.ProfileSectionEnum.Main)
    }
}