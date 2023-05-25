import { resetSearch, processSearch } from "./search/search.js"
import { processProfile } from "./profile.js";
import { processNewsfeed } from "./newsfeed.js";

window.SectionEnum = {
    'Profile': 'profile',
    'Search': 'search',
    'Newsfeed': 'newsfeed',
}

const sectionMainMap = {
    'profile': document.querySelector('#section-profile'),
    'search': document.querySelector('#section-search'),
    'newsfeed': document.querySelector('#section-newsfeed'),
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

// INITIALIZATION
switch (window.mode) {
    case window.SectionEnum.Search:
        setMainSection(window.SectionEnum.Search)
        mainProcessSearch(window.searchDataUrl)
        break;
    case window.SectionEnum.Profile:
        setMainSection(window.SectionEnum.Profile)
        mainProcessProfile(window.secondUserProfileUrl, window.secondUserMainUrl)
        break;
    case window.SectionEnum.Newsfeed:
        setMainSection(window.SectionEnum.Newsfeed)
        mainProcessNewsfeed(window.newsfeedDataUrl, window.newsfeedUrl)
        break;
    default:
        console.log(`Sorry, something wrong happened.`);
}

import { processNewsfeedLink } from './newsfeed.js'
const newsfeedLink = document.querySelector('.navbar-brand')
processNewsfeedLink(newsfeedLink)



export function mainProcessSearch(searchDataUrl, searchUrlWithQuery = window.location.href, title = 'Facebook - Search') {
    console.log("***")
    console.log("START SEARCHING!!")
    console.log("***")
    setMainSection(window.SectionEnum.Search)
    processSearch(searchDataUrl)
    document.title = title
    window.history.pushState({ 'searchUrl': searchDataUrl, 'section': window.SectionEnum.Search, 'title': title }, "", searchUrlWithQuery);
}

export function mainProcessProfile(profileUrl, mainUrl, title = 'Facebook - profile') {
    console.log("***")
    console.log("START PROFILE!!")
    console.log("***")

    setMainSection()
    processProfile(profileUrl)
    document.title = title
    window.history.pushState({ 'profile_url': profileUrl, 'section': window.SectionEnum.Profile, 'title': title }, "", mainUrl);
}

export function mainProcessNewsfeed(newsfeedDataUrl, newsfeedUrl, title = 'Facebook - Home') {
    console.log("***")
    console.log("START NEWSFEED!!")
    console.log("***")

    setMainSection(window.SectionEnum.Newsfeed)
    processNewsfeed(newsfeedDataUrl)
    document.title = title
    window.history.pushState({ 'newsfeedDataUrl': newsfeedDataUrl, 'section': window.SectionEnum.Newsfeed, 'title': title }, "", newsfeedUrl);
}



// HISTORY
window.onpopstate = function (e) {
    if (e.state) {
        console.log(e.state)
        switch (e.state.section) {
            case window.SectionEnum.Profile:
                resetSearch()
                setMainSection(window.SectionEnum.Profile)
                processProfile(e.state.profile_url);
                break;
            case window.SectionEnum.Search:
                setMainSection(window.SectionEnum.Search)
                processSearch(e.state.searchUrl);
                break;
            case window.SectionEnum.Newsfeed:
                setMainSection(window.SectionEnum.Newsfeed)
                processSearch(e.state.newsfeedDataUrl);
                break;
            default:
                console.log('Invalid popstate state')
        }

        document.title = e.state.title;

    } else {
        console.log("GO BACK!!")
    }
};