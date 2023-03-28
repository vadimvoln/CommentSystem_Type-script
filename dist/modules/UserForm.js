"use strict";
class UserForm {
    constructor() {
        this.textarea = document.querySelector('.userBlock__textarea');
        this.charWarning = document.querySelector('.userBlock__maxCharWarning');
        this.sendBtn = document.querySelector('.userBlock__btn');
        this.paddingBottomPlusTop = 40;
        this.maxChar = 1000;
        this.autosize = () => {
            if (this.textarea !== null) {
                this.textarea.style.height = '0px';
                this.textarea.style.height = (this.textarea.scrollHeight - this.paddingBottomPlusTop) + "px";
            }
        };
        this.checkQuantityChar = () => {
            const maxCharElement = document.querySelector('.userBlock__maxChar');
            if (this.textarea !== null && this.sendBtn !== null && this.charWarning !== null && maxCharElement !== null) {
                const strTextarea = this.textarea.value;
                if (+strTextarea.length === 0) {
                    this.sendBtn.classList.add('--disable');
                    maxCharElement.innerHTML = `Макс. ${this.maxChar} символов`;
                }
                else if (+strTextarea.length > 0) {
                    this.sendBtn.classList.remove('--disable');
                    maxCharElement.innerHTML = `${+strTextarea.length}/${this.maxChar}`;
                }
                if (+strTextarea.length >= this.maxChar) {
                    this.charWarning.style.display = 'block';
                    this.sendBtn.classList.add('--disable');
                }
                else if (+strTextarea.length < this.maxChar) {
                    this.charWarning.style.display = 'none';
                }
            }
        };
        this.listenerUserForm();
    }
    listenerUserForm() {
        if (this.textarea && this.sendBtn) {
            this.textarea.setAttribute("style", "height:" + (this.textarea.scrollHeight - this.paddingBottomPlusTop) + "px;overflow-y:hidden;");
            this.textarea.addEventListener("input", this.autosize, false);
            this.textarea.addEventListener("keyup", this.checkQuantityChar, false);
        }
    }
    getTextTextarea() {
        const textareaElement = document.querySelector('.userBlock__textarea');
        const text = textareaElement !== null ? textareaElement.value : "";
        return text;
    }
    clearTextarea() {
        const textareaElement = document.querySelector('.userBlock__textarea');
        const maxCharElement = document.querySelector('.userBlock__maxChar');
        if (textareaElement)
            textareaElement.value = "";
        if (maxCharElement)
            maxCharElement.innerHTML = `Макс. ${this.maxChar} символов`;
        if (this.sendBtn)
            this.sendBtn.classList.add('--disable');
        if (this.textarea)
            this.textarea.style.height = '21px';
    }
    focusTextarea() {
        if (this.textarea)
            this.textarea.focus();
    }
    changeTextarea(textareaText) {
        if (this.textarea)
            this.textarea.placeholder = textareaText;
    }
    changeBtn(text) {
        if (this.sendBtn)
            this.sendBtn.innerHTML = text;
    }
}
