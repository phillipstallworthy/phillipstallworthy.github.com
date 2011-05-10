/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/

/*
	This is an optimized version of Dojo, built for deployment and not for
	development. To get sources and documentation, please visit:

		http://dojotoolkit.org
*/

if(!dojo._hasResource["dojox.gfx.matrix"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojox.gfx.matrix"] = true;
dojo.provide("dojox.gfx.matrix");

(function(){
	var m = dojox.gfx.matrix;

	// candidates for dojox.math:
	var _degToRadCache = {};
	m._degToRad = function(degree){
		return _degToRadCache[degree] || (_degToRadCache[degree] = (Math.PI * degree / 180));
	};
	m._radToDeg = function(radian){ return radian / Math.PI * 180; };

	m.Matrix2D = function(arg){
		// summary: a 2D matrix object
		// description: Normalizes a 2D matrix-like object. If arrays is passed,
		//		all objects of the array are normalized and multiplied sequentially.
		// arg: Object
		//		a 2D matrix-like object, a number, or an array of such objects
		if(arg){
			if(typeof arg == "number"){
				this.xx = this.yy = arg;
			}else if(arg instanceof Array){
				if(arg.length > 0){
					var matrix = m.normalize(arg[0]);
					// combine matrices
					for(var i = 1; i < arg.length; ++i){
						var l = matrix, r = dojox.gfx.matrix.normalize(arg[i]);
						matrix = new m.Matrix2D();
						matrix.xx = l.xx * r.xx + l.xy * r.yx;
						matrix.xy = l.xx * r.xy + l.xy * r.yy;
						matrix.yx = l.yx * r.xx + l.yy * r.yx;
						matrix.yy = l.yx * r.xy + l.yy * r.yy;
						matrix.dx = l.xx * r.dx + l.xy * r.dy + l.dx;
						matrix.dy = l.yx * r.dx + l.yy * r.dy + l.dy;
					}
					dojo.mixin(this, matrix);
				}
			}else{
				dojo.mixin(this, arg);
			}
		}
	};

	// the default (identity) matrix, which is used to fill in missing values
	dojo.extend(m.Matrix2D, {xx: 1, xy: 0, yx: 0, yy: 1, dx: 0, dy: 0});

	dojo.mixin(m, {
		// summary: class constants, and methods of dojox.gfx.matrix

		// matrix constants

		// identity: dojox.gfx.matrix.Matrix2D
		//		an identity matrix constant: identity * (x, y) == (x, y)
		identity: new m.Matrix2D(),

		// flipX: dojox.gfx.matrix.Matrix2D
		//		a matrix, which reflects points at x = 0 line: flipX * (x, y) == (-x, y)
		flipX:    new m.Matrix2D({xx: -1}),

		// flipY: dojox.gfx.matrix.Matrix2D
		//		a matrix, which reflects points at y = 0 line: flipY * (x, y) == (x, -y)
		flipY:    new m.Matrix2D({yy: -1}),

		// flipXY: dojox.gfx.matrix.Matrix2D
		//		a matrix, which reflects points at the origin of coordinates: flipXY * (x, y) == (-x, -y)
		flipXY:   new m.Matrix2D({xx: -1, yy: -1}),

		// matrix creators

		translate: function(a, b){
			// summary: forms a translation matrix
			// description: The resulting matrix is used to translate (move) points by specified offsets.
			// a: Number: an x coordinate value
			// b: Number: a y coordinate value
			if(arguments.length > 1){
				return new m.Matrix2D({dx: a, dy: b}); // dojox.gfx.matrix.Matrix2D
			}
			// branch
			// a: dojox.gfx.Point: a point-like object, which specifies offsets for both dimensions
			// b: null
			return new m.Matrix2D({dx: a.x, dy: a.y}); // dojox.gfx.matrix.Matrix2D
		},
		scale: function(a, b){
			// summary: forms a scaling matrix
			// description: The resulting matrix is used to scale (magnify) points by specified offsets.
			// a: Number: a scaling factor used for the x coordinate
			// b: Number: a scaling factor used for the y coordinate
			if(arguments.length > 1){
				return new m.Matrix2D({xx: a, yy: b}); // dojox.gfx.matrix.Matrix2D
			}
			if(typeof a == "number"){
				// branch
				// a: Number: a uniform scaling factor used for the both coordinates
				// b: null
				return new m.Matrix2D({xx: a, yy: a}); // dojox.gfx.matrix.Matrix2D
			}
			// branch
			// a: dojox.gfx.Point: a point-like object, which specifies scale factors for both dimensions
			// b: null
			return new m.Matrix2D({xx: a.x, yy: a.y}); // dojox.gfx.matrix.Matrix2D
		},
		rotate: function(angle){
			// summary: forms a rotating matrix
			// description: The resulting matrix is used to rotate points
			//		around the origin of coordinates (0, 0) by specified angle.
			// angle: Number: an angle of rotation in radians (>0 for CW)
			var c = Math.cos(angle);
			var s = Math.sin(angle);
			return new m.Matrix2D({xx: c, xy: -s, yx: s, yy: c}); // dojox.gfx.matrix.Matrix2D
		},
		rotateg: function(degree){
			// summary: forms a rotating matrix
			// description: The resulting matrix is used to rotate points
			//		around the origin of coordinates (0, 0) by specified degree.
			//		See dojox.gfx.matrix.rotate() for comparison.
			// degree: Number: an angle of rotation in degrees (>0 for CW)
			return m.rotate(m._degToRad(degree)); // dojox.gfx.matrix.Matrix2D
		},
		skewX: function(angle) {
			// summary: forms an x skewing matrix
			// description: The resulting matrix is used to skew points in the x dimension
			//		around the origin of coordinates (0, 0) by specified angle.
			// angle: Number: an skewing angle in radians
			return new m.Matrix2D({xy: Math.tan(angle)}); // dojox.gfx.matrix.Matrix2D
		},
		skewXg: function(degree){
			// summary: forms an x skewing matrix
			// description: The resulting matrix is used to skew points in the x dimension
			//		around the origin of coordinates (0, 0) by specified degree.
			//		See dojox.gfx.matrix.skewX() for comparison.
			// degree: Number: an skewing angle in degrees
			return m.skewX(m._degToRad(degree)); // dojox.gfx.matrix.Matrix2D
		},
		skewY: function(angle){
			// summary: forms a y skewing matrix
			// description: The resulting matrix is used to skew points in the y dimension
			//		around the origin of coordinates (0, 0) by specified angle.
			// angle: Number: an skewing angle in radians
			return new m.Matrix2D({yx: Math.tan(angle)}); // dojox.gfx.matrix.Matrix2D
		},
		skewYg: function(degree){
			// summary: forms a y skewing matrix
			// description: The resulting matrix is used to skew points in the y dimension
			//		around the origin of coordinates (0, 0) by specified degree.
			//		See dojox.gfx.matrix.skewY() for comparison.
			// degree: Number: an skewing angle in degrees
			return m.skewY(m._degToRad(degree)); // dojox.gfx.matrix.Matrix2D
		},
		reflect: function(a, b){
			// summary: forms a reflection matrix
			// description: The resulting matrix is used to reflect points around a vector,
			//		which goes through the origin.
			// a: dojox.gfx.Point: a point-like object, which specifies a vector of reflection
			// b: null
			if(arguments.length == 1){
				b = a.y;
				a = a.x;
			}
			// branch
			// a: Number: an x coordinate value
			// b: Number: a y coordinate value

			// make a unit vector
			var a2 = a * a, b2 = b * b, n2 = a2 + b2, xy = 2 * a * b / n2;
			return new m.Matrix2D({xx: 2 * a2 / n2 - 1, xy: xy, yx: xy, yy: 2 * b2 / n2 - 1}); // dojox.gfx.matrix.Matrix2D
		},
		project: function(a, b){
			// summary: forms an orthogonal projection matrix
			// description: The resulting matrix is used to project points orthogonally on a vector,
			//		which goes through the origin.
			// a: dojox.gfx.Point: a point-like object, which specifies a vector of projection
			// b: null
			if(arguments.length == 1){
				b = a.y;
				a = a.x;
			}
			// branch
			// a: Number: an x coordinate value
			// b: Number: a y coordinate value

			// make a unit vector
			var a2 = a * a, b2 = b * b, n2 = a2 + b2, xy = a * b / n2;
			return new m.Matrix2D({xx: a2 / n2, xy: xy, yx: xy, yy: b2 / n2}); // dojox.gfx.matrix.Matrix2D
		},

		// ensure matrix 2D conformance
		normalize: function(matrix){
			// summary: converts an object to a matrix, if necessary
			// description: Converts any 2D matrix-like object or an array of
			//		such objects to a valid dojox.gfx.matrix.Matrix2D object.
			// matrix: Object: an object, which is converted to a matrix, if necessary
			return (matrix instanceof m.Matrix2D) ? matrix : new m.Matrix2D(matrix); // dojox.gfx.matrix.Matrix2D
		},

		// common operations

		clone: function(matrix){
			// summary: creates a copy of a 2D matrix
			// matrix: dojox.gfx.matrix.Matrix2D: a 2D matrix-like object to be cloned
			var obj = new m.Matrix2D();
			for(var i in matrix){
				if(typeof(matrix[i]) == "number" && typeof(obj[i]) == "number" && obj[i] != matrix[i]) obj[i] = matrix[i];
			}
			return obj; // dojox.gfx.matrix.Matrix2D
		},
		invert: function(matrix){
			// summary: inverts a 2D matrix
			// matrix: dojox.gfx.matrix.Matrix2D: a 2D matrix-like object to be inverted
			var M = m.normalize(matrix),
				D = M.xx * M.yy - M.xy * M.yx,
				M = new m.Matrix2D({
					xx: M.yy/D, xy: -M.xy/D,
					yx: -M.yx/D, yy: M.xx/D,
					dx: (M.xy * M.dy - M.yy * M.dx) / D,
					dy: (M.yx * M.dx - M.xx * M.dy) / D
				});
			return M; // dojox.gfx.matrix.Matrix2D
		},
		_multiplyPoint: function(matrix, x, y){
			// summary: applies a matrix to a point
			// matrix: dojox.gfx.matrix.Matrix2D: a 2D matrix object to be applied
			// x: Number: an x coordinate of a point
			// y: Number: a y coordinate of a point
			return {x: matrix.xx * x + matrix.xy * y + matrix.dx, y: matrix.yx * x + matrix.yy * y + matrix.dy}; // dojox.gfx.Point
		},
		multiplyPoint: function(matrix, /* Number||Point */ a, /* Number, optional */ b){
			// summary: applies a matrix to a point
			// matrix: dojox.gfx.matrix.Matrix2D: a 2D matrix object to be applied
			// a: Number: an x coordinate of a point
			// b: Number: a y coordinate of a point
			var M = m.normalize(matrix);
			if(typeof a == "number" && typeof b == "number"){
				return m._multiplyPoint(M, a, b); // dojox.gfx.Point
			}
			// branch
			// matrix: dojox.gfx.matrix.Matrix2D: a 2D matrix object to be applied
			// a: dojox.gfx.Point: a point
			// b: null
			return m._multiplyPoint(M, a.x, a.y); // dojox.gfx.Point
		},
		multiply: function(matrix){
			// summary: combines matrices by multiplying them sequentially in the given order
			// matrix: dojox.gfx.matrix.Matrix2D...: a 2D matrix-like object,
			//		all subsequent arguments are matrix-like objects too
			var M = m.normalize(matrix);
			// combine matrices
			for(var i = 1; i < arguments.length; ++i){
				var l = M, r = m.normalize(arguments[i]);
				M = new m.Matrix2D();
				M.xx = l.xx * r.xx + l.xy * r.yx;
				M.xy = l.xx * r.xy + l.xy * r.yy;
				M.yx = l.yx * r.xx + l.yy * r.yx;
				M.yy = l.yx * r.xy + l.yy * r.yy;
				M.dx = l.xx * r.dx + l.xy * r.dy + l.dx;
				M.dy = l.yx * r.dx + l.yy * r.dy + l.dy;
			}
			return M; // dojox.gfx.matrix.Matrix2D
		},

		// high level operations

		_sandwich: function(matrix, x, y){
			// summary: applies a matrix at a centrtal point
			// matrix: dojox.gfx.matrix.Matrix2D: a 2D matrix-like object, which is applied at a central point
			// x: Number: an x component of the central point
			// y: Number: a y component of the central point
			return m.multiply(m.translate(x, y), matrix, m.translate(-x, -y)); // dojox.gfx.matrix.Matrix2D
		},
		scaleAt: function(a, b, c, d){
			// summary: scales a picture using a specified point as a center of scaling
			// description: Compare with dojox.gfx.matrix.scale().
			// a: Number: a scaling factor used for the x coordinate
			// b: Number: a scaling factor used for the y coordinate
			// c: Number: an x component of a central point
			// d: Number: a y component of a central point

			// accepts several signatures:
			//	1) uniform scale factor, Point
			//	2) uniform scale factor, x, y
			//	3) x scale, y scale, Point
			//	4) x scale, y scale, x, y

			switch(arguments.length){
				case 4:
					// a and b are scale factor components, c and d are components of a point
					return m._sandwich(m.scale(a, b), c, d); // dojox.gfx.matrix.Matrix2D
				case 3:
					if(typeof c == "number"){
						// branch
						// a: Number: a uniform scaling factor used for both coordinates
						// b: Number: an x component of a central point
						// c: Number: a y component of a central point
						// d: null
						return m._sandwich(m.scale(a), b, c); // dojox.gfx.matrix.Matrix2D
					}
					// branch
					// a: Number: a scaling factor used for the x coordinate
					// b: Number: a scaling factor used for the y coordinate
					// c: dojox.gfx.Point: a central point
					// d: null
					return m._sandwich(m.scale(a, b), c.x, c.y); // dojox.gfx.matrix.Matrix2D
			}
			// branch
			// a: Number: a uniform scaling factor used for both coordinates
			// b: dojox.gfx.Point: a central point
			// c: null
			// d: null
			return m._sandwich(m.scale(a), b.x, b.y); // dojox.gfx.matrix.Matrix2D
		},
		rotateAt: function(angle, a, b){
			// summary: rotates a picture using a specified point as a center of rotation
			// description: Compare with dojox.gfx.matrix.rotate().
			// angle: Number: an angle of rotation in radians (>0 for CW)
			// a: Number: an x component of a central point
			// b: Number: a y component of a central point

			// accepts several signatures:
			//	1) rotation angle in radians, Point
			//	2) rotation angle in radians, x, y

			if(arguments.length > 2){
				return m._sandwich(m.rotate(angle), a, b); // dojox.gfx.matrix.Matrix2D
			}

			// branch
			// angle: Number: an angle of rotation in radians (>0 for CCW)
			// a: dojox.gfx.Point: a central point
			// b: null
			return m._sandwich(m.rotate(angle), a.x, a.y); // dojox.gfx.matrix.Matrix2D
		},
		rotategAt: function(degree, a, b){
			// summary: rotates a picture using a specified point as a center of rotation
			// description: Compare with dojox.gfx.matrix.rotateg().
			// degree: Number: an angle of rotation in degrees (>0 for CW)
			// a: Number: an x component of a central point
			// b: Number: a y component of a central point

			// accepts several signatures:
			//	1) rotation angle in degrees, Point
			//	2) rotation angle in degrees, x, y

			if(arguments.length > 2){
				return m._sandwich(m.rotateg(degree), a, b); // dojox.gfx.matrix.Matrix2D
			}

			// branch
			// degree: Number: an angle of rotation in degrees (>0 for CCW)
			// a: dojox.gfx.Point: a central point
			// b: null
			return m._sandwich(m.rotateg(degree), a.x, a.y); // dojox.gfx.matrix.Matrix2D
		},
		skewXAt: function(angle, a, b){
			// summary: skews a picture along the x axis using a specified point as a center of skewing
			// description: Compare with dojox.gfx.matrix.skewX().
			// angle: Number: an skewing angle in radians
			// a: Number: an x component of a central point
			// b: Number: a y component of a central point

			// accepts several signatures:
			//	1) skew angle in radians, Point
			//	2) skew angle in radians, x, y

			if(arguments.length > 2){
				return m._sandwich(m.skewX(angle), a, b); // dojox.gfx.matrix.Matrix2D
			}

			// branch
			// angle: Number: an skewing angle in radians
			// a: dojox.gfx.Point: a central point
			// b: null
			return m._sandwich(m.skewX(angle), a.x, a.y); // dojox.gfx.matrix.Matrix2D
		},
		skewXgAt: function(degree, a, b){
			// summary: skews a picture along the x axis using a specified point as a center of skewing
			// description: Compare with dojox.gfx.matrix.skewXg().
			// degree: Number: an skewing angle in degrees
			// a: Number: an x component of a central point
			// b: Number: a y component of a central point

			// accepts several signatures:
			//	1) skew angle in degrees, Point
			//	2) skew angle in degrees, x, y

			if(arguments.length > 2){
				return m._sandwich(m.skewXg(degree), a, b); // dojox.gfx.matrix.Matrix2D
			}

			// branch
			// degree: Number: an skewing angle in degrees
			// a: dojox.gfx.Point: a central point
			// b: null
			return m._sandwich(m.skewXg(degree), a.x, a.y); // dojox.gfx.matrix.Matrix2D
		},
		skewYAt: function(angle, a, b){
			// summary: skews a picture along the y axis using a specified point as a center of skewing
			// description: Compare with dojox.gfx.matrix.skewY().
			// angle: Number: an skewing angle in radians
			// a: Number: an x component of a central point
			// b: Number: a y component of a central point

			// accepts several signatures:
			//	1) skew angle in radians, Point
			//	2) skew angle in radians, x, y

			if(arguments.length > 2){
				return m._sandwich(m.skewY(angle), a, b); // dojox.gfx.matrix.Matrix2D
			}

			// branch
			// angle: Number: an skewing angle in radians
			// a: dojox.gfx.Point: a central point
			// b: null
			return m._sandwich(m.skewY(angle), a.x, a.y); // dojox.gfx.matrix.Matrix2D
		},
		skewYgAt: function(/* Number */ degree, /* Number||Point */ a, /* Number, optional */ b){
			// summary: skews a picture along the y axis using a specified point as a center of skewing
			// description: Compare with dojox.gfx.matrix.skewYg().
			// degree: Number: an skewing angle in degrees
			// a: Number: an x component of a central point
			// b: Number: a y component of a central point

			// accepts several signatures:
			//	1) skew angle in degrees, Point
			//	2) skew angle in degrees, x, y

			if(arguments.length > 2){
				return m._sandwich(m.skewYg(degree), a, b); // dojox.gfx.matrix.Matrix2D
			}

			// branch
			// degree: Number: an skewing angle in degrees
			// a: dojox.gfx.Point: a central point
			// b: null
			return m._sandwich(m.skewYg(degree), a.x, a.y); // dojox.gfx.matrix.Matrix2D
		}

		//TODO: rect-to-rect mapping, scale-to-fit (isotropic and anisotropic versions)

	});
})();

// propagate Matrix2D up
dojox.gfx.Matrix2D = dojox.gfx.matrix.Matrix2D;

}

if(!dojo._hasResource["dojox.gfx._base"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojox.gfx._base"] = true;
dojo.provide("dojox.gfx._base");

(function(){
	var g = dojox.gfx, b = g._base;

	// candidates for dojox.style (work on VML and SVG nodes)
	g._hasClass = function(/*DomNode*/node, /*String*/classStr){
		//	summary:
		//		Returns whether or not the specified classes are a portion of the
		//		class list currently applied to the node.
		// return (new RegExp('(^|\\s+)'+classStr+'(\\s+|$)')).test(node.className)	// Boolean
		var cls = node.getAttribute("className");
		return cls && (" " + cls + " ").indexOf(" " + classStr + " ") >= 0;  // Boolean
	};
	g._addClass = function(/*DomNode*/node, /*String*/classStr){
		//	summary:
		//		Adds the specified classes to the end of the class list on the
		//		passed node.
		var cls = node.getAttribute("className") || "";
		if(!cls || (" " + cls + " ").indexOf(" " + classStr + " ") < 0){
			node.setAttribute("className", cls + (cls ? " " : "") + classStr);
		}
	};
	g._removeClass = function(/*DomNode*/node, /*String*/classStr){
		//	summary: Removes classes from node.
		var cls = node.getAttribute("className");
		if(cls){
			node.setAttribute(
				"className",
				cls.replace(new RegExp('(^|\\s+)' + classStr + '(\\s+|$)'), "$1$2")
			);
		}
	};

	// candidate for dojox.html.metrics (dynamic font resize handler is not implemented here)

	//	derived from Morris John's emResized measurer
	b._getFontMeasurements = function(){
		//	summary:
		//		Returns an object that has pixel equivilents of standard font
		//		size values.
		var heights = {
			'1em': 0, '1ex': 0, '100%': 0, '12pt': 0, '16px': 0, 'xx-small': 0,
			'x-small': 0, 'small': 0, 'medium': 0, 'large': 0, 'x-large': 0,
			'xx-large': 0
		};

		if(dojo.isIE){
			//	we do a font-size fix if and only if one isn't applied already.
			//	NOTE: If someone set the fontSize on the HTML Element, this will kill it.
			dojo.doc.documentElement.style.fontSize="100%";
		}

		//	set up the measuring node.
		var div = dojo.create("div", {style: {
				position: "absolute",
				left: "0",
				top: "-100px",
				width: "30px",
				height: "1000em",
				borderWidth: "0",
				margin: "0",
				padding: "0",
				outline: "none",
				lineHeight: "1",
				overflow: "hidden"
			}}, dojo.body());

		//	do the measurements.
		for(var p in heights){
			div.style.fontSize = p;
			heights[p] = Math.round(div.offsetHeight * 12/16) * 16/12 / 1000;
		}

		dojo.body().removeChild(div);
		return heights; 	//	object
	};

	var fontMeasurements = null;

	b._getCachedFontMeasurements = function(recalculate){
		if(recalculate || !fontMeasurements){
			fontMeasurements = b._getFontMeasurements();
		}
		return fontMeasurements;
	};

	// candidate for dojox.html.metrics

	var measuringNode = null, empty = {};
	b._getTextBox = function(	/*String*/ text,
								/*Object*/ style,
								/*String?*/ className){
		var m, s, al = arguments.length;
		if(!measuringNode){
			measuringNode = dojo.create("div", {style: {
				position: "absolute",
				top: "-10000px",
				left: "0"
			}}, dojo.body());
		}
		m = measuringNode;
		// reset styles
		m.className = "";
		s = m.style;
		s.borderWidth = "0";
		s.margin = "0";
		s.padding = "0";
		s.outline = "0";
		// set new style
		if(al > 1 && style){
			for(var i in style){
				if(i in empty){ continue; }
				s[i] = style[i];
			}
		}
		// set classes
		if(al > 2 && className){
			m.className = className;
		}
		// take a measure
		m.innerHTML = text;

		if(m["getBoundingClientRect"]){
			var bcr = m.getBoundingClientRect();
			return {l: bcr.left, t: bcr.top, w: bcr.width || (bcr.right - bcr.left), h: bcr.height || (bcr.bottom - bcr.top)};
		}else{
			return dojo.marginBox(m);
		}
	};

	// candidate for dojo.dom

	var uniqueId = 0;
	b._getUniqueId = function(){
		// summary: returns a unique string for use with any DOM element
		var id;
		do{
			id = dojo._scopeName + "Unique" + (++uniqueId);
		}while(dojo.byId(id));
		return id;
	};
})();

dojo.mixin(dojox.gfx, {
	//	summary:
	// 		defines constants, prototypes, and utility functions

	// default shapes, which are used to fill in missing parameters
	defaultPath: {
		type: "path", path: ""
	},
	defaultPolyline: {
		type: "polyline", points: []
	},
	defaultRect: {
		type: "rect", x: 0, y: 0, width: 100, height: 100, r: 0
	},
	defaultEllipse: {
		type: "ellipse", cx: 0, cy: 0, rx: 200, ry: 100
	},
	defaultCircle: {
		type: "circle", cx: 0, cy: 0, r: 100
	},
	defaultLine: {
		type: "line", x1: 0, y1: 0, x2: 100, y2: 100
	},
	defaultImage: {
		type: "image", x: 0, y: 0, width: 0, height: 0, src: ""
	},
	defaultText: {
		type: "text", x: 0, y: 0, text: "", align: "start",
		decoration: "none", rotated: false, kerning: true
	},
	defaultTextPath: {
		type: "textpath", text: "", align: "start",
		decoration: "none", rotated: false, kerning: true
	},

	// default geometric attributes
	defaultStroke: {
		type: "stroke", color: "black", style: "solid", width: 1,
		cap: "butt", join: 4
	},
	defaultLinearGradient: {
		type: "linear", x1: 0, y1: 0, x2: 100, y2: 100,
		colors: [
			{ offset: 0, color: "black" }, { offset: 1, color: "white" }
		]
	},
	defaultRadialGradient: {
		type: "radial", cx: 0, cy: 0, r: 100,
		colors: [
			{ offset: 0, color: "black" }, { offset: 1, color: "white" }
		]
	},
	defaultPattern: {
		type: "pattern", x: 0, y: 0, width: 0, height: 0, src: ""
	},
	defaultFont: {
		type: "font", style: "normal", variant: "normal",
		weight: "normal", size: "10pt", family: "serif"
	},

	getDefault: (function(){
		var typeCtorCache = {};
		// a memoized delegate()
		return function(/*String*/ type){
			var t = typeCtorCache[type];
			if(t){
				return new t();
			}
			t = typeCtorCache[type] = new Function;
			t.prototype = dojox.gfx[ "default" + type ];
			return new t();
		}
	})(),

	normalizeColor: function(/*Color*/ color){
		//	summary:
		// 		converts any legal color representation to normalized
		// 		dojo.Color object
		return (color instanceof dojo.Color) ? color : new dojo.Color(color); // dojo.Color
	},
	normalizeParameters: function(existed, update){
		//	summary:
		// 		updates an existing object with properties from an "update"
		// 		object
		//	existed: Object
		//		the "target" object to be updated
		//	update:  Object
		//		the "update" object, whose properties will be used to update
		//		the existed object
		if(update){
			var empty = {};
			for(var x in existed){
				if(x in update && !(x in empty)){
					existed[x] = update[x];
				}
			}
		}
		return existed;	// Object
	},
	makeParameters: function(defaults, update){
		//	summary:
		// 		copies the original object, and all copied properties from the
		// 		"update" object
		//	defaults: Object
		//		the object to be cloned before updating
		//	update:   Object
		//		the object, which properties are to be cloned during updating
		if(!update){
			// return dojo.clone(defaults);
			return dojo.delegate(defaults);
		}
		var result = {};
		for(var i in defaults){
			if(!(i in result)){
				result[i] = dojo.clone((i in update) ? update[i] : defaults[i]);
			}
		}
		return result; // Object
	},
	formatNumber: function(x, addSpace){
		// summary: converts a number to a string using a fixed notation
		// x:			Number:		number to be converted
		// addSpace:	Boolean?:	if it is true, add a space before a positive number
		var val = x.toString();
		if(val.indexOf("e") >= 0){
			val = x.toFixed(4);
		}else{
			var point = val.indexOf(".");
			if(point >= 0 && val.length - point > 5){
				val = x.toFixed(4);
			}
		}
		if(x < 0){
			return val; // String
		}
		return addSpace ? " " + val : val; // String
	},
	// font operations
	makeFontString: function(font){
		// summary: converts a font object to a CSS font string
		// font:	Object:	font object (see dojox.gfx.defaultFont)
		return font.style + " " + font.variant + " " + font.weight + " " + font.size + " " + font.family; // Object
	},
	splitFontString: function(str){
		// summary:
		//		converts a CSS font string to a font object
		// description:
		//		Converts a CSS font string to a gfx font object. The CSS font
		//		string components should follow the W3C specified order
		//		(see http://www.w3.org/TR/CSS2/fonts.html#font-shorthand):
		//		style, variant, weight, size, optional line height (will be
		//		ignored), and family.
		// str: String
		//		a CSS font string
		var font = dojox.gfx.getDefault("Font");
		var t = str.split(/\s+/);
		do{
			if(t.length < 5){ break; }
			font.style   = t[0];
			font.variant = t[1];
			font.weight  = t[2];
			var i = t[3].indexOf("/");
			font.size = i < 0 ? t[3] : t[3].substring(0, i);
			var j = 4;
			if(i < 0){
				if(t[4] == "/"){
					j = 6;
				}else if(t[4].charAt(0) == "/"){
					j = 5;
				}
			}
			if(j < t.length){
				font.family = t.slice(j).join(" ");
			}
		}while(false);
		return font;	// Object
	},
	// length operations
	cm_in_pt: 72 / 2.54,	// Number: points per centimeter
	mm_in_pt: 7.2 / 2.54,	// Number: points per millimeter
	px_in_pt: function(){
		// summary: returns a number of pixels per point
		return dojox.gfx._base._getCachedFontMeasurements()["12pt"] / 12;	// Number
	},
	pt2px: function(len){
		// summary: converts points to pixels
		// len: Number: a value in points
		return len * dojox.gfx.px_in_pt();	// Number
	},
	px2pt: function(len){
		// summary: converts pixels to points
		// len: Number: a value in pixels
		return len / dojox.gfx.px_in_pt();	// Number
	},
	normalizedLength: function(len) {
		// summary: converts any length value to pixels
		// len: String: a length, e.g., "12pc"
		if(len.length == 0) return 0;
		if(len.length > 2){
			var px_in_pt = dojox.gfx.px_in_pt();
			var val = parseFloat(len);
			switch(len.slice(-2)){
				case "px": return val;
				case "pt": return val * px_in_pt;
				case "in": return val * 72 * px_in_pt;
				case "pc": return val * 12 * px_in_pt;
				case "mm": return val * dojox.gfx.mm_in_pt * px_in_pt;
				case "cm": return val * dojox.gfx.cm_in_pt * px_in_pt;
			}
		}
		return parseFloat(len);	// Number
	},

	// a constant used to split a SVG/VML path into primitive components
	pathVmlRegExp: /([A-Za-z]+)|(\d+(\.\d+)?)|(\.\d+)|(-\d+(\.\d+)?)|(-\.\d+)/g,
	pathSvgRegExp: /([A-Za-z])|(\d+(\.\d+)?)|(\.\d+)|(-\d+(\.\d+)?)|(-\.\d+)/g,

	equalSources: function(a, b){
		// summary: compares event sources, returns true if they are equal
		return a && b && a == b;
	},
	
	switchTo: function(renderer){
		var ns = dojox.gfx[renderer];
		if(ns){
			dojo.forEach(["Group", "Rect", "Ellipse", "Circle", "Line",
					"Polyline", "Image", "Text", "Path", "TextPath",
					"Surface", "createSurface"], function(name){
				dojox.gfx[name] = ns[name];
			});
		}
	}
});

}

if(!dojo._hasResource["dojox.gfx"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojox.gfx"] = true;
dojo.provide("dojox.gfx");




dojo.loadInit(function(){
	// Since loaderInit can be fired before any dojo.provide/require calls,
	// make sure the dojox.gfx object exists and only run this logic if dojox.gfx.renderer
	// has not been defined yet.
	var gfx = dojo.getObject("dojox.gfx", true), sl, flag, match;
	while(!gfx.renderer){
		// Have a way to force a GFX renderer, if so desired.
		// Useful for being able to serialize GFX data in a particular format.
		if(dojo.config.forceGfxRenderer){
			dojox.gfx.renderer = dojo.config.forceGfxRenderer;
			break;
		}
		var renderers = (typeof dojo.config.gfxRenderer == "string" ?
			dojo.config.gfxRenderer : "svg,vml,canvas,silverlight").split(",");
		for(var i = 0; i < renderers.length; ++i){
			switch(renderers[i]){
				case "svg":
					// the next test is from https://github.com/phiggins42/has.js
					if("SVGAngle" in dojo.global){
						dojox.gfx.renderer = "svg";
					}
					break;
				case "vml":
					if(dojo.isIE){
						dojox.gfx.renderer = "vml";
					}
					break;
				case "silverlight":
					try{
						if(dojo.isIE){
							sl = new ActiveXObject("AgControl.AgControl");
							if(sl && sl.IsVersionSupported("1.0")){
								flag = true;
							}
						}else{
							if(navigator.plugins["Silverlight Plug-In"]){
								flag = true;
							}
						}
					}catch(e){
						flag = false;
					}finally{
						sl = null;
					}
					if(flag){
						dojox.gfx.renderer = "silverlight";
					}
					break;
				case "canvas":
					if(dojo.global.CanvasRenderingContext2D){
						dojox.gfx.renderer = "canvas";
					}
					break;
			}
			if(gfx.renderer){
				break;
			}
		}
		break;
	}
	
	if(dojo.config.isDebug){
		console.log("gfx renderer = " + gfx.renderer);
	}

	// load & initialize renderer
	if(gfx[gfx.renderer]){
		// already loaded
		gfx.switchTo(gfx.renderer);
	}else{
		// load
		gfx.loadAndSwitch = gfx.renderer;
		dojo["require"]("dojox.gfx." + gfx.renderer);
	}
});

}

if(!dojo._hasResource["dojox.gfx.Mover"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojox.gfx.Mover"] = true;
dojo.provide("dojox.gfx.Mover");

dojo.declare("dojox.gfx.Mover", null, {
	constructor: function(shape, e, host){
		// summary: an object, which makes a shape follow the mouse,
		//	used as a default mover, and as a base class for custom movers
		// shape: dojox.gfx.Shape: a shape object to be moved
		// e: Event: a mouse event, which started the move;
		//	only clientX and clientY properties are used
		// host: Object?: object which implements the functionality of the move,
		//	 and defines proper events (onMoveStart and onMoveStop)
		this.shape = shape;
		this.lastX = e.clientX
		this.lastY = e.clientY;
		var h = this.host = host, d = document,
			firstEvent = dojo.connect(d, "onmousemove", this, "onFirstMove");
		this.events = [
			dojo.connect(d, "onmousemove", this, "onMouseMove"),
			dojo.connect(d, "onmouseup",   this, "destroy"),
			// cancel text selection and text dragging
			dojo.connect(d, "ondragstart",   dojo, "stopEvent"),
			dojo.connect(d, "onselectstart", dojo, "stopEvent"),
			firstEvent
		];
		// notify that the move has started
		if(h && h.onMoveStart){
			h.onMoveStart(this);
		}
	},
	// mouse event processors
	onMouseMove: function(e){
		// summary: event processor for onmousemove
		// e: Event: mouse event
		var x = e.clientX;
		var y = e.clientY;
		this.host.onMove(this, {dx: x - this.lastX, dy: y - this.lastY});
		this.lastX = x;
		this.lastY = y;
		dojo.stopEvent(e);
	},
	// utilities
	onFirstMove: function(){
		// summary: it is meant to be called only once
		this.host.onFirstMove(this);
		dojo.disconnect(this.events.pop());
	},
	destroy: function(){
		// summary: stops the move, deletes all references, so the object can be garbage-collected
		dojo.forEach(this.events, dojo.disconnect);
		// undo global settings
		var h = this.host;
		if(h && h.onMoveStop){
			h.onMoveStop(this);
		}
		// destroy objects
		this.events = this.shape = null;
	}
});

}

if(!dojo._hasResource["dojox.gfx.Moveable"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojox.gfx.Moveable"] = true;
dojo.provide("dojox.gfx.Moveable");



dojo.declare("dojox.gfx.Moveable", null, {
	constructor: function(shape, params){
		// summary: an object, which makes a shape moveable
		// shape: dojox.gfx.Shape: a shape object to be moved
		// params: Object: an optional object with additional parameters;
		//	following parameters are recognized:
		//		delay: Number: delay move by this number of pixels
		//		mover: Object: a constructor of custom Mover
		this.shape = shape;
		this.delay = (params && params.delay > 0) ? params.delay : 0;
		this.mover = (params && params.mover) ? params.mover : dojox.gfx.Mover;
		this.events = [
			this.shape.connect("onmousedown", this, "onMouseDown")
			// cancel text selection and text dragging
			//, dojo.connect(this.handle, "ondragstart",   dojo, "stopEvent")
			//, dojo.connect(this.handle, "onselectstart", dojo, "stopEvent")
		];
	},

	// methods
	destroy: function(){
		// summary: stops watching for possible move, deletes all references, so the object can be garbage-collected
		dojo.forEach(this.events, this.shape.disconnect, this.shape);
		this.events = this.shape = null;
	},

	// mouse event processors
	onMouseDown: function(e){
		// summary: event processor for onmousedown, creates a Mover for the shape
		// e: Event: mouse event
		if(this.delay){
			this.events.push(
				this.shape.connect("onmousemove", this, "onMouseMove"),
				this.shape.connect("onmouseup", this, "onMouseUp"));
			this._lastX = e.clientX;
			this._lastY = e.clientY;
		}else{
			new this.mover(this.shape, e, this);
		}
		dojo.stopEvent(e);
	},
	onMouseMove: function(e){
		// summary: event processor for onmousemove, used only for delayed drags
		// e: Event: mouse event
		if(Math.abs(e.clientX - this._lastX) > this.delay || Math.abs(e.clientY - this._lastY) > this.delay){
			this.onMouseUp(e);
			new this.mover(this.shape, e, this);
		}
		dojo.stopEvent(e);
	},
	onMouseUp: function(e){
		// summary: event processor for onmouseup, used only for delayed delayed drags
		// e: Event: mouse event
		this.shape.disconnect(this.events.pop());
		this.shape.disconnect(this.events.pop());
	},

	// local events
	onMoveStart: function(/* dojox.gfx.Mover */ mover){
		// summary: called before every move operation
		dojo.publish("/gfx/move/start", [mover]);
		dojo.addClass(dojo.body(), "dojoMove");
	},
	onMoveStop: function(/* dojox.gfx.Mover */ mover){
		// summary: called after every move operation
		dojo.publish("/gfx/move/stop", [mover]);
		dojo.removeClass(dojo.body(), "dojoMove");
	},
	onFirstMove: function(/* dojox.gfx.Mover */ mover){
		// summary: called during the very first move notification,
		//	can be used to initialize coordinates, can be overwritten.

		// default implementation does nothing
	},
	onMove: function(/* dojox.gfx.Mover */ mover, /* Object */ shift){
		// summary: called during every move notification,
		//	should actually move the node, can be overwritten.
		this.onMoving(mover, shift);
		this.shape.applyLeftTransform(shift);
		this.onMoved(mover, shift);
	},
	onMoving: function(/* dojox.gfx.Mover */ mover, /* Object */ shift){
		// summary: called before every incremental move,
		//	can be overwritten.

		// default implementation does nothing
	},
	onMoved: function(/* dojox.gfx.Mover */ mover, /* Object */ shift){
		// summary: called after every incremental move,
		//	can be overwritten.

		// default implementation does nothing
	}
});

}

if(!dojo._hasResource["dojox.gfx.move"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojox.gfx.move"] = true;
dojo.provide("dojox.gfx.move");




}

if(!dojo._hasResource["dojo.io.script"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.io.script"] = true;
dojo.provide("dojo.io.script");

dojo.getObject("io", true, dojo);

/*=====
dojo.declare("dojo.io.script.__ioArgs", dojo.__IoArgs, {
	constructor: function(){
		//	summary:
		//		All the properties described in the dojo.__ioArgs type, apply to this
		//		type as well, EXCEPT "handleAs". It is not applicable to
		//		dojo.io.script.get() calls, since it is implied by the usage of
		//		"jsonp" (response will be a JSONP call returning JSON)
		//		or the response is pure JavaScript defined in
		//		the body of the script that was attached.
		//	callbackParamName: String
		//		Deprecated as of Dojo 1.4 in favor of "jsonp", but still supported for
		// 		legacy code. See notes for jsonp property.
		//	jsonp: String
		//		The URL parameter name that indicates the JSONP callback string.
		//		For instance, when using Yahoo JSONP calls it is normally,
		//		jsonp: "callback". For AOL JSONP calls it is normally
		//		jsonp: "c".
		//	checkString: String
		//		A string of JavaScript that when evaluated like so:
		//		"typeof(" + checkString + ") != 'undefined'"
		//		being true means that the script fetched has been loaded.
		//		Do not use this if doing a JSONP type of call (use callbackParamName instead).
		//	frameDoc: Document
		//		The Document object for a child iframe. If this is passed in, the script
		//		will be attached to that document. This can be helpful in some comet long-polling
		//		scenarios with Firefox and Opera.
		this.callbackParamName = callbackParamName;
		this.jsonp = jsonp;
		this.checkString = checkString;
		this.frameDoc = frameDoc;
	}
});
=====*/
(function(){
	var loadEvent = dojo.isIE ? "onreadystatechange" : "load",
		readyRegExp = /complete|loaded/;

	dojo.io.script = {
		get: function(/*dojo.io.script.__ioArgs*/args){
			//	summary:
			//		sends a get request using a dynamically created script tag.
			var dfd = this._makeScriptDeferred(args);
			var ioArgs = dfd.ioArgs;
			dojo._ioAddQueryToUrl(ioArgs);
	
			dojo._ioNotifyStart(dfd);

			if(this._canAttach(ioArgs)){
				var node = this.attach(ioArgs.id, ioArgs.url, args.frameDoc);

				//If not a jsonp callback or a polling checkString case, bind
				//to load event on the script tag.
				if(!ioArgs.jsonp && !ioArgs.args.checkString){
					var handle = dojo.connect(node, loadEvent, function(evt){
						if(evt.type == "load" || readyRegExp.test(node.readyState)){
							dojo.disconnect(handle);
							ioArgs.scriptLoaded = evt;
						}
					});
				}
			}

			dojo._ioWatch(dfd, this._validCheck, this._ioCheck, this._resHandle);
			return dfd;
		},
	
		attach: function(/*String*/id, /*String*/url, /*Document?*/frameDocument){
			//	summary:
			//		creates a new <script> tag pointing to the specified URL and
			//		adds it to the document.
			//	description:
			//		Attaches the script element to the DOM.  Use this method if you
			//		just want to attach a script to the DOM and do not care when or
			//		if it loads.
			var doc = (frameDocument || dojo.doc);
			var element = doc.createElement("script");
			element.type = "text/javascript";
			element.src = url;
			element.id = id;
			element.charset = "utf-8";
			return doc.getElementsByTagName("head")[0].appendChild(element);
		},
	
		remove: function(/*String*/id, /*Document?*/frameDocument){
			//summary: removes the script element with the given id, from the given frameDocument.
			//If no frameDocument is passed, the current document is used.
			dojo.destroy(dojo.byId(id, frameDocument));
			
			//Remove the jsonp callback on dojo.io.script, if it exists.
			if(this["jsonp_" + id]){
				delete this["jsonp_" + id];
			}
		},
	
		_makeScriptDeferred: function(/*Object*/args){
			//summary:
			//		sets up a Deferred object for an IO request.
			var dfd = dojo._ioSetArgs(args, this._deferredCancel, this._deferredOk, this._deferredError);
	
			var ioArgs = dfd.ioArgs;
			ioArgs.id = dojo._scopeName + "IoScript" + (this._counter++);
			ioArgs.canDelete = false;
	
			//Special setup for jsonp case
			ioArgs.jsonp = args.callbackParamName || args.jsonp;
			if(ioArgs.jsonp){
				//Add the jsonp parameter.
				ioArgs.query = ioArgs.query || "";
				if(ioArgs.query.length > 0){
					ioArgs.query += "&";
				}
				ioArgs.query += ioArgs.jsonp
					+ "="
					+ (args.frameDoc ? "parent." : "")
					+ dojo._scopeName + ".io.script.jsonp_" + ioArgs.id + "._jsonpCallback";
	
				ioArgs.frameDoc = args.frameDoc;
	
				//Setup the Deferred to have the jsonp callback.
				ioArgs.canDelete = true;
				dfd._jsonpCallback = this._jsonpCallback;
				this["jsonp_" + ioArgs.id] = dfd;
			}
			return dfd; // dojo.Deferred
		},
		
		_deferredCancel: function(/*Deferred*/dfd){
			//summary: canceller function for dojo._ioSetArgs call.
	
			//DO NOT use "this" and expect it to be dojo.io.script.
			dfd.canceled = true;
			if(dfd.ioArgs.canDelete){
				dojo.io.script._addDeadScript(dfd.ioArgs);
			}
		},
	
		_deferredOk: function(/*Deferred*/dfd){
			//summary: okHandler function for dojo._ioSetArgs call.
	
			//DO NOT use "this" and expect it to be dojo.io.script.
			var ioArgs = dfd.ioArgs;
	
			//Add script to list of things that can be removed.
			if(ioArgs.canDelete){
				dojo.io.script._addDeadScript(ioArgs);
			}
	
			//Favor JSONP responses, script load events then lastly ioArgs.
			//The ioArgs are goofy, but cannot return the dfd since that stops
			//the callback chain in Deferred. The return value is not that important
			//in that case, probably a checkString case.
			return ioArgs.json || ioArgs.scriptLoaded || ioArgs;
		},
	
		_deferredError: function(/*Error*/error, /*Deferred*/dfd){
			//summary: errHandler function for dojo._ioSetArgs call.
	
			if(dfd.ioArgs.canDelete){
				//DO NOT use "this" and expect it to be dojo.io.script.
				if(error.dojoType == "timeout"){
					//For timeouts, remove the script element immediately to
					//avoid a response from it coming back later and causing trouble.
					dojo.io.script.remove(dfd.ioArgs.id, dfd.ioArgs.frameDoc);
				}else{
					dojo.io.script._addDeadScript(dfd.ioArgs);
				}
			}
			console.log("dojo.io.script error", error);
			return error;
		},
	
		_deadScripts: [],
		_counter: 1,
	
		_addDeadScript: function(/*Object*/ioArgs){
			//summary: sets up an entry in the deadScripts array.
			dojo.io.script._deadScripts.push({id: ioArgs.id, frameDoc: ioArgs.frameDoc});
			//Being extra paranoid about leaks:
			ioArgs.frameDoc = null;
		},
	
		_validCheck: function(/*Deferred*/dfd){
			//summary: inflight check function to see if dfd is still valid.
	
			//Do script cleanup here. We wait for one inflight pass
			//to make sure we don't get any weird things by trying to remove a script
			//tag that is part of the call chain (IE 6 has been known to
			//crash in that case).
			var _self = dojo.io.script;
			var deadScripts = _self._deadScripts;
			if(deadScripts && deadScripts.length > 0){
				for(var i = 0; i < deadScripts.length; i++){
					//Remove the script tag
					_self.remove(deadScripts[i].id, deadScripts[i].frameDoc);
					deadScripts[i].frameDoc = null;
				}
				dojo.io.script._deadScripts = [];
			}
	
			return true;
		},
	
		_ioCheck: function(/*Deferred*/dfd){
			//summary: inflight check function to see if IO finished.
			var ioArgs = dfd.ioArgs;
			//Check for finished jsonp
			if(ioArgs.json || (ioArgs.scriptLoaded && !ioArgs.args.checkString)){
				return true;
			}
	
			//Check for finished "checkString" case.
			var checkString = ioArgs.args.checkString;
			if(checkString && eval("typeof(" + checkString + ") != 'undefined'")){
				return true;
			}
	
			return false;
		},
	
		_resHandle: function(/*Deferred*/dfd){
			//summary: inflight function to handle a completed response.
			if(dojo.io.script._ioCheck(dfd)){
				dfd.callback(dfd);
			}else{
				//This path should never happen since the only way we can get
				//to _resHandle is if _ioCheck is true.
				dfd.errback(new Error("inconceivable dojo.io.script._resHandle error"));
			}
		},
	
		_canAttach: function(/*Object*/ioArgs){
			//summary: A method that can be overridden by other modules
			//to control when the script attachment occurs.
			return true;
		},
		
		_jsonpCallback: function(/*JSON Object*/json){
			//summary:
			//		generic handler for jsonp callback. A pointer to this function
			//		is used for all jsonp callbacks.  NOTE: the "this" in this
			//		function will be the Deferred object that represents the script
			//		request.
			this.ioArgs.json = json;
		}
	};
})();

}

dojo.provide(
    "games.Tetravex", null, {});



 // for the JSONP function

// set up a name space
games.Tetravex = function() {
};

games.Tetravex._props = {
  suface_width : 400,
  suface_height : 200,
  padding : 0
};
// _underscored as should be set by function
games.Tetravex._boardX = [];
games.Tetravex._boardY = [];
games.Tetravex._half_square = 0; // half a square including padding
games.Tetravex._tileSize = 0;
games.Tetravex._boardSize = 2;
games.Tetravex._surface = null;
// TODO: A sparse array of square objects that store references to the tiles.??
games.Tetravex.squares = [];
// the array that stores the tiles.
games.Tetravex._tile = [];
games.Tetravex._tileData = []; // xhr retrieved
games.Tetravex._origin = {
  x : 0,
  y : 0
};
// games.Tetravex._dataUrl = "http://wll092/Tetravex/return.php"; // local php test
//games.Tetravex._dataUrl = "http://localhost:8124"; // local node.js
games.Tetravex._dataUrl = "http://tiledata.duostack.net"; // remote node.js
games.Tetravex._timeout = 1000; // the timeout for fetching game data

// Set the padding and then reset the board grid arrays.
games.Tetravex.setPadding = function(padding) {
  games.Tetravex._props.padding = padding;
};

// Set the board size, and then reset the board grid arrays.
// Note: not called yet, maybe by resize board function.
games.Tetravex.setTileSize = function(size) {
  games.Tetravex._tileSize = size;
};

// Initialise the game.
games.Tetravex.initialize = function(createBoard) {
  // first asynchronously get the data, then do some setup while waiting for the return.
  var deferred = games.Tetravex._xhrGameData();
  var container = dojo.byId("tetravex");

  if (createBoard) {
    games.Tetravex._surface = dojox.gfx.createSurface(
        container, games.Tetravex._props.suface_width, games.Tetravex._props.suface_height);
  } else {
    games.Tetravex._surface.clear();
  }
  games.Tetravex._surface.whenLoaded(function() {
    games.Tetravex._drawBoard();
    games.Tetravex._extendOnMoving();

    // If the call back has finished or erred then create the tiles ( on error local data is produced)
    // We will only actually get the 1, error condition if the XHR fails before it gets here
    // which would require a very small local time out, 1ms on my dev machine was still too long.
    // else
    // If we are still waiting for a return then add deferred call backs to the chain that will fire when it does.
    // Calls to createTiles cannot be put into the original call back functions as there is a chance
    // they will fire before the surface is loaded, which would be bad.
    console.debug("XHR fired " + deferred.fired);
    if (deferred.fired == 0 || deferred.fired == 1) {
      console.debug("XHR was finished");
      games.Tetravex._createTiles();
    } else {
      deferred.addCallback(function(response) {
        console.debug("XHR not finished, this additional callback fires when it does.");
        games.Tetravex._createTiles();
        return response;
      });
      deferred.addErrback(function(response) {
        console.debug("XHR not finished, this additional errback fires when it does.");
        games.Tetravex._createTiles();
        return response;
      });
    }
    // If the local time out is long then maybe a call back has not even been fired yet.
    // Very cool IMHO, because they will get called, and still work.
    console.debug("Returning from initialize function. ");
  });
  return;
};

// reset the board with new tiles
games.Tetravex.reset = function() {
  games.Tetravex._tile = [];
  games.Tetravex.initialize(false);
};

// reset the board and re-initialise to a size one greater than current
games.Tetravex.resetPlus = function() {
  if (games.Tetravex._boardSize < 5) {
    games.Tetravex._boardSize++;
    games.Tetravex._tile = [];
    games.Tetravex.initialize(false);
  }
};

// reset the board and re-initialise to a size one less than current
games.Tetravex.resetMinus = function() {
  if (games.Tetravex._boardSize > 2) {
    games.Tetravex._boardSize--;
    games.Tetravex._tile = [];
    games.Tetravex.initialize(false);
  }
};

// this is the JSONP version
games.Tetravex._xhrGameData = function() {
  return dojo.io.script.get({
    callbackParamName : "tileDataCallback", // read by the jsonp service
    url : games.Tetravex._dataUrl,
    handleAs : "json", // Strip the comments and eval to a JavaScript object
    timeout : games.Tetravex._timeout, // Call the error handler if nothing after .5 seconds
    preventCache : true,
    content : {
      format : "json",
      size : games.Tetravex._boardSize
    }, // content is the query string
    // Run this function if the request is successful
    load : function(response, ioArgs) {
      console.debug(
          "successful xhrGet", response, ioArgs);
      games.Tetravex._tileData = response.n;
      return response; // always return the response back
    },
    // Run this function if the request is not successful
    error : function(response, ioArgs) {
      console.debug("failed xhrGet");
      games.Tetravex._tileData = games.Tetravex._localTileNumbers.n;
      return response; // always return the response back
    }
  });
};


// if the XHR times out or errors then generate the numbers locally
// If created locally then the cs check sum will be incorrect and the score
// will not be eligible for the global high score table, should really be a UI option
games.Tetravex._localTileNumbers = {
  "n" : [ [ 1, 1, 1, 1 ], [ 2, 2, 2, 2 ], [ 3, 3, 3, 3 ], [ 4, 4, 4, 4 ] ],
  "cs" : null
};

games.Tetravex._drawBoard = function() {
  // summary: Initialise board size variables and draw the board on the surface

  games.Tetravex._initGlobals();

  var path = games.Tetravex._surface.createPath().setStroke(
      "black");

  // left board horizontal lines
  var i;
  for (i = 0; i <= games.Tetravex._boardSize; i++) {
    var x = games.Tetravex._boardX[0];
    var y = games.Tetravex._boardY[i];
    var h = games.Tetravex._boardX[games.Tetravex._boardSize];
    path.moveTo(
        x, y);
    path.hLineTo(h);
    path.closePath();
  }

  // left board vertical lines
  for (i = 0; i <= games.Tetravex._boardSize; i++) {
    path.moveTo(
        games.Tetravex._boardX[i], games.Tetravex._boardY[0]).vLineTo(
        games.Tetravex._boardY[games.Tetravex._boardSize]).closePath();
  }

  // right board horizontal lines
  for (i = 0; i <= games.Tetravex._boardSize; i++) {
    path.moveTo(
        games.Tetravex._boardX[games.Tetravex._boardSize + 1], games.Tetravex._boardY[i]).hLineTo(
        games.Tetravex._boardX[(games.Tetravex._boardSize * 2) + 1]).closePath();
  }
  // right board vertical lines
  for (i = games.Tetravex._boardSize + 1; i <= (games.Tetravex._boardSize * 2) + 1; i++) {
    path.moveTo(
        games.Tetravex._boardX[i], games.Tetravex._boardY[0]).vLineTo(
        games.Tetravex._boardY[games.Tetravex._boardSize]).closePath();
  }
};

games.Tetravex._initGlobals = function() {
  // initialize the game global variables that are based on board size
  // used by draw board, and the unit tests
  games.Tetravex._tileSize = games.Tetravex._props.suface_width / ((2 * games.Tetravex._boardSize) + 2);
  games.Tetravex._half_square = (games.Tetravex._tileSize / 2) + (games.Tetravex._props.padding);
  games.Tetravex._boardX = [];
  games.Tetravex._boardY = [];
  games.Tetravex._boardX[0] = games.Tetravex._tileSize / 2;
  // console.debug("board x " + games.Tetravex._boardX[0]);
  for ( var f = 1; f < (2 * games.Tetravex._boardSize) + 2; f++) {
    games.Tetravex._boardX[f] = (games.Tetravex._tileSize / 2)
        + ((games.Tetravex._tileSize + games.Tetravex._props.padding * 2) * (f));
    // console.debug("board x " + games.Tetravex._boardX[f]);
  }
  for ( var y = 0; y <= games.Tetravex._boardSize; y++) {
    games.Tetravex._boardY[y] = games.Tetravex._boardX[y];
  }
};

games.Tetravex._extendOnMoving = function() {

  // override onMoving on your object and modify the "shift" object
  // so it never moves a shape outside of a specified boundaries.
  // http://dojo-toolkit.33424.n3.nabble.com/gfx-constrainedMoveable-td176539.html
  dojo
      .extend(
          dojox.gfx.Moveable, {
            onMoving : function(mover, shift) {
              if (mover.shape.matrix) {
                // don't go over the left or right
                if ((shift.dx > 0 && mover.shape.matrix.dx > (games.Tetravex._props.suface_width
                    - games.Tetravex._tileSize - 2))
                    || (shift.dx < 0 && mover.shape.matrix.dx < 2)) {
                  shift.dx = 0;
                }
                // don't go over the top or bottom
                if ((shift.dy < 0 && mover.shape.matrix.dy < 2)
                    || (shift.dy > 0 && mover.shape.matrix.dy > (games.Tetravex._props.suface_height
                        - games.Tetravex._tileSize - 2))) {
                  shift.dy = 0;
                }
              }
            }
          });

};

games.Tetravex._createTiles = function() {
  // create and place the tiles
  var t = 0;
  for ( var y = 0; y < games.Tetravex._boardSize; y++) {
    for ( var x = 1; x <= games.Tetravex._boardSize; x++) {

      // random tiles, not playable
      // games.Tetravex._tile[t] = createTile(Math.ceil(Math.random() * 9), Math.ceil(Math.random() * 9),
      // Math.ceil(Math.random() * 9), Math.ceil(Math.random() * 9));

      //console.debug("tile data " + games.Tetravex._tileData);
      //console.debug("tile data " + games.Tetravex._tileData[t][0] + " " + games.Tetravex._tileData[t][1] + " "
      //    + games.Tetravex._tileData[t][2] + " " + games.Tetravex._tileData[t][3]);
      
      // use the tile data to populate the tiles
      games.Tetravex._tile[t] = createTile(
          games.Tetravex._tileData[t][0], games.Tetravex._tileData[t][1], games.Tetravex._tileData[t][2],
          games.Tetravex._tileData[t][3]);

      games.Tetravex._tile[t].applyLeftTransform({
        dx : games.Tetravex._boardX[games.Tetravex._boardSize + x] + (games.Tetravex._props.padding),
        dy : games.Tetravex._boardY[y] + (games.Tetravex._props.padding)
      });
      t++;
    }
  }

  // make tiles movable, and subscribe them to call back functions
  // that makes sure they drop to the nearest square, move then to the front, and record their original location in case
  // they need to be moved back
  for ( var t = 0; t < games.Tetravex._tile.length; t++) {
    var moveMe = [];
    moveMe[t] = new dojox.gfx.Moveable(
        games.Tetravex._tile[t]);
    dojo.subscribe(
        "/gfx/move/stop", this, function(mover) {
          moveToNearestSquare(mover);
        });
    dojo.subscribe(
        "/gfx/move/start", this, function(mover) {
          ;
          mover.shape.moveToFront();
        });
    dojo.connect(
        moveMe[t], "onMouseDown", null, (function(moveMe) {
          // a call back closure that remembers each moveMe that it's given, sweet!
          return function(evt) {
            games.Tetravex._origin.x = moveMe.shape.matrix.dx;
            games.Tetravex._origin.y = moveMe.shape.matrix.dy;
          };
        })(moveMe[t]));
  }

  // construct a tile from triangles and numbers.
  function createTile(topNum, leftNum, bottomNum, rightNum) {
    var tileSize = games.Tetravex._tileSize;
    var middle = games.Tetravex._tileSize / 2;
    var tileGroup = games.Tetravex._surface.createGroup();
    // from CSS? - 0 black, 1 brown, 2 red, 3 orange, 4 yellow, 5 green, 6 blue, 7 purple, 8 grey, 9 white.
    var tileColour = [ "black", "#C17D11", "#CC0000", "#F57900", "#EDD400", "#73D216", "#3465A4", "#75507B", "#BABDB6",
        "white" ];
    var NumColour = [ "white", "white", "white", "black", "black", "black", "white", "white", "black", "black" ];

    var top = tileGroup.createPolyline([ 0, 0, tileSize, 0, middle, middle, 0, 0 ]);
    var left = tileGroup.createPolyline([ 0, 0, middle, middle, 0, tileSize, 0, 0 ]);
    var bottom = tileGroup.createPolyline([ 0, tileSize, middle, middle, tileSize, tileSize, 0, tileSize ]);
    var right = tileGroup.createPolyline([ tileSize, tileSize, middle, middle, tileSize, 0, tileSize, tileSize ]);

    top.setFill(
        tileColour[topNum]).setStroke(
        "black");
    left.setFill(
        tileColour[leftNum]).setStroke(
        "black");
    bottom.setFill(
        tileColour[bottomNum]).setStroke(
        "black");
    right.setFill(
        tileColour[rightNum]).setStroke(
        "black");

    // the x and y co-ord the text is related to a fraction of the tile size, plus or minus a fraction of the font size,
    // which is itself a fraction of the tile size.
    var topText = tileGroup.createText(
        {
          x : (games.Tetravex._tileSize / 2) - (0.4 * games.Tetravex._tileSize / 4),
          y : (games.Tetravex._tileSize / 4) + (0.3 * games.Tetravex._tileSize / 4),
          text : topNum
        }).setStroke(
        NumColour[topNum]).setFill(
        NumColour[topNum]).setFont(
        {
          family : "sans-serif",
          size : games.Tetravex._tileSize / 4 + "pt"
        });

    var leftText = tileGroup.createText(
        {
          x : (games.Tetravex._tileSize / 4) - (0.7 * games.Tetravex._tileSize / 4),
          y : (games.Tetravex._tileSize / 2) + (0.5 * games.Tetravex._tileSize / 4),
          text : leftNum
        }).setStroke(
        NumColour[leftNum]).setFill(
        NumColour[leftNum]).setFont(
        {
          family : "sans-serif",
          size : games.Tetravex._tileSize / 4 + "pt"
        });

    var bottomText = tileGroup.createText(
        {
          x : (games.Tetravex._tileSize / 2) - (0.4 * games.Tetravex._tileSize / 4),
          y : ((games.Tetravex._tileSize / 4) * 3) + (0.7 * games.Tetravex._tileSize / 4),
          text : bottomNum
        }).setStroke(
        NumColour[bottomNum]).setFill(
        NumColour[bottomNum]).setFont(
        {
          family : "sans-serif",
          size : games.Tetravex._tileSize / 4 + "pt"
        });

    var rightText = tileGroup.createText(
        {
          x : ((games.Tetravex._tileSize / 4) * 3) - (0.1 * games.Tetravex._tileSize / 4),
          y : (games.Tetravex._tileSize / 2) + (0.5 * games.Tetravex._tileSize / 4),
          text : rightNum
        }).setStroke(
        NumColour[rightNum]).setFill(
        NumColour[rightNum]).setFont(
        {
          family : "sans-serif",
          size : games.Tetravex._tileSize / 4 + "pt"
        });

    return tileGroup;

  }
};

var moveToNearestSquare = function(mover) {

  // console.clear();
  // console.debug("tile X is " + mover.shape.matrix.dx + " Y is " + mover.shape.matrix.dy);

  var deltaX = games.Tetravex._findNearestX(mover.shape.matrix.dx) - mover.shape.matrix.dx
      + (games.Tetravex._props.padding);
  var deltaY = games.Tetravex._findNearestY(mover.shape.matrix.dy) - mover.shape.matrix.dy
      + (games.Tetravex._props.padding);

  // TODO:
  // each square needs a tile property, a reference to a tile
  // and an above, below, left and right tile so that the numbers can be checked.

  // always return home, needs to be wrapped in a test.
  // deltaX = games.Tetravex._origin.x - mover.shape.matrix.dx + (games.Tetravex._props.padding);
  // deltaY = games.Tetravex._origin.y - mover.shape.matrix.dy + (games.Tetravex._props.padding);

  mover.shape.applyLeftTransform({
    dx : deltaX,
    dy : deltaY
  });
};

games.Tetravex._findNearestY = function findNearestY(tileY) {
  // summary: Examine all the possible y co-ord board values that
  // the tile may be dropped on and return the nearest.
  // tileX: the y co-ord of the top left corner of the tile

  // Quickly find if the tile is in a position less than half way through the first square
  if (tileY < (games.Tetravex._boardY[0] + games.Tetravex._half_square)) {
    return games.Tetravex._boardY[0];
  }

  // iterate over the middle square options
  for ( var i = 1; i <= games.Tetravex._boardSize - 2; i++) {
    var lowerLimit = games.Tetravex._boardY[i] - games.Tetravex._half_square;
    var upperLimit = games.Tetravex._boardY[i] + games.Tetravex._half_square;
    // console.debug("lower limit > = " + lowerLimit + " Y:" + tileY + " > upper limit" + upperLimit);
    if (upperLimit >= tileY && tileY > lowerLimit) {
      return games.Tetravex._boardY[i];
    }
  }
  return games.Tetravex._boardY[games.Tetravex._boardSize - 1];
};

games.Tetravex._findNearestX = function(tileX) {
  // summary: Examine all the possible x co-ord board values that
  // the tile may be dropped on and return the nearest.
  // tileX: the x co-od of the top left corner of the tile

  // pseudo code algorithm for working out where to drop the tile in a 3x3 grid
  // slightly tricky because of the gap between the boards.
  // p0 if (tilex <= 20 + half_square) return 20
  // p1 if (70 + half_square) >= tilex > (70 - half_square) return 70
  // p2 if (120 + half_square) >= tilex > (120 - half_square) return 120
  // p3 if (170 + (padding) >= tilex > (170 - half_square) return 120
  // p4 if (220 + half_square) >= tilex > (220 - half_square - tile_width - (pad/2))
  // p5 if (270 + half_square) >= tilex > (270 - half_square) return 270
  // p6 if (tilex > 320 - half_square)
  //
  // 
  // p0____|_________p1|_________p2|_____p3|_____________p4|_________p5|__________p6
  // |_:___.___:_|_:___.___:_|_:___.___:_|_:___.___:_|_:___.___:_|_:___.___:|_:___.___:_|
  // 20__________70_________120_________170_________220_________270________320
  //
  // | square line
  // : padding
  // . half_square

  // p0
  // console.debug("Interation " + 0 + " - Is " + tileX + " <= " + (games.Tetravex._boardX[0] +
  // games.Tetravex._half_square));
  if (tileX <= games.Tetravex._boardX[0] + games.Tetravex._half_square) {
    return games.Tetravex._boardX[0];
  }

  // iterate over the middle square options.
  for ( var p = 1; p <= (games.Tetravex._boardSize * 2) - 1; p++) {
    var f = 0;
    var upperLimit = games.Tetravex._boardX[p] + games.Tetravex._half_square;
    var lowerLimit = games.Tetravex._boardX[p] - games.Tetravex._half_square;

    if (p == games.Tetravex._boardSize) {
      upperLimit = games.Tetravex._boardX[p] + (games.Tetravex._props.padding);
      f = 1;
    }

    if (p == games.Tetravex._boardSize + 1) {
      lowerLimit = games.Tetravex._boardX[p] - games.Tetravex._half_square - games.Tetravex._tileSize
          - (games.Tetravex._props.padding);
    }

    // console.debug("Interation " + p + " - Is " + upperLimit + " >= " + tileX + " > " + lowerLimit + " therefore
    // square"
    // + games.Tetravex._boardX[p]);

    if ((upperLimit >= tileX) && (tileX > lowerLimit)) {
      return games.Tetravex._boardX[p - f];
    }
  }
  // must be the last square
  return games.Tetravex._boardX[games.Tetravex._boardSize * 2];
};

