Math.degreeToRadians = function (deg) {
    return deg * 0.0174532925;
}

Math.radiansToDegree = function (rad) {
    return rad / 0.0174532925;
}

Math.pyth = function(a, b) {
    return Math.sqrt( Math.pow(a, 2) + Math.pow(b, 2) );
}

Math.lerp = function(t, s, e) {
    return s + t * (e-s)
}


Math.doublePI = Math.PI * 2;

Math.pointOnCircle = function(o, r, a) {
    return new Vector2(
        o.x + r * Math.cos(a),
        o.y + r * Math.sin(a)
    );
}

function Vector2(x, y) {
	this.x = x;
	this.y = y;
}

function Vector3(x, y, z) {
    
	this.x = x;
	this.y = y;
	this.z = z;
    
    this.add = function(a) {
        this.x += a;
        this.y += a;
        this.z += a;
    }
    
    this.substract = function(a) {
        this.x -= a;
        this.y -= a;
        this.z -= a;
    }
    
    this.multiply = function(a) {
        this.x *= a;
        this.y *= a;
        this.z *= a;
    }
    
    this.getMultiplied = function(a) {
        return new Vector3(
            this.x * a,
            this.y * a,
            this.z * a
        );
    }
    
    this.divide = function(a) {
        this.x /= a;
        this.y /= a;
        this.z /= a;
    }
    
    this.length = function() {
        return Math.sqrt(
            Math.pow(this.x, 2) +
            Math.pow(this.y, 2) +
            Math.pow(this.z, 2)
        );
    }
    
    this.normalize = function() {
        this.divide(this.length());
    }
    
    this.getNormalized = function() {
        var len = this.length();
        return new Vector3(
            this.x / len,
            this.y / len,
            this.z / len
        );
    }
    
    this.invert = function() {
        this.x *= -1;
        this.y *= -1;
        this.z *= -1;
    }
    
    this.getInverted = function() {
        return new Vector3(
            this.x * -1,
            this.y * -1,
            this.z * -1
        );
    }
    
    this.distance = function(v) {
        return Math.sqrt(
            Math.pow(v.x - this.x, 2) +
            Math.pow(v.y - this.y, 2) +
            Math.pow(v.z - this.z, 2)
        );
    }
    
    this.lerp = function(t, v) {
        return new Vector3(
            Math.lerp(t, this.x, v.x),
            Math.lerp(t, this.y, v.y),
            Math.lerp(t, this.z, v.z)
        );
    }
    
    this.substractVector = function(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
    }
    
    this.getSubstractedVector = function(v) {
        return new Vector3(
            this.x - v.x,
            this.y - v.y,
            this.z - v.z
        );
    }
    
    this.addVector = function(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
    }
    
    this.getAddedVector = function(v) {
        return new Vector3(
            this.x + v.x,
            this.y + v.y,
            this.z + v.z
        );
    }
    
    this.getTangentDirection = function() {
        return new Vector3(
            this.y,
           -this.x,
            this.z
        );
    }
    
}