import { processProfile } from "./profile.js";
import { resetSearch, processSearch } from "./search/search.js"

window.SectionEnum = {
    'Profile': 'profile',
    'Search': 'search',
}

const sectionMainMap = {
    'profile': document.querySelector('#section-profile'),
    'search': document.querySelector('#section-search'),
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

switch (window.mode) {
    case window.SectionEnum.Search:
        setMainSection('search')
        mainProcessSearch(window.search_data_url)
        break;
    case window.SectionEnum.Profile:
        setMainSection('profile')
        mainProcessProfile(window.secondUserMainUrl + '/profile', window.secondUserMainUrl)
        break;
    default:
        console.log(`Sorry, something wrong happened.`);
}



export function mainProcessSearch(searchDataUrl, searchUrlWithQuery = window.location.href, title = 'Facebook - Search') {
    console.log("***")
    console.log("START SEARCHING!!")
    console.log("***")
    setMainSection(window.SectionEnum.Search)
    processSearch(searchDataUrl)
    document.title = title
    window.history.pushState({ 'search_url': searchDataUrl, 'section': window.SectionEnum.Search, 'title': title }, "", searchUrlWithQuery);
    console.log(window.history)
}

function mainProcessProfile(profileUrl, mainUrl, title = 'Facebook - profile') {
    console.log("***")
    console.log("START PROFILE!!")
    console.log("***")

    setMainSection()
    processProfile(profileUrl)
    document.title = title
    window.history.pushState({ 'profile_url': profileUrl, 'section': window.SectionEnum.Profile, 'title': title }, "", mainUrl);
    console.log(window.history)
}



export function processProfileLink(link, procesProfile = processProfile) {
    link.addEventListener('click', e => {
        e.preventDefault()
        e.stopPropagation()
        mainProcessProfile(`${link.href}/profile`, link.href)
    })
}

window.onpopstate = function (e) {
    if (e.state) {
        console.log(e.state)
        if (e.state.section == window.SectionEnum.Profile) {
            console.log("***")
            console.log("BACK TO PROFILE!!")
            console.log("***")
            resetSearch()
            setMainSection(window.SectionEnum.Profile)
            processProfile(e.state.profile_url);
            document.title = e.state.title;
        } else if (e.state.section == window.SectionEnum.Search) {
            console.log("***")
            console.log("BACK TO SEARCH!!")
            console.log("***")
            setMainSection(window.SectionEnum.Search)
            processSearch(e.state.search_url);
            document.title = e.state.title;
        }
    } else {
        console.log("GO BACK!!")
    }
};