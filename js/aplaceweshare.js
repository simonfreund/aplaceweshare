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
