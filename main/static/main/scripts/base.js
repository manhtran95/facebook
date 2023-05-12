import { mainProcessSearch } from './main.js'

let searchLabel = document.querySelector('#search-bar label')
let searchForm = document.querySelector('#search-bar form')
let searchInput = document.querySelector('#search-bar input')

searchInput.onclick = e => {
    searchForm.style.display = 'flex';
    searchInput.focus()
    console.log("haha")
    searchLabel.style.borderTopRightRadius = '0px';
    searchLabel.style.borderBottomRightRadius = '0px';
}

searchInput.onblur = e => {
    if (searchInput.value == '') {
        console.log("bye")
        searchLabel.style.borderRadius = '50%';
        searchForm.style.display = 'none';
    }
}

searchForm.onsubmit = e => {
    e.preventDefault()
    e.stopPropagation()
    mainProcessSearch(`${searchForm.action}?q=${searchInput.value}`)
}