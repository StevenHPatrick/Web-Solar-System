// Set the precision for floating-point numbers in the fragment shader.
precision mediump float;

// Uniform variables are constant across all vertices or fragments.
// These represent the position of the light, camera, and a texture.
uniform vec3 uLightPosition;
uniform vec3 uCameraPosition;
uniform sampler2D uTexture;

// Varying variables are interpolated values passed from the vertex shader.
varying vec2 vTexcoords;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;

void main(void) {
    // Calculate the direction from the fragment to the light source.
    vec3 lightDirection01 = normalize(uLightPosition - vWorldPosition);

    // Uncomment the next line to visualize the light direction in RGB.
    // gl_FragColor = vec4(lightDirection01, 1.0);

    // Normalize the world normal vector at the fragment.
    vec3 worldNormal01 = normalize(vWorldNormal);

    // Calculate the direction from the fragment to the camera.
    vec3 directionToEye01 = normalize(uCameraPosition - vWorldPosition);

    // Calculate the reflection direction using the Phong reflection model.
    vec3 reflection01 = 2.0 * dot(worldNormal01, lightDirection01) * worldNormal01 - lightDirection01;

    // Calculate Lambertian reflection (diffuse reflection) factor.
    float lambert = max(dot(worldNormal01, lightDirection01), 0.0);

    // Calculate the dot product between the reflection and eye direction vectors.
    float reflectionDotEyeDir = max(dot(reflection01, directionToEye01), 0.0);

    // Calculate specular intensity using the Phong reflection model.
    float specularIntensity = pow(reflectionDotEyeDir, 64.0);

    // Fetch the texture color at the specified texture coordinates.
    vec3 albedo = texture2D(uTexture, vTexcoords).rgb;

    // Calculate ambient, diffuse, and specular components separately.
    vec3 ambient = albedo * 0.1;
    vec3 diffuseColor = albedo * lambert;
    vec3 specularColor = vec3(0.3, 0.3, 0.3) * specularIntensity;

    // Combine ambient, diffuse, and specular components to get the final color.
    vec3 finalColor = ambient + diffuseColor + specularColor;

    // Set the final fragment color with alpha value 1.0.
    gl_FragColor = vec4(diffuseColor, 1.0);
}
