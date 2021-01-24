const checkList = new Set();
const JSON_FILE = {
    word: './src/word.json',
    symbol: './src/symbol.json'
};
const root = document.querySelector(':root');
const book = document.querySelector('.book');
export const menu = document.querySelector('.setting');
const Color = ['white', 'black', 'gray', 'red', 'orange', 'yellow', 'green', 'blue', 'violet'];
let Words, Symbols, Numbers, UserData;
let profile = { id: '0', name: 'TEST USER', image: './src/test-user.png' };
let themeColor = { theme: 'black', bold: 'orange', mark: 'green' };



export function load() {
    Numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    spreadBook();
    fetch(JSON_FILE['symbol'])
        .then(data => data.json())
        .then(json => Symbols = json);
    fetch(JSON_FILE['word'])
        .then(data => data.json())
        .then(json => Words = json)
        .then(() => {
            if (localStorage.getItem('bookmark') !== null) {
                manageBookmark(new Event('load'));
            }
            printWords();
            createSetting();
        });
}


function formatWord(word, id) {
    if (word[0] == '<') {
        word = word.replace(/<s>/g, '<small>');
        word = word.replace(/<\/s>/g, '</small>');
        if (checkList.has(id)) {
            word = word.replace(/<em>|<b>/g, '<font class="hide" style="color: var(--' + themeColor['theme'] + ')"><b>');
        } else {
            word = word.replace(/<em>|<b>/g, '<font class="bold" style="color: var(--' + themeColor['bold'] + ')"><b>');
        }
        word = word.replace(/<\/em>|<\/b>/g, '</b></font>');
    } else {
        if (checkList.has(id)) {
            word = word.replace(/<em>|<b>/g, '<font class="hide underline" style="color: var(--' + themeColor['theme'] + ');text-decoration:underline var(--' + (themeColor['theme'] === 'white' ? 'black' : 'gray') + ')"><b>');
        } else {
            word = word.replace(/<em>|<b>/g, '<font class="bold underline" style="color: var(--' + themeColor['bold'] + ');text-decoration:underline var(--' + (themeColor['theme'] === 'white' ? 'black' : 'gray') + ')"><b>');
        }
        word = word.replace(/<\/em>|<\/b>/g, '</b></font>');
    }
    return word;
}


