"use strict";
class Filter extends CommentSystem {
    constructor(commentsObj) {
        super();
        this.itemListener = (event) => {
            if (this.filterSelected !== null) {
                this.filterSelected.innerHTML = event.target.innerHTML;
                switch (event.target.innerHTML) {
                    case 'По количеству ответов':
                        this.replyNumberFilter();
                        break;
                    case 'По количеству оценок':
                        this.ratingFilter();
                        break;
                    case 'По дате размещения':
                        this.dateFilter();
                        break;
                }
            }
            if (this.filterItems !== null)
                this.filterItems.forEach(item => {
                    const svg = item.querySelector('svg');
                    if (svg !== null)
                        svg.style.display = 'none';
                });
            if (this.filterList !== null)
                this.filterList.style.display = 'none';
        };
        this.comments = commentsObj;
        this.commentSystemFilter = document.querySelector('.commentSystem__filter');
        this.filterDropdown = this.commentSystemFilter !== null ? this.commentSystemFilter.querySelector('.filter__dropdown') : null;
        this.filterSelected = this.filterDropdown !== null ? this.filterDropdown.querySelector('.filter__selected') : null;
        this.filterList = this.filterDropdown !== null ? this.filterDropdown.querySelector('.filter__list') : null;
        this.filterItems = this.filterDropdown !== null ? this.filterDropdown.querySelectorAll('.filter__item') : null;
        this.filterFavorites = this.commentSystemFilter !== null ? this.commentSystemFilter.querySelector('.filter__favorites') : null;
        this.filterDirectionListener();
        this.dropdown();
        this.favoritesCommentFilter();
    }
    currentFilter() {
        if (this.filterSelected) {
            switch (this.filterSelected.innerHTML) {
                case 'По дате размещения':
                    this.dateFilter();
                    break;
                case 'По количеству оценок':
                    this.ratingFilter();
                    break;
                case 'По количеству ответов':
                    this.replyNumberFilter();
                    break;
            }
        }
    }
    filterDirectionListener() {
        const filterDirectionBtn = this.filterDropdown !== null ? this.filterDropdown.querySelector('.filter__direction') : null;
        if (filterDirectionBtn)
            filterDirectionBtn.addEventListener('click', () => {
                if (filterDirectionBtn.style.rotate === '0deg') {
                    filterDirectionBtn.style.rotate = '180deg';
                }
                else {
                    filterDirectionBtn.style.rotate = '0deg';
                }
                this.currentFilter();
            });
    }
    filterDirection() {
        const filterDirectionBtn = this.filterDropdown !== null ? this.filterDropdown.querySelector('.filter__direction') : null;
        if (filterDirectionBtn) {
            if (filterDirectionBtn.style.rotate === '0deg') {
                return -1;
            }
            else {
                return 1;
            }
        }
    }
    favoritesCommentFilter() {
        const listener = (event) => {
            event.target.classList.toggle('filter__favorites_active');
            if (event.target.classList.contains('filter__favorites_active')) {
                super.userBlockHidden(true);
                this.comments.hiddenComments(true);
                this.comments.favorites.renderFavoriteComments();
            }
            else {
                super.userBlockHidden(false);
                this.comments.hiddenComments(false);
                this.comments.favorites.cleanFavoriteComments();
            }
        };
        if (this.filterFavorites)
            this.filterFavorites.addEventListener('click', listener);
    }
    dropdown() {
        if (this.filterDropdown) {
            if (this.filterSelected !== null)
                this.filterSelected.addEventListener('click', () => {
                    if (this.filterList !== null) {
                        if (this.filterList.style.display === 'block') {
                            this.filterList.style.display = 'none';
                        }
                        else {
                            this.filterList.style.display = 'block';
                        }
                    }
                    if (this.filterItems !== null)
                        this.filterItems.forEach((item) => this.chooseItem(item));
                });
        }
    }
    chooseItem(item) {
        const span = item.querySelector('span');
        const svg = item.querySelector('svg');
        if (span && this.filterSelected && span.innerHTML === this.filterSelected.innerHTML) {
            if (svg !== null)
                svg.style.display = 'block';
        }
        item.removeEventListener('click', this.itemListener);
        item.addEventListener('click', this.itemListener);
    }
    /*+++++++++++++++++++++++++++ Filters ++++++++++++++++++++*/
    dateFilter() {
        const data = super.getDATA();
        const array = data.history;
        const direction = this.filterDirection();
        const newArr = array.sort((commentBlock_1, commentBlock_2) => {
            const a = new Date(commentBlock_1.comment.commentTime.fullDate).getTime();
            const b = new Date(commentBlock_2.comment.commentTime.fullDate).getTime();
            if (direction > 0)
                return a - b;
            if (direction < 0)
                return b - a;
        });
        data.history = newArr;
        localStorage.setItem('DATA', JSON.stringify(data));
        this.comments.updateComments();
    }
    replyNumberFilter() {
        const data = super.getDATA();
        const array = data.history;
        const direction = this.filterDirection();
        const newArr = array.sort((commentBlock_1, commentBlock_2) => {
            const a = Object.keys(commentBlock_1.replyes).length;
            const b = Object.keys(commentBlock_2.replyes).length;
            if (direction > 0)
                return a - b;
            if (direction < 0)
                return b - a;
        });
        data.history = newArr;
        localStorage.setItem('DATA', JSON.stringify(data));
        this.comments.updateComments();
    }
    ratingFilter() {
        const data = super.getDATA();
        const array = data.history;
        const direction = this.filterDirection();
        const newArr = array.sort((commentBlock_1, commentBlock_2) => {
            const a = commentBlock_1.rating;
            const b = commentBlock_2.rating;
            if (direction > 0)
                return a - b;
            if (direction < 0)
                return b - a;
        });
        data.history = newArr;
        localStorage.setItem('DATA', JSON.stringify(data));
        this.comments.updateComments();
    }
}
