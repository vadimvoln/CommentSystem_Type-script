class CommentSystem { // class for comment system
    private DATA: string | null
    private numberComments: number
    
    protected userForm: UserForm
    
    constructor() {

        if(!localStorage.getItem('DATA')) {  // data initialization
            this.DATA = '{"user": {}, "history": []}'
            localStorage.setItem('DATA', this.DATA)
        } else {
            this.DATA = localStorage.getItem('DATA')
        }

        this.userForm = new UserForm()

        this.numberComments = 0
    }

    protected userBlockHidden(bool: boolean) { // user block hiding method
        const userBlock: HTMLElement | null = document.querySelector('.commentSystem__userBlock')
        if(bool) {
            if(userBlock) userBlock.style.display = 'none'
        } else {
            if(userBlock) userBlock.style.display = 'flex'
        }
    }

    public createUser(nickname: string, ava: string): void {
        const userAva: HTMLElement | null = document.querySelector('.ava')
        const userNickname: HTMLElement | null = document.querySelector('.userBlock__nickname')
        if(userNickname !== null) userNickname.innerHTML = nickname
        if(userAva !== null) userAva.setAttribute('src', ava)

        const data = this.getDATA()
        
        data.user = {
            userNickName: nickname,
            userAva: ava,
            favorites: data.user.favorites === undefined || Object.keys(data.user.favorites).length === 0
            ? {} 
            : data.user.favorites
        }
        localStorage.setItem('DATA', JSON.stringify(data))

        const comment = new Comments(this.userForm)
        
    }

    protected getUserNickname() {
        const userNicknameElement: HTMLElement | null = document.querySelector('.userBlock__nickname')
        if(userNicknameElement) {
            const userNickname = userNicknameElement.innerHTML
            return userNickname
        }
    }

    protected getUserAva() {
        const userAvaElement: HTMLElement | null = document.querySelector('.ava')
        if(userAvaElement !== null) {
            const userAva = userAvaElement.getAttribute('src')
            return userAva
        }
    }
    
    protected getDATA(): any { // method for getting data from history
        const currentData: string | null = localStorage.getItem('DATA')
        if(currentData) {
            const parseData = JSON.parse(currentData)
            if(Object.keys(parseData).includes('history')) {
                return parseData
            }
        }
    }

    protected getCurrentDate(): any { // method to get current date
        const date = new Date()
    
        const fullDate = new Date(Date.UTC(date.getUTCFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
        const displayDate = `${date.getDate()}.${date.getMonth()}  ${date.getHours()}:${date.getMinutes()}`
        return {
            fullDate: fullDate,
            displayDate: displayDate
        }
    }

    protected addHistoryComments(commentBlock: object): void { // adding comment block to history
        const currentData = this.getDATA() 
        currentData.history.push(commentBlock)
        localStorage.setItem('DATA', JSON.stringify(currentData)) 
    } 
    
    protected updateHistoryReply(commentID: number | undefined, replyID: number, replyBlock: object) { // reply history update method
        const currentData = this.getDATA() 
        currentData.history.forEach((commentBlock: any) => {
            if(+commentBlock.commentID === commentID) {
                commentBlock.replyes[`reply_${replyID}`] = replyBlock
            }
        })
        localStorage.setItem('DATA', JSON.stringify(currentData))
    }

    protected updateNumberComments() {
        const numberCommentsElement = document.querySelector('.commentSystem__count')
        this.numberComments = this.getNumberComments()
        if(numberCommentsElement) numberCommentsElement.innerHTML = `(${this.numberComments})`
    }

    protected getNumberComments(): number {
        return Object.keys(this.getDATA().history).length
    }
}