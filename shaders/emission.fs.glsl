// Set the precision for floating-point numbers in the fragment shader.
precision mediump float;

// Uniform variables are constant across all vertices or fragments.
uniform vec3 uEmissionColor;  // Emission color
uniform sampler2D uTexture;   // Texture sampler

// Varying variables are interpolated values passed from the vertex shader.
varying vec3 vWorldPosition;      // Position vector in world space
varying vec2 vTexcoords;

void main(void) {
    // Sample the texture at the specified texture coordinates.
    vec3 textureColor = texture2D(uTexture, vTexcoords).rgb;

    // Emit light color without any shading calculations.
    gl_FragColor = vec4(textureColor, 1.0);
}