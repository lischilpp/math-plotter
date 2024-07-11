var activeEvents = {
    screenDragging: false
}

var activeEventsData = {
    lastDragPos: 0
}

function updateCoordSystem() {
    if (typeof drawAnimation != 'undefined') {
        drawAnimation = false;
    }
    CS.clearScreen();
    CS = new CoordinateSystem(screenElem, SETTINGS.viewport, SETTINGS.zoom, SETTINGS.translation);
    draw();
    if (typeof drawAnimation != 'undefined') {
        drawAnimation = true;
    }
}

function MouseDown(e) { activeEvents.screenDragging = true;  lastDragPos = new Vector2(e.clientX, e.clientY); }
function MouseUp(e)   { activeEvents.screenDragging = false; lastDragPos = new Vector2(e.clientX, e.clientY); }

function MouseMove(e) {
    if (activeEvents.screenDragging) {
        var translation = new Vector2(
            (lastDragPos.x - e.clientX) / CS.ppu.x / SETTINGS.zoom,
            (lastDragPos.y - e.clientY) / CS.ppu.x / SETTINGS.zoom
        );
        SETTINGS.translation.x += translation.x;
        SETTINGS.translation.y -= translation.y;
        updateCoordSystem();
        lastDragPos = new Vector2(e.clientX, e.clientY);
    }
}

function MouseWheel(e) {
    var direction = (e.detail < 0 || e.wheelDelta > 0) ? 1 : -1;
    if (direction < 0) {
        SETTINGS.zoom *= SETTINGS.zoomFactor;
        SETTINGS.translation.x /= SETTINGS.zoomFactor;
        SETTINGS.translation.y /= SETTINGS.zoomFactor;
    }else {
        SETTINGS.zoom /= SETTINGS.zoomFactor;
        SETTINGS.translation.x *= SETTINGS.zoomFactor;
        SETTINGS.translation.y *= SETTINGS.zoomFactor;
    }
    updateCoordSystem();
}

function init() {
    screenElem = document.getElementById('screen');
    CS = new CoordinateSystem(screenElem, SETTINGS.viewport, SETTINGS.zoom, SETTINGS.translation);
    draw();
    document.getElementById('download').addEventListener('click', function(e) {
        var dataURL = CS.screen.toDataURL();
        dataURL = dataURL.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');
        e.target.href = dataURL;
    });
    window.onresize = updateCoordSystem;
    screenElem.onmousedown = MouseDown;
    window.onmousemove = MouseMove;
    window.onmouseup = MouseUp;
    screenElem.onmousewheel = MouseWheel;
    screenElem.addEventListener('DOMMouseScroll', MouseWheel);
    window.oncontextmenu = function(e) {
        e.preventDefault();
        return false;
    };
}

document.addEventListener('DOMContentLoaded', init, false);