// Two classes: Triangle1 and Triangle2. Both define different shapes
 class Triangle1
 {
	 constructor()
	 {
		 this.buffer=gl.createBuffer();
		 // Creating our buffer for the shape. Know that all unique instances will
		 // have its own buffer
		 gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		 //Now we want to add color to our vertices information.
		 // Here we define the prototype of the shape. The idea is to create
		 // shapes where their origin is at 0,0,0, these are our prototypes
		 // We now use this prototype and instantiate objects with at different
		 // locations with the help of the translation matrix.
		 this.vertices =
		 [	
			// Front face (red)
		 	-.5,-.5,0,0,0,0,
		 	.5,-.5,0,1,0,0,
		 	0,.5,0,1,0,0,
			// Bottom face (green)
		 	-.5,-.5,0,0,1,0,
		 	0,0,-.5,0,1,0,
		 	.5,-.5,0,0,1,0,
			// Left face (blue)
		 	0,0,-.5,0,0,1,
		 	.5,-.5,0,0,0,1,
		 	0,.5,0,0,0,1,
			// Right face (yellow)
		 	0,.5,0,1,1,0,
		 	0,0,-.5,1,1,0,
		 	-.5,-.5,0,1,1,0
		];
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
		// These two variables allow us to set the location and rotation of a particular
		// Triangle1 instance. By default the instance will be positioned at the origin.
		this.loc = [0.0,0.0,0.0];
		this.rot = [0.0,0.0,0.0]; 	// Rotation will be altered in the render loop
		this.sca = [1.0,1.0,1.0];

		this.isScaling = true;
		// We set the rotation here so that on load the front face will show
	 }
	 //Again this could be inherited ... but not always...not all objects
	 
	 render(program)
	 {
		// Telling webGL which buffer 
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		
		//First we bind the buffer for triangle 1. Formating the attribute to read the buffer
		var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
		var size = 3;          // 2 components per iteration (position and color)
		var type = gl.FLOAT;   // the data is 32bit floats
		var normalize = false; // don't normalize the data
		var stride = 6*Float32Array.BYTES_PER_ELEMENT;	//Size in bytes of each element     // 0 = move forward size * sizeof(type) each iteration to get the next position
		var offset = 0;        // start at the beginning of the buffer
		gl.enableVertexAttribArray(positionAttributeLocation);
		gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
		
		//Now we have to do this for color
		var colorAttributeLocation = gl.getAttribLocation(program,"vert_color");
		//We don't have to bind because we already have the correct buffer bound.
		size = 3;
		type = gl.FLOAT;
		normalize = false;
		stride = 6*Float32Array.BYTES_PER_ELEMENT;	//Size in bytes of each element
		offset = 3*Float32Array.BYTES_PER_ELEMENT;									//size of the offset
		gl.enableVertexAttribArray(colorAttributeLocation);
		gl.vertexAttribPointer(colorAttributeLocation, size, type, normalize, stride, offset);
		
		// Setting our state variables (uniforms) before we draw
		// We get reference of the uniforms using getUniformLocation
		var tranLoc  = gl.getUniformLocation(program,'transform');
		// uniform3floatvector
		// Now pass the objects location and translation (loc and rot) over to the uniforms.
		// If rot changes, rotation will know about it. 
		gl.uniform3fv(tranLoc,new Float32Array(this.loc));
		var thetaLoc = gl.getUniformLocation(program,'rotation');
		gl.uniform3fv(thetaLoc,new Float32Array(this.rot));

		// Setting up or scaling for the object
		var scale = gl.getUniformLocation(program,"scale");
		gl.uniform3fv(scale,new Float32Array(this.sca));
		
		
		var primitiveType = gl.TRIANGLES;
		offset = 0;
		var count = 12;
		gl.drawArrays(primitiveType, offset, count);
	 }
 }
 class Triangle2
 {
	 constructor()
	 {
		this.buffer=gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		this.vertices =
		[
		-.2,.2,0,	0,0,1,		//0
		.2,.2,0,	0,0,1,		//1
		.2,-.2,0,	0,0,1,		//2
		-.2,-.2,0,	0,0,1,		//3	
		-.2,.2,-.4,	1,0,0,		//4
		.2,.2,-.4,	1,0,0,		//5
		.2,-.2,-.4,	1,0,0,		//6
		-.2,-.2,-.4,1,0,0		//7
		];
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
		
		this.indexOrder =
		[
		0,1,2,	//front face
		0,2,3,	
		0,1,5,	//Top Face
		5,4,1,
		4,5,6,	//Back Face
		4,6,7,
		1,2,5,	//Right face
		2,5,6,
		2,3,6,	//Bottom Face
		3,6,7,
		0,3,4,	//left face
		3,4,7]
		this.ibuffer = gl.createBuffer();
		// For the index array. Order of veticies for rendering our scene
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.ibuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint8Array(this.indexOrder),
		gl.STATIC_DRAW);
		
		// Location and rotation
		this.loc=[0,0,0];
		this.rot=[0,0,0];
	 }
	 
	 render(program)
	 {
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
				
		var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
		var size = 3;          // 2 components per iteration
		var type = gl.FLOAT;   // the data is 32bit floats
		var normalize = false; // don't normalize the data
		var stride = 6*Float32Array.BYTES_PER_ELEMENT;	//Size in bytes of each element     // 0 = move forward size * sizeof(type) each iteration to get the next position
		var offset = 0;        // start at the beginning of the buffer
		gl.enableVertexAttribArray(positionAttributeLocation);
		gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
		
		//Now we have to do this for color
		var colorAttributeLocation = gl.getAttribLocation(program,"vert_color");
		//We don't have to bind because we already have the correct buffer bound.
		size = 3;
		type = gl.FLOAT;
		normalize = false;
		stride = 6*Float32Array.BYTES_PER_ELEMENT;	//Size in bytes of each element
		offset = 3*Float32Array.BYTES_PER_ELEMENT;									//size of the offset
		gl.enableVertexAttribArray(colorAttributeLocation);
		gl.vertexAttribPointer(colorAttributeLocation, size, type, normalize, stride, offset);
				
		var tranLoc  = gl.getUniformLocation(program,'transform');
		gl.uniform3fv(tranLoc,new Float32Array(this.loc));
		var thetaLoc = gl.getUniformLocation(program,'rotation');
		gl.uniform3fv(thetaLoc,new Float32Array(this.rot));
		
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.ibuffer);
		
		// Instead of draw arrays
		gl.drawElements(gl.TRIANGLES,this.indexOrder.length,gl.UNSIGNED_BYTE,0);
		 
	 }
 }
 