function spreadBook() {
    let book = document.querySelector('.book');

    for (let i = 0; i < 2; i++) {
        let page = document.createElement('div');
        page.className = 'page';
        page.id = 'p' + String(i);
        book.appendChild(page);
        for (let j = 0; j < 10; j++) {
            let word = document.createElement('div');
            word.className = 'word';
            word.id = 'w' + String(j);
            page.appendChild(word);
            switch (i) {
                case 0:
                    let eng = document.createElement('div');
                    eng.className = 'eng';
                    eng.id = 'e' + String(j);
                    word.appendChild(eng);
                    eng.addEventListener('click', event => turnPage(event));

                    let i_c = document.createElement('div');
                    i_c.className = 'i_c';
                    i_c.id = 'i_c' + String(j);
                    eng.appendChild(i_c);
                    i_c.addEventListener('click', event => event.stopPropagation());

                    let id = document.createElement('div');
                    id.className = 'id';
                    id.id = 'i' + String(j);
                    i_c.appendChild(id);

                    let check = document.createElement('input');
                    check.type = 'checkbox';
                    check.id = 'c' + String(j);
                    check.addEventListener('change', event => {
                        const en = document.querySelector('#e' + String(j)).querySelector('font');
                        const ja = document.querySelector('#j' + String(j)).querySelectorAll('b');
                        const e_en = document.querySelector('#e_e' + String(j)).querySelector('font');
                        const e_ja = document.querySelector('#e_j' + String(j)).querySelector('font');
                        const progress = document.querySelector('#progress');
                        const memorized = document.querySelector('.memorized');

                        en.classList.toggle('mark');
                        if (event.target.checked) {
                            checkList.add(Number(document.querySelector('#i' + String(j)).innerHTML));
                            en.style.backgroundColor = 'var(--' + themeColor['mark'] + ')';
                            ja.forEach(element => {
                                element.classList.add('hide');
                                element.style.color = 'var(--' + themeColor['theme'] + ')';
                            });
                            e_en.classList.add('hide');
                            e_en.style.color = 'var(--' + themeColor['theme'] + ')';
                            e_ja.classList.add('hide');
                            e_ja.style.color = 'var(--' + themeColor['theme'] + ')';
                        } else {
                            checkList.delete(Number(document.querySelector('#i' + String(j)).innerHTML));
                            en.style.backgroundColor = '';
                            ja.forEach(element => {
                                element.classList.remove('hide');
                                element.style.color = 'var(--' + themeColor['bold'] + ')';
                            });
                            e_en.classList.remove('hide');
                            e_en.style.color = 'var(--' + themeColor['bold'] + ')';
                            e_ja.classList.remove('hide');
                            e_ja.style.color = 'var(--' + themeColor['bold'] + ')';
                        }
                        progress.style.color = 'var(--' + themeColor['mark'] + ')';
                        progress.innerHTML = String(Math.round(checkList.size * 1000 / Words.length) / 10) + '%';
                        progress.classList.add('fade');
                        setTimeout(() => {
                            progress.classList.remove('fade');
                        }, 1000);
                        manageCheckList(new Event('beforeunload'));
                        if (localStorage.getItem('checkList') !== null && localStorage.getItem('checkList') !== '') {
                            memorized.innerHTML = localStorage.getItem('checkList').split(',').length;
                        } else {
                            memorized.innerHTML = 0;
                        }
                    });
                    i_c.appendChild(check);

                    let mp3_eng = document.createElement('audio');
                    mp3_eng.id = 'm_e' + String(j);
                    eng.appendChild(mp3_eng);

                    let jap = document.createElement('div');
                    jap.className = 'jap';
                    jap.id = 'j' + String(j);
                    jap.addEventListener('click', event => turnPage(event));
                    word.appendChild(jap);
                    if (j == 9) {
                        eng.style.borderBottomStyle = 'none';
                        jap.style.borderBottomStyle = 'none';
                    }
                    break;
                case 1:
                    let ex_eng = document.createElement('div');
                    ex_eng.className = 'ex_eng';
                    ex_eng.id = 'e_e' + String(j);
                    ex_eng.addEventListener('click', event => turnPage(event));
                    word.appendChild(ex_eng);

                    let ex_jap = document.createElement('div');
                    ex_jap.className = 'ex_jap';
                    ex_jap.id = 'e_j' + String(j);
                    ex_jap.addEventListener('click', event => turnPage(event));
                    word.appendChild(ex_jap);
                    if (j == 9) {
                        ex_eng.style.borderBottomStyle = 'none';
                        ex_jap.style.borderBottomStyle = 'none';
                    }
                    break;
            }
        }
    }
    let progress = document.createElement('div');
    progress.id = 'progress';
    book.appendChild(progress);
}


