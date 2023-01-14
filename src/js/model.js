import { async } from "regenerator-runtime"
import { API_URL, KEY } from "./config"
import { getJSON, sendJSON } from "./helper"
export const state = {
    recipe: {},
    search: {
        query: "",
        results: [],
        resultsPerPage: 10,
        currentPage: 1
    },
    bookmarks: []

}
const createRecipeObject = function (data) {
    const { recipe } = data.data
    return {
        id: recipe.id,
        title: recipe.title,
        image: recipe.image_url,
        ingredients: recipe.ingredients,
        coockingTime: recipe.cooking_time,
        sourceUrl: recipe.source_url,
        serving: recipe.servings,
        publisher: recipe.publisher,
        ...(recipe.key && { key: recipe.key })
    }
}

export const loadRecipe = async function (id) {
    try {
        const data = await getJSON(`${API_URL}${id}?key=${KEY}`)
        state.recipe = createRecipeObject(data)
        if (state.bookmarks.some(bookmark => bookmark.id === id)) {
            state.recipe.bookmarked = true
        } else {
            state.recipe.bookmarked = false
        }

    } catch (err) {
        console.error(err)
        throw err
    }
}

export const loadSearchResults = async function (query) {
    try {
        state.search.query = query
        const data = await getJSON(`${API_URL}?search=${query}&key=${KEY}`)
        state.search.results = data.data.recipes.map(el => {
            return {
                id: el.id,
                image: el.image_url,
                publisher: el.publisher,
                title: el.title,
                ...(el.key && { key: el.key })
            }
        })
        state.search.currentPage = 1
    } catch (err) {
        console.error(err)
        throw err
    }
}

export const pagesOnPage = function (page = state.search.currentPage) {
    state.search.currentPage = page
    const start = (page - 1) * state.search.resultsPerPage
    const end = page * state.search.resultsPerPage
    return state.search.results.slice(start, end)
}

export const updateServings = function (numberOfServings) {
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = ing.quantity * numberOfServings / state.recipe.serving
    });

    state.recipe.serving = numberOfServings
}

const saveBookmarks = function () {
    localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks))
}
export const addBookmark = function (recipe) {
    // Add recipe to bookmark   
    state.bookmarks.push(recipe)

    // Mark current recipe as a bookmark

    state.recipe.bookmarked = true

    saveBookmarks()

}

export const removeBookmark = function (id) {
    // Delete bookmark
    const index = state.bookmarks.findIndex(el => el.id === id)
    state.bookmarks.splice(index, 1)
    // Mark current recipe as a NOT bookmark

    state.recipe.bookmarked = false
    saveBookmarks()
}
const restoreBookmark = function () {
    const localData = localStorage.getItem("bookmarks")
    if (localData) state.bookmarks = JSON.parse(localData)
}

restoreBookmark()

const clearBookmarks = function () {
    localStorage.clear("bookmarks")
}
// clearBookmarks()

export const uploadRecipe = async function (newRecipe) {
    try {
        const ingredients = Object.entries(newRecipe)
            .filter(entry => entry[0].startsWith("ingredient") && entry[1] !== "")
            .map(ing => {
                const ingArr = ing[1].split(",").map(el => el.trim())
                // const ingArr = ing[1].replaceAll(" ", "").split(",")
                if (ingArr.length !== 3) throw new Error("Wrong ingredient. Use correct format!!!")
                const [quantity, unit, description] = ingArr
                return { quantity: quantity ? +quantity : null, unit, description }
            });

        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            servings: +newRecipe.servings,
            cooking_time: +newRecipe.cookingTime,
            ingredients,
        }
        const data = await sendJSON(`${API_URL}?key=${KEY}`, recipe)
        state.recipe = createRecipeObject(data)
        addBookmark(state.recipe)
    } catch (err) {
        throw err
    }


}