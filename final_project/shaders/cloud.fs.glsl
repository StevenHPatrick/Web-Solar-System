// Set the precision for floating-point numbers in the fragment shader.
precision mediump float;

// Uniform variables are constant across all vertices or fragments.
uniform vec3 uLightPosition;
uniform vec3 uCameraPosition;
uniform sampler2D uTexture; // Your texture, if needed

// Varying variables are interpolated values passed from the vertex shader.
varying vec2 vTexcoords;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;

void main(void) {
    // Calculate the direction from the fragment to the light source.
    vec3 lightDirection = normalize(uLightPosition - vWorldPosition);

    // Normalize the world normal vector at the fragment.
    vec3 worldNormal = normalize(vWorldNormal);

    // Calculate Lambertian reflection (diffuse reflection) factor.
    float lambert = max(dot(worldNormal, lightDirection), 0.0);

    // Fetch the texture color at the specified texture coordinates.
    vec4 albedo = texture2D(uTexture, vTexcoords);

    // Apply Lambertian reflection to the color.
    vec3 diffuseColor = albedo.rgb * lambert;

    float alpha = albedo.r;

    // Set the final fragment color with transparency.
    gl_FragColor = vec4(diffuseColor, alpha);
}