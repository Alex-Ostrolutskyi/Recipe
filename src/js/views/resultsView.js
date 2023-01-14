import PreviewView from "./previewView.js"
class ResultsView extends PreviewView {
    _parentEl = document.querySelector(".results")
    _errorMessage = "No recipies for your request 😢😢😢. Please try another one!"
}

export default new ResultsView()