import { processProfile } from "./profile.js";

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

setMainSection()
processProfile()