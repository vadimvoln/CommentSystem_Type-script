class Comments extends CommentSystem { // class for creating a comment block
    private commentID: number  // block comment number

    private replyes: Replyes
    private rating: Rating
    public favorites: Favorites
    private filter: Filter

    constructor(userForm: UserForm) {
        super()
        this.commentID = super.getNumberComments() 

        this.rating = new Rating()
        this.favorites = new Favorites()
        this.replyes = new Replyes(userForm, this.rating, this.favorites)
        this.filter = new Filter(this)

        this.updateComments()

        const sendListener = (event: Event): void => { // event listener for submit button
            if(userForm.sendBtn && !(userForm.sendBtn.classList.contains('--disable')) && userForm.sendBtn.dataset.mode === "comment") 
                {
                    const commentText = userForm.getTextTextarea()
                    this.createCommentBlock(commentText)
                    userForm.clearTextarea()
                }
            else if (userForm.sendBtn && !(userForm.sendBtn.classList.contains('--disable')) && userForm.sendBtn.dataset.mode === "reply") 
                {
                    const replyText = userForm.getTextTextarea()
                    this.replyes.createReplyes(replyText)
                    userForm.clearTextarea()
                    userForm.sendBtn.dataset.mode = "comment"
                    this.userForm.changeBtn("Отправить")
                    this.userForm.changeTextarea("Введите текст сообщения...")
                }
        }
        if(userForm.sendBtn) userForm.sendBtn.addEventListener("click", sendListener, false);    
    }

    protected createCommentBlock(commentsText: string) {       
        const nickName = super.getUserNickname()
        const ava = super.getUserAva()
        const currentDate = super.getCurrentDate() 
        const commetsText = commentsText

        const newCommentBlock = {
            commentID: this.commentID,
            comment: {
                commentNickname: nickName,
                commentAvaPath: ava,
                commentTime: currentDate,
                commentText: commetsText
            },
            replyes: {},
            rating: 0
        }
        super.addHistoryComments(newCommentBlock)        
             
        const commentHTMLTemplate = this.getTemplateComment(this.commentID, nickName, ava, commetsText, currentDate.displayDate)
        this.renderComment(commentHTMLTemplate)
        
        this.replyes.addListenerReplyBtn(this.commentID)
        this.rating.addListenerCommentsRatingBtns(this.commentID)
        this.favorites.addListenerCommentsFavoritesBtns(this.commentID)
        this.filter.currentFilter()
        
        this.commentID++
       
        super.updateNumberComments()
    }

    private renderComment(html: string) {
        const comments: HTMLElement | null = document.querySelector('.commentSystem__comments')
        if(comments) {
            comments.insertAdjacentHTML("afterbegin" , html)
        }
    }

    public hiddenComments(bool: boolean) { // comment hiding method
        const comments: NodeListOf<Element> = document.querySelectorAll('.commentSystem__commentBlock')
            comments.forEach((item: any) => {
                if(bool) {
                    item.style.display = "none"
                } else {
                    item.style.display = "block"
                }
            }) 
    }

    public updateComments() { // comment update method
        const comments: HTMLElement | null = document.querySelector('.commentSystem__comments')
        if(comments) {
            const commentBlocks: NodeListOf<Element> | null = comments.querySelectorAll('.commentSystem__commentBlock')
            commentBlocks.forEach(item => comments.removeChild(item))
        }

        const currentData = super.getDATA()
        
        let htmlTemplateComment: string;
        currentData.history.forEach((item:any) => {
            
                htmlTemplateComment = this.getTemplateComment(
                    item.commentID,
                    item.comment.commentNickname,
                    item.comment.commentAvaPath,
                    item.comment.commentText,
                    item.comment.commentTime.displayDate
                )
                
                this.renderComment(htmlTemplateComment)
                this.replyes.updateReply(item)
                
                this.replyes.addListenerReplyBtn(item.commentID)
                this.rating.addListenerCommentsRatingBtns(item.commentID)
                this.favorites.addListenerCommentsFavoritesBtns(item.commentID)
                
        })
        
        super.updateNumberComments()
    }

    private getTemplateComment(commentID:number, userNickname: string | undefined, userAva: string | undefined | null, commentsTxt:string, date: string)       { 
        return `
        <div class="commentSystem__commentBlock" data-commentid=${commentID}>
            <div class="commentBlock__comment">
                <div class="commentBlock__ava">
                    <img  src="${userAva}" alt="avatar">
                </div>
                <div class="commentBlock__content">
                    <div class="commentBlock__title">
                        <h3 class="commentBlock__nickname">${userNickname}</h3>
                        <time class="commentBlock__time">${date}</time>
                    </div>
                    <p class="commentBlock__text">
                        ${commentsTxt}
                    </p>
                    <div class="commentBlock__btnBlock">
                        <button class="commentBlock__btnReply">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.55556 7.8V3L1 11.4L9.55556 19.8V14.88C15.6667 14.88 19.9444 16.8 23 21C21.7778 15 18.1111 9 9.55556 7.8Z" fill="black" fill-opacity="0.4"/>
                            </svg>
                            Ответить</button>
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
            </div>
        </div>
        `
    }  
}  