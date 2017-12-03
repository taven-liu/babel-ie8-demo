import $ from 'jquery'
import { log } from 'common/utils'
import './style'
import img from './img/test.png'

const $root = $('#root')
const divEle = `<div class="test">hello world</div>`
const imgEle = `<img src="${img}">`

$root.append(divEle)
$root.append(imgEle)

log('img:', img)
