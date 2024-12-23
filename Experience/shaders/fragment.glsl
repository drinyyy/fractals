uniform float time;
uniform float progress;
uniform vec2 mouse;
uniform sampler2D matcap,matcap1;
uniform vec4 resolution;
varying vec2 vUv;
float PI = 3.141592653589;


mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}
vec2 getmatcap(vec3 eye, vec3 normal) {
  vec3 reflected = reflect(eye, normal);
  float m = 2.8284271247461903 * sqrt( reflected.z+1.0 );
  return reflected.xy / m + 0.5;
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
	mat4 m = rotationMatrix(axis, angle);
	return (m * vec4(v, 1.0)).xyz;
}




float smin( float a, float b, float k )
{
    k *= 4.0;
    float h = max( k-abs(a-b), 0.0 )/k;
    return min(a,b) - h*h*k*(1.0/4.0);
}

vec2 smin2( float a, float b, float k )
{
    float h = 1.0 - min( abs(a-b)/(4.0*k), 1.0 );
    float w = h*h;
    float m = w*0.5;
    float s = w*k;
    return (a<b) ? vec2(a-s,m) : vec2(b-s,1.0-m);
}
float sdSphere( vec3 p, float r )
{
  return length(p)-r;
}


float sdBox( vec3 p, vec3 b )
{
  vec3 q = abs(p) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}

float sdTorus( vec3 p, vec2 t )
{
  vec2 q = vec2(length(p.xz)-t.x,p.y);
  return length(q)-t.y;
}

float sdf(vec3 p) {
    vec3 pi = rotate(p, vec3(0.0, 1.0, 1.0), time );
    vec3 pi2 = rotate(p, vec3(1.0, 1.0, 0.0), time );
    vec3 pi3 = rotate(p, vec3(1.0, 0.0, 0.0), time );

    vec3 boxPosition = vec3(0.0, 0.0, 0.0); 
    float box = sdBox(pi - boxPosition, vec3(0.005, 0.7, 0.005));
    float box2 = sdBox(pi2 - boxPosition, vec3(0.005, 0.7, 0.005));
    float box3 = sdBox(pi3 - boxPosition, vec3(0.005, 0.7, 0.005));
    
    float torus = sdTorus(pi - boxPosition, vec2(0.8, 0.02)); // Corrected dimensions for the torus
    float torus2 = sdTorus(pi2 - boxPosition, vec2(0.8, 0.02)); // Corrected dimensions for the torus
    // Sphere
    float sphere = sdSphere(p - vec3(mouse*resolution.zw*2.0, 0.0), 0.12);
    
    // Blend boxes together first
    vec2 boxBlend1 = smin2(box, box2, 0.05);
    vec2 boxBlend2 = smin2(boxBlend1.x, box3, 0.05);
    
    vec2 tourusBlend1 = smin2(torus, torus2, 0.08);
    

    // Blend torus with the boxes
    vec2 torusBlend = smin2(boxBlend2.x, tourusBlend1.x, 0.09);
    
    // Blend the sphere with the result
    vec2 finalBlend = smin2(torusBlend.x, sphere, 0.1);
    
    // Return the final distance
    return finalBlend.x;
}


float isSphere(vec3 p) {
    vec3 pi = rotate(p, vec3(0.0, 1.0, 1.0), time );
    
    // Calculate distances
    float boxDist = min(min(
        sdBox(pi - vec3(0.0), vec3(0.01, 0.5, 0.01)),
        sdBox(rotate(p, vec3(1.0, 1.0, 0.0), time ) - vec3(0.0), vec3(0.01, 0.5, 0.01))),
        sdBox(rotate(p, vec3(1.0, 0.0, 0.0), time ) - vec3(0.0), vec3(0.01, 0.5, 0.01))
    );
    
    float sphereDist = sdSphere(pi - vec3(0.1*resolution.zw*2.0, 0.0), 0.12);
    
    // Return 1.0 if closer to sphere, 0.0 if closer to boxes
    return step(sphereDist, boxDist);
}

vec2 sdfWithMaterial(vec3 p) {
    vec3 pi = rotate(p, vec3(0.0, 1.0, 1.0), time);
    vec3 pi2 = rotate(p, vec3(1.0, 1.0, 0.0), time);
    vec3 pi3 = rotate(p, vec3(1.0, 0.0, 0.0), time);

    vec3 boxPosition = vec3(0.0, 0.0, 0.0); 
    float box = sdBox(pi - boxPosition, vec3(0.01, 0.5, 0.01));
    float box2 = sdBox(pi2 - boxPosition, vec3(0.01, 0.5, 0.01));
    float box3 = sdBox(pi3 - boxPosition, vec3(0.01, 0.5, 0.01));
    
    float torus = sdTorus(pi - boxPosition, vec2(0.8, 0.02));
    float torus2 = sdTorus(pi2 - boxPosition, vec2(0.8, 0.02));
    float sphere = sdSphere(p - vec3(mouse*resolution.zw*2.0, 0.0), 0.12);
    
    // Blend boxes together
    vec2 boxBlend1 = smin2(box, box2, 0.08);
    vec2 boxBlend2 = smin2(boxBlend1.x, box3, 0.08);
    
    // Blend torus and sphere
    vec2 torusBlend = smin2(torus, torus2, 0.08);
    vec2 torusSphereBlend = smin2(torusBlend.x, sphere, 0.25);
    
    // Final blend between box group and torus/sphere group
    vec2 finalBlend = smin2(boxBlend2.x, torusSphereBlend.x, 0.1);
    
    // Compute material blend factor
    float materialBlend = smoothstep(-0.1, 0.1, boxBlend2.x - torusSphereBlend.x);
    
    return vec2(finalBlend.x, materialBlend);
}
vec3 calcNormal( in vec3 p ) // for function f(p)
{
    const float eps = 0.0001; // or some other value
    const vec2 h = vec2(eps,0);
    return normalize( vec3(sdf(p+h.xyy) - sdf(p-h.xyy),
                           sdf(p+h.yxy) - sdf(p-h.yxy),
                           sdf(p+h.yyx) - sdf(p-h.yyx) ) );
}
void main() {
    float dist = length(vUv - vec2(0.5));
    vec3 bg = mix(vec3(1.0), vec3(0.6), dist);
    vec2 newUV = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);
    vec3 camPos = vec3(0.0, 0.0, 2.0);
    vec3 ray = normalize(vec3((vUv-vec2(0.5)) *resolution.zw , -1));

    vec3 rayPos = camPos;
    float t = 0.0;
    float tMax = 5.0;

    for(int i = 0; i < 256; ++i){
        vec3 pos = camPos + t*ray;
        float h = sdf(pos);
        if (h < 0.0001 || t>tMax) break;
        t+=h;
    }

    vec3 color = bg;
    if (t < tMax) {
        vec3 pos = camPos + t*ray;
        vec3 normal = calcNormal(pos);
        vec2 matcapUV = getmatcap(ray, normal);
        vec2 materialInfo = sdfWithMaterial(pos);
        
        vec3 objectColor = mix(
            texture2D(matcap1, matcapUV).rgb,  // torus and sphere
            texture2D(matcap, matcapUV).rgb,   // boxes
            materialInfo.y
        );

        float fresnel = pow(1.0 + dot(ray,normal), 0.5);
        color = mix(objectColor, bg, fresnel);
    }
    
    gl_FragColor = vec4(color, 1.0);
}