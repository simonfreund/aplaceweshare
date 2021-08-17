const firebaseConfig = {
    apiKey: "AIzaSyCvi-z2_2bIW4BOzrEFFdK31z6RGNM2cjk",
    authDomain: "a-place-we-share.firebaseapp.com",
    databaseURL: "https://a-place-we-share.firebaseio.com",
    projectId: "a-place-we-share",
    storageBucket: "a-place-we-share.appspot.com",
    messagingSenderId: "839642040073",
    appId: "1:839642040073:web:6cd43edd57047d2d7b35d8"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

function renderCanvas(id, canvas) {
    database.ref().on('child_added', function (snapshot) {
        const canvasElement = document.getElementById('canvas')
        const userColor = snapshot.val().color
        const colorBox = document.createElement('div')
        colorBox.style.backgroundColor = userColor
        colorBox.classList.add('color-box')
        colorBox.id = snapshot.key
        canvasElement.appendChild(colorBox)
        updateGrid()
    })

    database.ref().on('child_removed', function (snapshot) {
        const elementToRemove = document.getElementById(snapshot.key)
        console.log(elementToRemove);
        elementToRemove.remove()
        updateGrid()
    })

    if (canvas === false) {
        database.ref(id).onDisconnect().remove(function (err) {
            if (err) { console.error('could not establish onDisconnect event', err) }
        })
    }
}

function addUserColor(id, color) {
    database.ref(id).set({
        color: color
    }).then(async () => {
        renderCanvas(id, false)
    });
}

function canvasTransition(foreground) {
    foreground.style.display = 'none'
}

function updateGrid() {
    const colorBoxes = document.getElementsByClassName('color-box')
    const colorBoxesCount = colorBoxes.length
    const rootOfBoxes = Math.sqrt(colorBoxesCount)
    const rootRouned = Math.round(rootOfBoxes)
    const widthB = 100 / rootRouned
    const rootRounedUp = Math.ceil(rootOfBoxes)
    const widthA = 100 / rootRounedUp

    addStylesheetRules([
        ['.color-box',
            ['height', widthB + '%'],
            ['width', widthA + '%']
        ]
    ]);
}

function addStylesheetRules(rules) {
    let styleEl = document.createElement('style');
    document.head.appendChild(styleEl);

    let styleSheet = styleEl.sheet;

    for (let i = 0; i < rules.length; i++) {
        let j = 1,
            rule = rules[i],
            selector = rule[0],
            propStr = '';
        if (Array.isArray(rule[1][0])) {
            rule = rule[1];
            j = 0;
        }

        for (let pl = rule.length; j < pl; j++) {
            let prop = rule[j];
            propStr += prop[0] + ': ' + prop[1] + (prop[2] ? ' !important' : '') + ';\n';
        }
        styleSheet.insertRule(selector + '{' + propStr + '}', styleSheet.cssRules.length);
    }
}

function toggleInfo() {
    if (document.getElementById('info').style.display == 'none') {
        document.getElementById('info').style.display = 'block'
    } else {
        document.getElementById('info').style.display = 'none'
    }
}

async function enterCanvas() {
    const canvasForeground = document.getElementById('color-canvas-select')
    const canvasBackgroundColor = canvasForeground.style.backgroundColor
    const max = 9
    const min = 1
    const randomNumber = Math.floor(Math.random() * (max - min) + min)
    const timestampNow = Date.now() + randomNumber
    const randomId = timestampNow + '-' + randomNumber
    await addUserColor(randomId, canvasBackgroundColor)
    await canvasTransition(canvasForeground)
}

document.getElementById('enter').addEventListener('click', async () => {
    await enterCanvas()
})

document.addEventListener('keydown', enterToEnter)
async function enterToEnter(e) {
    if (e.key === 'Enter') {
        document.removeEventListener('keydown', enterToEnter)
        await enterCanvas()
    }
}

document.addEventListener('keydown', toggleInfoOnKeypress)
async function toggleInfoOnKeypress(e) {
    if (e.code === 'KeyI') toggleInfo()
}

const urlParams = new URLSearchParams(window.location.search);
const urlColorQuery = urlParams.get('color');
if (urlColorQuery && urlColorQuery !== '') {
    const rgbValues = urlColorQuery.split(',');
    if (rgbValues.length === 3) {
            document.getElementById('color-canvas-select').style.backgroundColor = `rgb(${rgbValues[0]},${rgbValues[1]},${rgbValues[2]})`;
            enterCanvas();
    }
}