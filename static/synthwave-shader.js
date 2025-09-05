class SynthwaveBackground{constructor(){this.scene=null;this.camera=null;this.renderer=null;this.material=null;this.plane=null;this.startTime=Date.now();this.animationId=null;this.init()}init(){try{if(typeof THREE==='undefined'){console.warn('Three.js not loaded, synthwave background disabled');return}this.scene=new THREE.Scene();this.camera=new THREE.OrthographicCamera(-1,1,1,-1,0,1);this.renderer=new THREE.WebGLRenderer({alpha:true,antialias:false,powerPreference:'default'});this.renderer.setSize(window.innerWidth,window.innerHeight);this.renderer.domElement.style.cssText='position:fixed;top:0;left:0;z-index:-1;pointer-events:none';document.body.appendChild(this.renderer.domElement);const fragmentShader=`precision mediump float;
uniform float iTime;
uniform vec2 iResolution;
#define TAU 6.2831853
struct M{
float d;
vec3 c;
};
M m;
void mmin(float d,vec3 c){
if(d<m.d){
m.d=d;
m.c=c;
}
}
mat2 rz2(float a){
float c=cos(a);
float s=sin(a);
return mat2(c,s,-s,c);
}
float random(float x){
return fract(sin(x*13.0+4375.0));
}
float height(vec2 iuv){
return sin(sin(iuv.x+iTime*0.1)*sin(iuv.y+iTime*0.1)*5.0)*(pow(abs(iuv.x),2.0)*0.02+0.1);
}
float noise(vec2 uv){
return fract(sin(dot(uv,vec2(12.9898,78.233)))*43758.5453);
}
vec3 noiseVec3(vec2 uv){
return vec3(noise(uv),noise(uv+vec2(1.0,0.0)),noise(uv+vec2(0.0,1.0)));
}
void map(vec3 p){
m.d=max(max(p.y,0.0),max(p.z-6.0,0.0));
vec2 uv=p.xz*2.0;
uv.y+=iTime;
vec2 f=fract(uv)-0.5;
float fft=max(sin(iTime*2.0)*0.5+0.3,0.005);
float l=fft/(abs(f.x)*abs(f.y));
l+=0.1*fft/abs(p.z-6.0);
m.c=mix(vec3(0.196,0.003,0.149),vec3(1.0,0.019,0.384),l);
uv=p.xz-0.5;
vec2 iuv=floor(uv);
vec2 fuv=fract(uv);
float h=mix(mix(height(iuv+vec2(0.0,0.0)),height(iuv+vec2(1.0,0.0)),fuv.x),mix(height(iuv+vec2(0.0,1.0)),height(iuv+vec2(1.0,1.0)),fuv.x),fuv.y)-1.0;
float d=p.y-h;
d=max(d,abs(p.z-10.0)-4.0);
vec2 vuv=fuv*(1.0-fuv);
float v=vuv.x*vuv.y;
l=0.01*fft/v;
mmin(d,vec3(0.0,0.0,1.0)*l);
}
void main(){
vec2 fragCoord=gl_FragCoord.xy;
vec2 uv=fragCoord.xy/iResolution.xy;
vec2 v=uv*(1.0-uv);
uv-=0.5;
uv.x*=iResolution.x/iResolution.y;
vec2 uvn=uv*2.5;
vec2 iuvn=floor(uvn)+vec2(2.0,0.0);
vec2 fuvn=fract(uvn);
vec3 nb=mix(mix(noiseVec3(iuvn+vec2(0.0,0.0)),noiseVec3(iuvn+vec2(1.0,0.0)),fuvn.x),mix(noiseVec3(iuvn+vec2(0.0,1.0)),noiseVec3(iuvn+vec2(1.0,1.0)),fuvn.x),fuvn.y)*0.1;
vec3 c=(vec3(0.168,0.0,0.2)*0.5+nb*3.0);
vec2 suv=uv;
suv*=rz2(iTime*0.02);
c*=vec3(1.0/(1.0-smoothstep(0.9,1.0,noise(suv*10.0))));
vec2 uvc=uv-vec2(0.4,0.2);
float circle=1.0-smoothstep(0.25,0.252,length(uvc));
float raytime=uv.y*100.0+iTime*2.0;
float thr=-uvc.y*5.0-1.0;
float rays=step(thr,sin(raytime));
circle=min(circle,rays);
vec3 csun=mix(vec3(0.968,0.137,0.094),vec3(1.0,0.819,0.019),uvc.y*3.0+0.5);
c=mix(c,csun,circle);
vec3 ro=vec3(0.0,2.0,0.0);
vec3 rd=vec3(uv,1.0);
rd.yz*=rz2(-0.2);
vec3 mp=ro;
for(int i=0;i<50;i++){
map(mp);
if(m.d<0.001)break;
mp+=rd*0.5*m.d;
}
if(mp.z<14.0)c=m.c;
c=max(c,0.0);
float cren=fract(uv.y*200.0+iTime*0.5);
c+=(smoothstep(0.2,0.3,cren)-smoothstep(0.7,0.8,cren))*0.01;
c=pow(c,vec3(1.0/2.2));
c*=pow(v.x*v.y*25.0,0.25);
gl_FragColor=vec4(c,0.3);
}`;const vertexShader=`void main(){gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`;this.material=new THREE.ShaderMaterial({vertexShader:vertexShader,fragmentShader:fragmentShader,uniforms:{iTime:{value:0},iResolution:{value:new THREE.Vector2(window.innerWidth,window.innerHeight)}},transparent:true});const geometry=new THREE.PlaneGeometry(2,2);this.plane=new THREE.Mesh(geometry,this.material);this.scene.add(this.plane);this.resizeHandler=this.onWindowResize.bind(this);window.addEventListener('resize',this.resizeHandler,{passive:true});this.animate()}catch(e){console.warn('Synthwave background failed to initialize:',e)}}onWindowResize(){if(!this.renderer||!this.material)return;try{this.renderer.setSize(window.innerWidth,window.innerHeight);this.material.uniforms.iResolution.value.set(window.innerWidth,window.innerHeight)}catch(e){console.warn('Synthwave resize failed:',e)}}animate(){if(!this.renderer||!this.material||!this.scene||!this.camera)return;try{this.animationId=requestAnimationFrame(()=>this.animate());this.material.uniforms.iTime.value=(Date.now()-this.startTime)*0.001;this.renderer.render(this.scene,this.camera)}catch(e){console.warn('Synthwave animation failed:',e);this.dispose()}}dispose(){if(this.animationId){cancelAnimationFrame(this.animationId);this.animationId=null}if(this.resizeHandler){window.removeEventListener('resize',this.resizeHandler)}if(this.renderer&&this.renderer.domElement&&this.renderer.domElement.parentNode){this.renderer.domElement.parentNode.removeChild(this.renderer.domElement)}if(this.renderer){this.renderer.dispose()}}}function initSynthwave(){if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',()=>{setTimeout(()=>new SynthwaveBackground(),100)},{once:true})}else{setTimeout(()=>new SynthwaveBackground(),100)}}initSynthwave();