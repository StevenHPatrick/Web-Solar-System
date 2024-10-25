/*
 * An object representing a 4d vector to make operations simple and concise.
 */

var Vector4 = function(x, y, z, w) {
	this.x = x; this.y = y; this.z = z; this.w = w;

	if (!(this instanceof Vector4)) {
    console.error("Vector4 constructor must be called with the 'new' operator");
	}

  // Make sure to set a default value in case x, y, z, w is not passed in
	if (!Number.isFinite(this.x)) {
		this.x = 0;
  }

	if (!Number.isFinite(this.y)) {
		this.y = 0;
  }

	if (!Number.isFinite(this.z)) {
		this.z = 0;
  }

	if (!Number.isFinite(this.w)) {
		this.w = 0;
	}
}

Vector4.prototype = {
  //----------------------------------------------------------------------------- 
	set: function(x, y, z, w) {
		this.x = x; this.y = y; this.z = z; this.w = w;
		return this;
	},

  //----------------------------------------------------------------------------- 
	clone: function() {
		return new Vector4(this.x, this.y, this.z, this.w);
	},

  //----------------------------------------------------------------------------- 
	copy: function(other) {
		this.x = other.x; this.y = other.y; this.z = other.z; this.w = other.w;
		return this;
	},

  //----------------------------------------------------------------------------- 
	add: function(v) {
		this.x += v.x; this.y += v.y; this.z += v.z; this.w += v.w;
		return this;
	},

  //----------------------------------------------------------------------------- 
	subtract: function(v) {
		this.x -= v.x; this.y -= v.y; this.z -= v.z; this.w -= v.w;
		return this;
	},

  //----------------------------------------------------------------------------- 
	negate: function() {
		this.x = -this.x; this.y = -this.y; this.z = -this.z; this.w = -this.w;
		return this;
	},

  //----------------------------------------------------------------------------- 
	multiplyScalar: function(scalar) {
		this.x *= scalar;
		this.y *= scalar;
    this.z *= scalar;
    this.w *= scalar;
		return this;
	},

  //----------------------------------------------------------------------------- 
	length: function() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
	},

  //----------------------------------------------------------------------------- 
	lengthSqr: function() {
		return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
	},

  //----------------------------------------------------------------------------- 
	normalize: function() {
		this.multiplyScalar(1 / this.length());
		return this;
	},

  //----------------------------------------------------------------------------- 
	dot: function(other) {
		return this.x * other.x + this.y * other.y + this.z * other.z + this.w * other.w;
  },

  //----------------------------------------------------------------------------- 
  fromTo: function(fromPoint, toPoint) {
    return toPoint.clone().subtract(fromPoint);
  },

  //----------------------------------------------------------------------------- 
  project: function(vectorToProject, otherVector) {
    var other01 = otherVector.clone().normalize();
    var projectionLength = vectorToProject.dot(other01);
    return other01.multiplyScalar(projectionLength);
  }
};

// EOF 00100001-10
