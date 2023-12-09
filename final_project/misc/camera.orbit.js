function OrbitCamera(input) {
    this.cameraWorldMatrix = new Matrix4();
    this.cameraTarget = new Vector4(0, 0, 0, 1);
    this.yawDegrees = 0;
    this.pitchDegrees = -45;
    this.minDistance = 1;
    this.maxDistance = 50;
    this.zoomScale = 1;

    var lastMouseX = 0;
    var lastMouseY = 0;
    var isDragging = false;

    // -------------------------------------------------------------------------
    this.getViewMatrix = function () {
        return this.cameraWorldMatrix.clone().inverse();
    }

    // -----------------------------------------------------------------------------
    this.getPosition = function() {
      return new Vector4(
          this.cameraWorldMatrix.elements[3],
          this.cameraWorldMatrix.elements[7],
          this.cameraWorldMatrix.elements[11],
          1
      );
    }

    // -------------------------------------------------------------------------
    this.getRight = function () {
        return new Vector3(
            this.cameraWorldMatrix.elements[0],
            this.cameraWorldMatrix.elements[4],
            this.cameraWorldMatrix.elements[8]
        ).normalize();
    }

    // -------------------------------------------------------------------------
    this.getUp = function () {
        return new Vector3(
            this.cameraWorldMatrix.elements[1],
            this.cameraWorldMatrix.elements[5],
            this.cameraWorldMatrix.elements[9]
        ).normalize();
    }

    // -------------------------------------------------------------------------
    this.update = function (dt, secondsElapsedSinceStart) {
        // Extract the basis vector corresponding to forward
        var currentForward = new Vector3(
            this.cameraWorldMatrix.elements[2],
            this.cameraWorldMatrix.elements[6],
            this.cameraWorldMatrix.elements[10]
        );

        var tether = new Vector4(0, 0, this.minDistance + (this.maxDistance - this.minDistance) * this.zoomScale, 0);
        yaw = new Matrix4().makeRotationY(this.yawDegrees);
        pitch = new Matrix4().makeRotationX(this.pitchDegrees);
        
        var transformedTether = pitch.multiplyVector(tether);
        transformedTether = yaw.multiplyVector(transformedTether);

        var position = this.cameraTarget.clone().add(transformedTether);
        this.lookAt(position, new Vector4(0, 0, 0, 1));
    }

    // -------------------------------------------------------------------------
    this.lookAt = function (eyePos, targetPos) {
        var worldUp = new Vector4(0, 1, 0, 0);

        var cross = function (v1, v2) {
            return new Vector4(
                v1.y * v2.z - v1.z * v2.y,
                v1.z * v2.x - v1.x * v2.z,
                v1.x * v2.y - v1.y * v2.x,
                0
            );
        }

        this.cameraWorldMatrix.makeIdentity();

        var forward = targetPos.clone().subtract(eyePos).normalize();
        var right = cross(forward, worldUp).normalize();
        var up = cross(right, forward);

        var e = this.cameraWorldMatrix.elements;
        e[0] = right.x; e[1] = up.x; e[2] = -forward.x; e[3] = eyePos.x;
        e[4] = right.y; e[5] = up.y; e[6] = -forward.y; e[7] = eyePos.y;
        e[8] = right.z; e[9] = up.z; e[10] = -forward.z; e[11] = eyePos.z;
        e[12] = 0; e[13] = 0; e[14] = 0; e[15] = 1;

        return this;
    };

    // -------------------------------------------------------------------------
    document.onmousedown = function (evt) {
        isDragging = true;
        lastMouseX = evt.pageX;
        lastMouseY = evt.pageY;
    }

    // -------------------------------------------------------------------------
    document.onmousemove = function (evt) {
        if (isDragging) {
            this.yawDegrees -= (evt.pageX - lastMouseX) * 0.5;
            this.pitchDegrees -= (evt.pageY - lastMouseY) * 0.5;

            this.pitchDegrees = Math.min(this.pitchDegrees, 85);
            this.pitchDegrees = Math.max(this.pitchDegrees, -85);

            lastMouseX = evt.pageX;
            lastMouseY = evt.pageY;
        }
    }.bind(this)

    // -------------------------------------------------------------------------
    document.onmousewheel = function (evt) {
        this.zoomScale -= evt.wheelDelta * 0.001;
        this.zoomScale = Math.min(this.zoomScale, 1);
        this.zoomScale = Math.max(this.zoomScale, 0);
    }.bind(this)

    // -------------------------------------------------------------------------
    document.onmouseup = function (evt) {
        isDragging = false;
    }
}