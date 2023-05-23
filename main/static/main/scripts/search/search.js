import { showUsers } from './../components/showUsers.js'
import { mainProcessSearch } from './../main.js'

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
    mainProcessSearch(`${searchForm.action}?q=${searchInput.value}`, `${window.searchUrl}?q=${searchInput.value}`)
}

export function resetSearch() {
    searchForm.style.display = 'none'
    searchLabel.style.borderRadius = '50%';
}

export function processSearch(searchUrl) {
    axios.get(searchUrl, {
        params: {}
    })
        .then(function (response) {
            if (response.data.error) {
                console.log('ERROR!')
                console.log(response.data.error)
                return
            }
            console.log('Search - SUCCESS!!');
            console.log(searchUrl);
            console.log(response.data.user_list)
            showUsers(response.data.user_list, 'user-search', '#search-result .results')
            // return response.data.user_list
        })
        .catch(function (err) {
            console.log('FAILURE!!');
            console.log(err)
        });
}