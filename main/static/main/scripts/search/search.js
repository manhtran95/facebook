import { showUsers } from './../components/showUsers.js'

export function resetSearch() {
    let searchForm = document.querySelector('#search-bar form')
    searchForm.style.display = 'none'
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
            console.log(response.data.user_list)
            showUsers(response.data.user_list, 'user-search', '#search-result .results')
            // process(response.data.user_list)
            // return response.data.user_list
        })
        .catch(function (err) {
            console.log('FAILURE!!');
            console.log(err)
        });
}

processSearch('http://127.0.0.1:8000/users/search?q=D')