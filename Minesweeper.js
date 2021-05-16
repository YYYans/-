const log = console.log.bind(console)

const e = function(selector) {
    let element = document.querySelector(selector)
    if (element === null) {
        alert('WARNING')
        return null
    } else {
        return element
    }
}
const es = function(selector) {
    let elements = document.querySelectorAll(selector)
    if (elements.length === 0) {
        alert('WARNING')
        return []
    } else {
        return elements
    }
}

const bindAll = function(elements, eventName, callback) {
    for (let i = 0; i < elements.length; i++) {
        let tag = elements[i]
        tag.addEventListener(eventName, callback)
    }
}
//随机生成数字0或9（9为雷）
const randomLine09 = function(n, Mine) {
    let s = []
    let count = 0
    let len = n * n
    for (let i = 0; i < len; i++) {
        count ++
        if (count < Mine) {
            s.push(9)
        } else {
            s.push(0)
        }
    }
    return s
}

//对一维数组进行洗牌
const lineshuffle = (s) => {
    if (!Array.isArray(s) && s.length) {
        return []
    }
    for (let i = s.length; i > 0; i--){
        const index =  Math.floor(Math.random() * i)
        if (index !== (i - 1)) {
            const tmp = s[index];
            s[index] = s[i - 1]
            s[i - 1] = tmp
        }
    }
    return s
}

//将一维数组转换为二维数组
const randomSquare = (n, s) => {
    s = lineshuffle(s)
    let array = []
    for (let i = 0; i < n; i++) {
        let line = s.slice(i * n, i * n + n);
        array.push(line)
    }
    log(array)
    return array
}

const clonedSquare = (square) => {
    let l = []
    for (let i = 0; i < square.length; i++) {
        let line = square[i]
        let c = line.slice(0)
        l.push(c)
    }
    return l
}

//用于标记的函数
const plus1 = (array, x, y) => {

    let n = array.length
    if (x >= 0 && x < n && y >= 0 && y < n) {
        if (array[x][y] !== 9) {
            array[x][y] += 1
        }
    }
}
//标记雷的四周8个元素
const markAround = (array, x, y) => {
    if (array[x][y] === 9) {
        plus1(array, x - 1, y - 1)
        plus1(array, x, y - 1)
        plus1(array, x + 1, y - 1)

        plus1(array, x - 1, y)
        plus1(array, x + 1, y)

        plus1(array, x - 1, y + 1)
        plus1(array, x, y + 1)
        plus1(array, x + 1, y + 1)
    }
}

//整个矩阵进行标记
const markedSquare = function(array) {
    let square = clonedSquare(array)
    for (let i = 0; i < square.length; i++) {
        let line = square[i]
        for (let j = 0; j < line.length; j++) {
            markAround(square, i, j)
        }
    }
    return square
}

//页面创建矩阵
const bindEventsCreatsquare = (n, Mine) => {
    let s = randomLine09(n, Mine)
    let square = randomSquare(n, s)
    square = markedSquare(square)
    return square
}

//插入div
const templateCell = (line, x) => {
    let s = ''
    for (let i = 0; i < line.length; i++) {
        let c = line[i]
        s += `<div class="cell" data-number="${c}" data-x="${x}" data-y="${i}">${c}</div>`
    }
    return s
}

const templateRow = (square) => {
    let s = ''
    for (let i = 0; i < square.length; i++) {
        let c = square[i]
        s += `<div class="row-clearfix">${templateCell(c, i)}</div>`
    }
    return s
}

const renderSquare = (square) => {
    let div = e('#id-div-mime')
    div.innerHTML += templateRow(square)
}

const bindEventDelegate = (n, Mine, square) => {
    let s = es('.cell')
    bindAll(s, 'click', (event) => {
        let self = event.target
        vjkl(self, square, n, Mine)
    })
}

const vjkl = (cell, square, n, Mine) => {
    let number = cell.dataset.number
    if (!cell.classList.contains('opened')) {
        if(number === '9') {
            let bs = es('.cell')
            for (let i = 0; i < bs.length; i++) {
                if (bs[i].innerHTML === '9') {
                    bs[i].innerHTML = '<div class="gua-img-div"><img class="bump-img" src="bump.jpg" alt=""></div>'
                }
                if (!bs[i].classList.contains('opened')) {
                    bs[i].classList.add('show')
                    bs[i].classList.add('opened')
                    if (bs[i].innerHTML !== '0') {
                        bs[i].classList.add('showfont')
                    }
                }
            }
            Alert('Baby, You Are Lose!', '太可惜了!', '再来一局，挑战一下？')
        } else if (number === '0') {
            let x1 = Number(cell.dataset.x)
            let y1 = Number(cell.dataset.y)
            cell.classList.add('opened')
            cell.classList.add('show')
            vjklAround(square, x1, y1)
            isWIN(n, Mine)
        } else {
            cell.classList.add('opened')
            cell.classList.add('showfont')
            cell.classList.add('show')
            isWIN(n, Mine)
        }
    }
}

//标记0，用于递归展开
const vjklAround = (square, x, y) => {
    if (square[x][y] === 0) {
        vjkl1(square, x - 1, y - 1)
        vjkl1(square, x, y - 1)
        vjkl1(square, x + 1, y - 1)

        vjkl1(square, x - 1, y)
        vjkl1(square, x + 1, y)

        vjkl1(square, x - 1, y + 1)
        vjkl1(square, x, y + 1)
        vjkl1(square, x + 1, y + 1)
    }
}

const vjkl1 = (square, x, y) => {
    let n = square.length
    if (x >= 0 && x < n && y >= 0 && y < n) {
        let a = `[data-x="${x}"][data-y="${y}"]`
        let index = e(`${a}`)
        let number = index.dataset.number
        if (!index.classList.contains('opened')) {
            if (number === '0') {
                index.classList.add('opened')
                index.classList.add('show')
                vjklAround(square, x, y)
            } else if (number !== '9') {
                index.classList.add('opened')
                index.classList.add('show')
                if (number !== '0') {
                    index.classList.add('showfont')
                }
            }
        }
    }
}

const isWIN = (n, Mine) => {
    let s = es('.cell')
    let count = 0
    let win = n * n - Mine
    for (let i = 0; i < s.length; i++) {
        let cell = s[i]
        let num = cell.dataset.number
        if (cell.classList.contains('opened') && num !== '9') {
            count ++
        }
        if (count === win) {
            Alert('Baby, You Are Win!', '太厉害了!', '想再玩一次吗？')
        }
    }
}

const Alert = (title, message1, message2) => {
    let div1 = e('.title')
    let div2 = e('.message1')
    let div3 = e('.message2')
    let target = e('.modal-container')
    target.classList.remove('hide')
    div1.innerHTML = `${title}`
    div2.innerHTML = `${message1}`
    div3.innerHTML = `${message2}`

    bindEventClickOK()
}


const bindEventClickOK = () => {
    let Button = e('.ok_button')
    Button.addEventListener('click', () => {
        let div = e('.modal-container')
        div.classList.add('hide')
        location.reload()
    })
}

const bindEvents = () => {
    let n = 9
    let Mine = 15
    let square = bindEventsCreatsquare(n, Mine)
    renderSquare(square)
    bindEventDelegate(n, Mine, square)

}

const __main = () => {
    bindEvents()
}

__main()