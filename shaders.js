// Vertex Shader
export var vertexShader = `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec2 vUv;

    void main() {
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);

      gl_Position = projectionMatrix * viewPosition;

      vNormal = normalize(normalMatrix * normal);
      vViewPosition = -viewPosition.xyz;
      vUv = uv; // Pass texture coordinates to fragment shader
    }
`;

// Fragment Shader
export var fragmentShader = `
precision mediump float;
varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec2 vUv;

uniform vec3 ambientLightColor;
uniform vec3 directionalLightColor;
uniform vec3 directionalLightDirection;

uniform sampler2D diffuseMap; 
uniform sampler2D specularMap; 
uniform float shininess; 

void main() {
    vec3 normal = normalize(vNormal);
    vec3 lightDir = normalize(directionalLightDirection);

    // Ambient
    vec3 ambient = ambientLightColor;

    // Diffuse
    vec4 texelColor = texture2D(diffuseMap, vUv);
    vec3 diffuse = max(dot(normal, lightDir), 0.0) * texelColor.rgb;

    // Specular
    vec3 viewDir = normalize(vViewPosition);
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), shininess);
    vec3 specular = texture2D(specularMap, vUv).rgb * spec;

    // Combine
    vec3 finalColor = ambient + diffuse + specular;

    gl_FragColor = vec4(finalColor, 1.0);
}
`;