function printWords() {
    for (let i in Numbers) {
        let id = document.querySelector('#i' + String(i));
        id.innerHTML = Words[Numbers[i]].id;
        if (checkList.has(Number(Words[Numbers[i]].id))) {
            document.querySelector('#c' + String(i)).checked = true;;
            document.querySelector('#c' + String(i)).classList.add('mark');
        } else {
            document.querySelector('#c' + String(i)).checked = false;
        }

        let eng = document.querySelector('#e' + String(i));
        if (eng.children[2]) {
            for (let j = 0; j < 2; j++) {
                eng.removeChild(eng.lastChild);
            }
        }

        let fontEng = document.createElement('font');
        fontEng.style.fontSize = '3vh';
        fontEng.style.fontWeight = 'bold';
        fontEng.innerText = Words[Numbers[i]].eng;
        if (checkList.has(Number(Words[Numbers[i]].id))) {
            fontEng.classList.add('mark');
            fontEng.style['background-color'] = 'var(--' + themeColor['mark'] + ')';
        }
        fontEng.addEventListener('click', event => {
            document.querySelector('#m_e' + String(i)).play();
            event.stopPropagation();
        });
        eng.appendChild(fontEng);

        let mp3Eng = document.querySelector('#m_e' + String(i));
        mp3Eng.src = 'src/mp3/' + Words[Numbers[i]].mp3_eng + '.mp3';

        let fontPron = document.createElement('font');
        fontPron.style.fontSize = '2vh';
        fontPron.innerHTML = '<br>';
        if (Words[Numbers[i]].pron != null) {
            fontPron.innerHTML += Words[Numbers[i]].pron;
            for (let j = 0; j < Symbols.length; j++) {
                fontPron.innerHTML = fontPron.innerHTML.split(Symbols[j].obs_symbol).join(Symbols[j].ipa_symbol);
            }
        }
        eng.appendChild(fontPron);

        let jap = document.querySelector('#j' + String(i));
        jap.innerHTML = formatWord(Words[Numbers[i]].jap, Number(Words[Numbers[i]].id) - 1);
        if (Words[Numbers[i]].exp != null) {
            jap.innerHTML += '<br>' + Words[Numbers[i]].exp;
        }

        let ex_eng = document.querySelector('#e_e' + String(i));
        ex_eng.innerHTML = formatWord(Words[Numbers[i]].ex_eng, Number(Words[Numbers[i]].id) - 1);

        let ex_jap = document.querySelector('#e_j' + String(i));
        ex_jap.innerHTML = formatWord(Words[Numbers[i]].ex_jap, Number(Words[Numbers[i]].id) - 1);
    }
}


export function turnPage(event) {
    const center = window.innerWidth / 2;
    let direction;

    switch (event.type) {
        case 'click':
            direction = event.pageX;
            if (direction > center) {
                Numbers = Numbers.map(n => (n + 10) % Words.length);
            } else {
                Numbers = Numbers.map(n => (n + Words.length - 10) % Words.length);
            }
            break;
        case 'keydown':
            direction = event.keyCode;
            if (direction == 39) {
                Numbers = Numbers.map(n => (n + 10) % Words.length);
            } else if (direction == 37) {
                Numbers = Numbers.map(n => (n + Words.length - 10) % Words.length);
            }
            break;
    }
    manageBookmark(new Event('beforeunload'));
    printWords();
}


function manageBookmark(event) {
    switch (event.type) {
        case 'load':
            const bookmark = localStorage.getItem('bookmark');
            if (bookmark != null) {
                Numbers = bookmark.split(',').map(Number);
            }
            break;
        case 'beforeunload':
            localStorage.setItem('bookmark', Numbers);
            break;
    }
    if (profile['id'] !== '0') {
        UserData = { profile: profile, bookmark: Numbers, checkList: Array.from(checkList), themeColor: themeColor };
        localStorage.setItem(profile['id'], JSON.stringify(UserData));
        setSaver();
    }
}


function manageCheckList(event) {
    switch (event.type) {
        case 'load':
            const checklist = localStorage.getItem('checkList');
            if (checklist != null) {
                checklist.split(',').map(Number).forEach(i => checkList.add(i));
            }
            break;
        case 'beforeunload':
            localStorage.setItem('checkList', Array.from(checkList));
            break;
    }
    if (profile['id'] !== '0') {
        UserData = { profile: profile, bookmark: Numbers, checkList: Array.from(checkList), themeColor: themeColor };
        localStorage.setItem(profile['id'], JSON.stringify(UserData));
        setSaver();
    }
}


