import { processCoverPhoto, processProfilePicture } from "./profile/images.js"
import { processPostTasks } from "./profile/posts.js";
import { processFriending } from "./profile/friending.js"



console.log(window.CSRF_TOKEN)
console.log(friendingState)
processFriending();
processPostTasks();
processCoverPhoto();
processProfilePicture();