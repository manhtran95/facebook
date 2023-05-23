import { processPostLoading } from './profile/posts.js'
import { mainProcessNewsfeed } from './main.js'

export function processNewsfeed(newsfeedDataUrl) {
    processPostLoading(window.PostsSectionEnum.Newsfeed, newsfeedDataUrl, '')
}

export function processNewsfeedLink(link) {

}