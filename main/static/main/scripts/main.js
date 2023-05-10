import { processProfile } from "./profile.js";

window.SectionEnum = {
    'Profile': 'profile',
    'Search': 'search',
}

const sectionMainMap = {
    'profile': document.querySelector('#section-profile'),
    'search': document.querySelector('#section-search')
};

function setMainSection(sectionName = 'profile') {
    if (!(sectionName in sectionMainMap)) {
        console.log("ERROR!! INVALID SECTION NAME!!")
    }
    for (const [name, section] of Object.entries(sectionMainMap)) {
        if (name == sectionName) {
            section.style.display = 'block'
        } else {
            section.style.display = 'none'
        }
    }
}

function mainProcessProfile(profileUrl, title, mainUrl) {
    setMainSection()
    processProfile(profileUrl)
    document.title = title
    window.history.pushState({ 'profile_url': profileUrl, 'section': 'profile', 'title': title }, "", mainUrl);
}


mainProcessProfile(window.secondUserMainUrl + '/profile', 'Facebook - profile', window.secondUserMainUrl)

export function processProfileLink(link, procesProfile = processProfile) {
    link.addEventListener('click', e => {
        e.preventDefault()
        e.stopPropagation()
        mainProcessProfile(`${link.href}/profile`, 'Facebook - profile', link.href)
    })
}

window.onpopstate = function (e) {
    // console.log(e)
    if (e.state) {
        console.log("HAS STATE!!")
        console.log(e.state)
        if (e.state.section == window.SectionEnum.Profile) {
            processProfile(e.state.profile_url);
            document.title = e.state.title;
        }
    } else {
        console.log("GO BACK!!")
        // window.history.back()
    }
};