// Set the precision for floating-point numbers in the vertex shader.
precision mediump float;

// Attribute variables represent input data for each vertex.
attribute vec3 aVertexPosition;  // Vertex position in object space
attribute vec3 aNormal;           // Normal vector in object space
attribute vec2 aTexcoords;        // Texture coordinates

// Uniform variables are constant across all vertices or fragments.
// These matrices transform the vertex data from object space to clip space.
uniform mat4 uWorldMatrix;        // World transformation matrix
uniform mat4 uViewMatrix;         // View transformation matrix
uniform mat4 uProjectionMatrix;   // Projection transformation matrix

// Varying variables are interpolated values passed to the fragment shader.
varying vec3 vWorldNormal;        // Normal vector in world space
varying vec3 vWorldPosition;      // Position vector in world space
varying vec2 vTexcoords;          // Interpolated texture coordinates

void main(void) {
    // Transform the vertex position from object space to clip space.
    gl_Position = uProjectionMatrix * uViewMatrix * uWorldMatrix * vec4(aVertexPosition, 1.0);

    // Transform the normal vector from object space to world space.
    vWorldNormal = (uWorldMatrix * vec4(aNormal, 0.0)).xyz;

    // Transform the vertex position from object space to world space.
    vWorldPosition = (uWorldMatrix * vec4(aVertexPosition, 1.0)).xyz;

    // Pass the texture coordinates to the fragment shader for interpolation.
    vTexcoords = aTexcoords;
}
