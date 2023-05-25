import { processPostLoading } from './profile/posts.js'
import { mainProcessNewsfeed } from './main.js'

export function processNewsfeed(newsfeedDataUrl) {
    processPostLoading(window.SectionEnum.Newsfeed, newsfeedDataUrl, '')
}

export function processNewsfeedLink(link) {
    link.onclick = e => {
        e.preventDefault()
        e.stopPropagation()
        mainProcessNewsfeed(link.href, window.newsfeedUrl)
    }
}