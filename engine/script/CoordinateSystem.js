function CoordinateSystem (screen, viewport, zoom, translation) {
	this.screen      = screen;
    this.ctx         = screen.getContext('2d');
    this.viewport    = {
        start: new Vector3(
            (viewport.start.x - 1 + translation.x) * SETTINGS.zoom,
            (viewport.start.y - 1 + translation.y) * SETTINGS.zoom,
            viewport.start.z - 1
        ),
        end:   new Vector3(
            (viewport.end.x + 1 + translation.x) * SETTINGS.zoom,
            (viewport.end.y + 1 + translation.y) * SETTINGS.zoom,
            viewport.end.z + 1
        )
    };
    this.size = new Vector3(
        this.viewport.end.x - this.viewport.start.x,
        this.viewport.end.y - this.viewport.start.y,
        this.viewport.end.z - this.viewport.start.z
    );
        
    this.zoom        = zoom;
    this.translation = new Vector3(translation.x, translation.y, translation.z);
    this.ppu         = new Vector3(0, 0); // pixels per unit
    
    this.screen.width  = window.innerWidth;
    this.screen.height = window.innerHeight;
    
    this.depthEnabled = true;
    this.disableDepth = function () { this.depthEnabled = false }
    
    
    this.calculateUnits = function() {
        var valueX = this.size.x / this.screen.width;
        var valueY = this.size.y / this.screen.height;
        this.optimalScreenDerivation = (valueX > valueY) ? screen.width / 800 / SETTINGS.zoom : screen.height / 800 / SETTINGS.zoom;
        if (valueY < valueX) {
            this.ppu.x = this.screen.width / (this.viewport.end.x - this.viewport.start.x);
        }else {
            this.ppu.x = this.screen.height / (this.viewport.end.y - this.viewport.start.y);
        }
        this.screen.width  = this.ppu.x * this.size.x;
        this.screen.height = this.ppu.x * this.size.y;
    }
    
    this.calculateUnits();
    
    this.unitVectorToPixel = function(v) {
        return new Vector2(
            ( v.x - v.z * 0.5 - this.viewport.start.x) * this.ppu.x,
            (-v.y + v.z * 0.5 + this.viewport.end.y)   * this.ppu.x
        );
    }
    
    var drawDetails =  (this.size.x / SETTINGS.style.squaresSize) * (this.size.y / SETTINGS.style.squaresSize) < 100000;
    
    this.clearScreen = function() {
        this.ctx.clearRect(0, 0, this.screen.width, this.screen.height);
    }
    
    this.drawSquares = function(color) {
        if (drawDetails) {
            for (var i=Math.floor(this.viewport.start.x) + SETTINGS.style.squaresSize; i<this.viewport.end.x; i+= SETTINGS.style.squaresSize) {
                drawingTool.Line( this,
                    new Vector3(i, this.viewport.start.y, 0),
                    new Vector3(i, this.viewport.end.y, 0)
                ,{color: SETTINGS.style.squaresColor});
            }
            for (var i=Math.floor(this.viewport.start.y) + SETTINGS.style.squaresSize; i<this.viewport.end.y; i+= SETTINGS.style.squaresSize) {
                drawingTool.Line( this,
                    new Vector3(this.viewport.start.x, i, 0),
                    new Vector3(this.viewport.end.x, i, 0)
                ,{color: SETTINGS.style.squaresColor});
            }
        }
    }
    
    this.setAxesColors = function(c1, c2, c3) {
        this.axesColors = new Vector3(c1, c2, c3);
    }
    
    this.drawAxes = function() {
        drawingTool.Line(this,
            new Vector3(this.viewport.start.x, 0, 0),
            new Vector3(this.viewport.end.x, 0, 0),
            {color: SETTINGS.style.axesColors.x}
        )
        drawingTool.Line(this,
            new Vector3(0, this.viewport.start.y, 0),
            new Vector3(0, this.viewport.end.y, 0),
            {color: SETTINGS.style.axesColors.y}
        )
        if (this.depthEnabled) {
            drawingTool.Line(this,
                new Vector3(0, 0, this.viewport.start.z),
                new Vector3(0, 0, this.viewport.end.z),
                {color: SETTINGS.style.axesColors.z}
            )
        }
    }
    
    this.labelAxes = function() {
        if (drawDetails) {
            for (var i=Math.floor(this.viewport.start.x) + 1; i<this.viewport.end.x; i++) {
                if (i != 0) {
                    drawingTool.Line(this, new Vector3(i, -0.05, 0), new Vector3(i, 0.05, 0), {color: SETTINGS.style.axesColors.x});
                    if (i != this.viewport.end.x - 1)
                        drawingTool.Line(this, new Vector3(i + 0.5, -0.025, 0), new Vector3(i + 0.5, 0.025, 0), {color: SETTINGS.style.axesColors.x});
                    drawingTool.Label(this, new Vector3(i, -0.2, 0), i.toString(), {color: SETTINGS.style.axesColors.x});
                }
            }
            for (var i=Math.floor(this.viewport.start.y) + 1; i<this.viewport.end.y; i++) {
                if (i != 0) {
                    drawingTool.Line(this, new Vector3(-0.05, i, 0), new Vector3(0.05, i, 0), {color: SETTINGS.style.axesColors.y});
                    if (i != this.viewport.end.y - 1)
                        drawingTool.Line(this, new Vector3(-0.025, i + 0.5, 0), new Vector3(0.025, i + 0.5, 0), {color: SETTINGS.style.axesColors.y});
                    drawingTool.Label(this, new Vector3(0.2, i, 0), i.toString(), {color: SETTINGS.style.axesColors.y});
                }
            }
            if (this.depthEnabled) {
                for (var i=this.viewport.start.z + 1; i<this.viewport.end.z; i++) {
                    if (i != 0) {
                        drawingTool.Line(this, new Vector3(0, -0.05, i), new Vector3(0, 0.05, i), {color: SETTINGS.style.axesColors.z});
                        if (i != this.viewport.end.z - 1)
                            drawingTool.Line(this, new Vector3(0, -0.025, i + 0.5), new Vector3(0, 0.025, i + 0.5), {color: SETTINGS.style.axesColors.z});
                        drawingTool.Label(this, new Vector3(0, -0.2, i), i.toString(), {color: SETTINGS.style.axesColors.z});
                    }
                }
            }
        }
    }
    
    this.drawVector = function(from, to, options) {
        drawingTool.Vector(this, from, to, options);
    }
    
    this.drawRectangle = function(position, size, options) {
        drawingTool.Rectangle(this, position, size, options);   
    }
    
    this.drawCuboid = function(position, size, options) {
        drawingTool.Cuboid(this, position, size, options);   
    }
    
    this.drawFunction = function(f, options) {
        drawingTool.Function(this, f, options);   
    }
    
    this.drawFunction2d = function(f, options) {
        drawingTool.Function2d(this, f, options);   
    }
    
    this.drawCircle = function(position, radius, options) {
        drawingTool.Circle(this, position, radius, options);
    }
    
    this.drawTetrahedon = function(position, width, height, options) {
        drawingTool.Tetrahedon(this, position, width, height, options);
    }
    
    this.drawPolygon = function(position, radius, amount) {
        drawingTool.Polygon(this, position, radius, amount);
    }
}
