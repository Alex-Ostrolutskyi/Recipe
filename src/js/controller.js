import * as model from './model.js'
import recipeView from './views/recipeView.js'
import searchView from './views/searchView.js'
import resultsView from './views/resultsView.js'
import paginationView from './views/paginationView.js'
import bookmarksView from './views/bookmarksView.js'
import addRecipeView from './views/addRecipeView.js'
import "core-js/stable"
import "regenerator-runtime/runtime"
import { async } from 'regenerator-runtime';

// if (module.hot) {
//   module.hot.accept()
// }
const recipeContainer = document.querySelector('.recipe');


const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1)
    if (!id) return
    recipeView.loadSpiner()
    // Update results view to mark selected search result
    resultsView.updateData(model.pagesOnPage())
    bookmarksView.updateData(model.state.bookmarks)
    // Load recipe
    await model.loadRecipe(id)
    // Rendering data
    recipeView.render(model.state.recipe)
  } catch (err) {
    console.error(err)
    recipeView.renderError()
  }
}

const constrolSearchResult = async function () {
  try {
    resultsView.loadSpiner()
    // Get search query
    const query = searchView.getQuery()
    if (!query) return

    // load search
    await model.loadSearchResults(query)

    // render results
    resultsView.render(model.pagesOnPage())

    // render pagination buttons
    paginationView.render(model.state.search)
  } catch (err) {
    console.error(err)
    recipeView.renderError()
  }
}
const controlPagination = function (goToPage) {
  resultsView.render(model.pagesOnPage(goToPage))
  paginationView.render(model.state.search)
  console.log(goToPage)
}

const controlServings = function (newServings) {
  // Update recipe servings
  model.updateServings(newServings)
  // Render recipe with new servings

  recipeView.updateData(model.state.recipe)

}

const controlAddBookmark = function () {
  // Add or remove bookmark
  model.state.recipe.bookmarked === false ? model.addBookmark(model.state.recipe) : model.removeBookmark(model.state.recipe)
  // Update recipe View
  recipeView.updateData(model.state.recipe)
  // Render bookmarks
  bookmarksView.render(model.state.bookmarks)
}

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks)
}

const controlNewRecipe = async function (newRecipe) {
  try {
    // Rended spiner
    addRecipeView.loadSpiner()

    // Upload new recipe data
    await model.uploadRecipe(newRecipe)
    console.log(model.state.recipe)

    // Render new recipe
    recipeView.render(model.state.recipe)

    // Display succsess message
    addRecipeView.renderMessage()

    // Render bookmark
    bookmarksView.render(model.state.bookmarks)

    // Change id into URL
    window.history.pushState(null, "", `#${model.state.recipe.id}`)

    // Close window form
    setTimeout(function () {
      addRecipeView.toggleWindow()
    }, 2500)
  } catch (err) {
    console.error(err)
    addRecipeView.renderError(err.message)
  }
}

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks)
  recipeView.addHandlerRender(controlRecipe)
  recipeView.addHandlerUpdateServings(controlServings)
  recipeView.addBookmarkHandler(controlAddBookmark)
  searchView.addHandlerSearch(constrolSearchResult)
  paginationView.addHandlerClick(controlPagination)
  addRecipeView.addHandlerUpload(controlNewRecipe)
}
init()