function createSetting() {
    const setting = document.querySelector('#setting');
    const settingMenu = document.querySelector('.setting');
    const user = document.createElement('div');
    const userImage = document.createElement('img');
    const userName = document.createElement('div');
    const progress = document.createElement('div');
    const progressBar = document.createElement('progress');
    const menuItem = ['覚えた単語数', 'テーマ', '太字', 'マーカー', 'バックアップ', '復元', 'ログイン', '全画面表示'];

    setting.onclick = () => {
        if (setting.className.match('open')) {
            menu.style['animation'] = 'hideSetting 0.5s ease-out forwards';
            book.style['animation'] = 'closeSetting 0.5s ease-out forwards';
            setting.innerHTML = '⚙';
        } else {
            menu.style['animation'] = 'displaySetting 0.5s ease-out forwards';
            book.style['animation'] = 'openSetting 0.5s ease-out forwards';
            setting.innerHTML = '☒';
        }
        setting.classList.toggle('open');
    }
    root.style.setProperty('--bold-color', 'var(--' + themeColor['bold'] + ')');
    root.style.setProperty('--mark-color', 'var(--' + themeColor['mark'] + ')');
    user.setAttribute('class', 'user');
    settingMenu.appendChild(user);
    userImage.setAttribute('id', 'userImage');
    userImage.setAttribute('src', profile['image']);
    user.appendChild(userImage);
    userName.setAttribute('id', 'userName');
    userName.innerHTML = profile['name'];
    user.appendChild(userName);
    progress.setAttribute('class', 'menu');
    progress.innerHTML = '・' + menuItem[0] + '：<b class="memorized" style="color: var(--mark-color)">' + 0 + '</b>/' + Words.length + '語';
    settingMenu.appendChild(progress);
    progressBar.setAttribute('class', 'progress');
    progressBar.setAttribute('max', Words.length);
    if (localStorage.getItem('checkList') !== null && localStorage.getItem('checkList') !== '') {
        progressBar.setAttribute('value', localStorage.getItem('checkList').split(',').length);
    } else {
        progressBar.setAttribute('value', 0);
    }
    progress.appendChild(progressBar);
    for (let i = 1; i < menuItem.length; i++) {
        const menu = document.createElement('div');
        const pallet = document.createElement('div');

        menu.setAttribute('class', 'menu');
        menu.innerHTML = '・' + menuItem[i];
        if (i < 4 || 5 < i) {
            settingMenu.appendChild(menu);
        } else if (i === 4) {
            const dropboxMenu = document.createElement('div');

            dropboxMenu.setAttribute('class', 'dropboxMenu');
            settingMenu.appendChild(dropboxMenu);
            dropboxMenu.appendChild(menu);
        } else if (i === 5) {
            const dropboxMenu = document.querySelector('.dropboxMenu');

            dropboxMenu.appendChild(menu);
        }
        if (i < 4) {
            pallet.setAttribute('class', 'pallet');
            settingMenu.appendChild(pallet);
            for (let j = (i > 1 ? 3 : 0); j < (i > 1 ? 9 : 6); j++) {
                const c = document.createElement('div');

                c.setAttribute('class', 'color');
                if ((menuItem[i] === 'テーマ' && themeColor['theme'] === Color[j]) || (menuItem[i] === '太字' && themeColor['bold'] === Color[j]) || (menuItem[i] === 'マーカー' && themeColor['mark'] === Color[j])) {
                    c.classList.add('selected');
                }
                c.style['height'] = (settingMenu.clientWidth / 6 - settingMenu.clientHeight / 100) + 'px';
                if (i > 1 || j < 2) {
                    c.setAttribute('id', Color[j]);
                    c.style['backgroundColor'] = 'var(--' + Color[j] + ')';
                    c.onclick = () => {
                        pallet.querySelector('.selected').classList.remove('selected');
                        c.classList.add('selected');
                        changeColor(i === 1 ? 'theme' : i === 2 ? 'bold' : 'mark', c.id);
                    }
                } else {
                    c.style['backgroundColor'] = 'var(--' + themeColor['theme'] + ')';
                    c.style['border'] = 'none';
                }
                pallet.appendChild(c);
            }
        } else if (i === 4) {
            const dropboxMenu = document.querySelector('.dropboxMenu');
            const dropbox = document.createElement('div');

            dropboxMenu.style['display'] = 'none';
            dropbox.setAttribute('class', 'dropbox');
            dropboxMenu.appendChild(dropbox);
            setSaver();
        } else if (i === 5) {
            const dropboxMenu = document.querySelector('.dropboxMenu');
            const dropbox = document.createElement('div');
            const options = {
                success: files => {
                    fetch(files[0].link)
                        .then(data => data.json())
                        .then(json => {
                            UserData['profile'] = profile;
                            for (let i in json) {
                                UserData[i] = json[i];
                            }
                            loadSetting(true);
                            window.alert('復元に成功しました');
                        });
                },
                linkType: "direct",
                extensions: ['.json'],
            };
            const chooser = Dropbox.createChooseButton(options);

            dropbox.setAttribute('class', 'dropbox');
            dropboxMenu.appendChild(dropbox);
            dropbox.appendChild(chooser);
        } else if (i === 6) {
            const dropboxMenu = document.querySelector('.dropboxMenu');
            const googleSignIn = document.createElement('div');

            googleSignIn.setAttribute('id', 'g-signin2');
            settingMenu.appendChild(googleSignIn);
            gapi.signin2.render('g-signin2', {
                'scope': 'profile',
                'longtitle': true,
                'theme': 'dark',
                'onsuccess': googleUser => {
                    profile['id'] = googleUser.getBasicProfile().getId();
                    profile['name'] = googleUser.getBasicProfile().getName();
                    profile['image'] = googleUser.getBasicProfile().getImageUrl();
                    userImage.setAttribute('src', profile['image']);
                    userName.innerHTML = profile['name'];
                    UserData = localStorage.getItem(profile['id']);

                    if (UserData !== null) {
                        loadSetting(true);
                        gapi.auth2.getAuthInstance().isSignedIn.listen(loadSetting);
                    } else {
                        UserData = { profile: profile, bookmark: Numbers, checkList: Array.from(checkList), themeColor: themeColor };
                        localStorage.setItem(profile['id'], JSON.stringify(UserData));
                        setSaver();
                    }
                    dropboxMenu.style['display'] = 'inline';
                },
                'onfailure': error => console.log(error)
            });
            const dropbox = document.createElement('div');
            dropbox.setAttribute('class', 'dropbox');
            settingMenu.appendChild(dropbox);
            const googleSignOut = document.createElement('a');
            googleSignOut.setAttribute('id', 'g-signout2');
            googleSignOut.innerHTML = 'Sign out';
            googleSignOut.onclick = () => {
                const auth2 = gapi.auth2.getAuthInstance();
                auth2.signOut().then(() => loadSetting(false));
            }
            dropbox.appendChild(googleSignOut);
        } else if (i === 7) {
            const checkbox = document.createElement('input');

            checkbox.setAttribute('type', 'checkbox');
            checkbox.onchange = event => {
                if (event.target.checked) {
                    document.documentElement.requestFullscreen();
                } else {
                    document.exitFullscreen();
                }
            };
            menu.appendChild(checkbox);
        }
    }
}


