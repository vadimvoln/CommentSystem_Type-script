"use strict";
class CommentSystem {
    constructor() {
        if (!localStorage.getItem('DATA')) { // data initialization
            this.DATA = '{"user": {}, "history": []}';
            localStorage.setItem('DATA', this.DATA);
        }
        else {
            this.DATA = localStorage.getItem('DATA');
        }
        this.userForm = new UserForm();
        this.numberComments = 0;
    }
    userBlockHidden(bool) {
        const userBlock = document.querySelector('.commentSystem__userBlock');
        if (bool) {
            if (userBlock)
                userBlock.style.display = 'none';
        }
        else {
            if (userBlock)
                userBlock.style.display = 'flex';
        }
    }
    createUser(nickname, ava) {
        const userAva = document.querySelector('.ava');
        const userNickname = document.querySelector('.userBlock__nickname');
        if (userNickname !== null)
            userNickname.innerHTML = nickname;
        if (userAva !== null)
            userAva.setAttribute('src', ava);
        const data = this.getDATA();
        data.user = {
            userNickName: nickname,
            userAva: ava,
            favorites: data.user.favorites === undefined || Object.keys(data.user.favorites).length === 0
                ? {}
                : data.user.favorites
        };
        localStorage.setItem('DATA', JSON.stringify(data));
        const comment = new Comments(this.userForm);
    }
    getUserNickname() {
        const userNicknameElement = document.querySelector('.userBlock__nickname');
        if (userNicknameElement) {
            const userNickname = userNicknameElement.innerHTML;
            return userNickname;
        }
    }
    getUserAva() {
        const userAvaElement = document.querySelector('.ava');
        if (userAvaElement !== null) {
            const userAva = userAvaElement.getAttribute('src');
            return userAva;
        }
    }
    getDATA() {
        const currentData = localStorage.getItem('DATA');
        if (currentData) {
            const parseData = JSON.parse(currentData);
            if (Object.keys(parseData).includes('history')) {
                return parseData;
            }
        }
    }
    getCurrentDate() {
        const date = new Date();
        const fullDate = new Date(Date.UTC(date.getUTCFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
        const displayDate = `${date.getDate()}.${date.getMonth()}  ${date.getHours()}:${date.getMinutes()}`;
        return {
            fullDate: fullDate,
            displayDate: displayDate
        };
    }
    addHistoryComments(commentBlock) {
        const currentData = this.getDATA();
        currentData.history.push(commentBlock);
        localStorage.setItem('DATA', JSON.stringify(currentData));
    }
    updateHistoryReply(commentID, replyID, replyBlock) {
        const currentData = this.getDATA();
        currentData.history.forEach((commentBlock) => {
            if (+commentBlock.commentID === commentID) {
                commentBlock.replyes[`reply_${replyID}`] = replyBlock;
            }
        });
        localStorage.setItem('DATA', JSON.stringify(currentData));
    }
    updateNumberComments() {
        const numberCommentsElement = document.querySelector('.commentSystem__count');
        this.numberComments = this.getNumberComments();
        if (numberCommentsElement)
            numberCommentsElement.innerHTML = `(${this.numberComments})`;
    }
    getNumberComments() {
        return Object.keys(this.getDATA().history).length;
    }
}
