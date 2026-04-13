(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(s){if(s.ep)return;s.ep=!0;const o=t(s);fetch(s.href,o)}})();var la={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dl=function(n){const e=[];let t=0;for(let r=0;r<n.length;r++){let s=n.charCodeAt(r);s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&r+1<n.length&&(n.charCodeAt(r+1)&64512)===56320?(s=65536+((s&1023)<<10)+(n.charCodeAt(++r)&1023),e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128)}return e},Ah=function(n){const e=[];let t=0,r=0;for(;t<n.length;){const s=n[t++];if(s<128)e[r++]=String.fromCharCode(s);else if(s>191&&s<224){const o=n[t++];e[r++]=String.fromCharCode((s&31)<<6|o&63)}else if(s>239&&s<365){const o=n[t++],a=n[t++],c=n[t++],h=((s&7)<<18|(o&63)<<12|(a&63)<<6|c&63)-65536;e[r++]=String.fromCharCode(55296+(h>>10)),e[r++]=String.fromCharCode(56320+(h&1023))}else{const o=n[t++],a=n[t++];e[r++]=String.fromCharCode((s&15)<<12|(o&63)<<6|a&63)}}return e.join("")},Vl={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let s=0;s<n.length;s+=3){const o=n[s],a=s+1<n.length,c=a?n[s+1]:0,h=s+2<n.length,d=h?n[s+2]:0,m=o>>2,_=(o&3)<<4|c>>4;let A=(c&15)<<2|d>>6,R=d&63;h||(R=64,a||(A=64)),r.push(t[m],t[_],t[A],t[R])}return r.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(Dl(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):Ah(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let s=0;s<n.length;){const o=t[n.charAt(s++)],c=s<n.length?t[n.charAt(s)]:0;++s;const d=s<n.length?t[n.charAt(s)]:64;++s;const _=s<n.length?t[n.charAt(s)]:64;if(++s,o==null||c==null||d==null||_==null)throw new bh;const A=o<<2|c>>4;if(r.push(A),d!==64){const R=c<<4&240|d>>2;if(r.push(R),_!==64){const V=d<<6&192|_;r.push(V)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class bh extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Rh=function(n){const e=Dl(n);return Vl.encodeByteArray(e,!0)},Tr=function(n){return Rh(n).replace(/\./g,"")},Ph=function(n){try{return Vl.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Sh(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ch=()=>Sh().__FIREBASE_DEFAULTS__,Dh=()=>{if(typeof process>"u"||typeof la>"u")return;const n=la.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},Vh=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=n&&Ph(n[1]);return e&&JSON.parse(e)},di=()=>{try{return Ch()||Dh()||Vh()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},kh=n=>{var e,t;return(t=(e=di())===null||e===void 0?void 0:e.emulatorHosts)===null||t===void 0?void 0:t[n]},kl=n=>{const e=kh(n);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const r=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),r]:[e.substring(0,t),r]},Nl=()=>{var n;return(n=di())===null||n===void 0?void 0:n.config};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nh{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,r)=>{t?this.reject(t):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,r))}}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ol(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},r=e||"demo-project",s=n.iat||0,o=n.sub||n.user_id;if(!o)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const a=Object.assign({iss:`https://securetoken.google.com/${r}`,aud:r,iat:s,exp:s+3600,auth_time:s,sub:o,user_id:o,firebase:{sign_in_provider:"custom",identities:{}}},n);return[Tr(JSON.stringify(t)),Tr(JSON.stringify(a)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Oh(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function xh(){var n;const e=(n=di())===null||n===void 0?void 0:n.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function Lh(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function Mh(){return!xh()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function xl(){try{return typeof indexedDB=="object"}catch{return!1}}function Ll(){return new Promise((n,e)=>{try{let t=!0;const r="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(r);s.onsuccess=()=>{s.result.close(),t||self.indexedDB.deleteDatabase(r),n(!0)},s.onupgradeneeded=()=>{t=!1},s.onerror=()=>{var o;e(((o=s.error)===null||o===void 0?void 0:o.message)||"")}}catch(t){e(t)}})}function Fh(){return!(typeof navigator>"u"||!navigator.cookieEnabled)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bh="FirebaseError";class Qe extends Error{constructor(e,t,r){super(t),this.code=e,this.customData=r,this.name=Bh,Object.setPrototypeOf(this,Qe.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Ur.prototype.create)}}class Ur{constructor(e,t,r){this.service=e,this.serviceName=t,this.errors=r}create(e,...t){const r=t[0]||{},s=`${this.service}/${e}`,o=this.errors[e],a=o?Uh(o,r):"Error",c=`${this.serviceName}: ${a} (${s}).`;return new Qe(s,c,r)}}function Uh(n,e){return n.replace($h,(t,r)=>{const s=e[r];return s!=null?String(s):`<${r}?>`})}const $h=/\{\$([^}]+)}/g;function wr(n,e){if(n===e)return!0;const t=Object.keys(n),r=Object.keys(e);for(const s of t){if(!r.includes(s))return!1;const o=n[s],a=e[s];if(ca(o)&&ca(a)){if(!wr(o,a))return!1}else if(o!==a)return!1}for(const s of r)if(!t.includes(s))return!1;return!0}function ca(n){return n!==null&&typeof n=="object"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jh=1e3,qh=2,zh=4*60*60*1e3,Hh=.5;function ua(n,e=jh,t=qh){const r=e*Math.pow(t,n),s=Math.round(Hh*r*(Math.random()-.5)*2);return Math.min(zh,r+s)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ke(n){return n&&n._delegate?n._delegate:n}class Me{constructor(e,t,r){this.name=e,this.instanceFactory=t,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yt="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gh{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const r=new Nh;if(this.instancesDeferred.set(t,r),this.isInitialized(t)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:t});s&&r.resolve(s)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const r=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),s=(t=e==null?void 0:e.optional)!==null&&t!==void 0?t:!1;if(this.isInitialized(r)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:r})}catch(o){if(s)return null;throw o}else{if(s)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Wh(e))try{this.getOrInitializeService({instanceIdentifier:yt})}catch{}for(const[t,r]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(t);try{const o=this.getOrInitializeService({instanceIdentifier:s});r.resolve(o)}catch{}}}}clearInstance(e=yt){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=yt){return this.instances.has(e)}getOptions(e=yt){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:r,options:t});for(const[o,a]of this.instancesDeferred.entries()){const c=this.normalizeInstanceIdentifier(o);r===c&&a.resolve(s)}return s}onInit(e,t){var r;const s=this.normalizeInstanceIdentifier(t),o=(r=this.onInitCallbacks.get(s))!==null&&r!==void 0?r:new Set;o.add(e),this.onInitCallbacks.set(s,o);const a=this.instances.get(s);return a&&e(a,s),()=>{o.delete(e)}}invokeOnInitCallbacks(e,t){const r=this.onInitCallbacks.get(t);if(r)for(const s of r)try{s(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:Kh(e),options:t}),this.instances.set(e,r),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=yt){return this.component?this.component.multipleInstances?e:yt:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Kh(n){return n===yt?void 0:n}function Wh(n){return n.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qh{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new Gh(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var H;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(H||(H={}));const Yh={debug:H.DEBUG,verbose:H.VERBOSE,info:H.INFO,warn:H.WARN,error:H.ERROR,silent:H.SILENT},Xh=H.INFO,Jh={[H.DEBUG]:"log",[H.VERBOSE]:"log",[H.INFO]:"info",[H.WARN]:"warn",[H.ERROR]:"error"},Zh=(n,e,...t)=>{if(e<n.logLevel)return;const r=new Date().toISOString(),s=Jh[e];if(s)console[s](`[${r}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class fi{constructor(e){this.name=e,this._logLevel=Xh,this._logHandler=Zh,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in H))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Yh[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,H.DEBUG,...e),this._logHandler(this,H.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,H.VERBOSE,...e),this._logHandler(this,H.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,H.INFO,...e),this._logHandler(this,H.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,H.WARN,...e),this._logHandler(this,H.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,H.ERROR,...e),this._logHandler(this,H.ERROR,...e)}}const ed=(n,e)=>e.some(t=>n instanceof t);let ha,da;function td(){return ha||(ha=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function nd(){return da||(da=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Ml=new WeakMap,qs=new WeakMap,Fl=new WeakMap,Ss=new WeakMap,mi=new WeakMap;function rd(n){const e=new Promise((t,r)=>{const s=()=>{n.removeEventListener("success",o),n.removeEventListener("error",a)},o=()=>{t(nt(n.result)),s()},a=()=>{r(n.error),s()};n.addEventListener("success",o),n.addEventListener("error",a)});return e.then(t=>{t instanceof IDBCursor&&Ml.set(t,n)}).catch(()=>{}),mi.set(e,n),e}function sd(n){if(qs.has(n))return;const e=new Promise((t,r)=>{const s=()=>{n.removeEventListener("complete",o),n.removeEventListener("error",a),n.removeEventListener("abort",a)},o=()=>{t(),s()},a=()=>{r(n.error||new DOMException("AbortError","AbortError")),s()};n.addEventListener("complete",o),n.addEventListener("error",a),n.addEventListener("abort",a)});qs.set(n,e)}let zs={get(n,e,t){if(n instanceof IDBTransaction){if(e==="done")return qs.get(n);if(e==="objectStoreNames")return n.objectStoreNames||Fl.get(n);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return nt(n[e])},set(n,e,t){return n[e]=t,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function id(n){zs=n(zs)}function od(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const r=n.call(Cs(this),e,...t);return Fl.set(r,e.sort?e.sort():[e]),nt(r)}:nd().includes(n)?function(...e){return n.apply(Cs(this),e),nt(Ml.get(this))}:function(...e){return nt(n.apply(Cs(this),e))}}function ad(n){return typeof n=="function"?od(n):(n instanceof IDBTransaction&&sd(n),ed(n,td())?new Proxy(n,zs):n)}function nt(n){if(n instanceof IDBRequest)return rd(n);if(Ss.has(n))return Ss.get(n);const e=ad(n);return e!==n&&(Ss.set(n,e),mi.set(e,n)),e}const Cs=n=>mi.get(n);function Bl(n,e,{blocked:t,upgrade:r,blocking:s,terminated:o}={}){const a=indexedDB.open(n,e),c=nt(a);return r&&a.addEventListener("upgradeneeded",h=>{r(nt(a.result),h.oldVersion,h.newVersion,nt(a.transaction),h)}),t&&a.addEventListener("blocked",h=>t(h.oldVersion,h.newVersion,h)),c.then(h=>{o&&h.addEventListener("close",()=>o()),s&&h.addEventListener("versionchange",d=>s(d.oldVersion,d.newVersion,d))}).catch(()=>{}),c}const ld=["get","getKey","getAll","getAllKeys","count"],cd=["put","add","delete","clear"],Ds=new Map;function fa(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(Ds.get(e))return Ds.get(e);const t=e.replace(/FromIndex$/,""),r=e!==t,s=cd.includes(t);if(!(t in(r?IDBIndex:IDBObjectStore).prototype)||!(s||ld.includes(t)))return;const o=async function(a,...c){const h=this.transaction(a,s?"readwrite":"readonly");let d=h.store;return r&&(d=d.index(c.shift())),(await Promise.all([d[t](...c),s&&h.done]))[0]};return Ds.set(e,o),o}id(n=>({...n,get:(e,t,r)=>fa(e,t)||n.get(e,t,r),has:(e,t)=>!!fa(e,t)||n.has(e,t)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ud{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(hd(t)){const r=t.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(t=>t).join(" ")}}function hd(n){const e=n.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Hs="@firebase/app",ma="0.10.13";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const He=new fi("@firebase/app"),dd="@firebase/app-compat",fd="@firebase/analytics-compat",md="@firebase/analytics",pd="@firebase/app-check-compat",gd="@firebase/app-check",yd="@firebase/auth",_d="@firebase/auth-compat",vd="@firebase/database",Ed="@firebase/data-connect",Id="@firebase/database-compat",Td="@firebase/functions",wd="@firebase/functions-compat",Ad="@firebase/installations",bd="@firebase/installations-compat",Rd="@firebase/messaging",Pd="@firebase/messaging-compat",Sd="@firebase/performance",Cd="@firebase/performance-compat",Dd="@firebase/remote-config",Vd="@firebase/remote-config-compat",kd="@firebase/storage",Nd="@firebase/storage-compat",Od="@firebase/firestore",xd="@firebase/vertexai-preview",Ld="@firebase/firestore-compat",Md="firebase",Fd="10.14.1";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gs="[DEFAULT]",Bd={[Hs]:"fire-core",[dd]:"fire-core-compat",[md]:"fire-analytics",[fd]:"fire-analytics-compat",[gd]:"fire-app-check",[pd]:"fire-app-check-compat",[yd]:"fire-auth",[_d]:"fire-auth-compat",[vd]:"fire-rtdb",[Ed]:"fire-data-connect",[Id]:"fire-rtdb-compat",[Td]:"fire-fn",[wd]:"fire-fn-compat",[Ad]:"fire-iid",[bd]:"fire-iid-compat",[Rd]:"fire-fcm",[Pd]:"fire-fcm-compat",[Sd]:"fire-perf",[Cd]:"fire-perf-compat",[Dd]:"fire-rc",[Vd]:"fire-rc-compat",[kd]:"fire-gcs",[Nd]:"fire-gcs-compat",[Od]:"fire-fst",[Ld]:"fire-fst-compat",[xd]:"fire-vertex","fire-js":"fire-js",[Md]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ar=new Map,Ud=new Map,Ks=new Map;function pa(n,e){try{n.container.addComponent(e)}catch(t){He.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function Ge(n){const e=n.name;if(Ks.has(e))return He.debug(`There were multiple attempts to register component ${e}.`),!1;Ks.set(e,n);for(const t of Ar.values())pa(t,n);for(const t of Ud.values())pa(t,n);return!0}function Jt(n,e){const t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $d={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},rt=new Ur("app","Firebase",$d);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jd{constructor(e,t,r){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new Me("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw rt.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ul=Fd;function $l(n,e={}){let t=n;typeof e!="object"&&(e={name:e});const r=Object.assign({name:Gs,automaticDataCollectionEnabled:!1},e),s=r.name;if(typeof s!="string"||!s)throw rt.create("bad-app-name",{appName:String(s)});if(t||(t=Nl()),!t)throw rt.create("no-options");const o=Ar.get(s);if(o){if(wr(t,o.options)&&wr(r,o.config))return o;throw rt.create("duplicate-app",{appName:s})}const a=new Qh(s);for(const h of Ks.values())a.addComponent(h);const c=new jd(t,r,a);return Ar.set(s,c),c}function pi(n=Gs){const e=Ar.get(n);if(!e&&n===Gs&&Nl())return $l();if(!e)throw rt.create("no-app",{appName:n});return e}function Ce(n,e,t){var r;let s=(r=Bd[n])!==null&&r!==void 0?r:n;t&&(s+=`-${t}`);const o=s.match(/\s|\//),a=e.match(/\s|\//);if(o||a){const c=[`Unable to register library "${s}" with version "${e}":`];o&&c.push(`library name "${s}" contains illegal characters (whitespace or "/")`),o&&a&&c.push("and"),a&&c.push(`version name "${e}" contains illegal characters (whitespace or "/")`),He.warn(c.join(" "));return}Ge(new Me(`${s}-version`,()=>({library:s,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qd="firebase-heartbeat-database",zd=1,Vn="firebase-heartbeat-store";let Vs=null;function jl(){return Vs||(Vs=Bl(qd,zd,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(Vn)}catch(t){console.warn(t)}}}}).catch(n=>{throw rt.create("idb-open",{originalErrorMessage:n.message})})),Vs}async function Hd(n){try{const t=(await jl()).transaction(Vn),r=await t.objectStore(Vn).get(ql(n));return await t.done,r}catch(e){if(e instanceof Qe)He.warn(e.message);else{const t=rt.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});He.warn(t.message)}}}async function ga(n,e){try{const r=(await jl()).transaction(Vn,"readwrite");await r.objectStore(Vn).put(e,ql(n)),await r.done}catch(t){if(t instanceof Qe)He.warn(t.message);else{const r=rt.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});He.warn(r.message)}}}function ql(n){return`${n.name}!${n.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gd=1024,Kd=30*24*60*60*1e3;class Wd{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new Yd(t),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,t;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),o=ya();return((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===o||this._heartbeatsCache.heartbeats.some(a=>a.date===o)?void 0:(this._heartbeatsCache.heartbeats.push({date:o,agent:s}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(a=>{const c=new Date(a.date).valueOf();return Date.now()-c<=Kd}),this._storage.overwrite(this._heartbeatsCache))}catch(r){He.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=ya(),{heartbeatsToSend:r,unsentEntries:s}=Qd(this._heartbeatsCache.heartbeats),o=Tr(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=t,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),o}catch(t){return He.warn(t),""}}}function ya(){return new Date().toISOString().substring(0,10)}function Qd(n,e=Gd){const t=[];let r=n.slice();for(const s of n){const o=t.find(a=>a.agent===s.agent);if(o){if(o.dates.push(s.date),_a(t)>e){o.dates.pop();break}}else if(t.push({agent:s.agent,dates:[s.date]}),_a(t)>e){t.pop();break}r=r.slice(1)}return{heartbeatsToSend:t,unsentEntries:r}}class Yd{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return xl()?Ll().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await Hd(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const s=await this.read();return ga(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:s.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var t;if(await this._canUseIndexedDBPromise){const s=await this.read();return ga(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:s.lastSentHeartbeatDate,heartbeats:[...s.heartbeats,...e.heartbeats]})}else return}}function _a(n){return Tr(JSON.stringify({version:2,heartbeats:n})).length}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xd(n){Ge(new Me("platform-logger",e=>new ud(e),"PRIVATE")),Ge(new Me("heartbeat",e=>new Wd(e),"PRIVATE")),Ce(Hs,ma,n),Ce(Hs,ma,"esm2017"),Ce("fire-js","")}Xd("");var Jd="firebase",Zd="10.14.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Ce(Jd,Zd,"app");const zl="@firebase/installations",gi="0.6.9";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hl=1e4,Gl=`w:${gi}`,Kl="FIS_v2",ef="https://firebaseinstallations.googleapis.com/v1",tf=60*60*1e3,nf="installations",rf="Installations";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sf={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},Rt=new Ur(nf,rf,sf);function Wl(n){return n instanceof Qe&&n.code.includes("request-failed")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ql({projectId:n}){return`${ef}/projects/${n}/installations`}function Yl(n){return{token:n.token,requestStatus:2,expiresIn:af(n.expiresIn),creationTime:Date.now()}}async function Xl(n,e){const r=(await e.json()).error;return Rt.create("request-failed",{requestName:n,serverCode:r.code,serverMessage:r.message,serverStatus:r.status})}function Jl({apiKey:n}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":n})}function of(n,{refreshToken:e}){const t=Jl(n);return t.append("Authorization",lf(e)),t}async function Zl(n){const e=await n();return e.status>=500&&e.status<600?n():e}function af(n){return Number(n.replace("s","000"))}function lf(n){return`${Kl} ${n}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function cf({appConfig:n,heartbeatServiceProvider:e},{fid:t}){const r=Ql(n),s=Jl(n),o=e.getImmediate({optional:!0});if(o){const d=await o.getHeartbeatsHeader();d&&s.append("x-firebase-client",d)}const a={fid:t,authVersion:Kl,appId:n.appId,sdkVersion:Gl},c={method:"POST",headers:s,body:JSON.stringify(a)},h=await Zl(()=>fetch(r,c));if(h.ok){const d=await h.json();return{fid:d.fid||t,registrationStatus:2,refreshToken:d.refreshToken,authToken:Yl(d.authToken)}}else throw await Xl("Create Installation",h)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ec(n){return new Promise(e=>{setTimeout(e,n)})}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function uf(n){return btoa(String.fromCharCode(...n)).replace(/\+/g,"-").replace(/\//g,"_")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hf=/^[cdef][\w-]{21}$/,Ws="";function df(){try{const n=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(n),n[0]=112+n[0]%16;const t=ff(n);return hf.test(t)?t:Ws}catch{return Ws}}function ff(n){return uf(n).substr(0,22)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $r(n){return`${n.appName}!${n.appId}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tc=new Map;function nc(n,e){const t=$r(n);rc(t,e),mf(t,e)}function rc(n,e){const t=tc.get(n);if(t)for(const r of t)r(e)}function mf(n,e){const t=pf();t&&t.postMessage({key:n,fid:e}),gf()}let Et=null;function pf(){return!Et&&"BroadcastChannel"in self&&(Et=new BroadcastChannel("[Firebase] FID Change"),Et.onmessage=n=>{rc(n.data.key,n.data.fid)}),Et}function gf(){tc.size===0&&Et&&(Et.close(),Et=null)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yf="firebase-installations-database",_f=1,Pt="firebase-installations-store";let ks=null;function yi(){return ks||(ks=Bl(yf,_f,{upgrade:(n,e)=>{switch(e){case 0:n.createObjectStore(Pt)}}})),ks}async function br(n,e){const t=$r(n),s=(await yi()).transaction(Pt,"readwrite"),o=s.objectStore(Pt),a=await o.get(t);return await o.put(e,t),await s.done,(!a||a.fid!==e.fid)&&nc(n,e.fid),e}async function sc(n){const e=$r(n),r=(await yi()).transaction(Pt,"readwrite");await r.objectStore(Pt).delete(e),await r.done}async function jr(n,e){const t=$r(n),s=(await yi()).transaction(Pt,"readwrite"),o=s.objectStore(Pt),a=await o.get(t),c=e(a);return c===void 0?await o.delete(t):await o.put(c,t),await s.done,c&&(!a||a.fid!==c.fid)&&nc(n,c.fid),c}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function _i(n){let e;const t=await jr(n.appConfig,r=>{const s=vf(r),o=Ef(n,s);return e=o.registrationPromise,o.installationEntry});return t.fid===Ws?{installationEntry:await e}:{installationEntry:t,registrationPromise:e}}function vf(n){const e=n||{fid:df(),registrationStatus:0};return ic(e)}function Ef(n,e){if(e.registrationStatus===0){if(!navigator.onLine){const s=Promise.reject(Rt.create("app-offline"));return{installationEntry:e,registrationPromise:s}}const t={fid:e.fid,registrationStatus:1,registrationTime:Date.now()},r=If(n,t);return{installationEntry:t,registrationPromise:r}}else return e.registrationStatus===1?{installationEntry:e,registrationPromise:Tf(n)}:{installationEntry:e}}async function If(n,e){try{const t=await cf(n,e);return br(n.appConfig,t)}catch(t){throw Wl(t)&&t.customData.serverCode===409?await sc(n.appConfig):await br(n.appConfig,{fid:e.fid,registrationStatus:0}),t}}async function Tf(n){let e=await va(n.appConfig);for(;e.registrationStatus===1;)await ec(100),e=await va(n.appConfig);if(e.registrationStatus===0){const{installationEntry:t,registrationPromise:r}=await _i(n);return r||t}return e}function va(n){return jr(n,e=>{if(!e)throw Rt.create("installation-not-found");return ic(e)})}function ic(n){return wf(n)?{fid:n.fid,registrationStatus:0}:n}function wf(n){return n.registrationStatus===1&&n.registrationTime+Hl<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Af({appConfig:n,heartbeatServiceProvider:e},t){const r=bf(n,t),s=of(n,t),o=e.getImmediate({optional:!0});if(o){const d=await o.getHeartbeatsHeader();d&&s.append("x-firebase-client",d)}const a={installation:{sdkVersion:Gl,appId:n.appId}},c={method:"POST",headers:s,body:JSON.stringify(a)},h=await Zl(()=>fetch(r,c));if(h.ok){const d=await h.json();return Yl(d)}else throw await Xl("Generate Auth Token",h)}function bf(n,{fid:e}){return`${Ql(n)}/${e}/authTokens:generate`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function vi(n,e=!1){let t;const r=await jr(n.appConfig,o=>{if(!oc(o))throw Rt.create("not-registered");const a=o.authToken;if(!e&&Sf(a))return o;if(a.requestStatus===1)return t=Rf(n,e),o;{if(!navigator.onLine)throw Rt.create("app-offline");const c=Df(o);return t=Pf(n,c),c}});return t?await t:r.authToken}async function Rf(n,e){let t=await Ea(n.appConfig);for(;t.authToken.requestStatus===1;)await ec(100),t=await Ea(n.appConfig);const r=t.authToken;return r.requestStatus===0?vi(n,e):r}function Ea(n){return jr(n,e=>{if(!oc(e))throw Rt.create("not-registered");const t=e.authToken;return Vf(t)?Object.assign(Object.assign({},e),{authToken:{requestStatus:0}}):e})}async function Pf(n,e){try{const t=await Af(n,e),r=Object.assign(Object.assign({},e),{authToken:t});return await br(n.appConfig,r),t}catch(t){if(Wl(t)&&(t.customData.serverCode===401||t.customData.serverCode===404))await sc(n.appConfig);else{const r=Object.assign(Object.assign({},e),{authToken:{requestStatus:0}});await br(n.appConfig,r)}throw t}}function oc(n){return n!==void 0&&n.registrationStatus===2}function Sf(n){return n.requestStatus===2&&!Cf(n)}function Cf(n){const e=Date.now();return e<n.creationTime||n.creationTime+n.expiresIn<e+tf}function Df(n){const e={requestStatus:1,requestTime:Date.now()};return Object.assign(Object.assign({},n),{authToken:e})}function Vf(n){return n.requestStatus===1&&n.requestTime+Hl<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function kf(n){const e=n,{installationEntry:t,registrationPromise:r}=await _i(e);return r?r.catch(console.error):vi(e).catch(console.error),t.fid}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Nf(n,e=!1){const t=n;return await Of(t),(await vi(t,e)).token}async function Of(n){const{registrationPromise:e}=await _i(n);e&&await e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xf(n){if(!n||!n.options)throw Ns("App Configuration");if(!n.name)throw Ns("App Name");const e=["projectId","apiKey","appId"];for(const t of e)if(!n.options[t])throw Ns(t);return{appName:n.name,projectId:n.options.projectId,apiKey:n.options.apiKey,appId:n.options.appId}}function Ns(n){return Rt.create("missing-app-config-values",{valueName:n})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ac="installations",Lf="installations-internal",Mf=n=>{const e=n.getProvider("app").getImmediate(),t=xf(e),r=Jt(e,"heartbeat");return{app:e,appConfig:t,heartbeatServiceProvider:r,_delete:()=>Promise.resolve()}},Ff=n=>{const e=n.getProvider("app").getImmediate(),t=Jt(e,ac).getImmediate();return{getId:()=>kf(t),getToken:s=>Nf(t,s)}};function Bf(){Ge(new Me(ac,Mf,"PUBLIC")),Ge(new Me(Lf,Ff,"PRIVATE"))}Bf();Ce(zl,gi);Ce(zl,gi,"esm2017");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rr="analytics",Uf="firebase_id",$f="origin",jf=60*1e3,qf="https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig",Ei="https://www.googletagmanager.com/gtag/js";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const we=new fi("@firebase/analytics");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zf={"already-exists":"A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.","already-initialized":"initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-initialized instance.","already-initialized-settings":"Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.","interop-component-reg-failed":"Firebase Analytics Interop Component failed to instantiate: {$reason}","invalid-analytics-context":"Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","indexeddb-unavailable":"IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","fetch-throttle":"The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.","config-fetch-failed":"Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}","no-api-key":'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',"no-app-id":'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.',"no-client-id":'The "client_id" field is empty.',"invalid-gtag-resource":"Trusted Types detected an invalid gtag resource: {$gtagURL}."},Pe=new Ur("analytics","Analytics",zf);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Hf(n){if(!n.startsWith(Ei)){const e=Pe.create("invalid-gtag-resource",{gtagURL:n});return we.warn(e.message),""}return n}function lc(n){return Promise.all(n.map(e=>e.catch(t=>t)))}function Gf(n,e){let t;return window.trustedTypes&&(t=window.trustedTypes.createPolicy(n,e)),t}function Kf(n,e){const t=Gf("firebase-js-sdk-policy",{createScriptURL:Hf}),r=document.createElement("script"),s=`${Ei}?l=${n}&id=${e}`;r.src=t?t==null?void 0:t.createScriptURL(s):s,r.async=!0,document.head.appendChild(r)}function Wf(n){let e=[];return Array.isArray(window[n])?e=window[n]:window[n]=e,e}async function Qf(n,e,t,r,s,o){const a=r[s];try{if(a)await e[a];else{const h=(await lc(t)).find(d=>d.measurementId===s);h&&await e[h.appId]}}catch(c){we.error(c)}n("config",s,o)}async function Yf(n,e,t,r,s){try{let o=[];if(s&&s.send_to){let a=s.send_to;Array.isArray(a)||(a=[a]);const c=await lc(t);for(const h of a){const d=c.find(_=>_.measurementId===h),m=d&&e[d.appId];if(m)o.push(m);else{o=[];break}}}o.length===0&&(o=Object.values(e)),await Promise.all(o),n("event",r,s||{})}catch(o){we.error(o)}}function Xf(n,e,t,r){async function s(o,...a){try{if(o==="event"){const[c,h]=a;await Yf(n,e,t,c,h)}else if(o==="config"){const[c,h]=a;await Qf(n,e,t,r,c,h)}else if(o==="consent"){const[c,h]=a;n("consent",c,h)}else if(o==="get"){const[c,h,d]=a;n("get",c,h,d)}else if(o==="set"){const[c]=a;n("set",c)}else n(o,...a)}catch(c){we.error(c)}}return s}function Jf(n,e,t,r,s){let o=function(...a){window[r].push(arguments)};return window[s]&&typeof window[s]=="function"&&(o=window[s]),window[s]=Xf(o,n,e,t),{gtagCore:o,wrappedGtag:window[s]}}function Zf(n){const e=window.document.getElementsByTagName("script");for(const t of Object.values(e))if(t.src&&t.src.includes(Ei)&&t.src.includes(n))return t;return null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const em=30,tm=1e3;class nm{constructor(e={},t=tm){this.throttleMetadata=e,this.intervalMillis=t}getThrottleMetadata(e){return this.throttleMetadata[e]}setThrottleMetadata(e,t){this.throttleMetadata[e]=t}deleteThrottleMetadata(e){delete this.throttleMetadata[e]}}const cc=new nm;function rm(n){return new Headers({Accept:"application/json","x-goog-api-key":n})}async function sm(n){var e;const{appId:t,apiKey:r}=n,s={method:"GET",headers:rm(r)},o=qf.replace("{app-id}",t),a=await fetch(o,s);if(a.status!==200&&a.status!==304){let c="";try{const h=await a.json();!((e=h.error)===null||e===void 0)&&e.message&&(c=h.error.message)}catch{}throw Pe.create("config-fetch-failed",{httpStatus:a.status,responseMessage:c})}return a.json()}async function im(n,e=cc,t){const{appId:r,apiKey:s,measurementId:o}=n.options;if(!r)throw Pe.create("no-app-id");if(!s){if(o)return{measurementId:o,appId:r};throw Pe.create("no-api-key")}const a=e.getThrottleMetadata(r)||{backoffCount:0,throttleEndTimeMillis:Date.now()},c=new lm;return setTimeout(async()=>{c.abort()},jf),uc({appId:r,apiKey:s,measurementId:o},a,c,e)}async function uc(n,{throttleEndTimeMillis:e,backoffCount:t},r,s=cc){var o;const{appId:a,measurementId:c}=n;try{await om(r,e)}catch(h){if(c)return we.warn(`Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${c} provided in the "measurementId" field in the local Firebase config. [${h==null?void 0:h.message}]`),{appId:a,measurementId:c};throw h}try{const h=await sm(n);return s.deleteThrottleMetadata(a),h}catch(h){const d=h;if(!am(d)){if(s.deleteThrottleMetadata(a),c)return we.warn(`Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${c} provided in the "measurementId" field in the local Firebase config. [${d==null?void 0:d.message}]`),{appId:a,measurementId:c};throw h}const m=Number((o=d==null?void 0:d.customData)===null||o===void 0?void 0:o.httpStatus)===503?ua(t,s.intervalMillis,em):ua(t,s.intervalMillis),_={throttleEndTimeMillis:Date.now()+m,backoffCount:t+1};return s.setThrottleMetadata(a,_),we.debug(`Calling attemptFetch again in ${m} millis`),uc(n,_,r,s)}}function om(n,e){return new Promise((t,r)=>{const s=Math.max(e-Date.now(),0),o=setTimeout(t,s);n.addEventListener(()=>{clearTimeout(o),r(Pe.create("fetch-throttle",{throttleEndTimeMillis:e}))})})}function am(n){if(!(n instanceof Qe)||!n.customData)return!1;const e=Number(n.customData.httpStatus);return e===429||e===500||e===503||e===504}class lm{constructor(){this.listeners=[]}addEventListener(e){this.listeners.push(e)}abort(){this.listeners.forEach(e=>e())}}async function cm(n,e,t,r,s){if(s&&s.global){n("event",t,r);return}else{const o=await e,a=Object.assign(Object.assign({},r),{send_to:o});n("event",t,a)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function um(){if(xl())try{await Ll()}catch(n){return we.warn(Pe.create("indexeddb-unavailable",{errorInfo:n==null?void 0:n.toString()}).message),!1}else return we.warn(Pe.create("indexeddb-unavailable",{errorInfo:"IndexedDB is not available in this environment."}).message),!1;return!0}async function hm(n,e,t,r,s,o,a){var c;const h=im(n);h.then(R=>{t[R.measurementId]=R.appId,n.options.measurementId&&R.measurementId!==n.options.measurementId&&we.warn(`The measurement ID in the local Firebase config (${n.options.measurementId}) does not match the measurement ID fetched from the server (${R.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`)}).catch(R=>we.error(R)),e.push(h);const d=um().then(R=>{if(R)return r.getId()}),[m,_]=await Promise.all([h,d]);Zf(o)||Kf(o,m.measurementId),s("js",new Date);const A=(c=a==null?void 0:a.config)!==null&&c!==void 0?c:{};return A[$f]="firebase",A.update=!0,_!=null&&(A[Uf]=_),s("config",m.measurementId,A),m.measurementId}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dm{constructor(e){this.app=e}_delete(){return delete Rn[this.app.options.appId],Promise.resolve()}}let Rn={},Ia=[];const Ta={};let Os="dataLayer",fm="gtag",wa,hc,Aa=!1;function mm(){const n=[];if(Lh()&&n.push("This is a browser extension environment."),Fh()||n.push("Cookies are not available."),n.length>0){const e=n.map((r,s)=>`(${s+1}) ${r}`).join(" "),t=Pe.create("invalid-analytics-context",{errorInfo:e});we.warn(t.message)}}function pm(n,e,t){mm();const r=n.options.appId;if(!r)throw Pe.create("no-app-id");if(!n.options.apiKey)if(n.options.measurementId)we.warn(`The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${n.options.measurementId} provided in the "measurementId" field in the local Firebase config.`);else throw Pe.create("no-api-key");if(Rn[r]!=null)throw Pe.create("already-exists",{id:r});if(!Aa){Wf(Os);const{wrappedGtag:o,gtagCore:a}=Jf(Rn,Ia,Ta,Os,fm);hc=o,wa=a,Aa=!0}return Rn[r]=hm(n,Ia,Ta,e,wa,Os,t),new dm(n)}function gm(n=pi()){n=ke(n);const e=Jt(n,Rr);return e.isInitialized()?e.getImmediate():ym(n)}function ym(n,e={}){const t=Jt(n,Rr);if(t.isInitialized()){const s=t.getImmediate();if(wr(e,t.getOptions()))return s;throw Pe.create("already-initialized")}return t.initialize({options:e})}function _m(n,e,t,r){n=ke(n),cm(hc,Rn[n.app.options.appId],e,t,r).catch(s=>we.error(s))}const ba="@firebase/analytics",Ra="0.10.8";function vm(){Ge(new Me(Rr,(e,{options:t})=>{const r=e.getProvider("app").getImmediate(),s=e.getProvider("installations-internal").getImmediate();return pm(r,s,t)},"PUBLIC")),Ge(new Me("analytics-internal",n,"PRIVATE")),Ce(ba,Ra),Ce(ba,Ra,"esm2017");function n(e){try{const t=e.getProvider(Rr).getImmediate();return{logEvent:(r,s,o)=>_m(t,r,s,o)}}catch(t){throw Pe.create("interop-component-reg-failed",{reason:t})}}}vm();var Pa=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var wt,dc;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(E,p){function y(){}y.prototype=p.prototype,E.D=p.prototype,E.prototype=new y,E.prototype.constructor=E,E.C=function(v,I,w){for(var g=Array(arguments.length-2),je=2;je<arguments.length;je++)g[je-2]=arguments[je];return p.prototype[I].apply(v,g)}}function t(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(r,t),r.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(E,p,y){y||(y=0);var v=Array(16);if(typeof p=="string")for(var I=0;16>I;++I)v[I]=p.charCodeAt(y++)|p.charCodeAt(y++)<<8|p.charCodeAt(y++)<<16|p.charCodeAt(y++)<<24;else for(I=0;16>I;++I)v[I]=p[y++]|p[y++]<<8|p[y++]<<16|p[y++]<<24;p=E.g[0],y=E.g[1],I=E.g[2];var w=E.g[3],g=p+(w^y&(I^w))+v[0]+3614090360&4294967295;p=y+(g<<7&4294967295|g>>>25),g=w+(I^p&(y^I))+v[1]+3905402710&4294967295,w=p+(g<<12&4294967295|g>>>20),g=I+(y^w&(p^y))+v[2]+606105819&4294967295,I=w+(g<<17&4294967295|g>>>15),g=y+(p^I&(w^p))+v[3]+3250441966&4294967295,y=I+(g<<22&4294967295|g>>>10),g=p+(w^y&(I^w))+v[4]+4118548399&4294967295,p=y+(g<<7&4294967295|g>>>25),g=w+(I^p&(y^I))+v[5]+1200080426&4294967295,w=p+(g<<12&4294967295|g>>>20),g=I+(y^w&(p^y))+v[6]+2821735955&4294967295,I=w+(g<<17&4294967295|g>>>15),g=y+(p^I&(w^p))+v[7]+4249261313&4294967295,y=I+(g<<22&4294967295|g>>>10),g=p+(w^y&(I^w))+v[8]+1770035416&4294967295,p=y+(g<<7&4294967295|g>>>25),g=w+(I^p&(y^I))+v[9]+2336552879&4294967295,w=p+(g<<12&4294967295|g>>>20),g=I+(y^w&(p^y))+v[10]+4294925233&4294967295,I=w+(g<<17&4294967295|g>>>15),g=y+(p^I&(w^p))+v[11]+2304563134&4294967295,y=I+(g<<22&4294967295|g>>>10),g=p+(w^y&(I^w))+v[12]+1804603682&4294967295,p=y+(g<<7&4294967295|g>>>25),g=w+(I^p&(y^I))+v[13]+4254626195&4294967295,w=p+(g<<12&4294967295|g>>>20),g=I+(y^w&(p^y))+v[14]+2792965006&4294967295,I=w+(g<<17&4294967295|g>>>15),g=y+(p^I&(w^p))+v[15]+1236535329&4294967295,y=I+(g<<22&4294967295|g>>>10),g=p+(I^w&(y^I))+v[1]+4129170786&4294967295,p=y+(g<<5&4294967295|g>>>27),g=w+(y^I&(p^y))+v[6]+3225465664&4294967295,w=p+(g<<9&4294967295|g>>>23),g=I+(p^y&(w^p))+v[11]+643717713&4294967295,I=w+(g<<14&4294967295|g>>>18),g=y+(w^p&(I^w))+v[0]+3921069994&4294967295,y=I+(g<<20&4294967295|g>>>12),g=p+(I^w&(y^I))+v[5]+3593408605&4294967295,p=y+(g<<5&4294967295|g>>>27),g=w+(y^I&(p^y))+v[10]+38016083&4294967295,w=p+(g<<9&4294967295|g>>>23),g=I+(p^y&(w^p))+v[15]+3634488961&4294967295,I=w+(g<<14&4294967295|g>>>18),g=y+(w^p&(I^w))+v[4]+3889429448&4294967295,y=I+(g<<20&4294967295|g>>>12),g=p+(I^w&(y^I))+v[9]+568446438&4294967295,p=y+(g<<5&4294967295|g>>>27),g=w+(y^I&(p^y))+v[14]+3275163606&4294967295,w=p+(g<<9&4294967295|g>>>23),g=I+(p^y&(w^p))+v[3]+4107603335&4294967295,I=w+(g<<14&4294967295|g>>>18),g=y+(w^p&(I^w))+v[8]+1163531501&4294967295,y=I+(g<<20&4294967295|g>>>12),g=p+(I^w&(y^I))+v[13]+2850285829&4294967295,p=y+(g<<5&4294967295|g>>>27),g=w+(y^I&(p^y))+v[2]+4243563512&4294967295,w=p+(g<<9&4294967295|g>>>23),g=I+(p^y&(w^p))+v[7]+1735328473&4294967295,I=w+(g<<14&4294967295|g>>>18),g=y+(w^p&(I^w))+v[12]+2368359562&4294967295,y=I+(g<<20&4294967295|g>>>12),g=p+(y^I^w)+v[5]+4294588738&4294967295,p=y+(g<<4&4294967295|g>>>28),g=w+(p^y^I)+v[8]+2272392833&4294967295,w=p+(g<<11&4294967295|g>>>21),g=I+(w^p^y)+v[11]+1839030562&4294967295,I=w+(g<<16&4294967295|g>>>16),g=y+(I^w^p)+v[14]+4259657740&4294967295,y=I+(g<<23&4294967295|g>>>9),g=p+(y^I^w)+v[1]+2763975236&4294967295,p=y+(g<<4&4294967295|g>>>28),g=w+(p^y^I)+v[4]+1272893353&4294967295,w=p+(g<<11&4294967295|g>>>21),g=I+(w^p^y)+v[7]+4139469664&4294967295,I=w+(g<<16&4294967295|g>>>16),g=y+(I^w^p)+v[10]+3200236656&4294967295,y=I+(g<<23&4294967295|g>>>9),g=p+(y^I^w)+v[13]+681279174&4294967295,p=y+(g<<4&4294967295|g>>>28),g=w+(p^y^I)+v[0]+3936430074&4294967295,w=p+(g<<11&4294967295|g>>>21),g=I+(w^p^y)+v[3]+3572445317&4294967295,I=w+(g<<16&4294967295|g>>>16),g=y+(I^w^p)+v[6]+76029189&4294967295,y=I+(g<<23&4294967295|g>>>9),g=p+(y^I^w)+v[9]+3654602809&4294967295,p=y+(g<<4&4294967295|g>>>28),g=w+(p^y^I)+v[12]+3873151461&4294967295,w=p+(g<<11&4294967295|g>>>21),g=I+(w^p^y)+v[15]+530742520&4294967295,I=w+(g<<16&4294967295|g>>>16),g=y+(I^w^p)+v[2]+3299628645&4294967295,y=I+(g<<23&4294967295|g>>>9),g=p+(I^(y|~w))+v[0]+4096336452&4294967295,p=y+(g<<6&4294967295|g>>>26),g=w+(y^(p|~I))+v[7]+1126891415&4294967295,w=p+(g<<10&4294967295|g>>>22),g=I+(p^(w|~y))+v[14]+2878612391&4294967295,I=w+(g<<15&4294967295|g>>>17),g=y+(w^(I|~p))+v[5]+4237533241&4294967295,y=I+(g<<21&4294967295|g>>>11),g=p+(I^(y|~w))+v[12]+1700485571&4294967295,p=y+(g<<6&4294967295|g>>>26),g=w+(y^(p|~I))+v[3]+2399980690&4294967295,w=p+(g<<10&4294967295|g>>>22),g=I+(p^(w|~y))+v[10]+4293915773&4294967295,I=w+(g<<15&4294967295|g>>>17),g=y+(w^(I|~p))+v[1]+2240044497&4294967295,y=I+(g<<21&4294967295|g>>>11),g=p+(I^(y|~w))+v[8]+1873313359&4294967295,p=y+(g<<6&4294967295|g>>>26),g=w+(y^(p|~I))+v[15]+4264355552&4294967295,w=p+(g<<10&4294967295|g>>>22),g=I+(p^(w|~y))+v[6]+2734768916&4294967295,I=w+(g<<15&4294967295|g>>>17),g=y+(w^(I|~p))+v[13]+1309151649&4294967295,y=I+(g<<21&4294967295|g>>>11),g=p+(I^(y|~w))+v[4]+4149444226&4294967295,p=y+(g<<6&4294967295|g>>>26),g=w+(y^(p|~I))+v[11]+3174756917&4294967295,w=p+(g<<10&4294967295|g>>>22),g=I+(p^(w|~y))+v[2]+718787259&4294967295,I=w+(g<<15&4294967295|g>>>17),g=y+(w^(I|~p))+v[9]+3951481745&4294967295,E.g[0]=E.g[0]+p&4294967295,E.g[1]=E.g[1]+(I+(g<<21&4294967295|g>>>11))&4294967295,E.g[2]=E.g[2]+I&4294967295,E.g[3]=E.g[3]+w&4294967295}r.prototype.u=function(E,p){p===void 0&&(p=E.length);for(var y=p-this.blockSize,v=this.B,I=this.h,w=0;w<p;){if(I==0)for(;w<=y;)s(this,E,w),w+=this.blockSize;if(typeof E=="string"){for(;w<p;)if(v[I++]=E.charCodeAt(w++),I==this.blockSize){s(this,v),I=0;break}}else for(;w<p;)if(v[I++]=E[w++],I==this.blockSize){s(this,v),I=0;break}}this.h=I,this.o+=p},r.prototype.v=function(){var E=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);E[0]=128;for(var p=1;p<E.length-8;++p)E[p]=0;var y=8*this.o;for(p=E.length-8;p<E.length;++p)E[p]=y&255,y/=256;for(this.u(E),E=Array(16),p=y=0;4>p;++p)for(var v=0;32>v;v+=8)E[y++]=this.g[p]>>>v&255;return E};function o(E,p){var y=c;return Object.prototype.hasOwnProperty.call(y,E)?y[E]:y[E]=p(E)}function a(E,p){this.h=p;for(var y=[],v=!0,I=E.length-1;0<=I;I--){var w=E[I]|0;v&&w==p||(y[I]=w,v=!1)}this.g=y}var c={};function h(E){return-128<=E&&128>E?o(E,function(p){return new a([p|0],0>p?-1:0)}):new a([E|0],0>E?-1:0)}function d(E){if(isNaN(E)||!isFinite(E))return _;if(0>E)return C(d(-E));for(var p=[],y=1,v=0;E>=y;v++)p[v]=E/y|0,y*=4294967296;return new a(p,0)}function m(E,p){if(E.length==0)throw Error("number format error: empty string");if(p=p||10,2>p||36<p)throw Error("radix out of range: "+p);if(E.charAt(0)=="-")return C(m(E.substring(1),p));if(0<=E.indexOf("-"))throw Error('number format error: interior "-" character');for(var y=d(Math.pow(p,8)),v=_,I=0;I<E.length;I+=8){var w=Math.min(8,E.length-I),g=parseInt(E.substring(I,I+w),p);8>w?(w=d(Math.pow(p,w)),v=v.j(w).add(d(g))):(v=v.j(y),v=v.add(d(g)))}return v}var _=h(0),A=h(1),R=h(16777216);n=a.prototype,n.m=function(){if(k(this))return-C(this).m();for(var E=0,p=1,y=0;y<this.g.length;y++){var v=this.i(y);E+=(0<=v?v:4294967296+v)*p,p*=4294967296}return E},n.toString=function(E){if(E=E||10,2>E||36<E)throw Error("radix out of range: "+E);if(V(this))return"0";if(k(this))return"-"+C(this).toString(E);for(var p=d(Math.pow(E,6)),y=this,v="";;){var I=M(y,p).g;y=$(y,I.j(p));var w=((0<y.g.length?y.g[0]:y.h)>>>0).toString(E);if(y=I,V(y))return w+v;for(;6>w.length;)w="0"+w;v=w+v}},n.i=function(E){return 0>E?0:E<this.g.length?this.g[E]:this.h};function V(E){if(E.h!=0)return!1;for(var p=0;p<E.g.length;p++)if(E.g[p]!=0)return!1;return!0}function k(E){return E.h==-1}n.l=function(E){return E=$(this,E),k(E)?-1:V(E)?0:1};function C(E){for(var p=E.g.length,y=[],v=0;v<p;v++)y[v]=~E.g[v];return new a(y,~E.h).add(A)}n.abs=function(){return k(this)?C(this):this},n.add=function(E){for(var p=Math.max(this.g.length,E.g.length),y=[],v=0,I=0;I<=p;I++){var w=v+(this.i(I)&65535)+(E.i(I)&65535),g=(w>>>16)+(this.i(I)>>>16)+(E.i(I)>>>16);v=g>>>16,w&=65535,g&=65535,y[I]=g<<16|w}return new a(y,y[y.length-1]&-2147483648?-1:0)};function $(E,p){return E.add(C(p))}n.j=function(E){if(V(this)||V(E))return _;if(k(this))return k(E)?C(this).j(C(E)):C(C(this).j(E));if(k(E))return C(this.j(C(E)));if(0>this.l(R)&&0>E.l(R))return d(this.m()*E.m());for(var p=this.g.length+E.g.length,y=[],v=0;v<2*p;v++)y[v]=0;for(v=0;v<this.g.length;v++)for(var I=0;I<E.g.length;I++){var w=this.i(v)>>>16,g=this.i(v)&65535,je=E.i(I)>>>16,nn=E.i(I)&65535;y[2*v+2*I]+=g*nn,j(y,2*v+2*I),y[2*v+2*I+1]+=w*nn,j(y,2*v+2*I+1),y[2*v+2*I+1]+=g*je,j(y,2*v+2*I+1),y[2*v+2*I+2]+=w*je,j(y,2*v+2*I+2)}for(v=0;v<p;v++)y[v]=y[2*v+1]<<16|y[2*v];for(v=p;v<2*p;v++)y[v]=0;return new a(y,0)};function j(E,p){for(;(E[p]&65535)!=E[p];)E[p+1]+=E[p]>>>16,E[p]&=65535,p++}function N(E,p){this.g=E,this.h=p}function M(E,p){if(V(p))throw Error("division by zero");if(V(E))return new N(_,_);if(k(E))return p=M(C(E),p),new N(C(p.g),C(p.h));if(k(p))return p=M(E,C(p)),new N(C(p.g),p.h);if(30<E.g.length){if(k(E)||k(p))throw Error("slowDivide_ only works with positive integers.");for(var y=A,v=p;0>=v.l(E);)y=J(y),v=J(v);var I=Q(y,1),w=Q(v,1);for(v=Q(v,2),y=Q(y,2);!V(v);){var g=w.add(v);0>=g.l(E)&&(I=I.add(y),w=g),v=Q(v,1),y=Q(y,1)}return p=$(E,I.j(p)),new N(I,p)}for(I=_;0<=E.l(p);){for(y=Math.max(1,Math.floor(E.m()/p.m())),v=Math.ceil(Math.log(y)/Math.LN2),v=48>=v?1:Math.pow(2,v-48),w=d(y),g=w.j(p);k(g)||0<g.l(E);)y-=v,w=d(y),g=w.j(p);V(w)&&(w=A),I=I.add(w),E=$(E,g)}return new N(I,E)}n.A=function(E){return M(this,E).h},n.and=function(E){for(var p=Math.max(this.g.length,E.g.length),y=[],v=0;v<p;v++)y[v]=this.i(v)&E.i(v);return new a(y,this.h&E.h)},n.or=function(E){for(var p=Math.max(this.g.length,E.g.length),y=[],v=0;v<p;v++)y[v]=this.i(v)|E.i(v);return new a(y,this.h|E.h)},n.xor=function(E){for(var p=Math.max(this.g.length,E.g.length),y=[],v=0;v<p;v++)y[v]=this.i(v)^E.i(v);return new a(y,this.h^E.h)};function J(E){for(var p=E.g.length+1,y=[],v=0;v<p;v++)y[v]=E.i(v)<<1|E.i(v-1)>>>31;return new a(y,E.h)}function Q(E,p){var y=p>>5;p%=32;for(var v=E.g.length-y,I=[],w=0;w<v;w++)I[w]=0<p?E.i(w+y)>>>p|E.i(w+y+1)<<32-p:E.i(w+y);return new a(I,E.h)}r.prototype.digest=r.prototype.v,r.prototype.reset=r.prototype.s,r.prototype.update=r.prototype.u,dc=r,a.prototype.add=a.prototype.add,a.prototype.multiply=a.prototype.j,a.prototype.modulo=a.prototype.A,a.prototype.compare=a.prototype.l,a.prototype.toNumber=a.prototype.m,a.prototype.toString=a.prototype.toString,a.prototype.getBits=a.prototype.i,a.fromNumber=d,a.fromString=m,wt=a}).apply(typeof Pa<"u"?Pa:typeof self<"u"?self:typeof window<"u"?window:{});var dr=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var fc,Tn,mc,yr,Qs,pc,gc,yc;(function(){var n,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(i,l,u){return i==Array.prototype||i==Object.prototype||(i[l]=u.value),i};function t(i){i=[typeof globalThis=="object"&&globalThis,i,typeof window=="object"&&window,typeof self=="object"&&self,typeof dr=="object"&&dr];for(var l=0;l<i.length;++l){var u=i[l];if(u&&u.Math==Math)return u}throw Error("Cannot find global object")}var r=t(this);function s(i,l){if(l)e:{var u=r;i=i.split(".");for(var f=0;f<i.length-1;f++){var T=i[f];if(!(T in u))break e;u=u[T]}i=i[i.length-1],f=u[i],l=l(f),l!=f&&l!=null&&e(u,i,{configurable:!0,writable:!0,value:l})}}function o(i,l){i instanceof String&&(i+="");var u=0,f=!1,T={next:function(){if(!f&&u<i.length){var b=u++;return{value:l(b,i[b]),done:!1}}return f=!0,{done:!0,value:void 0}}};return T[Symbol.iterator]=function(){return T},T}s("Array.prototype.values",function(i){return i||function(){return o(this,function(l,u){return u})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var a=a||{},c=this||self;function h(i){var l=typeof i;return l=l!="object"?l:i?Array.isArray(i)?"array":l:"null",l=="array"||l=="object"&&typeof i.length=="number"}function d(i){var l=typeof i;return l=="object"&&i!=null||l=="function"}function m(i,l,u){return i.call.apply(i.bind,arguments)}function _(i,l,u){if(!i)throw Error();if(2<arguments.length){var f=Array.prototype.slice.call(arguments,2);return function(){var T=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(T,f),i.apply(l,T)}}return function(){return i.apply(l,arguments)}}function A(i,l,u){return A=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?m:_,A.apply(null,arguments)}function R(i,l){var u=Array.prototype.slice.call(arguments,1);return function(){var f=u.slice();return f.push.apply(f,arguments),i.apply(this,f)}}function V(i,l){function u(){}u.prototype=l.prototype,i.aa=l.prototype,i.prototype=new u,i.prototype.constructor=i,i.Qb=function(f,T,b){for(var D=Array(arguments.length-2),Y=2;Y<arguments.length;Y++)D[Y-2]=arguments[Y];return l.prototype[T].apply(f,D)}}function k(i){const l=i.length;if(0<l){const u=Array(l);for(let f=0;f<l;f++)u[f]=i[f];return u}return[]}function C(i,l){for(let u=1;u<arguments.length;u++){const f=arguments[u];if(h(f)){const T=i.length||0,b=f.length||0;i.length=T+b;for(let D=0;D<b;D++)i[T+D]=f[D]}else i.push(f)}}class ${constructor(l,u){this.i=l,this.j=u,this.h=0,this.g=null}get(){let l;return 0<this.h?(this.h--,l=this.g,this.g=l.next,l.next=null):l=this.i(),l}}function j(i){return/^[\s\xa0]*$/.test(i)}function N(){var i=c.navigator;return i&&(i=i.userAgent)?i:""}function M(i){return M[" "](i),i}M[" "]=function(){};var J=N().indexOf("Gecko")!=-1&&!(N().toLowerCase().indexOf("webkit")!=-1&&N().indexOf("Edge")==-1)&&!(N().indexOf("Trident")!=-1||N().indexOf("MSIE")!=-1)&&N().indexOf("Edge")==-1;function Q(i,l,u){for(const f in i)l.call(u,i[f],f,i)}function E(i,l){for(const u in i)l.call(void 0,i[u],u,i)}function p(i){const l={};for(const u in i)l[u]=i[u];return l}const y="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function v(i,l){let u,f;for(let T=1;T<arguments.length;T++){f=arguments[T];for(u in f)i[u]=f[u];for(let b=0;b<y.length;b++)u=y[b],Object.prototype.hasOwnProperty.call(f,u)&&(i[u]=f[u])}}function I(i){var l=1;i=i.split(":");const u=[];for(;0<l&&i.length;)u.push(i.shift()),l--;return i.length&&u.push(i.join(":")),u}function w(i){c.setTimeout(()=>{throw i},0)}function g(){var i=ss;let l=null;return i.g&&(l=i.g,i.g=i.g.next,i.g||(i.h=null),l.next=null),l}class je{constructor(){this.h=this.g=null}add(l,u){const f=nn.get();f.set(l,u),this.h?this.h.next=f:this.g=f,this.h=f}}var nn=new $(()=>new qu,i=>i.reset());class qu{constructor(){this.next=this.g=this.h=null}set(l,u){this.h=l,this.g=u,this.next=null}reset(){this.next=this.g=this.h=null}}let rn,sn=!1,ss=new je,ao=()=>{const i=c.Promise.resolve(void 0);rn=()=>{i.then(zu)}};var zu=()=>{for(var i;i=g();){try{i.h.call(i.g)}catch(u){w(u)}var l=nn;l.j(i),100>l.h&&(l.h++,i.next=l.g,l.g=i)}sn=!1};function Ye(){this.s=this.s,this.C=this.C}Ye.prototype.s=!1,Ye.prototype.ma=function(){this.s||(this.s=!0,this.N())},Ye.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function de(i,l){this.type=i,this.g=this.target=l,this.defaultPrevented=!1}de.prototype.h=function(){this.defaultPrevented=!0};var Hu=function(){if(!c.addEventListener||!Object.defineProperty)return!1;var i=!1,l=Object.defineProperty({},"passive",{get:function(){i=!0}});try{const u=()=>{};c.addEventListener("test",u,l),c.removeEventListener("test",u,l)}catch{}return i}();function on(i,l){if(de.call(this,i?i.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,i){var u=this.type=i.type,f=i.changedTouches&&i.changedTouches.length?i.changedTouches[0]:null;if(this.target=i.target||i.srcElement,this.g=l,l=i.relatedTarget){if(J){e:{try{M(l.nodeName);var T=!0;break e}catch{}T=!1}T||(l=null)}}else u=="mouseover"?l=i.fromElement:u=="mouseout"&&(l=i.toElement);this.relatedTarget=l,f?(this.clientX=f.clientX!==void 0?f.clientX:f.pageX,this.clientY=f.clientY!==void 0?f.clientY:f.pageY,this.screenX=f.screenX||0,this.screenY=f.screenY||0):(this.clientX=i.clientX!==void 0?i.clientX:i.pageX,this.clientY=i.clientY!==void 0?i.clientY:i.pageY,this.screenX=i.screenX||0,this.screenY=i.screenY||0),this.button=i.button,this.key=i.key||"",this.ctrlKey=i.ctrlKey,this.altKey=i.altKey,this.shiftKey=i.shiftKey,this.metaKey=i.metaKey,this.pointerId=i.pointerId||0,this.pointerType=typeof i.pointerType=="string"?i.pointerType:Gu[i.pointerType]||"",this.state=i.state,this.i=i,i.defaultPrevented&&on.aa.h.call(this)}}V(on,de);var Gu={2:"touch",3:"pen",4:"mouse"};on.prototype.h=function(){on.aa.h.call(this);var i=this.i;i.preventDefault?i.preventDefault():i.returnValue=!1};var Kn="closure_listenable_"+(1e6*Math.random()|0),Ku=0;function Wu(i,l,u,f,T){this.listener=i,this.proxy=null,this.src=l,this.type=u,this.capture=!!f,this.ha=T,this.key=++Ku,this.da=this.fa=!1}function Wn(i){i.da=!0,i.listener=null,i.proxy=null,i.src=null,i.ha=null}function Qn(i){this.src=i,this.g={},this.h=0}Qn.prototype.add=function(i,l,u,f,T){var b=i.toString();i=this.g[b],i||(i=this.g[b]=[],this.h++);var D=os(i,l,f,T);return-1<D?(l=i[D],u||(l.fa=!1)):(l=new Wu(l,this.src,b,!!f,T),l.fa=u,i.push(l)),l};function is(i,l){var u=l.type;if(u in i.g){var f=i.g[u],T=Array.prototype.indexOf.call(f,l,void 0),b;(b=0<=T)&&Array.prototype.splice.call(f,T,1),b&&(Wn(l),i.g[u].length==0&&(delete i.g[u],i.h--))}}function os(i,l,u,f){for(var T=0;T<i.length;++T){var b=i[T];if(!b.da&&b.listener==l&&b.capture==!!u&&b.ha==f)return T}return-1}var as="closure_lm_"+(1e6*Math.random()|0),ls={};function lo(i,l,u,f,T){if(Array.isArray(l)){for(var b=0;b<l.length;b++)lo(i,l[b],u,f,T);return null}return u=ho(u),i&&i[Kn]?i.K(l,u,d(f)?!!f.capture:!1,T):Qu(i,l,u,!1,f,T)}function Qu(i,l,u,f,T,b){if(!l)throw Error("Invalid event type");var D=d(T)?!!T.capture:!!T,Y=us(i);if(Y||(i[as]=Y=new Qn(i)),u=Y.add(l,u,f,D,b),u.proxy)return u;if(f=Yu(),u.proxy=f,f.src=i,f.listener=u,i.addEventListener)Hu||(T=D),T===void 0&&(T=!1),i.addEventListener(l.toString(),f,T);else if(i.attachEvent)i.attachEvent(uo(l.toString()),f);else if(i.addListener&&i.removeListener)i.addListener(f);else throw Error("addEventListener and attachEvent are unavailable.");return u}function Yu(){function i(u){return l.call(i.src,i.listener,u)}const l=Xu;return i}function co(i,l,u,f,T){if(Array.isArray(l))for(var b=0;b<l.length;b++)co(i,l[b],u,f,T);else f=d(f)?!!f.capture:!!f,u=ho(u),i&&i[Kn]?(i=i.i,l=String(l).toString(),l in i.g&&(b=i.g[l],u=os(b,u,f,T),-1<u&&(Wn(b[u]),Array.prototype.splice.call(b,u,1),b.length==0&&(delete i.g[l],i.h--)))):i&&(i=us(i))&&(l=i.g[l.toString()],i=-1,l&&(i=os(l,u,f,T)),(u=-1<i?l[i]:null)&&cs(u))}function cs(i){if(typeof i!="number"&&i&&!i.da){var l=i.src;if(l&&l[Kn])is(l.i,i);else{var u=i.type,f=i.proxy;l.removeEventListener?l.removeEventListener(u,f,i.capture):l.detachEvent?l.detachEvent(uo(u),f):l.addListener&&l.removeListener&&l.removeListener(f),(u=us(l))?(is(u,i),u.h==0&&(u.src=null,l[as]=null)):Wn(i)}}}function uo(i){return i in ls?ls[i]:ls[i]="on"+i}function Xu(i,l){if(i.da)i=!0;else{l=new on(l,this);var u=i.listener,f=i.ha||i.src;i.fa&&cs(i),i=u.call(f,l)}return i}function us(i){return i=i[as],i instanceof Qn?i:null}var hs="__closure_events_fn_"+(1e9*Math.random()>>>0);function ho(i){return typeof i=="function"?i:(i[hs]||(i[hs]=function(l){return i.handleEvent(l)}),i[hs])}function fe(){Ye.call(this),this.i=new Qn(this),this.M=this,this.F=null}V(fe,Ye),fe.prototype[Kn]=!0,fe.prototype.removeEventListener=function(i,l,u,f){co(this,i,l,u,f)};function ve(i,l){var u,f=i.F;if(f)for(u=[];f;f=f.F)u.push(f);if(i=i.M,f=l.type||l,typeof l=="string")l=new de(l,i);else if(l instanceof de)l.target=l.target||i;else{var T=l;l=new de(f,i),v(l,T)}if(T=!0,u)for(var b=u.length-1;0<=b;b--){var D=l.g=u[b];T=Yn(D,f,!0,l)&&T}if(D=l.g=i,T=Yn(D,f,!0,l)&&T,T=Yn(D,f,!1,l)&&T,u)for(b=0;b<u.length;b++)D=l.g=u[b],T=Yn(D,f,!1,l)&&T}fe.prototype.N=function(){if(fe.aa.N.call(this),this.i){var i=this.i,l;for(l in i.g){for(var u=i.g[l],f=0;f<u.length;f++)Wn(u[f]);delete i.g[l],i.h--}}this.F=null},fe.prototype.K=function(i,l,u,f){return this.i.add(String(i),l,!1,u,f)},fe.prototype.L=function(i,l,u,f){return this.i.add(String(i),l,!0,u,f)};function Yn(i,l,u,f){if(l=i.i.g[String(l)],!l)return!0;l=l.concat();for(var T=!0,b=0;b<l.length;++b){var D=l[b];if(D&&!D.da&&D.capture==u){var Y=D.listener,ae=D.ha||D.src;D.fa&&is(i.i,D),T=Y.call(ae,f)!==!1&&T}}return T&&!f.defaultPrevented}function fo(i,l,u){if(typeof i=="function")u&&(i=A(i,u));else if(i&&typeof i.handleEvent=="function")i=A(i.handleEvent,i);else throw Error("Invalid listener argument");return 2147483647<Number(l)?-1:c.setTimeout(i,l||0)}function mo(i){i.g=fo(()=>{i.g=null,i.i&&(i.i=!1,mo(i))},i.l);const l=i.h;i.h=null,i.m.apply(null,l)}class Ju extends Ye{constructor(l,u){super(),this.m=l,this.l=u,this.h=null,this.i=!1,this.g=null}j(l){this.h=arguments,this.g?this.i=!0:mo(this)}N(){super.N(),this.g&&(c.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function an(i){Ye.call(this),this.h=i,this.g={}}V(an,Ye);var po=[];function go(i){Q(i.g,function(l,u){this.g.hasOwnProperty(u)&&cs(l)},i),i.g={}}an.prototype.N=function(){an.aa.N.call(this),go(this)},an.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var ds=c.JSON.stringify,Zu=c.JSON.parse,eh=class{stringify(i){return c.JSON.stringify(i,void 0)}parse(i){return c.JSON.parse(i,void 0)}};function fs(){}fs.prototype.h=null;function yo(i){return i.h||(i.h=i.i())}function _o(){}var ln={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function ms(){de.call(this,"d")}V(ms,de);function ps(){de.call(this,"c")}V(ps,de);var ft={},vo=null;function Xn(){return vo=vo||new fe}ft.La="serverreachability";function Eo(i){de.call(this,ft.La,i)}V(Eo,de);function cn(i){const l=Xn();ve(l,new Eo(l))}ft.STAT_EVENT="statevent";function Io(i,l){de.call(this,ft.STAT_EVENT,i),this.stat=l}V(Io,de);function Ee(i){const l=Xn();ve(l,new Io(l,i))}ft.Ma="timingevent";function To(i,l){de.call(this,ft.Ma,i),this.size=l}V(To,de);function un(i,l){if(typeof i!="function")throw Error("Fn must not be null and must be a function");return c.setTimeout(function(){i()},l)}function hn(){this.g=!0}hn.prototype.xa=function(){this.g=!1};function th(i,l,u,f,T,b){i.info(function(){if(i.g)if(b)for(var D="",Y=b.split("&"),ae=0;ae<Y.length;ae++){var G=Y[ae].split("=");if(1<G.length){var me=G[0];G=G[1];var pe=me.split("_");D=2<=pe.length&&pe[1]=="type"?D+(me+"="+G+"&"):D+(me+"=redacted&")}}else D=null;else D=b;return"XMLHTTP REQ ("+f+") [attempt "+T+"]: "+l+`
`+u+`
`+D})}function nh(i,l,u,f,T,b,D){i.info(function(){return"XMLHTTP RESP ("+f+") [ attempt "+T+"]: "+l+`
`+u+`
`+b+" "+D})}function xt(i,l,u,f){i.info(function(){return"XMLHTTP TEXT ("+l+"): "+sh(i,u)+(f?" "+f:"")})}function rh(i,l){i.info(function(){return"TIMEOUT: "+l})}hn.prototype.info=function(){};function sh(i,l){if(!i.g)return l;if(!l)return null;try{var u=JSON.parse(l);if(u){for(i=0;i<u.length;i++)if(Array.isArray(u[i])){var f=u[i];if(!(2>f.length)){var T=f[1];if(Array.isArray(T)&&!(1>T.length)){var b=T[0];if(b!="noop"&&b!="stop"&&b!="close")for(var D=1;D<T.length;D++)T[D]=""}}}}return ds(u)}catch{return l}}var Jn={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},wo={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},gs;function Zn(){}V(Zn,fs),Zn.prototype.g=function(){return new XMLHttpRequest},Zn.prototype.i=function(){return{}},gs=new Zn;function Xe(i,l,u,f){this.j=i,this.i=l,this.l=u,this.R=f||1,this.U=new an(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new Ao}function Ao(){this.i=null,this.g="",this.h=!1}var bo={},ys={};function _s(i,l,u){i.L=1,i.v=rr(qe(l)),i.m=u,i.P=!0,Ro(i,null)}function Ro(i,l){i.F=Date.now(),er(i),i.A=qe(i.v);var u=i.A,f=i.R;Array.isArray(f)||(f=[String(f)]),Uo(u.i,"t",f),i.C=0,u=i.j.J,i.h=new Ao,i.g=sa(i.j,u?l:null,!i.m),0<i.O&&(i.M=new Ju(A(i.Y,i,i.g),i.O)),l=i.U,u=i.g,f=i.ca;var T="readystatechange";Array.isArray(T)||(T&&(po[0]=T.toString()),T=po);for(var b=0;b<T.length;b++){var D=lo(u,T[b],f||l.handleEvent,!1,l.h||l);if(!D)break;l.g[D.key]=D}l=i.H?p(i.H):{},i.m?(i.u||(i.u="POST"),l["Content-Type"]="application/x-www-form-urlencoded",i.g.ea(i.A,i.u,i.m,l)):(i.u="GET",i.g.ea(i.A,i.u,null,l)),cn(),th(i.i,i.u,i.A,i.l,i.R,i.m)}Xe.prototype.ca=function(i){i=i.target;const l=this.M;l&&ze(i)==3?l.j():this.Y(i)},Xe.prototype.Y=function(i){try{if(i==this.g)e:{const pe=ze(this.g);var l=this.g.Ba();const Ft=this.g.Z();if(!(3>pe)&&(pe!=3||this.g&&(this.h.h||this.g.oa()||Ko(this.g)))){this.J||pe!=4||l==7||(l==8||0>=Ft?cn(3):cn(2)),vs(this);var u=this.g.Z();this.X=u;t:if(Po(this)){var f=Ko(this.g);i="";var T=f.length,b=ze(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){mt(this),dn(this);var D="";break t}this.h.i=new c.TextDecoder}for(l=0;l<T;l++)this.h.h=!0,i+=this.h.i.decode(f[l],{stream:!(b&&l==T-1)});f.length=0,this.h.g+=i,this.C=0,D=this.h.g}else D=this.g.oa();if(this.o=u==200,nh(this.i,this.u,this.A,this.l,this.R,pe,u),this.o){if(this.T&&!this.K){t:{if(this.g){var Y,ae=this.g;if((Y=ae.g?ae.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!j(Y)){var G=Y;break t}}G=null}if(u=G)xt(this.i,this.l,u,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,Es(this,u);else{this.o=!1,this.s=3,Ee(12),mt(this),dn(this);break e}}if(this.P){u=!0;let Ne;for(;!this.J&&this.C<D.length;)if(Ne=ih(this,D),Ne==ys){pe==4&&(this.s=4,Ee(14),u=!1),xt(this.i,this.l,null,"[Incomplete Response]");break}else if(Ne==bo){this.s=4,Ee(15),xt(this.i,this.l,D,"[Invalid Chunk]"),u=!1;break}else xt(this.i,this.l,Ne,null),Es(this,Ne);if(Po(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),pe!=4||D.length!=0||this.h.h||(this.s=1,Ee(16),u=!1),this.o=this.o&&u,!u)xt(this.i,this.l,D,"[Invalid Chunked Response]"),mt(this),dn(this);else if(0<D.length&&!this.W){this.W=!0;var me=this.j;me.g==this&&me.ba&&!me.M&&(me.j.info("Great, no buffering proxy detected. Bytes received: "+D.length),Rs(me),me.M=!0,Ee(11))}}else xt(this.i,this.l,D,null),Es(this,D);pe==4&&mt(this),this.o&&!this.J&&(pe==4?ea(this.j,this):(this.o=!1,er(this)))}else Th(this.g),u==400&&0<D.indexOf("Unknown SID")?(this.s=3,Ee(12)):(this.s=0,Ee(13)),mt(this),dn(this)}}}catch{}finally{}};function Po(i){return i.g?i.u=="GET"&&i.L!=2&&i.j.Ca:!1}function ih(i,l){var u=i.C,f=l.indexOf(`
`,u);return f==-1?ys:(u=Number(l.substring(u,f)),isNaN(u)?bo:(f+=1,f+u>l.length?ys:(l=l.slice(f,f+u),i.C=f+u,l)))}Xe.prototype.cancel=function(){this.J=!0,mt(this)};function er(i){i.S=Date.now()+i.I,So(i,i.I)}function So(i,l){if(i.B!=null)throw Error("WatchDog timer not null");i.B=un(A(i.ba,i),l)}function vs(i){i.B&&(c.clearTimeout(i.B),i.B=null)}Xe.prototype.ba=function(){this.B=null;const i=Date.now();0<=i-this.S?(rh(this.i,this.A),this.L!=2&&(cn(),Ee(17)),mt(this),this.s=2,dn(this)):So(this,this.S-i)};function dn(i){i.j.G==0||i.J||ea(i.j,i)}function mt(i){vs(i);var l=i.M;l&&typeof l.ma=="function"&&l.ma(),i.M=null,go(i.U),i.g&&(l=i.g,i.g=null,l.abort(),l.ma())}function Es(i,l){try{var u=i.j;if(u.G!=0&&(u.g==i||Is(u.h,i))){if(!i.K&&Is(u.h,i)&&u.G==3){try{var f=u.Da.g.parse(l)}catch{f=null}if(Array.isArray(f)&&f.length==3){var T=f;if(T[0]==0){e:if(!u.u){if(u.g)if(u.g.F+3e3<i.F)cr(u),ar(u);else break e;bs(u),Ee(18)}}else u.za=T[1],0<u.za-u.T&&37500>T[2]&&u.F&&u.v==0&&!u.C&&(u.C=un(A(u.Za,u),6e3));if(1>=Vo(u.h)&&u.ca){try{u.ca()}catch{}u.ca=void 0}}else gt(u,11)}else if((i.K||u.g==i)&&cr(u),!j(l))for(T=u.Da.g.parse(l),l=0;l<T.length;l++){let G=T[l];if(u.T=G[0],G=G[1],u.G==2)if(G[0]=="c"){u.K=G[1],u.ia=G[2];const me=G[3];me!=null&&(u.la=me,u.j.info("VER="+u.la));const pe=G[4];pe!=null&&(u.Aa=pe,u.j.info("SVER="+u.Aa));const Ft=G[5];Ft!=null&&typeof Ft=="number"&&0<Ft&&(f=1.5*Ft,u.L=f,u.j.info("backChannelRequestTimeoutMs_="+f)),f=u;const Ne=i.g;if(Ne){const hr=Ne.g?Ne.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(hr){var b=f.h;b.g||hr.indexOf("spdy")==-1&&hr.indexOf("quic")==-1&&hr.indexOf("h2")==-1||(b.j=b.l,b.g=new Set,b.h&&(Ts(b,b.h),b.h=null))}if(f.D){const Ps=Ne.g?Ne.g.getResponseHeader("X-HTTP-Session-Id"):null;Ps&&(f.ya=Ps,X(f.I,f.D,Ps))}}u.G=3,u.l&&u.l.ua(),u.ba&&(u.R=Date.now()-i.F,u.j.info("Handshake RTT: "+u.R+"ms")),f=u;var D=i;if(f.qa=ra(f,f.J?f.ia:null,f.W),D.K){ko(f.h,D);var Y=D,ae=f.L;ae&&(Y.I=ae),Y.B&&(vs(Y),er(Y)),f.g=D}else Jo(f);0<u.i.length&&lr(u)}else G[0]!="stop"&&G[0]!="close"||gt(u,7);else u.G==3&&(G[0]=="stop"||G[0]=="close"?G[0]=="stop"?gt(u,7):As(u):G[0]!="noop"&&u.l&&u.l.ta(G),u.v=0)}}cn(4)}catch{}}var oh=class{constructor(i,l){this.g=i,this.map=l}};function Co(i){this.l=i||10,c.PerformanceNavigationTiming?(i=c.performance.getEntriesByType("navigation"),i=0<i.length&&(i[0].nextHopProtocol=="hq"||i[0].nextHopProtocol=="h2")):i=!!(c.chrome&&c.chrome.loadTimes&&c.chrome.loadTimes()&&c.chrome.loadTimes().wasFetchedViaSpdy),this.j=i?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function Do(i){return i.h?!0:i.g?i.g.size>=i.j:!1}function Vo(i){return i.h?1:i.g?i.g.size:0}function Is(i,l){return i.h?i.h==l:i.g?i.g.has(l):!1}function Ts(i,l){i.g?i.g.add(l):i.h=l}function ko(i,l){i.h&&i.h==l?i.h=null:i.g&&i.g.has(l)&&i.g.delete(l)}Co.prototype.cancel=function(){if(this.i=No(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const i of this.g.values())i.cancel();this.g.clear()}};function No(i){if(i.h!=null)return i.i.concat(i.h.D);if(i.g!=null&&i.g.size!==0){let l=i.i;for(const u of i.g.values())l=l.concat(u.D);return l}return k(i.i)}function ah(i){if(i.V&&typeof i.V=="function")return i.V();if(typeof Map<"u"&&i instanceof Map||typeof Set<"u"&&i instanceof Set)return Array.from(i.values());if(typeof i=="string")return i.split("");if(h(i)){for(var l=[],u=i.length,f=0;f<u;f++)l.push(i[f]);return l}l=[],u=0;for(f in i)l[u++]=i[f];return l}function lh(i){if(i.na&&typeof i.na=="function")return i.na();if(!i.V||typeof i.V!="function"){if(typeof Map<"u"&&i instanceof Map)return Array.from(i.keys());if(!(typeof Set<"u"&&i instanceof Set)){if(h(i)||typeof i=="string"){var l=[];i=i.length;for(var u=0;u<i;u++)l.push(u);return l}l=[],u=0;for(const f in i)l[u++]=f;return l}}}function Oo(i,l){if(i.forEach&&typeof i.forEach=="function")i.forEach(l,void 0);else if(h(i)||typeof i=="string")Array.prototype.forEach.call(i,l,void 0);else for(var u=lh(i),f=ah(i),T=f.length,b=0;b<T;b++)l.call(void 0,f[b],u&&u[b],i)}var xo=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function ch(i,l){if(i){i=i.split("&");for(var u=0;u<i.length;u++){var f=i[u].indexOf("="),T=null;if(0<=f){var b=i[u].substring(0,f);T=i[u].substring(f+1)}else b=i[u];l(b,T?decodeURIComponent(T.replace(/\+/g," ")):"")}}}function pt(i){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,i instanceof pt){this.h=i.h,tr(this,i.j),this.o=i.o,this.g=i.g,nr(this,i.s),this.l=i.l;var l=i.i,u=new pn;u.i=l.i,l.g&&(u.g=new Map(l.g),u.h=l.h),Lo(this,u),this.m=i.m}else i&&(l=String(i).match(xo))?(this.h=!1,tr(this,l[1]||"",!0),this.o=fn(l[2]||""),this.g=fn(l[3]||"",!0),nr(this,l[4]),this.l=fn(l[5]||"",!0),Lo(this,l[6]||"",!0),this.m=fn(l[7]||"")):(this.h=!1,this.i=new pn(null,this.h))}pt.prototype.toString=function(){var i=[],l=this.j;l&&i.push(mn(l,Mo,!0),":");var u=this.g;return(u||l=="file")&&(i.push("//"),(l=this.o)&&i.push(mn(l,Mo,!0),"@"),i.push(encodeURIComponent(String(u)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),u=this.s,u!=null&&i.push(":",String(u))),(u=this.l)&&(this.g&&u.charAt(0)!="/"&&i.push("/"),i.push(mn(u,u.charAt(0)=="/"?dh:hh,!0))),(u=this.i.toString())&&i.push("?",u),(u=this.m)&&i.push("#",mn(u,mh)),i.join("")};function qe(i){return new pt(i)}function tr(i,l,u){i.j=u?fn(l,!0):l,i.j&&(i.j=i.j.replace(/:$/,""))}function nr(i,l){if(l){if(l=Number(l),isNaN(l)||0>l)throw Error("Bad port number "+l);i.s=l}else i.s=null}function Lo(i,l,u){l instanceof pn?(i.i=l,ph(i.i,i.h)):(u||(l=mn(l,fh)),i.i=new pn(l,i.h))}function X(i,l,u){i.i.set(l,u)}function rr(i){return X(i,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),i}function fn(i,l){return i?l?decodeURI(i.replace(/%25/g,"%2525")):decodeURIComponent(i):""}function mn(i,l,u){return typeof i=="string"?(i=encodeURI(i).replace(l,uh),u&&(i=i.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),i):null}function uh(i){return i=i.charCodeAt(0),"%"+(i>>4&15).toString(16)+(i&15).toString(16)}var Mo=/[#\/\?@]/g,hh=/[#\?:]/g,dh=/[#\?]/g,fh=/[#\?@]/g,mh=/#/g;function pn(i,l){this.h=this.g=null,this.i=i||null,this.j=!!l}function Je(i){i.g||(i.g=new Map,i.h=0,i.i&&ch(i.i,function(l,u){i.add(decodeURIComponent(l.replace(/\+/g," ")),u)}))}n=pn.prototype,n.add=function(i,l){Je(this),this.i=null,i=Lt(this,i);var u=this.g.get(i);return u||this.g.set(i,u=[]),u.push(l),this.h+=1,this};function Fo(i,l){Je(i),l=Lt(i,l),i.g.has(l)&&(i.i=null,i.h-=i.g.get(l).length,i.g.delete(l))}function Bo(i,l){return Je(i),l=Lt(i,l),i.g.has(l)}n.forEach=function(i,l){Je(this),this.g.forEach(function(u,f){u.forEach(function(T){i.call(l,T,f,this)},this)},this)},n.na=function(){Je(this);const i=Array.from(this.g.values()),l=Array.from(this.g.keys()),u=[];for(let f=0;f<l.length;f++){const T=i[f];for(let b=0;b<T.length;b++)u.push(l[f])}return u},n.V=function(i){Je(this);let l=[];if(typeof i=="string")Bo(this,i)&&(l=l.concat(this.g.get(Lt(this,i))));else{i=Array.from(this.g.values());for(let u=0;u<i.length;u++)l=l.concat(i[u])}return l},n.set=function(i,l){return Je(this),this.i=null,i=Lt(this,i),Bo(this,i)&&(this.h-=this.g.get(i).length),this.g.set(i,[l]),this.h+=1,this},n.get=function(i,l){return i?(i=this.V(i),0<i.length?String(i[0]):l):l};function Uo(i,l,u){Fo(i,l),0<u.length&&(i.i=null,i.g.set(Lt(i,l),k(u)),i.h+=u.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const i=[],l=Array.from(this.g.keys());for(var u=0;u<l.length;u++){var f=l[u];const b=encodeURIComponent(String(f)),D=this.V(f);for(f=0;f<D.length;f++){var T=b;D[f]!==""&&(T+="="+encodeURIComponent(String(D[f]))),i.push(T)}}return this.i=i.join("&")};function Lt(i,l){return l=String(l),i.j&&(l=l.toLowerCase()),l}function ph(i,l){l&&!i.j&&(Je(i),i.i=null,i.g.forEach(function(u,f){var T=f.toLowerCase();f!=T&&(Fo(this,f),Uo(this,T,u))},i)),i.j=l}function gh(i,l){const u=new hn;if(c.Image){const f=new Image;f.onload=R(Ze,u,"TestLoadImage: loaded",!0,l,f),f.onerror=R(Ze,u,"TestLoadImage: error",!1,l,f),f.onabort=R(Ze,u,"TestLoadImage: abort",!1,l,f),f.ontimeout=R(Ze,u,"TestLoadImage: timeout",!1,l,f),c.setTimeout(function(){f.ontimeout&&f.ontimeout()},1e4),f.src=i}else l(!1)}function yh(i,l){const u=new hn,f=new AbortController,T=setTimeout(()=>{f.abort(),Ze(u,"TestPingServer: timeout",!1,l)},1e4);fetch(i,{signal:f.signal}).then(b=>{clearTimeout(T),b.ok?Ze(u,"TestPingServer: ok",!0,l):Ze(u,"TestPingServer: server error",!1,l)}).catch(()=>{clearTimeout(T),Ze(u,"TestPingServer: error",!1,l)})}function Ze(i,l,u,f,T){try{T&&(T.onload=null,T.onerror=null,T.onabort=null,T.ontimeout=null),f(u)}catch{}}function _h(){this.g=new eh}function vh(i,l,u){const f=u||"";try{Oo(i,function(T,b){let D=T;d(T)&&(D=ds(T)),l.push(f+b+"="+encodeURIComponent(D))})}catch(T){throw l.push(f+"type="+encodeURIComponent("_badmap")),T}}function sr(i){this.l=i.Ub||null,this.j=i.eb||!1}V(sr,fs),sr.prototype.g=function(){return new ir(this.l,this.j)},sr.prototype.i=function(i){return function(){return i}}({});function ir(i,l){fe.call(this),this.D=i,this.o=l,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}V(ir,fe),n=ir.prototype,n.open=function(i,l){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=i,this.A=l,this.readyState=1,yn(this)},n.send=function(i){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const l={headers:this.u,method:this.B,credentials:this.m,cache:void 0};i&&(l.body=i),(this.D||c).fetch(new Request(this.A,l)).then(this.Sa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,gn(this)),this.readyState=0},n.Sa=function(i){if(this.g&&(this.l=i,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=i.headers,this.readyState=2,yn(this)),this.g&&(this.readyState=3,yn(this),this.g)))if(this.responseType==="arraybuffer")i.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof c.ReadableStream<"u"&&"body"in i){if(this.j=i.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;$o(this)}else i.text().then(this.Ra.bind(this),this.ga.bind(this))};function $o(i){i.j.read().then(i.Pa.bind(i)).catch(i.ga.bind(i))}n.Pa=function(i){if(this.g){if(this.o&&i.value)this.response.push(i.value);else if(!this.o){var l=i.value?i.value:new Uint8Array(0);(l=this.v.decode(l,{stream:!i.done}))&&(this.response=this.responseText+=l)}i.done?gn(this):yn(this),this.readyState==3&&$o(this)}},n.Ra=function(i){this.g&&(this.response=this.responseText=i,gn(this))},n.Qa=function(i){this.g&&(this.response=i,gn(this))},n.ga=function(){this.g&&gn(this)};function gn(i){i.readyState=4,i.l=null,i.j=null,i.v=null,yn(i)}n.setRequestHeader=function(i,l){this.u.append(i,l)},n.getResponseHeader=function(i){return this.h&&this.h.get(i.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const i=[],l=this.h.entries();for(var u=l.next();!u.done;)u=u.value,i.push(u[0]+": "+u[1]),u=l.next();return i.join(`\r
`)};function yn(i){i.onreadystatechange&&i.onreadystatechange.call(i)}Object.defineProperty(ir.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(i){this.m=i?"include":"same-origin"}});function jo(i){let l="";return Q(i,function(u,f){l+=f,l+=":",l+=u,l+=`\r
`}),l}function ws(i,l,u){e:{for(f in u){var f=!1;break e}f=!0}f||(u=jo(u),typeof i=="string"?u!=null&&encodeURIComponent(String(u)):X(i,l,u))}function te(i){fe.call(this),this.headers=new Map,this.o=i||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}V(te,fe);var Eh=/^https?$/i,Ih=["POST","PUT"];n=te.prototype,n.Ha=function(i){this.J=i},n.ea=function(i,l,u,f){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+i);l=l?l.toUpperCase():"GET",this.D=i,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():gs.g(),this.v=this.o?yo(this.o):yo(gs),this.g.onreadystatechange=A(this.Ea,this);try{this.B=!0,this.g.open(l,String(i),!0),this.B=!1}catch(b){qo(this,b);return}if(i=u||"",u=new Map(this.headers),f)if(Object.getPrototypeOf(f)===Object.prototype)for(var T in f)u.set(T,f[T]);else if(typeof f.keys=="function"&&typeof f.get=="function")for(const b of f.keys())u.set(b,f.get(b));else throw Error("Unknown input type for opt_headers: "+String(f));f=Array.from(u.keys()).find(b=>b.toLowerCase()=="content-type"),T=c.FormData&&i instanceof c.FormData,!(0<=Array.prototype.indexOf.call(Ih,l,void 0))||f||T||u.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[b,D]of u)this.g.setRequestHeader(b,D);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{Go(this),this.u=!0,this.g.send(i),this.u=!1}catch(b){qo(this,b)}};function qo(i,l){i.h=!1,i.g&&(i.j=!0,i.g.abort(),i.j=!1),i.l=l,i.m=5,zo(i),or(i)}function zo(i){i.A||(i.A=!0,ve(i,"complete"),ve(i,"error"))}n.abort=function(i){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=i||7,ve(this,"complete"),ve(this,"abort"),or(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),or(this,!0)),te.aa.N.call(this)},n.Ea=function(){this.s||(this.B||this.u||this.j?Ho(this):this.bb())},n.bb=function(){Ho(this)};function Ho(i){if(i.h&&typeof a<"u"&&(!i.v[1]||ze(i)!=4||i.Z()!=2)){if(i.u&&ze(i)==4)fo(i.Ea,0,i);else if(ve(i,"readystatechange"),ze(i)==4){i.h=!1;try{const D=i.Z();e:switch(D){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var l=!0;break e;default:l=!1}var u;if(!(u=l)){var f;if(f=D===0){var T=String(i.D).match(xo)[1]||null;!T&&c.self&&c.self.location&&(T=c.self.location.protocol.slice(0,-1)),f=!Eh.test(T?T.toLowerCase():"")}u=f}if(u)ve(i,"complete"),ve(i,"success");else{i.m=6;try{var b=2<ze(i)?i.g.statusText:""}catch{b=""}i.l=b+" ["+i.Z()+"]",zo(i)}}finally{or(i)}}}}function or(i,l){if(i.g){Go(i);const u=i.g,f=i.v[0]?()=>{}:null;i.g=null,i.v=null,l||ve(i,"ready");try{u.onreadystatechange=f}catch{}}}function Go(i){i.I&&(c.clearTimeout(i.I),i.I=null)}n.isActive=function(){return!!this.g};function ze(i){return i.g?i.g.readyState:0}n.Z=function(){try{return 2<ze(this)?this.g.status:-1}catch{return-1}},n.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.Oa=function(i){if(this.g){var l=this.g.responseText;return i&&l.indexOf(i)==0&&(l=l.substring(i.length)),Zu(l)}};function Ko(i){try{if(!i.g)return null;if("response"in i.g)return i.g.response;switch(i.H){case"":case"text":return i.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in i.g)return i.g.mozResponseArrayBuffer}return null}catch{return null}}function Th(i){const l={};i=(i.g&&2<=ze(i)&&i.g.getAllResponseHeaders()||"").split(`\r
`);for(let f=0;f<i.length;f++){if(j(i[f]))continue;var u=I(i[f]);const T=u[0];if(u=u[1],typeof u!="string")continue;u=u.trim();const b=l[T]||[];l[T]=b,b.push(u)}E(l,function(f){return f.join(", ")})}n.Ba=function(){return this.m},n.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function _n(i,l,u){return u&&u.internalChannelParams&&u.internalChannelParams[i]||l}function Wo(i){this.Aa=0,this.i=[],this.j=new hn,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=_n("failFast",!1,i),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=_n("baseRetryDelayMs",5e3,i),this.cb=_n("retryDelaySeedMs",1e4,i),this.Wa=_n("forwardChannelMaxRetries",2,i),this.wa=_n("forwardChannelRequestTimeoutMs",2e4,i),this.pa=i&&i.xmlHttpFactory||void 0,this.Xa=i&&i.Tb||void 0,this.Ca=i&&i.useFetchStreams||!1,this.L=void 0,this.J=i&&i.supportsCrossDomainXhr||!1,this.K="",this.h=new Co(i&&i.concurrentRequestLimit),this.Da=new _h,this.P=i&&i.fastHandshake||!1,this.O=i&&i.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=i&&i.Rb||!1,i&&i.xa&&this.j.xa(),i&&i.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&i&&i.detectBufferingProxy||!1,this.ja=void 0,i&&i.longPollingTimeout&&0<i.longPollingTimeout&&(this.ja=i.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}n=Wo.prototype,n.la=8,n.G=1,n.connect=function(i,l,u,f){Ee(0),this.W=i,this.H=l||{},u&&f!==void 0&&(this.H.OSID=u,this.H.OAID=f),this.F=this.X,this.I=ra(this,null,this.W),lr(this)};function As(i){if(Qo(i),i.G==3){var l=i.U++,u=qe(i.I);if(X(u,"SID",i.K),X(u,"RID",l),X(u,"TYPE","terminate"),vn(i,u),l=new Xe(i,i.j,l),l.L=2,l.v=rr(qe(u)),u=!1,c.navigator&&c.navigator.sendBeacon)try{u=c.navigator.sendBeacon(l.v.toString(),"")}catch{}!u&&c.Image&&(new Image().src=l.v,u=!0),u||(l.g=sa(l.j,null),l.g.ea(l.v)),l.F=Date.now(),er(l)}na(i)}function ar(i){i.g&&(Rs(i),i.g.cancel(),i.g=null)}function Qo(i){ar(i),i.u&&(c.clearTimeout(i.u),i.u=null),cr(i),i.h.cancel(),i.s&&(typeof i.s=="number"&&c.clearTimeout(i.s),i.s=null)}function lr(i){if(!Do(i.h)&&!i.s){i.s=!0;var l=i.Ga;rn||ao(),sn||(rn(),sn=!0),ss.add(l,i),i.B=0}}function wh(i,l){return Vo(i.h)>=i.h.j-(i.s?1:0)?!1:i.s?(i.i=l.D.concat(i.i),!0):i.G==1||i.G==2||i.B>=(i.Va?0:i.Wa)?!1:(i.s=un(A(i.Ga,i,l),ta(i,i.B)),i.B++,!0)}n.Ga=function(i){if(this.s)if(this.s=null,this.G==1){if(!i){this.U=Math.floor(1e5*Math.random()),i=this.U++;const T=new Xe(this,this.j,i);let b=this.o;if(this.S&&(b?(b=p(b),v(b,this.S)):b=this.S),this.m!==null||this.O||(T.H=b,b=null),this.P)e:{for(var l=0,u=0;u<this.i.length;u++){t:{var f=this.i[u];if("__data__"in f.map&&(f=f.map.__data__,typeof f=="string")){f=f.length;break t}f=void 0}if(f===void 0)break;if(l+=f,4096<l){l=u;break e}if(l===4096||u===this.i.length-1){l=u+1;break e}}l=1e3}else l=1e3;l=Xo(this,T,l),u=qe(this.I),X(u,"RID",i),X(u,"CVER",22),this.D&&X(u,"X-HTTP-Session-Id",this.D),vn(this,u),b&&(this.O?l="headers="+encodeURIComponent(String(jo(b)))+"&"+l:this.m&&ws(u,this.m,b)),Ts(this.h,T),this.Ua&&X(u,"TYPE","init"),this.P?(X(u,"$req",l),X(u,"SID","null"),T.T=!0,_s(T,u,null)):_s(T,u,l),this.G=2}}else this.G==3&&(i?Yo(this,i):this.i.length==0||Do(this.h)||Yo(this))};function Yo(i,l){var u;l?u=l.l:u=i.U++;const f=qe(i.I);X(f,"SID",i.K),X(f,"RID",u),X(f,"AID",i.T),vn(i,f),i.m&&i.o&&ws(f,i.m,i.o),u=new Xe(i,i.j,u,i.B+1),i.m===null&&(u.H=i.o),l&&(i.i=l.D.concat(i.i)),l=Xo(i,u,1e3),u.I=Math.round(.5*i.wa)+Math.round(.5*i.wa*Math.random()),Ts(i.h,u),_s(u,f,l)}function vn(i,l){i.H&&Q(i.H,function(u,f){X(l,f,u)}),i.l&&Oo({},function(u,f){X(l,f,u)})}function Xo(i,l,u){u=Math.min(i.i.length,u);var f=i.l?A(i.l.Na,i.l,i):null;e:{var T=i.i;let b=-1;for(;;){const D=["count="+u];b==-1?0<u?(b=T[0].g,D.push("ofs="+b)):b=0:D.push("ofs="+b);let Y=!0;for(let ae=0;ae<u;ae++){let G=T[ae].g;const me=T[ae].map;if(G-=b,0>G)b=Math.max(0,T[ae].g-100),Y=!1;else try{vh(me,D,"req"+G+"_")}catch{f&&f(me)}}if(Y){f=D.join("&");break e}}}return i=i.i.splice(0,u),l.D=i,f}function Jo(i){if(!i.g&&!i.u){i.Y=1;var l=i.Fa;rn||ao(),sn||(rn(),sn=!0),ss.add(l,i),i.v=0}}function bs(i){return i.g||i.u||3<=i.v?!1:(i.Y++,i.u=un(A(i.Fa,i),ta(i,i.v)),i.v++,!0)}n.Fa=function(){if(this.u=null,Zo(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var i=2*this.R;this.j.info("BP detection timer enabled: "+i),this.A=un(A(this.ab,this),i)}},n.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,Ee(10),ar(this),Zo(this))};function Rs(i){i.A!=null&&(c.clearTimeout(i.A),i.A=null)}function Zo(i){i.g=new Xe(i,i.j,"rpc",i.Y),i.m===null&&(i.g.H=i.o),i.g.O=0;var l=qe(i.qa);X(l,"RID","rpc"),X(l,"SID",i.K),X(l,"AID",i.T),X(l,"CI",i.F?"0":"1"),!i.F&&i.ja&&X(l,"TO",i.ja),X(l,"TYPE","xmlhttp"),vn(i,l),i.m&&i.o&&ws(l,i.m,i.o),i.L&&(i.g.I=i.L);var u=i.g;i=i.ia,u.L=1,u.v=rr(qe(l)),u.m=null,u.P=!0,Ro(u,i)}n.Za=function(){this.C!=null&&(this.C=null,ar(this),bs(this),Ee(19))};function cr(i){i.C!=null&&(c.clearTimeout(i.C),i.C=null)}function ea(i,l){var u=null;if(i.g==l){cr(i),Rs(i),i.g=null;var f=2}else if(Is(i.h,l))u=l.D,ko(i.h,l),f=1;else return;if(i.G!=0){if(l.o)if(f==1){u=l.m?l.m.length:0,l=Date.now()-l.F;var T=i.B;f=Xn(),ve(f,new To(f,u)),lr(i)}else Jo(i);else if(T=l.s,T==3||T==0&&0<l.X||!(f==1&&wh(i,l)||f==2&&bs(i)))switch(u&&0<u.length&&(l=i.h,l.i=l.i.concat(u)),T){case 1:gt(i,5);break;case 4:gt(i,10);break;case 3:gt(i,6);break;default:gt(i,2)}}}function ta(i,l){let u=i.Ta+Math.floor(Math.random()*i.cb);return i.isActive()||(u*=2),u*l}function gt(i,l){if(i.j.info("Error code "+l),l==2){var u=A(i.fb,i),f=i.Xa;const T=!f;f=new pt(f||"//www.google.com/images/cleardot.gif"),c.location&&c.location.protocol=="http"||tr(f,"https"),rr(f),T?gh(f.toString(),u):yh(f.toString(),u)}else Ee(2);i.G=0,i.l&&i.l.sa(l),na(i),Qo(i)}n.fb=function(i){i?(this.j.info("Successfully pinged google.com"),Ee(2)):(this.j.info("Failed to ping google.com"),Ee(1))};function na(i){if(i.G=0,i.ka=[],i.l){const l=No(i.h);(l.length!=0||i.i.length!=0)&&(C(i.ka,l),C(i.ka,i.i),i.h.i.length=0,k(i.i),i.i.length=0),i.l.ra()}}function ra(i,l,u){var f=u instanceof pt?qe(u):new pt(u);if(f.g!="")l&&(f.g=l+"."+f.g),nr(f,f.s);else{var T=c.location;f=T.protocol,l=l?l+"."+T.hostname:T.hostname,T=+T.port;var b=new pt(null);f&&tr(b,f),l&&(b.g=l),T&&nr(b,T),u&&(b.l=u),f=b}return u=i.D,l=i.ya,u&&l&&X(f,u,l),X(f,"VER",i.la),vn(i,f),f}function sa(i,l,u){if(l&&!i.J)throw Error("Can't create secondary domain capable XhrIo object.");return l=i.Ca&&!i.pa?new te(new sr({eb:u})):new te(i.pa),l.Ha(i.J),l}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function ia(){}n=ia.prototype,n.ua=function(){},n.ta=function(){},n.sa=function(){},n.ra=function(){},n.isActive=function(){return!0},n.Na=function(){};function ur(){}ur.prototype.g=function(i,l){return new be(i,l)};function be(i,l){fe.call(this),this.g=new Wo(l),this.l=i,this.h=l&&l.messageUrlParams||null,i=l&&l.messageHeaders||null,l&&l.clientProtocolHeaderRequired&&(i?i["X-Client-Protocol"]="webchannel":i={"X-Client-Protocol":"webchannel"}),this.g.o=i,i=l&&l.initMessageHeaders||null,l&&l.messageContentType&&(i?i["X-WebChannel-Content-Type"]=l.messageContentType:i={"X-WebChannel-Content-Type":l.messageContentType}),l&&l.va&&(i?i["X-WebChannel-Client-Profile"]=l.va:i={"X-WebChannel-Client-Profile":l.va}),this.g.S=i,(i=l&&l.Sb)&&!j(i)&&(this.g.m=i),this.v=l&&l.supportsCrossDomainXhr||!1,this.u=l&&l.sendRawJson||!1,(l=l&&l.httpSessionIdParam)&&!j(l)&&(this.g.D=l,i=this.h,i!==null&&l in i&&(i=this.h,l in i&&delete i[l])),this.j=new Mt(this)}V(be,fe),be.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},be.prototype.close=function(){As(this.g)},be.prototype.o=function(i){var l=this.g;if(typeof i=="string"){var u={};u.__data__=i,i=u}else this.u&&(u={},u.__data__=ds(i),i=u);l.i.push(new oh(l.Ya++,i)),l.G==3&&lr(l)},be.prototype.N=function(){this.g.l=null,delete this.j,As(this.g),delete this.g,be.aa.N.call(this)};function oa(i){ms.call(this),i.__headers__&&(this.headers=i.__headers__,this.statusCode=i.__status__,delete i.__headers__,delete i.__status__);var l=i.__sm__;if(l){e:{for(const u in l){i=u;break e}i=void 0}(this.i=i)&&(i=this.i,l=l!==null&&i in l?l[i]:void 0),this.data=l}else this.data=i}V(oa,ms);function aa(){ps.call(this),this.status=1}V(aa,ps);function Mt(i){this.g=i}V(Mt,ia),Mt.prototype.ua=function(){ve(this.g,"a")},Mt.prototype.ta=function(i){ve(this.g,new oa(i))},Mt.prototype.sa=function(i){ve(this.g,new aa)},Mt.prototype.ra=function(){ve(this.g,"b")},ur.prototype.createWebChannel=ur.prototype.g,be.prototype.send=be.prototype.o,be.prototype.open=be.prototype.m,be.prototype.close=be.prototype.close,yc=function(){return new ur},gc=function(){return Xn()},pc=ft,Qs={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},Jn.NO_ERROR=0,Jn.TIMEOUT=8,Jn.HTTP_ERROR=6,yr=Jn,wo.COMPLETE="complete",mc=wo,_o.EventType=ln,ln.OPEN="a",ln.CLOSE="b",ln.ERROR="c",ln.MESSAGE="d",fe.prototype.listen=fe.prototype.K,Tn=_o,te.prototype.listenOnce=te.prototype.L,te.prototype.getLastError=te.prototype.Ka,te.prototype.getLastErrorCode=te.prototype.Ba,te.prototype.getStatus=te.prototype.Z,te.prototype.getResponseJson=te.prototype.Oa,te.prototype.getResponseText=te.prototype.oa,te.prototype.send=te.prototype.ea,te.prototype.setWithCredentials=te.prototype.Ha,fc=te}).apply(typeof dr<"u"?dr:typeof self<"u"?self:typeof window<"u"?window:{});const Sa="@firebase/firestore";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ye{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}ye.UNAUTHENTICATED=new ye(null),ye.GOOGLE_CREDENTIALS=new ye("google-credentials-uid"),ye.FIRST_PARTY=new ye("first-party-uid"),ye.MOCK_USER=new ye("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Zt="10.14.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const St=new fi("@firebase/firestore");function En(){return St.logLevel}function O(n,...e){if(St.logLevel<=H.DEBUG){const t=e.map(Ii);St.debug(`Firestore (${Zt}): ${n}`,...t)}}function Ke(n,...e){if(St.logLevel<=H.ERROR){const t=e.map(Ii);St.error(`Firestore (${Zt}): ${n}`,...t)}}function zt(n,...e){if(St.logLevel<=H.WARN){const t=e.map(Ii);St.warn(`Firestore (${Zt}): ${n}`,...t)}}function Ii(n){if(typeof n=="string")return n;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return function(t){return JSON.stringify(t)}(n)}catch{return n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function F(n="Unexpected state"){const e=`FIRESTORE (${Zt}) INTERNAL ASSERTION FAILED: `+n;throw Ke(e),new Error(e)}function W(n,e){n||F()}function U(n,e){return n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const S={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class x extends Qe{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class st{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _c{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class Em{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(ye.UNAUTHENTICATED))}shutdown(){}}class Im{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable(()=>t(this.token.user))}shutdown(){this.changeListener=null}}class Tm{constructor(e){this.t=e,this.currentUser=ye.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){W(this.o===void 0);let r=this.i;const s=h=>this.i!==r?(r=this.i,t(h)):Promise.resolve();let o=new st;this.o=()=>{this.i++,this.currentUser=this.u(),o.resolve(),o=new st,e.enqueueRetryable(()=>s(this.currentUser))};const a=()=>{const h=o;e.enqueueRetryable(async()=>{await h.promise,await s(this.currentUser)})},c=h=>{O("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=h,this.o&&(this.auth.addAuthTokenListener(this.o),a())};this.t.onInit(h=>c(h)),setTimeout(()=>{if(!this.auth){const h=this.t.getImmediate({optional:!0});h?c(h):(O("FirebaseAuthCredentialsProvider","Auth not yet detected"),o.resolve(),o=new st)}},0),a()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then(r=>this.i!==e?(O("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(W(typeof r.accessToken=="string"),new _c(r.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return W(e===null||typeof e=="string"),new ye(e)}}class wm{constructor(e,t,r){this.l=e,this.h=t,this.P=r,this.type="FirstParty",this.user=ye.FIRST_PARTY,this.I=new Map}T(){return this.P?this.P():null}get headers(){this.I.set("X-Goog-AuthUser",this.l);const e=this.T();return e&&this.I.set("Authorization",e),this.h&&this.I.set("X-Goog-Iam-Authorization-Token",this.h),this.I}}class Am{constructor(e,t,r){this.l=e,this.h=t,this.P=r}getToken(){return Promise.resolve(new wm(this.l,this.h,this.P))}start(e,t){e.enqueueRetryable(()=>t(ye.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class bm{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class Rm{constructor(e){this.A=e,this.forceRefresh=!1,this.appCheck=null,this.R=null}start(e,t){W(this.o===void 0);const r=o=>{o.error!=null&&O("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${o.error.message}`);const a=o.token!==this.R;return this.R=o.token,O("FirebaseAppCheckTokenProvider",`Received ${a?"new":"existing"} token.`),a?t(o.token):Promise.resolve()};this.o=o=>{e.enqueueRetryable(()=>r(o))};const s=o=>{O("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=o,this.o&&this.appCheck.addTokenListener(this.o)};this.A.onInit(o=>s(o)),setTimeout(()=>{if(!this.appCheck){const o=this.A.getImmediate({optional:!0});o?s(o):O("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(t=>t?(W(typeof t.token=="string"),this.R=t.token,new bm(t.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pm(n){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(n);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let r=0;r<n;r++)t[r]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vc{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=Math.floor(256/e.length)*e.length;let r="";for(;r.length<20;){const s=Pm(40);for(let o=0;o<s.length;++o)r.length<20&&s[o]<t&&(r+=e.charAt(s[o]%e.length))}return r}}function K(n,e){return n<e?-1:n>e?1:0}function Ht(n,e,t){return n.length===e.length&&n.every((r,s)=>t(r,e[s]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ie{constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new x(S.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new x(S.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<-62135596800)throw new x(S.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new x(S.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}static now(){return ie.fromMillis(Date.now())}static fromDate(e){return ie.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),r=Math.floor(1e6*(e-1e3*t));return new ie(t,r)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?K(this.nanoseconds,e.nanoseconds):K(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const e=this.seconds- -62135596800;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class B{constructor(e){this.timestamp=e}static fromTimestamp(e){return new B(e)}static min(){return new B(new ie(0,0))}static max(){return new B(new ie(253402300799,999999999))}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kn{constructor(e,t,r){t===void 0?t=0:t>e.length&&F(),r===void 0?r=e.length-t:r>e.length-t&&F(),this.segments=e,this.offset=t,this.len=r}get length(){return this.len}isEqual(e){return kn.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof kn?e.forEach(r=>{t.push(r)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,r=this.limit();t<r;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const r=Math.min(e.length,t.length);for(let s=0;s<r;s++){const o=e.get(s),a=t.get(s);if(o<a)return-1;if(o>a)return 1}return e.length<t.length?-1:e.length>t.length?1:0}}class Z extends kn{construct(e,t,r){return new Z(e,t,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const r of e){if(r.indexOf("//")>=0)throw new x(S.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);t.push(...r.split("/").filter(s=>s.length>0))}return new Z(t)}static emptyPath(){return new Z([])}}const Sm=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class ce extends kn{construct(e,t,r){return new ce(e,t,r)}static isValidIdentifier(e){return Sm.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),ce.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new ce(["__name__"])}static fromServerFormat(e){const t=[];let r="",s=0;const o=()=>{if(r.length===0)throw new x(S.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(r),r=""};let a=!1;for(;s<e.length;){const c=e[s];if(c==="\\"){if(s+1===e.length)throw new x(S.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const h=e[s+1];if(h!=="\\"&&h!=="."&&h!=="`")throw new x(S.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=h,s+=2}else c==="`"?(a=!a,s++):c!=="."||a?(r+=c,s++):(o(),s++)}if(o(),a)throw new x(S.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new ce(t)}static emptyPath(){return new ce([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class L{constructor(e){this.path=e}static fromPath(e){return new L(Z.fromString(e))}static fromName(e){return new L(Z.fromString(e).popFirst(5))}static empty(){return new L(Z.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&Z.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return Z.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new L(new Z(e.slice()))}}function Cm(n,e){const t=n.toTimestamp().seconds,r=n.toTimestamp().nanoseconds+1,s=B.fromTimestamp(r===1e9?new ie(t+1,0):new ie(t,r));return new at(s,L.empty(),e)}function Dm(n){return new at(n.readTime,n.key,-1)}class at{constructor(e,t,r){this.readTime=e,this.documentKey=t,this.largestBatchId=r}static min(){return new at(B.min(),L.empty(),-1)}static max(){return new at(B.max(),L.empty(),-1)}}function Vm(n,e){let t=n.readTime.compareTo(e.readTime);return t!==0?t:(t=L.comparator(n.documentKey,e.documentKey),t!==0?t:K(n.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const km="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class Nm{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Bn(n){if(n.code!==S.FAILED_PRECONDITION||n.message!==km)throw n;O("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class P{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)},t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)})}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&F(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new P((r,s)=>{this.nextCallback=o=>{this.wrapSuccess(e,o).next(r,s)},this.catchCallback=o=>{this.wrapFailure(t,o).next(r,s)}})}toPromise(){return new Promise((e,t)=>{this.next(e,t)})}wrapUserFunction(e){try{const t=e();return t instanceof P?t:P.resolve(t)}catch(t){return P.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction(()=>e(t)):P.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction(()=>e(t)):P.reject(t)}static resolve(e){return new P((t,r)=>{t(e)})}static reject(e){return new P((t,r)=>{r(e)})}static waitFor(e){return new P((t,r)=>{let s=0,o=0,a=!1;e.forEach(c=>{++s,c.next(()=>{++o,a&&o===s&&t()},h=>r(h))}),a=!0,o===s&&t()})}static or(e){let t=P.resolve(!1);for(const r of e)t=t.next(s=>s?P.resolve(s):r());return t}static forEach(e,t){const r=[];return e.forEach((s,o)=>{r.push(t.call(this,s,o))}),this.waitFor(r)}static mapArray(e,t){return new P((r,s)=>{const o=e.length,a=new Array(o);let c=0;for(let h=0;h<o;h++){const d=h;t(e[d]).next(m=>{a[d]=m,++c,c===o&&r(a)},m=>s(m))}})}static doWhile(e,t){return new P((r,s)=>{const o=()=>{e()===!0?t().next(()=>{o()},s):r()};o()})}}function Om(n){const e=n.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function Un(n){return n.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ti{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=r=>this.ie(r),this.se=r=>t.writeSequenceNumber(r))}ie(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.se&&this.se(e),e}}Ti.oe=-1;function qr(n){return n==null}function Pr(n){return n===0&&1/n==-1/0}function xm(n){return typeof n=="number"&&Number.isInteger(n)&&!Pr(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ca(n){let e=0;for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e++;return e}function Nt(n,e){for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e(t,n[t])}function Ec(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ee{constructor(e,t){this.comparator=e,this.root=t||le.EMPTY}insert(e,t){return new ee(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,le.BLACK,null,null))}remove(e){return new ee(this.comparator,this.root.remove(e,this.comparator).copy(null,null,le.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const r=this.comparator(e,t.key);if(r===0)return t.value;r<0?t=t.left:r>0&&(t=t.right)}return null}indexOf(e){let t=0,r=this.root;for(;!r.isEmpty();){const s=this.comparator(e,r.key);if(s===0)return t+r.left.size;s<0?r=r.left:(t+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((t,r)=>(e(t,r),!1))}toString(){const e=[];return this.inorderTraversal((t,r)=>(e.push(`${t}:${r}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new fr(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new fr(this.root,e,this.comparator,!1)}getReverseIterator(){return new fr(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new fr(this.root,e,this.comparator,!0)}}class fr{constructor(e,t,r,s){this.isReverse=s,this.nodeStack=[];let o=1;for(;!e.isEmpty();)if(o=t?r(e.key,t):1,t&&s&&(o*=-1),o<0)e=this.isReverse?e.left:e.right;else{if(o===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class le{constructor(e,t,r,s,o){this.key=e,this.value=t,this.color=r??le.RED,this.left=s??le.EMPTY,this.right=o??le.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,r,s,o){return new le(e??this.key,t??this.value,r??this.color,s??this.left,o??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,r){let s=this;const o=r(e,s.key);return s=o<0?s.copy(null,null,null,s.left.insert(e,t,r),null):o===0?s.copy(null,t,null,null,null):s.copy(null,null,null,null,s.right.insert(e,t,r)),s.fixUp()}removeMin(){if(this.left.isEmpty())return le.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let r,s=this;if(t(e,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(e,t),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),t(e,s.key)===0){if(s.right.isEmpty())return le.EMPTY;r=s.right.min(),s=s.copy(r.key,r.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(e,t))}return s.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,le.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,le.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw F();const e=this.left.check();if(e!==this.right.check())throw F();return e+(this.isRed()?0:1)}}le.EMPTY=null,le.RED=!0,le.BLACK=!1;le.EMPTY=new class{constructor(){this.size=0}get key(){throw F()}get value(){throw F()}get color(){throw F()}get left(){throw F()}get right(){throw F()}copy(e,t,r,s,o){return this}insert(e,t,r){return new le(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ue{constructor(e){this.comparator=e,this.data=new ee(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((t,r)=>(e(t),!1))}forEachInRange(e,t){const r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){const s=r.getNext();if(this.comparator(s.key,e[1])>=0)return;t(s.key)}}forEachWhile(e,t){let r;for(r=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Da(this.data.getIterator())}getIteratorFrom(e){return new Da(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach(r=>{t=t.add(r)}),t}isEqual(e){if(!(e instanceof ue)||this.size!==e.size)return!1;const t=this.data.getIterator(),r=e.data.getIterator();for(;t.hasNext();){const s=t.getNext().key,o=r.getNext().key;if(this.comparator(s,o)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(t=>{e.push(t)}),e}toString(){const e=[];return this.forEach(t=>e.push(t)),"SortedSet("+e.toString()+")"}copy(e){const t=new ue(this.comparator);return t.data=e,t}}class Da{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Re{constructor(e){this.fields=e,e.sort(ce.comparator)}static empty(){return new Re([])}unionWith(e){let t=new ue(ce.comparator);for(const r of this.fields)t=t.add(r);for(const r of e)t=t.add(r);return new Re(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return Ht(this.fields,e.fields,(t,r)=>t.isEqual(r))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ic extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class he{constructor(e){this.binaryString=e}static fromBase64String(e){const t=function(s){try{return atob(s)}catch(o){throw typeof DOMException<"u"&&o instanceof DOMException?new Ic("Invalid base64 string: "+o):o}}(e);return new he(t)}static fromUint8Array(e){const t=function(s){let o="";for(let a=0;a<s.length;++a)o+=String.fromCharCode(s[a]);return o}(e);return new he(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(t){return btoa(t)}(this.binaryString)}toUint8Array(){return function(t){const r=new Uint8Array(t.length);for(let s=0;s<t.length;s++)r[s]=t.charCodeAt(s);return r}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return K(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}he.EMPTY_BYTE_STRING=new he("");const Lm=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function lt(n){if(W(!!n),typeof n=="string"){let e=0;const t=Lm.exec(n);if(W(!!t),t[1]){let s=t[1];s=(s+"000000000").substr(0,9),e=Number(s)}const r=new Date(n);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:ne(n.seconds),nanos:ne(n.nanos)}}function ne(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function Ct(n){return typeof n=="string"?he.fromBase64String(n):he.fromUint8Array(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wi(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||t===void 0?void 0:t.stringValue)==="server_timestamp"}function Ai(n){const e=n.mapValue.fields.__previous_value__;return wi(e)?Ai(e):e}function Nn(n){const e=lt(n.mapValue.fields.__local_write_time__.timestampValue);return new ie(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mm{constructor(e,t,r,s,o,a,c,h,d){this.databaseId=e,this.appId=t,this.persistenceKey=r,this.host=s,this.ssl=o,this.forceLongPolling=a,this.autoDetectLongPolling=c,this.longPollingOptions=h,this.useFetchStreams=d}}class On{constructor(e,t){this.projectId=e,this.database=t||"(default)"}static empty(){return new On("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(e){return e instanceof On&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mr={mapValue:{}};function Dt(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?wi(n)?4:Bm(n)?9007199254740991:Fm(n)?10:11:F()}function Fe(n,e){if(n===e)return!0;const t=Dt(n);if(t!==Dt(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===e.booleanValue;case 4:return Nn(n).isEqual(Nn(e));case 3:return function(s,o){if(typeof s.timestampValue=="string"&&typeof o.timestampValue=="string"&&s.timestampValue.length===o.timestampValue.length)return s.timestampValue===o.timestampValue;const a=lt(s.timestampValue),c=lt(o.timestampValue);return a.seconds===c.seconds&&a.nanos===c.nanos}(n,e);case 5:return n.stringValue===e.stringValue;case 6:return function(s,o){return Ct(s.bytesValue).isEqual(Ct(o.bytesValue))}(n,e);case 7:return n.referenceValue===e.referenceValue;case 8:return function(s,o){return ne(s.geoPointValue.latitude)===ne(o.geoPointValue.latitude)&&ne(s.geoPointValue.longitude)===ne(o.geoPointValue.longitude)}(n,e);case 2:return function(s,o){if("integerValue"in s&&"integerValue"in o)return ne(s.integerValue)===ne(o.integerValue);if("doubleValue"in s&&"doubleValue"in o){const a=ne(s.doubleValue),c=ne(o.doubleValue);return a===c?Pr(a)===Pr(c):isNaN(a)&&isNaN(c)}return!1}(n,e);case 9:return Ht(n.arrayValue.values||[],e.arrayValue.values||[],Fe);case 10:case 11:return function(s,o){const a=s.mapValue.fields||{},c=o.mapValue.fields||{};if(Ca(a)!==Ca(c))return!1;for(const h in a)if(a.hasOwnProperty(h)&&(c[h]===void 0||!Fe(a[h],c[h])))return!1;return!0}(n,e);default:return F()}}function xn(n,e){return(n.values||[]).find(t=>Fe(t,e))!==void 0}function Gt(n,e){if(n===e)return 0;const t=Dt(n),r=Dt(e);if(t!==r)return K(t,r);switch(t){case 0:case 9007199254740991:return 0;case 1:return K(n.booleanValue,e.booleanValue);case 2:return function(o,a){const c=ne(o.integerValue||o.doubleValue),h=ne(a.integerValue||a.doubleValue);return c<h?-1:c>h?1:c===h?0:isNaN(c)?isNaN(h)?0:-1:1}(n,e);case 3:return Va(n.timestampValue,e.timestampValue);case 4:return Va(Nn(n),Nn(e));case 5:return K(n.stringValue,e.stringValue);case 6:return function(o,a){const c=Ct(o),h=Ct(a);return c.compareTo(h)}(n.bytesValue,e.bytesValue);case 7:return function(o,a){const c=o.split("/"),h=a.split("/");for(let d=0;d<c.length&&d<h.length;d++){const m=K(c[d],h[d]);if(m!==0)return m}return K(c.length,h.length)}(n.referenceValue,e.referenceValue);case 8:return function(o,a){const c=K(ne(o.latitude),ne(a.latitude));return c!==0?c:K(ne(o.longitude),ne(a.longitude))}(n.geoPointValue,e.geoPointValue);case 9:return ka(n.arrayValue,e.arrayValue);case 10:return function(o,a){var c,h,d,m;const _=o.fields||{},A=a.fields||{},R=(c=_.value)===null||c===void 0?void 0:c.arrayValue,V=(h=A.value)===null||h===void 0?void 0:h.arrayValue,k=K(((d=R==null?void 0:R.values)===null||d===void 0?void 0:d.length)||0,((m=V==null?void 0:V.values)===null||m===void 0?void 0:m.length)||0);return k!==0?k:ka(R,V)}(n.mapValue,e.mapValue);case 11:return function(o,a){if(o===mr.mapValue&&a===mr.mapValue)return 0;if(o===mr.mapValue)return 1;if(a===mr.mapValue)return-1;const c=o.fields||{},h=Object.keys(c),d=a.fields||{},m=Object.keys(d);h.sort(),m.sort();for(let _=0;_<h.length&&_<m.length;++_){const A=K(h[_],m[_]);if(A!==0)return A;const R=Gt(c[h[_]],d[m[_]]);if(R!==0)return R}return K(h.length,m.length)}(n.mapValue,e.mapValue);default:throw F()}}function Va(n,e){if(typeof n=="string"&&typeof e=="string"&&n.length===e.length)return K(n,e);const t=lt(n),r=lt(e),s=K(t.seconds,r.seconds);return s!==0?s:K(t.nanos,r.nanos)}function ka(n,e){const t=n.values||[],r=e.values||[];for(let s=0;s<t.length&&s<r.length;++s){const o=Gt(t[s],r[s]);if(o)return o}return K(t.length,r.length)}function Kt(n){return Ys(n)}function Ys(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?function(t){const r=lt(t);return`time(${r.seconds},${r.nanos})`}(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?function(t){return Ct(t).toBase64()}(n.bytesValue):"referenceValue"in n?function(t){return L.fromName(t).toString()}(n.referenceValue):"geoPointValue"in n?function(t){return`geo(${t.latitude},${t.longitude})`}(n.geoPointValue):"arrayValue"in n?function(t){let r="[",s=!0;for(const o of t.values||[])s?s=!1:r+=",",r+=Ys(o);return r+"]"}(n.arrayValue):"mapValue"in n?function(t){const r=Object.keys(t.fields||{}).sort();let s="{",o=!0;for(const a of r)o?o=!1:s+=",",s+=`${a}:${Ys(t.fields[a])}`;return s+"}"}(n.mapValue):F()}function Xs(n){return!!n&&"integerValue"in n}function bi(n){return!!n&&"arrayValue"in n}function Na(n){return!!n&&"nullValue"in n}function Oa(n){return!!n&&"doubleValue"in n&&isNaN(Number(n.doubleValue))}function _r(n){return!!n&&"mapValue"in n}function Fm(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||t===void 0?void 0:t.stringValue)==="__vector__"}function Pn(n){if(n.geoPointValue)return{geoPointValue:Object.assign({},n.geoPointValue)};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:Object.assign({},n.timestampValue)};if(n.mapValue){const e={mapValue:{fields:{}}};return Nt(n.mapValue.fields,(t,r)=>e.mapValue.fields[t]=Pn(r)),e}if(n.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(n.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=Pn(n.arrayValue.values[t]);return e}return Object.assign({},n)}function Bm(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Te{constructor(e){this.value=e}static empty(){return new Te({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let r=0;r<e.length-1;++r)if(t=(t.mapValue.fields||{})[e.get(r)],!_r(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=Pn(t)}setAll(e){let t=ce.emptyPath(),r={},s=[];e.forEach((a,c)=>{if(!t.isImmediateParentOf(c)){const h=this.getFieldsMap(t);this.applyChanges(h,r,s),r={},s=[],t=c.popLast()}a?r[c.lastSegment()]=Pn(a):s.push(c.lastSegment())});const o=this.getFieldsMap(t);this.applyChanges(o,r,s)}delete(e){const t=this.field(e.popLast());_r(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return Fe(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let r=0;r<e.length;++r){let s=t.mapValue.fields[e.get(r)];_r(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},t.mapValue.fields[e.get(r)]=s),t=s}return t.mapValue.fields}applyChanges(e,t,r){Nt(t,(s,o)=>e[s]=o);for(const s of r)delete e[s]}clone(){return new Te(Pn(this.value))}}function Tc(n){const e=[];return Nt(n.fields,(t,r)=>{const s=new ce([t]);if(_r(r)){const o=Tc(r.mapValue).fields;if(o.length===0)e.push(s);else for(const a of o)e.push(s.child(a))}else e.push(s)}),new Re(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _e{constructor(e,t,r,s,o,a,c){this.key=e,this.documentType=t,this.version=r,this.readTime=s,this.createTime=o,this.data=a,this.documentState=c}static newInvalidDocument(e){return new _e(e,0,B.min(),B.min(),B.min(),Te.empty(),0)}static newFoundDocument(e,t,r,s){return new _e(e,1,t,B.min(),r,s,0)}static newNoDocument(e,t){return new _e(e,2,t,B.min(),B.min(),Te.empty(),0)}static newUnknownDocument(e,t){return new _e(e,3,t,B.min(),B.min(),Te.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(B.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=Te.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=Te.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=B.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof _e&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new _e(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sr{constructor(e,t){this.position=e,this.inclusive=t}}function xa(n,e,t){let r=0;for(let s=0;s<n.position.length;s++){const o=e[s],a=n.position[s];if(o.field.isKeyField()?r=L.comparator(L.fromName(a.referenceValue),t.key):r=Gt(a,t.data.field(o.field)),o.dir==="desc"&&(r*=-1),r!==0)break}return r}function La(n,e){if(n===null)return e===null;if(e===null||n.inclusive!==e.inclusive||n.position.length!==e.position.length)return!1;for(let t=0;t<n.position.length;t++)if(!Fe(n.position[t],e.position[t]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cr{constructor(e,t="asc"){this.field=e,this.dir=t}}function Um(n,e){return n.dir===e.dir&&n.field.isEqual(e.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wc{}class se extends wc{constructor(e,t,r){super(),this.field=e,this.op=t,this.value=r}static create(e,t,r){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,r):new jm(e,t,r):t==="array-contains"?new Hm(e,r):t==="in"?new Gm(e,r):t==="not-in"?new Km(e,r):t==="array-contains-any"?new Wm(e,r):new se(e,t,r)}static createKeyFieldInFilter(e,t,r){return t==="in"?new qm(e,r):new zm(e,r)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&this.matchesComparison(Gt(t,this.value)):t!==null&&Dt(this.value)===Dt(t)&&this.matchesComparison(Gt(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return F()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class Be extends wc{constructor(e,t){super(),this.filters=e,this.op=t,this.ae=null}static create(e,t){return new Be(e,t)}matches(e){return Ac(this)?this.filters.find(t=>!t.matches(e))===void 0:this.filters.find(t=>t.matches(e))!==void 0}getFlattenedFilters(){return this.ae!==null||(this.ae=this.filters.reduce((e,t)=>e.concat(t.getFlattenedFilters()),[])),this.ae}getFilters(){return Object.assign([],this.filters)}}function Ac(n){return n.op==="and"}function bc(n){return $m(n)&&Ac(n)}function $m(n){for(const e of n.filters)if(e instanceof Be)return!1;return!0}function Js(n){if(n instanceof se)return n.field.canonicalString()+n.op.toString()+Kt(n.value);if(bc(n))return n.filters.map(e=>Js(e)).join(",");{const e=n.filters.map(t=>Js(t)).join(",");return`${n.op}(${e})`}}function Rc(n,e){return n instanceof se?function(r,s){return s instanceof se&&r.op===s.op&&r.field.isEqual(s.field)&&Fe(r.value,s.value)}(n,e):n instanceof Be?function(r,s){return s instanceof Be&&r.op===s.op&&r.filters.length===s.filters.length?r.filters.reduce((o,a,c)=>o&&Rc(a,s.filters[c]),!0):!1}(n,e):void F()}function Pc(n){return n instanceof se?function(t){return`${t.field.canonicalString()} ${t.op} ${Kt(t.value)}`}(n):n instanceof Be?function(t){return t.op.toString()+" {"+t.getFilters().map(Pc).join(" ,")+"}"}(n):"Filter"}class jm extends se{constructor(e,t,r){super(e,t,r),this.key=L.fromName(r.referenceValue)}matches(e){const t=L.comparator(e.key,this.key);return this.matchesComparison(t)}}class qm extends se{constructor(e,t){super(e,"in",t),this.keys=Sc("in",t)}matches(e){return this.keys.some(t=>t.isEqual(e.key))}}class zm extends se{constructor(e,t){super(e,"not-in",t),this.keys=Sc("not-in",t)}matches(e){return!this.keys.some(t=>t.isEqual(e.key))}}function Sc(n,e){var t;return(((t=e.arrayValue)===null||t===void 0?void 0:t.values)||[]).map(r=>L.fromName(r.referenceValue))}class Hm extends se{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return bi(t)&&xn(t.arrayValue,this.value)}}class Gm extends se{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&xn(this.value.arrayValue,t)}}class Km extends se{constructor(e,t){super(e,"not-in",t)}matches(e){if(xn(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&!xn(this.value.arrayValue,t)}}class Wm extends se{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!bi(t)||!t.arrayValue.values)&&t.arrayValue.values.some(r=>xn(this.value.arrayValue,r))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qm{constructor(e,t=null,r=[],s=[],o=null,a=null,c=null){this.path=e,this.collectionGroup=t,this.orderBy=r,this.filters=s,this.limit=o,this.startAt=a,this.endAt=c,this.ue=null}}function Ma(n,e=null,t=[],r=[],s=null,o=null,a=null){return new Qm(n,e,t,r,s,o,a)}function Ri(n){const e=U(n);if(e.ue===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map(r=>Js(r)).join(","),t+="|ob:",t+=e.orderBy.map(r=>function(o){return o.field.canonicalString()+o.dir}(r)).join(","),qr(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map(r=>Kt(r)).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map(r=>Kt(r)).join(",")),e.ue=t}return e.ue}function Pi(n,e){if(n.limit!==e.limit||n.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<n.orderBy.length;t++)if(!Um(n.orderBy[t],e.orderBy[t]))return!1;if(n.filters.length!==e.filters.length)return!1;for(let t=0;t<n.filters.length;t++)if(!Rc(n.filters[t],e.filters[t]))return!1;return n.collectionGroup===e.collectionGroup&&!!n.path.isEqual(e.path)&&!!La(n.startAt,e.startAt)&&La(n.endAt,e.endAt)}function Zs(n){return L.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zr{constructor(e,t=null,r=[],s=[],o=null,a="F",c=null,h=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=r,this.filters=s,this.limit=o,this.limitType=a,this.startAt=c,this.endAt=h,this.ce=null,this.le=null,this.he=null,this.startAt,this.endAt}}function Ym(n,e,t,r,s,o,a,c){return new zr(n,e,t,r,s,o,a,c)}function Si(n){return new zr(n)}function Fa(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function Xm(n){return n.collectionGroup!==null}function Sn(n){const e=U(n);if(e.ce===null){e.ce=[];const t=new Set;for(const o of e.explicitOrderBy)e.ce.push(o),t.add(o.field.canonicalString());const r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(a){let c=new ue(ce.comparator);return a.filters.forEach(h=>{h.getFlattenedFilters().forEach(d=>{d.isInequality()&&(c=c.add(d.field))})}),c})(e).forEach(o=>{t.has(o.canonicalString())||o.isKeyField()||e.ce.push(new Cr(o,r))}),t.has(ce.keyField().canonicalString())||e.ce.push(new Cr(ce.keyField(),r))}return e.ce}function xe(n){const e=U(n);return e.le||(e.le=Jm(e,Sn(n))),e.le}function Jm(n,e){if(n.limitType==="F")return Ma(n.path,n.collectionGroup,e,n.filters,n.limit,n.startAt,n.endAt);{e=e.map(s=>{const o=s.dir==="desc"?"asc":"desc";return new Cr(s.field,o)});const t=n.endAt?new Sr(n.endAt.position,n.endAt.inclusive):null,r=n.startAt?new Sr(n.startAt.position,n.startAt.inclusive):null;return Ma(n.path,n.collectionGroup,e,n.filters,n.limit,t,r)}}function ei(n,e,t){return new zr(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),e,t,n.startAt,n.endAt)}function Hr(n,e){return Pi(xe(n),xe(e))&&n.limitType===e.limitType}function Cc(n){return`${Ri(xe(n))}|lt:${n.limitType}`}function Bt(n){return`Query(target=${function(t){let r=t.path.canonicalString();return t.collectionGroup!==null&&(r+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(r+=`, filters: [${t.filters.map(s=>Pc(s)).join(", ")}]`),qr(t.limit)||(r+=", limit: "+t.limit),t.orderBy.length>0&&(r+=`, orderBy: [${t.orderBy.map(s=>function(a){return`${a.field.canonicalString()} (${a.dir})`}(s)).join(", ")}]`),t.startAt&&(r+=", startAt: ",r+=t.startAt.inclusive?"b:":"a:",r+=t.startAt.position.map(s=>Kt(s)).join(",")),t.endAt&&(r+=", endAt: ",r+=t.endAt.inclusive?"a:":"b:",r+=t.endAt.position.map(s=>Kt(s)).join(",")),`Target(${r})`}(xe(n))}; limitType=${n.limitType})`}function Gr(n,e){return e.isFoundDocument()&&function(r,s){const o=s.key.path;return r.collectionGroup!==null?s.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(o):L.isDocumentKey(r.path)?r.path.isEqual(o):r.path.isImmediateParentOf(o)}(n,e)&&function(r,s){for(const o of Sn(r))if(!o.field.isKeyField()&&s.data.field(o.field)===null)return!1;return!0}(n,e)&&function(r,s){for(const o of r.filters)if(!o.matches(s))return!1;return!0}(n,e)&&function(r,s){return!(r.startAt&&!function(a,c,h){const d=xa(a,c,h);return a.inclusive?d<=0:d<0}(r.startAt,Sn(r),s)||r.endAt&&!function(a,c,h){const d=xa(a,c,h);return a.inclusive?d>=0:d>0}(r.endAt,Sn(r),s))}(n,e)}function Zm(n){return n.collectionGroup||(n.path.length%2==1?n.path.lastSegment():n.path.get(n.path.length-2))}function Dc(n){return(e,t)=>{let r=!1;for(const s of Sn(n)){const o=ep(s,e,t);if(o!==0)return o;r=r||s.field.isKeyField()}return 0}}function ep(n,e,t){const r=n.field.isKeyField()?L.comparator(e.key,t.key):function(o,a,c){const h=a.data.field(o),d=c.data.field(o);return h!==null&&d!==null?Gt(h,d):F()}(n.field,e,t);switch(n.dir){case"asc":return r;case"desc":return-1*r;default:return F()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class en{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),r=this.inner[t];if(r!==void 0){for(const[s,o]of r)if(this.equalsFn(s,e))return o}}has(e){return this.get(e)!==void 0}set(e,t){const r=this.mapKeyFn(e),s=this.inner[r];if(s===void 0)return this.inner[r]=[[e,t]],void this.innerSize++;for(let o=0;o<s.length;o++)if(this.equalsFn(s[o][0],e))return void(s[o]=[e,t]);s.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),r=this.inner[t];if(r===void 0)return!1;for(let s=0;s<r.length;s++)if(this.equalsFn(r[s][0],e))return r.length===1?delete this.inner[t]:r.splice(s,1),this.innerSize--,!0;return!1}forEach(e){Nt(this.inner,(t,r)=>{for(const[s,o]of r)e(s,o)})}isEmpty(){return Ec(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tp=new ee(L.comparator);function We(){return tp}const Vc=new ee(L.comparator);function wn(...n){let e=Vc;for(const t of n)e=e.insert(t.key,t);return e}function kc(n){let e=Vc;return n.forEach((t,r)=>e=e.insert(t,r.overlayedDocument)),e}function It(){return Cn()}function Nc(){return Cn()}function Cn(){return new en(n=>n.toString(),(n,e)=>n.isEqual(e))}const np=new ee(L.comparator),rp=new ue(L.comparator);function q(...n){let e=rp;for(const t of n)e=e.add(t);return e}const sp=new ue(K);function ip(){return sp}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ci(n,e){if(n.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Pr(e)?"-0":e}}function Oc(n){return{integerValue:""+n}}function op(n,e){return xm(e)?Oc(e):Ci(n,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kr{constructor(){this._=void 0}}function ap(n,e,t){return n instanceof Dr?function(s,o){const a={fields:{__type__:{stringValue:"server_timestamp"},__local_write_time__:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return o&&wi(o)&&(o=Ai(o)),o&&(a.fields.__previous_value__=o),{mapValue:a}}(t,e):n instanceof Ln?Lc(n,e):n instanceof Mn?Mc(n,e):function(s,o){const a=xc(s,o),c=Ba(a)+Ba(s.Pe);return Xs(a)&&Xs(s.Pe)?Oc(c):Ci(s.serializer,c)}(n,e)}function lp(n,e,t){return n instanceof Ln?Lc(n,e):n instanceof Mn?Mc(n,e):t}function xc(n,e){return n instanceof Vr?function(r){return Xs(r)||function(o){return!!o&&"doubleValue"in o}(r)}(e)?e:{integerValue:0}:null}class Dr extends Kr{}class Ln extends Kr{constructor(e){super(),this.elements=e}}function Lc(n,e){const t=Fc(e);for(const r of n.elements)t.some(s=>Fe(s,r))||t.push(r);return{arrayValue:{values:t}}}class Mn extends Kr{constructor(e){super(),this.elements=e}}function Mc(n,e){let t=Fc(e);for(const r of n.elements)t=t.filter(s=>!Fe(s,r));return{arrayValue:{values:t}}}class Vr extends Kr{constructor(e,t){super(),this.serializer=e,this.Pe=t}}function Ba(n){return ne(n.integerValue||n.doubleValue)}function Fc(n){return bi(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}function cp(n,e){return n.field.isEqual(e.field)&&function(r,s){return r instanceof Ln&&s instanceof Ln||r instanceof Mn&&s instanceof Mn?Ht(r.elements,s.elements,Fe):r instanceof Vr&&s instanceof Vr?Fe(r.Pe,s.Pe):r instanceof Dr&&s instanceof Dr}(n.transform,e.transform)}class up{constructor(e,t){this.version=e,this.transformResults=t}}class De{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new De}static exists(e){return new De(void 0,e)}static updateTime(e){return new De(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function vr(n,e){return n.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(n.updateTime):n.exists===void 0||n.exists===e.isFoundDocument()}class Wr{}function Bc(n,e){if(!n.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return n.isNoDocument()?new Di(n.key,De.none()):new $n(n.key,n.data,De.none());{const t=n.data,r=Te.empty();let s=new ue(ce.comparator);for(let o of e.fields)if(!s.has(o)){let a=t.field(o);a===null&&o.length>1&&(o=o.popLast(),a=t.field(o)),a===null?r.delete(o):r.set(o,a),s=s.add(o)}return new ht(n.key,r,new Re(s.toArray()),De.none())}}function hp(n,e,t){n instanceof $n?function(s,o,a){const c=s.value.clone(),h=$a(s.fieldTransforms,o,a.transformResults);c.setAll(h),o.convertToFoundDocument(a.version,c).setHasCommittedMutations()}(n,e,t):n instanceof ht?function(s,o,a){if(!vr(s.precondition,o))return void o.convertToUnknownDocument(a.version);const c=$a(s.fieldTransforms,o,a.transformResults),h=o.data;h.setAll(Uc(s)),h.setAll(c),o.convertToFoundDocument(a.version,h).setHasCommittedMutations()}(n,e,t):function(s,o,a){o.convertToNoDocument(a.version).setHasCommittedMutations()}(0,e,t)}function Dn(n,e,t,r){return n instanceof $n?function(o,a,c,h){if(!vr(o.precondition,a))return c;const d=o.value.clone(),m=ja(o.fieldTransforms,h,a);return d.setAll(m),a.convertToFoundDocument(a.version,d).setHasLocalMutations(),null}(n,e,t,r):n instanceof ht?function(o,a,c,h){if(!vr(o.precondition,a))return c;const d=ja(o.fieldTransforms,h,a),m=a.data;return m.setAll(Uc(o)),m.setAll(d),a.convertToFoundDocument(a.version,m).setHasLocalMutations(),c===null?null:c.unionWith(o.fieldMask.fields).unionWith(o.fieldTransforms.map(_=>_.field))}(n,e,t,r):function(o,a,c){return vr(o.precondition,a)?(a.convertToNoDocument(a.version).setHasLocalMutations(),null):c}(n,e,t)}function dp(n,e){let t=null;for(const r of n.fieldTransforms){const s=e.data.field(r.field),o=xc(r.transform,s||null);o!=null&&(t===null&&(t=Te.empty()),t.set(r.field,o))}return t||null}function Ua(n,e){return n.type===e.type&&!!n.key.isEqual(e.key)&&!!n.precondition.isEqual(e.precondition)&&!!function(r,s){return r===void 0&&s===void 0||!(!r||!s)&&Ht(r,s,(o,a)=>cp(o,a))}(n.fieldTransforms,e.fieldTransforms)&&(n.type===0?n.value.isEqual(e.value):n.type!==1||n.data.isEqual(e.data)&&n.fieldMask.isEqual(e.fieldMask))}class $n extends Wr{constructor(e,t,r,s=[]){super(),this.key=e,this.value=t,this.precondition=r,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class ht extends Wr{constructor(e,t,r,s,o=[]){super(),this.key=e,this.data=t,this.fieldMask=r,this.precondition=s,this.fieldTransforms=o,this.type=1}getFieldMask(){return this.fieldMask}}function Uc(n){const e=new Map;return n.fieldMask.fields.forEach(t=>{if(!t.isEmpty()){const r=n.data.field(t);e.set(t,r)}}),e}function $a(n,e,t){const r=new Map;W(n.length===t.length);for(let s=0;s<t.length;s++){const o=n[s],a=o.transform,c=e.data.field(o.field);r.set(o.field,lp(a,c,t[s]))}return r}function ja(n,e,t){const r=new Map;for(const s of n){const o=s.transform,a=t.data.field(s.field);r.set(s.field,ap(o,a,e))}return r}class Di extends Wr{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class fp extends Wr{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mp{constructor(e,t,r,s){this.batchId=e,this.localWriteTime=t,this.baseMutations=r,this.mutations=s}applyToRemoteDocument(e,t){const r=t.mutationResults;for(let s=0;s<this.mutations.length;s++){const o=this.mutations[s];o.key.isEqual(e.key)&&hp(o,e,r[s])}}applyToLocalView(e,t){for(const r of this.baseMutations)r.key.isEqual(e.key)&&(t=Dn(r,e,t,this.localWriteTime));for(const r of this.mutations)r.key.isEqual(e.key)&&(t=Dn(r,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const r=Nc();return this.mutations.forEach(s=>{const o=e.get(s.key),a=o.overlayedDocument;let c=this.applyToLocalView(a,o.mutatedFields);c=t.has(s.key)?null:c;const h=Bc(a,c);h!==null&&r.set(s.key,h),a.isValidDocument()||a.convertToNoDocument(B.min())}),r}keys(){return this.mutations.reduce((e,t)=>e.add(t.key),q())}isEqual(e){return this.batchId===e.batchId&&Ht(this.mutations,e.mutations,(t,r)=>Ua(t,r))&&Ht(this.baseMutations,e.baseMutations,(t,r)=>Ua(t,r))}}class Vi{constructor(e,t,r,s){this.batch=e,this.commitVersion=t,this.mutationResults=r,this.docVersions=s}static from(e,t,r){W(e.mutations.length===r.length);let s=function(){return np}();const o=e.mutations;for(let a=0;a<o.length;a++)s=s.insert(o[a].key,r[a].version);return new Vi(e,t,r,s)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pp{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gp{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var re,z;function yp(n){switch(n){default:return F();case S.CANCELLED:case S.UNKNOWN:case S.DEADLINE_EXCEEDED:case S.RESOURCE_EXHAUSTED:case S.INTERNAL:case S.UNAVAILABLE:case S.UNAUTHENTICATED:return!1;case S.INVALID_ARGUMENT:case S.NOT_FOUND:case S.ALREADY_EXISTS:case S.PERMISSION_DENIED:case S.FAILED_PRECONDITION:case S.ABORTED:case S.OUT_OF_RANGE:case S.UNIMPLEMENTED:case S.DATA_LOSS:return!0}}function $c(n){if(n===void 0)return Ke("GRPC error has no .code"),S.UNKNOWN;switch(n){case re.OK:return S.OK;case re.CANCELLED:return S.CANCELLED;case re.UNKNOWN:return S.UNKNOWN;case re.DEADLINE_EXCEEDED:return S.DEADLINE_EXCEEDED;case re.RESOURCE_EXHAUSTED:return S.RESOURCE_EXHAUSTED;case re.INTERNAL:return S.INTERNAL;case re.UNAVAILABLE:return S.UNAVAILABLE;case re.UNAUTHENTICATED:return S.UNAUTHENTICATED;case re.INVALID_ARGUMENT:return S.INVALID_ARGUMENT;case re.NOT_FOUND:return S.NOT_FOUND;case re.ALREADY_EXISTS:return S.ALREADY_EXISTS;case re.PERMISSION_DENIED:return S.PERMISSION_DENIED;case re.FAILED_PRECONDITION:return S.FAILED_PRECONDITION;case re.ABORTED:return S.ABORTED;case re.OUT_OF_RANGE:return S.OUT_OF_RANGE;case re.UNIMPLEMENTED:return S.UNIMPLEMENTED;case re.DATA_LOSS:return S.DATA_LOSS;default:return F()}}(z=re||(re={}))[z.OK=0]="OK",z[z.CANCELLED=1]="CANCELLED",z[z.UNKNOWN=2]="UNKNOWN",z[z.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",z[z.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",z[z.NOT_FOUND=5]="NOT_FOUND",z[z.ALREADY_EXISTS=6]="ALREADY_EXISTS",z[z.PERMISSION_DENIED=7]="PERMISSION_DENIED",z[z.UNAUTHENTICATED=16]="UNAUTHENTICATED",z[z.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",z[z.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",z[z.ABORTED=10]="ABORTED",z[z.OUT_OF_RANGE=11]="OUT_OF_RANGE",z[z.UNIMPLEMENTED=12]="UNIMPLEMENTED",z[z.INTERNAL=13]="INTERNAL",z[z.UNAVAILABLE=14]="UNAVAILABLE",z[z.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _p(){return new TextEncoder}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vp=new wt([4294967295,4294967295],0);function qa(n){const e=_p().encode(n),t=new dc;return t.update(e),new Uint8Array(t.digest())}function za(n){const e=new DataView(n.buffer),t=e.getUint32(0,!0),r=e.getUint32(4,!0),s=e.getUint32(8,!0),o=e.getUint32(12,!0);return[new wt([t,r],0),new wt([s,o],0)]}class ki{constructor(e,t,r){if(this.bitmap=e,this.padding=t,this.hashCount=r,t<0||t>=8)throw new An(`Invalid padding: ${t}`);if(r<0)throw new An(`Invalid hash count: ${r}`);if(e.length>0&&this.hashCount===0)throw new An(`Invalid hash count: ${r}`);if(e.length===0&&t!==0)throw new An(`Invalid padding when bitmap length is 0: ${t}`);this.Ie=8*e.length-t,this.Te=wt.fromNumber(this.Ie)}Ee(e,t,r){let s=e.add(t.multiply(wt.fromNumber(r)));return s.compare(vp)===1&&(s=new wt([s.getBits(0),s.getBits(1)],0)),s.modulo(this.Te).toNumber()}de(e){return(this.bitmap[Math.floor(e/8)]&1<<e%8)!=0}mightContain(e){if(this.Ie===0)return!1;const t=qa(e),[r,s]=za(t);for(let o=0;o<this.hashCount;o++){const a=this.Ee(r,s,o);if(!this.de(a))return!1}return!0}static create(e,t,r){const s=e%8==0?0:8-e%8,o=new Uint8Array(Math.ceil(e/8)),a=new ki(o,s,t);return r.forEach(c=>a.insert(c)),a}insert(e){if(this.Ie===0)return;const t=qa(e),[r,s]=za(t);for(let o=0;o<this.hashCount;o++){const a=this.Ee(r,s,o);this.Ae(a)}}Ae(e){const t=Math.floor(e/8),r=e%8;this.bitmap[t]|=1<<r}}class An extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qr{constructor(e,t,r,s,o){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=r,this.documentUpdates=s,this.resolvedLimboDocuments=o}static createSynthesizedRemoteEventForCurrentChange(e,t,r){const s=new Map;return s.set(e,jn.createSynthesizedTargetChangeForCurrentChange(e,t,r)),new Qr(B.min(),s,new ee(K),We(),q())}}class jn{constructor(e,t,r,s,o){this.resumeToken=e,this.current=t,this.addedDocuments=r,this.modifiedDocuments=s,this.removedDocuments=o}static createSynthesizedTargetChangeForCurrentChange(e,t,r){return new jn(r,t,q(),q(),q())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Er{constructor(e,t,r,s){this.Re=e,this.removedTargetIds=t,this.key=r,this.Ve=s}}class jc{constructor(e,t){this.targetId=e,this.me=t}}class qc{constructor(e,t,r=he.EMPTY_BYTE_STRING,s=null){this.state=e,this.targetIds=t,this.resumeToken=r,this.cause=s}}class Ha{constructor(){this.fe=0,this.ge=Ka(),this.pe=he.EMPTY_BYTE_STRING,this.ye=!1,this.we=!0}get current(){return this.ye}get resumeToken(){return this.pe}get Se(){return this.fe!==0}get be(){return this.we}De(e){e.approximateByteSize()>0&&(this.we=!0,this.pe=e)}ve(){let e=q(),t=q(),r=q();return this.ge.forEach((s,o)=>{switch(o){case 0:e=e.add(s);break;case 2:t=t.add(s);break;case 1:r=r.add(s);break;default:F()}}),new jn(this.pe,this.ye,e,t,r)}Ce(){this.we=!1,this.ge=Ka()}Fe(e,t){this.we=!0,this.ge=this.ge.insert(e,t)}Me(e){this.we=!0,this.ge=this.ge.remove(e)}xe(){this.fe+=1}Oe(){this.fe-=1,W(this.fe>=0)}Ne(){this.we=!0,this.ye=!0}}class Ep{constructor(e){this.Le=e,this.Be=new Map,this.ke=We(),this.qe=Ga(),this.Qe=new ee(K)}Ke(e){for(const t of e.Re)e.Ve&&e.Ve.isFoundDocument()?this.$e(t,e.Ve):this.Ue(t,e.key,e.Ve);for(const t of e.removedTargetIds)this.Ue(t,e.key,e.Ve)}We(e){this.forEachTarget(e,t=>{const r=this.Ge(t);switch(e.state){case 0:this.ze(t)&&r.De(e.resumeToken);break;case 1:r.Oe(),r.Se||r.Ce(),r.De(e.resumeToken);break;case 2:r.Oe(),r.Se||this.removeTarget(t);break;case 3:this.ze(t)&&(r.Ne(),r.De(e.resumeToken));break;case 4:this.ze(t)&&(this.je(t),r.De(e.resumeToken));break;default:F()}})}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.Be.forEach((r,s)=>{this.ze(s)&&t(s)})}He(e){const t=e.targetId,r=e.me.count,s=this.Je(t);if(s){const o=s.target;if(Zs(o))if(r===0){const a=new L(o.path);this.Ue(t,a,_e.newNoDocument(a,B.min()))}else W(r===1);else{const a=this.Ye(t);if(a!==r){const c=this.Ze(e),h=c?this.Xe(c,e,a):1;if(h!==0){this.je(t);const d=h===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Qe=this.Qe.insert(t,d)}}}}}Ze(e){const t=e.me.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:r="",padding:s=0},hashCount:o=0}=t;let a,c;try{a=Ct(r).toUint8Array()}catch(h){if(h instanceof Ic)return zt("Decoding the base64 bloom filter in existence filter failed ("+h.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw h}try{c=new ki(a,s,o)}catch(h){return zt(h instanceof An?"BloomFilter error: ":"Applying bloom filter failed: ",h),null}return c.Ie===0?null:c}Xe(e,t,r){return t.me.count===r-this.nt(e,t.targetId)?0:2}nt(e,t){const r=this.Le.getRemoteKeysForTarget(t);let s=0;return r.forEach(o=>{const a=this.Le.tt(),c=`projects/${a.projectId}/databases/${a.database}/documents/${o.path.canonicalString()}`;e.mightContain(c)||(this.Ue(t,o,null),s++)}),s}rt(e){const t=new Map;this.Be.forEach((o,a)=>{const c=this.Je(a);if(c){if(o.current&&Zs(c.target)){const h=new L(c.target.path);this.ke.get(h)!==null||this.it(a,h)||this.Ue(a,h,_e.newNoDocument(h,e))}o.be&&(t.set(a,o.ve()),o.Ce())}});let r=q();this.qe.forEach((o,a)=>{let c=!0;a.forEachWhile(h=>{const d=this.Je(h);return!d||d.purpose==="TargetPurposeLimboResolution"||(c=!1,!1)}),c&&(r=r.add(o))}),this.ke.forEach((o,a)=>a.setReadTime(e));const s=new Qr(e,t,this.Qe,this.ke,r);return this.ke=We(),this.qe=Ga(),this.Qe=new ee(K),s}$e(e,t){if(!this.ze(e))return;const r=this.it(e,t.key)?2:0;this.Ge(e).Fe(t.key,r),this.ke=this.ke.insert(t.key,t),this.qe=this.qe.insert(t.key,this.st(t.key).add(e))}Ue(e,t,r){if(!this.ze(e))return;const s=this.Ge(e);this.it(e,t)?s.Fe(t,1):s.Me(t),this.qe=this.qe.insert(t,this.st(t).delete(e)),r&&(this.ke=this.ke.insert(t,r))}removeTarget(e){this.Be.delete(e)}Ye(e){const t=this.Ge(e).ve();return this.Le.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}xe(e){this.Ge(e).xe()}Ge(e){let t=this.Be.get(e);return t||(t=new Ha,this.Be.set(e,t)),t}st(e){let t=this.qe.get(e);return t||(t=new ue(K),this.qe=this.qe.insert(e,t)),t}ze(e){const t=this.Je(e)!==null;return t||O("WatchChangeAggregator","Detected inactive target",e),t}Je(e){const t=this.Be.get(e);return t&&t.Se?null:this.Le.ot(e)}je(e){this.Be.set(e,new Ha),this.Le.getRemoteKeysForTarget(e).forEach(t=>{this.Ue(e,t,null)})}it(e,t){return this.Le.getRemoteKeysForTarget(e).has(t)}}function Ga(){return new ee(L.comparator)}function Ka(){return new ee(L.comparator)}const Ip={asc:"ASCENDING",desc:"DESCENDING"},Tp={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},wp={and:"AND",or:"OR"};class Ap{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function ti(n,e){return n.useProto3Json||qr(e)?e:{value:e}}function kr(n,e){return n.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function zc(n,e){return n.useProto3Json?e.toBase64():e.toUint8Array()}function bp(n,e){return kr(n,e.toTimestamp())}function Le(n){return W(!!n),B.fromTimestamp(function(t){const r=lt(t);return new ie(r.seconds,r.nanos)}(n))}function Ni(n,e){return ni(n,e).canonicalString()}function ni(n,e){const t=function(s){return new Z(["projects",s.projectId,"databases",s.database])}(n).child("documents");return e===void 0?t:t.child(e)}function Hc(n){const e=Z.fromString(n);return W(Yc(e)),e}function ri(n,e){return Ni(n.databaseId,e.path)}function xs(n,e){const t=Hc(e);if(t.get(1)!==n.databaseId.projectId)throw new x(S.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+n.databaseId.projectId);if(t.get(3)!==n.databaseId.database)throw new x(S.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+n.databaseId.database);return new L(Kc(t))}function Gc(n,e){return Ni(n.databaseId,e)}function Rp(n){const e=Hc(n);return e.length===4?Z.emptyPath():Kc(e)}function si(n){return new Z(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function Kc(n){return W(n.length>4&&n.get(4)==="documents"),n.popFirst(5)}function Wa(n,e,t){return{name:ri(n,e),fields:t.value.mapValue.fields}}function Pp(n,e){let t;if("targetChange"in e){e.targetChange;const r=function(d){return d==="NO_CHANGE"?0:d==="ADD"?1:d==="REMOVE"?2:d==="CURRENT"?3:d==="RESET"?4:F()}(e.targetChange.targetChangeType||"NO_CHANGE"),s=e.targetChange.targetIds||[],o=function(d,m){return d.useProto3Json?(W(m===void 0||typeof m=="string"),he.fromBase64String(m||"")):(W(m===void 0||m instanceof Buffer||m instanceof Uint8Array),he.fromUint8Array(m||new Uint8Array))}(n,e.targetChange.resumeToken),a=e.targetChange.cause,c=a&&function(d){const m=d.code===void 0?S.UNKNOWN:$c(d.code);return new x(m,d.message||"")}(a);t=new qc(r,s,o,c||null)}else if("documentChange"in e){e.documentChange;const r=e.documentChange;r.document,r.document.name,r.document.updateTime;const s=xs(n,r.document.name),o=Le(r.document.updateTime),a=r.document.createTime?Le(r.document.createTime):B.min(),c=new Te({mapValue:{fields:r.document.fields}}),h=_e.newFoundDocument(s,o,a,c),d=r.targetIds||[],m=r.removedTargetIds||[];t=new Er(d,m,h.key,h)}else if("documentDelete"in e){e.documentDelete;const r=e.documentDelete;r.document;const s=xs(n,r.document),o=r.readTime?Le(r.readTime):B.min(),a=_e.newNoDocument(s,o),c=r.removedTargetIds||[];t=new Er([],c,a.key,a)}else if("documentRemove"in e){e.documentRemove;const r=e.documentRemove;r.document;const s=xs(n,r.document),o=r.removedTargetIds||[];t=new Er([],o,s,null)}else{if(!("filter"in e))return F();{e.filter;const r=e.filter;r.targetId;const{count:s=0,unchangedNames:o}=r,a=new gp(s,o),c=r.targetId;t=new jc(c,a)}}return t}function Sp(n,e){let t;if(e instanceof $n)t={update:Wa(n,e.key,e.value)};else if(e instanceof Di)t={delete:ri(n,e.key)};else if(e instanceof ht)t={update:Wa(n,e.key,e.data),updateMask:Mp(e.fieldMask)};else{if(!(e instanceof fp))return F();t={verify:ri(n,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map(r=>function(o,a){const c=a.transform;if(c instanceof Dr)return{fieldPath:a.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(c instanceof Ln)return{fieldPath:a.field.canonicalString(),appendMissingElements:{values:c.elements}};if(c instanceof Mn)return{fieldPath:a.field.canonicalString(),removeAllFromArray:{values:c.elements}};if(c instanceof Vr)return{fieldPath:a.field.canonicalString(),increment:c.Pe};throw F()}(0,r))),e.precondition.isNone||(t.currentDocument=function(s,o){return o.updateTime!==void 0?{updateTime:bp(s,o.updateTime)}:o.exists!==void 0?{exists:o.exists}:F()}(n,e.precondition)),t}function Cp(n,e){return n&&n.length>0?(W(e!==void 0),n.map(t=>function(s,o){let a=s.updateTime?Le(s.updateTime):Le(o);return a.isEqual(B.min())&&(a=Le(o)),new up(a,s.transformResults||[])}(t,e))):[]}function Dp(n,e){return{documents:[Gc(n,e.path)]}}function Vp(n,e){const t={structuredQuery:{}},r=e.path;let s;e.collectionGroup!==null?(s=r,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(s=r.popLast(),t.structuredQuery.from=[{collectionId:r.lastSegment()}]),t.parent=Gc(n,s);const o=function(d){if(d.length!==0)return Qc(Be.create(d,"and"))}(e.filters);o&&(t.structuredQuery.where=o);const a=function(d){if(d.length!==0)return d.map(m=>function(A){return{field:Ut(A.field),direction:Op(A.dir)}}(m))}(e.orderBy);a&&(t.structuredQuery.orderBy=a);const c=ti(n,e.limit);return c!==null&&(t.structuredQuery.limit=c),e.startAt&&(t.structuredQuery.startAt=function(d){return{before:d.inclusive,values:d.position}}(e.startAt)),e.endAt&&(t.structuredQuery.endAt=function(d){return{before:!d.inclusive,values:d.position}}(e.endAt)),{_t:t,parent:s}}function kp(n){let e=Rp(n.parent);const t=n.structuredQuery,r=t.from?t.from.length:0;let s=null;if(r>0){W(r===1);const m=t.from[0];m.allDescendants?s=m.collectionId:e=e.child(m.collectionId)}let o=[];t.where&&(o=function(_){const A=Wc(_);return A instanceof Be&&bc(A)?A.getFilters():[A]}(t.where));let a=[];t.orderBy&&(a=function(_){return _.map(A=>function(V){return new Cr($t(V.field),function(C){switch(C){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(V.direction))}(A))}(t.orderBy));let c=null;t.limit&&(c=function(_){let A;return A=typeof _=="object"?_.value:_,qr(A)?null:A}(t.limit));let h=null;t.startAt&&(h=function(_){const A=!!_.before,R=_.values||[];return new Sr(R,A)}(t.startAt));let d=null;return t.endAt&&(d=function(_){const A=!_.before,R=_.values||[];return new Sr(R,A)}(t.endAt)),Ym(e,s,a,o,c,"F",h,d)}function Np(n,e){const t=function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return F()}}(e.purpose);return t==null?null:{"goog-listen-tags":t}}function Wc(n){return n.unaryFilter!==void 0?function(t){switch(t.unaryFilter.op){case"IS_NAN":const r=$t(t.unaryFilter.field);return se.create(r,"==",{doubleValue:NaN});case"IS_NULL":const s=$t(t.unaryFilter.field);return se.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const o=$t(t.unaryFilter.field);return se.create(o,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const a=$t(t.unaryFilter.field);return se.create(a,"!=",{nullValue:"NULL_VALUE"});default:return F()}}(n):n.fieldFilter!==void 0?function(t){return se.create($t(t.fieldFilter.field),function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return F()}}(t.fieldFilter.op),t.fieldFilter.value)}(n):n.compositeFilter!==void 0?function(t){return Be.create(t.compositeFilter.filters.map(r=>Wc(r)),function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return F()}}(t.compositeFilter.op))}(n):F()}function Op(n){return Ip[n]}function xp(n){return Tp[n]}function Lp(n){return wp[n]}function Ut(n){return{fieldPath:n.canonicalString()}}function $t(n){return ce.fromServerFormat(n.fieldPath)}function Qc(n){return n instanceof se?function(t){if(t.op==="=="){if(Oa(t.value))return{unaryFilter:{field:Ut(t.field),op:"IS_NAN"}};if(Na(t.value))return{unaryFilter:{field:Ut(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(Oa(t.value))return{unaryFilter:{field:Ut(t.field),op:"IS_NOT_NAN"}};if(Na(t.value))return{unaryFilter:{field:Ut(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Ut(t.field),op:xp(t.op),value:t.value}}}(n):n instanceof Be?function(t){const r=t.getFilters().map(s=>Qc(s));return r.length===1?r[0]:{compositeFilter:{op:Lp(t.op),filters:r}}}(n):F()}function Mp(n){const e=[];return n.fields.forEach(t=>e.push(t.canonicalString())),{fieldPaths:e}}function Yc(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class et{constructor(e,t,r,s,o=B.min(),a=B.min(),c=he.EMPTY_BYTE_STRING,h=null){this.target=e,this.targetId=t,this.purpose=r,this.sequenceNumber=s,this.snapshotVersion=o,this.lastLimboFreeSnapshotVersion=a,this.resumeToken=c,this.expectedCount=h}withSequenceNumber(e){return new et(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new et(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new et(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new et(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fp{constructor(e){this.ct=e}}function Bp(n){const e=kp({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?ei(e,e.limit,"L"):e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Up{constructor(){this.un=new $p}addToCollectionParentIndex(e,t){return this.un.add(t),P.resolve()}getCollectionParents(e,t){return P.resolve(this.un.getEntries(t))}addFieldIndex(e,t){return P.resolve()}deleteFieldIndex(e,t){return P.resolve()}deleteAllFieldIndexes(e){return P.resolve()}createTargetIndexes(e,t){return P.resolve()}getDocumentsMatchingTarget(e,t){return P.resolve(null)}getIndexType(e,t){return P.resolve(0)}getFieldIndexes(e,t){return P.resolve([])}getNextCollectionGroupToUpdate(e){return P.resolve(null)}getMinOffset(e,t){return P.resolve(at.min())}getMinOffsetFromCollectionGroup(e,t){return P.resolve(at.min())}updateCollectionGroup(e,t,r){return P.resolve()}updateIndexEntries(e,t){return P.resolve()}}class $p{constructor(){this.index={}}add(e){const t=e.lastSegment(),r=e.popLast(),s=this.index[t]||new ue(Z.comparator),o=!s.has(r);return this.index[t]=s.add(r),o}has(e){const t=e.lastSegment(),r=e.popLast(),s=this.index[t];return s&&s.has(r)}getEntries(e){return(this.index[e]||new ue(Z.comparator)).toArray()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wt{constructor(e){this.Ln=e}next(){return this.Ln+=2,this.Ln}static Bn(){return new Wt(0)}static kn(){return new Wt(-1)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jp{constructor(){this.changes=new en(e=>e.toString(),(e,t)=>e.isEqual(t)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,_e.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const r=this.changes.get(t);return r!==void 0?P.resolve(r):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qp{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zp{constructor(e,t,r,s){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=r,this.indexManager=s}getDocument(e,t){let r=null;return this.documentOverlayCache.getOverlay(e,t).next(s=>(r=s,this.remoteDocumentCache.getEntry(e,t))).next(s=>(r!==null&&Dn(r.mutation,s,Re.empty(),ie.now()),s))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next(r=>this.getLocalViewOfDocuments(e,r,q()).next(()=>r))}getLocalViewOfDocuments(e,t,r=q()){const s=It();return this.populateOverlays(e,s,t).next(()=>this.computeViews(e,t,s,r).next(o=>{let a=wn();return o.forEach((c,h)=>{a=a.insert(c,h.overlayedDocument)}),a}))}getOverlayedDocuments(e,t){const r=It();return this.populateOverlays(e,r,t).next(()=>this.computeViews(e,t,r,q()))}populateOverlays(e,t,r){const s=[];return r.forEach(o=>{t.has(o)||s.push(o)}),this.documentOverlayCache.getOverlays(e,s).next(o=>{o.forEach((a,c)=>{t.set(a,c)})})}computeViews(e,t,r,s){let o=We();const a=Cn(),c=function(){return Cn()}();return t.forEach((h,d)=>{const m=r.get(d.key);s.has(d.key)&&(m===void 0||m.mutation instanceof ht)?o=o.insert(d.key,d):m!==void 0?(a.set(d.key,m.mutation.getFieldMask()),Dn(m.mutation,d,m.mutation.getFieldMask(),ie.now())):a.set(d.key,Re.empty())}),this.recalculateAndSaveOverlays(e,o).next(h=>(h.forEach((d,m)=>a.set(d,m)),t.forEach((d,m)=>{var _;return c.set(d,new qp(m,(_=a.get(d))!==null&&_!==void 0?_:null))}),c))}recalculateAndSaveOverlays(e,t){const r=Cn();let s=new ee((a,c)=>a-c),o=q();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next(a=>{for(const c of a)c.keys().forEach(h=>{const d=t.get(h);if(d===null)return;let m=r.get(h)||Re.empty();m=c.applyToLocalView(d,m),r.set(h,m);const _=(s.get(c.batchId)||q()).add(h);s=s.insert(c.batchId,_)})}).next(()=>{const a=[],c=s.getReverseIterator();for(;c.hasNext();){const h=c.getNext(),d=h.key,m=h.value,_=Nc();m.forEach(A=>{if(!o.has(A)){const R=Bc(t.get(A),r.get(A));R!==null&&_.set(A,R),o=o.add(A)}}),a.push(this.documentOverlayCache.saveOverlays(e,d,_))}return P.waitFor(a)}).next(()=>r)}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next(r=>this.recalculateAndSaveOverlays(e,r))}getDocumentsMatchingQuery(e,t,r,s){return function(a){return L.isDocumentKey(a.path)&&a.collectionGroup===null&&a.filters.length===0}(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):Xm(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,r,s):this.getDocumentsMatchingCollectionQuery(e,t,r,s)}getNextDocuments(e,t,r,s){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,r,s).next(o=>{const a=s-o.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,r.largestBatchId,s-o.size):P.resolve(It());let c=-1,h=o;return a.next(d=>P.forEach(d,(m,_)=>(c<_.largestBatchId&&(c=_.largestBatchId),o.get(m)?P.resolve():this.remoteDocumentCache.getEntry(e,m).next(A=>{h=h.insert(m,A)}))).next(()=>this.populateOverlays(e,d,o)).next(()=>this.computeViews(e,h,d,q())).next(m=>({batchId:c,changes:kc(m)})))})}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new L(t)).next(r=>{let s=wn();return r.isFoundDocument()&&(s=s.insert(r.key,r)),s})}getDocumentsMatchingCollectionGroupQuery(e,t,r,s){const o=t.collectionGroup;let a=wn();return this.indexManager.getCollectionParents(e,o).next(c=>P.forEach(c,h=>{const d=function(_,A){return new zr(A,null,_.explicitOrderBy.slice(),_.filters.slice(),_.limit,_.limitType,_.startAt,_.endAt)}(t,h.child(o));return this.getDocumentsMatchingCollectionQuery(e,d,r,s).next(m=>{m.forEach((_,A)=>{a=a.insert(_,A)})})}).next(()=>a))}getDocumentsMatchingCollectionQuery(e,t,r,s){let o;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,r.largestBatchId).next(a=>(o=a,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,r,o,s))).next(a=>{o.forEach((h,d)=>{const m=d.getKey();a.get(m)===null&&(a=a.insert(m,_e.newInvalidDocument(m)))});let c=wn();return a.forEach((h,d)=>{const m=o.get(h);m!==void 0&&Dn(m.mutation,d,Re.empty(),ie.now()),Gr(t,d)&&(c=c.insert(h,d))}),c})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hp{constructor(e){this.serializer=e,this.hr=new Map,this.Pr=new Map}getBundleMetadata(e,t){return P.resolve(this.hr.get(t))}saveBundleMetadata(e,t){return this.hr.set(t.id,function(s){return{id:s.id,version:s.version,createTime:Le(s.createTime)}}(t)),P.resolve()}getNamedQuery(e,t){return P.resolve(this.Pr.get(t))}saveNamedQuery(e,t){return this.Pr.set(t.name,function(s){return{name:s.name,query:Bp(s.bundledQuery),readTime:Le(s.readTime)}}(t)),P.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gp{constructor(){this.overlays=new ee(L.comparator),this.Ir=new Map}getOverlay(e,t){return P.resolve(this.overlays.get(t))}getOverlays(e,t){const r=It();return P.forEach(t,s=>this.getOverlay(e,s).next(o=>{o!==null&&r.set(s,o)})).next(()=>r)}saveOverlays(e,t,r){return r.forEach((s,o)=>{this.ht(e,t,o)}),P.resolve()}removeOverlaysForBatchId(e,t,r){const s=this.Ir.get(r);return s!==void 0&&(s.forEach(o=>this.overlays=this.overlays.remove(o)),this.Ir.delete(r)),P.resolve()}getOverlaysForCollection(e,t,r){const s=It(),o=t.length+1,a=new L(t.child("")),c=this.overlays.getIteratorFrom(a);for(;c.hasNext();){const h=c.getNext().value,d=h.getKey();if(!t.isPrefixOf(d.path))break;d.path.length===o&&h.largestBatchId>r&&s.set(h.getKey(),h)}return P.resolve(s)}getOverlaysForCollectionGroup(e,t,r,s){let o=new ee((d,m)=>d-m);const a=this.overlays.getIterator();for(;a.hasNext();){const d=a.getNext().value;if(d.getKey().getCollectionGroup()===t&&d.largestBatchId>r){let m=o.get(d.largestBatchId);m===null&&(m=It(),o=o.insert(d.largestBatchId,m)),m.set(d.getKey(),d)}}const c=It(),h=o.getIterator();for(;h.hasNext()&&(h.getNext().value.forEach((d,m)=>c.set(d,m)),!(c.size()>=s)););return P.resolve(c)}ht(e,t,r){const s=this.overlays.get(r.key);if(s!==null){const a=this.Ir.get(s.largestBatchId).delete(r.key);this.Ir.set(s.largestBatchId,a)}this.overlays=this.overlays.insert(r.key,new pp(t,r));let o=this.Ir.get(t);o===void 0&&(o=q(),this.Ir.set(t,o)),this.Ir.set(t,o.add(r.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kp{constructor(){this.sessionToken=he.EMPTY_BYTE_STRING}getSessionToken(e){return P.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,P.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oi{constructor(){this.Tr=new ue(oe.Er),this.dr=new ue(oe.Ar)}isEmpty(){return this.Tr.isEmpty()}addReference(e,t){const r=new oe(e,t);this.Tr=this.Tr.add(r),this.dr=this.dr.add(r)}Rr(e,t){e.forEach(r=>this.addReference(r,t))}removeReference(e,t){this.Vr(new oe(e,t))}mr(e,t){e.forEach(r=>this.removeReference(r,t))}gr(e){const t=new L(new Z([])),r=new oe(t,e),s=new oe(t,e+1),o=[];return this.dr.forEachInRange([r,s],a=>{this.Vr(a),o.push(a.key)}),o}pr(){this.Tr.forEach(e=>this.Vr(e))}Vr(e){this.Tr=this.Tr.delete(e),this.dr=this.dr.delete(e)}yr(e){const t=new L(new Z([])),r=new oe(t,e),s=new oe(t,e+1);let o=q();return this.dr.forEachInRange([r,s],a=>{o=o.add(a.key)}),o}containsKey(e){const t=new oe(e,0),r=this.Tr.firstAfterOrEqual(t);return r!==null&&e.isEqual(r.key)}}class oe{constructor(e,t){this.key=e,this.wr=t}static Er(e,t){return L.comparator(e.key,t.key)||K(e.wr,t.wr)}static Ar(e,t){return K(e.wr,t.wr)||L.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wp{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Sr=1,this.br=new ue(oe.Er)}checkEmpty(e){return P.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,r,s){const o=this.Sr;this.Sr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const a=new mp(o,t,r,s);this.mutationQueue.push(a);for(const c of s)this.br=this.br.add(new oe(c.key,o)),this.indexManager.addToCollectionParentIndex(e,c.key.path.popLast());return P.resolve(a)}lookupMutationBatch(e,t){return P.resolve(this.Dr(t))}getNextMutationBatchAfterBatchId(e,t){const r=t+1,s=this.vr(r),o=s<0?0:s;return P.resolve(this.mutationQueue.length>o?this.mutationQueue[o]:null)}getHighestUnacknowledgedBatchId(){return P.resolve(this.mutationQueue.length===0?-1:this.Sr-1)}getAllMutationBatches(e){return P.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const r=new oe(t,0),s=new oe(t,Number.POSITIVE_INFINITY),o=[];return this.br.forEachInRange([r,s],a=>{const c=this.Dr(a.wr);o.push(c)}),P.resolve(o)}getAllMutationBatchesAffectingDocumentKeys(e,t){let r=new ue(K);return t.forEach(s=>{const o=new oe(s,0),a=new oe(s,Number.POSITIVE_INFINITY);this.br.forEachInRange([o,a],c=>{r=r.add(c.wr)})}),P.resolve(this.Cr(r))}getAllMutationBatchesAffectingQuery(e,t){const r=t.path,s=r.length+1;let o=r;L.isDocumentKey(o)||(o=o.child(""));const a=new oe(new L(o),0);let c=new ue(K);return this.br.forEachWhile(h=>{const d=h.key.path;return!!r.isPrefixOf(d)&&(d.length===s&&(c=c.add(h.wr)),!0)},a),P.resolve(this.Cr(c))}Cr(e){const t=[];return e.forEach(r=>{const s=this.Dr(r);s!==null&&t.push(s)}),t}removeMutationBatch(e,t){W(this.Fr(t.batchId,"removed")===0),this.mutationQueue.shift();let r=this.br;return P.forEach(t.mutations,s=>{const o=new oe(s.key,t.batchId);return r=r.delete(o),this.referenceDelegate.markPotentiallyOrphaned(e,s.key)}).next(()=>{this.br=r})}On(e){}containsKey(e,t){const r=new oe(t,0),s=this.br.firstAfterOrEqual(r);return P.resolve(t.isEqual(s&&s.key))}performConsistencyCheck(e){return this.mutationQueue.length,P.resolve()}Fr(e,t){return this.vr(e)}vr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Dr(e){const t=this.vr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qp{constructor(e){this.Mr=e,this.docs=function(){return new ee(L.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const r=t.key,s=this.docs.get(r),o=s?s.size:0,a=this.Mr(t);return this.docs=this.docs.insert(r,{document:t.mutableCopy(),size:a}),this.size+=a-o,this.indexManager.addToCollectionParentIndex(e,r.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const r=this.docs.get(t);return P.resolve(r?r.document.mutableCopy():_e.newInvalidDocument(t))}getEntries(e,t){let r=We();return t.forEach(s=>{const o=this.docs.get(s);r=r.insert(s,o?o.document.mutableCopy():_e.newInvalidDocument(s))}),P.resolve(r)}getDocumentsMatchingQuery(e,t,r,s){let o=We();const a=t.path,c=new L(a.child("")),h=this.docs.getIteratorFrom(c);for(;h.hasNext();){const{key:d,value:{document:m}}=h.getNext();if(!a.isPrefixOf(d.path))break;d.path.length>a.length+1||Vm(Dm(m),r)<=0||(s.has(m.key)||Gr(t,m))&&(o=o.insert(m.key,m.mutableCopy()))}return P.resolve(o)}getAllFromCollectionGroup(e,t,r,s){F()}Or(e,t){return P.forEach(this.docs,r=>t(r))}newChangeBuffer(e){return new Yp(this)}getSize(e){return P.resolve(this.size)}}class Yp extends jp{constructor(e){super(),this.cr=e}applyChanges(e){const t=[];return this.changes.forEach((r,s)=>{s.isValidDocument()?t.push(this.cr.addEntry(e,s)):this.cr.removeEntry(r)}),P.waitFor(t)}getFromCache(e,t){return this.cr.getEntry(e,t)}getAllFromCache(e,t){return this.cr.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xp{constructor(e){this.persistence=e,this.Nr=new en(t=>Ri(t),Pi),this.lastRemoteSnapshotVersion=B.min(),this.highestTargetId=0,this.Lr=0,this.Br=new Oi,this.targetCount=0,this.kr=Wt.Bn()}forEachTarget(e,t){return this.Nr.forEach((r,s)=>t(s)),P.resolve()}getLastRemoteSnapshotVersion(e){return P.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return P.resolve(this.Lr)}allocateTargetId(e){return this.highestTargetId=this.kr.next(),P.resolve(this.highestTargetId)}setTargetsMetadata(e,t,r){return r&&(this.lastRemoteSnapshotVersion=r),t>this.Lr&&(this.Lr=t),P.resolve()}Kn(e){this.Nr.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.kr=new Wt(t),this.highestTargetId=t),e.sequenceNumber>this.Lr&&(this.Lr=e.sequenceNumber)}addTargetData(e,t){return this.Kn(t),this.targetCount+=1,P.resolve()}updateTargetData(e,t){return this.Kn(t),P.resolve()}removeTargetData(e,t){return this.Nr.delete(t.target),this.Br.gr(t.targetId),this.targetCount-=1,P.resolve()}removeTargets(e,t,r){let s=0;const o=[];return this.Nr.forEach((a,c)=>{c.sequenceNumber<=t&&r.get(c.targetId)===null&&(this.Nr.delete(a),o.push(this.removeMatchingKeysForTargetId(e,c.targetId)),s++)}),P.waitFor(o).next(()=>s)}getTargetCount(e){return P.resolve(this.targetCount)}getTargetData(e,t){const r=this.Nr.get(t)||null;return P.resolve(r)}addMatchingKeys(e,t,r){return this.Br.Rr(t,r),P.resolve()}removeMatchingKeys(e,t,r){this.Br.mr(t,r);const s=this.persistence.referenceDelegate,o=[];return s&&t.forEach(a=>{o.push(s.markPotentiallyOrphaned(e,a))}),P.waitFor(o)}removeMatchingKeysForTargetId(e,t){return this.Br.gr(t),P.resolve()}getMatchingKeysForTargetId(e,t){const r=this.Br.yr(t);return P.resolve(r)}containsKey(e,t){return P.resolve(this.Br.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jp{constructor(e,t){this.qr={},this.overlays={},this.Qr=new Ti(0),this.Kr=!1,this.Kr=!0,this.$r=new Kp,this.referenceDelegate=e(this),this.Ur=new Xp(this),this.indexManager=new Up,this.remoteDocumentCache=function(s){return new Qp(s)}(r=>this.referenceDelegate.Wr(r)),this.serializer=new Fp(t),this.Gr=new Hp(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.Kr=!1,Promise.resolve()}get started(){return this.Kr}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new Gp,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let r=this.qr[e.toKey()];return r||(r=new Wp(t,this.referenceDelegate),this.qr[e.toKey()]=r),r}getGlobalsCache(){return this.$r}getTargetCache(){return this.Ur}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Gr}runTransaction(e,t,r){O("MemoryPersistence","Starting transaction:",e);const s=new Zp(this.Qr.next());return this.referenceDelegate.zr(),r(s).next(o=>this.referenceDelegate.jr(s).next(()=>o)).toPromise().then(o=>(s.raiseOnCommittedEvent(),o))}Hr(e,t){return P.or(Object.values(this.qr).map(r=>()=>r.containsKey(e,t)))}}class Zp extends Nm{constructor(e){super(),this.currentSequenceNumber=e}}class xi{constructor(e){this.persistence=e,this.Jr=new Oi,this.Yr=null}static Zr(e){return new xi(e)}get Xr(){if(this.Yr)return this.Yr;throw F()}addReference(e,t,r){return this.Jr.addReference(r,t),this.Xr.delete(r.toString()),P.resolve()}removeReference(e,t,r){return this.Jr.removeReference(r,t),this.Xr.add(r.toString()),P.resolve()}markPotentiallyOrphaned(e,t){return this.Xr.add(t.toString()),P.resolve()}removeTarget(e,t){this.Jr.gr(t.targetId).forEach(s=>this.Xr.add(s.toString()));const r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(e,t.targetId).next(s=>{s.forEach(o=>this.Xr.add(o.toString()))}).next(()=>r.removeTargetData(e,t))}zr(){this.Yr=new Set}jr(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return P.forEach(this.Xr,r=>{const s=L.fromPath(r);return this.ei(e,s).next(o=>{o||t.removeEntry(s,B.min())})}).next(()=>(this.Yr=null,t.apply(e)))}updateLimboDocument(e,t){return this.ei(e,t).next(r=>{r?this.Xr.delete(t.toString()):this.Xr.add(t.toString())})}Wr(e){return 0}ei(e,t){return P.or([()=>P.resolve(this.Jr.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Hr(e,t)])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Li{constructor(e,t,r,s){this.targetId=e,this.fromCache=t,this.$i=r,this.Ui=s}static Wi(e,t){let r=q(),s=q();for(const o of t.docChanges)switch(o.type){case 0:r=r.add(o.doc.key);break;case 1:s=s.add(o.doc.key)}return new Li(e,t.fromCache,r,s)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eg{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tg{constructor(){this.Gi=!1,this.zi=!1,this.ji=100,this.Hi=function(){return Mh()?8:Om(Oh())>0?6:4}()}initialize(e,t){this.Ji=e,this.indexManager=t,this.Gi=!0}getDocumentsMatchingQuery(e,t,r,s){const o={result:null};return this.Yi(e,t).next(a=>{o.result=a}).next(()=>{if(!o.result)return this.Zi(e,t,s,r).next(a=>{o.result=a})}).next(()=>{if(o.result)return;const a=new eg;return this.Xi(e,t,a).next(c=>{if(o.result=c,this.zi)return this.es(e,t,a,c.size)})}).next(()=>o.result)}es(e,t,r,s){return r.documentReadCount<this.ji?(En()<=H.DEBUG&&O("QueryEngine","SDK will not create cache indexes for query:",Bt(t),"since it only creates cache indexes for collection contains","more than or equal to",this.ji,"documents"),P.resolve()):(En()<=H.DEBUG&&O("QueryEngine","Query:",Bt(t),"scans",r.documentReadCount,"local documents and returns",s,"documents as results."),r.documentReadCount>this.Hi*s?(En()<=H.DEBUG&&O("QueryEngine","The SDK decides to create cache indexes for query:",Bt(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,xe(t))):P.resolve())}Yi(e,t){if(Fa(t))return P.resolve(null);let r=xe(t);return this.indexManager.getIndexType(e,r).next(s=>s===0?null:(t.limit!==null&&s===1&&(t=ei(t,null,"F"),r=xe(t)),this.indexManager.getDocumentsMatchingTarget(e,r).next(o=>{const a=q(...o);return this.Ji.getDocuments(e,a).next(c=>this.indexManager.getMinOffset(e,r).next(h=>{const d=this.ts(t,c);return this.ns(t,d,a,h.readTime)?this.Yi(e,ei(t,null,"F")):this.rs(e,d,t,h)}))})))}Zi(e,t,r,s){return Fa(t)||s.isEqual(B.min())?P.resolve(null):this.Ji.getDocuments(e,r).next(o=>{const a=this.ts(t,o);return this.ns(t,a,r,s)?P.resolve(null):(En()<=H.DEBUG&&O("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),Bt(t)),this.rs(e,a,t,Cm(s,-1)).next(c=>c))})}ts(e,t){let r=new ue(Dc(e));return t.forEach((s,o)=>{Gr(e,o)&&(r=r.add(o))}),r}ns(e,t,r,s){if(e.limit===null)return!1;if(r.size!==t.size)return!0;const o=e.limitType==="F"?t.last():t.first();return!!o&&(o.hasPendingWrites||o.version.compareTo(s)>0)}Xi(e,t,r){return En()<=H.DEBUG&&O("QueryEngine","Using full collection scan to execute query:",Bt(t)),this.Ji.getDocumentsMatchingQuery(e,t,at.min(),r)}rs(e,t,r,s){return this.Ji.getDocumentsMatchingQuery(e,r,s).next(o=>(t.forEach(a=>{o=o.insert(a.key,a)}),o))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ng{constructor(e,t,r,s){this.persistence=e,this.ss=t,this.serializer=s,this.os=new ee(K),this._s=new en(o=>Ri(o),Pi),this.us=new Map,this.cs=e.getRemoteDocumentCache(),this.Ur=e.getTargetCache(),this.Gr=e.getBundleCache(),this.ls(r)}ls(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new zp(this.cs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.cs.setIndexManager(this.indexManager),this.ss.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",t=>e.collect(t,this.os))}}function rg(n,e,t,r){return new ng(n,e,t,r)}async function Xc(n,e){const t=U(n);return await t.persistence.runTransaction("Handle user change","readonly",r=>{let s;return t.mutationQueue.getAllMutationBatches(r).next(o=>(s=o,t.ls(e),t.mutationQueue.getAllMutationBatches(r))).next(o=>{const a=[],c=[];let h=q();for(const d of s){a.push(d.batchId);for(const m of d.mutations)h=h.add(m.key)}for(const d of o){c.push(d.batchId);for(const m of d.mutations)h=h.add(m.key)}return t.localDocuments.getDocuments(r,h).next(d=>({hs:d,removedBatchIds:a,addedBatchIds:c}))})})}function sg(n,e){const t=U(n);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",r=>{const s=e.batch.keys(),o=t.cs.newChangeBuffer({trackRemovals:!0});return function(c,h,d,m){const _=d.batch,A=_.keys();let R=P.resolve();return A.forEach(V=>{R=R.next(()=>m.getEntry(h,V)).next(k=>{const C=d.docVersions.get(V);W(C!==null),k.version.compareTo(C)<0&&(_.applyToRemoteDocument(k,d),k.isValidDocument()&&(k.setReadTime(d.commitVersion),m.addEntry(k)))})}),R.next(()=>c.mutationQueue.removeMutationBatch(h,_))}(t,r,e,o).next(()=>o.apply(r)).next(()=>t.mutationQueue.performConsistencyCheck(r)).next(()=>t.documentOverlayCache.removeOverlaysForBatchId(r,s,e.batch.batchId)).next(()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(r,function(c){let h=q();for(let d=0;d<c.mutationResults.length;++d)c.mutationResults[d].transformResults.length>0&&(h=h.add(c.batch.mutations[d].key));return h}(e))).next(()=>t.localDocuments.getDocuments(r,s))})}function Jc(n){const e=U(n);return e.persistence.runTransaction("Get last remote snapshot version","readonly",t=>e.Ur.getLastRemoteSnapshotVersion(t))}function ig(n,e){const t=U(n),r=e.snapshotVersion;let s=t.os;return t.persistence.runTransaction("Apply remote event","readwrite-primary",o=>{const a=t.cs.newChangeBuffer({trackRemovals:!0});s=t.os;const c=[];e.targetChanges.forEach((m,_)=>{const A=s.get(_);if(!A)return;c.push(t.Ur.removeMatchingKeys(o,m.removedDocuments,_).next(()=>t.Ur.addMatchingKeys(o,m.addedDocuments,_)));let R=A.withSequenceNumber(o.currentSequenceNumber);e.targetMismatches.get(_)!==null?R=R.withResumeToken(he.EMPTY_BYTE_STRING,B.min()).withLastLimboFreeSnapshotVersion(B.min()):m.resumeToken.approximateByteSize()>0&&(R=R.withResumeToken(m.resumeToken,r)),s=s.insert(_,R),function(k,C,$){return k.resumeToken.approximateByteSize()===0||C.snapshotVersion.toMicroseconds()-k.snapshotVersion.toMicroseconds()>=3e8?!0:$.addedDocuments.size+$.modifiedDocuments.size+$.removedDocuments.size>0}(A,R,m)&&c.push(t.Ur.updateTargetData(o,R))});let h=We(),d=q();if(e.documentUpdates.forEach(m=>{e.resolvedLimboDocuments.has(m)&&c.push(t.persistence.referenceDelegate.updateLimboDocument(o,m))}),c.push(og(o,a,e.documentUpdates).next(m=>{h=m.Ps,d=m.Is})),!r.isEqual(B.min())){const m=t.Ur.getLastRemoteSnapshotVersion(o).next(_=>t.Ur.setTargetsMetadata(o,o.currentSequenceNumber,r));c.push(m)}return P.waitFor(c).next(()=>a.apply(o)).next(()=>t.localDocuments.getLocalViewOfDocuments(o,h,d)).next(()=>h)}).then(o=>(t.os=s,o))}function og(n,e,t){let r=q(),s=q();return t.forEach(o=>r=r.add(o)),e.getEntries(n,r).next(o=>{let a=We();return t.forEach((c,h)=>{const d=o.get(c);h.isFoundDocument()!==d.isFoundDocument()&&(s=s.add(c)),h.isNoDocument()&&h.version.isEqual(B.min())?(e.removeEntry(c,h.readTime),a=a.insert(c,h)):!d.isValidDocument()||h.version.compareTo(d.version)>0||h.version.compareTo(d.version)===0&&d.hasPendingWrites?(e.addEntry(h),a=a.insert(c,h)):O("LocalStore","Ignoring outdated watch update for ",c,". Current version:",d.version," Watch version:",h.version)}),{Ps:a,Is:s}})}function ag(n,e){const t=U(n);return t.persistence.runTransaction("Get next mutation batch","readonly",r=>(e===void 0&&(e=-1),t.mutationQueue.getNextMutationBatchAfterBatchId(r,e)))}function lg(n,e){const t=U(n);return t.persistence.runTransaction("Allocate target","readwrite",r=>{let s;return t.Ur.getTargetData(r,e).next(o=>o?(s=o,P.resolve(s)):t.Ur.allocateTargetId(r).next(a=>(s=new et(e,a,"TargetPurposeListen",r.currentSequenceNumber),t.Ur.addTargetData(r,s).next(()=>s))))}).then(r=>{const s=t.os.get(r.targetId);return(s===null||r.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(t.os=t.os.insert(r.targetId,r),t._s.set(e,r.targetId)),r})}async function ii(n,e,t){const r=U(n),s=r.os.get(e),o=t?"readwrite":"readwrite-primary";try{t||await r.persistence.runTransaction("Release target",o,a=>r.persistence.referenceDelegate.removeTarget(a,s))}catch(a){if(!Un(a))throw a;O("LocalStore",`Failed to update sequence numbers for target ${e}: ${a}`)}r.os=r.os.remove(e),r._s.delete(s.target)}function Qa(n,e,t){const r=U(n);let s=B.min(),o=q();return r.persistence.runTransaction("Execute query","readwrite",a=>function(h,d,m){const _=U(h),A=_._s.get(m);return A!==void 0?P.resolve(_.os.get(A)):_.Ur.getTargetData(d,m)}(r,a,xe(e)).next(c=>{if(c)return s=c.lastLimboFreeSnapshotVersion,r.Ur.getMatchingKeysForTargetId(a,c.targetId).next(h=>{o=h})}).next(()=>r.ss.getDocumentsMatchingQuery(a,e,t?s:B.min(),t?o:q())).next(c=>(cg(r,Zm(e),c),{documents:c,Ts:o})))}function cg(n,e,t){let r=n.us.get(e)||B.min();t.forEach((s,o)=>{o.readTime.compareTo(r)>0&&(r=o.readTime)}),n.us.set(e,r)}class Ya{constructor(){this.activeTargetIds=ip()}fs(e){this.activeTargetIds=this.activeTargetIds.add(e)}gs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Vs(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class ug{constructor(){this.so=new Ya,this.oo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,r){}addLocalQueryTarget(e,t=!0){return t&&this.so.fs(e),this.oo[e]||"not-current"}updateQueryState(e,t,r){this.oo[e]=t}removeLocalQueryTarget(e){this.so.gs(e)}isLocalQueryTarget(e){return this.so.activeTargetIds.has(e)}clearQueryState(e){delete this.oo[e]}getAllActiveQueryTargets(){return this.so.activeTargetIds}isActiveQueryTarget(e){return this.so.activeTargetIds.has(e)}start(){return this.so=new Ya,Promise.resolve()}handleUserChange(e,t,r){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hg{_o(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xa{constructor(){this.ao=()=>this.uo(),this.co=()=>this.lo(),this.ho=[],this.Po()}_o(e){this.ho.push(e)}shutdown(){window.removeEventListener("online",this.ao),window.removeEventListener("offline",this.co)}Po(){window.addEventListener("online",this.ao),window.addEventListener("offline",this.co)}uo(){O("ConnectivityMonitor","Network connectivity changed: AVAILABLE");for(const e of this.ho)e(0)}lo(){O("ConnectivityMonitor","Network connectivity changed: UNAVAILABLE");for(const e of this.ho)e(1)}static D(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let pr=null;function Ls(){return pr===null?pr=function(){return 268435456+Math.round(2147483648*Math.random())}():pr++,"0x"+pr.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dg={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fg{constructor(e){this.Io=e.Io,this.To=e.To}Eo(e){this.Ao=e}Ro(e){this.Vo=e}mo(e){this.fo=e}onMessage(e){this.po=e}close(){this.To()}send(e){this.Io(e)}yo(){this.Ao()}wo(){this.Vo()}So(e){this.fo(e)}bo(e){this.po(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ge="WebChannelConnection";class mg extends class{constructor(t){this.databaseInfo=t,this.databaseId=t.databaseId;const r=t.ssl?"https":"http",s=encodeURIComponent(this.databaseId.projectId),o=encodeURIComponent(this.databaseId.database);this.Do=r+"://"+t.host,this.vo=`projects/${s}/databases/${o}`,this.Co=this.databaseId.database==="(default)"?`project_id=${s}`:`project_id=${s}&database_id=${o}`}get Fo(){return!1}Mo(t,r,s,o,a){const c=Ls(),h=this.xo(t,r.toUriEncodedString());O("RestConnection",`Sending RPC '${t}' ${c}:`,h,s);const d={"google-cloud-resource-prefix":this.vo,"x-goog-request-params":this.Co};return this.Oo(d,o,a),this.No(t,h,d,s).then(m=>(O("RestConnection",`Received RPC '${t}' ${c}: `,m),m),m=>{throw zt("RestConnection",`RPC '${t}' ${c} failed with error: `,m,"url: ",h,"request:",s),m})}Lo(t,r,s,o,a,c){return this.Mo(t,r,s,o,a)}Oo(t,r,s){t["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+Zt}(),t["Content-Type"]="text/plain",this.databaseInfo.appId&&(t["X-Firebase-GMPID"]=this.databaseInfo.appId),r&&r.headers.forEach((o,a)=>t[a]=o),s&&s.headers.forEach((o,a)=>t[a]=o)}xo(t,r){const s=dg[t];return`${this.Do}/v1/${r}:${s}`}terminate(){}}{constructor(e){super(e),this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}No(e,t,r,s){const o=Ls();return new Promise((a,c)=>{const h=new fc;h.setWithCredentials(!0),h.listenOnce(mc.COMPLETE,()=>{try{switch(h.getLastErrorCode()){case yr.NO_ERROR:const m=h.getResponseJson();O(ge,`XHR for RPC '${e}' ${o} received:`,JSON.stringify(m)),a(m);break;case yr.TIMEOUT:O(ge,`RPC '${e}' ${o} timed out`),c(new x(S.DEADLINE_EXCEEDED,"Request time out"));break;case yr.HTTP_ERROR:const _=h.getStatus();if(O(ge,`RPC '${e}' ${o} failed with status:`,_,"response text:",h.getResponseText()),_>0){let A=h.getResponseJson();Array.isArray(A)&&(A=A[0]);const R=A==null?void 0:A.error;if(R&&R.status&&R.message){const V=function(C){const $=C.toLowerCase().replace(/_/g,"-");return Object.values(S).indexOf($)>=0?$:S.UNKNOWN}(R.status);c(new x(V,R.message))}else c(new x(S.UNKNOWN,"Server responded with status "+h.getStatus()))}else c(new x(S.UNAVAILABLE,"Connection failed."));break;default:F()}}finally{O(ge,`RPC '${e}' ${o} completed.`)}});const d=JSON.stringify(s);O(ge,`RPC '${e}' ${o} sending request:`,s),h.send(t,"POST",d,r,15)})}Bo(e,t,r){const s=Ls(),o=[this.Do,"/","google.firestore.v1.Firestore","/",e,"/channel"],a=yc(),c=gc(),h={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},d=this.longPollingOptions.timeoutSeconds;d!==void 0&&(h.longPollingTimeout=Math.round(1e3*d)),this.useFetchStreams&&(h.useFetchStreams=!0),this.Oo(h.initMessageHeaders,t,r),h.encodeInitMessageHeaders=!0;const m=o.join("");O(ge,`Creating RPC '${e}' stream ${s}: ${m}`,h);const _=a.createWebChannel(m,h);let A=!1,R=!1;const V=new fg({Io:C=>{R?O(ge,`Not sending because RPC '${e}' stream ${s} is closed:`,C):(A||(O(ge,`Opening RPC '${e}' stream ${s} transport.`),_.open(),A=!0),O(ge,`RPC '${e}' stream ${s} sending:`,C),_.send(C))},To:()=>_.close()}),k=(C,$,j)=>{C.listen($,N=>{try{j(N)}catch(M){setTimeout(()=>{throw M},0)}})};return k(_,Tn.EventType.OPEN,()=>{R||(O(ge,`RPC '${e}' stream ${s} transport opened.`),V.yo())}),k(_,Tn.EventType.CLOSE,()=>{R||(R=!0,O(ge,`RPC '${e}' stream ${s} transport closed`),V.So())}),k(_,Tn.EventType.ERROR,C=>{R||(R=!0,zt(ge,`RPC '${e}' stream ${s} transport errored:`,C),V.So(new x(S.UNAVAILABLE,"The operation could not be completed")))}),k(_,Tn.EventType.MESSAGE,C=>{var $;if(!R){const j=C.data[0];W(!!j);const N=j,M=N.error||(($=N[0])===null||$===void 0?void 0:$.error);if(M){O(ge,`RPC '${e}' stream ${s} received error:`,M);const J=M.status;let Q=function(y){const v=re[y];if(v!==void 0)return $c(v)}(J),E=M.message;Q===void 0&&(Q=S.INTERNAL,E="Unknown error status: "+J+" with message "+M.message),R=!0,V.So(new x(Q,E)),_.close()}else O(ge,`RPC '${e}' stream ${s} received:`,j),V.bo(j)}}),k(c,pc.STAT_EVENT,C=>{C.stat===Qs.PROXY?O(ge,`RPC '${e}' stream ${s} detected buffering proxy`):C.stat===Qs.NOPROXY&&O(ge,`RPC '${e}' stream ${s} detected no buffering proxy`)}),setTimeout(()=>{V.wo()},0),V}}function Ms(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yr(n){return new Ap(n,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zc{constructor(e,t,r=1e3,s=1.5,o=6e4){this.ui=e,this.timerId=t,this.ko=r,this.qo=s,this.Qo=o,this.Ko=0,this.$o=null,this.Uo=Date.now(),this.reset()}reset(){this.Ko=0}Wo(){this.Ko=this.Qo}Go(e){this.cancel();const t=Math.floor(this.Ko+this.zo()),r=Math.max(0,Date.now()-this.Uo),s=Math.max(0,t-r);s>0&&O("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.Ko} ms, delay with jitter: ${t} ms, last attempt: ${r} ms ago)`),this.$o=this.ui.enqueueAfterDelay(this.timerId,s,()=>(this.Uo=Date.now(),e())),this.Ko*=this.qo,this.Ko<this.ko&&(this.Ko=this.ko),this.Ko>this.Qo&&(this.Ko=this.Qo)}jo(){this.$o!==null&&(this.$o.skipDelay(),this.$o=null)}cancel(){this.$o!==null&&(this.$o.cancel(),this.$o=null)}zo(){return(Math.random()-.5)*this.Ko}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eu{constructor(e,t,r,s,o,a,c,h){this.ui=e,this.Ho=r,this.Jo=s,this.connection=o,this.authCredentialsProvider=a,this.appCheckCredentialsProvider=c,this.listener=h,this.state=0,this.Yo=0,this.Zo=null,this.Xo=null,this.stream=null,this.e_=0,this.t_=new Zc(e,t)}n_(){return this.state===1||this.state===5||this.r_()}r_(){return this.state===2||this.state===3}start(){this.e_=0,this.state!==4?this.auth():this.i_()}async stop(){this.n_()&&await this.close(0)}s_(){this.state=0,this.t_.reset()}o_(){this.r_()&&this.Zo===null&&(this.Zo=this.ui.enqueueAfterDelay(this.Ho,6e4,()=>this.__()))}a_(e){this.u_(),this.stream.send(e)}async __(){if(this.r_())return this.close(0)}u_(){this.Zo&&(this.Zo.cancel(),this.Zo=null)}c_(){this.Xo&&(this.Xo.cancel(),this.Xo=null)}async close(e,t){this.u_(),this.c_(),this.t_.cancel(),this.Yo++,e!==4?this.t_.reset():t&&t.code===S.RESOURCE_EXHAUSTED?(Ke(t.toString()),Ke("Using maximum backoff delay to prevent overloading the backend."),this.t_.Wo()):t&&t.code===S.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.l_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.mo(t)}l_(){}auth(){this.state=1;const e=this.h_(this.Yo),t=this.Yo;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([r,s])=>{this.Yo===t&&this.P_(r,s)},r=>{e(()=>{const s=new x(S.UNKNOWN,"Fetching auth token failed: "+r.message);return this.I_(s)})})}P_(e,t){const r=this.h_(this.Yo);this.stream=this.T_(e,t),this.stream.Eo(()=>{r(()=>this.listener.Eo())}),this.stream.Ro(()=>{r(()=>(this.state=2,this.Xo=this.ui.enqueueAfterDelay(this.Jo,1e4,()=>(this.r_()&&(this.state=3),Promise.resolve())),this.listener.Ro()))}),this.stream.mo(s=>{r(()=>this.I_(s))}),this.stream.onMessage(s=>{r(()=>++this.e_==1?this.E_(s):this.onNext(s))})}i_(){this.state=5,this.t_.Go(async()=>{this.state=0,this.start()})}I_(e){return O("PersistentStream",`close with error: ${e}`),this.stream=null,this.close(4,e)}h_(e){return t=>{this.ui.enqueueAndForget(()=>this.Yo===e?t():(O("PersistentStream","stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class pg extends eu{constructor(e,t,r,s,o,a){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,r,s,a),this.serializer=o}T_(e,t){return this.connection.Bo("Listen",e,t)}E_(e){return this.onNext(e)}onNext(e){this.t_.reset();const t=Pp(this.serializer,e),r=function(o){if(!("targetChange"in o))return B.min();const a=o.targetChange;return a.targetIds&&a.targetIds.length?B.min():a.readTime?Le(a.readTime):B.min()}(e);return this.listener.d_(t,r)}A_(e){const t={};t.database=si(this.serializer),t.addTarget=function(o,a){let c;const h=a.target;if(c=Zs(h)?{documents:Dp(o,h)}:{query:Vp(o,h)._t},c.targetId=a.targetId,a.resumeToken.approximateByteSize()>0){c.resumeToken=zc(o,a.resumeToken);const d=ti(o,a.expectedCount);d!==null&&(c.expectedCount=d)}else if(a.snapshotVersion.compareTo(B.min())>0){c.readTime=kr(o,a.snapshotVersion.toTimestamp());const d=ti(o,a.expectedCount);d!==null&&(c.expectedCount=d)}return c}(this.serializer,e);const r=Np(this.serializer,e);r&&(t.labels=r),this.a_(t)}R_(e){const t={};t.database=si(this.serializer),t.removeTarget=e,this.a_(t)}}class gg extends eu{constructor(e,t,r,s,o,a){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,r,s,a),this.serializer=o}get V_(){return this.e_>0}start(){this.lastStreamToken=void 0,super.start()}l_(){this.V_&&this.m_([])}T_(e,t){return this.connection.Bo("Write",e,t)}E_(e){return W(!!e.streamToken),this.lastStreamToken=e.streamToken,W(!e.writeResults||e.writeResults.length===0),this.listener.f_()}onNext(e){W(!!e.streamToken),this.lastStreamToken=e.streamToken,this.t_.reset();const t=Cp(e.writeResults,e.commitTime),r=Le(e.commitTime);return this.listener.g_(r,t)}p_(){const e={};e.database=si(this.serializer),this.a_(e)}m_(e){const t={streamToken:this.lastStreamToken,writes:e.map(r=>Sp(this.serializer,r))};this.a_(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yg extends class{}{constructor(e,t,r,s){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=r,this.serializer=s,this.y_=!1}w_(){if(this.y_)throw new x(S.FAILED_PRECONDITION,"The client has already been terminated.")}Mo(e,t,r,s){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([o,a])=>this.connection.Mo(e,ni(t,r),s,o,a)).catch(o=>{throw o.name==="FirebaseError"?(o.code===S.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new x(S.UNKNOWN,o.toString())})}Lo(e,t,r,s,o){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([a,c])=>this.connection.Lo(e,ni(t,r),s,a,c,o)).catch(a=>{throw a.name==="FirebaseError"?(a.code===S.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),a):new x(S.UNKNOWN,a.toString())})}terminate(){this.y_=!0,this.connection.terminate()}}class _g{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.S_=0,this.b_=null,this.D_=!0}v_(){this.S_===0&&(this.C_("Unknown"),this.b_=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.b_=null,this.F_("Backend didn't respond within 10 seconds."),this.C_("Offline"),Promise.resolve())))}M_(e){this.state==="Online"?this.C_("Unknown"):(this.S_++,this.S_>=1&&(this.x_(),this.F_(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.C_("Offline")))}set(e){this.x_(),this.S_=0,e==="Online"&&(this.D_=!1),this.C_(e)}C_(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}F_(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.D_?(Ke(t),this.D_=!1):O("OnlineStateTracker",t)}x_(){this.b_!==null&&(this.b_.cancel(),this.b_=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vg{constructor(e,t,r,s,o){this.localStore=e,this.datastore=t,this.asyncQueue=r,this.remoteSyncer={},this.O_=[],this.N_=new Map,this.L_=new Set,this.B_=[],this.k_=o,this.k_._o(a=>{r.enqueueAndForget(async()=>{Ot(this)&&(O("RemoteStore","Restarting streams for network reachability change."),await async function(h){const d=U(h);d.L_.add(4),await qn(d),d.q_.set("Unknown"),d.L_.delete(4),await Xr(d)}(this))})}),this.q_=new _g(r,s)}}async function Xr(n){if(Ot(n))for(const e of n.B_)await e(!0)}async function qn(n){for(const e of n.B_)await e(!1)}function tu(n,e){const t=U(n);t.N_.has(e.targetId)||(t.N_.set(e.targetId,e),Ui(t)?Bi(t):tn(t).r_()&&Fi(t,e))}function Mi(n,e){const t=U(n),r=tn(t);t.N_.delete(e),r.r_()&&nu(t,e),t.N_.size===0&&(r.r_()?r.o_():Ot(t)&&t.q_.set("Unknown"))}function Fi(n,e){if(n.Q_.xe(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(B.min())>0){const t=n.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(t)}tn(n).A_(e)}function nu(n,e){n.Q_.xe(e),tn(n).R_(e)}function Bi(n){n.Q_=new Ep({getRemoteKeysForTarget:e=>n.remoteSyncer.getRemoteKeysForTarget(e),ot:e=>n.N_.get(e)||null,tt:()=>n.datastore.serializer.databaseId}),tn(n).start(),n.q_.v_()}function Ui(n){return Ot(n)&&!tn(n).n_()&&n.N_.size>0}function Ot(n){return U(n).L_.size===0}function ru(n){n.Q_=void 0}async function Eg(n){n.q_.set("Online")}async function Ig(n){n.N_.forEach((e,t)=>{Fi(n,e)})}async function Tg(n,e){ru(n),Ui(n)?(n.q_.M_(e),Bi(n)):n.q_.set("Unknown")}async function wg(n,e,t){if(n.q_.set("Online"),e instanceof qc&&e.state===2&&e.cause)try{await async function(s,o){const a=o.cause;for(const c of o.targetIds)s.N_.has(c)&&(await s.remoteSyncer.rejectListen(c,a),s.N_.delete(c),s.Q_.removeTarget(c))}(n,e)}catch(r){O("RemoteStore","Failed to remove targets %s: %s ",e.targetIds.join(","),r),await Nr(n,r)}else if(e instanceof Er?n.Q_.Ke(e):e instanceof jc?n.Q_.He(e):n.Q_.We(e),!t.isEqual(B.min()))try{const r=await Jc(n.localStore);t.compareTo(r)>=0&&await function(o,a){const c=o.Q_.rt(a);return c.targetChanges.forEach((h,d)=>{if(h.resumeToken.approximateByteSize()>0){const m=o.N_.get(d);m&&o.N_.set(d,m.withResumeToken(h.resumeToken,a))}}),c.targetMismatches.forEach((h,d)=>{const m=o.N_.get(h);if(!m)return;o.N_.set(h,m.withResumeToken(he.EMPTY_BYTE_STRING,m.snapshotVersion)),nu(o,h);const _=new et(m.target,h,d,m.sequenceNumber);Fi(o,_)}),o.remoteSyncer.applyRemoteEvent(c)}(n,t)}catch(r){O("RemoteStore","Failed to raise snapshot:",r),await Nr(n,r)}}async function Nr(n,e,t){if(!Un(e))throw e;n.L_.add(1),await qn(n),n.q_.set("Offline"),t||(t=()=>Jc(n.localStore)),n.asyncQueue.enqueueRetryable(async()=>{O("RemoteStore","Retrying IndexedDB access"),await t(),n.L_.delete(1),await Xr(n)})}function su(n,e){return e().catch(t=>Nr(n,t,e))}async function Jr(n){const e=U(n),t=ct(e);let r=e.O_.length>0?e.O_[e.O_.length-1].batchId:-1;for(;Ag(e);)try{const s=await ag(e.localStore,r);if(s===null){e.O_.length===0&&t.o_();break}r=s.batchId,bg(e,s)}catch(s){await Nr(e,s)}iu(e)&&ou(e)}function Ag(n){return Ot(n)&&n.O_.length<10}function bg(n,e){n.O_.push(e);const t=ct(n);t.r_()&&t.V_&&t.m_(e.mutations)}function iu(n){return Ot(n)&&!ct(n).n_()&&n.O_.length>0}function ou(n){ct(n).start()}async function Rg(n){ct(n).p_()}async function Pg(n){const e=ct(n);for(const t of n.O_)e.m_(t.mutations)}async function Sg(n,e,t){const r=n.O_.shift(),s=Vi.from(r,e,t);await su(n,()=>n.remoteSyncer.applySuccessfulWrite(s)),await Jr(n)}async function Cg(n,e){e&&ct(n).V_&&await async function(r,s){if(function(a){return yp(a)&&a!==S.ABORTED}(s.code)){const o=r.O_.shift();ct(r).s_(),await su(r,()=>r.remoteSyncer.rejectFailedWrite(o.batchId,s)),await Jr(r)}}(n,e),iu(n)&&ou(n)}async function Ja(n,e){const t=U(n);t.asyncQueue.verifyOperationInProgress(),O("RemoteStore","RemoteStore received new credentials");const r=Ot(t);t.L_.add(3),await qn(t),r&&t.q_.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.L_.delete(3),await Xr(t)}async function Dg(n,e){const t=U(n);e?(t.L_.delete(2),await Xr(t)):e||(t.L_.add(2),await qn(t),t.q_.set("Unknown"))}function tn(n){return n.K_||(n.K_=function(t,r,s){const o=U(t);return o.w_(),new pg(r,o.connection,o.authCredentials,o.appCheckCredentials,o.serializer,s)}(n.datastore,n.asyncQueue,{Eo:Eg.bind(null,n),Ro:Ig.bind(null,n),mo:Tg.bind(null,n),d_:wg.bind(null,n)}),n.B_.push(async e=>{e?(n.K_.s_(),Ui(n)?Bi(n):n.q_.set("Unknown")):(await n.K_.stop(),ru(n))})),n.K_}function ct(n){return n.U_||(n.U_=function(t,r,s){const o=U(t);return o.w_(),new gg(r,o.connection,o.authCredentials,o.appCheckCredentials,o.serializer,s)}(n.datastore,n.asyncQueue,{Eo:()=>Promise.resolve(),Ro:Rg.bind(null,n),mo:Cg.bind(null,n),f_:Pg.bind(null,n),g_:Sg.bind(null,n)}),n.B_.push(async e=>{e?(n.U_.s_(),await Jr(n)):(await n.U_.stop(),n.O_.length>0&&(O("RemoteStore",`Stopping write stream with ${n.O_.length} pending writes`),n.O_=[]))})),n.U_}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $i{constructor(e,t,r,s,o){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=r,this.op=s,this.removalCallback=o,this.deferred=new st,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(a=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,t,r,s,o){const a=Date.now()+r,c=new $i(e,t,a,s,o);return c.start(r),c}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new x(S.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function ji(n,e){if(Ke("AsyncQueue",`${e}: ${n}`),Un(n))return new x(S.UNAVAILABLE,`${e}: ${n}`);throw n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jt{constructor(e){this.comparator=e?(t,r)=>e(t,r)||L.comparator(t.key,r.key):(t,r)=>L.comparator(t.key,r.key),this.keyedMap=wn(),this.sortedSet=new ee(this.comparator)}static emptySet(e){return new jt(e.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((t,r)=>(e(t),!1))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof jt)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),r=e.sortedSet.getIterator();for(;t.hasNext();){const s=t.getNext().key,o=r.getNext().key;if(!s.isEqual(o))return!1}return!0}toString(){const e=[];return this.forEach(t=>{e.push(t.toString())}),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const r=new jt;return r.comparator=this.comparator,r.keyedMap=e,r.sortedSet=t,r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Za{constructor(){this.W_=new ee(L.comparator)}track(e){const t=e.doc.key,r=this.W_.get(t);r?e.type!==0&&r.type===3?this.W_=this.W_.insert(t,e):e.type===3&&r.type!==1?this.W_=this.W_.insert(t,{type:r.type,doc:e.doc}):e.type===2&&r.type===2?this.W_=this.W_.insert(t,{type:2,doc:e.doc}):e.type===2&&r.type===0?this.W_=this.W_.insert(t,{type:0,doc:e.doc}):e.type===1&&r.type===0?this.W_=this.W_.remove(t):e.type===1&&r.type===2?this.W_=this.W_.insert(t,{type:1,doc:r.doc}):e.type===0&&r.type===1?this.W_=this.W_.insert(t,{type:2,doc:e.doc}):F():this.W_=this.W_.insert(t,e)}G_(){const e=[];return this.W_.inorderTraversal((t,r)=>{e.push(r)}),e}}class Qt{constructor(e,t,r,s,o,a,c,h,d){this.query=e,this.docs=t,this.oldDocs=r,this.docChanges=s,this.mutatedKeys=o,this.fromCache=a,this.syncStateChanged=c,this.excludesMetadataChanges=h,this.hasCachedResults=d}static fromInitialDocuments(e,t,r,s,o){const a=[];return t.forEach(c=>{a.push({type:0,doc:c})}),new Qt(e,t,jt.emptySet(t),a,r,s,!0,!1,o)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&Hr(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,r=e.docChanges;if(t.length!==r.length)return!1;for(let s=0;s<t.length;s++)if(t[s].type!==r[s].type||!t[s].doc.isEqual(r[s].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vg{constructor(){this.z_=void 0,this.j_=[]}H_(){return this.j_.some(e=>e.J_())}}class kg{constructor(){this.queries=el(),this.onlineState="Unknown",this.Y_=new Set}terminate(){(function(t,r){const s=U(t),o=s.queries;s.queries=el(),o.forEach((a,c)=>{for(const h of c.j_)h.onError(r)})})(this,new x(S.ABORTED,"Firestore shutting down"))}}function el(){return new en(n=>Cc(n),Hr)}async function au(n,e){const t=U(n);let r=3;const s=e.query;let o=t.queries.get(s);o?!o.H_()&&e.J_()&&(r=2):(o=new Vg,r=e.J_()?0:1);try{switch(r){case 0:o.z_=await t.onListen(s,!0);break;case 1:o.z_=await t.onListen(s,!1);break;case 2:await t.onFirstRemoteStoreListen(s)}}catch(a){const c=ji(a,`Initialization of query '${Bt(e.query)}' failed`);return void e.onError(c)}t.queries.set(s,o),o.j_.push(e),e.Z_(t.onlineState),o.z_&&e.X_(o.z_)&&qi(t)}async function lu(n,e){const t=U(n),r=e.query;let s=3;const o=t.queries.get(r);if(o){const a=o.j_.indexOf(e);a>=0&&(o.j_.splice(a,1),o.j_.length===0?s=e.J_()?0:1:!o.H_()&&e.J_()&&(s=2))}switch(s){case 0:return t.queries.delete(r),t.onUnlisten(r,!0);case 1:return t.queries.delete(r),t.onUnlisten(r,!1);case 2:return t.onLastRemoteStoreUnlisten(r);default:return}}function Ng(n,e){const t=U(n);let r=!1;for(const s of e){const o=s.query,a=t.queries.get(o);if(a){for(const c of a.j_)c.X_(s)&&(r=!0);a.z_=s}}r&&qi(t)}function Og(n,e,t){const r=U(n),s=r.queries.get(e);if(s)for(const o of s.j_)o.onError(t);r.queries.delete(e)}function qi(n){n.Y_.forEach(e=>{e.next()})}var oi,tl;(tl=oi||(oi={})).ea="default",tl.Cache="cache";class cu{constructor(e,t,r){this.query=e,this.ta=t,this.na=!1,this.ra=null,this.onlineState="Unknown",this.options=r||{}}X_(e){if(!this.options.includeMetadataChanges){const r=[];for(const s of e.docChanges)s.type!==3&&r.push(s);e=new Qt(e.query,e.docs,e.oldDocs,r,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.na?this.ia(e)&&(this.ta.next(e),t=!0):this.sa(e,this.onlineState)&&(this.oa(e),t=!0),this.ra=e,t}onError(e){this.ta.error(e)}Z_(e){this.onlineState=e;let t=!1;return this.ra&&!this.na&&this.sa(this.ra,e)&&(this.oa(this.ra),t=!0),t}sa(e,t){if(!e.fromCache||!this.J_())return!0;const r=t!=="Offline";return(!this.options._a||!r)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}ia(e){if(e.docChanges.length>0)return!0;const t=this.ra&&this.ra.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}oa(e){e=Qt.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.na=!0,this.ta.next(e)}J_(){return this.options.source!==oi.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uu{constructor(e){this.key=e}}class hu{constructor(e){this.key=e}}class xg{constructor(e,t){this.query=e,this.Ta=t,this.Ea=null,this.hasCachedResults=!1,this.current=!1,this.da=q(),this.mutatedKeys=q(),this.Aa=Dc(e),this.Ra=new jt(this.Aa)}get Va(){return this.Ta}ma(e,t){const r=t?t.fa:new Za,s=t?t.Ra:this.Ra;let o=t?t.mutatedKeys:this.mutatedKeys,a=s,c=!1;const h=this.query.limitType==="F"&&s.size===this.query.limit?s.last():null,d=this.query.limitType==="L"&&s.size===this.query.limit?s.first():null;if(e.inorderTraversal((m,_)=>{const A=s.get(m),R=Gr(this.query,_)?_:null,V=!!A&&this.mutatedKeys.has(A.key),k=!!R&&(R.hasLocalMutations||this.mutatedKeys.has(R.key)&&R.hasCommittedMutations);let C=!1;A&&R?A.data.isEqual(R.data)?V!==k&&(r.track({type:3,doc:R}),C=!0):this.ga(A,R)||(r.track({type:2,doc:R}),C=!0,(h&&this.Aa(R,h)>0||d&&this.Aa(R,d)<0)&&(c=!0)):!A&&R?(r.track({type:0,doc:R}),C=!0):A&&!R&&(r.track({type:1,doc:A}),C=!0,(h||d)&&(c=!0)),C&&(R?(a=a.add(R),o=k?o.add(m):o.delete(m)):(a=a.delete(m),o=o.delete(m)))}),this.query.limit!==null)for(;a.size>this.query.limit;){const m=this.query.limitType==="F"?a.last():a.first();a=a.delete(m.key),o=o.delete(m.key),r.track({type:1,doc:m})}return{Ra:a,fa:r,ns:c,mutatedKeys:o}}ga(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,r,s){const o=this.Ra;this.Ra=e.Ra,this.mutatedKeys=e.mutatedKeys;const a=e.fa.G_();a.sort((m,_)=>function(R,V){const k=C=>{switch(C){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return F()}};return k(R)-k(V)}(m.type,_.type)||this.Aa(m.doc,_.doc)),this.pa(r),s=s!=null&&s;const c=t&&!s?this.ya():[],h=this.da.size===0&&this.current&&!s?1:0,d=h!==this.Ea;return this.Ea=h,a.length!==0||d?{snapshot:new Qt(this.query,e.Ra,o,a,e.mutatedKeys,h===0,d,!1,!!r&&r.resumeToken.approximateByteSize()>0),wa:c}:{wa:c}}Z_(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({Ra:this.Ra,fa:new Za,mutatedKeys:this.mutatedKeys,ns:!1},!1)):{wa:[]}}Sa(e){return!this.Ta.has(e)&&!!this.Ra.has(e)&&!this.Ra.get(e).hasLocalMutations}pa(e){e&&(e.addedDocuments.forEach(t=>this.Ta=this.Ta.add(t)),e.modifiedDocuments.forEach(t=>{}),e.removedDocuments.forEach(t=>this.Ta=this.Ta.delete(t)),this.current=e.current)}ya(){if(!this.current)return[];const e=this.da;this.da=q(),this.Ra.forEach(r=>{this.Sa(r.key)&&(this.da=this.da.add(r.key))});const t=[];return e.forEach(r=>{this.da.has(r)||t.push(new hu(r))}),this.da.forEach(r=>{e.has(r)||t.push(new uu(r))}),t}ba(e){this.Ta=e.Ts,this.da=q();const t=this.ma(e.documents);return this.applyChanges(t,!0)}Da(){return Qt.fromInitialDocuments(this.query,this.Ra,this.mutatedKeys,this.Ea===0,this.hasCachedResults)}}class Lg{constructor(e,t,r){this.query=e,this.targetId=t,this.view=r}}class Mg{constructor(e){this.key=e,this.va=!1}}class Fg{constructor(e,t,r,s,o,a){this.localStore=e,this.remoteStore=t,this.eventManager=r,this.sharedClientState=s,this.currentUser=o,this.maxConcurrentLimboResolutions=a,this.Ca={},this.Fa=new en(c=>Cc(c),Hr),this.Ma=new Map,this.xa=new Set,this.Oa=new ee(L.comparator),this.Na=new Map,this.La=new Oi,this.Ba={},this.ka=new Map,this.qa=Wt.kn(),this.onlineState="Unknown",this.Qa=void 0}get isPrimaryClient(){return this.Qa===!0}}async function Bg(n,e,t=!0){const r=yu(n);let s;const o=r.Fa.get(e);return o?(r.sharedClientState.addLocalQueryTarget(o.targetId),s=o.view.Da()):s=await du(r,e,t,!0),s}async function Ug(n,e){const t=yu(n);await du(t,e,!0,!1)}async function du(n,e,t,r){const s=await lg(n.localStore,xe(e)),o=s.targetId,a=n.sharedClientState.addLocalQueryTarget(o,t);let c;return r&&(c=await $g(n,e,o,a==="current",s.resumeToken)),n.isPrimaryClient&&t&&tu(n.remoteStore,s),c}async function $g(n,e,t,r,s){n.Ka=(_,A,R)=>async function(k,C,$,j){let N=C.view.ma($);N.ns&&(N=await Qa(k.localStore,C.query,!1).then(({documents:E})=>C.view.ma(E,N)));const M=j&&j.targetChanges.get(C.targetId),J=j&&j.targetMismatches.get(C.targetId)!=null,Q=C.view.applyChanges(N,k.isPrimaryClient,M,J);return rl(k,C.targetId,Q.wa),Q.snapshot}(n,_,A,R);const o=await Qa(n.localStore,e,!0),a=new xg(e,o.Ts),c=a.ma(o.documents),h=jn.createSynthesizedTargetChangeForCurrentChange(t,r&&n.onlineState!=="Offline",s),d=a.applyChanges(c,n.isPrimaryClient,h);rl(n,t,d.wa);const m=new Lg(e,t,a);return n.Fa.set(e,m),n.Ma.has(t)?n.Ma.get(t).push(e):n.Ma.set(t,[e]),d.snapshot}async function jg(n,e,t){const r=U(n),s=r.Fa.get(e),o=r.Ma.get(s.targetId);if(o.length>1)return r.Ma.set(s.targetId,o.filter(a=>!Hr(a,e))),void r.Fa.delete(e);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(s.targetId),r.sharedClientState.isActiveQueryTarget(s.targetId)||await ii(r.localStore,s.targetId,!1).then(()=>{r.sharedClientState.clearQueryState(s.targetId),t&&Mi(r.remoteStore,s.targetId),ai(r,s.targetId)}).catch(Bn)):(ai(r,s.targetId),await ii(r.localStore,s.targetId,!0))}async function qg(n,e){const t=U(n),r=t.Fa.get(e),s=t.Ma.get(r.targetId);t.isPrimaryClient&&s.length===1&&(t.sharedClientState.removeLocalQueryTarget(r.targetId),Mi(t.remoteStore,r.targetId))}async function zg(n,e,t){const r=Xg(n);try{const s=await function(a,c){const h=U(a),d=ie.now(),m=c.reduce((R,V)=>R.add(V.key),q());let _,A;return h.persistence.runTransaction("Locally write mutations","readwrite",R=>{let V=We(),k=q();return h.cs.getEntries(R,m).next(C=>{V=C,V.forEach(($,j)=>{j.isValidDocument()||(k=k.add($))})}).next(()=>h.localDocuments.getOverlayedDocuments(R,V)).next(C=>{_=C;const $=[];for(const j of c){const N=dp(j,_.get(j.key).overlayedDocument);N!=null&&$.push(new ht(j.key,N,Tc(N.value.mapValue),De.exists(!0)))}return h.mutationQueue.addMutationBatch(R,d,$,c)}).next(C=>{A=C;const $=C.applyToLocalDocumentSet(_,k);return h.documentOverlayCache.saveOverlays(R,C.batchId,$)})}).then(()=>({batchId:A.batchId,changes:kc(_)}))}(r.localStore,e);r.sharedClientState.addPendingMutation(s.batchId),function(a,c,h){let d=a.Ba[a.currentUser.toKey()];d||(d=new ee(K)),d=d.insert(c,h),a.Ba[a.currentUser.toKey()]=d}(r,s.batchId,t),await zn(r,s.changes),await Jr(r.remoteStore)}catch(s){const o=ji(s,"Failed to persist write");t.reject(o)}}async function fu(n,e){const t=U(n);try{const r=await ig(t.localStore,e);e.targetChanges.forEach((s,o)=>{const a=t.Na.get(o);a&&(W(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1),s.addedDocuments.size>0?a.va=!0:s.modifiedDocuments.size>0?W(a.va):s.removedDocuments.size>0&&(W(a.va),a.va=!1))}),await zn(t,r,e)}catch(r){await Bn(r)}}function nl(n,e,t){const r=U(n);if(r.isPrimaryClient&&t===0||!r.isPrimaryClient&&t===1){const s=[];r.Fa.forEach((o,a)=>{const c=a.view.Z_(e);c.snapshot&&s.push(c.snapshot)}),function(a,c){const h=U(a);h.onlineState=c;let d=!1;h.queries.forEach((m,_)=>{for(const A of _.j_)A.Z_(c)&&(d=!0)}),d&&qi(h)}(r.eventManager,e),s.length&&r.Ca.d_(s),r.onlineState=e,r.isPrimaryClient&&r.sharedClientState.setOnlineState(e)}}async function Hg(n,e,t){const r=U(n);r.sharedClientState.updateQueryState(e,"rejected",t);const s=r.Na.get(e),o=s&&s.key;if(o){let a=new ee(L.comparator);a=a.insert(o,_e.newNoDocument(o,B.min()));const c=q().add(o),h=new Qr(B.min(),new Map,new ee(K),a,c);await fu(r,h),r.Oa=r.Oa.remove(o),r.Na.delete(e),zi(r)}else await ii(r.localStore,e,!1).then(()=>ai(r,e,t)).catch(Bn)}async function Gg(n,e){const t=U(n),r=e.batch.batchId;try{const s=await sg(t.localStore,e);pu(t,r,null),mu(t,r),t.sharedClientState.updateMutationState(r,"acknowledged"),await zn(t,s)}catch(s){await Bn(s)}}async function Kg(n,e,t){const r=U(n);try{const s=await function(a,c){const h=U(a);return h.persistence.runTransaction("Reject batch","readwrite-primary",d=>{let m;return h.mutationQueue.lookupMutationBatch(d,c).next(_=>(W(_!==null),m=_.keys(),h.mutationQueue.removeMutationBatch(d,_))).next(()=>h.mutationQueue.performConsistencyCheck(d)).next(()=>h.documentOverlayCache.removeOverlaysForBatchId(d,m,c)).next(()=>h.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(d,m)).next(()=>h.localDocuments.getDocuments(d,m))})}(r.localStore,e);pu(r,e,t),mu(r,e),r.sharedClientState.updateMutationState(e,"rejected",t),await zn(r,s)}catch(s){await Bn(s)}}function mu(n,e){(n.ka.get(e)||[]).forEach(t=>{t.resolve()}),n.ka.delete(e)}function pu(n,e,t){const r=U(n);let s=r.Ba[r.currentUser.toKey()];if(s){const o=s.get(e);o&&(t?o.reject(t):o.resolve(),s=s.remove(e)),r.Ba[r.currentUser.toKey()]=s}}function ai(n,e,t=null){n.sharedClientState.removeLocalQueryTarget(e);for(const r of n.Ma.get(e))n.Fa.delete(r),t&&n.Ca.$a(r,t);n.Ma.delete(e),n.isPrimaryClient&&n.La.gr(e).forEach(r=>{n.La.containsKey(r)||gu(n,r)})}function gu(n,e){n.xa.delete(e.path.canonicalString());const t=n.Oa.get(e);t!==null&&(Mi(n.remoteStore,t),n.Oa=n.Oa.remove(e),n.Na.delete(t),zi(n))}function rl(n,e,t){for(const r of t)r instanceof uu?(n.La.addReference(r.key,e),Wg(n,r)):r instanceof hu?(O("SyncEngine","Document no longer in limbo: "+r.key),n.La.removeReference(r.key,e),n.La.containsKey(r.key)||gu(n,r.key)):F()}function Wg(n,e){const t=e.key,r=t.path.canonicalString();n.Oa.get(t)||n.xa.has(r)||(O("SyncEngine","New document in limbo: "+t),n.xa.add(r),zi(n))}function zi(n){for(;n.xa.size>0&&n.Oa.size<n.maxConcurrentLimboResolutions;){const e=n.xa.values().next().value;n.xa.delete(e);const t=new L(Z.fromString(e)),r=n.qa.next();n.Na.set(r,new Mg(t)),n.Oa=n.Oa.insert(t,r),tu(n.remoteStore,new et(xe(Si(t.path)),r,"TargetPurposeLimboResolution",Ti.oe))}}async function zn(n,e,t){const r=U(n),s=[],o=[],a=[];r.Fa.isEmpty()||(r.Fa.forEach((c,h)=>{a.push(r.Ka(h,e,t).then(d=>{var m;if((d||t)&&r.isPrimaryClient){const _=d?!d.fromCache:(m=t==null?void 0:t.targetChanges.get(h.targetId))===null||m===void 0?void 0:m.current;r.sharedClientState.updateQueryState(h.targetId,_?"current":"not-current")}if(d){s.push(d);const _=Li.Wi(h.targetId,d);o.push(_)}}))}),await Promise.all(a),r.Ca.d_(s),await async function(h,d){const m=U(h);try{await m.persistence.runTransaction("notifyLocalViewChanges","readwrite",_=>P.forEach(d,A=>P.forEach(A.$i,R=>m.persistence.referenceDelegate.addReference(_,A.targetId,R)).next(()=>P.forEach(A.Ui,R=>m.persistence.referenceDelegate.removeReference(_,A.targetId,R)))))}catch(_){if(!Un(_))throw _;O("LocalStore","Failed to update sequence numbers: "+_)}for(const _ of d){const A=_.targetId;if(!_.fromCache){const R=m.os.get(A),V=R.snapshotVersion,k=R.withLastLimboFreeSnapshotVersion(V);m.os=m.os.insert(A,k)}}}(r.localStore,o))}async function Qg(n,e){const t=U(n);if(!t.currentUser.isEqual(e)){O("SyncEngine","User change. New user:",e.toKey());const r=await Xc(t.localStore,e);t.currentUser=e,function(o,a){o.ka.forEach(c=>{c.forEach(h=>{h.reject(new x(S.CANCELLED,a))})}),o.ka.clear()}(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,r.removedBatchIds,r.addedBatchIds),await zn(t,r.hs)}}function Yg(n,e){const t=U(n),r=t.Na.get(e);if(r&&r.va)return q().add(r.key);{let s=q();const o=t.Ma.get(e);if(!o)return s;for(const a of o){const c=t.Fa.get(a);s=s.unionWith(c.view.Va)}return s}}function yu(n){const e=U(n);return e.remoteStore.remoteSyncer.applyRemoteEvent=fu.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=Yg.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=Hg.bind(null,e),e.Ca.d_=Ng.bind(null,e.eventManager),e.Ca.$a=Og.bind(null,e.eventManager),e}function Xg(n){const e=U(n);return e.remoteStore.remoteSyncer.applySuccessfulWrite=Gg.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=Kg.bind(null,e),e}class Or{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=Yr(e.databaseInfo.databaseId),this.sharedClientState=this.Wa(e),this.persistence=this.Ga(e),await this.persistence.start(),this.localStore=this.za(e),this.gcScheduler=this.ja(e,this.localStore),this.indexBackfillerScheduler=this.Ha(e,this.localStore)}ja(e,t){return null}Ha(e,t){return null}za(e){return rg(this.persistence,new tg,e.initialUser,this.serializer)}Ga(e){return new Jp(xi.Zr,this.serializer)}Wa(e){return new ug}async terminate(){var e,t;(e=this.gcScheduler)===null||e===void 0||e.stop(),(t=this.indexBackfillerScheduler)===null||t===void 0||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Or.provider={build:()=>new Or};class li{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>nl(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=Qg.bind(null,this.syncEngine),await Dg(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new kg}()}createDatastore(e){const t=Yr(e.databaseInfo.databaseId),r=function(o){return new mg(o)}(e.databaseInfo);return function(o,a,c,h){return new yg(o,a,c,h)}(e.authCredentials,e.appCheckCredentials,r,t)}createRemoteStore(e){return function(r,s,o,a,c){return new vg(r,s,o,a,c)}(this.localStore,this.datastore,e.asyncQueue,t=>nl(this.syncEngine,t,0),function(){return Xa.D()?new Xa:new hg}())}createSyncEngine(e,t){return function(s,o,a,c,h,d,m){const _=new Fg(s,o,a,c,h,d);return m&&(_.Qa=!0),_}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await async function(s){const o=U(s);O("RemoteStore","RemoteStore shutting down."),o.L_.add(5),await qn(o),o.k_.shutdown(),o.q_.set("Unknown")}(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(t=this.eventManager)===null||t===void 0||t.terminate()}}li.provider={build:()=>new li};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _u{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ya(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ya(this.observer.error,e):Ke("Uncaught Error in snapshot listener:",e.toString()))}Za(){this.muted=!0}Ya(e,t){setTimeout(()=>{this.muted||e(t)},0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jg{constructor(e,t,r,s,o){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=r,this.databaseInfo=s,this.user=ye.UNAUTHENTICATED,this.clientId=vc.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=o,this.authCredentials.start(r,async a=>{O("FirestoreClient","Received user=",a.uid),await this.authCredentialListener(a),this.user=a}),this.appCheckCredentials.start(r,a=>(O("FirestoreClient","Received new app check token=",a),this.appCheckCredentialListener(a,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new st;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const r=ji(t,"Failed to shutdown persistence");e.reject(r)}}),e.promise}}async function Fs(n,e){n.asyncQueue.verifyOperationInProgress(),O("FirestoreClient","Initializing OfflineComponentProvider");const t=n.configuration;await e.initialize(t);let r=t.initialUser;n.setCredentialChangeListener(async s=>{r.isEqual(s)||(await Xc(e.localStore,s),r=s)}),e.persistence.setDatabaseDeletedListener(()=>n.terminate()),n._offlineComponents=e}async function sl(n,e){n.asyncQueue.verifyOperationInProgress();const t=await Zg(n);O("FirestoreClient","Initializing OnlineComponentProvider"),await e.initialize(t,n.configuration),n.setCredentialChangeListener(r=>Ja(e.remoteStore,r)),n.setAppCheckTokenChangeListener((r,s)=>Ja(e.remoteStore,s)),n._onlineComponents=e}async function Zg(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){O("FirestoreClient","Using user provided OfflineComponentProvider");try{await Fs(n,n._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!function(s){return s.name==="FirebaseError"?s.code===S.FAILED_PRECONDITION||s.code===S.UNIMPLEMENTED:!(typeof DOMException<"u"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11}(t))throw t;zt("Error using user provided cache. Falling back to memory cache: "+t),await Fs(n,new Or)}}else O("FirestoreClient","Using default OfflineComponentProvider"),await Fs(n,new Or);return n._offlineComponents}async function vu(n){return n._onlineComponents||(n._uninitializedComponentsProvider?(O("FirestoreClient","Using user provided OnlineComponentProvider"),await sl(n,n._uninitializedComponentsProvider._online)):(O("FirestoreClient","Using default OnlineComponentProvider"),await sl(n,new li))),n._onlineComponents}function ey(n){return vu(n).then(e=>e.syncEngine)}async function ci(n){const e=await vu(n),t=e.eventManager;return t.onListen=Bg.bind(null,e.syncEngine),t.onUnlisten=jg.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=Ug.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=qg.bind(null,e.syncEngine),t}function ty(n,e,t={}){const r=new st;return n.asyncQueue.enqueueAndForget(async()=>function(o,a,c,h,d){const m=new _u({next:A=>{m.Za(),a.enqueueAndForget(()=>lu(o,_)),A.fromCache&&h.source==="server"?d.reject(new x(S.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):d.resolve(A)},error:A=>d.reject(A)}),_=new cu(c,m,{includeMetadataChanges:!0,_a:!0});return au(o,_)}(await ci(n),n.asyncQueue,e,t,r)),r.promise}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Eu(n){const e={};return n.timeoutSeconds!==void 0&&(e.timeoutSeconds=n.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const il=new Map;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Iu(n,e,t){if(!t)throw new x(S.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${e}.`)}function ny(n,e,t,r){if(e===!0&&r===!0)throw new x(S.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)}function ol(n){if(!L.isDocumentKey(n))throw new x(S.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function al(n){if(L.isDocumentKey(n))throw new x(S.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${n} has ${n.length}.`)}function Hi(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const e=function(r){return r.constructor?r.constructor.name:null}(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":F()}function Ve(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new x(S.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=Hi(n);throw new x(S.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ll{constructor(e){var t,r;if(e.host===void 0){if(e.ssl!==void 0)throw new x(S.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=(t=e.ssl)===null||t===void 0||t;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new x(S.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}ny("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Eu((r=e.experimentalLongPollingOptions)!==null&&r!==void 0?r:{}),function(o){if(o.timeoutSeconds!==void 0){if(isNaN(o.timeoutSeconds))throw new x(S.INVALID_ARGUMENT,`invalid long polling timeout: ${o.timeoutSeconds} (must not be NaN)`);if(o.timeoutSeconds<5)throw new x(S.INVALID_ARGUMENT,`invalid long polling timeout: ${o.timeoutSeconds} (minimum allowed value is 5)`);if(o.timeoutSeconds>30)throw new x(S.INVALID_ARGUMENT,`invalid long polling timeout: ${o.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(r,s){return r.timeoutSeconds===s.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class Zr{constructor(e,t,r,s){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=r,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new ll({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new x(S.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new x(S.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new ll(e),e.credentials!==void 0&&(this._authCredentials=function(r){if(!r)return new Em;switch(r.type){case"firstParty":return new Am(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new x(S.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(t){const r=il.get(t);r&&(O("ComponentProvider","Removing Datastore"),il.delete(t),r.terminate())}(this),Promise.resolve()}}function ry(n,e,t,r={}){var s;const o=(n=Ve(n,Zr))._getSettings(),a=`${e}:${t}`;if(o.host!=="firestore.googleapis.com"&&o.host!==a&&zt("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),n._setSettings(Object.assign(Object.assign({},o),{host:a,ssl:!1})),r.mockUserToken){let c,h;if(typeof r.mockUserToken=="string")c=r.mockUserToken,h=ye.MOCK_USER;else{c=Ol(r.mockUserToken,(s=n._app)===null||s===void 0?void 0:s.options.projectId);const d=r.mockUserToken.sub||r.mockUserToken.user_id;if(!d)throw new x(S.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");h=new ye(d)}n._authCredentials=new Im(new _c(c,h))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hn{constructor(e,t,r){this.converter=t,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new Hn(this.firestore,e,this._query)}}class Ae{constructor(e,t,r){this.converter=t,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new it(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new Ae(this.firestore,e,this._key)}}class it extends Hn{constructor(e,t,r){super(e,t,Si(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new Ae(this.firestore,null,new L(e))}withConverter(e){return new it(this.firestore,e,this._path)}}function tt(n,e,...t){if(n=ke(n),Iu("collection","path",e),n instanceof Zr){const r=Z.fromString(e,...t);return al(r),new it(n,null,r)}{if(!(n instanceof Ae||n instanceof it))throw new x(S.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(Z.fromString(e,...t));return al(r),new it(n.firestore,null,r)}}function dt(n,e,...t){if(n=ke(n),arguments.length===1&&(e=vc.newId()),Iu("doc","path",e),n instanceof Zr){const r=Z.fromString(e,...t);return ol(r),new Ae(n,null,new L(r))}{if(!(n instanceof Ae||n instanceof it))throw new x(S.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(Z.fromString(e,...t));return ol(r),new Ae(n.firestore,n instanceof it?n.converter:null,new L(r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cl{constructor(e=Promise.resolve()){this.Pu=[],this.Iu=!1,this.Tu=[],this.Eu=null,this.du=!1,this.Au=!1,this.Ru=[],this.t_=new Zc(this,"async_queue_retry"),this.Vu=()=>{const r=Ms();r&&O("AsyncQueue","Visibility state changed to "+r.visibilityState),this.t_.jo()},this.mu=e;const t=Ms();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.Vu)}get isShuttingDown(){return this.Iu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.fu(),this.gu(e)}enterRestrictedMode(e){if(!this.Iu){this.Iu=!0,this.Au=e||!1;const t=Ms();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.Vu)}}enqueue(e){if(this.fu(),this.Iu)return new Promise(()=>{});const t=new st;return this.gu(()=>this.Iu&&this.Au?Promise.resolve():(e().then(t.resolve,t.reject),t.promise)).then(()=>t.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Pu.push(e),this.pu()))}async pu(){if(this.Pu.length!==0){try{await this.Pu[0](),this.Pu.shift(),this.t_.reset()}catch(e){if(!Un(e))throw e;O("AsyncQueue","Operation failed with retryable error: "+e)}this.Pu.length>0&&this.t_.Go(()=>this.pu())}}gu(e){const t=this.mu.then(()=>(this.du=!0,e().catch(r=>{this.Eu=r,this.du=!1;const s=function(a){let c=a.message||"";return a.stack&&(c=a.stack.includes(a.message)?a.stack:a.message+`
`+a.stack),c}(r);throw Ke("INTERNAL UNHANDLED ERROR: ",s),r}).then(r=>(this.du=!1,r))));return this.mu=t,t}enqueueAfterDelay(e,t,r){this.fu(),this.Ru.indexOf(e)>-1&&(t=0);const s=$i.createAndSchedule(this,e,t,r,o=>this.yu(o));return this.Tu.push(s),s}fu(){this.Eu&&F()}verifyOperationInProgress(){}async wu(){let e;do e=this.mu,await e;while(e!==this.mu)}Su(e){for(const t of this.Tu)if(t.timerId===e)return!0;return!1}bu(e){return this.wu().then(()=>{this.Tu.sort((t,r)=>t.targetTimeMs-r.targetTimeMs);for(const t of this.Tu)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.wu()})}Du(e){this.Ru.push(e)}yu(e){const t=this.Tu.indexOf(e);this.Tu.splice(t,1)}}function ul(n){return function(t,r){if(typeof t!="object"||t===null)return!1;const s=t;for(const o of r)if(o in s&&typeof s[o]=="function")return!0;return!1}(n,["next","error","complete"])}class ut extends Zr{constructor(e,t,r,s){super(e,t,r,s),this.type="firestore",this._queue=new cl,this._persistenceKey=(s==null?void 0:s.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new cl(e),this._firestoreClient=void 0,await e}}}function sy(n,e){const t=typeof n=="object"?n:pi(),r=typeof n=="string"?n:"(default)",s=Jt(t,"firestore").getImmediate({identifier:r});if(!s._initialized){const o=kl("firestore");o&&ry(s,...o)}return s}function Gi(n){if(n._terminated)throw new x(S.FAILED_PRECONDITION,"The client has already been terminated.");return n._firestoreClient||iy(n),n._firestoreClient}function iy(n){var e,t,r;const s=n._freezeSettings(),o=function(c,h,d,m){return new Mm(c,h,d,m.host,m.ssl,m.experimentalForceLongPolling,m.experimentalAutoDetectLongPolling,Eu(m.experimentalLongPollingOptions),m.useFetchStreams)}(n._databaseId,((e=n._app)===null||e===void 0?void 0:e.options.appId)||"",n._persistenceKey,s);n._componentsProvider||!((t=s.localCache)===null||t===void 0)&&t._offlineComponentProvider&&(!((r=s.localCache)===null||r===void 0)&&r._onlineComponentProvider)&&(n._componentsProvider={_offline:s.localCache._offlineComponentProvider,_online:s.localCache._onlineComponentProvider}),n._firestoreClient=new Jg(n._authCredentials,n._appCheckCredentials,n._queue,o,n._componentsProvider&&function(c){const h=c==null?void 0:c._online.build();return{_offline:c==null?void 0:c._offline.build(h),_online:h}}(n._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yt{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Yt(he.fromBase64String(e))}catch(t){throw new x(S.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new Yt(he.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class es{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new x(S.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new ce(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ki{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wi{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new x(S.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new x(S.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return K(this._lat,e._lat)||K(this._long,e._long)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qi{constructor(e){this._values=(e||[]).map(t=>t)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(r,s){if(r.length!==s.length)return!1;for(let o=0;o<r.length;++o)if(r[o]!==s[o])return!1;return!0}(this._values,e._values)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const oy=/^__.*__$/;class ay{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return this.fieldMask!==null?new ht(e,this.data,this.fieldMask,t,this.fieldTransforms):new $n(e,this.data,t,this.fieldTransforms)}}class Tu{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return new ht(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function wu(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw F()}}class Yi{constructor(e,t,r,s,o,a){this.settings=e,this.databaseId=t,this.serializer=r,this.ignoreUndefinedProperties=s,o===void 0&&this.vu(),this.fieldTransforms=o||[],this.fieldMask=a||[]}get path(){return this.settings.path}get Cu(){return this.settings.Cu}Fu(e){return new Yi(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Mu(e){var t;const r=(t=this.path)===null||t===void 0?void 0:t.child(e),s=this.Fu({path:r,xu:!1});return s.Ou(e),s}Nu(e){var t;const r=(t=this.path)===null||t===void 0?void 0:t.child(e),s=this.Fu({path:r,xu:!1});return s.vu(),s}Lu(e){return this.Fu({path:void 0,xu:!0})}Bu(e){return xr(e,this.settings.methodName,this.settings.ku||!1,this.path,this.settings.qu)}contains(e){return this.fieldMask.find(t=>e.isPrefixOf(t))!==void 0||this.fieldTransforms.find(t=>e.isPrefixOf(t.field))!==void 0}vu(){if(this.path)for(let e=0;e<this.path.length;e++)this.Ou(this.path.get(e))}Ou(e){if(e.length===0)throw this.Bu("Document fields must not be empty");if(wu(this.Cu)&&oy.test(e))throw this.Bu('Document fields cannot begin and end with "__"')}}class ly{constructor(e,t,r){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=r||Yr(e)}Qu(e,t,r,s=!1){return new Yi({Cu:e,methodName:t,qu:r,path:ce.emptyPath(),xu:!1,ku:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Xi(n){const e=n._freezeSettings(),t=Yr(n._databaseId);return new ly(n._databaseId,!!e.ignoreUndefinedProperties,t)}function Au(n,e,t,r,s,o={}){const a=n.Qu(o.merge||o.mergeFields?2:0,e,t,s);Ji("Data must be an object, but it was:",a,r);const c=bu(r,a);let h,d;if(o.merge)h=new Re(a.fieldMask),d=a.fieldTransforms;else if(o.mergeFields){const m=[];for(const _ of o.mergeFields){const A=ui(e,_,t);if(!a.contains(A))throw new x(S.INVALID_ARGUMENT,`Field '${A}' is specified in your field mask but missing from your input data.`);Pu(m,A)||m.push(A)}h=new Re(m),d=a.fieldTransforms.filter(_=>h.covers(_.field))}else h=null,d=a.fieldTransforms;return new ay(new Te(c),h,d)}class ts extends Ki{_toFieldTransform(e){if(e.Cu!==2)throw e.Cu===1?e.Bu(`${this._methodName}() can only appear at the top level of your update data`):e.Bu(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof ts}}function cy(n,e,t,r){const s=n.Qu(1,e,t);Ji("Data must be an object, but it was:",s,r);const o=[],a=Te.empty();Nt(r,(h,d)=>{const m=Zi(e,h,t);d=ke(d);const _=s.Nu(m);if(d instanceof ts)o.push(m);else{const A=ns(d,_);A!=null&&(o.push(m),a.set(m,A))}});const c=new Re(o);return new Tu(a,c,s.fieldTransforms)}function uy(n,e,t,r,s,o){const a=n.Qu(1,e,t),c=[ui(e,r,t)],h=[s];if(o.length%2!=0)throw new x(S.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let A=0;A<o.length;A+=2)c.push(ui(e,o[A])),h.push(o[A+1]);const d=[],m=Te.empty();for(let A=c.length-1;A>=0;--A)if(!Pu(d,c[A])){const R=c[A];let V=h[A];V=ke(V);const k=a.Nu(R);if(V instanceof ts)d.push(R);else{const C=ns(V,k);C!=null&&(d.push(R),m.set(R,C))}}const _=new Re(d);return new Tu(m,_,a.fieldTransforms)}function ns(n,e){if(Ru(n=ke(n)))return Ji("Unsupported field value:",e,n),bu(n,e);if(n instanceof Ki)return function(r,s){if(!wu(s.Cu))throw s.Bu(`${r._methodName}() can only be used with update() and set()`);if(!s.path)throw s.Bu(`${r._methodName}() is not currently supported inside arrays`);const o=r._toFieldTransform(s);o&&s.fieldTransforms.push(o)}(n,e),null;if(n===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),n instanceof Array){if(e.settings.xu&&e.Cu!==4)throw e.Bu("Nested arrays are not supported");return function(r,s){const o=[];let a=0;for(const c of r){let h=ns(c,s.Lu(a));h==null&&(h={nullValue:"NULL_VALUE"}),o.push(h),a++}return{arrayValue:{values:o}}}(n,e)}return function(r,s){if((r=ke(r))===null)return{nullValue:"NULL_VALUE"};if(typeof r=="number")return op(s.serializer,r);if(typeof r=="boolean")return{booleanValue:r};if(typeof r=="string")return{stringValue:r};if(r instanceof Date){const o=ie.fromDate(r);return{timestampValue:kr(s.serializer,o)}}if(r instanceof ie){const o=new ie(r.seconds,1e3*Math.floor(r.nanoseconds/1e3));return{timestampValue:kr(s.serializer,o)}}if(r instanceof Wi)return{geoPointValue:{latitude:r.latitude,longitude:r.longitude}};if(r instanceof Yt)return{bytesValue:zc(s.serializer,r._byteString)};if(r instanceof Ae){const o=s.databaseId,a=r.firestore._databaseId;if(!a.isEqual(o))throw s.Bu(`Document reference is for database ${a.projectId}/${a.database} but should be for database ${o.projectId}/${o.database}`);return{referenceValue:Ni(r.firestore._databaseId||s.databaseId,r._key.path)}}if(r instanceof Qi)return function(a,c){return{mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{values:a.toArray().map(h=>{if(typeof h!="number")throw c.Bu("VectorValues must only contain numeric values.");return Ci(c.serializer,h)})}}}}}}(r,s);throw s.Bu(`Unsupported field value: ${Hi(r)}`)}(n,e)}function bu(n,e){const t={};return Ec(n)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):Nt(n,(r,s)=>{const o=ns(s,e.Mu(r));o!=null&&(t[r]=o)}),{mapValue:{fields:t}}}function Ru(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof ie||n instanceof Wi||n instanceof Yt||n instanceof Ae||n instanceof Ki||n instanceof Qi)}function Ji(n,e,t){if(!Ru(t)||!function(s){return typeof s=="object"&&s!==null&&(Object.getPrototypeOf(s)===Object.prototype||Object.getPrototypeOf(s)===null)}(t)){const r=Hi(t);throw r==="an object"?e.Bu(n+" a custom object"):e.Bu(n+" "+r)}}function ui(n,e,t){if((e=ke(e))instanceof es)return e._internalPath;if(typeof e=="string")return Zi(n,e);throw xr("Field path arguments must be of type string or ",n,!1,void 0,t)}const hy=new RegExp("[~\\*/\\[\\]]");function Zi(n,e,t){if(e.search(hy)>=0)throw xr(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,t);try{return new es(...e.split("."))._internalPath}catch{throw xr(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,t)}}function xr(n,e,t,r,s){const o=r&&!r.isEmpty(),a=s!==void 0;let c=`Function ${e}() called with invalid data`;t&&(c+=" (via `toFirestore()`)"),c+=". ";let h="";return(o||a)&&(h+=" (found",o&&(h+=` in field ${r}`),a&&(h+=` in document ${s}`),h+=")"),new x(S.INVALID_ARGUMENT,c+n+h)}function Pu(n,e){return n.some(t=>t.isEqual(e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Su{constructor(e,t,r,s,o){this._firestore=e,this._userDataWriter=t,this._key=r,this._document=s,this._converter=o}get id(){return this._key.path.lastSegment()}get ref(){return new Ae(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new dy(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(Cu("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class dy extends Su{data(){return super.data()}}function Cu(n,e){return typeof e=="string"?Zi(n,e):e instanceof es?e._internalPath:e._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Du(n){if(n.limitType==="L"&&n.explicitOrderBy.length===0)throw new x(S.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class fy{convertValue(e,t="none"){switch(Dt(e)){case 0:return null;case 1:return e.booleanValue;case 2:return ne(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(Ct(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw F()}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const r={};return Nt(e,(s,o)=>{r[s]=this.convertValue(o,t)}),r}convertVectorValue(e){var t,r,s;const o=(s=(r=(t=e.fields)===null||t===void 0?void 0:t.value.arrayValue)===null||r===void 0?void 0:r.values)===null||s===void 0?void 0:s.map(a=>ne(a.doubleValue));return new Qi(o)}convertGeoPoint(e){return new Wi(ne(e.latitude),ne(e.longitude))}convertArray(e,t){return(e.values||[]).map(r=>this.convertValue(r,t))}convertServerTimestamp(e,t){switch(t){case"previous":const r=Ai(e);return r==null?null:this.convertValue(r,t);case"estimate":return this.convertTimestamp(Nn(e));default:return null}}convertTimestamp(e){const t=lt(e);return new ie(t.seconds,t.nanos)}convertDocumentKey(e,t){const r=Z.fromString(e);W(Yc(r));const s=new On(r.get(1),r.get(3)),o=new L(r.popFirst(5));return s.isEqual(t)||Ke(`Document ${o} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),o}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vu(n,e,t){let r;return r=n?t&&(t.merge||t.mergeFields)?n.toFirestore(e,t):n.toFirestore(e):e,r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bn{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class ku extends Su{constructor(e,t,r,s,o,a){super(e,t,r,s,a),this._firestore=e,this._firestoreImpl=e,this.metadata=o}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new Ir(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const r=this._document.data.field(Cu("DocumentSnapshot.get",e));if(r!==null)return this._userDataWriter.convertValue(r,t.serverTimestamps)}}}class Ir extends ku{data(e={}){return super.data(e)}}class Nu{constructor(e,t,r,s){this._firestore=e,this._userDataWriter=t,this._snapshot=s,this.metadata=new bn(s.hasPendingWrites,s.fromCache),this.query=r}get docs(){const e=[];return this.forEach(t=>e.push(t)),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach(r=>{e.call(t,new Ir(this._firestore,this._userDataWriter,r.key,r,new bn(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new x(S.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=function(s,o){if(s._snapshot.oldDocs.isEmpty()){let a=0;return s._snapshot.docChanges.map(c=>{const h=new Ir(s._firestore,s._userDataWriter,c.doc.key,c.doc,new bn(s._snapshot.mutatedKeys.has(c.doc.key),s._snapshot.fromCache),s.query.converter);return c.doc,{type:"added",doc:h,oldIndex:-1,newIndex:a++}})}{let a=s._snapshot.oldDocs;return s._snapshot.docChanges.filter(c=>o||c.type!==3).map(c=>{const h=new Ir(s._firestore,s._userDataWriter,c.doc.key,c.doc,new bn(s._snapshot.mutatedKeys.has(c.doc.key),s._snapshot.fromCache),s.query.converter);let d=-1,m=-1;return c.type!==0&&(d=a.indexOf(c.doc.key),a=a.delete(c.doc.key)),c.type!==1&&(a=a.add(c.doc),m=a.indexOf(c.doc.key)),{type:my(c.type),doc:h,oldIndex:d,newIndex:m}})}}(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}}function my(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return F()}}class eo extends fy{constructor(e){super(),this.firestore=e}convertBytes(e){return new Yt(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new Ae(this.firestore,null,t)}}function hl(n){n=Ve(n,Hn);const e=Ve(n.firestore,ut),t=Gi(e),r=new eo(e);return Du(n._query),ty(t,n._query).then(s=>new Nu(e,r,n,s))}function Ou(n,e,t){n=Ve(n,Ae);const r=Ve(n.firestore,ut),s=Vu(n.converter,e,t);return rs(r,[Au(Xi(r),"setDoc",n._key,s,n.converter!==null,t).toMutation(n._key,De.none())])}function to(n,e,t,...r){n=Ve(n,Ae);const s=Ve(n.firestore,ut),o=Xi(s);let a;return a=typeof(e=ke(e))=="string"||e instanceof es?uy(o,"updateDoc",n._key,e,t,r):cy(o,"updateDoc",n._key,e),rs(s,[a.toMutation(n._key,De.exists(!0))])}function py(n){return rs(Ve(n.firestore,ut),[new Di(n._key,De.none())])}function Lr(n,e){const t=Ve(n.firestore,ut),r=dt(n),s=Vu(n.converter,e);return rs(t,[Au(Xi(n.firestore),"addDoc",r._key,s,n.converter!==null,{}).toMutation(r._key,De.exists(!1))]).then(()=>r)}function no(n,...e){var t,r,s;n=ke(n);let o={includeMetadataChanges:!1,source:"default"},a=0;typeof e[a]!="object"||ul(e[a])||(o=e[a],a++);const c={includeMetadataChanges:o.includeMetadataChanges,source:o.source};if(ul(e[a])){const _=e[a];e[a]=(t=_.next)===null||t===void 0?void 0:t.bind(_),e[a+1]=(r=_.error)===null||r===void 0?void 0:r.bind(_),e[a+2]=(s=_.complete)===null||s===void 0?void 0:s.bind(_)}let h,d,m;if(n instanceof Ae)d=Ve(n.firestore,ut),m=Si(n._key.path),h={next:_=>{e[a]&&e[a](gy(d,n,_))},error:e[a+1],complete:e[a+2]};else{const _=Ve(n,Hn);d=Ve(_.firestore,ut),m=_._query;const A=new eo(d);h={next:R=>{e[a]&&e[a](new Nu(d,A,_,R))},error:e[a+1],complete:e[a+2]},Du(n._query)}return function(A,R,V,k){const C=new _u(k),$=new cu(R,C,V);return A.asyncQueue.enqueueAndForget(async()=>au(await ci(A),$)),()=>{C.Za(),A.asyncQueue.enqueueAndForget(async()=>lu(await ci(A),$))}}(Gi(d),m,c,h)}function rs(n,e){return function(r,s){const o=new st;return r.asyncQueue.enqueueAndForget(async()=>zg(await ey(r),s,o)),o.promise}(Gi(n),e)}function gy(n,e,t){const r=t.docs.get(e._key),s=new eo(n);return new ku(n,s,e._key,r,new bn(t.hasPendingWrites,t.fromCache),e.converter)}(function(e,t=!0){(function(s){Zt=s})(Ul),Ge(new Me("firestore",(r,{instanceIdentifier:s,options:o})=>{const a=r.getProvider("app").getImmediate(),c=new ut(new Tm(r.getProvider("auth-internal")),new Rm(r.getProvider("app-check-internal")),function(d,m){if(!Object.prototype.hasOwnProperty.apply(d.options,["projectId"]))throw new x(S.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new On(d.options.projectId,m)}(a,s),a);return o=Object.assign({useFetchStreams:t},o),c._setSettings(o),c},"PUBLIC").setMultipleInstances(!0)),Ce(Sa,"4.7.3",e),Ce(Sa,"4.7.3","esm2017")})();/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xu="firebasestorage.googleapis.com",yy="storageBucket",_y=2*60*1e3,vy=10*60*1e3;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $e extends Qe{constructor(e,t,r=0){super(Bs(e),`Firebase Storage: ${t} (${Bs(e)})`),this.status_=r,this.customData={serverResponse:null},this._baseMessage=this.message,Object.setPrototypeOf(this,$e.prototype)}get status(){return this.status_}set status(e){this.status_=e}_codeEquals(e){return Bs(e)===this.code}get serverResponse(){return this.customData.serverResponse}set serverResponse(e){this.customData.serverResponse=e,this.customData.serverResponse?this.message=`${this._baseMessage}
${this.customData.serverResponse}`:this.message=this._baseMessage}}var Ue;(function(n){n.UNKNOWN="unknown",n.OBJECT_NOT_FOUND="object-not-found",n.BUCKET_NOT_FOUND="bucket-not-found",n.PROJECT_NOT_FOUND="project-not-found",n.QUOTA_EXCEEDED="quota-exceeded",n.UNAUTHENTICATED="unauthenticated",n.UNAUTHORIZED="unauthorized",n.UNAUTHORIZED_APP="unauthorized-app",n.RETRY_LIMIT_EXCEEDED="retry-limit-exceeded",n.INVALID_CHECKSUM="invalid-checksum",n.CANCELED="canceled",n.INVALID_EVENT_NAME="invalid-event-name",n.INVALID_URL="invalid-url",n.INVALID_DEFAULT_BUCKET="invalid-default-bucket",n.NO_DEFAULT_BUCKET="no-default-bucket",n.CANNOT_SLICE_BLOB="cannot-slice-blob",n.SERVER_FILE_WRONG_SIZE="server-file-wrong-size",n.NO_DOWNLOAD_URL="no-download-url",n.INVALID_ARGUMENT="invalid-argument",n.INVALID_ARGUMENT_COUNT="invalid-argument-count",n.APP_DELETED="app-deleted",n.INVALID_ROOT_OPERATION="invalid-root-operation",n.INVALID_FORMAT="invalid-format",n.INTERNAL_ERROR="internal-error",n.UNSUPPORTED_ENVIRONMENT="unsupported-environment"})(Ue||(Ue={}));function Bs(n){return"storage/"+n}function Ey(){const n="An unknown error occurred, please check the error payload for server response.";return new $e(Ue.UNKNOWN,n)}function Iy(){return new $e(Ue.RETRY_LIMIT_EXCEEDED,"Max retry time for operation exceeded, please try again.")}function Ty(){return new $e(Ue.CANCELED,"User canceled the upload/download.")}function wy(n){return new $e(Ue.INVALID_URL,"Invalid URL '"+n+"'.")}function Ay(n){return new $e(Ue.INVALID_DEFAULT_BUCKET,"Invalid default bucket '"+n+"'.")}function dl(n){return new $e(Ue.INVALID_ARGUMENT,n)}function Lu(){return new $e(Ue.APP_DELETED,"The Firebase app was deleted.")}function by(n){return new $e(Ue.INVALID_ROOT_OPERATION,"The operation '"+n+"' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oe{constructor(e,t){this.bucket=e,this.path_=t}get path(){return this.path_}get isRoot(){return this.path.length===0}fullServerUrl(){const e=encodeURIComponent;return"/b/"+e(this.bucket)+"/o/"+e(this.path)}bucketOnlyServerUrl(){return"/b/"+encodeURIComponent(this.bucket)+"/o"}static makeFromBucketSpec(e,t){let r;try{r=Oe.makeFromUrl(e,t)}catch{return new Oe(e,"")}if(r.path==="")return r;throw Ay(e)}static makeFromUrl(e,t){let r=null;const s="([A-Za-z0-9.\\-_]+)";function o(M){M.path.charAt(M.path.length-1)==="/"&&(M.path_=M.path_.slice(0,-1))}const a="(/(.*))?$",c=new RegExp("^gs://"+s+a,"i"),h={bucket:1,path:3};function d(M){M.path_=decodeURIComponent(M.path)}const m="v[A-Za-z0-9_]+",_=t.replace(/[.]/g,"\\."),A="(/([^?#]*).*)?$",R=new RegExp(`^https?://${_}/${m}/b/${s}/o${A}`,"i"),V={bucket:1,path:3},k=t===xu?"(?:storage.googleapis.com|storage.cloud.google.com)":t,C="([^?#]*)",$=new RegExp(`^https?://${k}/${s}/${C}`,"i"),N=[{regex:c,indices:h,postModify:o},{regex:R,indices:V,postModify:d},{regex:$,indices:{bucket:1,path:2},postModify:d}];for(let M=0;M<N.length;M++){const J=N[M],Q=J.regex.exec(e);if(Q){const E=Q[J.indices.bucket];let p=Q[J.indices.path];p||(p=""),r=new Oe(E,p),J.postModify(r);break}}if(r==null)throw wy(e);return r}}class Ry{constructor(e){this.promise_=Promise.reject(e)}getPromise(){return this.promise_}cancel(e=!1){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Py(n,e,t){let r=1,s=null,o=null,a=!1,c=0;function h(){return c===2}let d=!1;function m(...C){d||(d=!0,e.apply(null,C))}function _(C){s=setTimeout(()=>{s=null,n(R,h())},C)}function A(){o&&clearTimeout(o)}function R(C,...$){if(d){A();return}if(C){A(),m.call(null,C,...$);return}if(h()||a){A(),m.call(null,C,...$);return}r<64&&(r*=2);let N;c===1?(c=2,N=0):N=(r+Math.random())*1e3,_(N)}let V=!1;function k(C){V||(V=!0,A(),!d&&(s!==null?(C||(c=2),clearTimeout(s),_(0)):C||(c=1)))}return _(0),o=setTimeout(()=>{a=!0,k(!0)},t),k}function Sy(n){n(!1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Cy(n){return n!==void 0}function fl(n,e,t,r){if(r<e)throw dl(`Invalid value for '${n}'. Expected ${e} or greater.`);if(r>t)throw dl(`Invalid value for '${n}'. Expected ${t} or less.`)}function Dy(n){const e=encodeURIComponent;let t="?";for(const r in n)if(n.hasOwnProperty(r)){const s=e(r)+"="+e(n[r]);t=t+s+"&"}return t=t.slice(0,-1),t}var Mr;(function(n){n[n.NO_ERROR=0]="NO_ERROR",n[n.NETWORK_ERROR=1]="NETWORK_ERROR",n[n.ABORT=2]="ABORT"})(Mr||(Mr={}));/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vy(n,e){const t=n>=500&&n<600,s=[408,429].indexOf(n)!==-1,o=e.indexOf(n)!==-1;return t||s||o}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ky{constructor(e,t,r,s,o,a,c,h,d,m,_,A=!0){this.url_=e,this.method_=t,this.headers_=r,this.body_=s,this.successCodes_=o,this.additionalRetryCodes_=a,this.callback_=c,this.errorCallback_=h,this.timeout_=d,this.progressCallback_=m,this.connectionFactory_=_,this.retry=A,this.pendingConnection_=null,this.backoffId_=null,this.canceled_=!1,this.appDelete_=!1,this.promise_=new Promise((R,V)=>{this.resolve_=R,this.reject_=V,this.start_()})}start_(){const e=(r,s)=>{if(s){r(!1,new gr(!1,null,!0));return}const o=this.connectionFactory_();this.pendingConnection_=o;const a=c=>{const h=c.loaded,d=c.lengthComputable?c.total:-1;this.progressCallback_!==null&&this.progressCallback_(h,d)};this.progressCallback_!==null&&o.addUploadProgressListener(a),o.send(this.url_,this.method_,this.body_,this.headers_).then(()=>{this.progressCallback_!==null&&o.removeUploadProgressListener(a),this.pendingConnection_=null;const c=o.getErrorCode()===Mr.NO_ERROR,h=o.getStatus();if(!c||Vy(h,this.additionalRetryCodes_)&&this.retry){const m=o.getErrorCode()===Mr.ABORT;r(!1,new gr(!1,null,m));return}const d=this.successCodes_.indexOf(h)!==-1;r(!0,new gr(d,o))})},t=(r,s)=>{const o=this.resolve_,a=this.reject_,c=s.connection;if(s.wasSuccessCode)try{const h=this.callback_(c,c.getResponse());Cy(h)?o(h):o()}catch(h){a(h)}else if(c!==null){const h=Ey();h.serverResponse=c.getErrorText(),this.errorCallback_?a(this.errorCallback_(c,h)):a(h)}else if(s.canceled){const h=this.appDelete_?Lu():Ty();a(h)}else{const h=Iy();a(h)}};this.canceled_?t(!1,new gr(!1,null,!0)):this.backoffId_=Py(e,t,this.timeout_)}getPromise(){return this.promise_}cancel(e){this.canceled_=!0,this.appDelete_=e||!1,this.backoffId_!==null&&Sy(this.backoffId_),this.pendingConnection_!==null&&this.pendingConnection_.abort()}}class gr{constructor(e,t,r){this.wasSuccessCode=e,this.connection=t,this.canceled=!!r}}function Ny(n,e){e!==null&&e.length>0&&(n.Authorization="Firebase "+e)}function Oy(n,e){n["X-Firebase-Storage-Version"]="webjs/"+(e??"AppManager")}function xy(n,e){e&&(n["X-Firebase-GMPID"]=e)}function Ly(n,e){e!==null&&(n["X-Firebase-AppCheck"]=e)}function My(n,e,t,r,s,o,a=!0){const c=Dy(n.urlParams),h=n.url+c,d=Object.assign({},n.headers);return xy(d,e),Ny(d,t),Oy(d,o),Ly(d,r),new ky(h,n.method,d,n.body,n.successCodes,n.additionalRetryCodes,n.handler,n.errorHandler,n.timeout,n.progressCallback,s,a)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fy(n){if(n.length===0)return null;const e=n.lastIndexOf("/");return e===-1?"":n.slice(0,e)}function By(n){const e=n.lastIndexOf("/",n.length-2);return e===-1?n:n.slice(e+1)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fr{constructor(e,t){this._service=e,t instanceof Oe?this._location=t:this._location=Oe.makeFromUrl(t,e.host)}toString(){return"gs://"+this._location.bucket+"/"+this._location.path}_newRef(e,t){return new Fr(e,t)}get root(){const e=new Oe(this._location.bucket,"");return this._newRef(this._service,e)}get bucket(){return this._location.bucket}get fullPath(){return this._location.path}get name(){return By(this._location.path)}get storage(){return this._service}get parent(){const e=Fy(this._location.path);if(e===null)return null;const t=new Oe(this._location.bucket,e);return new Fr(this._service,t)}_throwIfRoot(e){if(this._location.path==="")throw by(e)}}function ml(n,e){const t=e==null?void 0:e[yy];return t==null?null:Oe.makeFromBucketSpec(t,n)}function Uy(n,e,t,r={}){n.host=`${e}:${t}`,n._protocol="http";const{mockUserToken:s}=r;s&&(n._overrideAuthToken=typeof s=="string"?s:Ol(s,n.app.options.projectId))}class $y{constructor(e,t,r,s,o){this.app=e,this._authProvider=t,this._appCheckProvider=r,this._url=s,this._firebaseVersion=o,this._bucket=null,this._host=xu,this._protocol="https",this._appId=null,this._deleted=!1,this._maxOperationRetryTime=_y,this._maxUploadRetryTime=vy,this._requests=new Set,s!=null?this._bucket=Oe.makeFromBucketSpec(s,this._host):this._bucket=ml(this._host,this.app.options)}get host(){return this._host}set host(e){this._host=e,this._url!=null?this._bucket=Oe.makeFromBucketSpec(this._url,e):this._bucket=ml(e,this.app.options)}get maxUploadRetryTime(){return this._maxUploadRetryTime}set maxUploadRetryTime(e){fl("time",0,Number.POSITIVE_INFINITY,e),this._maxUploadRetryTime=e}get maxOperationRetryTime(){return this._maxOperationRetryTime}set maxOperationRetryTime(e){fl("time",0,Number.POSITIVE_INFINITY,e),this._maxOperationRetryTime=e}async _getAuthToken(){if(this._overrideAuthToken)return this._overrideAuthToken;const e=this._authProvider.getImmediate({optional:!0});if(e){const t=await e.getToken();if(t!==null)return t.accessToken}return null}async _getAppCheckToken(){const e=this._appCheckProvider.getImmediate({optional:!0});return e?(await e.getToken()).token:null}_delete(){return this._deleted||(this._deleted=!0,this._requests.forEach(e=>e.cancel()),this._requests.clear()),Promise.resolve()}_makeStorageReference(e){return new Fr(this,e)}_makeRequest(e,t,r,s,o=!0){if(this._deleted)return new Ry(Lu());{const a=My(e,this._appId,r,s,t,this._firebaseVersion,o);return this._requests.add(a),a.getPromise().then(()=>this._requests.delete(a),()=>this._requests.delete(a)),a}}async makeRequestWithTokens(e,t){const[r,s]=await Promise.all([this._getAuthToken(),this._getAppCheckToken()]);return this._makeRequest(e,t,r,s).getPromise()}}const pl="@firebase/storage",gl="0.13.2";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Mu="storage";function jy(n=pi(),e){n=ke(n);const r=Jt(n,Mu).getImmediate({identifier:e}),s=kl("storage");return s&&qy(r,...s),r}function qy(n,e,t,r={}){Uy(n,e,t,r)}function zy(n,{instanceIdentifier:e}){const t=n.getProvider("app").getImmediate(),r=n.getProvider("auth-internal"),s=n.getProvider("app-check-internal");return new $y(t,r,s,e,Ul)}function Hy(){Ge(new Me(Mu,zy,"PUBLIC").setMultipleInstances(!0)),Ce(pl,gl,""),Ce(pl,gl,"esm2017")}Hy();const Gy={apiKey:"AIzaSyCj__TCfYSF-1y4uR-UOId_aPWWwy4-W5A",authDomain:"hscaterhub.firebaseapp.com",projectId:"hscaterhub",storageBucket:"hscaterhub.firebasestorage.app",messagingSenderId:"191852835453",appId:"1:191852835453:web:6e8498beaecbb85f637714",measurementId:"G-HL5SHGHK2C"},ro=$l(Gy);gm(ro);const Ie=sy(ro);jy(ro);let ot=[],Vt=[];const Ky=[{id:"#ORD-7023",platform:"Forkable",customerName:"Acme Corp",typeOfOrder:"Meal Manager",deliveryDate:"2026-04-08",deliveryTime:"11:30 AM",deliveryMethod:"Platform",pickUpTime:"11:00 AM",subtotal:350,total:385,netPayout:310.5,status:"Completed",items:[{name:"Gourmet Salmon Bowl",amount:15,notes:"No onions on 5 of them"},{name:"Vegan Wrap Assortment",amount:5,notes:"Gluten-free wraps"}],overallNotes:"Leave at front desk with receptionist."},{id:"#ORD-7024",platform:"Doordash",customerName:"TechFlow HQ",typeOfOrder:"Catering",deliveryDate:"2026-04-09",deliveryTime:"12:00 PM",deliveryMethod:"Third-Party",pickUpTime:"11:15 AM",subtotal:540,total:590.25,netPayout:460,status:"New",items:[{name:"Artisan Sandwich Platter",amount:3,notes:"Half turkey, half roast beef"},{name:"Caesar Salad (Large)",amount:2,notes:"Dressing on the side"}],overallNotes:"Please call upon arrival."},{id:"#ORD-7025",platform:"ezCater",customerName:"Stark Industries",typeOfOrder:"Catering",deliveryDate:"2026-04-10",deliveryTime:"01:00 PM",deliveryMethod:"HolyShred",pickUpTime:"",subtotal:1200,total:1350,netPayout:1050,status:"Finalized",items:[{name:"Corporate Breakfast Box",amount:50,notes:""}],overallNotes:"VIP client, ensure impeccable presentation."}],Wy=[{title:"Artisan Sandwich Platter",desc:"A premium artisan sandwich platter, beautifully arranged. Includes turkey, club, and vegan options.",platform:"ezCater",imgPath:"https://images.unsplash.com/photo-1550507992-eb63ffee0847?auto=format&fit=crop&w=600&q=80"},{title:"Gourmet Salmon Bowls",desc:"Fresh, vibrant colors, organic ingredients, beautifully plated salmon bowls with quinoa.",platform:"Forkable",imgPath:"https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80"},{title:"Corporate Breakfast Box",desc:"Assorted pastries, fresh fruit, and premium coffee setup for early morning meetings.",platform:"DoorDash",imgPath:"https://images.unsplash.com/photo-1495147466023-ac5c588e2e40?auto=format&fit=crop&w=600&q=80"},{title:"Vegan Wrap Assortment",desc:"Plant-based wraps with house-made hummus, roasted veggies, and tahini drizzle.",platform:"Uber Eats",imgPath:"https://images.unsplash.com/photo-1626804475297-41609ea0adb4?auto=format&fit=crop&w=600&q=80"}];let At=null;function Qy(){const n=document.getElementById("calendar");n&&(At=new FullCalendar.Calendar(n,{initialView:"dayGridMonth",headerToolbar:{left:"prev,next today",center:"title",right:"dayGridMonth,timeGridWeek"},events:ot.map(e=>({id:e.fbId,title:`${e.platform} - ${e.id}`,start:e.deliveryDate,extendedProps:{order:e}})),dayMaxEvents:!1,height:"auto",eventClick:function(e){Fu(e.event.extendedProps.order)}}),At.render())}document.querySelectorAll(".nav-item").forEach(n=>{n.addEventListener("click",()=>{document.querySelectorAll(".nav-item").forEach(t=>t.classList.remove("active")),document.querySelectorAll(".tab-content").forEach(t=>t.classList.remove("active")),n.classList.add("active");const e=n.getAttribute("data-tab")+"-tab";document.getElementById(e).classList.add("active"),e==="calendar-tab"&&setTimeout(()=>{At?At.updateSize():Qy()},50)})});var _l;(_l=document.getElementById("sidebar-toggle-btn"))==null||_l.addEventListener("click",()=>{const n=document.querySelector(".sidebar");n&&n.classList.toggle("collapsed")});function hi(n){if(n.status==="Cancelled"||n.status==="Archived")return n.status;try{if(!n.deliveryDate)return n.status||"New";const e=new Date(new Date().toLocaleString("en-US",{timeZone:"America/Los_Angeles"})),[t,r,s]=n.deliveryDate.split("-"),o=new Date(parseInt(t),parseInt(r)-1,parseInt(s)),a=new Date(parseInt(t),parseInt(r)-1,parseInt(s)-1,17,0,0);let c=n.pickUpTime||n.deliveryTime||"";if(c){c=c.trim().toUpperCase();let h=12,d=0;const m=c.match(/(\d+):(\d+)\s*(AM|PM)?/);if(m){h=parseInt(m[1]),d=parseInt(m[2]);const _=m[3];_==="PM"&&h<12&&(h+=12),_==="AM"&&h===12&&(h=0)}o.setHours(h,d,0)}else o.setHours(12,0,0);return e>o?"Completed":e>=a?"Finalize":"New"}catch{return n.status||"New"}}function so(){const n=document.getElementById("dash-total-orders"),e=document.getElementById("dash-total-amount"),t=document.getElementById("dash-net-payout"),r=document.getElementById("dash-avg-payout"),s=document.getElementById("dash-popular-dishes"),o=document.getElementById("dash-platform-breakdown");if(!n)return;let a=0,c=0;const h=new Set,d={},m={},_=document.getElementById("dash-start-date").value,A=document.getElementById("dash-end-date").value,R=ot.filter(N=>!(N.status==="Cancelled"||N.status==="Archived"||!N.deliveryDate||_&&N.deliveryDate<_||A&&N.deliveryDate>A)),V=R.length;R.forEach(N=>{a+=parseFloat(N.total)||0,c+=parseFloat(N.netPayout)||0,N.deliveryDate&&h.add(N.deliveryDate);const M=N.platform||"Unknown";m[M]||(m[M]={count:0,total:0,netPayout:0}),m[M].count+=1,m[M].total+=parseFloat(N.total)||0,m[M].netPayout+=parseFloat(N.netPayout)||0,N.items&&Array.isArray(N.items)&&N.items.forEach(J=>{const Q=J.name||"Unknown Item",E=parseInt(J.amount)||1;d[Q]=(d[Q]||0)+E})});let k=h.size;if(_){const[N,M]=_.split("-");k=new Date(parseInt(N),parseInt(M),0).getDate()}const C=k>0?c/k:0;n.innerText=V,e.innerText="$"+a.toFixed(2),t.innerText="$"+c.toFixed(2),r.innerText="$"+C.toFixed(2);const $=Object.entries(d).sort((N,M)=>M[1]-N[1]).slice(0,10);s.innerHTML=$.map(([N,M],J)=>`
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; ${J<$.length-1?"border-bottom: 1px solid rgba(255,255,255,0.05);":""}">
      <span style="font-weight: 500;">${N}</span>
      <span style="background: rgba(110, 231, 183, 0.2); color: #6ee7b7; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem; font-weight: bold;">${M}x</span>
    </div>
  `).join("");const j=Object.entries(m).sort((N,M)=>M[1].netPayout-N[1].netPayout);o.innerHTML=j.map(([N,M],J)=>`
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; ${J<j.length-1?"border-bottom: 1px solid rgba(255,255,255,0.05);":""}">
      <span style="font-weight: 500; font-size: 0.95rem;">${N} <span style="color:#9ca3af; font-size:0.8rem; margin-left:8px;">(${M.count} orders)</span></span>
      <div style="text-align: right;">
        <div style="color: #6ee7b7; font-weight: bold;">$${M.netPayout.toFixed(2)} <span style="font-size:0.75rem; color:#9ca3af; font-weight: normal;">net</span></div>
        <div style="font-size: 0.75rem; color: #9ca3af;">$${M.total.toFixed(2)} total</div>
      </div>
    </div>
  `).join("")}var vl;(vl=document.getElementById("dash-start-date"))==null||vl.addEventListener("change",so);var El;(El=document.getElementById("dash-end-date"))==null||El.addEventListener("change",so);function Gn(){var a,c,h,d;const n=document.getElementById("orders-tbody");n.innerHTML="";const e=((a=document.getElementById("orders-platform-filter"))==null?void 0:a.value)||"all",t=((c=document.getElementById("orders-status-filter"))==null?void 0:c.value)||"all",r=((h=document.getElementById("orders-start-date"))==null?void 0:h.value)||"",s=((d=document.getElementById("orders-end-date"))==null?void 0:d.value)||"";ot.filter(m=>{let _=!0;e!=="all"&&(!m.platform||m.platform.toLowerCase()!==e.toLowerCase())&&(_=!1);const A=hi(m);return t!=="all"&&A.toLowerCase()!==t.toLowerCase()&&(_=!1),r&&(!m.deliveryDate||m.deliveryDate<r)&&(_=!1),s&&(!m.deliveryDate||m.deliveryDate>s)&&(_=!1),_}).forEach(m=>{try{const _=hi(m);let A="status-pending";_==="Completed"&&(A="status-completed"),_==="Finalize"&&(A="status-finalize"),_==="Cancelled"&&(A="status-cancelled");const R=document.createElement("tr"),V=m.items&&m.items.length>0?m.items.map(j=>`${j.amount}x ${j.name||"Item"}`).join(", "):"No Items recorded";let k="",C=m.deliveryMethod||"Platform";C.toLowerCase()==="platform"||C.toLowerCase()==="partner"?k=`Pick up: <span style="color: #6ee7b7; font-weight: 500;">${m.pickUpTime||m.deliveryTime||"TBD"}</span>`:k=`Deliver: <span style="color: #6ee7b7; font-weight: 500;">${m.deliveryTime||"TBD"}</span>`;let $="0.00";typeof m.netPayout=="number"?$=m.netPayout.toFixed(2):m.netPayout&&($=parseFloat(m.netPayout).toFixed(2)||"0.00"),R.innerHTML=`
      <td><strong>${m.id}</strong></td>
      <td>${m.platform}</td>
      <td>${m.customerName}</td>
      <td style="white-space: nowrap;">${m.deliveryDate}</td>
      <td>
        <div style="font-weight: 500; margin-bottom: 0.25rem;">${C}</div>
        <div style="font-size: 0.8rem; color: #9ca3af;">${k}</div>
      </td>
      <td style="max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 0.85rem; color: #9ca3af;">${V}</td>
      <td>$${$}</td>
      <td><span class="status-badge ${A}">${_}</span></td>
      <td>
        <div style="display: flex; gap: 0.5rem;">
          <button class="secondary-btn edit-order-btn" data-id="${m.fbId}" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">Edit</button>
          <button class="delete-order-btn" data-id="${m.fbId}" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid #ef4444; border-radius: 8px; cursor: pointer;">Delete</button>
        </div>
      </td>
    `,R.style.cursor="pointer",R.addEventListener("click",async j=>{const N=j.target.closest("button");if(N&&N.classList.contains("delete-order-btn"))j.stopPropagation(),confirm("Are you sure you want to delete this order?")&&await to(dt(Ie,"orders",m.fbId),{isDeleted:!0});else if(N&&N.classList.contains("edit-order-btn")){j.stopPropagation();const M=document.getElementById("add-order-form");M.dataset.editingId=m.fbId,document.getElementById("new-order-platform").value=m.platform||"Direct",document.getElementById("new-order-id").value=m.id||"",document.getElementById("new-order-type").value=m.typeOfOrder||"Catering",document.getElementById("new-order-customer").value=m.customerName||"",document.getElementById("new-order-date").value=m.deliveryDate||"",document.getElementById("new-order-time").value=m.deliveryTime||"",document.getElementById("new-order-method").value=m.deliveryMethod||"Platform",document.getElementById("new-order-pickup").value=m.pickUpTime||"",document.getElementById("new-order-subtotal").value=m.subtotal||0,document.getElementById("new-order-total").value=m.total||0,document.getElementById("new-order-payout").value=m.netPayout||0,document.getElementById("new-order-notes").value=m.overallNotes||"";const J=document.getElementById("new-order-items-container");J.innerHTML="",m.items&&m.items.length>0&&m.items.forEach(Q=>{io();const E=J.lastElementChild;E.querySelector(".item-name-select").value=Q.name||"",E.querySelector(".item-amount").value=Q.amount||1,E.querySelector(".item-notes-input").value=Q.notes||""}),document.getElementById("add-order-modal").classList.add("active")}else Fu(m)}),n.appendChild(R)}catch(_){console.error(_)}})}function Fu(n){const e=document.getElementById("panel-content"),t=document.getElementById("order-modal-overlay"),r=document.getElementById("order-details-panel"),s=n.items.map(m=>`
    <div class="item-row">
      <span><strong>${m.amount}x</strong> ${m.name}</span>
      ${m.notes?`<div class="item-notes">Note: ${m.notes}</div>`:""}
    </div>
  `).join("");let o="",a="",c=n.deliveryMethod||"Platform";c.toLowerCase()==="platform"||c.toLowerCase()==="partner"?(o="Pick Up Time",a=n.pickUpTime||n.deliveryTime):(o="Delivery Time",a=n.deliveryTime);const h=hi(n);let d="status-pending";h==="Completed"&&(d="status-completed"),h==="Finalize"&&(d="status-finalize"),h==="Cancelled"&&(d="status-cancelled"),e.innerHTML=`
    <div class="panel-header">
      <h2>${n.id} - ${n.platform}</h2>
      <span class="status-badge ${d}" style="display: inline-block; margin-top: 0.5rem;">${h}</span>
    </div>
    
    <div class="panel-grid">
      <div class="info-group"><label>Customer Name</label><p>${n.customerName}</p></div>
      <div class="info-group"><label>Order Type</label><p>${n.typeOfOrder}</p></div>
      <div class="info-group"><label>Delivery Date</label><p>${n.deliveryDate}</p></div>
      <div class="info-group"><label>Delivery Method</label><p>${c}</p></div>
      <div class="info-group"><label>${o}</label><p style="color: #6ee7b7;">${a}</p></div>
      <div class="info-group"><label>Subtotal</label><p>$${n.subtotal.toFixed(2)}</p></div>
      <div class="info-group"><label>Total</label><p>$${n.total.toFixed(2)}</p></div>
      <div class="info-group"><label>Net Payout</label><p>$${n.netPayout.toFixed(2)}</p></div>
    </div>
    
    <h3>Items in Order</h3>
    <div class="items-list">
      ${s}
    </div>
    
    ${n.overallNotes?`
      <h3>Overall Notes</h3>
      <div class="overall-notes">${n.overallNotes}</div>
    `:""}
  `,t.classList.add("active"),r.classList.add("active")}const Bu=n=>{const e=parseInt(n)||0;return e===0?'<span style="color: rgba(255,255,255,0.1);">-</span>':"🌶️".repeat(e)};function Yy(n){const e=document.getElementById("panel-content"),t=document.getElementById("order-modal-overlay"),r=document.getElementById("order-details-panel"),s=n.dietary?Object.entries(n.dietary).filter(([c,h])=>h).map(([c,h])=>c.charAt(0).toUpperCase()+c.slice(1)).join(", "):"None",o=n.allergens&&n.allergens.length>0?n.allergens.join(", "):"None specified",a=n.platformOverrides?Object.entries(n.platformOverrides).filter(([c,h])=>h.price||h.note).map(([c,h])=>`
      <div style="background: rgba(255,255,255,0.05); padding: 0.75rem; border-radius: 8px; margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <strong style="color: #6ee7b7;">${c}</strong>
          ${h.note?`<div style="font-size: 0.85rem; margin-top: 0.25rem; color: #9ca3af;">Note: ${h.note}</div>`:""}
        </div>
        ${h.price?`<div style="font-size: 1rem; font-weight: bold; margin-left: 1rem;">$${h.price}</div>`:""}
      </div>
    `).join(""):'<p style="color: #9ca3af; font-size: 0.85rem;">No platform overrides.</p>';e.innerHTML=`
    <div class="panel-header">
      <h2>${n.title||"Unnamed Menu"}</h2>
      <span class="status-badge" style="background: rgba(99, 102, 241, 0.2); color: #818cf8;">${n.category||"Uncategorized"}</span>
    </div>
    
    <div class="panel-grid" style="grid-template-columns: 1fr; gap: 1rem; margin-bottom: 1.5rem;">
      <div class="info-group">
        <label>Description</label>
        <p style="white-space: pre-wrap;">${n.desc||"No description provided."}</p>
      </div>
    </div>

    <div class="panel-grid">
      <div class="info-group"><label>Standard Price</label><p style="font-weight: bold; color: #6ee7b7; font-size: 1.1rem;">$${n.standardPrice||"0.00"}</p></div>
      <div class="info-group"><label>Cooked Weight</label><p>${n.weightG?n.weightG+"g":"N/A"}</p></div>
      <div class="info-group"><label>Serving Size</label><p>${n.serving||"N/A"}</p></div>
      <div class="info-group"><label>Spicy Level</label><p>${Bu(n.spicyLevel)}</p></div>
      <div class="info-group"><label>Base</label><p>${n.base||"N/A"}</p></div>
      <div class="info-group"><label>Proteins</label><p>${n.proteins||"N/A"}</p></div>
    </div>
    
    <div style="margin-top: 1.5rem; background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 8px;">
      <h3 style="margin-top: 0; margin-bottom: 1rem;">Composition</h3>
      <div class="info-group" style="margin-bottom: 0.75rem;"><label>Ingredients</label><p>${n.ingredient||"None specified"}</p></div>
      <div class="info-group" style="margin-bottom: 0.75rem;"><label>Toppings</label><p>${n.toppings||"None specified"}</p></div>
      <div class="info-group" style="margin-bottom: 0.75rem;"><label>Sauces</label><p>${n.sauce||"None specified"}</p></div>
      <div class="info-group" style="margin-bottom: 0.75rem;"><label>Allergen List</label><p style="color: #ef4444; font-weight: 500;">${o}</p></div>
      <div class="info-group" style="margin-bottom: 0;"><label>Dietary Restrictions</label><p style="color: #10b981; font-weight: 500;">${s}</p></div>
    </div>
    
    <div style="margin-top: 1.5rem;">
      <h3 style="margin-bottom: 1rem;">Platform Modifications</h3>
      ${a}
    </div>
  `,t.classList.add("active"),r.classList.add("active")}function Uu(){document.getElementById("order-modal-overlay").classList.remove("active"),document.getElementById("order-details-panel").classList.remove("active")}document.getElementById("close-panel-btn").addEventListener("click",Uu);document.getElementById("order-modal-overlay").addEventListener("click",Uu);function $u(n="all"){const e=document.getElementById("menu-table-body");if(!e)return;e.innerHTML="",Vt.filter(r=>n==="all"?!0:r.category&&r.category.toLowerCase().replace(" ","")===n).forEach(r=>{const s=document.createElement("tr");s.dataset.id=r.fbId,s.style.cursor="pointer",s.classList.add("menu-row"),r.platformOverrides&&Object.keys(r.platformOverrides).filter(c=>r.platformOverrides[c].price||r.platformOverrides[c].note).join(", ");const o=[r.base,r.proteins].filter(Boolean).join(" + "),a=c=>r.dietary&&r.dietary[c]?'<span style="color: #10b981; font-weight: bold; font-size: 1.1rem;">&#10003;</span>':'<span style="color: rgba(255,255,255,0.1);">-</span>';s.innerHTML=`
      <td>${r.category||""}</td>
      <td style="font-weight: 600;">${r.title||""}</td>
      <td style="font-weight: bold; color: #6ee7b7;">$${r.standardPrice||"0.00"}</td>
      <td style="font-size: 0.85rem; white-space: normal;">${o}</td>
      <td>${r.weightG||""}</td>
      <td style="font-size: 1.1rem;">${Bu(r.spicyLevel)}</td>
      <td style="text-align: center;">${a("vegan")}</td>
      <td style="text-align: center;">${a("vegetarian")}</td>
      <td style="text-align: center;">${a("gf")}</td>
      <td style="text-align: center;">${a("soy")}</td>
      <td style="text-align: center;">${a("nut")}</td>
      <td style="text-align: center;">${a("dairy")}</td>
      <td style="text-align: center;">${a("egg")}</td>
      <td style="text-align: center;">${a("sesame")}</td>
      <td style="text-align: center;">${a("shellfish")}</td>
      <td style="text-align: center;">${a("seafood")}</td>
      <td>
        <div style="display: flex; gap: 0.5rem;">
          <button class="secondary-btn edit-menu-btn" data-id="${r.fbId}" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">Edit</button>
          <button class="delete-menu-btn" data-id="${r.fbId}" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid #ef4444; border-radius: 8px; cursor: pointer;">Delete</button>
        </div>
      </td>
    `,e.appendChild(s)})}var Il;(Il=document.getElementById("save-new-menu-btn"))==null||Il.addEventListener("click",async()=>{});let Tt={};const Xy=["ezCater","ClubFeast","Cater2.me","Email Source"];no(dt(Ie,"system","crawlers"),n=>{n.exists()?Tt=n.data():Tt={},Jy()});function Jy(){const n=document.getElementById("crawlers-configs-container");if(!n)return;let e="";Xy.forEach(r=>{const s=Tt[r]||{status:"Unknown",cookie:""},a=s.status==="Expired"?"#f87171":s.status==="Active"?"#6ee7b7":"#9ca3af";e+=`
       <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 1.25rem; border-radius: 8px;">
         <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
           <h4 style="font-size: 1.1rem; margin: 0;">${r}</h4>
           <span style="font-size: 0.8rem; font-weight: bold; color: ${a}; background: rgba(255,255,255,0.1); padding: 0.2rem 0.6rem; border-radius: 12px;">${s.status}</span>
         </div>
         <div style="margin-bottom: 0.5rem;">
           <label style="display: block; font-size: 0.75rem; color: #9ca3af; margin-bottom: 0.25rem;">${r==="Email Source"?"Email Address, App Password (Optional)":"Authorization Token / Cookie"}</label>
           <input type="text" id="crawler-cookie-${r.replace(/\s+/g,"-")}" value="${s.cookie||""}" placeholder="${r==="Email Source"?"e.g. supassorn@holyshred.co, password123":"Paste raw cookie string here..."}" style="width: 100%; background: #0f172a; border: 1px solid rgba(255,255,255,0.1); color: #f8fafc; padding: 0.5rem; border-radius: 4px;" />
         </div>
         ${s.lastRun?'<div style="font-size: 0.75rem; color: #9ca3af; margin-bottom: 1rem;">Last checked: '+s.lastRun+"</div>":'<div style="font-size: 0.75rem; color: #9ca3af; margin-bottom: 1rem;">Never run</div>'}
         <button class="secondary-btn" onclick="saveCrawlerConfig('${r}')" style="width: 100%; font-size: 0.8rem;">Update Connection</button>
       </div>
     `}),n.innerHTML=e;const t=document.getElementById("force-sync-btn");t&&(Tt.isSyncing?(t.innerText="Syncing Orders...",t.disabled=!0,t.style.opacity="0.7"):(t.innerText=Tt.lastGlobalSync?`Refresh Immediately (Last: ${Tt.lastGlobalSync})`:"Refresh Immediately",t.disabled=!1,t.style.opacity="1"))}var Tl;(Tl=document.getElementById("force-sync-btn"))==null||Tl.addEventListener("click",async()=>{await Ou(dt(Ie,"system","crawlers"),{forceSync:!0},{merge:!0})});window.saveCrawlerConfig=async n=>{const e=document.getElementById(`crawler-cookie-${n.replace(/\s+/g,"-")}`).value,t={[n]:{...Tt[n]||{},cookie:e,status:e?"Active":"Missing",updatedAt:new Date().toLocaleTimeString()}};await Ou(dt(Ie,"system","crawlers"),t,{merge:!0}),alert(`${n} configuration updated successfully! The scraper will automatically ingest your new token on its next cycle.`)};document.getElementById("menu-table-body").addEventListener("click",async n=>{if(n.target.classList.contains("delete-menu-btn")){const e=n.target.getAttribute("data-id");confirm("Are you sure you want to delete this menu item?")&&await py(dt(Ie,"menus",e))}else if(n.target.classList.contains("edit-menu-btn")){const e=n.target.getAttribute("data-id"),t=Vt.find(r=>r.fbId===e);t&&(document.getElementById("add-menu-form").reset(),typeof Se<"u"&&(Se=[],Xt()),ju(),document.getElementById("add-menu-form").dataset.editingId=e,document.getElementById("menu-category").value=t.category||"",document.getElementById("menu-name").value=t.title||"",document.getElementById("menu-desc").value=t.desc||"",document.getElementById("menu-price").value=t.standardPrice||"",document.getElementById("menu-ingredient").value=t.ingredient||"",document.getElementById("menu-toppings").value=t.toppings||"",document.getElementById("menu-sauce").value=t.sauce||"",document.getElementById("menu-base").value=t.base||"",document.getElementById("menu-proteins").value=t.proteins||"",document.getElementById("menu-serving").value=t.serving||"",document.getElementById("menu-weight-g").value=t.weightG||"",t.weightG&&document.getElementById("menu-weight-g").dispatchEvent(new Event("input")),document.getElementById("menu-spicy").value=t.spicyLevel||"0",t.allergens&&Array.isArray(t.allergens)&&(Se=[...t.allergens],Xt()),t.dietary&&(document.getElementById("diet-vegan").checked=!!t.dietary.vegan,document.getElementById("diet-vegetarian").checked=!!t.dietary.vegetarian,document.getElementById("diet-gf").checked=!!t.dietary.gf,document.getElementById("diet-soy").checked=!!t.dietary.soy,document.getElementById("diet-sesame").checked=!!t.dietary.sesame,document.getElementById("diet-nut").checked=!!t.dietary.nut,document.getElementById("diet-dairy").checked=!!t.dietary.dairy,document.getElementById("diet-egg").checked=!!t.dietary.egg,document.getElementById("diet-shellfish").checked=!!t.dietary.shellfish,document.getElementById("diet-seafood").checked=!!t.dietary.seafood),t.platformOverrides&&(document.querySelectorAll("#platform-details-container .platform-alias").forEach(r=>{const s=r.getAttribute("data-platform");t.platformOverrides[s]&&(r.value=t.platformOverrides[s].alias||"",r.value&&(r.dataset.dirty="true"))}),document.querySelectorAll("#platform-details-container .platform-note").forEach(r=>{const s=r.getAttribute("data-platform");t.platformOverrides[s]&&(r.value=t.platformOverrides[s].note||"")}),document.querySelectorAll("#platform-details-container .platform-price").forEach(r=>{const s=r.getAttribute("data-platform");t.platformOverrides[s]&&(r.value=t.platformOverrides[s].price||"",r.value&&(r.dataset.dirty="true"))})),bt.classList.add("active"))}else{const e=n.target.closest("tr");if(e){const t=e.getAttribute("data-id"),r=Vt.find(s=>s.fbId===t);r&&Yy(r)}}});document.getElementById("category-filter").addEventListener("change",n=>{$u(n.target.value)});var wl;(wl=document.getElementById("orders-platform-filter"))==null||wl.addEventListener("change",Gn);var Al;(Al=document.getElementById("orders-status-filter"))==null||Al.addEventListener("change",Gn);var bl;(bl=document.getElementById("orders-start-date"))==null||bl.addEventListener("change",Gn);var Rl;(Rl=document.getElementById("orders-end-date"))==null||Rl.addEventListener("change",Gn);const Us=document.getElementById("dash-start-date"),$s=document.getElementById("dash-end-date");if(Us&&$s&&!Us.value&&!$s.value){const n=new Intl.DateTimeFormat("en-US",{timeZone:"America/Los_Angeles",year:"numeric",month:"numeric",day:"numeric"}).format(new Date),[e,t,r]=n.split("/"),s=parseInt(r),o=parseInt(e),a=new Date(s,o,0),c=h=>h.toString().padStart(2,"0");Us.value=`${s}-${c(o)}-01`,$s.value=`${s}-${c(o)}-${c(a.getDate())}`}no(tt(Ie,"orders"),n=>{ot=n.docs.map(e=>({fbId:e.id,...e.data()})).filter(e=>!e.isDeleted),ot.sort((e,t)=>{let r=new Date(e.deliveryDate||0);return new Date(t.deliveryDate||0)-r}),Gn(),so(),typeof kt=="function"&&kt(),At&&(At.removeAllEvents(),At.addEventSource(ot.map(e=>({id:e.fbId,title:`${e.platform} - ${e.id}`,start:e.deliveryDate,extendedProps:{order:e}}))))});no(tt(Ie,"menus"),n=>{Vt=n.docs.map(s=>({fbId:s.id,...s.data()}));const e=document.getElementById("category-filter");$u(e?e.value:"all"),typeof kt=="function"&&kt();let t=document.getElementById("menu-items-global-list");t||(t=document.createElement("datalist"),t.id="menu-items-global-list",document.body.appendChild(t));const r=[...new Set(Vt.map(s=>s.title).filter(Boolean))];t.innerHTML=r.map(s=>`<option value="${s}"></option>`).join("")});const qt=document.getElementById("add-order-modal"),Zy=document.getElementById("add-order-btn"),e_=document.getElementById("close-add-order-btn"),t_=document.getElementById("add-item-row-btn"),Br=document.getElementById("new-order-items-container"),_t=document.getElementById("add-order-form");function io(){const n=document.createElement("div");n.className="dynamic-item-row",n.innerHTML=`
    <input type="text" class="item-name-select" list="menu-items-global-list" placeholder="Select or type Menu Item..." required />
    <input type="number" class="item-amount" placeholder="Qty" min="1" required />
    <input type="text" class="item-notes-input" placeholder="Notes (optional)" />
    <button type="button" class="remove-item-btn" title="Remove">&times;</button>
  `,n.querySelector(".remove-item-btn").addEventListener("click",()=>{n.remove()}),Br.appendChild(n)}Zy.addEventListener("click",()=>{_t.reset(),delete _t.dataset.editingId,Br.innerHTML="",qt.classList.add("active"),Br.children.length===0&&io()});e_.addEventListener("click",()=>{qt.classList.remove("active")});qt.addEventListener("click",n=>{n.target===qt&&qt.classList.remove("active")});t_.addEventListener("click",io);_t.addEventListener("submit",n=>{n.preventDefault();const e=[];document.querySelectorAll(".dynamic-item-row").forEach(r=>{e.push({name:r.querySelector(".item-name-select").value,amount:parseInt(r.querySelector(".item-amount").value,10),notes:r.querySelector(".item-notes-input").value})});const t={id:document.getElementById("new-order-id").value,platform:document.getElementById("new-order-platform").value,customerName:document.getElementById("new-order-customer").value,typeOfOrder:document.getElementById("new-order-type").value,deliveryDate:document.getElementById("new-order-date").value,deliveryTime:document.getElementById("new-order-time").value,deliveryMethod:document.getElementById("new-order-method").value,pickUpTime:document.getElementById("new-order-pickup").value,subtotal:parseFloat(document.getElementById("new-order-subtotal").value),total:parseFloat(document.getElementById("new-order-total").value),netPayout:parseFloat(document.getElementById("new-order-payout").value),status:"New",overallNotes:document.getElementById("new-order-notes").value,items:e};_t.dataset.editingId?(t.manualOverride=!0,to(dt(Ie,"orders",_t.dataset.editingId),t),delete _t.dataset.editingId):Lr(tt(Ie,"orders"),t),_t.reset(),Br.innerHTML="",qt.classList.remove("active")});const bt=document.getElementById("add-menu-modal"),n_=document.getElementById("add-menu-btn"),r_=document.getElementById("close-add-menu-btn"),vt=document.getElementById("add-menu-form"),Fn=document.getElementById("platform-details-container"),s_=document.getElementById("menu-weight-g"),i_=document.getElementById("menu-price"),o_=["Cater2.me","ClubFeast","Direct","DoorDash","ezCater","Fooda","Foodja","Forkable","Uber Eats","Zerocater"];function ju(){Fn.innerHTML="",o_.forEach(n=>{const e=document.createElement("div");e.style.display="grid",e.style.gridTemplateColumns="1fr 2fr 2fr 1fr",e.style.gap="0.5rem",e.style.alignItems="center",e.style.background="rgba(255, 255, 255, 0.02)",e.style.padding="0.75rem",e.style.borderRadius="8px",e.style.border="1px solid var(--glass-border)",e.innerHTML=`
      <strong style="color: var(--text-primary); font-size: 0.85rem;">${n}</strong>
      <input type="text" class="platform-alias" data-platform="${n}" placeholder="Alias Name..." style="width: 100%; background: var(--bg-primary); border: 1px solid var(--glass-border); padding: 0.5rem; border-radius: 8px; color: var(--text-primary); outline: none;" />
      <input type="text" class="platform-note" data-platform="${n}" placeholder="Special Note..." style="width: 100%; background: var(--bg-primary); border: 1px solid var(--glass-border); padding: 0.5rem; border-radius: 8px; color: var(--text-primary); outline: none;" />
      <input type="number" step="0.01" class="platform-price" data-platform="${n}" placeholder="Price ($)" style="width: 100%; background: var(--bg-primary); border: 1px solid var(--glass-border); padding: 0.5rem; border-radius: 8px; color: var(--text-primary); outline: none;" />
    `,Fn.appendChild(e)})}s_.addEventListener("input",n=>{const e=parseFloat(n.target.value);isNaN(e)?(document.getElementById("menu-weight-oz").value="",document.getElementById("menu-weight-lbs").value=""):(document.getElementById("menu-weight-oz").value=(e/28.3495).toFixed(2),document.getElementById("menu-weight-lbs").value=(e/453.592).toFixed(2))});i_.addEventListener("input",n=>{const e=n.target.value;document.querySelectorAll(".platform-price").forEach(t=>{t.dataset.dirty||(t.value=e)})});document.getElementById("menu-name").addEventListener("input",n=>{const e=n.target.value;document.querySelectorAll(".platform-alias").forEach(t=>{t.dataset.dirty||(t.value=e)})});Fn.addEventListener("input",n=>{(n.target.classList.contains("platform-price")||n.target.classList.contains("platform-alias"))&&(n.target.dataset.dirty="true")});n_.addEventListener("click",()=>{vt.reset(),delete vt.dataset.editingId,typeof Se<"u"&&(Se=[],Xt()),Fn.children.length===0&&ju(),bt.classList.add("active")});r_.addEventListener("click",()=>{bt.classList.remove("active")});bt.addEventListener("click",n=>{n.target===bt&&bt.classList.remove("active")});vt.addEventListener("submit",async n=>{n.preventDefault();const e=vt.querySelector('button[type="submit"]'),t=e.innerText;e.innerText="Saving...",e.disabled=!0;const r={};document.querySelectorAll("#platform-details-container .platform-alias").forEach(a=>{const c=a.getAttribute("data-platform");r[c]||(r[c]={}),r[c].alias=a.value.trim()}),document.querySelectorAll("#platform-details-container .platform-note").forEach(a=>{const c=a.getAttribute("data-platform");r[c]||(r[c]={}),r[c].note=a.value.trim()}),document.querySelectorAll("#platform-details-container .platform-price").forEach(a=>{const c=a.getAttribute("data-platform");r[c]||(r[c]={}),r[c].price=a.value});const s={title:document.getElementById("menu-name").value,desc:document.getElementById("menu-desc").value,category:document.getElementById("menu-category").value,standardPrice:document.getElementById("menu-price").value,ingredient:document.getElementById("menu-ingredient").value,toppings:document.getElementById("menu-toppings").value,sauce:document.getElementById("menu-sauce").value,base:document.getElementById("menu-base").value,proteins:document.getElementById("menu-proteins").value,serving:document.getElementById("menu-serving").value,weightG:document.getElementById("menu-weight-g").value,spicyLevel:document.getElementById("menu-spicy").value,allergens:Se,dietary:{vegan:document.getElementById("diet-vegan").checked,vegetarian:document.getElementById("diet-vegetarian").checked,gf:document.getElementById("diet-gf").checked,soy:document.getElementById("diet-soy").checked,sesame:document.getElementById("diet-sesame").checked,nut:document.getElementById("diet-nut").checked,dairy:document.getElementById("diet-dairy").checked,egg:document.getElementById("diet-egg").checked,shellfish:document.getElementById("diet-shellfish").checked,seafood:document.getElementById("diet-seafood").checked},platformOverrides:r},o=vt.dataset.editingId;o?(await to(dt(Ie,"menus",o),s),delete vt.dataset.editingId):(s.id=Date.now(),s.platform="Custom",await Lr(tt(Ie,"menus"),s)),e.innerText=t,e.disabled=!1,vt.reset(),Fn.innerHTML="",typeof Se<"u"&&(Se=[],Xt()),bt.classList.remove("active")});const In=document.getElementById("menu-allergens-input"),js=document.getElementById("allergen-tags-wrapper"),a_=document.getElementById("menu-allergens");let Se=[];function Xt(){js.innerHTML="",Se.forEach((n,e)=>{const t=document.createElement("span");t.className="tag-pill",t.innerHTML=`${n} <span class="remove-tag" data-index="${e}">&times;</span>`,js.appendChild(t)}),a_.value=Se.join(","),js.querySelectorAll(".remove-tag").forEach(n=>{n.addEventListener("click",e=>{const t=e.target.getAttribute("data-index");Se.splice(t,1),Xt()})})}In&&In.addEventListener("keydown",n=>{if(n.key==="Enter"||n.key===","){n.preventDefault();const e=In.value.trim().replace(/,/g,"");e&&!Se.includes(e)?(Se.push(e),In.value="",Xt()):e&&(In.value="")}});(async function(){try{(await hl(tt(Ie,"orders"))).empty&&(console.log("Seeding mock orders..."),Ky.forEach(r=>Lr(tt(Ie,"orders"),r))),(await hl(tt(Ie,"menus"))).empty&&(console.log("Seeding mock menus..."),Wy.forEach(r=>Lr(tt(Ie,"menus"),r)))}catch(e){console.error("Failed to seed database. Are Firestore Security Rules set to true? Error:",e)}})();const l_=new Intl.DateTimeFormat("en-CA",{timeZone:"America/Los_Angeles",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date);document.getElementById("prep-date-filter").value=l_;let oo="dish";var Pl;(Pl=document.getElementById("prep-view-dish"))==null||Pl.addEventListener("click",n=>{oo="dish",n.target.classList.add("active"),n.target.style.background="var(--primary-accent)",n.target.style.color="white";let e=document.getElementById("prep-view-comp");e.classList.remove("active"),e.style.background="transparent",e.style.color="var(--text-secondary)",document.getElementById("prep-dish-container").style.display="block",document.getElementById("prep-comp-container").style.display="none",kt()});var Sl;(Sl=document.getElementById("prep-view-comp"))==null||Sl.addEventListener("click",n=>{oo="comp",n.target.classList.add("active"),n.target.style.background="var(--primary-accent)",n.target.style.color="white";let e=document.getElementById("prep-view-dish");e.classList.remove("active"),e.style.background="transparent",e.style.color="var(--text-secondary)",document.getElementById("prep-dish-container").style.display="none",document.getElementById("prep-comp-container").style.display="block",kt()});var Cl;(Cl=document.getElementById("prep-date-filter"))==null||Cl.addEventListener("change",kt);function kt(){if(!ot||!Vt)return;const n=document.getElementById("prep-date-filter").value;if(!n)return;const e=ot.filter(r=>r.status==="Cancelled"||r.status==="Archived"||!r.deliveryDate?!1:r.deliveryDate.startsWith(n));let t={};if(e.forEach(r=>{r.items&&Array.isArray(r.items)&&r.items.forEach(s=>{let o=s.name?s.name.trim():"Unknown Dish",a=parseInt(s.quantity)||1;t[o]||(t[o]={qty:0,servings:0,menuRef:null}),t[o].qty+=a})}),Object.keys(t).forEach(r=>{let s=r.toLowerCase().replace(/[^a-z0-9]/g,""),o=Vt.find(a=>{if(a.title.toLowerCase().replace(/[^a-z0-9]/g,"")===s)return!0;if(a.overrides){for(let c of Object.keys(a.overrides))if(a.overrides[c]&&a.overrides[c].alias&&a.overrides[c].alias.toLowerCase().replace(/[^a-z0-9]/g,"")===s)return!0}return!1});if(o){t[r].menuRef=o;let a=parseInt(o.serving)||1;t[r].servings=t[r].qty*a}else t[r].servings=t[r].qty}),oo==="dish"){const r=document.getElementById("prep-dish-tbody");let s="";const o=Object.keys(t).sort((a,c)=>t[c].qty-t[a].qty);o.forEach(a=>{s+=`<tr>
                <td style="padding-left: 1rem; color: #f8fafc;">${a} ${t[a].menuRef?"":'<span style="color: #fbbf24; font-size: 0.65rem; margin-left: 0.5rem; border: 1px solid #fbbf24; padding: 2px 4px; border-radius: 4px;">Unlinked</span>'}</td>
                <td style="text-align: right; color: #9ca3af;">${t[a].qty}</td>
                <td style="text-align: right; padding-right: 1rem; color: #6ee7b7; font-weight: bold;">${t[a].servings}</td>
            </tr>`}),o.length===0&&(s='<tr><td colspan="3" style="text-align: center; color: #64748b; padding: 2rem;">No orders matched the selected date.</td></tr>'),r.innerHTML=s}else{const r=document.getElementById("prep-comp-grids");let s={Proteins:{},Base:{},Toppings:{},Sauce:{}};Object.keys(t).forEach(a=>{let c=t[a];if(c.menuRef){let h=c.servings;c.menuRef.proteins&&(s.Proteins[c.menuRef.proteins]||(s.Proteins[c.menuRef.proteins]=0),s.Proteins[c.menuRef.proteins]+=h),c.menuRef.base&&(s.Base[c.menuRef.base]||(s.Base[c.menuRef.base]=0),s.Base[c.menuRef.base]+=h),c.menuRef.toppings&&(s.Toppings[c.menuRef.toppings]||(s.Toppings[c.menuRef.toppings]=0),s.Toppings[c.menuRef.toppings]+=h),c.menuRef.sauce&&(s.Sauce[c.menuRef.sauce]||(s.Sauce[c.menuRef.sauce]=0),s.Sauce[c.menuRef.sauce]+=h)}});let o="";Object.keys(s).forEach(a=>{let c="",h=Object.keys(s[a]).sort((d,m)=>s[a][m]-s[a][d]);h.forEach(d=>{c+=`
                    <div style="display: flex; justify-content: space-between; padding: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.05);">
                        <span style="color: #f8fafc;">${d}</span>
                        <strong style="color: #6ee7b7;">${s[a][d]}</strong>
                    </div>
                `}),h.length===0&&(c='<div style="padding: 1rem; text-align: center; color: #64748b;">No components required.</div>'),o+=`
              <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; overflow: hidden;">
                  <div style="background: rgba(0,0,0,0.2); padding: 0.75rem 1rem; border-bottom: 1px solid rgba(255,255,255,0.05); font-weight: 600; color: var(--primary-accent);">${a} <span style="float: right; color: #64748b; font-size: 0.7rem; font-weight: normal; margin-top: 3px;">SERVINGS</span></div>
                  <div>${c}</div>
              </div>
            `}),r.innerHTML=o}}const yl=document.getElementById("sidebar-toggle-btn");yl&&yl.addEventListener("click",()=>{document.querySelector(".sidebar").classList.toggle("collapsed"),document.querySelector(".main-content").classList.toggle("expanded")});
