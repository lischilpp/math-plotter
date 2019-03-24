function draw() { // hier kommen befehle rein
    //CS.disableDepth();
    CS.drawSquares();
    CS.drawAxes();
    CS.labelAxes();
    /*CS.drawVector(
        new Vector3(1, 2, 0),
        new Vector3(0, 0, 0),
        {color: Color.Orange, label: 'Vektor v2'}
    );*/
    /*CS.drawRectangle(
        new Vector3(0, 0, 0),
        new Vector2(1, 1)
    );*/
    /*CS.drawCircle(
        new Vector3(0, 0, 0),
        1,
        { color: Color.Purple }
    );*/
    /*CS.drawCuboid(
        new Vector3(0, 0, 0),
        new Vector3(1, 1, 1),
        {color: Color.Orange}
    );*/
    /*CS.drawTetrahedon(
        new Vector3(0, 0, 0),
        2,
        4,
        {color: Color.Orange}
    );*/
    CS.drawFunction(function(x) {
        return Math.sin(x) + Math.pow(x, 2) * 0.01;
    });
    /*CS.drawFunction2d(function(x, z) {
        //return Math.sin(x) + Math.sin(z);
        return 0.5*Math.sin(6.28*(x+2*z)/6)+Math.cos(6.28*(x+z)/6)+0.5*Math.sin(6.28*(2*x+z)/6);
    });*/
    
    /*CS.drawPolygon(
        new Vector3(0, 0, 0),
        2,
        5
    );*/
    
}



/*var polyCount = 1;
var drawAnimation = true;

function draw() { // hier kommen befehle rein
    CS.clearScreen();
    CS.drawSquares();
    CS.drawAxes();
    CS.labelAxes();
    
    polyCount += 0.01;
    
    CS.drawPolygon(
        new Vector3(0, 0, 0),
        3,
        polyCount
    );
    
    if (drawAnimation)
        window.requestAnimationFrame(draw);
}*/