function loadSetting(signedIn) {
    const memorized = document.querySelector('.memorized');
    const dropboxMenu = document.querySelector('.dropboxMenu');
    const googleSignOut = document.querySelector('#g-signout2');

    if (signedIn) {
        if (typeof(UserData) !== 'object') {
            UserData = localStorage.getItem(profile['id']);
            UserData = JSON.parse(UserData);
        }
        profile = UserData.profile;
        Numbers = UserData.bookmark;
        UserData.checkList.forEach(i => checkList.add(i));
        themeColor = UserData.themeColor;
        googleSignOut.style['display'] = 'inline';
        dropboxMenu.style['display'] = 'inline';
    } else {
        const userImage = document.querySelector('#userImage');
        const userName = document.querySelector('#userName');

        UserData = { profile: profile, bookmark: Numbers, checkList: Array.from(checkList), themeColor: themeColor };
        localStorage.setItem(profile['id'], JSON.stringify(UserData));
        setSaver();
        profile = { id: '0', name: 'TEST USER', image: './src/test-user.png' };
        userImage.setAttribute('src', profile['image']);
        userName.innerHTML = profile['name'];
        Numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        checkList.clear();
        themeColor = { theme: 'black', bold: 'orange', mark: 'green' };
        googleSignOut.style['display'] = 'none';
        dropboxMenu.style['display'] = 'none';
    }
    manageBookmark(new Event('beforeunload'));
    manageCheckList(new Event('beforeunload'));
    printWords();
    for (let target in themeColor) {
        const n = target === 'theme' ? 0 : target === 'bold' ? 1 : 2;
        const unselect = document.querySelectorAll('.pallet')[n].querySelector('.selected');
        const select = document.querySelectorAll('.pallet')[n].querySelector('#' + themeColor[target]);

        unselect.classList.remove('selected');
        select.classList.add('selected');
        changeColor(target, themeColor[target]);
    }

    if (localStorage.getItem('checkList') !== null && localStorage.getItem('checkList') !== '') {
        memorized.innerHTML = localStorage.getItem('checkList').split(',').length;
    } else {
        memorized.innerHTML = 0;
    }
}


