fixScale(document);
main();
function main() {
    let canvas = document.getElementById('color-canvas-select')

    colorjoe.registerExtra('text', function (p, joe, o) {
        e(p, o.text ? o.text : 'text');
    });

    function e(parent, text) {
        var elem = document.createElement('div');
        elem.innerHTML = text;
        parent.appendChild(elem);
    }

    colorjoe.rgb('rgbPicker').on('change', function (c) {
        canvas.style.backgroundColor = c.css();
    }).update();
}

const firebaseConfig = {
    apiKey: "AIzaSyCvi-z2_2bIW4BOzrEFFdK31z6RGNM2cjk",
    authDomain: "a-place-we-share.firebaseapp.com",
    databaseURL: "https://a-place-we-share.firebaseio.com",
    projectId: "a-place-we-share",
    storageBucket: "a-place-we-share.appspot.com",
    messagingSenderId: "839642040073",
    appId: "1:839642040073:web:6cd43edd57047d2d7b35d8"
};

function renderCanvas() {
    let colors = database.ref().once('value').then(function (snapshot) {
        var usersObject = snapshot.val()
        const canvasElement = document.getElementById('canvas')
        for (const color in usersObject) {
            if (usersObject.hasOwnProperty(color)) {
                const element = usersObject[color]
                console.log(element);
                const userColor = element.color
                const colorBox = document.createElement('div')
                colorBox.style.backgroundColor = userColor
                colorBox.classList.add('color-box')
                canvasElement.appendChild(colorBox)
            }
        }
    })
}

function addUserColor(timestamp, userId, color) {
    database.ref(timestamp).set({
        color: color
    });
}

function canvasTransition(foreground) {
    foreground.style.display = 'none'
}