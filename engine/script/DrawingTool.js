var drawingTool = {};

function Line(from, to) {
    this.from = from;
    this.to   = to;
}

drawingTool.PixelUnitLine = function(cs, from, to, options) {
    
    cs.ctx.lineWidth = Math.floor(cs.optimalScreenDerivation);
    
    options = options || false;
    
    cs.ctx.strokeStyle = (options.color) ? options.color.getString() : 'black';
    
    cs.ctx.beginPath();
    cs.ctx.moveTo(from.x, from.y);
    cs.ctx.lineTo(to.x, to.y);
    cs.ctx.stroke();
    cs.ctx.closePath();
    
}

drawingTool.Line = function(cs, from, to, options) {
    drawingTool.PixelUnitLine(cs, cs.unitVectorToPixel(from), cs.unitVectorToPixel(to), options);
}

drawingTool.LineMesh = function(cs, vertices, connections, options) {
    for (var i = 0; i < connections.length; i+=2) {
        drawingTool.LineNoStroke(cs, vertices[connections[i]], vertices[connections[i+1]], options);
    }
    cs.ctx.stroke();
}

drawingTool.LineNoStroke = function(cs, from, to, options) {
    
    from = cs.unitVectorToPixel(from);
    to   = cs.unitVectorToPixel(to);
    
    cs.ctx.lineWidth = Math.floor(cs.optimalScreenDerivation);
    
    options = options || false;
    
    cs.ctx.strokeStyle = (options.color) ? options.color.getString() : 'black';
    
    cs.ctx.moveTo(from.x, from.y);
    cs.ctx.lineTo(to.x, to.y);
}

drawingTool.Label = function(cs, position, text, options) {
    options = options || false;
    var fontSize = (options.fontSize || 12) * cs.optimalScreenDerivation;
    position = cs.unitVectorToPixel(position);
    cs.ctx.font = fontSize+'px '+(options.font || 'sans-serif');
    var textSize = cs.ctx.measureText(text);
    if (text.charAt(0) == '-')
        position.x -= cs.ctx.measureText('-').width * 0.5;
    position.x -= textSize.width * 0.5;
    position.y += fontSize * 0.25;
    cs.ctx.fillStyle = (options.color) ? options.color.getString() : 'black';
    cs.ctx.fillText(text, position.x, position.y);
}

drawingTool.Rectangle = function(cs, position, size, options) {
    var points = [
        position,
        new Vector3(
            position.x + size.x,
            position.y,
            position.z
        ),
        new Vector3(
            position.x + size.x,
            position.y + size.y,
            position.z
        ),
        new Vector3(
            position.x,
            position.y + size.y,
            position.z
        )
    ];
    drawingTool.Line(cs, points[0], points[1], options);
    drawingTool.Line(cs, points[1], points[2], options);
    drawingTool.Line(cs, points[2], points[3], options);
    drawingTool.Line(cs, points[3], points[0], options);
}

drawingTool.Cuboid = function(cs, position, size, options) {
    drawingTool.LineMesh(cs,
        [
            position,
            new Vector3(position.x + size.x, position.y, position.z),
            new Vector3(position.x + size.x, position.y, position.z - size.z),
            new Vector3(position.x, position.y, position.z - size.z),
            new Vector3(position.x, position.y + size.y, position.z),
            new Vector3(position.x + size.x, position.y + size.y, position.z),
            new Vector3(position.x + size.x, position.y + size.y, position.z - size.z),
            new Vector3(position.x, position.y + size.y, position.z - size.z),
        ],
        [
            0, 1,
            1, 2,
            2, 3,
            3, 0,
            0, 4,
            1, 5,
            2, 6,
            3, 7,
            4, 5,
            5, 6,
            6, 7,
            7, 4
        ],
        options
    );
}

drawingTool.Triangle = function(cs, v1, v2, v3, options) {
    v1 = cs.unitVectorToPixel(v1);
    v2 = cs.unitVectorToPixel(v2);
    v3 = cs.unitVectorToPixel(v3);
    options = options || false;
    cs.ctx.fillStyle = (options.color) ? options.color.getString() : 'black';
    
    cs.ctx.beginPath();
    cs.ctx.moveTo(v1.x, v1.y);
    cs.ctx.lineTo(v2.x, v2.y);
    cs.ctx.lineTo(v3.x, v3.y);
    cs.ctx.lineTo(v1.x, v1.y);
    cs.ctx.closePath();
    
    cs.ctx.stroke();
    cs.ctx.fill();
}

