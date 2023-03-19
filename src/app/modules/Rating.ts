class Rating extends CommentSystem { // class for rating system

    public addListenerCommentsRatingBtns(commentID: number) {
        const commentBlockEl: HTMLElement | null = document.querySelector(`[data-commentid="${commentID}"]`)
        if(commentBlockEl) {
            const ratingBtnBlock: HTMLElement | null = commentBlockEl.querySelector('.btnBlock__rating')
            if(ratingBtnBlock) this.listenerBtnBlock(ratingBtnBlock, commentID)
        }
    }

    public addListenerReplyRatingBtns(commentID: number, replyID: number) {
        const commentBlockEl: HTMLElement | null = document.querySelector(`[data-commentid="${commentID}"]`)
        if(commentBlockEl) {
            const replyEl: HTMLElement | null = commentBlockEl.querySelector(`[data-replyid="${replyID}"]`)
            if(replyEl) {
                const ratingBtnBlock: HTMLElement | null = replyEl.querySelector('.btnBlock__rating')
                if(ratingBtnBlock) this.listenerBtnBlock(ratingBtnBlock, commentID, replyID)
            }
        }
    }

    private listenerBtnBlock(ratingBlock: HTMLElement | null, commentID: number, replyID?: number) {
        const currentData = super.getDATA()
        
        
        if(ratingBlock) {
            const plusBtn: HTMLElement | null = ratingBlock.querySelector('.plus')
            const minusBtn: HTMLElement | null = ratingBlock.querySelector('.minus')
            const counter: HTMLElement | null = ratingBlock.querySelector('.likeCounter')
            
            if(counter) {
                let curCounter: number = 0
                if(replyID === undefined) {
                    currentData.history.forEach((commentBlock: any) => {
                        if(+commentBlock.commentID === commentID) {
                            curCounter = commentBlock.rating === undefined ? 0 : +commentBlock.rating
                        }
                        counter.innerHTML = String(curCounter)
                        this.changeStyleCounter(counter, curCounter)
                    })
                } else {
                    currentData.history.forEach((commentBlock: any) => {
                        if(+commentBlock.commentID === commentID) {
                            curCounter = commentBlock.replyes[`reply_${replyID}`].rating === undefined 
                            ? 0 
                            : +commentBlock.replyes[`reply_${replyID}`].rating
                        }
                        counter.innerHTML = String(curCounter)
                        this.changeStyleCounter(counter, curCounter)
                    })
                }
                
                let newCounter: number = curCounter
                const plusListener = () => {
                    if(plusBtn && minusBtn) {    
                        if(!(plusBtn.classList.contains('plus_disable'))) {
                            newCounter++

                            if(newCounter !== curCounter) {
                                plusBtn.classList.add('plus_disable')
                            }
                            minusBtn.classList.remove('minus_disable')

                            counter.innerHTML = String(newCounter)
                            this.updateCounterHistory(newCounter, commentID, replyID)
                            this.changeStyleCounter(counter, newCounter)
                        } 
                    }                   
                }

                const minusListener = () => {
                    if(plusBtn && minusBtn) {
                        if(!(minusBtn.classList.contains('minus_disable'))) {
                            newCounter--

                            if(newCounter !== curCounter) {
                                minusBtn.classList.add('minus_disable')
                            }
                            plusBtn.classList.remove('plus_disable')
                    
                            counter.innerHTML = String(newCounter)
                            this.updateCounterHistory(newCounter, commentID, replyID)
                            this.changeStyleCounter(counter, newCounter)
                        }
                    }                  
                }

                if(plusBtn) plusBtn.addEventListener('click', plusListener)
                if(minusBtn) minusBtn.addEventListener('click', minusListener)
            }         
        }
    }

    private updateCounterHistory(curCounter: number, commentID: number, replyID?: number) {
        const currentData = super.getDATA()
        
        if(replyID === undefined) {
            let newCommentBlock: any         
            currentData.history.forEach((commentBlock: any) => {
                if(+commentBlock.commentID === commentID) {
                    commentBlock.rating = curCounter
                    newCommentBlock = commentBlock 
                }
            })
            currentData.history.forEach((commentBlock: any, index: number) => {
                if(+commentBlock.commentID === commentID) {
                    currentData.history[index] = newCommentBlock
                }
            })
            localStorage.setItem('DATA', JSON.stringify(currentData))
        } else {
            currentData.history.forEach((commentBlock: any) => {
                if(+commentBlock.commentID === commentID) {
                    commentBlock.replyes[`reply_${replyID}`].rating = curCounter
                    super.updateHistoryReply(commentID, replyID, commentBlock.replyes[`reply_${replyID}`])
                }
            })
        }
    }

    private changeStyleCounter(counterElement: HTMLElement, counterNumber: number) {
        if(counterNumber > 0) {
            counterElement.style.color = '#8AC540'
        } else if (counterNumber < 0) {
            counterElement.style.color = '#FF0000'
            counterElement.innerHTML = String(+counterElement.innerHTML * -1)
        } else {
            counterElement.style.color = '#000000'
        }
    }
}