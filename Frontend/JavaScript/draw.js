/**
 * @author Ishan Banerjee
 * @description Script to handle screen drawing.
 */

// DEFAULT
var gridLayer = 'gridLayer'
var defaultLayer = 'defaultLayer'
var debug = false;
var dottedStroke = false;
var toolSelected = 'marker';

var lastIndex = -1;
var lastEvent;


// CLASSES FOR TOOLS

var Marker = {
    markerWidth: 3,
    markerColor: "white",
    markerCap: "round",
    markerJoin: "round",
    markerSimplificationFactor: 8
}

var Laser = {
    laserWidth: 3,
    laserColor: "rgba(233,88,88,1)",
    laserHalo: "red",
    laserHaloRadius: 8,
    laserPoint: "round",
    laserJoin: "round"
}

var Eraser = {
    eraserWidth: 80,
    eraserColor: "rgb(22, 22, 22)",
    eraserCap: "round",
    eraserJoin: "round",
}

var Highlighter = {
    highlighterWidth: 35,
    highlighterColor: "rgba(255,255,0,0.4)",
    highlighterCap: "square",
    highlighterJoin: "milter",
}


// FEATURES

function clearScreen() {
    paper.project.layers[defaultLayer].removeChildren();
    paper.view.draw()
}

function erasingCleanUp(index) {
    paper.project.layers[defaultLayer].children[index].blendMode = 'destination-out';
}

// READY DOCUMENT
$(document).ready(function () {

    //Initialize Paper.js and Hammer.js

    var touch = new Hammer(document.getElementById("sketcharea"))
    paper.install(window);
    paper.setup(document.getElementById("sketcharea"));

    // Handle touch input
    touch.on("hammer.input", function (ev) {

        if (ev.isFirst) {
            if (ev.srcEvent.shiftKey)
                startErase();
            else
                startDraw();
        } else if (ev.isFinal) {
            if (ev.srcEvent.shiftKey)
                endErase(ev);
            else
                endDraw(ev);
        } else {
            if (ev.srcEvent.shiftKey)
                middleErase(ev);
            else
                middleDraw(ev);
        }
    });

    layer = new paper.Layer();
    layer.name = 'defaultLayer'

    paper.project.layers[defaultLayer].activate()

    // FUNCTIONS RELATED TO DRAWING

    function startDraw() {

        if (debug)
            console.log("Drawing Start");

        var drawPath;
        if (toolSelected == 'marker') {
            drawPath = new paper.Path({
                strokeColor: Marker.markerColor,
                strokeWidth: Marker.markerWidth * view.pixelRatio,
                strokeCap: Marker.markerCap,
                strokeJoin: Marker.markerJoin,
            });

            if (dottedStroke)
                drawPath.dashArray = [10, 12];
        } else if (toolSelected == 'highlighter') {
            drawPath = new Path({
                strokeWidth: Highlighter.highlighterWidth,
                strokeColor: Highlighter.highlighterColor,
                strokeCap: Highlighter.highlighterCap,
                storkeJoin: Highlighter.highlighterJoin
            });
        }

        let p = paper.project.layers[defaultLayer].addChild(drawPath);
        lastIndex = p.index;
    }

    const middleDraw = (ev) => {

        if (debug)
            console.log("Drawing...")

        if (lastIndex == -1)
            return
        paper.project.layers[defaultLayer].children[lastIndex].add({ x: ev.center.x, y: ev.center.y });

        paper.project.layers[defaultLayer].children[lastIndex].smooth()

    }

    const endDraw = (ev) => {

        if (debug)
            console.log("Drawing End")

        if (lastIndex == -1)
            return

        if (toolSelected == "marker")
        paper.project.layers[defaultLayer].children[lastIndex].simplify(Marker.markerSimplificationFactor);
        lastIndex = -1;
    }

    // FUNCTIONS RELATED TO ERASING

    function startErase() {

        if (debug)
            console.log("Erasing Start")

        var erasePath = new paper.Path({
            strokeWidth: Eraser.eraserWidth * view.pixelRatio,
            strokeCap: Eraser.eraserCap,
            strokeJoin: Eraser.eraserJoin,
            strokeColor: Eraser.eraserColor,
        });

        let p = paper.project.layers[defaultLayer].addChild(erasePath);
        lastIndex = p.index;
    }

    const middleErase = (ev) => {

        if (debug)
            console.log("Erasing...")

        if (lastIndex == -1)
            return

        paper.project.layers[defaultLayer].children[lastIndex].add({ x: ev.center.x, y: ev.center.y });
    }

    const endErase = (en) => {

        if (debug)
            console.log("Erasing End")

        if (lastIndex == -1)
            return

        erasingCleanUp(lastIndex);
        lastIndex = -1;
    }

});


