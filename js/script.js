import { load, turnPage, menu } from './module.js';


window.addEventListener('keydown', event => turnPage(event));

window.addEventListener('load', () => load());

window.onresize = () => document.querySelectorAll('.color').forEach(c => c.style['height'] = (menu.clientWidth / 6 - menu.clientHeight / 100) + 'px');