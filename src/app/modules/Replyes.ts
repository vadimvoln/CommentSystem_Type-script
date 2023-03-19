class Replyes extends CommentSystem { // class for replyes
    private commentID: number | undefined
    private preNickname: string | undefined
    private replyID: number

    private rating: Rating
    private favorites: Favorites

    constructor(userForm: UserForm, rating: Rating, favorites: Favorites) {
        super()
        this.userForm = userForm
        this.rating = rating
        this.favorites = favorites

        this.commentID = 0 
        this.preNickname = "" 
        this.replyID = 0
    }

    
    public addListenerReplyBtn(commentID: number) { // creates an event on the "reply" button in each "comment block". Called when a comment is created or when the list of comments is updated.
        const commentBlock: HTMLElement | null = document.querySelector(`[data-commentid="${commentID}"]`) // получение конкретного "комент блока"
        
        if(commentBlock) {
            const replyBtn = commentBlock.querySelector('.commentBlock__btnReply')
            const btnReplyListener = (event: Event) => {
                if (event.target === replyBtn) {
                    this.commentID = commentID

                    this.userForm.changeBtn("Ответить")
                    this.userForm.changeTextarea("Введите ваш ответ пользователю")
                    this.userForm.focusTextarea()
                    if(this.userForm.sendBtn) this.userForm.sendBtn.dataset.mode = 'reply' 
                    if(commentBlock.dataset.commentid) this.commentID = +commentBlock.dataset.commentid
                    this.preNickname = commentBlock.querySelector('.commentBlock__nickname')?.innerHTML
                    super.getDATA().history.forEach((commentBlock: any) => {
                        if(+commentBlock.commentID === commentID) {
                            this.replyID = Object.keys(commentBlock.replyes).length
                        }
                    })
                    
                } else {
                    this.userForm.changeBtn("Отправить")
                    this.userForm.changeTextarea("Введите текст сообщения...")
                    if(this.userForm.sendBtn) this.userForm.sendBtn.dataset.mode = 'comment'
                }
            }
            if(commentBlock) commentBlock.addEventListener('click', btnReplyListener)
        }
    }

    public createReplyes(replyText:string) { // method for creating a reply block 
        const commentID = this.commentID
        const nickName = super.getUserNickname()
        const preNickname = this.preNickname
        const ava = super.getUserAva()
        const currentDate = super.getCurrentDate()
        const replyTxt =  replyText

        const newReply = { 
            commentID: this.commentID,
            replyID: this.replyID,
            nickname: nickName,
            preNickname: preNickname,
            ava: ava,
            date: currentDate,
            replyText: replyTxt
        }
        super.updateHistoryReply(commentID, this.replyID, newReply)
        

        const replyHTMLTemplate = this.getTemplateReply(this.replyID, nickName, preNickname, ava, replyTxt, currentDate.displayDate)
        
        this.renderReply(commentID, replyHTMLTemplate)
        if(commentID !== undefined) {
            this.rating.addListenerReplyRatingBtns(commentID, this.replyID)
            this.favorites.addListenerReplyFavoritesBtns(commentID, this.replyID)
        }
    }
    
    private getTemplateReply(replyID:number, userNickname: string | undefined, preNickname: string | undefined, userAva: string | undefined | null, replyTxt:string, date: string) { 
        return `
        <div class="commentBlock__reply" data-replyid=${replyID}>
            <div class="commentBlock__ava">
                <img  src="${userAva}" alt="">
            </div>
            <div class="commentBlock__content">
                <div class="commentBlock__title">
                    <h3 class="commentBlock__nickname">${userNickname}</h3>
                    <h3 class="commentBlock__prenickname">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.55556 7.8V3L1 11.4L9.55556 19.8V14.88C15.6667 14.88 19.9444 16.8 23 21C21.7778 15 18.1111 9 9.55556 7.8Z" fill="black" fill-opacity="0.4"/>
                        </svg>${preNickname}
                    </h3>
                    <time class="commentBlock__time">${date}</time>
                </div>
                <p class="commentBlock__text">
                    ${replyTxt}
                </p>
                <div class="commentBlock__btnBlock">
                    <button class="commentBlock__btnLike" data-favorite="false">
                        <svg width="19" height="17" viewBox="0 0 19 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.5 5.10061V5.10052C0.499895 4.48966 0.622268 3.88483 0.860046 3.32136C1.09783 2.75788 1.44629 2.24697 1.88521 1.81856C2.32414 1.39016 2.84473 1.05286 3.41663 0.826543C3.98854 0.60022 4.60018 0.489455 5.2158 0.50079L5.21579 0.50093L5.22764 0.500868C5.96375 0.496982 6.69219 0.648671 7.36467 0.945788C8.03715 1.2429 8.63819 1.6786 9.12807 2.22384L9.5 2.63779L9.87193 2.22384C10.3618 1.6786 10.9629 1.2429 11.6353 0.945788C12.3078 0.648671 13.0363 0.496982 13.7724 0.500868V0.501008L13.7842 0.50079C14.3998 0.489455 15.0115 0.60022 15.5834 0.826543C16.1553 1.05286 16.6759 1.39016 17.1148 1.81856C17.5537 2.24697 17.9022 2.75788 18.14 3.32136C18.3777 3.88483 18.5001 4.48966 18.5 5.10052V5.10061C18.5 7.4253 17.1052 9.52192 15.1846 11.4621C14.231 12.4255 13.1673 13.331 12.1187 14.1904C11.8187 14.4362 11.5187 14.6792 11.2229 14.9189C10.6205 15.407 10.0351 15.8812 9.50162 16.3372C8.9441 15.8563 8.33 15.3572 7.69843 14.8438C7.42938 14.6251 7.15717 14.4039 6.8848 14.1804C5.83611 13.3197 4.77208 12.4153 3.8178 11.4535C1.89607 9.5168 0.5 7.42669 0.5 5.10061Z" stroke="black" stroke-opacity="0.4"/>
                        </svg>
                        В избранное
                    </button>
                    <div class="btnBlock__rating">
                        <button class="minus">-</button>
                        <span class="likeCounter">0</span>
                        <button class="plus">+</button>
                    </div>
                </div>
            </div>
        </div>`
    }

    public updateReply(commentBlock: any) {
        let htmlTemplateReply: string;
        let replyBlock: string
        for(replyBlock in commentBlock.replyes) {
            htmlTemplateReply = this.getTemplateReply(
                commentBlock.replyes[replyBlock].replyID,
                commentBlock.replyes[replyBlock].nickname,
                commentBlock.replyes[replyBlock].preNickname,
                commentBlock.replyes[replyBlock].ava,
                commentBlock.replyes[replyBlock].replyText,
                commentBlock.replyes[replyBlock].date.displayDate,
            )
            this.renderReply(commentBlock.commentID, htmlTemplateReply)

            this.rating.addListenerReplyRatingBtns(commentBlock.commentID, commentBlock.replyes[replyBlock].replyID) 
            this.favorites.addListenerReplyFavoritesBtns(commentBlock.commentID, commentBlock.replyes[replyBlock].replyID)
        } 
    }

    private renderReply(commentID: number | undefined, html: string) { 
        const commentBlock: HTMLElement | null = document.querySelector(`[data-commentid="${commentID}"]`)
        if(commentBlock) commentBlock.insertAdjacentHTML("beforeend" , html)
    }   
}