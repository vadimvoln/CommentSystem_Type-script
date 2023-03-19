class UserForm { // text field class with user button
    public textarea: HTMLInputElement | null
    private charWarning: HTMLElement | null
    public sendBtn: HTMLElement | null
    private paddingBottomPlusTop: number
    private maxChar: number

    private autosize
    private checkQuantityChar

    constructor() {
        this.textarea = document.querySelector('.userBlock__textarea') 
        this.charWarning = document.querySelector('.userBlock__maxCharWarning') 
        this.sendBtn = document.querySelector('.userBlock__btn') 

        this.paddingBottomPlusTop = 40 
        this.maxChar = 1000 

        this.autosize = (): void => { // callback function to dynamically change the height of the text field depending on the number of lines of text
            if(this.textarea !== null) {
                this.textarea.style.height = '0px';
                this.textarea.style.height = (this.textarea.scrollHeight - this.paddingBottomPlusTop) + "px";
            }
        }

        this.checkQuantityChar = (): void => { // callback function to check the number of entered characters
            const maxCharElement = document.querySelector('.userBlock__maxChar')
            if(this.textarea !== null && this.sendBtn !== null && this.charWarning !== null && maxCharElement !== null) {
                const strTextarea: string = this.textarea.value
                

                if(+strTextarea.length === 0) {
                    this.sendBtn.classList.add('--disable')
                    maxCharElement.innerHTML = `Макс. ${this.maxChar} символов`
                } else if(+strTextarea.length > 0) {
                    this.sendBtn.classList.remove('--disable')
                    maxCharElement.innerHTML = `${+strTextarea.length}/${this.maxChar}`
                }

                if(+strTextarea.length >= this.maxChar) {
                    this.charWarning.style.display = 'block'
                    this.sendBtn.classList.add('--disable')  
                } else if(+strTextarea.length < this.maxChar) {
                    this.charWarning.style.display = 'none'
                } 
                    
                    
            }
        }

        this.listenerUserForm()
    }

    private listenerUserForm(): void {
        if(this.textarea && this.sendBtn) {
            this.textarea.setAttribute("style", "height:" + (this.textarea.scrollHeight - this.paddingBottomPlusTop) + "px;overflow-y:hidden;");
            this.textarea.addEventListener("input", this.autosize, false);

            this.textarea.addEventListener("keyup", this.checkQuantityChar, false);
        }
    }

    public getTextTextarea(): string {
        const textareaElement: HTMLInputElement | null = document.querySelector('.userBlock__textarea')
        const text = textareaElement !== null ? textareaElement.value: ""
        return text
    }

    public clearTextarea() {
        const textareaElement: HTMLInputElement | null = document.querySelector('.userBlock__textarea')
        const maxCharElement: HTMLInputElement | null = document.querySelector('.userBlock__maxChar')
        if(textareaElement) textareaElement.value = ""
        if(maxCharElement) maxCharElement.innerHTML = `Макс. ${this.maxChar} символов`
        if(this.sendBtn) this.sendBtn.classList.add('--disable')
        if(this.textarea) this.textarea.style.height = '21px'
    }

    public focusTextarea() {
        if(this.textarea) this.textarea.focus()
    }

    public changeTextarea(textareaText: string) {
        if(this.textarea) this.textarea.placeholder = textareaText
    }

    public changeBtn(text: string) {
        if(this.sendBtn) this.sendBtn.innerHTML = text
    }
}
