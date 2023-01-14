import PreviewView from "./previewView.js"
class BookmarksView extends PreviewView {
    _parentEl = document.querySelector(".bookmarks__list")
    _errorMessage = "No bookmarks yet 😢😢😢."

    addHandlerRender(data) {
        window.addEventListener("load", data)
    }
}


export default new BookmarksView()