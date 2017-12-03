import $ from 'jquery'
import './style'
import img from './img/test.png'

const $root = $('#root')
const divEle = `<div class="test">hello world</div>`
const imgEle = `<img src="${img}">`

$root.append(divEle)
$root.append(imgEle)