drawingTool.Vector = function(cs, from, to, options) {
    options = options || false;
    drawingTool.Line(cs, from, to, options);
    
    //calculate tangent
    
    var stretch = new Vector3(
        to.x - from.x,
        to.y - from.y,
        to.z - from.z
    );
    
    var lineDirection = stretch.getNormalized();
    var tangentDirection = stretch.getTangentDirection().getNormalized();
    var pointOnLine = to.getSubstractedVector(lineDirection.getMultiplied(0.3));
    
    var shortenedTangentDirection = tangentDirection.getMultiplied(0.1);
    var p1 = pointOnLine.getAddedVector(shortenedTangentDirection);
    var p2 = pointOnLine.getSubstractedVector(shortenedTangentDirection);
    
    drawingTool.Triangle(cs,
        to,
        p1,
        p2,
        options
    );
    
    if (options.label) {
        var tangent2dDirection = new Vector3(tangentDirection.x, tangentDirection.y, 0);
        var middlePos = from.lerp(0.5, to).getAddedVector(tangent2dDirection.getMultiplied(0.1));
        middlePos.addVector(tangent2dDirection.getMultiplied(cs.ctx.measureText(options.label).width / cs.ppu.x * 0.5));
        drawingTool.Label(cs, middlePos, options.label, options);
    }
}

var function1dResolution = 0.1;
drawingTool.Function = function(cs, f, options) {
    var x, y, lastY = f(cs.viewport.start.x - 1);
    var resolution = function1dResolution * SETTINGS.zoom;
    for (x = cs.viewport.start.x; x <= cs.viewport.end.x; x+= resolution) {
        y = f(x);
        drawingTool.Line(cs,
            new Vector3(x-resolution, lastY, 0),
            new Vector3(x, y, 0),
            options
        );
        lastY = y;
    }
}

var function2dResolution = 0.1;
drawingTool.Function2d = function(cs, f, options) {
    var x, y, lastPos = new Vector3(
        cs.viewport.start.x - 1,
        f(cs.viewport.start.x - 1, cs.viewport.start.z - 1),
        cs.viewport.start.z - 1
    );
    
    var resolution = function1dResolution * SETTINGS.zoom;

    for (x = cs.viewport.start.x; x <= cs.viewport.end.x; x+= resolution) {
        for (z = cs.viewport.start.z; z <= cs.viewport.end.z; z+= resolution) {
            pos = new Vector3(x, f(x, z), z);
            drawingTool.LineNoStroke(cs,
                lastPos,
                pos,
                options
            );
            lastPos = pos;
        }
    }
    cs.ctx.stroke();
}

var circleResolution = Math.PI * 0.01;
drawingTool.Circle = function(cs, position, radius, options) {
    var point = Math.pointOnCircle(position, radius, 0);
    var lastPos = new Vector3(point.x, point.y, position.z);
    for (var i = 0; i < Math.doublePI; i += circleResolution) {
        point = Math.pointOnCircle(position, radius, i);
        pos = new Vector3(point.x, point.y, position.z);
        drawingTool.LineNoStroke(cs,
            lastPos,
            pos,
            options
        );
        lastPos = pos;
    }
    cs.ctx.stroke();
}

drawingTool.Tetrahedon = function(cs, position, width, height, options) {
    var halfWidth = width * 0.5;
    var depth = Math.asin((halfWidth) / width);
    drawingTool.LineMesh(cs,
        [
            position,
            new Vector3(position.x + width, position.y, position.z),
            new Vector3(position.x + halfWidth, position.y, position.z + depth),
            new Vector3(position.x + halfWidth, position.y + height, position.z + depth * 0.5)
        ],
        [
            0, 1,
            1, 2,
            2, 0,
            0, 3,
            1, 3,
            2, 3
        ],
        options
    );
}

drawingTool.Polygon = function(cs, position, radius, amount, options) {
    var anglePerIndex = Math.doublePI / amount;
    var point = Math.pointOnCircle(position, radius, -anglePerIndex);
    var lastPos = new Vector3(point.x, point.y, position.z);
    for (var a = 0; a < Math.doublePI; a+= anglePerIndex) {
        point = Math.pointOnCircle(position, radius, a);
        var pos = new Vector3(point.x, point.y, position.z);
        drawingTool.LineNoStroke(cs, lastPos, pos, options);
        lastPos = pos;
    }
    cs.ctx.stroke();
}