function changeColor(target, color) {

    themeColor[target] = color;
    if (target === 'theme') {
        const BorW = 'var(--' + color + ')';
        const BorG = 'var(--' + (color === 'white' ? 'black' : 'gray') + ')';
        const WorG = 'var(--' + (color === 'white' ? 'white' : 'gray') + ')';
        const body = document.querySelector('body');
        const user = document.querySelector('#userName');
        const pallet = document.querySelectorAll('.pallet')[0].querySelectorAll('.color');
        const id = document.querySelectorAll('.id');
        const jap = document.querySelectorAll('.jap');
        const ex_eng = document.querySelectorAll('.ex_jap');
        const ex_jap = document.querySelectorAll('.ex_eng');
        const hide = document.querySelectorAll('.hide');
        const underline = document.querySelectorAll('.underline');

        body.style['background-color'] = BorW;
        menu.style['color'] = BorG;
        menu.style['background-color'] = BorW;
        user.style['color'] = BorG;
        pallet.forEach((c, i) => {
            if (i > 1) {
                c.style['background-color'] = BorW;
            }
        });
        book.style['border-color'] = BorG;
        book.style['color'] = BorG;
        id.forEach(i => i.style['color'] = WorG);
        [jap, ex_eng, ex_jap].forEach(g => g.forEach(e => {
            e.style['color'] = BorG;
            e.style['border-color'] = BorG;
        }));
        hide.forEach(h => h.style['color'] = BorW);
        underline.forEach(u => u.style['text-decoration-color'] = BorG);
    } else if (target === 'bold') {
        root.style.setProperty('--bold-color', 'var(--' + color + ')');
        document.querySelectorAll('.' + target).forEach(t => {
            if (!t.classList.contains('hide')) {
                t.style['color'] = 'var(--' + color + ')';
            }
        });
    } else if (target === 'mark') {
        root.style.setProperty('--mark-color', 'var(--' + color + ')');
        document.querySelectorAll('.' + target).forEach(t => t.style['background-color'] = 'var(--' + color + ')');
    }

    if (profile['id'] !== '0') {
        UserData = { profile: profile, bookmark: Numbers, checkList: Array.from(checkList), themeColor: themeColor };
        localStorage.setItem(profile['id'], JSON.stringify(UserData));
        setSaver();
    }
}


function setSaver() {
    const dropbox = document.querySelectorAll('.dropbox')[0];
    const data = { bookmark: Numbers, checkList: Array.from(checkList), themeColor: themeColor };
    const backup = "data:text/json;charset=shift_jis," + encodeURIComponent(JSON.stringify(data));
    const date = new Date();
    const time = date.toISOString().split('T')[0] + ' ' + date.toLocaleTimeString();
    const options = {
        files: [{ url: backup, filename: time + ' backup.json' }],
        success: () => window.alert('バックアップに成功しました'),
        error: errorMessage => console.log(errorMessage)
    };
    const saver = Dropbox.createSaveButton(options);

    dropbox.innerHTML = '';
    dropbox.appendChild(saver);
}