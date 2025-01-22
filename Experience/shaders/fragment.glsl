uniform float time;
uniform vec2 resolution;
varying vec2 vUv;
uniform float value11, rChannel,gChannel,bChannel, rChannel2,gChannel2,bChannel2,value1,value2,value3;

#define MAX_STEPS 48 
#define MIN_DIST 10.0
#define MAX_DIST 15.0
#define POWER value11

float pixel_size;
precision highp float; 


mat3 rotateY(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat3(
        vec3(c, 0, s),
        vec3(0, 1, 0),
        vec3(-s, 0, c)
    );
}

vec3 mandelbulbDE(vec3 p) {
    p *= 0.5;
    vec3 z = p;
    float dr = 0.5;
    float r = 0.4;
    float power = POWER;
    float power_minus_1 = power - 1.0; 
    float minRadius = 1000.0;
    
    for (int i = 0; i < 8; i++) {
        r = length(z);
        if (r > 2.0) continue;
        
        
        float r_pow = pow(r, power_minus_1);
        dr = r_pow * power * dr + 1.0;
        float zr = r_pow * r; 
        
        float theta = acos(z.z/r);
        float phi = atan(z.y, z.x);
        
        theta *= power;
        phi *= power;
        
        z = zr * vec3(
            sin(theta) * cos(phi),
            sin(theta) * sin(phi),
            cos(theta)
        );
        z += p;
        
        minRadius = min(minRadius, r);
    }
    return vec3(0.5 * log(r) * r / dr, minRadius, 0.0);
}
float softshadow(vec3 ro, vec3 rd, float k) {
    float res = 1.0;
    float t = 0.02; 
    for(int i = 0; i < 8; i++) { 
        float h = mandelbulbDE(ro + rd * t).x;
        if(h < 0.001) return 0.02;
        res = min(res, k * h / t);
        t += h * 0.8 + 0.02; 
    }
    return res;
}

vec3 calcNormal(vec3 p) {
    const vec2 e = vec2(0.0015, 0.0);
    return normalize(vec3(
        mandelbulbDE(p + e.xyy).x - mandelbulbDE(p - e.xyy).x,
        mandelbulbDE(p + e.yxy).x - mandelbulbDE(p - e.yxy).x,
        mandelbulbDE(p + e.yyx).x - mandelbulbDE(p - e.yyx).x
    ));
}
vec3 intersect(vec3 ro, vec3 rd) {
    float t = 1.0;
    float res_t = 0.0;
    float max_error = 50.0;
    float d = 1.0;
    float pd = 2.0;
    float os = 0.0;
    float step = 0.0;
    float error = 1000.0;
    vec3 c, res_c;
    
    for(int i = 0; i < MAX_STEPS; i++) {
        if(error < pixel_size * 0.5 || t > MAX_DIST) {
            break;
        }
        
        c = mandelbulbDE(ro + rd * t);
        d = c.x;

        if(d > os) {
            os = 0.4 * d * d / pd;
            step = d + os;
            pd = d;
        } else {
            step = -os;
            os = 0.0;
            pd = 5.0;
            d = 1.0;
        }

        error = d / t;
        
        if(error < max_error) {
            max_error = error;
            res_t = t;
            res_c = c;
        }
        
        t += step;
    }
    
    if(t > MAX_DIST) res_t = -1.0;
    return vec3(res_t, res_c.y, res_c.z);
}

vec3 render(vec3 ro, vec3 rd) {
    vec3 col = vec3(0.0);
    vec3 res = intersect(ro, rd);
    
    if(res.x > 0.0) {
        
        vec3 pos = ro + res.x * rd;
        vec3 normal = calcNormal(pos);
        
      float fresnel = pow(1.0 - max(0.0, dot(normal, -rd)), 5.0);
    col = mix(col, vec3(0.0), fresnel);
        vec3 sundir = normalize(vec3(0.1, 0.8, 0.6));
        vec3 sun = vec3(1.64, 1.27, 0.99);
        vec3 skycolor = vec3(0.6, 1.5, 1.0);
        
        float shadow = softshadow(pos, sundir, 3.0);
        float dif = max(0.0, dot(normal, sundir));
        float sky = 0.6 + 0.4 * max(0.0, dot(normal, vec3(0.0, 0.0, 0.0)));
        float bac = max(0.3 + 0.7 * dot(vec3(-sundir.x, -1.0, -sundir.z), normal), 0.0);
        float spe = max(0.0, pow(clamp(dot(sundir, reflect(rd, normal)), 0.0, 1.0), 2.0));
        
        vec3 lin = 1.1 * sun * dif * shadow;
        lin += 1.0 * bac * sun;
        lin += 5.0 * sky * skycolor * shadow;
     
        
     
        res.y = pow(clamp(res.y, 0.0, 1.0), 0.55);
       float colorOffset = length(pos) * 1.1 + time *0.5;
vec3 baseColor = 0.5 + 0.5 * sin(vec3(rChannel, gChannel, bChannel) + colorOffset * 5.2);
        
        col = lin * vec3(rChannel2,gChannel2,bChannel2) * 0.2 * baseColor;
        col = mix(col, skycolor * 0.5, 1.0 - exp(-0.001 * res.x * res.x));
    } else {
        float y = rd.y * 0.5 + 0.5;
        col = mix(vec3(0.0), vec3(0.0, 0.0, 0.0), y);
    }
    
    col = pow(col, vec3(0.55));
    col = col * 0.2 + 0.4 * col * col * (3.0 - 2.0 * col);
    col = mix(col, vec3(dot(col, vec3(0.45))), -0.5);
    
    return col;
}

void main() {
    float pixel_size = 2.0/(resolution.x * 3.0); 
    
    vec2 uv = (vUv - 0.5) * 2.0;
    uv.x *= resolution.x/resolution.y;
    
    float camTime = time * 0.4;
    float dist = 2.0;
    vec3 ro = vec3(dist * sin(camTime), 5.5, dist * cos(camTime));
    vec3 ta = vec3(0.0);
    
    vec3 ww = normalize(ta - ro);
    vec3 uu = normalize(cross(ww, vec3(0.0, 1.0, 0.0)));
    vec3 vv = normalize(cross(uu, ww));
    vec3 rd = normalize(uv.x * uu + uv.y * vv + 2.0 * ww);
    
    vec3 col = render(ro, rd);
    
    vec2 q = vUv;
    col *= 0.5 + 0.5 * pow(16.0 * q.x * q.y * (1.0 - q.x) * (1.0 - q.y), 0.7);
    
    gl_FragColor = vec4(col, 1.0);
}

