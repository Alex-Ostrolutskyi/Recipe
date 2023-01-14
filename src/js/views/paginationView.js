import View from "./View"
import icons from 'url:../../img/icons.svg'
class PaginationView extends View {
    _parentEl = document.querySelector(".pagination")

    addHandlerClick(handler) {
        this._parentEl.addEventListener("click", function (e) {
            const btn = e.target.closest(".btn--inline")
            if (!btn) return
            const goTo = +btn.dataset.goto
            handler(goTo)
        })
    }

    _generateMarkup() {
        console.log(this._data)
        const curPage = this._data.currentPage
        const nextBtn = `
        <button data-goto ="${curPage + 1}" class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
        </button>
        `
        const prevBtn = `
            <button data-goto ="${curPage - 1}" class="btn--inline pagination__btn--prev">
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                    <span>Page ${curPage - 1}</span>
            </button>
        `
        const numPages = Math.round(this._data.results.length / this._data.resultsPerPage)
        // Page 1 and there are other pages
        if (curPage === 1 && numPages > 1) {
            return nextBtn
        }
        // Last page
        if (curPage === numPages && numPages > 1) {
            return prevBtn
        }
        // Other pages
        if (curPage < numPages) {
            return prevBtn + nextBtn
        }
        // Page 1 and no other pages
        return ""
    }
}
export default new PaginationView()