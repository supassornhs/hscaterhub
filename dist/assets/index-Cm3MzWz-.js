(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(s){if(s.ep)return;s.ep=!0;const o=t(s);fetch(s.href,o)}})();var ca={};/**
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
 */const kl=function(n){const e=[];let t=0;for(let r=0;r<n.length;r++){let s=n.charCodeAt(r);s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&r+1<n.length&&(n.charCodeAt(r+1)&64512)===56320?(s=65536+((s&1023)<<10)+(n.charCodeAt(++r)&1023),e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128)}return e},Rh=function(n){const e=[];let t=0,r=0;for(;t<n.length;){const s=n[t++];if(s<128)e[r++]=String.fromCharCode(s);else if(s>191&&s<224){const o=n[t++];e[r++]=String.fromCharCode((s&31)<<6|o&63)}else if(s>239&&s<365){const o=n[t++],a=n[t++],c=n[t++],h=((s&7)<<18|(o&63)<<12|(a&63)<<6|c&63)-65536;e[r++]=String.fromCharCode(55296+(h>>10)),e[r++]=String.fromCharCode(56320+(h&1023))}else{const o=n[t++],a=n[t++];e[r++]=String.fromCharCode((s&15)<<12|(o&63)<<6|a&63)}}return e.join("")},Nl={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let s=0;s<n.length;s+=3){const o=n[s],a=s+1<n.length,c=a?n[s+1]:0,h=s+2<n.length,d=h?n[s+2]:0,m=o>>2,_=(o&3)<<4|c>>4;let w=(c&15)<<2|d>>6,b=d&63;h||(b=64,a||(w=64)),r.push(t[m],t[_],t[w],t[b])}return r.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(kl(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):Rh(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let s=0;s<n.length;){const o=t[n.charAt(s++)],c=s<n.length?t[n.charAt(s)]:0;++s;const d=s<n.length?t[n.charAt(s)]:64;++s;const _=s<n.length?t[n.charAt(s)]:64;if(++s,o==null||c==null||d==null||_==null)throw new Ph;const w=o<<2|c>>4;if(r.push(w),d!==64){const b=c<<4&240|d>>2;if(r.push(b),_!==64){const D=d<<6&192|_;r.push(D)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class Ph extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Sh=function(n){const e=kl(n);return Nl.encodeByteArray(e,!0)},wr=function(n){return Sh(n).replace(/\./g,"")},Ch=function(n){try{return Nl.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
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
 */function Dh(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const Vh=()=>Dh().__FIREBASE_DEFAULTS__,kh=()=>{if(typeof process>"u"||typeof ca>"u")return;const n=ca.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},Nh=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=n&&Ch(n[1]);return e&&JSON.parse(e)},fi=()=>{try{return Vh()||kh()||Nh()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},Oh=n=>{var e,t;return(t=(e=fi())===null||e===void 0?void 0:e.emulatorHosts)===null||t===void 0?void 0:t[n]},Ol=n=>{const e=Oh(n);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const r=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),r]:[e.substring(0,t),r]},xl=()=>{var n;return(n=fi())===null||n===void 0?void 0:n.config};/**
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
 */class xh{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,r)=>{t?this.reject(t):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,r))}}}/**
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
 */function Ll(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},r=e||"demo-project",s=n.iat||0,o=n.sub||n.user_id;if(!o)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const a=Object.assign({iss:`https://securetoken.google.com/${r}`,aud:r,iat:s,exp:s+3600,auth_time:s,sub:o,user_id:o,firebase:{sign_in_provider:"custom",identities:{}}},n);return[wr(JSON.stringify(t)),wr(JSON.stringify(a)),""].join(".")}/**
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
 */function Lh(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Mh(){var n;const e=(n=fi())===null||n===void 0?void 0:n.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function Fh(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function Bh(){return!Mh()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function Ml(){try{return typeof indexedDB=="object"}catch{return!1}}function Fl(){return new Promise((n,e)=>{try{let t=!0;const r="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(r);s.onsuccess=()=>{s.result.close(),t||self.indexedDB.deleteDatabase(r),n(!0)},s.onupgradeneeded=()=>{t=!1},s.onerror=()=>{var o;e(((o=s.error)===null||o===void 0?void 0:o.message)||"")}}catch(t){e(t)}})}function Uh(){return!(typeof navigator>"u"||!navigator.cookieEnabled)}/**
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
 */const $h="FirebaseError";class Ye extends Error{constructor(e,t,r){super(t),this.code=e,this.customData=r,this.name=$h,Object.setPrototypeOf(this,Ye.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,jr.prototype.create)}}class jr{constructor(e,t,r){this.service=e,this.serviceName=t,this.errors=r}create(e,...t){const r=t[0]||{},s=`${this.service}/${e}`,o=this.errors[e],a=o?jh(o,r):"Error",c=`${this.serviceName}: ${a} (${s}).`;return new Ye(s,c,r)}}function jh(n,e){return n.replace(qh,(t,r)=>{const s=e[r];return s!=null?String(s):`<${r}?>`})}const qh=/\{\$([^}]+)}/g;function Ar(n,e){if(n===e)return!0;const t=Object.keys(n),r=Object.keys(e);for(const s of t){if(!r.includes(s))return!1;const o=n[s],a=e[s];if(ua(o)&&ua(a)){if(!Ar(o,a))return!1}else if(o!==a)return!1}for(const s of r)if(!t.includes(s))return!1;return!0}function ua(n){return n!==null&&typeof n=="object"}/**
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
 */const zh=1e3,Hh=2,Gh=4*60*60*1e3,Kh=.5;function ha(n,e=zh,t=Hh){const r=e*Math.pow(t,n),s=Math.round(Kh*r*(Math.random()-.5)*2);return Math.min(Gh,r+s)}/**
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
 */function ke(n){return n&&n._delegate?n._delegate:n}class Fe{constructor(e,t,r){this.name=e,this.instanceFactory=t,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
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
 */class Wh{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const r=new xh;if(this.instancesDeferred.set(t,r),this.isInitialized(t)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:t});s&&r.resolve(s)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const r=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),s=(t=e==null?void 0:e.optional)!==null&&t!==void 0?t:!1;if(this.isInitialized(r)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:r})}catch(o){if(s)return null;throw o}else{if(s)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Yh(e))try{this.getOrInitializeService({instanceIdentifier:yt})}catch{}for(const[t,r]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(t);try{const o=this.getOrInitializeService({instanceIdentifier:s});r.resolve(o)}catch{}}}}clearInstance(e=yt){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=yt){return this.instances.has(e)}getOptions(e=yt){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:r,options:t});for(const[o,a]of this.instancesDeferred.entries()){const c=this.normalizeInstanceIdentifier(o);r===c&&a.resolve(s)}return s}onInit(e,t){var r;const s=this.normalizeInstanceIdentifier(t),o=(r=this.onInitCallbacks.get(s))!==null&&r!==void 0?r:new Set;o.add(e),this.onInitCallbacks.set(s,o);const a=this.instances.get(s);return a&&e(a,s),()=>{o.delete(e)}}invokeOnInitCallbacks(e,t){const r=this.onInitCallbacks.get(t);if(r)for(const s of r)try{s(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:Qh(e),options:t}),this.instances.set(e,r),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=yt){return this.component?this.component.multipleInstances?e:yt:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Qh(n){return n===yt?void 0:n}function Yh(n){return n.instantiationMode==="EAGER"}/**
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
 */class Xh{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new Wh(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
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
 */var H;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(H||(H={}));const Jh={debug:H.DEBUG,verbose:H.VERBOSE,info:H.INFO,warn:H.WARN,error:H.ERROR,silent:H.SILENT},Zh=H.INFO,ed={[H.DEBUG]:"log",[H.VERBOSE]:"log",[H.INFO]:"info",[H.WARN]:"warn",[H.ERROR]:"error"},td=(n,e,...t)=>{if(e<n.logLevel)return;const r=new Date().toISOString(),s=ed[e];if(s)console[s](`[${r}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class mi{constructor(e){this.name=e,this._logLevel=Zh,this._logHandler=td,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in H))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Jh[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,H.DEBUG,...e),this._logHandler(this,H.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,H.VERBOSE,...e),this._logHandler(this,H.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,H.INFO,...e),this._logHandler(this,H.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,H.WARN,...e),this._logHandler(this,H.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,H.ERROR,...e),this._logHandler(this,H.ERROR,...e)}}const nd=(n,e)=>e.some(t=>n instanceof t);let da,fa;function rd(){return da||(da=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function sd(){return fa||(fa=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Bl=new WeakMap,Hs=new WeakMap,Ul=new WeakMap,Ds=new WeakMap,pi=new WeakMap;function id(n){const e=new Promise((t,r)=>{const s=()=>{n.removeEventListener("success",o),n.removeEventListener("error",a)},o=()=>{t(rt(n.result)),s()},a=()=>{r(n.error),s()};n.addEventListener("success",o),n.addEventListener("error",a)});return e.then(t=>{t instanceof IDBCursor&&Bl.set(t,n)}).catch(()=>{}),pi.set(e,n),e}function od(n){if(Hs.has(n))return;const e=new Promise((t,r)=>{const s=()=>{n.removeEventListener("complete",o),n.removeEventListener("error",a),n.removeEventListener("abort",a)},o=()=>{t(),s()},a=()=>{r(n.error||new DOMException("AbortError","AbortError")),s()};n.addEventListener("complete",o),n.addEventListener("error",a),n.addEventListener("abort",a)});Hs.set(n,e)}let Gs={get(n,e,t){if(n instanceof IDBTransaction){if(e==="done")return Hs.get(n);if(e==="objectStoreNames")return n.objectStoreNames||Ul.get(n);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return rt(n[e])},set(n,e,t){return n[e]=t,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function ad(n){Gs=n(Gs)}function ld(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const r=n.call(Vs(this),e,...t);return Ul.set(r,e.sort?e.sort():[e]),rt(r)}:sd().includes(n)?function(...e){return n.apply(Vs(this),e),rt(Bl.get(this))}:function(...e){return rt(n.apply(Vs(this),e))}}function cd(n){return typeof n=="function"?ld(n):(n instanceof IDBTransaction&&od(n),nd(n,rd())?new Proxy(n,Gs):n)}function rt(n){if(n instanceof IDBRequest)return id(n);if(Ds.has(n))return Ds.get(n);const e=cd(n);return e!==n&&(Ds.set(n,e),pi.set(e,n)),e}const Vs=n=>pi.get(n);function $l(n,e,{blocked:t,upgrade:r,blocking:s,terminated:o}={}){const a=indexedDB.open(n,e),c=rt(a);return r&&a.addEventListener("upgradeneeded",h=>{r(rt(a.result),h.oldVersion,h.newVersion,rt(a.transaction),h)}),t&&a.addEventListener("blocked",h=>t(h.oldVersion,h.newVersion,h)),c.then(h=>{o&&h.addEventListener("close",()=>o()),s&&h.addEventListener("versionchange",d=>s(d.oldVersion,d.newVersion,d))}).catch(()=>{}),c}const ud=["get","getKey","getAll","getAllKeys","count"],hd=["put","add","delete","clear"],ks=new Map;function ma(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(ks.get(e))return ks.get(e);const t=e.replace(/FromIndex$/,""),r=e!==t,s=hd.includes(t);if(!(t in(r?IDBIndex:IDBObjectStore).prototype)||!(s||ud.includes(t)))return;const o=async function(a,...c){const h=this.transaction(a,s?"readwrite":"readonly");let d=h.store;return r&&(d=d.index(c.shift())),(await Promise.all([d[t](...c),s&&h.done]))[0]};return ks.set(e,o),o}ad(n=>({...n,get:(e,t,r)=>ma(e,t)||n.get(e,t,r),has:(e,t)=>!!ma(e,t)||n.has(e,t)}));/**
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
 */class dd{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(fd(t)){const r=t.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(t=>t).join(" ")}}function fd(n){const e=n.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Ks="@firebase/app",pa="0.10.13";/**
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
 */const Ge=new mi("@firebase/app"),md="@firebase/app-compat",pd="@firebase/analytics-compat",gd="@firebase/analytics",yd="@firebase/app-check-compat",_d="@firebase/app-check",vd="@firebase/auth",Ed="@firebase/auth-compat",Id="@firebase/database",Td="@firebase/data-connect",wd="@firebase/database-compat",Ad="@firebase/functions",bd="@firebase/functions-compat",Rd="@firebase/installations",Pd="@firebase/installations-compat",Sd="@firebase/messaging",Cd="@firebase/messaging-compat",Dd="@firebase/performance",Vd="@firebase/performance-compat",kd="@firebase/remote-config",Nd="@firebase/remote-config-compat",Od="@firebase/storage",xd="@firebase/storage-compat",Ld="@firebase/firestore",Md="@firebase/vertexai-preview",Fd="@firebase/firestore-compat",Bd="firebase",Ud="10.14.1";/**
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
 */const Ws="[DEFAULT]",$d={[Ks]:"fire-core",[md]:"fire-core-compat",[gd]:"fire-analytics",[pd]:"fire-analytics-compat",[_d]:"fire-app-check",[yd]:"fire-app-check-compat",[vd]:"fire-auth",[Ed]:"fire-auth-compat",[Id]:"fire-rtdb",[Td]:"fire-data-connect",[wd]:"fire-rtdb-compat",[Ad]:"fire-fn",[bd]:"fire-fn-compat",[Rd]:"fire-iid",[Pd]:"fire-iid-compat",[Sd]:"fire-fcm",[Cd]:"fire-fcm-compat",[Dd]:"fire-perf",[Vd]:"fire-perf-compat",[kd]:"fire-rc",[Nd]:"fire-rc-compat",[Od]:"fire-gcs",[xd]:"fire-gcs-compat",[Ld]:"fire-fst",[Fd]:"fire-fst-compat",[Md]:"fire-vertex","fire-js":"fire-js",[Bd]:"fire-js-all"};/**
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
 */const br=new Map,jd=new Map,Qs=new Map;function ga(n,e){try{n.container.addComponent(e)}catch(t){Ge.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function Ke(n){const e=n.name;if(Qs.has(e))return Ge.debug(`There were multiple attempts to register component ${e}.`),!1;Qs.set(e,n);for(const t of br.values())ga(t,n);for(const t of jd.values())ga(t,n);return!0}function Jt(n,e){const t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}/**
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
 */const qd={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},st=new jr("app","Firebase",qd);/**
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
 */class zd{constructor(e,t,r){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new Fe("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw st.create("app-deleted",{appName:this._name})}}/**
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
 */const jl=Ud;function ql(n,e={}){let t=n;typeof e!="object"&&(e={name:e});const r=Object.assign({name:Ws,automaticDataCollectionEnabled:!1},e),s=r.name;if(typeof s!="string"||!s)throw st.create("bad-app-name",{appName:String(s)});if(t||(t=xl()),!t)throw st.create("no-options");const o=br.get(s);if(o){if(Ar(t,o.options)&&Ar(r,o.config))return o;throw st.create("duplicate-app",{appName:s})}const a=new Xh(s);for(const h of Qs.values())a.addComponent(h);const c=new zd(t,r,a);return br.set(s,c),c}function gi(n=Ws){const e=br.get(n);if(!e&&n===Ws&&xl())return ql();if(!e)throw st.create("no-app",{appName:n});return e}function Ce(n,e,t){var r;let s=(r=$d[n])!==null&&r!==void 0?r:n;t&&(s+=`-${t}`);const o=s.match(/\s|\//),a=e.match(/\s|\//);if(o||a){const c=[`Unable to register library "${s}" with version "${e}":`];o&&c.push(`library name "${s}" contains illegal characters (whitespace or "/")`),o&&a&&c.push("and"),a&&c.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Ge.warn(c.join(" "));return}Ke(new Fe(`${s}-version`,()=>({library:s,version:e}),"VERSION"))}/**
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
 */const Hd="firebase-heartbeat-database",Gd=1,Vn="firebase-heartbeat-store";let Ns=null;function zl(){return Ns||(Ns=$l(Hd,Gd,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(Vn)}catch(t){console.warn(t)}}}}).catch(n=>{throw st.create("idb-open",{originalErrorMessage:n.message})})),Ns}async function Kd(n){try{const t=(await zl()).transaction(Vn),r=await t.objectStore(Vn).get(Hl(n));return await t.done,r}catch(e){if(e instanceof Ye)Ge.warn(e.message);else{const t=st.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Ge.warn(t.message)}}}async function ya(n,e){try{const r=(await zl()).transaction(Vn,"readwrite");await r.objectStore(Vn).put(e,Hl(n)),await r.done}catch(t){if(t instanceof Ye)Ge.warn(t.message);else{const r=st.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});Ge.warn(r.message)}}}function Hl(n){return`${n.name}!${n.options.appId}`}/**
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
 */const Wd=1024,Qd=30*24*60*60*1e3;class Yd{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new Jd(t),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,t;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),o=_a();return((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===o||this._heartbeatsCache.heartbeats.some(a=>a.date===o)?void 0:(this._heartbeatsCache.heartbeats.push({date:o,agent:s}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(a=>{const c=new Date(a.date).valueOf();return Date.now()-c<=Qd}),this._storage.overwrite(this._heartbeatsCache))}catch(r){Ge.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=_a(),{heartbeatsToSend:r,unsentEntries:s}=Xd(this._heartbeatsCache.heartbeats),o=wr(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=t,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),o}catch(t){return Ge.warn(t),""}}}function _a(){return new Date().toISOString().substring(0,10)}function Xd(n,e=Wd){const t=[];let r=n.slice();for(const s of n){const o=t.find(a=>a.agent===s.agent);if(o){if(o.dates.push(s.date),va(t)>e){o.dates.pop();break}}else if(t.push({agent:s.agent,dates:[s.date]}),va(t)>e){t.pop();break}r=r.slice(1)}return{heartbeatsToSend:t,unsentEntries:r}}class Jd{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Ml()?Fl().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await Kd(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const s=await this.read();return ya(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:s.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var t;if(await this._canUseIndexedDBPromise){const s=await this.read();return ya(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:s.lastSentHeartbeatDate,heartbeats:[...s.heartbeats,...e.heartbeats]})}else return}}function va(n){return wr(JSON.stringify({version:2,heartbeats:n})).length}/**
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
 */function Zd(n){Ke(new Fe("platform-logger",e=>new dd(e),"PRIVATE")),Ke(new Fe("heartbeat",e=>new Yd(e),"PRIVATE")),Ce(Ks,pa,n),Ce(Ks,pa,"esm2017"),Ce("fire-js","")}Zd("");var ef="firebase",tf="10.14.1";/**
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
 */Ce(ef,tf,"app");const Gl="@firebase/installations",yi="0.6.9";/**
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
 */const Kl=1e4,Wl=`w:${yi}`,Ql="FIS_v2",nf="https://firebaseinstallations.googleapis.com/v1",rf=60*60*1e3,sf="installations",of="Installations";/**
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
 */const af={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},Rt=new jr(sf,of,af);function Yl(n){return n instanceof Ye&&n.code.includes("request-failed")}/**
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
 */function Xl({projectId:n}){return`${nf}/projects/${n}/installations`}function Jl(n){return{token:n.token,requestStatus:2,expiresIn:cf(n.expiresIn),creationTime:Date.now()}}async function Zl(n,e){const r=(await e.json()).error;return Rt.create("request-failed",{requestName:n,serverCode:r.code,serverMessage:r.message,serverStatus:r.status})}function ec({apiKey:n}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":n})}function lf(n,{refreshToken:e}){const t=ec(n);return t.append("Authorization",uf(e)),t}async function tc(n){const e=await n();return e.status>=500&&e.status<600?n():e}function cf(n){return Number(n.replace("s","000"))}function uf(n){return`${Ql} ${n}`}/**
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
 */async function hf({appConfig:n,heartbeatServiceProvider:e},{fid:t}){const r=Xl(n),s=ec(n),o=e.getImmediate({optional:!0});if(o){const d=await o.getHeartbeatsHeader();d&&s.append("x-firebase-client",d)}const a={fid:t,authVersion:Ql,appId:n.appId,sdkVersion:Wl},c={method:"POST",headers:s,body:JSON.stringify(a)},h=await tc(()=>fetch(r,c));if(h.ok){const d=await h.json();return{fid:d.fid||t,registrationStatus:2,refreshToken:d.refreshToken,authToken:Jl(d.authToken)}}else throw await Zl("Create Installation",h)}/**
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
 */function nc(n){return new Promise(e=>{setTimeout(e,n)})}/**
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
 */function df(n){return btoa(String.fromCharCode(...n)).replace(/\+/g,"-").replace(/\//g,"_")}/**
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
 */const ff=/^[cdef][\w-]{21}$/,Ys="";function mf(){try{const n=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(n),n[0]=112+n[0]%16;const t=pf(n);return ff.test(t)?t:Ys}catch{return Ys}}function pf(n){return df(n).substr(0,22)}/**
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
 */function qr(n){return`${n.appName}!${n.appId}`}/**
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
 */const rc=new Map;function sc(n,e){const t=qr(n);ic(t,e),gf(t,e)}function ic(n,e){const t=rc.get(n);if(t)for(const r of t)r(e)}function gf(n,e){const t=yf();t&&t.postMessage({key:n,fid:e}),_f()}let Et=null;function yf(){return!Et&&"BroadcastChannel"in self&&(Et=new BroadcastChannel("[Firebase] FID Change"),Et.onmessage=n=>{ic(n.data.key,n.data.fid)}),Et}function _f(){rc.size===0&&Et&&(Et.close(),Et=null)}/**
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
 */const vf="firebase-installations-database",Ef=1,Pt="firebase-installations-store";let Os=null;function _i(){return Os||(Os=$l(vf,Ef,{upgrade:(n,e)=>{switch(e){case 0:n.createObjectStore(Pt)}}})),Os}async function Rr(n,e){const t=qr(n),s=(await _i()).transaction(Pt,"readwrite"),o=s.objectStore(Pt),a=await o.get(t);return await o.put(e,t),await s.done,(!a||a.fid!==e.fid)&&sc(n,e.fid),e}async function oc(n){const e=qr(n),r=(await _i()).transaction(Pt,"readwrite");await r.objectStore(Pt).delete(e),await r.done}async function zr(n,e){const t=qr(n),s=(await _i()).transaction(Pt,"readwrite"),o=s.objectStore(Pt),a=await o.get(t),c=e(a);return c===void 0?await o.delete(t):await o.put(c,t),await s.done,c&&(!a||a.fid!==c.fid)&&sc(n,c.fid),c}/**
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
 */async function vi(n){let e;const t=await zr(n.appConfig,r=>{const s=If(r),o=Tf(n,s);return e=o.registrationPromise,o.installationEntry});return t.fid===Ys?{installationEntry:await e}:{installationEntry:t,registrationPromise:e}}function If(n){const e=n||{fid:mf(),registrationStatus:0};return ac(e)}function Tf(n,e){if(e.registrationStatus===0){if(!navigator.onLine){const s=Promise.reject(Rt.create("app-offline"));return{installationEntry:e,registrationPromise:s}}const t={fid:e.fid,registrationStatus:1,registrationTime:Date.now()},r=wf(n,t);return{installationEntry:t,registrationPromise:r}}else return e.registrationStatus===1?{installationEntry:e,registrationPromise:Af(n)}:{installationEntry:e}}async function wf(n,e){try{const t=await hf(n,e);return Rr(n.appConfig,t)}catch(t){throw Yl(t)&&t.customData.serverCode===409?await oc(n.appConfig):await Rr(n.appConfig,{fid:e.fid,registrationStatus:0}),t}}async function Af(n){let e=await Ea(n.appConfig);for(;e.registrationStatus===1;)await nc(100),e=await Ea(n.appConfig);if(e.registrationStatus===0){const{installationEntry:t,registrationPromise:r}=await vi(n);return r||t}return e}function Ea(n){return zr(n,e=>{if(!e)throw Rt.create("installation-not-found");return ac(e)})}function ac(n){return bf(n)?{fid:n.fid,registrationStatus:0}:n}function bf(n){return n.registrationStatus===1&&n.registrationTime+Kl<Date.now()}/**
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
 */async function Rf({appConfig:n,heartbeatServiceProvider:e},t){const r=Pf(n,t),s=lf(n,t),o=e.getImmediate({optional:!0});if(o){const d=await o.getHeartbeatsHeader();d&&s.append("x-firebase-client",d)}const a={installation:{sdkVersion:Wl,appId:n.appId}},c={method:"POST",headers:s,body:JSON.stringify(a)},h=await tc(()=>fetch(r,c));if(h.ok){const d=await h.json();return Jl(d)}else throw await Zl("Generate Auth Token",h)}function Pf(n,{fid:e}){return`${Xl(n)}/${e}/authTokens:generate`}/**
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
 */async function Ei(n,e=!1){let t;const r=await zr(n.appConfig,o=>{if(!lc(o))throw Rt.create("not-registered");const a=o.authToken;if(!e&&Df(a))return o;if(a.requestStatus===1)return t=Sf(n,e),o;{if(!navigator.onLine)throw Rt.create("app-offline");const c=kf(o);return t=Cf(n,c),c}});return t?await t:r.authToken}async function Sf(n,e){let t=await Ia(n.appConfig);for(;t.authToken.requestStatus===1;)await nc(100),t=await Ia(n.appConfig);const r=t.authToken;return r.requestStatus===0?Ei(n,e):r}function Ia(n){return zr(n,e=>{if(!lc(e))throw Rt.create("not-registered");const t=e.authToken;return Nf(t)?Object.assign(Object.assign({},e),{authToken:{requestStatus:0}}):e})}async function Cf(n,e){try{const t=await Rf(n,e),r=Object.assign(Object.assign({},e),{authToken:t});return await Rr(n.appConfig,r),t}catch(t){if(Yl(t)&&(t.customData.serverCode===401||t.customData.serverCode===404))await oc(n.appConfig);else{const r=Object.assign(Object.assign({},e),{authToken:{requestStatus:0}});await Rr(n.appConfig,r)}throw t}}function lc(n){return n!==void 0&&n.registrationStatus===2}function Df(n){return n.requestStatus===2&&!Vf(n)}function Vf(n){const e=Date.now();return e<n.creationTime||n.creationTime+n.expiresIn<e+rf}function kf(n){const e={requestStatus:1,requestTime:Date.now()};return Object.assign(Object.assign({},n),{authToken:e})}function Nf(n){return n.requestStatus===1&&n.requestTime+Kl<Date.now()}/**
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
 */async function Of(n){const e=n,{installationEntry:t,registrationPromise:r}=await vi(e);return r?r.catch(console.error):Ei(e).catch(console.error),t.fid}/**
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
 */async function xf(n,e=!1){const t=n;return await Lf(t),(await Ei(t,e)).token}async function Lf(n){const{registrationPromise:e}=await vi(n);e&&await e}/**
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
 */function Mf(n){if(!n||!n.options)throw xs("App Configuration");if(!n.name)throw xs("App Name");const e=["projectId","apiKey","appId"];for(const t of e)if(!n.options[t])throw xs(t);return{appName:n.name,projectId:n.options.projectId,apiKey:n.options.apiKey,appId:n.options.appId}}function xs(n){return Rt.create("missing-app-config-values",{valueName:n})}/**
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
 */const cc="installations",Ff="installations-internal",Bf=n=>{const e=n.getProvider("app").getImmediate(),t=Mf(e),r=Jt(e,"heartbeat");return{app:e,appConfig:t,heartbeatServiceProvider:r,_delete:()=>Promise.resolve()}},Uf=n=>{const e=n.getProvider("app").getImmediate(),t=Jt(e,cc).getImmediate();return{getId:()=>Of(t),getToken:s=>xf(t,s)}};function $f(){Ke(new Fe(cc,Bf,"PUBLIC")),Ke(new Fe(Ff,Uf,"PRIVATE"))}$f();Ce(Gl,yi);Ce(Gl,yi,"esm2017");/**
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
 */const Pr="analytics",jf="firebase_id",qf="origin",zf=60*1e3,Hf="https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig",Ii="https://www.googletagmanager.com/gtag/js";/**
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
 */const we=new mi("@firebase/analytics");/**
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
 */const Gf={"already-exists":"A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.","already-initialized":"initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-initialized instance.","already-initialized-settings":"Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.","interop-component-reg-failed":"Firebase Analytics Interop Component failed to instantiate: {$reason}","invalid-analytics-context":"Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","indexeddb-unavailable":"IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","fetch-throttle":"The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.","config-fetch-failed":"Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}","no-api-key":'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',"no-app-id":'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.',"no-client-id":'The "client_id" field is empty.',"invalid-gtag-resource":"Trusted Types detected an invalid gtag resource: {$gtagURL}."},Pe=new jr("analytics","Analytics",Gf);/**
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
 */function Kf(n){if(!n.startsWith(Ii)){const e=Pe.create("invalid-gtag-resource",{gtagURL:n});return we.warn(e.message),""}return n}function uc(n){return Promise.all(n.map(e=>e.catch(t=>t)))}function Wf(n,e){let t;return window.trustedTypes&&(t=window.trustedTypes.createPolicy(n,e)),t}function Qf(n,e){const t=Wf("firebase-js-sdk-policy",{createScriptURL:Kf}),r=document.createElement("script"),s=`${Ii}?l=${n}&id=${e}`;r.src=t?t==null?void 0:t.createScriptURL(s):s,r.async=!0,document.head.appendChild(r)}function Yf(n){let e=[];return Array.isArray(window[n])?e=window[n]:window[n]=e,e}async function Xf(n,e,t,r,s,o){const a=r[s];try{if(a)await e[a];else{const h=(await uc(t)).find(d=>d.measurementId===s);h&&await e[h.appId]}}catch(c){we.error(c)}n("config",s,o)}async function Jf(n,e,t,r,s){try{let o=[];if(s&&s.send_to){let a=s.send_to;Array.isArray(a)||(a=[a]);const c=await uc(t);for(const h of a){const d=c.find(_=>_.measurementId===h),m=d&&e[d.appId];if(m)o.push(m);else{o=[];break}}}o.length===0&&(o=Object.values(e)),await Promise.all(o),n("event",r,s||{})}catch(o){we.error(o)}}function Zf(n,e,t,r){async function s(o,...a){try{if(o==="event"){const[c,h]=a;await Jf(n,e,t,c,h)}else if(o==="config"){const[c,h]=a;await Xf(n,e,t,r,c,h)}else if(o==="consent"){const[c,h]=a;n("consent",c,h)}else if(o==="get"){const[c,h,d]=a;n("get",c,h,d)}else if(o==="set"){const[c]=a;n("set",c)}else n(o,...a)}catch(c){we.error(c)}}return s}function em(n,e,t,r,s){let o=function(...a){window[r].push(arguments)};return window[s]&&typeof window[s]=="function"&&(o=window[s]),window[s]=Zf(o,n,e,t),{gtagCore:o,wrappedGtag:window[s]}}function tm(n){const e=window.document.getElementsByTagName("script");for(const t of Object.values(e))if(t.src&&t.src.includes(Ii)&&t.src.includes(n))return t;return null}/**
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
 */const nm=30,rm=1e3;class sm{constructor(e={},t=rm){this.throttleMetadata=e,this.intervalMillis=t}getThrottleMetadata(e){return this.throttleMetadata[e]}setThrottleMetadata(e,t){this.throttleMetadata[e]=t}deleteThrottleMetadata(e){delete this.throttleMetadata[e]}}const hc=new sm;function im(n){return new Headers({Accept:"application/json","x-goog-api-key":n})}async function om(n){var e;const{appId:t,apiKey:r}=n,s={method:"GET",headers:im(r)},o=Hf.replace("{app-id}",t),a=await fetch(o,s);if(a.status!==200&&a.status!==304){let c="";try{const h=await a.json();!((e=h.error)===null||e===void 0)&&e.message&&(c=h.error.message)}catch{}throw Pe.create("config-fetch-failed",{httpStatus:a.status,responseMessage:c})}return a.json()}async function am(n,e=hc,t){const{appId:r,apiKey:s,measurementId:o}=n.options;if(!r)throw Pe.create("no-app-id");if(!s){if(o)return{measurementId:o,appId:r};throw Pe.create("no-api-key")}const a=e.getThrottleMetadata(r)||{backoffCount:0,throttleEndTimeMillis:Date.now()},c=new um;return setTimeout(async()=>{c.abort()},zf),dc({appId:r,apiKey:s,measurementId:o},a,c,e)}async function dc(n,{throttleEndTimeMillis:e,backoffCount:t},r,s=hc){var o;const{appId:a,measurementId:c}=n;try{await lm(r,e)}catch(h){if(c)return we.warn(`Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${c} provided in the "measurementId" field in the local Firebase config. [${h==null?void 0:h.message}]`),{appId:a,measurementId:c};throw h}try{const h=await om(n);return s.deleteThrottleMetadata(a),h}catch(h){const d=h;if(!cm(d)){if(s.deleteThrottleMetadata(a),c)return we.warn(`Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${c} provided in the "measurementId" field in the local Firebase config. [${d==null?void 0:d.message}]`),{appId:a,measurementId:c};throw h}const m=Number((o=d==null?void 0:d.customData)===null||o===void 0?void 0:o.httpStatus)===503?ha(t,s.intervalMillis,nm):ha(t,s.intervalMillis),_={throttleEndTimeMillis:Date.now()+m,backoffCount:t+1};return s.setThrottleMetadata(a,_),we.debug(`Calling attemptFetch again in ${m} millis`),dc(n,_,r,s)}}function lm(n,e){return new Promise((t,r)=>{const s=Math.max(e-Date.now(),0),o=setTimeout(t,s);n.addEventListener(()=>{clearTimeout(o),r(Pe.create("fetch-throttle",{throttleEndTimeMillis:e}))})})}function cm(n){if(!(n instanceof Ye)||!n.customData)return!1;const e=Number(n.customData.httpStatus);return e===429||e===500||e===503||e===504}class um{constructor(){this.listeners=[]}addEventListener(e){this.listeners.push(e)}abort(){this.listeners.forEach(e=>e())}}async function hm(n,e,t,r,s){if(s&&s.global){n("event",t,r);return}else{const o=await e,a=Object.assign(Object.assign({},r),{send_to:o});n("event",t,a)}}/**
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
 */async function dm(){if(Ml())try{await Fl()}catch(n){return we.warn(Pe.create("indexeddb-unavailable",{errorInfo:n==null?void 0:n.toString()}).message),!1}else return we.warn(Pe.create("indexeddb-unavailable",{errorInfo:"IndexedDB is not available in this environment."}).message),!1;return!0}async function fm(n,e,t,r,s,o,a){var c;const h=am(n);h.then(b=>{t[b.measurementId]=b.appId,n.options.measurementId&&b.measurementId!==n.options.measurementId&&we.warn(`The measurement ID in the local Firebase config (${n.options.measurementId}) does not match the measurement ID fetched from the server (${b.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`)}).catch(b=>we.error(b)),e.push(h);const d=dm().then(b=>{if(b)return r.getId()}),[m,_]=await Promise.all([h,d]);tm(o)||Qf(o,m.measurementId),s("js",new Date);const w=(c=a==null?void 0:a.config)!==null&&c!==void 0?c:{};return w[qf]="firebase",w.update=!0,_!=null&&(w[jf]=_),s("config",m.measurementId,w),m.measurementId}/**
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
 */class mm{constructor(e){this.app=e}_delete(){return delete Rn[this.app.options.appId],Promise.resolve()}}let Rn={},Ta=[];const wa={};let Ls="dataLayer",pm="gtag",Aa,fc,ba=!1;function gm(){const n=[];if(Fh()&&n.push("This is a browser extension environment."),Uh()||n.push("Cookies are not available."),n.length>0){const e=n.map((r,s)=>`(${s+1}) ${r}`).join(" "),t=Pe.create("invalid-analytics-context",{errorInfo:e});we.warn(t.message)}}function ym(n,e,t){gm();const r=n.options.appId;if(!r)throw Pe.create("no-app-id");if(!n.options.apiKey)if(n.options.measurementId)we.warn(`The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${n.options.measurementId} provided in the "measurementId" field in the local Firebase config.`);else throw Pe.create("no-api-key");if(Rn[r]!=null)throw Pe.create("already-exists",{id:r});if(!ba){Yf(Ls);const{wrappedGtag:o,gtagCore:a}=em(Rn,Ta,wa,Ls,pm);fc=o,Aa=a,ba=!0}return Rn[r]=fm(n,Ta,wa,e,Aa,Ls,t),new mm(n)}function _m(n=gi()){n=ke(n);const e=Jt(n,Pr);return e.isInitialized()?e.getImmediate():vm(n)}function vm(n,e={}){const t=Jt(n,Pr);if(t.isInitialized()){const s=t.getImmediate();if(Ar(e,t.getOptions()))return s;throw Pe.create("already-initialized")}return t.initialize({options:e})}function Em(n,e,t,r){n=ke(n),hm(fc,Rn[n.app.options.appId],e,t,r).catch(s=>we.error(s))}const Ra="@firebase/analytics",Pa="0.10.8";function Im(){Ke(new Fe(Pr,(e,{options:t})=>{const r=e.getProvider("app").getImmediate(),s=e.getProvider("installations-internal").getImmediate();return ym(r,s,t)},"PUBLIC")),Ke(new Fe("analytics-internal",n,"PRIVATE")),Ce(Ra,Pa),Ce(Ra,Pa,"esm2017");function n(e){try{const t=e.getProvider(Pr).getImmediate();return{logEvent:(r,s,o)=>Em(t,r,s,o)}}catch(t){throw Pe.create("interop-component-reg-failed",{reason:t})}}}Im();var Sa=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var wt,mc;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(v,p){function y(){}y.prototype=p.prototype,v.D=p.prototype,v.prototype=new y,v.prototype.constructor=v,v.C=function(E,I,A){for(var g=Array(arguments.length-2),qe=2;qe<arguments.length;qe++)g[qe-2]=arguments[qe];return p.prototype[I].apply(E,g)}}function t(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(r,t),r.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(v,p,y){y||(y=0);var E=Array(16);if(typeof p=="string")for(var I=0;16>I;++I)E[I]=p.charCodeAt(y++)|p.charCodeAt(y++)<<8|p.charCodeAt(y++)<<16|p.charCodeAt(y++)<<24;else for(I=0;16>I;++I)E[I]=p[y++]|p[y++]<<8|p[y++]<<16|p[y++]<<24;p=v.g[0],y=v.g[1],I=v.g[2];var A=v.g[3],g=p+(A^y&(I^A))+E[0]+3614090360&4294967295;p=y+(g<<7&4294967295|g>>>25),g=A+(I^p&(y^I))+E[1]+3905402710&4294967295,A=p+(g<<12&4294967295|g>>>20),g=I+(y^A&(p^y))+E[2]+606105819&4294967295,I=A+(g<<17&4294967295|g>>>15),g=y+(p^I&(A^p))+E[3]+3250441966&4294967295,y=I+(g<<22&4294967295|g>>>10),g=p+(A^y&(I^A))+E[4]+4118548399&4294967295,p=y+(g<<7&4294967295|g>>>25),g=A+(I^p&(y^I))+E[5]+1200080426&4294967295,A=p+(g<<12&4294967295|g>>>20),g=I+(y^A&(p^y))+E[6]+2821735955&4294967295,I=A+(g<<17&4294967295|g>>>15),g=y+(p^I&(A^p))+E[7]+4249261313&4294967295,y=I+(g<<22&4294967295|g>>>10),g=p+(A^y&(I^A))+E[8]+1770035416&4294967295,p=y+(g<<7&4294967295|g>>>25),g=A+(I^p&(y^I))+E[9]+2336552879&4294967295,A=p+(g<<12&4294967295|g>>>20),g=I+(y^A&(p^y))+E[10]+4294925233&4294967295,I=A+(g<<17&4294967295|g>>>15),g=y+(p^I&(A^p))+E[11]+2304563134&4294967295,y=I+(g<<22&4294967295|g>>>10),g=p+(A^y&(I^A))+E[12]+1804603682&4294967295,p=y+(g<<7&4294967295|g>>>25),g=A+(I^p&(y^I))+E[13]+4254626195&4294967295,A=p+(g<<12&4294967295|g>>>20),g=I+(y^A&(p^y))+E[14]+2792965006&4294967295,I=A+(g<<17&4294967295|g>>>15),g=y+(p^I&(A^p))+E[15]+1236535329&4294967295,y=I+(g<<22&4294967295|g>>>10),g=p+(I^A&(y^I))+E[1]+4129170786&4294967295,p=y+(g<<5&4294967295|g>>>27),g=A+(y^I&(p^y))+E[6]+3225465664&4294967295,A=p+(g<<9&4294967295|g>>>23),g=I+(p^y&(A^p))+E[11]+643717713&4294967295,I=A+(g<<14&4294967295|g>>>18),g=y+(A^p&(I^A))+E[0]+3921069994&4294967295,y=I+(g<<20&4294967295|g>>>12),g=p+(I^A&(y^I))+E[5]+3593408605&4294967295,p=y+(g<<5&4294967295|g>>>27),g=A+(y^I&(p^y))+E[10]+38016083&4294967295,A=p+(g<<9&4294967295|g>>>23),g=I+(p^y&(A^p))+E[15]+3634488961&4294967295,I=A+(g<<14&4294967295|g>>>18),g=y+(A^p&(I^A))+E[4]+3889429448&4294967295,y=I+(g<<20&4294967295|g>>>12),g=p+(I^A&(y^I))+E[9]+568446438&4294967295,p=y+(g<<5&4294967295|g>>>27),g=A+(y^I&(p^y))+E[14]+3275163606&4294967295,A=p+(g<<9&4294967295|g>>>23),g=I+(p^y&(A^p))+E[3]+4107603335&4294967295,I=A+(g<<14&4294967295|g>>>18),g=y+(A^p&(I^A))+E[8]+1163531501&4294967295,y=I+(g<<20&4294967295|g>>>12),g=p+(I^A&(y^I))+E[13]+2850285829&4294967295,p=y+(g<<5&4294967295|g>>>27),g=A+(y^I&(p^y))+E[2]+4243563512&4294967295,A=p+(g<<9&4294967295|g>>>23),g=I+(p^y&(A^p))+E[7]+1735328473&4294967295,I=A+(g<<14&4294967295|g>>>18),g=y+(A^p&(I^A))+E[12]+2368359562&4294967295,y=I+(g<<20&4294967295|g>>>12),g=p+(y^I^A)+E[5]+4294588738&4294967295,p=y+(g<<4&4294967295|g>>>28),g=A+(p^y^I)+E[8]+2272392833&4294967295,A=p+(g<<11&4294967295|g>>>21),g=I+(A^p^y)+E[11]+1839030562&4294967295,I=A+(g<<16&4294967295|g>>>16),g=y+(I^A^p)+E[14]+4259657740&4294967295,y=I+(g<<23&4294967295|g>>>9),g=p+(y^I^A)+E[1]+2763975236&4294967295,p=y+(g<<4&4294967295|g>>>28),g=A+(p^y^I)+E[4]+1272893353&4294967295,A=p+(g<<11&4294967295|g>>>21),g=I+(A^p^y)+E[7]+4139469664&4294967295,I=A+(g<<16&4294967295|g>>>16),g=y+(I^A^p)+E[10]+3200236656&4294967295,y=I+(g<<23&4294967295|g>>>9),g=p+(y^I^A)+E[13]+681279174&4294967295,p=y+(g<<4&4294967295|g>>>28),g=A+(p^y^I)+E[0]+3936430074&4294967295,A=p+(g<<11&4294967295|g>>>21),g=I+(A^p^y)+E[3]+3572445317&4294967295,I=A+(g<<16&4294967295|g>>>16),g=y+(I^A^p)+E[6]+76029189&4294967295,y=I+(g<<23&4294967295|g>>>9),g=p+(y^I^A)+E[9]+3654602809&4294967295,p=y+(g<<4&4294967295|g>>>28),g=A+(p^y^I)+E[12]+3873151461&4294967295,A=p+(g<<11&4294967295|g>>>21),g=I+(A^p^y)+E[15]+530742520&4294967295,I=A+(g<<16&4294967295|g>>>16),g=y+(I^A^p)+E[2]+3299628645&4294967295,y=I+(g<<23&4294967295|g>>>9),g=p+(I^(y|~A))+E[0]+4096336452&4294967295,p=y+(g<<6&4294967295|g>>>26),g=A+(y^(p|~I))+E[7]+1126891415&4294967295,A=p+(g<<10&4294967295|g>>>22),g=I+(p^(A|~y))+E[14]+2878612391&4294967295,I=A+(g<<15&4294967295|g>>>17),g=y+(A^(I|~p))+E[5]+4237533241&4294967295,y=I+(g<<21&4294967295|g>>>11),g=p+(I^(y|~A))+E[12]+1700485571&4294967295,p=y+(g<<6&4294967295|g>>>26),g=A+(y^(p|~I))+E[3]+2399980690&4294967295,A=p+(g<<10&4294967295|g>>>22),g=I+(p^(A|~y))+E[10]+4293915773&4294967295,I=A+(g<<15&4294967295|g>>>17),g=y+(A^(I|~p))+E[1]+2240044497&4294967295,y=I+(g<<21&4294967295|g>>>11),g=p+(I^(y|~A))+E[8]+1873313359&4294967295,p=y+(g<<6&4294967295|g>>>26),g=A+(y^(p|~I))+E[15]+4264355552&4294967295,A=p+(g<<10&4294967295|g>>>22),g=I+(p^(A|~y))+E[6]+2734768916&4294967295,I=A+(g<<15&4294967295|g>>>17),g=y+(A^(I|~p))+E[13]+1309151649&4294967295,y=I+(g<<21&4294967295|g>>>11),g=p+(I^(y|~A))+E[4]+4149444226&4294967295,p=y+(g<<6&4294967295|g>>>26),g=A+(y^(p|~I))+E[11]+3174756917&4294967295,A=p+(g<<10&4294967295|g>>>22),g=I+(p^(A|~y))+E[2]+718787259&4294967295,I=A+(g<<15&4294967295|g>>>17),g=y+(A^(I|~p))+E[9]+3951481745&4294967295,v.g[0]=v.g[0]+p&4294967295,v.g[1]=v.g[1]+(I+(g<<21&4294967295|g>>>11))&4294967295,v.g[2]=v.g[2]+I&4294967295,v.g[3]=v.g[3]+A&4294967295}r.prototype.u=function(v,p){p===void 0&&(p=v.length);for(var y=p-this.blockSize,E=this.B,I=this.h,A=0;A<p;){if(I==0)for(;A<=y;)s(this,v,A),A+=this.blockSize;if(typeof v=="string"){for(;A<p;)if(E[I++]=v.charCodeAt(A++),I==this.blockSize){s(this,E),I=0;break}}else for(;A<p;)if(E[I++]=v[A++],I==this.blockSize){s(this,E),I=0;break}}this.h=I,this.o+=p},r.prototype.v=function(){var v=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);v[0]=128;for(var p=1;p<v.length-8;++p)v[p]=0;var y=8*this.o;for(p=v.length-8;p<v.length;++p)v[p]=y&255,y/=256;for(this.u(v),v=Array(16),p=y=0;4>p;++p)for(var E=0;32>E;E+=8)v[y++]=this.g[p]>>>E&255;return v};function o(v,p){var y=c;return Object.prototype.hasOwnProperty.call(y,v)?y[v]:y[v]=p(v)}function a(v,p){this.h=p;for(var y=[],E=!0,I=v.length-1;0<=I;I--){var A=v[I]|0;E&&A==p||(y[I]=A,E=!1)}this.g=y}var c={};function h(v){return-128<=v&&128>v?o(v,function(p){return new a([p|0],0>p?-1:0)}):new a([v|0],0>v?-1:0)}function d(v){if(isNaN(v)||!isFinite(v))return _;if(0>v)return S(d(-v));for(var p=[],y=1,E=0;v>=y;E++)p[E]=v/y|0,y*=4294967296;return new a(p,0)}function m(v,p){if(v.length==0)throw Error("number format error: empty string");if(p=p||10,2>p||36<p)throw Error("radix out of range: "+p);if(v.charAt(0)=="-")return S(m(v.substring(1),p));if(0<=v.indexOf("-"))throw Error('number format error: interior "-" character');for(var y=d(Math.pow(p,8)),E=_,I=0;I<v.length;I+=8){var A=Math.min(8,v.length-I),g=parseInt(v.substring(I,I+A),p);8>A?(A=d(Math.pow(p,A)),E=E.j(A).add(d(g))):(E=E.j(y),E=E.add(d(g)))}return E}var _=h(0),w=h(1),b=h(16777216);n=a.prototype,n.m=function(){if(k(this))return-S(this).m();for(var v=0,p=1,y=0;y<this.g.length;y++){var E=this.i(y);v+=(0<=E?E:4294967296+E)*p,p*=4294967296}return v},n.toString=function(v){if(v=v||10,2>v||36<v)throw Error("radix out of range: "+v);if(D(this))return"0";if(k(this))return"-"+S(this).toString(v);for(var p=d(Math.pow(v,6)),y=this,E="";;){var I=M(y,p).g;y=B(y,I.j(p));var A=((0<y.g.length?y.g[0]:y.h)>>>0).toString(v);if(y=I,D(y))return A+E;for(;6>A.length;)A="0"+A;E=A+E}},n.i=function(v){return 0>v?0:v<this.g.length?this.g[v]:this.h};function D(v){if(v.h!=0)return!1;for(var p=0;p<v.g.length;p++)if(v.g[p]!=0)return!1;return!0}function k(v){return v.h==-1}n.l=function(v){return v=B(this,v),k(v)?-1:D(v)?0:1};function S(v){for(var p=v.g.length,y=[],E=0;E<p;E++)y[E]=~v.g[E];return new a(y,~v.h).add(w)}n.abs=function(){return k(this)?S(this):this},n.add=function(v){for(var p=Math.max(this.g.length,v.g.length),y=[],E=0,I=0;I<=p;I++){var A=E+(this.i(I)&65535)+(v.i(I)&65535),g=(A>>>16)+(this.i(I)>>>16)+(v.i(I)>>>16);E=g>>>16,A&=65535,g&=65535,y[I]=g<<16|A}return new a(y,y[y.length-1]&-2147483648?-1:0)};function B(v,p){return v.add(S(p))}n.j=function(v){if(D(this)||D(v))return _;if(k(this))return k(v)?S(this).j(S(v)):S(S(this).j(v));if(k(v))return S(this.j(S(v)));if(0>this.l(b)&&0>v.l(b))return d(this.m()*v.m());for(var p=this.g.length+v.g.length,y=[],E=0;E<2*p;E++)y[E]=0;for(E=0;E<this.g.length;E++)for(var I=0;I<v.g.length;I++){var A=this.i(E)>>>16,g=this.i(E)&65535,qe=v.i(I)>>>16,nn=v.i(I)&65535;y[2*E+2*I]+=g*nn,L(y,2*E+2*I),y[2*E+2*I+1]+=A*nn,L(y,2*E+2*I+1),y[2*E+2*I+1]+=g*qe,L(y,2*E+2*I+1),y[2*E+2*I+2]+=A*qe,L(y,2*E+2*I+2)}for(E=0;E<p;E++)y[E]=y[2*E+1]<<16|y[2*E];for(E=p;E<2*p;E++)y[E]=0;return new a(y,0)};function L(v,p){for(;(v[p]&65535)!=v[p];)v[p+1]+=v[p]>>>16,v[p]&=65535,p++}function N(v,p){this.g=v,this.h=p}function M(v,p){if(D(p))throw Error("division by zero");if(D(v))return new N(_,_);if(k(v))return p=M(S(v),p),new N(S(p.g),S(p.h));if(k(p))return p=M(v,S(p)),new N(S(p.g),p.h);if(30<v.g.length){if(k(v)||k(p))throw Error("slowDivide_ only works with positive integers.");for(var y=w,E=p;0>=E.l(v);)y=X(y),E=X(E);var I=W(y,1),A=W(E,1);for(E=W(E,2),y=W(y,2);!D(E);){var g=A.add(E);0>=g.l(v)&&(I=I.add(y),A=g),E=W(E,1),y=W(y,1)}return p=B(v,I.j(p)),new N(I,p)}for(I=_;0<=v.l(p);){for(y=Math.max(1,Math.floor(v.m()/p.m())),E=Math.ceil(Math.log(y)/Math.LN2),E=48>=E?1:Math.pow(2,E-48),A=d(y),g=A.j(p);k(g)||0<g.l(v);)y-=E,A=d(y),g=A.j(p);D(A)&&(A=w),I=I.add(A),v=B(v,g)}return new N(I,v)}n.A=function(v){return M(this,v).h},n.and=function(v){for(var p=Math.max(this.g.length,v.g.length),y=[],E=0;E<p;E++)y[E]=this.i(E)&v.i(E);return new a(y,this.h&v.h)},n.or=function(v){for(var p=Math.max(this.g.length,v.g.length),y=[],E=0;E<p;E++)y[E]=this.i(E)|v.i(E);return new a(y,this.h|v.h)},n.xor=function(v){for(var p=Math.max(this.g.length,v.g.length),y=[],E=0;E<p;E++)y[E]=this.i(E)^v.i(E);return new a(y,this.h^v.h)};function X(v){for(var p=v.g.length+1,y=[],E=0;E<p;E++)y[E]=v.i(E)<<1|v.i(E-1)>>>31;return new a(y,v.h)}function W(v,p){var y=p>>5;p%=32;for(var E=v.g.length-y,I=[],A=0;A<E;A++)I[A]=0<p?v.i(A+y)>>>p|v.i(A+y+1)<<32-p:v.i(A+y);return new a(I,v.h)}r.prototype.digest=r.prototype.v,r.prototype.reset=r.prototype.s,r.prototype.update=r.prototype.u,mc=r,a.prototype.add=a.prototype.add,a.prototype.multiply=a.prototype.j,a.prototype.modulo=a.prototype.A,a.prototype.compare=a.prototype.l,a.prototype.toNumber=a.prototype.m,a.prototype.toString=a.prototype.toString,a.prototype.getBits=a.prototype.i,a.fromNumber=d,a.fromString=m,wt=a}).apply(typeof Sa<"u"?Sa:typeof self<"u"?self:typeof window<"u"?window:{});var fr=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var pc,Tn,gc,_r,Xs,yc,_c,vc;(function(){var n,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(i,l,u){return i==Array.prototype||i==Object.prototype||(i[l]=u.value),i};function t(i){i=[typeof globalThis=="object"&&globalThis,i,typeof window=="object"&&window,typeof self=="object"&&self,typeof fr=="object"&&fr];for(var l=0;l<i.length;++l){var u=i[l];if(u&&u.Math==Math)return u}throw Error("Cannot find global object")}var r=t(this);function s(i,l){if(l)e:{var u=r;i=i.split(".");for(var f=0;f<i.length-1;f++){var T=i[f];if(!(T in u))break e;u=u[T]}i=i[i.length-1],f=u[i],l=l(f),l!=f&&l!=null&&e(u,i,{configurable:!0,writable:!0,value:l})}}function o(i,l){i instanceof String&&(i+="");var u=0,f=!1,T={next:function(){if(!f&&u<i.length){var R=u++;return{value:l(R,i[R]),done:!1}}return f=!0,{done:!0,value:void 0}}};return T[Symbol.iterator]=function(){return T},T}s("Array.prototype.values",function(i){return i||function(){return o(this,function(l,u){return u})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var a=a||{},c=this||self;function h(i){var l=typeof i;return l=l!="object"?l:i?Array.isArray(i)?"array":l:"null",l=="array"||l=="object"&&typeof i.length=="number"}function d(i){var l=typeof i;return l=="object"&&i!=null||l=="function"}function m(i,l,u){return i.call.apply(i.bind,arguments)}function _(i,l,u){if(!i)throw Error();if(2<arguments.length){var f=Array.prototype.slice.call(arguments,2);return function(){var T=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(T,f),i.apply(l,T)}}return function(){return i.apply(l,arguments)}}function w(i,l,u){return w=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?m:_,w.apply(null,arguments)}function b(i,l){var u=Array.prototype.slice.call(arguments,1);return function(){var f=u.slice();return f.push.apply(f,arguments),i.apply(this,f)}}function D(i,l){function u(){}u.prototype=l.prototype,i.aa=l.prototype,i.prototype=new u,i.prototype.constructor=i,i.Qb=function(f,T,R){for(var V=Array(arguments.length-2),Y=2;Y<arguments.length;Y++)V[Y-2]=arguments[Y];return l.prototype[T].apply(f,V)}}function k(i){const l=i.length;if(0<l){const u=Array(l);for(let f=0;f<l;f++)u[f]=i[f];return u}return[]}function S(i,l){for(let u=1;u<arguments.length;u++){const f=arguments[u];if(h(f)){const T=i.length||0,R=f.length||0;i.length=T+R;for(let V=0;V<R;V++)i[T+V]=f[V]}else i.push(f)}}class B{constructor(l,u){this.i=l,this.j=u,this.h=0,this.g=null}get(){let l;return 0<this.h?(this.h--,l=this.g,this.g=l.next,l.next=null):l=this.i(),l}}function L(i){return/^[\s\xa0]*$/.test(i)}function N(){var i=c.navigator;return i&&(i=i.userAgent)?i:""}function M(i){return M[" "](i),i}M[" "]=function(){};var X=N().indexOf("Gecko")!=-1&&!(N().toLowerCase().indexOf("webkit")!=-1&&N().indexOf("Edge")==-1)&&!(N().indexOf("Trident")!=-1||N().indexOf("MSIE")!=-1)&&N().indexOf("Edge")==-1;function W(i,l,u){for(const f in i)l.call(u,i[f],f,i)}function v(i,l){for(const u in i)l.call(void 0,i[u],u,i)}function p(i){const l={};for(const u in i)l[u]=i[u];return l}const y="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function E(i,l){let u,f;for(let T=1;T<arguments.length;T++){f=arguments[T];for(u in f)i[u]=f[u];for(let R=0;R<y.length;R++)u=y[R],Object.prototype.hasOwnProperty.call(f,u)&&(i[u]=f[u])}}function I(i){var l=1;i=i.split(":");const u=[];for(;0<l&&i.length;)u.push(i.shift()),l--;return i.length&&u.push(i.join(":")),u}function A(i){c.setTimeout(()=>{throw i},0)}function g(){var i=os;let l=null;return i.g&&(l=i.g,i.g=i.g.next,i.g||(i.h=null),l.next=null),l}class qe{constructor(){this.h=this.g=null}add(l,u){const f=nn.get();f.set(l,u),this.h?this.h.next=f:this.g=f,this.h=f}}var nn=new B(()=>new Hu,i=>i.reset());class Hu{constructor(){this.next=this.g=this.h=null}set(l,u){this.h=l,this.g=u,this.next=null}reset(){this.next=this.g=this.h=null}}let rn,sn=!1,os=new qe,lo=()=>{const i=c.Promise.resolve(void 0);rn=()=>{i.then(Gu)}};var Gu=()=>{for(var i;i=g();){try{i.h.call(i.g)}catch(u){A(u)}var l=nn;l.j(i),100>l.h&&(l.h++,i.next=l.g,l.g=i)}sn=!1};function Xe(){this.s=this.s,this.C=this.C}Xe.prototype.s=!1,Xe.prototype.ma=function(){this.s||(this.s=!0,this.N())},Xe.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function de(i,l){this.type=i,this.g=this.target=l,this.defaultPrevented=!1}de.prototype.h=function(){this.defaultPrevented=!0};var Ku=function(){if(!c.addEventListener||!Object.defineProperty)return!1;var i=!1,l=Object.defineProperty({},"passive",{get:function(){i=!0}});try{const u=()=>{};c.addEventListener("test",u,l),c.removeEventListener("test",u,l)}catch{}return i}();function on(i,l){if(de.call(this,i?i.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,i){var u=this.type=i.type,f=i.changedTouches&&i.changedTouches.length?i.changedTouches[0]:null;if(this.target=i.target||i.srcElement,this.g=l,l=i.relatedTarget){if(X){e:{try{M(l.nodeName);var T=!0;break e}catch{}T=!1}T||(l=null)}}else u=="mouseover"?l=i.fromElement:u=="mouseout"&&(l=i.toElement);this.relatedTarget=l,f?(this.clientX=f.clientX!==void 0?f.clientX:f.pageX,this.clientY=f.clientY!==void 0?f.clientY:f.pageY,this.screenX=f.screenX||0,this.screenY=f.screenY||0):(this.clientX=i.clientX!==void 0?i.clientX:i.pageX,this.clientY=i.clientY!==void 0?i.clientY:i.pageY,this.screenX=i.screenX||0,this.screenY=i.screenY||0),this.button=i.button,this.key=i.key||"",this.ctrlKey=i.ctrlKey,this.altKey=i.altKey,this.shiftKey=i.shiftKey,this.metaKey=i.metaKey,this.pointerId=i.pointerId||0,this.pointerType=typeof i.pointerType=="string"?i.pointerType:Wu[i.pointerType]||"",this.state=i.state,this.i=i,i.defaultPrevented&&on.aa.h.call(this)}}D(on,de);var Wu={2:"touch",3:"pen",4:"mouse"};on.prototype.h=function(){on.aa.h.call(this);var i=this.i;i.preventDefault?i.preventDefault():i.returnValue=!1};var Wn="closure_listenable_"+(1e6*Math.random()|0),Qu=0;function Yu(i,l,u,f,T){this.listener=i,this.proxy=null,this.src=l,this.type=u,this.capture=!!f,this.ha=T,this.key=++Qu,this.da=this.fa=!1}function Qn(i){i.da=!0,i.listener=null,i.proxy=null,i.src=null,i.ha=null}function Yn(i){this.src=i,this.g={},this.h=0}Yn.prototype.add=function(i,l,u,f,T){var R=i.toString();i=this.g[R],i||(i=this.g[R]=[],this.h++);var V=ls(i,l,f,T);return-1<V?(l=i[V],u||(l.fa=!1)):(l=new Yu(l,this.src,R,!!f,T),l.fa=u,i.push(l)),l};function as(i,l){var u=l.type;if(u in i.g){var f=i.g[u],T=Array.prototype.indexOf.call(f,l,void 0),R;(R=0<=T)&&Array.prototype.splice.call(f,T,1),R&&(Qn(l),i.g[u].length==0&&(delete i.g[u],i.h--))}}function ls(i,l,u,f){for(var T=0;T<i.length;++T){var R=i[T];if(!R.da&&R.listener==l&&R.capture==!!u&&R.ha==f)return T}return-1}var cs="closure_lm_"+(1e6*Math.random()|0),us={};function co(i,l,u,f,T){if(Array.isArray(l)){for(var R=0;R<l.length;R++)co(i,l[R],u,f,T);return null}return u=fo(u),i&&i[Wn]?i.K(l,u,d(f)?!!f.capture:!1,T):Xu(i,l,u,!1,f,T)}function Xu(i,l,u,f,T,R){if(!l)throw Error("Invalid event type");var V=d(T)?!!T.capture:!!T,Y=ds(i);if(Y||(i[cs]=Y=new Yn(i)),u=Y.add(l,u,f,V,R),u.proxy)return u;if(f=Ju(),u.proxy=f,f.src=i,f.listener=u,i.addEventListener)Ku||(T=V),T===void 0&&(T=!1),i.addEventListener(l.toString(),f,T);else if(i.attachEvent)i.attachEvent(ho(l.toString()),f);else if(i.addListener&&i.removeListener)i.addListener(f);else throw Error("addEventListener and attachEvent are unavailable.");return u}function Ju(){function i(u){return l.call(i.src,i.listener,u)}const l=Zu;return i}function uo(i,l,u,f,T){if(Array.isArray(l))for(var R=0;R<l.length;R++)uo(i,l[R],u,f,T);else f=d(f)?!!f.capture:!!f,u=fo(u),i&&i[Wn]?(i=i.i,l=String(l).toString(),l in i.g&&(R=i.g[l],u=ls(R,u,f,T),-1<u&&(Qn(R[u]),Array.prototype.splice.call(R,u,1),R.length==0&&(delete i.g[l],i.h--)))):i&&(i=ds(i))&&(l=i.g[l.toString()],i=-1,l&&(i=ls(l,u,f,T)),(u=-1<i?l[i]:null)&&hs(u))}function hs(i){if(typeof i!="number"&&i&&!i.da){var l=i.src;if(l&&l[Wn])as(l.i,i);else{var u=i.type,f=i.proxy;l.removeEventListener?l.removeEventListener(u,f,i.capture):l.detachEvent?l.detachEvent(ho(u),f):l.addListener&&l.removeListener&&l.removeListener(f),(u=ds(l))?(as(u,i),u.h==0&&(u.src=null,l[cs]=null)):Qn(i)}}}function ho(i){return i in us?us[i]:us[i]="on"+i}function Zu(i,l){if(i.da)i=!0;else{l=new on(l,this);var u=i.listener,f=i.ha||i.src;i.fa&&hs(i),i=u.call(f,l)}return i}function ds(i){return i=i[cs],i instanceof Yn?i:null}var fs="__closure_events_fn_"+(1e9*Math.random()>>>0);function fo(i){return typeof i=="function"?i:(i[fs]||(i[fs]=function(l){return i.handleEvent(l)}),i[fs])}function fe(){Xe.call(this),this.i=new Yn(this),this.M=this,this.F=null}D(fe,Xe),fe.prototype[Wn]=!0,fe.prototype.removeEventListener=function(i,l,u,f){uo(this,i,l,u,f)};function ve(i,l){var u,f=i.F;if(f)for(u=[];f;f=f.F)u.push(f);if(i=i.M,f=l.type||l,typeof l=="string")l=new de(l,i);else if(l instanceof de)l.target=l.target||i;else{var T=l;l=new de(f,i),E(l,T)}if(T=!0,u)for(var R=u.length-1;0<=R;R--){var V=l.g=u[R];T=Xn(V,f,!0,l)&&T}if(V=l.g=i,T=Xn(V,f,!0,l)&&T,T=Xn(V,f,!1,l)&&T,u)for(R=0;R<u.length;R++)V=l.g=u[R],T=Xn(V,f,!1,l)&&T}fe.prototype.N=function(){if(fe.aa.N.call(this),this.i){var i=this.i,l;for(l in i.g){for(var u=i.g[l],f=0;f<u.length;f++)Qn(u[f]);delete i.g[l],i.h--}}this.F=null},fe.prototype.K=function(i,l,u,f){return this.i.add(String(i),l,!1,u,f)},fe.prototype.L=function(i,l,u,f){return this.i.add(String(i),l,!0,u,f)};function Xn(i,l,u,f){if(l=i.i.g[String(l)],!l)return!0;l=l.concat();for(var T=!0,R=0;R<l.length;++R){var V=l[R];if(V&&!V.da&&V.capture==u){var Y=V.listener,ae=V.ha||V.src;V.fa&&as(i.i,V),T=Y.call(ae,f)!==!1&&T}}return T&&!f.defaultPrevented}function mo(i,l,u){if(typeof i=="function")u&&(i=w(i,u));else if(i&&typeof i.handleEvent=="function")i=w(i.handleEvent,i);else throw Error("Invalid listener argument");return 2147483647<Number(l)?-1:c.setTimeout(i,l||0)}function po(i){i.g=mo(()=>{i.g=null,i.i&&(i.i=!1,po(i))},i.l);const l=i.h;i.h=null,i.m.apply(null,l)}class eh extends Xe{constructor(l,u){super(),this.m=l,this.l=u,this.h=null,this.i=!1,this.g=null}j(l){this.h=arguments,this.g?this.i=!0:po(this)}N(){super.N(),this.g&&(c.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function an(i){Xe.call(this),this.h=i,this.g={}}D(an,Xe);var go=[];function yo(i){W(i.g,function(l,u){this.g.hasOwnProperty(u)&&hs(l)},i),i.g={}}an.prototype.N=function(){an.aa.N.call(this),yo(this)},an.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var ms=c.JSON.stringify,th=c.JSON.parse,nh=class{stringify(i){return c.JSON.stringify(i,void 0)}parse(i){return c.JSON.parse(i,void 0)}};function ps(){}ps.prototype.h=null;function _o(i){return i.h||(i.h=i.i())}function vo(){}var ln={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function gs(){de.call(this,"d")}D(gs,de);function ys(){de.call(this,"c")}D(ys,de);var ft={},Eo=null;function Jn(){return Eo=Eo||new fe}ft.La="serverreachability";function Io(i){de.call(this,ft.La,i)}D(Io,de);function cn(i){const l=Jn();ve(l,new Io(l))}ft.STAT_EVENT="statevent";function To(i,l){de.call(this,ft.STAT_EVENT,i),this.stat=l}D(To,de);function Ee(i){const l=Jn();ve(l,new To(l,i))}ft.Ma="timingevent";function wo(i,l){de.call(this,ft.Ma,i),this.size=l}D(wo,de);function un(i,l){if(typeof i!="function")throw Error("Fn must not be null and must be a function");return c.setTimeout(function(){i()},l)}function hn(){this.g=!0}hn.prototype.xa=function(){this.g=!1};function rh(i,l,u,f,T,R){i.info(function(){if(i.g)if(R)for(var V="",Y=R.split("&"),ae=0;ae<Y.length;ae++){var G=Y[ae].split("=");if(1<G.length){var me=G[0];G=G[1];var pe=me.split("_");V=2<=pe.length&&pe[1]=="type"?V+(me+"="+G+"&"):V+(me+"=redacted&")}}else V=null;else V=R;return"XMLHTTP REQ ("+f+") [attempt "+T+"]: "+l+`
`+u+`
`+V})}function sh(i,l,u,f,T,R,V){i.info(function(){return"XMLHTTP RESP ("+f+") [ attempt "+T+"]: "+l+`
`+u+`
`+R+" "+V})}function xt(i,l,u,f){i.info(function(){return"XMLHTTP TEXT ("+l+"): "+oh(i,u)+(f?" "+f:"")})}function ih(i,l){i.info(function(){return"TIMEOUT: "+l})}hn.prototype.info=function(){};function oh(i,l){if(!i.g)return l;if(!l)return null;try{var u=JSON.parse(l);if(u){for(i=0;i<u.length;i++)if(Array.isArray(u[i])){var f=u[i];if(!(2>f.length)){var T=f[1];if(Array.isArray(T)&&!(1>T.length)){var R=T[0];if(R!="noop"&&R!="stop"&&R!="close")for(var V=1;V<T.length;V++)T[V]=""}}}}return ms(u)}catch{return l}}var Zn={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},Ao={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},_s;function er(){}D(er,ps),er.prototype.g=function(){return new XMLHttpRequest},er.prototype.i=function(){return{}},_s=new er;function Je(i,l,u,f){this.j=i,this.i=l,this.l=u,this.R=f||1,this.U=new an(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new bo}function bo(){this.i=null,this.g="",this.h=!1}var Ro={},vs={};function Es(i,l,u){i.L=1,i.v=sr(ze(l)),i.m=u,i.P=!0,Po(i,null)}function Po(i,l){i.F=Date.now(),tr(i),i.A=ze(i.v);var u=i.A,f=i.R;Array.isArray(f)||(f=[String(f)]),$o(u.i,"t",f),i.C=0,u=i.j.J,i.h=new bo,i.g=ia(i.j,u?l:null,!i.m),0<i.O&&(i.M=new eh(w(i.Y,i,i.g),i.O)),l=i.U,u=i.g,f=i.ca;var T="readystatechange";Array.isArray(T)||(T&&(go[0]=T.toString()),T=go);for(var R=0;R<T.length;R++){var V=co(u,T[R],f||l.handleEvent,!1,l.h||l);if(!V)break;l.g[V.key]=V}l=i.H?p(i.H):{},i.m?(i.u||(i.u="POST"),l["Content-Type"]="application/x-www-form-urlencoded",i.g.ea(i.A,i.u,i.m,l)):(i.u="GET",i.g.ea(i.A,i.u,null,l)),cn(),rh(i.i,i.u,i.A,i.l,i.R,i.m)}Je.prototype.ca=function(i){i=i.target;const l=this.M;l&&He(i)==3?l.j():this.Y(i)},Je.prototype.Y=function(i){try{if(i==this.g)e:{const pe=He(this.g);var l=this.g.Ba();const Ft=this.g.Z();if(!(3>pe)&&(pe!=3||this.g&&(this.h.h||this.g.oa()||Wo(this.g)))){this.J||pe!=4||l==7||(l==8||0>=Ft?cn(3):cn(2)),Is(this);var u=this.g.Z();this.X=u;t:if(So(this)){var f=Wo(this.g);i="";var T=f.length,R=He(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){mt(this),dn(this);var V="";break t}this.h.i=new c.TextDecoder}for(l=0;l<T;l++)this.h.h=!0,i+=this.h.i.decode(f[l],{stream:!(R&&l==T-1)});f.length=0,this.h.g+=i,this.C=0,V=this.h.g}else V=this.g.oa();if(this.o=u==200,sh(this.i,this.u,this.A,this.l,this.R,pe,u),this.o){if(this.T&&!this.K){t:{if(this.g){var Y,ae=this.g;if((Y=ae.g?ae.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!L(Y)){var G=Y;break t}}G=null}if(u=G)xt(this.i,this.l,u,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,Ts(this,u);else{this.o=!1,this.s=3,Ee(12),mt(this),dn(this);break e}}if(this.P){u=!0;let Ne;for(;!this.J&&this.C<V.length;)if(Ne=ah(this,V),Ne==vs){pe==4&&(this.s=4,Ee(14),u=!1),xt(this.i,this.l,null,"[Incomplete Response]");break}else if(Ne==Ro){this.s=4,Ee(15),xt(this.i,this.l,V,"[Invalid Chunk]"),u=!1;break}else xt(this.i,this.l,Ne,null),Ts(this,Ne);if(So(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),pe!=4||V.length!=0||this.h.h||(this.s=1,Ee(16),u=!1),this.o=this.o&&u,!u)xt(this.i,this.l,V,"[Invalid Chunked Response]"),mt(this),dn(this);else if(0<V.length&&!this.W){this.W=!0;var me=this.j;me.g==this&&me.ba&&!me.M&&(me.j.info("Great, no buffering proxy detected. Bytes received: "+V.length),Ss(me),me.M=!0,Ee(11))}}else xt(this.i,this.l,V,null),Ts(this,V);pe==4&&mt(this),this.o&&!this.J&&(pe==4?ta(this.j,this):(this.o=!1,tr(this)))}else Ah(this.g),u==400&&0<V.indexOf("Unknown SID")?(this.s=3,Ee(12)):(this.s=0,Ee(13)),mt(this),dn(this)}}}catch{}finally{}};function So(i){return i.g?i.u=="GET"&&i.L!=2&&i.j.Ca:!1}function ah(i,l){var u=i.C,f=l.indexOf(`
`,u);return f==-1?vs:(u=Number(l.substring(u,f)),isNaN(u)?Ro:(f+=1,f+u>l.length?vs:(l=l.slice(f,f+u),i.C=f+u,l)))}Je.prototype.cancel=function(){this.J=!0,mt(this)};function tr(i){i.S=Date.now()+i.I,Co(i,i.I)}function Co(i,l){if(i.B!=null)throw Error("WatchDog timer not null");i.B=un(w(i.ba,i),l)}function Is(i){i.B&&(c.clearTimeout(i.B),i.B=null)}Je.prototype.ba=function(){this.B=null;const i=Date.now();0<=i-this.S?(ih(this.i,this.A),this.L!=2&&(cn(),Ee(17)),mt(this),this.s=2,dn(this)):Co(this,this.S-i)};function dn(i){i.j.G==0||i.J||ta(i.j,i)}function mt(i){Is(i);var l=i.M;l&&typeof l.ma=="function"&&l.ma(),i.M=null,yo(i.U),i.g&&(l=i.g,i.g=null,l.abort(),l.ma())}function Ts(i,l){try{var u=i.j;if(u.G!=0&&(u.g==i||ws(u.h,i))){if(!i.K&&ws(u.h,i)&&u.G==3){try{var f=u.Da.g.parse(l)}catch{f=null}if(Array.isArray(f)&&f.length==3){var T=f;if(T[0]==0){e:if(!u.u){if(u.g)if(u.g.F+3e3<i.F)ur(u),lr(u);else break e;Ps(u),Ee(18)}}else u.za=T[1],0<u.za-u.T&&37500>T[2]&&u.F&&u.v==0&&!u.C&&(u.C=un(w(u.Za,u),6e3));if(1>=ko(u.h)&&u.ca){try{u.ca()}catch{}u.ca=void 0}}else gt(u,11)}else if((i.K||u.g==i)&&ur(u),!L(l))for(T=u.Da.g.parse(l),l=0;l<T.length;l++){let G=T[l];if(u.T=G[0],G=G[1],u.G==2)if(G[0]=="c"){u.K=G[1],u.ia=G[2];const me=G[3];me!=null&&(u.la=me,u.j.info("VER="+u.la));const pe=G[4];pe!=null&&(u.Aa=pe,u.j.info("SVER="+u.Aa));const Ft=G[5];Ft!=null&&typeof Ft=="number"&&0<Ft&&(f=1.5*Ft,u.L=f,u.j.info("backChannelRequestTimeoutMs_="+f)),f=u;const Ne=i.g;if(Ne){const dr=Ne.g?Ne.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(dr){var R=f.h;R.g||dr.indexOf("spdy")==-1&&dr.indexOf("quic")==-1&&dr.indexOf("h2")==-1||(R.j=R.l,R.g=new Set,R.h&&(As(R,R.h),R.h=null))}if(f.D){const Cs=Ne.g?Ne.g.getResponseHeader("X-HTTP-Session-Id"):null;Cs&&(f.ya=Cs,J(f.I,f.D,Cs))}}u.G=3,u.l&&u.l.ua(),u.ba&&(u.R=Date.now()-i.F,u.j.info("Handshake RTT: "+u.R+"ms")),f=u;var V=i;if(f.qa=sa(f,f.J?f.ia:null,f.W),V.K){No(f.h,V);var Y=V,ae=f.L;ae&&(Y.I=ae),Y.B&&(Is(Y),tr(Y)),f.g=V}else Zo(f);0<u.i.length&&cr(u)}else G[0]!="stop"&&G[0]!="close"||gt(u,7);else u.G==3&&(G[0]=="stop"||G[0]=="close"?G[0]=="stop"?gt(u,7):Rs(u):G[0]!="noop"&&u.l&&u.l.ta(G),u.v=0)}}cn(4)}catch{}}var lh=class{constructor(i,l){this.g=i,this.map=l}};function Do(i){this.l=i||10,c.PerformanceNavigationTiming?(i=c.performance.getEntriesByType("navigation"),i=0<i.length&&(i[0].nextHopProtocol=="hq"||i[0].nextHopProtocol=="h2")):i=!!(c.chrome&&c.chrome.loadTimes&&c.chrome.loadTimes()&&c.chrome.loadTimes().wasFetchedViaSpdy),this.j=i?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function Vo(i){return i.h?!0:i.g?i.g.size>=i.j:!1}function ko(i){return i.h?1:i.g?i.g.size:0}function ws(i,l){return i.h?i.h==l:i.g?i.g.has(l):!1}function As(i,l){i.g?i.g.add(l):i.h=l}function No(i,l){i.h&&i.h==l?i.h=null:i.g&&i.g.has(l)&&i.g.delete(l)}Do.prototype.cancel=function(){if(this.i=Oo(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const i of this.g.values())i.cancel();this.g.clear()}};function Oo(i){if(i.h!=null)return i.i.concat(i.h.D);if(i.g!=null&&i.g.size!==0){let l=i.i;for(const u of i.g.values())l=l.concat(u.D);return l}return k(i.i)}function ch(i){if(i.V&&typeof i.V=="function")return i.V();if(typeof Map<"u"&&i instanceof Map||typeof Set<"u"&&i instanceof Set)return Array.from(i.values());if(typeof i=="string")return i.split("");if(h(i)){for(var l=[],u=i.length,f=0;f<u;f++)l.push(i[f]);return l}l=[],u=0;for(f in i)l[u++]=i[f];return l}function uh(i){if(i.na&&typeof i.na=="function")return i.na();if(!i.V||typeof i.V!="function"){if(typeof Map<"u"&&i instanceof Map)return Array.from(i.keys());if(!(typeof Set<"u"&&i instanceof Set)){if(h(i)||typeof i=="string"){var l=[];i=i.length;for(var u=0;u<i;u++)l.push(u);return l}l=[],u=0;for(const f in i)l[u++]=f;return l}}}function xo(i,l){if(i.forEach&&typeof i.forEach=="function")i.forEach(l,void 0);else if(h(i)||typeof i=="string")Array.prototype.forEach.call(i,l,void 0);else for(var u=uh(i),f=ch(i),T=f.length,R=0;R<T;R++)l.call(void 0,f[R],u&&u[R],i)}var Lo=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function hh(i,l){if(i){i=i.split("&");for(var u=0;u<i.length;u++){var f=i[u].indexOf("="),T=null;if(0<=f){var R=i[u].substring(0,f);T=i[u].substring(f+1)}else R=i[u];l(R,T?decodeURIComponent(T.replace(/\+/g," ")):"")}}}function pt(i){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,i instanceof pt){this.h=i.h,nr(this,i.j),this.o=i.o,this.g=i.g,rr(this,i.s),this.l=i.l;var l=i.i,u=new pn;u.i=l.i,l.g&&(u.g=new Map(l.g),u.h=l.h),Mo(this,u),this.m=i.m}else i&&(l=String(i).match(Lo))?(this.h=!1,nr(this,l[1]||"",!0),this.o=fn(l[2]||""),this.g=fn(l[3]||"",!0),rr(this,l[4]),this.l=fn(l[5]||"",!0),Mo(this,l[6]||"",!0),this.m=fn(l[7]||"")):(this.h=!1,this.i=new pn(null,this.h))}pt.prototype.toString=function(){var i=[],l=this.j;l&&i.push(mn(l,Fo,!0),":");var u=this.g;return(u||l=="file")&&(i.push("//"),(l=this.o)&&i.push(mn(l,Fo,!0),"@"),i.push(encodeURIComponent(String(u)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),u=this.s,u!=null&&i.push(":",String(u))),(u=this.l)&&(this.g&&u.charAt(0)!="/"&&i.push("/"),i.push(mn(u,u.charAt(0)=="/"?mh:fh,!0))),(u=this.i.toString())&&i.push("?",u),(u=this.m)&&i.push("#",mn(u,gh)),i.join("")};function ze(i){return new pt(i)}function nr(i,l,u){i.j=u?fn(l,!0):l,i.j&&(i.j=i.j.replace(/:$/,""))}function rr(i,l){if(l){if(l=Number(l),isNaN(l)||0>l)throw Error("Bad port number "+l);i.s=l}else i.s=null}function Mo(i,l,u){l instanceof pn?(i.i=l,yh(i.i,i.h)):(u||(l=mn(l,ph)),i.i=new pn(l,i.h))}function J(i,l,u){i.i.set(l,u)}function sr(i){return J(i,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),i}function fn(i,l){return i?l?decodeURI(i.replace(/%25/g,"%2525")):decodeURIComponent(i):""}function mn(i,l,u){return typeof i=="string"?(i=encodeURI(i).replace(l,dh),u&&(i=i.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),i):null}function dh(i){return i=i.charCodeAt(0),"%"+(i>>4&15).toString(16)+(i&15).toString(16)}var Fo=/[#\/\?@]/g,fh=/[#\?:]/g,mh=/[#\?]/g,ph=/[#\?@]/g,gh=/#/g;function pn(i,l){this.h=this.g=null,this.i=i||null,this.j=!!l}function Ze(i){i.g||(i.g=new Map,i.h=0,i.i&&hh(i.i,function(l,u){i.add(decodeURIComponent(l.replace(/\+/g," ")),u)}))}n=pn.prototype,n.add=function(i,l){Ze(this),this.i=null,i=Lt(this,i);var u=this.g.get(i);return u||this.g.set(i,u=[]),u.push(l),this.h+=1,this};function Bo(i,l){Ze(i),l=Lt(i,l),i.g.has(l)&&(i.i=null,i.h-=i.g.get(l).length,i.g.delete(l))}function Uo(i,l){return Ze(i),l=Lt(i,l),i.g.has(l)}n.forEach=function(i,l){Ze(this),this.g.forEach(function(u,f){u.forEach(function(T){i.call(l,T,f,this)},this)},this)},n.na=function(){Ze(this);const i=Array.from(this.g.values()),l=Array.from(this.g.keys()),u=[];for(let f=0;f<l.length;f++){const T=i[f];for(let R=0;R<T.length;R++)u.push(l[f])}return u},n.V=function(i){Ze(this);let l=[];if(typeof i=="string")Uo(this,i)&&(l=l.concat(this.g.get(Lt(this,i))));else{i=Array.from(this.g.values());for(let u=0;u<i.length;u++)l=l.concat(i[u])}return l},n.set=function(i,l){return Ze(this),this.i=null,i=Lt(this,i),Uo(this,i)&&(this.h-=this.g.get(i).length),this.g.set(i,[l]),this.h+=1,this},n.get=function(i,l){return i?(i=this.V(i),0<i.length?String(i[0]):l):l};function $o(i,l,u){Bo(i,l),0<u.length&&(i.i=null,i.g.set(Lt(i,l),k(u)),i.h+=u.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const i=[],l=Array.from(this.g.keys());for(var u=0;u<l.length;u++){var f=l[u];const R=encodeURIComponent(String(f)),V=this.V(f);for(f=0;f<V.length;f++){var T=R;V[f]!==""&&(T+="="+encodeURIComponent(String(V[f]))),i.push(T)}}return this.i=i.join("&")};function Lt(i,l){return l=String(l),i.j&&(l=l.toLowerCase()),l}function yh(i,l){l&&!i.j&&(Ze(i),i.i=null,i.g.forEach(function(u,f){var T=f.toLowerCase();f!=T&&(Bo(this,f),$o(this,T,u))},i)),i.j=l}function _h(i,l){const u=new hn;if(c.Image){const f=new Image;f.onload=b(et,u,"TestLoadImage: loaded",!0,l,f),f.onerror=b(et,u,"TestLoadImage: error",!1,l,f),f.onabort=b(et,u,"TestLoadImage: abort",!1,l,f),f.ontimeout=b(et,u,"TestLoadImage: timeout",!1,l,f),c.setTimeout(function(){f.ontimeout&&f.ontimeout()},1e4),f.src=i}else l(!1)}function vh(i,l){const u=new hn,f=new AbortController,T=setTimeout(()=>{f.abort(),et(u,"TestPingServer: timeout",!1,l)},1e4);fetch(i,{signal:f.signal}).then(R=>{clearTimeout(T),R.ok?et(u,"TestPingServer: ok",!0,l):et(u,"TestPingServer: server error",!1,l)}).catch(()=>{clearTimeout(T),et(u,"TestPingServer: error",!1,l)})}function et(i,l,u,f,T){try{T&&(T.onload=null,T.onerror=null,T.onabort=null,T.ontimeout=null),f(u)}catch{}}function Eh(){this.g=new nh}function Ih(i,l,u){const f=u||"";try{xo(i,function(T,R){let V=T;d(T)&&(V=ms(T)),l.push(f+R+"="+encodeURIComponent(V))})}catch(T){throw l.push(f+"type="+encodeURIComponent("_badmap")),T}}function ir(i){this.l=i.Ub||null,this.j=i.eb||!1}D(ir,ps),ir.prototype.g=function(){return new or(this.l,this.j)},ir.prototype.i=function(i){return function(){return i}}({});function or(i,l){fe.call(this),this.D=i,this.o=l,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}D(or,fe),n=or.prototype,n.open=function(i,l){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=i,this.A=l,this.readyState=1,yn(this)},n.send=function(i){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const l={headers:this.u,method:this.B,credentials:this.m,cache:void 0};i&&(l.body=i),(this.D||c).fetch(new Request(this.A,l)).then(this.Sa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,gn(this)),this.readyState=0},n.Sa=function(i){if(this.g&&(this.l=i,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=i.headers,this.readyState=2,yn(this)),this.g&&(this.readyState=3,yn(this),this.g)))if(this.responseType==="arraybuffer")i.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof c.ReadableStream<"u"&&"body"in i){if(this.j=i.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;jo(this)}else i.text().then(this.Ra.bind(this),this.ga.bind(this))};function jo(i){i.j.read().then(i.Pa.bind(i)).catch(i.ga.bind(i))}n.Pa=function(i){if(this.g){if(this.o&&i.value)this.response.push(i.value);else if(!this.o){var l=i.value?i.value:new Uint8Array(0);(l=this.v.decode(l,{stream:!i.done}))&&(this.response=this.responseText+=l)}i.done?gn(this):yn(this),this.readyState==3&&jo(this)}},n.Ra=function(i){this.g&&(this.response=this.responseText=i,gn(this))},n.Qa=function(i){this.g&&(this.response=i,gn(this))},n.ga=function(){this.g&&gn(this)};function gn(i){i.readyState=4,i.l=null,i.j=null,i.v=null,yn(i)}n.setRequestHeader=function(i,l){this.u.append(i,l)},n.getResponseHeader=function(i){return this.h&&this.h.get(i.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const i=[],l=this.h.entries();for(var u=l.next();!u.done;)u=u.value,i.push(u[0]+": "+u[1]),u=l.next();return i.join(`\r
`)};function yn(i){i.onreadystatechange&&i.onreadystatechange.call(i)}Object.defineProperty(or.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(i){this.m=i?"include":"same-origin"}});function qo(i){let l="";return W(i,function(u,f){l+=f,l+=":",l+=u,l+=`\r
`}),l}function bs(i,l,u){e:{for(f in u){var f=!1;break e}f=!0}f||(u=qo(u),typeof i=="string"?u!=null&&encodeURIComponent(String(u)):J(i,l,u))}function te(i){fe.call(this),this.headers=new Map,this.o=i||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}D(te,fe);var Th=/^https?$/i,wh=["POST","PUT"];n=te.prototype,n.Ha=function(i){this.J=i},n.ea=function(i,l,u,f){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+i);l=l?l.toUpperCase():"GET",this.D=i,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():_s.g(),this.v=this.o?_o(this.o):_o(_s),this.g.onreadystatechange=w(this.Ea,this);try{this.B=!0,this.g.open(l,String(i),!0),this.B=!1}catch(R){zo(this,R);return}if(i=u||"",u=new Map(this.headers),f)if(Object.getPrototypeOf(f)===Object.prototype)for(var T in f)u.set(T,f[T]);else if(typeof f.keys=="function"&&typeof f.get=="function")for(const R of f.keys())u.set(R,f.get(R));else throw Error("Unknown input type for opt_headers: "+String(f));f=Array.from(u.keys()).find(R=>R.toLowerCase()=="content-type"),T=c.FormData&&i instanceof c.FormData,!(0<=Array.prototype.indexOf.call(wh,l,void 0))||f||T||u.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[R,V]of u)this.g.setRequestHeader(R,V);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{Ko(this),this.u=!0,this.g.send(i),this.u=!1}catch(R){zo(this,R)}};function zo(i,l){i.h=!1,i.g&&(i.j=!0,i.g.abort(),i.j=!1),i.l=l,i.m=5,Ho(i),ar(i)}function Ho(i){i.A||(i.A=!0,ve(i,"complete"),ve(i,"error"))}n.abort=function(i){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=i||7,ve(this,"complete"),ve(this,"abort"),ar(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),ar(this,!0)),te.aa.N.call(this)},n.Ea=function(){this.s||(this.B||this.u||this.j?Go(this):this.bb())},n.bb=function(){Go(this)};function Go(i){if(i.h&&typeof a<"u"&&(!i.v[1]||He(i)!=4||i.Z()!=2)){if(i.u&&He(i)==4)mo(i.Ea,0,i);else if(ve(i,"readystatechange"),He(i)==4){i.h=!1;try{const V=i.Z();e:switch(V){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var l=!0;break e;default:l=!1}var u;if(!(u=l)){var f;if(f=V===0){var T=String(i.D).match(Lo)[1]||null;!T&&c.self&&c.self.location&&(T=c.self.location.protocol.slice(0,-1)),f=!Th.test(T?T.toLowerCase():"")}u=f}if(u)ve(i,"complete"),ve(i,"success");else{i.m=6;try{var R=2<He(i)?i.g.statusText:""}catch{R=""}i.l=R+" ["+i.Z()+"]",Ho(i)}}finally{ar(i)}}}}function ar(i,l){if(i.g){Ko(i);const u=i.g,f=i.v[0]?()=>{}:null;i.g=null,i.v=null,l||ve(i,"ready");try{u.onreadystatechange=f}catch{}}}function Ko(i){i.I&&(c.clearTimeout(i.I),i.I=null)}n.isActive=function(){return!!this.g};function He(i){return i.g?i.g.readyState:0}n.Z=function(){try{return 2<He(this)?this.g.status:-1}catch{return-1}},n.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.Oa=function(i){if(this.g){var l=this.g.responseText;return i&&l.indexOf(i)==0&&(l=l.substring(i.length)),th(l)}};function Wo(i){try{if(!i.g)return null;if("response"in i.g)return i.g.response;switch(i.H){case"":case"text":return i.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in i.g)return i.g.mozResponseArrayBuffer}return null}catch{return null}}function Ah(i){const l={};i=(i.g&&2<=He(i)&&i.g.getAllResponseHeaders()||"").split(`\r
`);for(let f=0;f<i.length;f++){if(L(i[f]))continue;var u=I(i[f]);const T=u[0];if(u=u[1],typeof u!="string")continue;u=u.trim();const R=l[T]||[];l[T]=R,R.push(u)}v(l,function(f){return f.join(", ")})}n.Ba=function(){return this.m},n.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function _n(i,l,u){return u&&u.internalChannelParams&&u.internalChannelParams[i]||l}function Qo(i){this.Aa=0,this.i=[],this.j=new hn,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=_n("failFast",!1,i),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=_n("baseRetryDelayMs",5e3,i),this.cb=_n("retryDelaySeedMs",1e4,i),this.Wa=_n("forwardChannelMaxRetries",2,i),this.wa=_n("forwardChannelRequestTimeoutMs",2e4,i),this.pa=i&&i.xmlHttpFactory||void 0,this.Xa=i&&i.Tb||void 0,this.Ca=i&&i.useFetchStreams||!1,this.L=void 0,this.J=i&&i.supportsCrossDomainXhr||!1,this.K="",this.h=new Do(i&&i.concurrentRequestLimit),this.Da=new Eh,this.P=i&&i.fastHandshake||!1,this.O=i&&i.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=i&&i.Rb||!1,i&&i.xa&&this.j.xa(),i&&i.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&i&&i.detectBufferingProxy||!1,this.ja=void 0,i&&i.longPollingTimeout&&0<i.longPollingTimeout&&(this.ja=i.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}n=Qo.prototype,n.la=8,n.G=1,n.connect=function(i,l,u,f){Ee(0),this.W=i,this.H=l||{},u&&f!==void 0&&(this.H.OSID=u,this.H.OAID=f),this.F=this.X,this.I=sa(this,null,this.W),cr(this)};function Rs(i){if(Yo(i),i.G==3){var l=i.U++,u=ze(i.I);if(J(u,"SID",i.K),J(u,"RID",l),J(u,"TYPE","terminate"),vn(i,u),l=new Je(i,i.j,l),l.L=2,l.v=sr(ze(u)),u=!1,c.navigator&&c.navigator.sendBeacon)try{u=c.navigator.sendBeacon(l.v.toString(),"")}catch{}!u&&c.Image&&(new Image().src=l.v,u=!0),u||(l.g=ia(l.j,null),l.g.ea(l.v)),l.F=Date.now(),tr(l)}ra(i)}function lr(i){i.g&&(Ss(i),i.g.cancel(),i.g=null)}function Yo(i){lr(i),i.u&&(c.clearTimeout(i.u),i.u=null),ur(i),i.h.cancel(),i.s&&(typeof i.s=="number"&&c.clearTimeout(i.s),i.s=null)}function cr(i){if(!Vo(i.h)&&!i.s){i.s=!0;var l=i.Ga;rn||lo(),sn||(rn(),sn=!0),os.add(l,i),i.B=0}}function bh(i,l){return ko(i.h)>=i.h.j-(i.s?1:0)?!1:i.s?(i.i=l.D.concat(i.i),!0):i.G==1||i.G==2||i.B>=(i.Va?0:i.Wa)?!1:(i.s=un(w(i.Ga,i,l),na(i,i.B)),i.B++,!0)}n.Ga=function(i){if(this.s)if(this.s=null,this.G==1){if(!i){this.U=Math.floor(1e5*Math.random()),i=this.U++;const T=new Je(this,this.j,i);let R=this.o;if(this.S&&(R?(R=p(R),E(R,this.S)):R=this.S),this.m!==null||this.O||(T.H=R,R=null),this.P)e:{for(var l=0,u=0;u<this.i.length;u++){t:{var f=this.i[u];if("__data__"in f.map&&(f=f.map.__data__,typeof f=="string")){f=f.length;break t}f=void 0}if(f===void 0)break;if(l+=f,4096<l){l=u;break e}if(l===4096||u===this.i.length-1){l=u+1;break e}}l=1e3}else l=1e3;l=Jo(this,T,l),u=ze(this.I),J(u,"RID",i),J(u,"CVER",22),this.D&&J(u,"X-HTTP-Session-Id",this.D),vn(this,u),R&&(this.O?l="headers="+encodeURIComponent(String(qo(R)))+"&"+l:this.m&&bs(u,this.m,R)),As(this.h,T),this.Ua&&J(u,"TYPE","init"),this.P?(J(u,"$req",l),J(u,"SID","null"),T.T=!0,Es(T,u,null)):Es(T,u,l),this.G=2}}else this.G==3&&(i?Xo(this,i):this.i.length==0||Vo(this.h)||Xo(this))};function Xo(i,l){var u;l?u=l.l:u=i.U++;const f=ze(i.I);J(f,"SID",i.K),J(f,"RID",u),J(f,"AID",i.T),vn(i,f),i.m&&i.o&&bs(f,i.m,i.o),u=new Je(i,i.j,u,i.B+1),i.m===null&&(u.H=i.o),l&&(i.i=l.D.concat(i.i)),l=Jo(i,u,1e3),u.I=Math.round(.5*i.wa)+Math.round(.5*i.wa*Math.random()),As(i.h,u),Es(u,f,l)}function vn(i,l){i.H&&W(i.H,function(u,f){J(l,f,u)}),i.l&&xo({},function(u,f){J(l,f,u)})}function Jo(i,l,u){u=Math.min(i.i.length,u);var f=i.l?w(i.l.Na,i.l,i):null;e:{var T=i.i;let R=-1;for(;;){const V=["count="+u];R==-1?0<u?(R=T[0].g,V.push("ofs="+R)):R=0:V.push("ofs="+R);let Y=!0;for(let ae=0;ae<u;ae++){let G=T[ae].g;const me=T[ae].map;if(G-=R,0>G)R=Math.max(0,T[ae].g-100),Y=!1;else try{Ih(me,V,"req"+G+"_")}catch{f&&f(me)}}if(Y){f=V.join("&");break e}}}return i=i.i.splice(0,u),l.D=i,f}function Zo(i){if(!i.g&&!i.u){i.Y=1;var l=i.Fa;rn||lo(),sn||(rn(),sn=!0),os.add(l,i),i.v=0}}function Ps(i){return i.g||i.u||3<=i.v?!1:(i.Y++,i.u=un(w(i.Fa,i),na(i,i.v)),i.v++,!0)}n.Fa=function(){if(this.u=null,ea(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var i=2*this.R;this.j.info("BP detection timer enabled: "+i),this.A=un(w(this.ab,this),i)}},n.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,Ee(10),lr(this),ea(this))};function Ss(i){i.A!=null&&(c.clearTimeout(i.A),i.A=null)}function ea(i){i.g=new Je(i,i.j,"rpc",i.Y),i.m===null&&(i.g.H=i.o),i.g.O=0;var l=ze(i.qa);J(l,"RID","rpc"),J(l,"SID",i.K),J(l,"AID",i.T),J(l,"CI",i.F?"0":"1"),!i.F&&i.ja&&J(l,"TO",i.ja),J(l,"TYPE","xmlhttp"),vn(i,l),i.m&&i.o&&bs(l,i.m,i.o),i.L&&(i.g.I=i.L);var u=i.g;i=i.ia,u.L=1,u.v=sr(ze(l)),u.m=null,u.P=!0,Po(u,i)}n.Za=function(){this.C!=null&&(this.C=null,lr(this),Ps(this),Ee(19))};function ur(i){i.C!=null&&(c.clearTimeout(i.C),i.C=null)}function ta(i,l){var u=null;if(i.g==l){ur(i),Ss(i),i.g=null;var f=2}else if(ws(i.h,l))u=l.D,No(i.h,l),f=1;else return;if(i.G!=0){if(l.o)if(f==1){u=l.m?l.m.length:0,l=Date.now()-l.F;var T=i.B;f=Jn(),ve(f,new wo(f,u)),cr(i)}else Zo(i);else if(T=l.s,T==3||T==0&&0<l.X||!(f==1&&bh(i,l)||f==2&&Ps(i)))switch(u&&0<u.length&&(l=i.h,l.i=l.i.concat(u)),T){case 1:gt(i,5);break;case 4:gt(i,10);break;case 3:gt(i,6);break;default:gt(i,2)}}}function na(i,l){let u=i.Ta+Math.floor(Math.random()*i.cb);return i.isActive()||(u*=2),u*l}function gt(i,l){if(i.j.info("Error code "+l),l==2){var u=w(i.fb,i),f=i.Xa;const T=!f;f=new pt(f||"//www.google.com/images/cleardot.gif"),c.location&&c.location.protocol=="http"||nr(f,"https"),sr(f),T?_h(f.toString(),u):vh(f.toString(),u)}else Ee(2);i.G=0,i.l&&i.l.sa(l),ra(i),Yo(i)}n.fb=function(i){i?(this.j.info("Successfully pinged google.com"),Ee(2)):(this.j.info("Failed to ping google.com"),Ee(1))};function ra(i){if(i.G=0,i.ka=[],i.l){const l=Oo(i.h);(l.length!=0||i.i.length!=0)&&(S(i.ka,l),S(i.ka,i.i),i.h.i.length=0,k(i.i),i.i.length=0),i.l.ra()}}function sa(i,l,u){var f=u instanceof pt?ze(u):new pt(u);if(f.g!="")l&&(f.g=l+"."+f.g),rr(f,f.s);else{var T=c.location;f=T.protocol,l=l?l+"."+T.hostname:T.hostname,T=+T.port;var R=new pt(null);f&&nr(R,f),l&&(R.g=l),T&&rr(R,T),u&&(R.l=u),f=R}return u=i.D,l=i.ya,u&&l&&J(f,u,l),J(f,"VER",i.la),vn(i,f),f}function ia(i,l,u){if(l&&!i.J)throw Error("Can't create secondary domain capable XhrIo object.");return l=i.Ca&&!i.pa?new te(new ir({eb:u})):new te(i.pa),l.Ha(i.J),l}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function oa(){}n=oa.prototype,n.ua=function(){},n.ta=function(){},n.sa=function(){},n.ra=function(){},n.isActive=function(){return!0},n.Na=function(){};function hr(){}hr.prototype.g=function(i,l){return new be(i,l)};function be(i,l){fe.call(this),this.g=new Qo(l),this.l=i,this.h=l&&l.messageUrlParams||null,i=l&&l.messageHeaders||null,l&&l.clientProtocolHeaderRequired&&(i?i["X-Client-Protocol"]="webchannel":i={"X-Client-Protocol":"webchannel"}),this.g.o=i,i=l&&l.initMessageHeaders||null,l&&l.messageContentType&&(i?i["X-WebChannel-Content-Type"]=l.messageContentType:i={"X-WebChannel-Content-Type":l.messageContentType}),l&&l.va&&(i?i["X-WebChannel-Client-Profile"]=l.va:i={"X-WebChannel-Client-Profile":l.va}),this.g.S=i,(i=l&&l.Sb)&&!L(i)&&(this.g.m=i),this.v=l&&l.supportsCrossDomainXhr||!1,this.u=l&&l.sendRawJson||!1,(l=l&&l.httpSessionIdParam)&&!L(l)&&(this.g.D=l,i=this.h,i!==null&&l in i&&(i=this.h,l in i&&delete i[l])),this.j=new Mt(this)}D(be,fe),be.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},be.prototype.close=function(){Rs(this.g)},be.prototype.o=function(i){var l=this.g;if(typeof i=="string"){var u={};u.__data__=i,i=u}else this.u&&(u={},u.__data__=ms(i),i=u);l.i.push(new lh(l.Ya++,i)),l.G==3&&cr(l)},be.prototype.N=function(){this.g.l=null,delete this.j,Rs(this.g),delete this.g,be.aa.N.call(this)};function aa(i){gs.call(this),i.__headers__&&(this.headers=i.__headers__,this.statusCode=i.__status__,delete i.__headers__,delete i.__status__);var l=i.__sm__;if(l){e:{for(const u in l){i=u;break e}i=void 0}(this.i=i)&&(i=this.i,l=l!==null&&i in l?l[i]:void 0),this.data=l}else this.data=i}D(aa,gs);function la(){ys.call(this),this.status=1}D(la,ys);function Mt(i){this.g=i}D(Mt,oa),Mt.prototype.ua=function(){ve(this.g,"a")},Mt.prototype.ta=function(i){ve(this.g,new aa(i))},Mt.prototype.sa=function(i){ve(this.g,new la)},Mt.prototype.ra=function(){ve(this.g,"b")},hr.prototype.createWebChannel=hr.prototype.g,be.prototype.send=be.prototype.o,be.prototype.open=be.prototype.m,be.prototype.close=be.prototype.close,vc=function(){return new hr},_c=function(){return Jn()},yc=ft,Xs={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},Zn.NO_ERROR=0,Zn.TIMEOUT=8,Zn.HTTP_ERROR=6,_r=Zn,Ao.COMPLETE="complete",gc=Ao,vo.EventType=ln,ln.OPEN="a",ln.CLOSE="b",ln.ERROR="c",ln.MESSAGE="d",fe.prototype.listen=fe.prototype.K,Tn=vo,te.prototype.listenOnce=te.prototype.L,te.prototype.getLastError=te.prototype.Ka,te.prototype.getLastErrorCode=te.prototype.Ba,te.prototype.getStatus=te.prototype.Z,te.prototype.getResponseJson=te.prototype.Oa,te.prototype.getResponseText=te.prototype.oa,te.prototype.send=te.prototype.ea,te.prototype.setWithCredentials=te.prototype.Ha,pc=te}).apply(typeof fr<"u"?fr:typeof self<"u"?self:typeof window<"u"?window:{});const Ca="@firebase/firestore";/**
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
 */const St=new mi("@firebase/firestore");function En(){return St.logLevel}function O(n,...e){if(St.logLevel<=H.DEBUG){const t=e.map(Ti);St.debug(`Firestore (${Zt}): ${n}`,...t)}}function We(n,...e){if(St.logLevel<=H.ERROR){const t=e.map(Ti);St.error(`Firestore (${Zt}): ${n}`,...t)}}function zt(n,...e){if(St.logLevel<=H.WARN){const t=e.map(Ti);St.warn(`Firestore (${Zt}): ${n}`,...t)}}function Ti(n){if(typeof n=="string")return n;try{/**
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
 */function U(n="Unexpected state"){const e=`FIRESTORE (${Zt}) INTERNAL ASSERTION FAILED: `+n;throw We(e),new Error(e)}function Q(n,e){n||U()}function j(n,e){return n}/**
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
 */const C={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class x extends Ye{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
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
 */class it{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}/**
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
 */class Ec{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class Tm{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(ye.UNAUTHENTICATED))}shutdown(){}}class wm{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable(()=>t(this.token.user))}shutdown(){this.changeListener=null}}class Am{constructor(e){this.t=e,this.currentUser=ye.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){Q(this.o===void 0);let r=this.i;const s=h=>this.i!==r?(r=this.i,t(h)):Promise.resolve();let o=new it;this.o=()=>{this.i++,this.currentUser=this.u(),o.resolve(),o=new it,e.enqueueRetryable(()=>s(this.currentUser))};const a=()=>{const h=o;e.enqueueRetryable(async()=>{await h.promise,await s(this.currentUser)})},c=h=>{O("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=h,this.o&&(this.auth.addAuthTokenListener(this.o),a())};this.t.onInit(h=>c(h)),setTimeout(()=>{if(!this.auth){const h=this.t.getImmediate({optional:!0});h?c(h):(O("FirebaseAuthCredentialsProvider","Auth not yet detected"),o.resolve(),o=new it)}},0),a()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then(r=>this.i!==e?(O("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(Q(typeof r.accessToken=="string"),new Ec(r.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return Q(e===null||typeof e=="string"),new ye(e)}}class bm{constructor(e,t,r){this.l=e,this.h=t,this.P=r,this.type="FirstParty",this.user=ye.FIRST_PARTY,this.I=new Map}T(){return this.P?this.P():null}get headers(){this.I.set("X-Goog-AuthUser",this.l);const e=this.T();return e&&this.I.set("Authorization",e),this.h&&this.I.set("X-Goog-Iam-Authorization-Token",this.h),this.I}}class Rm{constructor(e,t,r){this.l=e,this.h=t,this.P=r}getToken(){return Promise.resolve(new bm(this.l,this.h,this.P))}start(e,t){e.enqueueRetryable(()=>t(ye.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class Pm{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class Sm{constructor(e){this.A=e,this.forceRefresh=!1,this.appCheck=null,this.R=null}start(e,t){Q(this.o===void 0);const r=o=>{o.error!=null&&O("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${o.error.message}`);const a=o.token!==this.R;return this.R=o.token,O("FirebaseAppCheckTokenProvider",`Received ${a?"new":"existing"} token.`),a?t(o.token):Promise.resolve()};this.o=o=>{e.enqueueRetryable(()=>r(o))};const s=o=>{O("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=o,this.o&&this.appCheck.addTokenListener(this.o)};this.A.onInit(o=>s(o)),setTimeout(()=>{if(!this.appCheck){const o=this.A.getImmediate({optional:!0});o?s(o):O("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(t=>t?(Q(typeof t.token=="string"),this.R=t.token,new Pm(t.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
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
 */function Cm(n){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(n);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let r=0;r<n;r++)t[r]=Math.floor(256*Math.random());return t}/**
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
 */class Ic{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=Math.floor(256/e.length)*e.length;let r="";for(;r.length<20;){const s=Cm(40);for(let o=0;o<s.length;++o)r.length<20&&s[o]<t&&(r+=e.charAt(s[o]%e.length))}return r}}function K(n,e){return n<e?-1:n>e?1:0}function Ht(n,e,t){return n.length===e.length&&n.every((r,s)=>t(r,e[s]))}/**
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
 */class ie{constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new x(C.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new x(C.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<-62135596800)throw new x(C.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new x(C.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}static now(){return ie.fromMillis(Date.now())}static fromDate(e){return ie.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),r=Math.floor(1e6*(e-1e3*t));return new ie(t,r)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?K(this.nanoseconds,e.nanoseconds):K(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const e=this.seconds- -62135596800;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
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
 */class ${constructor(e){this.timestamp=e}static fromTimestamp(e){return new $(e)}static min(){return new $(new ie(0,0))}static max(){return new $(new ie(253402300799,999999999))}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
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
 */class kn{constructor(e,t,r){t===void 0?t=0:t>e.length&&U(),r===void 0?r=e.length-t:r>e.length-t&&U(),this.segments=e,this.offset=t,this.len=r}get length(){return this.len}isEqual(e){return kn.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof kn?e.forEach(r=>{t.push(r)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,r=this.limit();t<r;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const r=Math.min(e.length,t.length);for(let s=0;s<r;s++){const o=e.get(s),a=t.get(s);if(o<a)return-1;if(o>a)return 1}return e.length<t.length?-1:e.length>t.length?1:0}}class Z extends kn{construct(e,t,r){return new Z(e,t,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const r of e){if(r.indexOf("//")>=0)throw new x(C.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);t.push(...r.split("/").filter(s=>s.length>0))}return new Z(t)}static emptyPath(){return new Z([])}}const Dm=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class ce extends kn{construct(e,t,r){return new ce(e,t,r)}static isValidIdentifier(e){return Dm.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),ce.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new ce(["__name__"])}static fromServerFormat(e){const t=[];let r="",s=0;const o=()=>{if(r.length===0)throw new x(C.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(r),r=""};let a=!1;for(;s<e.length;){const c=e[s];if(c==="\\"){if(s+1===e.length)throw new x(C.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const h=e[s+1];if(h!=="\\"&&h!=="."&&h!=="`")throw new x(C.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=h,s+=2}else c==="`"?(a=!a,s++):c!=="."||a?(r+=c,s++):(o(),s++)}if(o(),a)throw new x(C.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new ce(t)}static emptyPath(){return new ce([])}}/**
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
 */class F{constructor(e){this.path=e}static fromPath(e){return new F(Z.fromString(e))}static fromName(e){return new F(Z.fromString(e).popFirst(5))}static empty(){return new F(Z.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&Z.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return Z.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new F(new Z(e.slice()))}}function Vm(n,e){const t=n.toTimestamp().seconds,r=n.toTimestamp().nanoseconds+1,s=$.fromTimestamp(r===1e9?new ie(t+1,0):new ie(t,r));return new at(s,F.empty(),e)}function km(n){return new at(n.readTime,n.key,-1)}class at{constructor(e,t,r){this.readTime=e,this.documentKey=t,this.largestBatchId=r}static min(){return new at($.min(),F.empty(),-1)}static max(){return new at($.max(),F.empty(),-1)}}function Nm(n,e){let t=n.readTime.compareTo(e.readTime);return t!==0?t:(t=F.comparator(n.documentKey,e.documentKey),t!==0?t:K(n.largestBatchId,e.largestBatchId))}/**
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
 */const Om="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class xm{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
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
 */async function Un(n){if(n.code!==C.FAILED_PRECONDITION||n.message!==Om)throw n;O("LocalStore","Unexpectedly lost primary lease")}/**
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
 */class P{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)},t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)})}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&U(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new P((r,s)=>{this.nextCallback=o=>{this.wrapSuccess(e,o).next(r,s)},this.catchCallback=o=>{this.wrapFailure(t,o).next(r,s)}})}toPromise(){return new Promise((e,t)=>{this.next(e,t)})}wrapUserFunction(e){try{const t=e();return t instanceof P?t:P.resolve(t)}catch(t){return P.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction(()=>e(t)):P.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction(()=>e(t)):P.reject(t)}static resolve(e){return new P((t,r)=>{t(e)})}static reject(e){return new P((t,r)=>{r(e)})}static waitFor(e){return new P((t,r)=>{let s=0,o=0,a=!1;e.forEach(c=>{++s,c.next(()=>{++o,a&&o===s&&t()},h=>r(h))}),a=!0,o===s&&t()})}static or(e){let t=P.resolve(!1);for(const r of e)t=t.next(s=>s?P.resolve(s):r());return t}static forEach(e,t){const r=[];return e.forEach((s,o)=>{r.push(t.call(this,s,o))}),this.waitFor(r)}static mapArray(e,t){return new P((r,s)=>{const o=e.length,a=new Array(o);let c=0;for(let h=0;h<o;h++){const d=h;t(e[d]).next(m=>{a[d]=m,++c,c===o&&r(a)},m=>s(m))}})}static doWhile(e,t){return new P((r,s)=>{const o=()=>{e()===!0?t().next(()=>{o()},s):r()};o()})}}function Lm(n){const e=n.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function $n(n){return n.name==="IndexedDbTransactionError"}/**
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
 */class wi{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=r=>this.ie(r),this.se=r=>t.writeSequenceNumber(r))}ie(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.se&&this.se(e),e}}wi.oe=-1;function Hr(n){return n==null}function Sr(n){return n===0&&1/n==-1/0}function Mm(n){return typeof n=="number"&&Number.isInteger(n)&&!Sr(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}/**
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
 */function Da(n){let e=0;for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e++;return e}function Nt(n,e){for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e(t,n[t])}function Tc(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}/**
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
 */class ee{constructor(e,t){this.comparator=e,this.root=t||le.EMPTY}insert(e,t){return new ee(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,le.BLACK,null,null))}remove(e){return new ee(this.comparator,this.root.remove(e,this.comparator).copy(null,null,le.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const r=this.comparator(e,t.key);if(r===0)return t.value;r<0?t=t.left:r>0&&(t=t.right)}return null}indexOf(e){let t=0,r=this.root;for(;!r.isEmpty();){const s=this.comparator(e,r.key);if(s===0)return t+r.left.size;s<0?r=r.left:(t+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((t,r)=>(e(t,r),!1))}toString(){const e=[];return this.inorderTraversal((t,r)=>(e.push(`${t}:${r}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new mr(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new mr(this.root,e,this.comparator,!1)}getReverseIterator(){return new mr(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new mr(this.root,e,this.comparator,!0)}}class mr{constructor(e,t,r,s){this.isReverse=s,this.nodeStack=[];let o=1;for(;!e.isEmpty();)if(o=t?r(e.key,t):1,t&&s&&(o*=-1),o<0)e=this.isReverse?e.left:e.right;else{if(o===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class le{constructor(e,t,r,s,o){this.key=e,this.value=t,this.color=r??le.RED,this.left=s??le.EMPTY,this.right=o??le.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,r,s,o){return new le(e??this.key,t??this.value,r??this.color,s??this.left,o??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,r){let s=this;const o=r(e,s.key);return s=o<0?s.copy(null,null,null,s.left.insert(e,t,r),null):o===0?s.copy(null,t,null,null,null):s.copy(null,null,null,null,s.right.insert(e,t,r)),s.fixUp()}removeMin(){if(this.left.isEmpty())return le.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let r,s=this;if(t(e,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(e,t),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),t(e,s.key)===0){if(s.right.isEmpty())return le.EMPTY;r=s.right.min(),s=s.copy(r.key,r.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(e,t))}return s.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,le.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,le.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw U();const e=this.left.check();if(e!==this.right.check())throw U();return e+(this.isRed()?0:1)}}le.EMPTY=null,le.RED=!0,le.BLACK=!1;le.EMPTY=new class{constructor(){this.size=0}get key(){throw U()}get value(){throw U()}get color(){throw U()}get left(){throw U()}get right(){throw U()}copy(e,t,r,s,o){return this}insert(e,t,r){return new le(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
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
 */class ue{constructor(e){this.comparator=e,this.data=new ee(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((t,r)=>(e(t),!1))}forEachInRange(e,t){const r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){const s=r.getNext();if(this.comparator(s.key,e[1])>=0)return;t(s.key)}}forEachWhile(e,t){let r;for(r=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Va(this.data.getIterator())}getIteratorFrom(e){return new Va(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach(r=>{t=t.add(r)}),t}isEqual(e){if(!(e instanceof ue)||this.size!==e.size)return!1;const t=this.data.getIterator(),r=e.data.getIterator();for(;t.hasNext();){const s=t.getNext().key,o=r.getNext().key;if(this.comparator(s,o)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(t=>{e.push(t)}),e}toString(){const e=[];return this.forEach(t=>e.push(t)),"SortedSet("+e.toString()+")"}copy(e){const t=new ue(this.comparator);return t.data=e,t}}class Va{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
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
 */class wc extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
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
 */class he{constructor(e){this.binaryString=e}static fromBase64String(e){const t=function(s){try{return atob(s)}catch(o){throw typeof DOMException<"u"&&o instanceof DOMException?new wc("Invalid base64 string: "+o):o}}(e);return new he(t)}static fromUint8Array(e){const t=function(s){let o="";for(let a=0;a<s.length;++a)o+=String.fromCharCode(s[a]);return o}(e);return new he(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(t){return btoa(t)}(this.binaryString)}toUint8Array(){return function(t){const r=new Uint8Array(t.length);for(let s=0;s<t.length;s++)r[s]=t.charCodeAt(s);return r}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return K(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}he.EMPTY_BYTE_STRING=new he("");const Fm=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function lt(n){if(Q(!!n),typeof n=="string"){let e=0;const t=Fm.exec(n);if(Q(!!t),t[1]){let s=t[1];s=(s+"000000000").substr(0,9),e=Number(s)}const r=new Date(n);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:ne(n.seconds),nanos:ne(n.nanos)}}function ne(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function Ct(n){return typeof n=="string"?he.fromBase64String(n):he.fromUint8Array(n)}/**
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
 */function Ai(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||t===void 0?void 0:t.stringValue)==="server_timestamp"}function bi(n){const e=n.mapValue.fields.__previous_value__;return Ai(e)?bi(e):e}function Nn(n){const e=lt(n.mapValue.fields.__local_write_time__.timestampValue);return new ie(e.seconds,e.nanos)}/**
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
 */class Bm{constructor(e,t,r,s,o,a,c,h,d){this.databaseId=e,this.appId=t,this.persistenceKey=r,this.host=s,this.ssl=o,this.forceLongPolling=a,this.autoDetectLongPolling=c,this.longPollingOptions=h,this.useFetchStreams=d}}class On{constructor(e,t){this.projectId=e,this.database=t||"(default)"}static empty(){return new On("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(e){return e instanceof On&&e.projectId===this.projectId&&e.database===this.database}}/**
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
 */const pr={mapValue:{}};function Dt(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?Ai(n)?4:$m(n)?9007199254740991:Um(n)?10:11:U()}function Be(n,e){if(n===e)return!0;const t=Dt(n);if(t!==Dt(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===e.booleanValue;case 4:return Nn(n).isEqual(Nn(e));case 3:return function(s,o){if(typeof s.timestampValue=="string"&&typeof o.timestampValue=="string"&&s.timestampValue.length===o.timestampValue.length)return s.timestampValue===o.timestampValue;const a=lt(s.timestampValue),c=lt(o.timestampValue);return a.seconds===c.seconds&&a.nanos===c.nanos}(n,e);case 5:return n.stringValue===e.stringValue;case 6:return function(s,o){return Ct(s.bytesValue).isEqual(Ct(o.bytesValue))}(n,e);case 7:return n.referenceValue===e.referenceValue;case 8:return function(s,o){return ne(s.geoPointValue.latitude)===ne(o.geoPointValue.latitude)&&ne(s.geoPointValue.longitude)===ne(o.geoPointValue.longitude)}(n,e);case 2:return function(s,o){if("integerValue"in s&&"integerValue"in o)return ne(s.integerValue)===ne(o.integerValue);if("doubleValue"in s&&"doubleValue"in o){const a=ne(s.doubleValue),c=ne(o.doubleValue);return a===c?Sr(a)===Sr(c):isNaN(a)&&isNaN(c)}return!1}(n,e);case 9:return Ht(n.arrayValue.values||[],e.arrayValue.values||[],Be);case 10:case 11:return function(s,o){const a=s.mapValue.fields||{},c=o.mapValue.fields||{};if(Da(a)!==Da(c))return!1;for(const h in a)if(a.hasOwnProperty(h)&&(c[h]===void 0||!Be(a[h],c[h])))return!1;return!0}(n,e);default:return U()}}function xn(n,e){return(n.values||[]).find(t=>Be(t,e))!==void 0}function Gt(n,e){if(n===e)return 0;const t=Dt(n),r=Dt(e);if(t!==r)return K(t,r);switch(t){case 0:case 9007199254740991:return 0;case 1:return K(n.booleanValue,e.booleanValue);case 2:return function(o,a){const c=ne(o.integerValue||o.doubleValue),h=ne(a.integerValue||a.doubleValue);return c<h?-1:c>h?1:c===h?0:isNaN(c)?isNaN(h)?0:-1:1}(n,e);case 3:return ka(n.timestampValue,e.timestampValue);case 4:return ka(Nn(n),Nn(e));case 5:return K(n.stringValue,e.stringValue);case 6:return function(o,a){const c=Ct(o),h=Ct(a);return c.compareTo(h)}(n.bytesValue,e.bytesValue);case 7:return function(o,a){const c=o.split("/"),h=a.split("/");for(let d=0;d<c.length&&d<h.length;d++){const m=K(c[d],h[d]);if(m!==0)return m}return K(c.length,h.length)}(n.referenceValue,e.referenceValue);case 8:return function(o,a){const c=K(ne(o.latitude),ne(a.latitude));return c!==0?c:K(ne(o.longitude),ne(a.longitude))}(n.geoPointValue,e.geoPointValue);case 9:return Na(n.arrayValue,e.arrayValue);case 10:return function(o,a){var c,h,d,m;const _=o.fields||{},w=a.fields||{},b=(c=_.value)===null||c===void 0?void 0:c.arrayValue,D=(h=w.value)===null||h===void 0?void 0:h.arrayValue,k=K(((d=b==null?void 0:b.values)===null||d===void 0?void 0:d.length)||0,((m=D==null?void 0:D.values)===null||m===void 0?void 0:m.length)||0);return k!==0?k:Na(b,D)}(n.mapValue,e.mapValue);case 11:return function(o,a){if(o===pr.mapValue&&a===pr.mapValue)return 0;if(o===pr.mapValue)return 1;if(a===pr.mapValue)return-1;const c=o.fields||{},h=Object.keys(c),d=a.fields||{},m=Object.keys(d);h.sort(),m.sort();for(let _=0;_<h.length&&_<m.length;++_){const w=K(h[_],m[_]);if(w!==0)return w;const b=Gt(c[h[_]],d[m[_]]);if(b!==0)return b}return K(h.length,m.length)}(n.mapValue,e.mapValue);default:throw U()}}function ka(n,e){if(typeof n=="string"&&typeof e=="string"&&n.length===e.length)return K(n,e);const t=lt(n),r=lt(e),s=K(t.seconds,r.seconds);return s!==0?s:K(t.nanos,r.nanos)}function Na(n,e){const t=n.values||[],r=e.values||[];for(let s=0;s<t.length&&s<r.length;++s){const o=Gt(t[s],r[s]);if(o)return o}return K(t.length,r.length)}function Kt(n){return Js(n)}function Js(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?function(t){const r=lt(t);return`time(${r.seconds},${r.nanos})`}(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?function(t){return Ct(t).toBase64()}(n.bytesValue):"referenceValue"in n?function(t){return F.fromName(t).toString()}(n.referenceValue):"geoPointValue"in n?function(t){return`geo(${t.latitude},${t.longitude})`}(n.geoPointValue):"arrayValue"in n?function(t){let r="[",s=!0;for(const o of t.values||[])s?s=!1:r+=",",r+=Js(o);return r+"]"}(n.arrayValue):"mapValue"in n?function(t){const r=Object.keys(t.fields||{}).sort();let s="{",o=!0;for(const a of r)o?o=!1:s+=",",s+=`${a}:${Js(t.fields[a])}`;return s+"}"}(n.mapValue):U()}function Zs(n){return!!n&&"integerValue"in n}function Ri(n){return!!n&&"arrayValue"in n}function Oa(n){return!!n&&"nullValue"in n}function xa(n){return!!n&&"doubleValue"in n&&isNaN(Number(n.doubleValue))}function vr(n){return!!n&&"mapValue"in n}function Um(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||t===void 0?void 0:t.stringValue)==="__vector__"}function Pn(n){if(n.geoPointValue)return{geoPointValue:Object.assign({},n.geoPointValue)};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:Object.assign({},n.timestampValue)};if(n.mapValue){const e={mapValue:{fields:{}}};return Nt(n.mapValue.fields,(t,r)=>e.mapValue.fields[t]=Pn(r)),e}if(n.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(n.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=Pn(n.arrayValue.values[t]);return e}return Object.assign({},n)}function $m(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"}/**
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
 */class Te{constructor(e){this.value=e}static empty(){return new Te({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let r=0;r<e.length-1;++r)if(t=(t.mapValue.fields||{})[e.get(r)],!vr(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=Pn(t)}setAll(e){let t=ce.emptyPath(),r={},s=[];e.forEach((a,c)=>{if(!t.isImmediateParentOf(c)){const h=this.getFieldsMap(t);this.applyChanges(h,r,s),r={},s=[],t=c.popLast()}a?r[c.lastSegment()]=Pn(a):s.push(c.lastSegment())});const o=this.getFieldsMap(t);this.applyChanges(o,r,s)}delete(e){const t=this.field(e.popLast());vr(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return Be(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let r=0;r<e.length;++r){let s=t.mapValue.fields[e.get(r)];vr(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},t.mapValue.fields[e.get(r)]=s),t=s}return t.mapValue.fields}applyChanges(e,t,r){Nt(t,(s,o)=>e[s]=o);for(const s of r)delete e[s]}clone(){return new Te(Pn(this.value))}}function Ac(n){const e=[];return Nt(n.fields,(t,r)=>{const s=new ce([t]);if(vr(r)){const o=Ac(r.mapValue).fields;if(o.length===0)e.push(s);else for(const a of o)e.push(s.child(a))}else e.push(s)}),new Re(e)}/**
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
 */class _e{constructor(e,t,r,s,o,a,c){this.key=e,this.documentType=t,this.version=r,this.readTime=s,this.createTime=o,this.data=a,this.documentState=c}static newInvalidDocument(e){return new _e(e,0,$.min(),$.min(),$.min(),Te.empty(),0)}static newFoundDocument(e,t,r,s){return new _e(e,1,t,$.min(),r,s,0)}static newNoDocument(e,t){return new _e(e,2,t,$.min(),$.min(),Te.empty(),0)}static newUnknownDocument(e,t){return new _e(e,3,t,$.min(),$.min(),Te.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual($.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=Te.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=Te.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=$.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof _e&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new _e(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
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
 */class Cr{constructor(e,t){this.position=e,this.inclusive=t}}function La(n,e,t){let r=0;for(let s=0;s<n.position.length;s++){const o=e[s],a=n.position[s];if(o.field.isKeyField()?r=F.comparator(F.fromName(a.referenceValue),t.key):r=Gt(a,t.data.field(o.field)),o.dir==="desc"&&(r*=-1),r!==0)break}return r}function Ma(n,e){if(n===null)return e===null;if(e===null||n.inclusive!==e.inclusive||n.position.length!==e.position.length)return!1;for(let t=0;t<n.position.length;t++)if(!Be(n.position[t],e.position[t]))return!1;return!0}/**
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
 */class Dr{constructor(e,t="asc"){this.field=e,this.dir=t}}function jm(n,e){return n.dir===e.dir&&n.field.isEqual(e.field)}/**
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
 */class bc{}class se extends bc{constructor(e,t,r){super(),this.field=e,this.op=t,this.value=r}static create(e,t,r){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,r):new zm(e,t,r):t==="array-contains"?new Km(e,r):t==="in"?new Wm(e,r):t==="not-in"?new Qm(e,r):t==="array-contains-any"?new Ym(e,r):new se(e,t,r)}static createKeyFieldInFilter(e,t,r){return t==="in"?new Hm(e,r):new Gm(e,r)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&this.matchesComparison(Gt(t,this.value)):t!==null&&Dt(this.value)===Dt(t)&&this.matchesComparison(Gt(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return U()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class Ue extends bc{constructor(e,t){super(),this.filters=e,this.op=t,this.ae=null}static create(e,t){return new Ue(e,t)}matches(e){return Rc(this)?this.filters.find(t=>!t.matches(e))===void 0:this.filters.find(t=>t.matches(e))!==void 0}getFlattenedFilters(){return this.ae!==null||(this.ae=this.filters.reduce((e,t)=>e.concat(t.getFlattenedFilters()),[])),this.ae}getFilters(){return Object.assign([],this.filters)}}function Rc(n){return n.op==="and"}function Pc(n){return qm(n)&&Rc(n)}function qm(n){for(const e of n.filters)if(e instanceof Ue)return!1;return!0}function ei(n){if(n instanceof se)return n.field.canonicalString()+n.op.toString()+Kt(n.value);if(Pc(n))return n.filters.map(e=>ei(e)).join(",");{const e=n.filters.map(t=>ei(t)).join(",");return`${n.op}(${e})`}}function Sc(n,e){return n instanceof se?function(r,s){return s instanceof se&&r.op===s.op&&r.field.isEqual(s.field)&&Be(r.value,s.value)}(n,e):n instanceof Ue?function(r,s){return s instanceof Ue&&r.op===s.op&&r.filters.length===s.filters.length?r.filters.reduce((o,a,c)=>o&&Sc(a,s.filters[c]),!0):!1}(n,e):void U()}function Cc(n){return n instanceof se?function(t){return`${t.field.canonicalString()} ${t.op} ${Kt(t.value)}`}(n):n instanceof Ue?function(t){return t.op.toString()+" {"+t.getFilters().map(Cc).join(" ,")+"}"}(n):"Filter"}class zm extends se{constructor(e,t,r){super(e,t,r),this.key=F.fromName(r.referenceValue)}matches(e){const t=F.comparator(e.key,this.key);return this.matchesComparison(t)}}class Hm extends se{constructor(e,t){super(e,"in",t),this.keys=Dc("in",t)}matches(e){return this.keys.some(t=>t.isEqual(e.key))}}class Gm extends se{constructor(e,t){super(e,"not-in",t),this.keys=Dc("not-in",t)}matches(e){return!this.keys.some(t=>t.isEqual(e.key))}}function Dc(n,e){var t;return(((t=e.arrayValue)===null||t===void 0?void 0:t.values)||[]).map(r=>F.fromName(r.referenceValue))}class Km extends se{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return Ri(t)&&xn(t.arrayValue,this.value)}}class Wm extends se{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&xn(this.value.arrayValue,t)}}class Qm extends se{constructor(e,t){super(e,"not-in",t)}matches(e){if(xn(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&!xn(this.value.arrayValue,t)}}class Ym extends se{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!Ri(t)||!t.arrayValue.values)&&t.arrayValue.values.some(r=>xn(this.value.arrayValue,r))}}/**
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
 */class Xm{constructor(e,t=null,r=[],s=[],o=null,a=null,c=null){this.path=e,this.collectionGroup=t,this.orderBy=r,this.filters=s,this.limit=o,this.startAt=a,this.endAt=c,this.ue=null}}function Fa(n,e=null,t=[],r=[],s=null,o=null,a=null){return new Xm(n,e,t,r,s,o,a)}function Pi(n){const e=j(n);if(e.ue===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map(r=>ei(r)).join(","),t+="|ob:",t+=e.orderBy.map(r=>function(o){return o.field.canonicalString()+o.dir}(r)).join(","),Hr(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map(r=>Kt(r)).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map(r=>Kt(r)).join(",")),e.ue=t}return e.ue}function Si(n,e){if(n.limit!==e.limit||n.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<n.orderBy.length;t++)if(!jm(n.orderBy[t],e.orderBy[t]))return!1;if(n.filters.length!==e.filters.length)return!1;for(let t=0;t<n.filters.length;t++)if(!Sc(n.filters[t],e.filters[t]))return!1;return n.collectionGroup===e.collectionGroup&&!!n.path.isEqual(e.path)&&!!Ma(n.startAt,e.startAt)&&Ma(n.endAt,e.endAt)}function ti(n){return F.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}/**
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
 */class Gr{constructor(e,t=null,r=[],s=[],o=null,a="F",c=null,h=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=r,this.filters=s,this.limit=o,this.limitType=a,this.startAt=c,this.endAt=h,this.ce=null,this.le=null,this.he=null,this.startAt,this.endAt}}function Jm(n,e,t,r,s,o,a,c){return new Gr(n,e,t,r,s,o,a,c)}function Ci(n){return new Gr(n)}function Ba(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function Zm(n){return n.collectionGroup!==null}function Sn(n){const e=j(n);if(e.ce===null){e.ce=[];const t=new Set;for(const o of e.explicitOrderBy)e.ce.push(o),t.add(o.field.canonicalString());const r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(a){let c=new ue(ce.comparator);return a.filters.forEach(h=>{h.getFlattenedFilters().forEach(d=>{d.isInequality()&&(c=c.add(d.field))})}),c})(e).forEach(o=>{t.has(o.canonicalString())||o.isKeyField()||e.ce.push(new Dr(o,r))}),t.has(ce.keyField().canonicalString())||e.ce.push(new Dr(ce.keyField(),r))}return e.ce}function Le(n){const e=j(n);return e.le||(e.le=ep(e,Sn(n))),e.le}function ep(n,e){if(n.limitType==="F")return Fa(n.path,n.collectionGroup,e,n.filters,n.limit,n.startAt,n.endAt);{e=e.map(s=>{const o=s.dir==="desc"?"asc":"desc";return new Dr(s.field,o)});const t=n.endAt?new Cr(n.endAt.position,n.endAt.inclusive):null,r=n.startAt?new Cr(n.startAt.position,n.startAt.inclusive):null;return Fa(n.path,n.collectionGroup,e,n.filters,n.limit,t,r)}}function ni(n,e,t){return new Gr(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),e,t,n.startAt,n.endAt)}function Kr(n,e){return Si(Le(n),Le(e))&&n.limitType===e.limitType}function Vc(n){return`${Pi(Le(n))}|lt:${n.limitType}`}function Bt(n){return`Query(target=${function(t){let r=t.path.canonicalString();return t.collectionGroup!==null&&(r+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(r+=`, filters: [${t.filters.map(s=>Cc(s)).join(", ")}]`),Hr(t.limit)||(r+=", limit: "+t.limit),t.orderBy.length>0&&(r+=`, orderBy: [${t.orderBy.map(s=>function(a){return`${a.field.canonicalString()} (${a.dir})`}(s)).join(", ")}]`),t.startAt&&(r+=", startAt: ",r+=t.startAt.inclusive?"b:":"a:",r+=t.startAt.position.map(s=>Kt(s)).join(",")),t.endAt&&(r+=", endAt: ",r+=t.endAt.inclusive?"a:":"b:",r+=t.endAt.position.map(s=>Kt(s)).join(",")),`Target(${r})`}(Le(n))}; limitType=${n.limitType})`}function Wr(n,e){return e.isFoundDocument()&&function(r,s){const o=s.key.path;return r.collectionGroup!==null?s.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(o):F.isDocumentKey(r.path)?r.path.isEqual(o):r.path.isImmediateParentOf(o)}(n,e)&&function(r,s){for(const o of Sn(r))if(!o.field.isKeyField()&&s.data.field(o.field)===null)return!1;return!0}(n,e)&&function(r,s){for(const o of r.filters)if(!o.matches(s))return!1;return!0}(n,e)&&function(r,s){return!(r.startAt&&!function(a,c,h){const d=La(a,c,h);return a.inclusive?d<=0:d<0}(r.startAt,Sn(r),s)||r.endAt&&!function(a,c,h){const d=La(a,c,h);return a.inclusive?d>=0:d>0}(r.endAt,Sn(r),s))}(n,e)}function tp(n){return n.collectionGroup||(n.path.length%2==1?n.path.lastSegment():n.path.get(n.path.length-2))}function kc(n){return(e,t)=>{let r=!1;for(const s of Sn(n)){const o=np(s,e,t);if(o!==0)return o;r=r||s.field.isKeyField()}return 0}}function np(n,e,t){const r=n.field.isKeyField()?F.comparator(e.key,t.key):function(o,a,c){const h=a.data.field(o),d=c.data.field(o);return h!==null&&d!==null?Gt(h,d):U()}(n.field,e,t);switch(n.dir){case"asc":return r;case"desc":return-1*r;default:return U()}}/**
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
 */class en{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),r=this.inner[t];if(r!==void 0){for(const[s,o]of r)if(this.equalsFn(s,e))return o}}has(e){return this.get(e)!==void 0}set(e,t){const r=this.mapKeyFn(e),s=this.inner[r];if(s===void 0)return this.inner[r]=[[e,t]],void this.innerSize++;for(let o=0;o<s.length;o++)if(this.equalsFn(s[o][0],e))return void(s[o]=[e,t]);s.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),r=this.inner[t];if(r===void 0)return!1;for(let s=0;s<r.length;s++)if(this.equalsFn(r[s][0],e))return r.length===1?delete this.inner[t]:r.splice(s,1),this.innerSize--,!0;return!1}forEach(e){Nt(this.inner,(t,r)=>{for(const[s,o]of r)e(s,o)})}isEmpty(){return Tc(this.inner)}size(){return this.innerSize}}/**
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
 */const rp=new ee(F.comparator);function Qe(){return rp}const Nc=new ee(F.comparator);function wn(...n){let e=Nc;for(const t of n)e=e.insert(t.key,t);return e}function Oc(n){let e=Nc;return n.forEach((t,r)=>e=e.insert(t,r.overlayedDocument)),e}function It(){return Cn()}function xc(){return Cn()}function Cn(){return new en(n=>n.toString(),(n,e)=>n.isEqual(e))}const sp=new ee(F.comparator),ip=new ue(F.comparator);function q(...n){let e=ip;for(const t of n)e=e.add(t);return e}const op=new ue(K);function ap(){return op}/**
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
 */function Di(n,e){if(n.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Sr(e)?"-0":e}}function Lc(n){return{integerValue:""+n}}function lp(n,e){return Mm(e)?Lc(e):Di(n,e)}/**
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
 */class Qr{constructor(){this._=void 0}}function cp(n,e,t){return n instanceof Vr?function(s,o){const a={fields:{__type__:{stringValue:"server_timestamp"},__local_write_time__:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return o&&Ai(o)&&(o=bi(o)),o&&(a.fields.__previous_value__=o),{mapValue:a}}(t,e):n instanceof Ln?Fc(n,e):n instanceof Mn?Bc(n,e):function(s,o){const a=Mc(s,o),c=Ua(a)+Ua(s.Pe);return Zs(a)&&Zs(s.Pe)?Lc(c):Di(s.serializer,c)}(n,e)}function up(n,e,t){return n instanceof Ln?Fc(n,e):n instanceof Mn?Bc(n,e):t}function Mc(n,e){return n instanceof kr?function(r){return Zs(r)||function(o){return!!o&&"doubleValue"in o}(r)}(e)?e:{integerValue:0}:null}class Vr extends Qr{}class Ln extends Qr{constructor(e){super(),this.elements=e}}function Fc(n,e){const t=Uc(e);for(const r of n.elements)t.some(s=>Be(s,r))||t.push(r);return{arrayValue:{values:t}}}class Mn extends Qr{constructor(e){super(),this.elements=e}}function Bc(n,e){let t=Uc(e);for(const r of n.elements)t=t.filter(s=>!Be(s,r));return{arrayValue:{values:t}}}class kr extends Qr{constructor(e,t){super(),this.serializer=e,this.Pe=t}}function Ua(n){return ne(n.integerValue||n.doubleValue)}function Uc(n){return Ri(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}function hp(n,e){return n.field.isEqual(e.field)&&function(r,s){return r instanceof Ln&&s instanceof Ln||r instanceof Mn&&s instanceof Mn?Ht(r.elements,s.elements,Be):r instanceof kr&&s instanceof kr?Be(r.Pe,s.Pe):r instanceof Vr&&s instanceof Vr}(n.transform,e.transform)}class dp{constructor(e,t){this.version=e,this.transformResults=t}}class De{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new De}static exists(e){return new De(void 0,e)}static updateTime(e){return new De(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function Er(n,e){return n.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(n.updateTime):n.exists===void 0||n.exists===e.isFoundDocument()}class Yr{}function $c(n,e){if(!n.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return n.isNoDocument()?new Vi(n.key,De.none()):new jn(n.key,n.data,De.none());{const t=n.data,r=Te.empty();let s=new ue(ce.comparator);for(let o of e.fields)if(!s.has(o)){let a=t.field(o);a===null&&o.length>1&&(o=o.popLast(),a=t.field(o)),a===null?r.delete(o):r.set(o,a),s=s.add(o)}return new ht(n.key,r,new Re(s.toArray()),De.none())}}function fp(n,e,t){n instanceof jn?function(s,o,a){const c=s.value.clone(),h=ja(s.fieldTransforms,o,a.transformResults);c.setAll(h),o.convertToFoundDocument(a.version,c).setHasCommittedMutations()}(n,e,t):n instanceof ht?function(s,o,a){if(!Er(s.precondition,o))return void o.convertToUnknownDocument(a.version);const c=ja(s.fieldTransforms,o,a.transformResults),h=o.data;h.setAll(jc(s)),h.setAll(c),o.convertToFoundDocument(a.version,h).setHasCommittedMutations()}(n,e,t):function(s,o,a){o.convertToNoDocument(a.version).setHasCommittedMutations()}(0,e,t)}function Dn(n,e,t,r){return n instanceof jn?function(o,a,c,h){if(!Er(o.precondition,a))return c;const d=o.value.clone(),m=qa(o.fieldTransforms,h,a);return d.setAll(m),a.convertToFoundDocument(a.version,d).setHasLocalMutations(),null}(n,e,t,r):n instanceof ht?function(o,a,c,h){if(!Er(o.precondition,a))return c;const d=qa(o.fieldTransforms,h,a),m=a.data;return m.setAll(jc(o)),m.setAll(d),a.convertToFoundDocument(a.version,m).setHasLocalMutations(),c===null?null:c.unionWith(o.fieldMask.fields).unionWith(o.fieldTransforms.map(_=>_.field))}(n,e,t,r):function(o,a,c){return Er(o.precondition,a)?(a.convertToNoDocument(a.version).setHasLocalMutations(),null):c}(n,e,t)}function mp(n,e){let t=null;for(const r of n.fieldTransforms){const s=e.data.field(r.field),o=Mc(r.transform,s||null);o!=null&&(t===null&&(t=Te.empty()),t.set(r.field,o))}return t||null}function $a(n,e){return n.type===e.type&&!!n.key.isEqual(e.key)&&!!n.precondition.isEqual(e.precondition)&&!!function(r,s){return r===void 0&&s===void 0||!(!r||!s)&&Ht(r,s,(o,a)=>hp(o,a))}(n.fieldTransforms,e.fieldTransforms)&&(n.type===0?n.value.isEqual(e.value):n.type!==1||n.data.isEqual(e.data)&&n.fieldMask.isEqual(e.fieldMask))}class jn extends Yr{constructor(e,t,r,s=[]){super(),this.key=e,this.value=t,this.precondition=r,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class ht extends Yr{constructor(e,t,r,s,o=[]){super(),this.key=e,this.data=t,this.fieldMask=r,this.precondition=s,this.fieldTransforms=o,this.type=1}getFieldMask(){return this.fieldMask}}function jc(n){const e=new Map;return n.fieldMask.fields.forEach(t=>{if(!t.isEmpty()){const r=n.data.field(t);e.set(t,r)}}),e}function ja(n,e,t){const r=new Map;Q(n.length===t.length);for(let s=0;s<t.length;s++){const o=n[s],a=o.transform,c=e.data.field(o.field);r.set(o.field,up(a,c,t[s]))}return r}function qa(n,e,t){const r=new Map;for(const s of n){const o=s.transform,a=t.data.field(s.field);r.set(s.field,cp(o,a,e))}return r}class Vi extends Yr{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class pp extends Yr{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
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
 */class gp{constructor(e,t,r,s){this.batchId=e,this.localWriteTime=t,this.baseMutations=r,this.mutations=s}applyToRemoteDocument(e,t){const r=t.mutationResults;for(let s=0;s<this.mutations.length;s++){const o=this.mutations[s];o.key.isEqual(e.key)&&fp(o,e,r[s])}}applyToLocalView(e,t){for(const r of this.baseMutations)r.key.isEqual(e.key)&&(t=Dn(r,e,t,this.localWriteTime));for(const r of this.mutations)r.key.isEqual(e.key)&&(t=Dn(r,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const r=xc();return this.mutations.forEach(s=>{const o=e.get(s.key),a=o.overlayedDocument;let c=this.applyToLocalView(a,o.mutatedFields);c=t.has(s.key)?null:c;const h=$c(a,c);h!==null&&r.set(s.key,h),a.isValidDocument()||a.convertToNoDocument($.min())}),r}keys(){return this.mutations.reduce((e,t)=>e.add(t.key),q())}isEqual(e){return this.batchId===e.batchId&&Ht(this.mutations,e.mutations,(t,r)=>$a(t,r))&&Ht(this.baseMutations,e.baseMutations,(t,r)=>$a(t,r))}}class ki{constructor(e,t,r,s){this.batch=e,this.commitVersion=t,this.mutationResults=r,this.docVersions=s}static from(e,t,r){Q(e.mutations.length===r.length);let s=function(){return sp}();const o=e.mutations;for(let a=0;a<o.length;a++)s=s.insert(o[a].key,r[a].version);return new ki(e,t,r,s)}}/**
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
 */class yp{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
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
 */class _p{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
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
 */var re,z;function vp(n){switch(n){default:return U();case C.CANCELLED:case C.UNKNOWN:case C.DEADLINE_EXCEEDED:case C.RESOURCE_EXHAUSTED:case C.INTERNAL:case C.UNAVAILABLE:case C.UNAUTHENTICATED:return!1;case C.INVALID_ARGUMENT:case C.NOT_FOUND:case C.ALREADY_EXISTS:case C.PERMISSION_DENIED:case C.FAILED_PRECONDITION:case C.ABORTED:case C.OUT_OF_RANGE:case C.UNIMPLEMENTED:case C.DATA_LOSS:return!0}}function qc(n){if(n===void 0)return We("GRPC error has no .code"),C.UNKNOWN;switch(n){case re.OK:return C.OK;case re.CANCELLED:return C.CANCELLED;case re.UNKNOWN:return C.UNKNOWN;case re.DEADLINE_EXCEEDED:return C.DEADLINE_EXCEEDED;case re.RESOURCE_EXHAUSTED:return C.RESOURCE_EXHAUSTED;case re.INTERNAL:return C.INTERNAL;case re.UNAVAILABLE:return C.UNAVAILABLE;case re.UNAUTHENTICATED:return C.UNAUTHENTICATED;case re.INVALID_ARGUMENT:return C.INVALID_ARGUMENT;case re.NOT_FOUND:return C.NOT_FOUND;case re.ALREADY_EXISTS:return C.ALREADY_EXISTS;case re.PERMISSION_DENIED:return C.PERMISSION_DENIED;case re.FAILED_PRECONDITION:return C.FAILED_PRECONDITION;case re.ABORTED:return C.ABORTED;case re.OUT_OF_RANGE:return C.OUT_OF_RANGE;case re.UNIMPLEMENTED:return C.UNIMPLEMENTED;case re.DATA_LOSS:return C.DATA_LOSS;default:return U()}}(z=re||(re={}))[z.OK=0]="OK",z[z.CANCELLED=1]="CANCELLED",z[z.UNKNOWN=2]="UNKNOWN",z[z.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",z[z.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",z[z.NOT_FOUND=5]="NOT_FOUND",z[z.ALREADY_EXISTS=6]="ALREADY_EXISTS",z[z.PERMISSION_DENIED=7]="PERMISSION_DENIED",z[z.UNAUTHENTICATED=16]="UNAUTHENTICATED",z[z.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",z[z.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",z[z.ABORTED=10]="ABORTED",z[z.OUT_OF_RANGE=11]="OUT_OF_RANGE",z[z.UNIMPLEMENTED=12]="UNIMPLEMENTED",z[z.INTERNAL=13]="INTERNAL",z[z.UNAVAILABLE=14]="UNAVAILABLE",z[z.DATA_LOSS=15]="DATA_LOSS";/**
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
 */function Ep(){return new TextEncoder}/**
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
 */const Ip=new wt([4294967295,4294967295],0);function za(n){const e=Ep().encode(n),t=new mc;return t.update(e),new Uint8Array(t.digest())}function Ha(n){const e=new DataView(n.buffer),t=e.getUint32(0,!0),r=e.getUint32(4,!0),s=e.getUint32(8,!0),o=e.getUint32(12,!0);return[new wt([t,r],0),new wt([s,o],0)]}class Ni{constructor(e,t,r){if(this.bitmap=e,this.padding=t,this.hashCount=r,t<0||t>=8)throw new An(`Invalid padding: ${t}`);if(r<0)throw new An(`Invalid hash count: ${r}`);if(e.length>0&&this.hashCount===0)throw new An(`Invalid hash count: ${r}`);if(e.length===0&&t!==0)throw new An(`Invalid padding when bitmap length is 0: ${t}`);this.Ie=8*e.length-t,this.Te=wt.fromNumber(this.Ie)}Ee(e,t,r){let s=e.add(t.multiply(wt.fromNumber(r)));return s.compare(Ip)===1&&(s=new wt([s.getBits(0),s.getBits(1)],0)),s.modulo(this.Te).toNumber()}de(e){return(this.bitmap[Math.floor(e/8)]&1<<e%8)!=0}mightContain(e){if(this.Ie===0)return!1;const t=za(e),[r,s]=Ha(t);for(let o=0;o<this.hashCount;o++){const a=this.Ee(r,s,o);if(!this.de(a))return!1}return!0}static create(e,t,r){const s=e%8==0?0:8-e%8,o=new Uint8Array(Math.ceil(e/8)),a=new Ni(o,s,t);return r.forEach(c=>a.insert(c)),a}insert(e){if(this.Ie===0)return;const t=za(e),[r,s]=Ha(t);for(let o=0;o<this.hashCount;o++){const a=this.Ee(r,s,o);this.Ae(a)}}Ae(e){const t=Math.floor(e/8),r=e%8;this.bitmap[t]|=1<<r}}class An extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
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
 */class Xr{constructor(e,t,r,s,o){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=r,this.documentUpdates=s,this.resolvedLimboDocuments=o}static createSynthesizedRemoteEventForCurrentChange(e,t,r){const s=new Map;return s.set(e,qn.createSynthesizedTargetChangeForCurrentChange(e,t,r)),new Xr($.min(),s,new ee(K),Qe(),q())}}class qn{constructor(e,t,r,s,o){this.resumeToken=e,this.current=t,this.addedDocuments=r,this.modifiedDocuments=s,this.removedDocuments=o}static createSynthesizedTargetChangeForCurrentChange(e,t,r){return new qn(r,t,q(),q(),q())}}/**
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
 */class Ir{constructor(e,t,r,s){this.Re=e,this.removedTargetIds=t,this.key=r,this.Ve=s}}class zc{constructor(e,t){this.targetId=e,this.me=t}}class Hc{constructor(e,t,r=he.EMPTY_BYTE_STRING,s=null){this.state=e,this.targetIds=t,this.resumeToken=r,this.cause=s}}class Ga{constructor(){this.fe=0,this.ge=Wa(),this.pe=he.EMPTY_BYTE_STRING,this.ye=!1,this.we=!0}get current(){return this.ye}get resumeToken(){return this.pe}get Se(){return this.fe!==0}get be(){return this.we}De(e){e.approximateByteSize()>0&&(this.we=!0,this.pe=e)}ve(){let e=q(),t=q(),r=q();return this.ge.forEach((s,o)=>{switch(o){case 0:e=e.add(s);break;case 2:t=t.add(s);break;case 1:r=r.add(s);break;default:U()}}),new qn(this.pe,this.ye,e,t,r)}Ce(){this.we=!1,this.ge=Wa()}Fe(e,t){this.we=!0,this.ge=this.ge.insert(e,t)}Me(e){this.we=!0,this.ge=this.ge.remove(e)}xe(){this.fe+=1}Oe(){this.fe-=1,Q(this.fe>=0)}Ne(){this.we=!0,this.ye=!0}}class Tp{constructor(e){this.Le=e,this.Be=new Map,this.ke=Qe(),this.qe=Ka(),this.Qe=new ee(K)}Ke(e){for(const t of e.Re)e.Ve&&e.Ve.isFoundDocument()?this.$e(t,e.Ve):this.Ue(t,e.key,e.Ve);for(const t of e.removedTargetIds)this.Ue(t,e.key,e.Ve)}We(e){this.forEachTarget(e,t=>{const r=this.Ge(t);switch(e.state){case 0:this.ze(t)&&r.De(e.resumeToken);break;case 1:r.Oe(),r.Se||r.Ce(),r.De(e.resumeToken);break;case 2:r.Oe(),r.Se||this.removeTarget(t);break;case 3:this.ze(t)&&(r.Ne(),r.De(e.resumeToken));break;case 4:this.ze(t)&&(this.je(t),r.De(e.resumeToken));break;default:U()}})}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.Be.forEach((r,s)=>{this.ze(s)&&t(s)})}He(e){const t=e.targetId,r=e.me.count,s=this.Je(t);if(s){const o=s.target;if(ti(o))if(r===0){const a=new F(o.path);this.Ue(t,a,_e.newNoDocument(a,$.min()))}else Q(r===1);else{const a=this.Ye(t);if(a!==r){const c=this.Ze(e),h=c?this.Xe(c,e,a):1;if(h!==0){this.je(t);const d=h===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Qe=this.Qe.insert(t,d)}}}}}Ze(e){const t=e.me.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:r="",padding:s=0},hashCount:o=0}=t;let a,c;try{a=Ct(r).toUint8Array()}catch(h){if(h instanceof wc)return zt("Decoding the base64 bloom filter in existence filter failed ("+h.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw h}try{c=new Ni(a,s,o)}catch(h){return zt(h instanceof An?"BloomFilter error: ":"Applying bloom filter failed: ",h),null}return c.Ie===0?null:c}Xe(e,t,r){return t.me.count===r-this.nt(e,t.targetId)?0:2}nt(e,t){const r=this.Le.getRemoteKeysForTarget(t);let s=0;return r.forEach(o=>{const a=this.Le.tt(),c=`projects/${a.projectId}/databases/${a.database}/documents/${o.path.canonicalString()}`;e.mightContain(c)||(this.Ue(t,o,null),s++)}),s}rt(e){const t=new Map;this.Be.forEach((o,a)=>{const c=this.Je(a);if(c){if(o.current&&ti(c.target)){const h=new F(c.target.path);this.ke.get(h)!==null||this.it(a,h)||this.Ue(a,h,_e.newNoDocument(h,e))}o.be&&(t.set(a,o.ve()),o.Ce())}});let r=q();this.qe.forEach((o,a)=>{let c=!0;a.forEachWhile(h=>{const d=this.Je(h);return!d||d.purpose==="TargetPurposeLimboResolution"||(c=!1,!1)}),c&&(r=r.add(o))}),this.ke.forEach((o,a)=>a.setReadTime(e));const s=new Xr(e,t,this.Qe,this.ke,r);return this.ke=Qe(),this.qe=Ka(),this.Qe=new ee(K),s}$e(e,t){if(!this.ze(e))return;const r=this.it(e,t.key)?2:0;this.Ge(e).Fe(t.key,r),this.ke=this.ke.insert(t.key,t),this.qe=this.qe.insert(t.key,this.st(t.key).add(e))}Ue(e,t,r){if(!this.ze(e))return;const s=this.Ge(e);this.it(e,t)?s.Fe(t,1):s.Me(t),this.qe=this.qe.insert(t,this.st(t).delete(e)),r&&(this.ke=this.ke.insert(t,r))}removeTarget(e){this.Be.delete(e)}Ye(e){const t=this.Ge(e).ve();return this.Le.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}xe(e){this.Ge(e).xe()}Ge(e){let t=this.Be.get(e);return t||(t=new Ga,this.Be.set(e,t)),t}st(e){let t=this.qe.get(e);return t||(t=new ue(K),this.qe=this.qe.insert(e,t)),t}ze(e){const t=this.Je(e)!==null;return t||O("WatchChangeAggregator","Detected inactive target",e),t}Je(e){const t=this.Be.get(e);return t&&t.Se?null:this.Le.ot(e)}je(e){this.Be.set(e,new Ga),this.Le.getRemoteKeysForTarget(e).forEach(t=>{this.Ue(e,t,null)})}it(e,t){return this.Le.getRemoteKeysForTarget(e).has(t)}}function Ka(){return new ee(F.comparator)}function Wa(){return new ee(F.comparator)}const wp={asc:"ASCENDING",desc:"DESCENDING"},Ap={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},bp={and:"AND",or:"OR"};class Rp{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function ri(n,e){return n.useProto3Json||Hr(e)?e:{value:e}}function Nr(n,e){return n.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function Gc(n,e){return n.useProto3Json?e.toBase64():e.toUint8Array()}function Pp(n,e){return Nr(n,e.toTimestamp())}function Me(n){return Q(!!n),$.fromTimestamp(function(t){const r=lt(t);return new ie(r.seconds,r.nanos)}(n))}function Oi(n,e){return si(n,e).canonicalString()}function si(n,e){const t=function(s){return new Z(["projects",s.projectId,"databases",s.database])}(n).child("documents");return e===void 0?t:t.child(e)}function Kc(n){const e=Z.fromString(n);return Q(Jc(e)),e}function ii(n,e){return Oi(n.databaseId,e.path)}function Ms(n,e){const t=Kc(e);if(t.get(1)!==n.databaseId.projectId)throw new x(C.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+n.databaseId.projectId);if(t.get(3)!==n.databaseId.database)throw new x(C.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+n.databaseId.database);return new F(Qc(t))}function Wc(n,e){return Oi(n.databaseId,e)}function Sp(n){const e=Kc(n);return e.length===4?Z.emptyPath():Qc(e)}function oi(n){return new Z(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function Qc(n){return Q(n.length>4&&n.get(4)==="documents"),n.popFirst(5)}function Qa(n,e,t){return{name:ii(n,e),fields:t.value.mapValue.fields}}function Cp(n,e){let t;if("targetChange"in e){e.targetChange;const r=function(d){return d==="NO_CHANGE"?0:d==="ADD"?1:d==="REMOVE"?2:d==="CURRENT"?3:d==="RESET"?4:U()}(e.targetChange.targetChangeType||"NO_CHANGE"),s=e.targetChange.targetIds||[],o=function(d,m){return d.useProto3Json?(Q(m===void 0||typeof m=="string"),he.fromBase64String(m||"")):(Q(m===void 0||m instanceof Buffer||m instanceof Uint8Array),he.fromUint8Array(m||new Uint8Array))}(n,e.targetChange.resumeToken),a=e.targetChange.cause,c=a&&function(d){const m=d.code===void 0?C.UNKNOWN:qc(d.code);return new x(m,d.message||"")}(a);t=new Hc(r,s,o,c||null)}else if("documentChange"in e){e.documentChange;const r=e.documentChange;r.document,r.document.name,r.document.updateTime;const s=Ms(n,r.document.name),o=Me(r.document.updateTime),a=r.document.createTime?Me(r.document.createTime):$.min(),c=new Te({mapValue:{fields:r.document.fields}}),h=_e.newFoundDocument(s,o,a,c),d=r.targetIds||[],m=r.removedTargetIds||[];t=new Ir(d,m,h.key,h)}else if("documentDelete"in e){e.documentDelete;const r=e.documentDelete;r.document;const s=Ms(n,r.document),o=r.readTime?Me(r.readTime):$.min(),a=_e.newNoDocument(s,o),c=r.removedTargetIds||[];t=new Ir([],c,a.key,a)}else if("documentRemove"in e){e.documentRemove;const r=e.documentRemove;r.document;const s=Ms(n,r.document),o=r.removedTargetIds||[];t=new Ir([],o,s,null)}else{if(!("filter"in e))return U();{e.filter;const r=e.filter;r.targetId;const{count:s=0,unchangedNames:o}=r,a=new _p(s,o),c=r.targetId;t=new zc(c,a)}}return t}function Dp(n,e){let t;if(e instanceof jn)t={update:Qa(n,e.key,e.value)};else if(e instanceof Vi)t={delete:ii(n,e.key)};else if(e instanceof ht)t={update:Qa(n,e.key,e.data),updateMask:Bp(e.fieldMask)};else{if(!(e instanceof pp))return U();t={verify:ii(n,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map(r=>function(o,a){const c=a.transform;if(c instanceof Vr)return{fieldPath:a.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(c instanceof Ln)return{fieldPath:a.field.canonicalString(),appendMissingElements:{values:c.elements}};if(c instanceof Mn)return{fieldPath:a.field.canonicalString(),removeAllFromArray:{values:c.elements}};if(c instanceof kr)return{fieldPath:a.field.canonicalString(),increment:c.Pe};throw U()}(0,r))),e.precondition.isNone||(t.currentDocument=function(s,o){return o.updateTime!==void 0?{updateTime:Pp(s,o.updateTime)}:o.exists!==void 0?{exists:o.exists}:U()}(n,e.precondition)),t}function Vp(n,e){return n&&n.length>0?(Q(e!==void 0),n.map(t=>function(s,o){let a=s.updateTime?Me(s.updateTime):Me(o);return a.isEqual($.min())&&(a=Me(o)),new dp(a,s.transformResults||[])}(t,e))):[]}function kp(n,e){return{documents:[Wc(n,e.path)]}}function Np(n,e){const t={structuredQuery:{}},r=e.path;let s;e.collectionGroup!==null?(s=r,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(s=r.popLast(),t.structuredQuery.from=[{collectionId:r.lastSegment()}]),t.parent=Wc(n,s);const o=function(d){if(d.length!==0)return Xc(Ue.create(d,"and"))}(e.filters);o&&(t.structuredQuery.where=o);const a=function(d){if(d.length!==0)return d.map(m=>function(w){return{field:Ut(w.field),direction:Lp(w.dir)}}(m))}(e.orderBy);a&&(t.structuredQuery.orderBy=a);const c=ri(n,e.limit);return c!==null&&(t.structuredQuery.limit=c),e.startAt&&(t.structuredQuery.startAt=function(d){return{before:d.inclusive,values:d.position}}(e.startAt)),e.endAt&&(t.structuredQuery.endAt=function(d){return{before:!d.inclusive,values:d.position}}(e.endAt)),{_t:t,parent:s}}function Op(n){let e=Sp(n.parent);const t=n.structuredQuery,r=t.from?t.from.length:0;let s=null;if(r>0){Q(r===1);const m=t.from[0];m.allDescendants?s=m.collectionId:e=e.child(m.collectionId)}let o=[];t.where&&(o=function(_){const w=Yc(_);return w instanceof Ue&&Pc(w)?w.getFilters():[w]}(t.where));let a=[];t.orderBy&&(a=function(_){return _.map(w=>function(D){return new Dr($t(D.field),function(S){switch(S){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(D.direction))}(w))}(t.orderBy));let c=null;t.limit&&(c=function(_){let w;return w=typeof _=="object"?_.value:_,Hr(w)?null:w}(t.limit));let h=null;t.startAt&&(h=function(_){const w=!!_.before,b=_.values||[];return new Cr(b,w)}(t.startAt));let d=null;return t.endAt&&(d=function(_){const w=!_.before,b=_.values||[];return new Cr(b,w)}(t.endAt)),Jm(e,s,a,o,c,"F",h,d)}function xp(n,e){const t=function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return U()}}(e.purpose);return t==null?null:{"goog-listen-tags":t}}function Yc(n){return n.unaryFilter!==void 0?function(t){switch(t.unaryFilter.op){case"IS_NAN":const r=$t(t.unaryFilter.field);return se.create(r,"==",{doubleValue:NaN});case"IS_NULL":const s=$t(t.unaryFilter.field);return se.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const o=$t(t.unaryFilter.field);return se.create(o,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const a=$t(t.unaryFilter.field);return se.create(a,"!=",{nullValue:"NULL_VALUE"});default:return U()}}(n):n.fieldFilter!==void 0?function(t){return se.create($t(t.fieldFilter.field),function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return U()}}(t.fieldFilter.op),t.fieldFilter.value)}(n):n.compositeFilter!==void 0?function(t){return Ue.create(t.compositeFilter.filters.map(r=>Yc(r)),function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return U()}}(t.compositeFilter.op))}(n):U()}function Lp(n){return wp[n]}function Mp(n){return Ap[n]}function Fp(n){return bp[n]}function Ut(n){return{fieldPath:n.canonicalString()}}function $t(n){return ce.fromServerFormat(n.fieldPath)}function Xc(n){return n instanceof se?function(t){if(t.op==="=="){if(xa(t.value))return{unaryFilter:{field:Ut(t.field),op:"IS_NAN"}};if(Oa(t.value))return{unaryFilter:{field:Ut(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(xa(t.value))return{unaryFilter:{field:Ut(t.field),op:"IS_NOT_NAN"}};if(Oa(t.value))return{unaryFilter:{field:Ut(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Ut(t.field),op:Mp(t.op),value:t.value}}}(n):n instanceof Ue?function(t){const r=t.getFilters().map(s=>Xc(s));return r.length===1?r[0]:{compositeFilter:{op:Fp(t.op),filters:r}}}(n):U()}function Bp(n){const e=[];return n.fields.forEach(t=>e.push(t.canonicalString())),{fieldPaths:e}}function Jc(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}/**
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
 */class tt{constructor(e,t,r,s,o=$.min(),a=$.min(),c=he.EMPTY_BYTE_STRING,h=null){this.target=e,this.targetId=t,this.purpose=r,this.sequenceNumber=s,this.snapshotVersion=o,this.lastLimboFreeSnapshotVersion=a,this.resumeToken=c,this.expectedCount=h}withSequenceNumber(e){return new tt(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new tt(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new tt(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new tt(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
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
 */class Up{constructor(e){this.ct=e}}function $p(n){const e=Op({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?ni(e,e.limit,"L"):e}/**
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
 */class jp{constructor(){this.un=new qp}addToCollectionParentIndex(e,t){return this.un.add(t),P.resolve()}getCollectionParents(e,t){return P.resolve(this.un.getEntries(t))}addFieldIndex(e,t){return P.resolve()}deleteFieldIndex(e,t){return P.resolve()}deleteAllFieldIndexes(e){return P.resolve()}createTargetIndexes(e,t){return P.resolve()}getDocumentsMatchingTarget(e,t){return P.resolve(null)}getIndexType(e,t){return P.resolve(0)}getFieldIndexes(e,t){return P.resolve([])}getNextCollectionGroupToUpdate(e){return P.resolve(null)}getMinOffset(e,t){return P.resolve(at.min())}getMinOffsetFromCollectionGroup(e,t){return P.resolve(at.min())}updateCollectionGroup(e,t,r){return P.resolve()}updateIndexEntries(e,t){return P.resolve()}}class qp{constructor(){this.index={}}add(e){const t=e.lastSegment(),r=e.popLast(),s=this.index[t]||new ue(Z.comparator),o=!s.has(r);return this.index[t]=s.add(r),o}has(e){const t=e.lastSegment(),r=e.popLast(),s=this.index[t];return s&&s.has(r)}getEntries(e){return(this.index[e]||new ue(Z.comparator)).toArray()}}/**
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
 */class zp{constructor(){this.changes=new en(e=>e.toString(),(e,t)=>e.isEqual(t)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,_e.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const r=this.changes.get(t);return r!==void 0?P.resolve(r):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
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
 */class Hp{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
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
 */class Gp{constructor(e,t,r,s){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=r,this.indexManager=s}getDocument(e,t){let r=null;return this.documentOverlayCache.getOverlay(e,t).next(s=>(r=s,this.remoteDocumentCache.getEntry(e,t))).next(s=>(r!==null&&Dn(r.mutation,s,Re.empty(),ie.now()),s))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next(r=>this.getLocalViewOfDocuments(e,r,q()).next(()=>r))}getLocalViewOfDocuments(e,t,r=q()){const s=It();return this.populateOverlays(e,s,t).next(()=>this.computeViews(e,t,s,r).next(o=>{let a=wn();return o.forEach((c,h)=>{a=a.insert(c,h.overlayedDocument)}),a}))}getOverlayedDocuments(e,t){const r=It();return this.populateOverlays(e,r,t).next(()=>this.computeViews(e,t,r,q()))}populateOverlays(e,t,r){const s=[];return r.forEach(o=>{t.has(o)||s.push(o)}),this.documentOverlayCache.getOverlays(e,s).next(o=>{o.forEach((a,c)=>{t.set(a,c)})})}computeViews(e,t,r,s){let o=Qe();const a=Cn(),c=function(){return Cn()}();return t.forEach((h,d)=>{const m=r.get(d.key);s.has(d.key)&&(m===void 0||m.mutation instanceof ht)?o=o.insert(d.key,d):m!==void 0?(a.set(d.key,m.mutation.getFieldMask()),Dn(m.mutation,d,m.mutation.getFieldMask(),ie.now())):a.set(d.key,Re.empty())}),this.recalculateAndSaveOverlays(e,o).next(h=>(h.forEach((d,m)=>a.set(d,m)),t.forEach((d,m)=>{var _;return c.set(d,new Hp(m,(_=a.get(d))!==null&&_!==void 0?_:null))}),c))}recalculateAndSaveOverlays(e,t){const r=Cn();let s=new ee((a,c)=>a-c),o=q();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next(a=>{for(const c of a)c.keys().forEach(h=>{const d=t.get(h);if(d===null)return;let m=r.get(h)||Re.empty();m=c.applyToLocalView(d,m),r.set(h,m);const _=(s.get(c.batchId)||q()).add(h);s=s.insert(c.batchId,_)})}).next(()=>{const a=[],c=s.getReverseIterator();for(;c.hasNext();){const h=c.getNext(),d=h.key,m=h.value,_=xc();m.forEach(w=>{if(!o.has(w)){const b=$c(t.get(w),r.get(w));b!==null&&_.set(w,b),o=o.add(w)}}),a.push(this.documentOverlayCache.saveOverlays(e,d,_))}return P.waitFor(a)}).next(()=>r)}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next(r=>this.recalculateAndSaveOverlays(e,r))}getDocumentsMatchingQuery(e,t,r,s){return function(a){return F.isDocumentKey(a.path)&&a.collectionGroup===null&&a.filters.length===0}(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):Zm(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,r,s):this.getDocumentsMatchingCollectionQuery(e,t,r,s)}getNextDocuments(e,t,r,s){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,r,s).next(o=>{const a=s-o.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,r.largestBatchId,s-o.size):P.resolve(It());let c=-1,h=o;return a.next(d=>P.forEach(d,(m,_)=>(c<_.largestBatchId&&(c=_.largestBatchId),o.get(m)?P.resolve():this.remoteDocumentCache.getEntry(e,m).next(w=>{h=h.insert(m,w)}))).next(()=>this.populateOverlays(e,d,o)).next(()=>this.computeViews(e,h,d,q())).next(m=>({batchId:c,changes:Oc(m)})))})}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new F(t)).next(r=>{let s=wn();return r.isFoundDocument()&&(s=s.insert(r.key,r)),s})}getDocumentsMatchingCollectionGroupQuery(e,t,r,s){const o=t.collectionGroup;let a=wn();return this.indexManager.getCollectionParents(e,o).next(c=>P.forEach(c,h=>{const d=function(_,w){return new Gr(w,null,_.explicitOrderBy.slice(),_.filters.slice(),_.limit,_.limitType,_.startAt,_.endAt)}(t,h.child(o));return this.getDocumentsMatchingCollectionQuery(e,d,r,s).next(m=>{m.forEach((_,w)=>{a=a.insert(_,w)})})}).next(()=>a))}getDocumentsMatchingCollectionQuery(e,t,r,s){let o;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,r.largestBatchId).next(a=>(o=a,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,r,o,s))).next(a=>{o.forEach((h,d)=>{const m=d.getKey();a.get(m)===null&&(a=a.insert(m,_e.newInvalidDocument(m)))});let c=wn();return a.forEach((h,d)=>{const m=o.get(h);m!==void 0&&Dn(m.mutation,d,Re.empty(),ie.now()),Wr(t,d)&&(c=c.insert(h,d))}),c})}}/**
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
 */class Kp{constructor(e){this.serializer=e,this.hr=new Map,this.Pr=new Map}getBundleMetadata(e,t){return P.resolve(this.hr.get(t))}saveBundleMetadata(e,t){return this.hr.set(t.id,function(s){return{id:s.id,version:s.version,createTime:Me(s.createTime)}}(t)),P.resolve()}getNamedQuery(e,t){return P.resolve(this.Pr.get(t))}saveNamedQuery(e,t){return this.Pr.set(t.name,function(s){return{name:s.name,query:$p(s.bundledQuery),readTime:Me(s.readTime)}}(t)),P.resolve()}}/**
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
 */class Wp{constructor(){this.overlays=new ee(F.comparator),this.Ir=new Map}getOverlay(e,t){return P.resolve(this.overlays.get(t))}getOverlays(e,t){const r=It();return P.forEach(t,s=>this.getOverlay(e,s).next(o=>{o!==null&&r.set(s,o)})).next(()=>r)}saveOverlays(e,t,r){return r.forEach((s,o)=>{this.ht(e,t,o)}),P.resolve()}removeOverlaysForBatchId(e,t,r){const s=this.Ir.get(r);return s!==void 0&&(s.forEach(o=>this.overlays=this.overlays.remove(o)),this.Ir.delete(r)),P.resolve()}getOverlaysForCollection(e,t,r){const s=It(),o=t.length+1,a=new F(t.child("")),c=this.overlays.getIteratorFrom(a);for(;c.hasNext();){const h=c.getNext().value,d=h.getKey();if(!t.isPrefixOf(d.path))break;d.path.length===o&&h.largestBatchId>r&&s.set(h.getKey(),h)}return P.resolve(s)}getOverlaysForCollectionGroup(e,t,r,s){let o=new ee((d,m)=>d-m);const a=this.overlays.getIterator();for(;a.hasNext();){const d=a.getNext().value;if(d.getKey().getCollectionGroup()===t&&d.largestBatchId>r){let m=o.get(d.largestBatchId);m===null&&(m=It(),o=o.insert(d.largestBatchId,m)),m.set(d.getKey(),d)}}const c=It(),h=o.getIterator();for(;h.hasNext()&&(h.getNext().value.forEach((d,m)=>c.set(d,m)),!(c.size()>=s)););return P.resolve(c)}ht(e,t,r){const s=this.overlays.get(r.key);if(s!==null){const a=this.Ir.get(s.largestBatchId).delete(r.key);this.Ir.set(s.largestBatchId,a)}this.overlays=this.overlays.insert(r.key,new yp(t,r));let o=this.Ir.get(t);o===void 0&&(o=q(),this.Ir.set(t,o)),this.Ir.set(t,o.add(r.key))}}/**
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
 */class Qp{constructor(){this.sessionToken=he.EMPTY_BYTE_STRING}getSessionToken(e){return P.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,P.resolve()}}/**
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
 */class xi{constructor(){this.Tr=new ue(oe.Er),this.dr=new ue(oe.Ar)}isEmpty(){return this.Tr.isEmpty()}addReference(e,t){const r=new oe(e,t);this.Tr=this.Tr.add(r),this.dr=this.dr.add(r)}Rr(e,t){e.forEach(r=>this.addReference(r,t))}removeReference(e,t){this.Vr(new oe(e,t))}mr(e,t){e.forEach(r=>this.removeReference(r,t))}gr(e){const t=new F(new Z([])),r=new oe(t,e),s=new oe(t,e+1),o=[];return this.dr.forEachInRange([r,s],a=>{this.Vr(a),o.push(a.key)}),o}pr(){this.Tr.forEach(e=>this.Vr(e))}Vr(e){this.Tr=this.Tr.delete(e),this.dr=this.dr.delete(e)}yr(e){const t=new F(new Z([])),r=new oe(t,e),s=new oe(t,e+1);let o=q();return this.dr.forEachInRange([r,s],a=>{o=o.add(a.key)}),o}containsKey(e){const t=new oe(e,0),r=this.Tr.firstAfterOrEqual(t);return r!==null&&e.isEqual(r.key)}}class oe{constructor(e,t){this.key=e,this.wr=t}static Er(e,t){return F.comparator(e.key,t.key)||K(e.wr,t.wr)}static Ar(e,t){return K(e.wr,t.wr)||F.comparator(e.key,t.key)}}/**
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
 */class Yp{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Sr=1,this.br=new ue(oe.Er)}checkEmpty(e){return P.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,r,s){const o=this.Sr;this.Sr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const a=new gp(o,t,r,s);this.mutationQueue.push(a);for(const c of s)this.br=this.br.add(new oe(c.key,o)),this.indexManager.addToCollectionParentIndex(e,c.key.path.popLast());return P.resolve(a)}lookupMutationBatch(e,t){return P.resolve(this.Dr(t))}getNextMutationBatchAfterBatchId(e,t){const r=t+1,s=this.vr(r),o=s<0?0:s;return P.resolve(this.mutationQueue.length>o?this.mutationQueue[o]:null)}getHighestUnacknowledgedBatchId(){return P.resolve(this.mutationQueue.length===0?-1:this.Sr-1)}getAllMutationBatches(e){return P.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const r=new oe(t,0),s=new oe(t,Number.POSITIVE_INFINITY),o=[];return this.br.forEachInRange([r,s],a=>{const c=this.Dr(a.wr);o.push(c)}),P.resolve(o)}getAllMutationBatchesAffectingDocumentKeys(e,t){let r=new ue(K);return t.forEach(s=>{const o=new oe(s,0),a=new oe(s,Number.POSITIVE_INFINITY);this.br.forEachInRange([o,a],c=>{r=r.add(c.wr)})}),P.resolve(this.Cr(r))}getAllMutationBatchesAffectingQuery(e,t){const r=t.path,s=r.length+1;let o=r;F.isDocumentKey(o)||(o=o.child(""));const a=new oe(new F(o),0);let c=new ue(K);return this.br.forEachWhile(h=>{const d=h.key.path;return!!r.isPrefixOf(d)&&(d.length===s&&(c=c.add(h.wr)),!0)},a),P.resolve(this.Cr(c))}Cr(e){const t=[];return e.forEach(r=>{const s=this.Dr(r);s!==null&&t.push(s)}),t}removeMutationBatch(e,t){Q(this.Fr(t.batchId,"removed")===0),this.mutationQueue.shift();let r=this.br;return P.forEach(t.mutations,s=>{const o=new oe(s.key,t.batchId);return r=r.delete(o),this.referenceDelegate.markPotentiallyOrphaned(e,s.key)}).next(()=>{this.br=r})}On(e){}containsKey(e,t){const r=new oe(t,0),s=this.br.firstAfterOrEqual(r);return P.resolve(t.isEqual(s&&s.key))}performConsistencyCheck(e){return this.mutationQueue.length,P.resolve()}Fr(e,t){return this.vr(e)}vr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Dr(e){const t=this.vr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
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
 */class Xp{constructor(e){this.Mr=e,this.docs=function(){return new ee(F.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const r=t.key,s=this.docs.get(r),o=s?s.size:0,a=this.Mr(t);return this.docs=this.docs.insert(r,{document:t.mutableCopy(),size:a}),this.size+=a-o,this.indexManager.addToCollectionParentIndex(e,r.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const r=this.docs.get(t);return P.resolve(r?r.document.mutableCopy():_e.newInvalidDocument(t))}getEntries(e,t){let r=Qe();return t.forEach(s=>{const o=this.docs.get(s);r=r.insert(s,o?o.document.mutableCopy():_e.newInvalidDocument(s))}),P.resolve(r)}getDocumentsMatchingQuery(e,t,r,s){let o=Qe();const a=t.path,c=new F(a.child("")),h=this.docs.getIteratorFrom(c);for(;h.hasNext();){const{key:d,value:{document:m}}=h.getNext();if(!a.isPrefixOf(d.path))break;d.path.length>a.length+1||Nm(km(m),r)<=0||(s.has(m.key)||Wr(t,m))&&(o=o.insert(m.key,m.mutableCopy()))}return P.resolve(o)}getAllFromCollectionGroup(e,t,r,s){U()}Or(e,t){return P.forEach(this.docs,r=>t(r))}newChangeBuffer(e){return new Jp(this)}getSize(e){return P.resolve(this.size)}}class Jp extends zp{constructor(e){super(),this.cr=e}applyChanges(e){const t=[];return this.changes.forEach((r,s)=>{s.isValidDocument()?t.push(this.cr.addEntry(e,s)):this.cr.removeEntry(r)}),P.waitFor(t)}getFromCache(e,t){return this.cr.getEntry(e,t)}getAllFromCache(e,t){return this.cr.getEntries(e,t)}}/**
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
 */class Zp{constructor(e){this.persistence=e,this.Nr=new en(t=>Pi(t),Si),this.lastRemoteSnapshotVersion=$.min(),this.highestTargetId=0,this.Lr=0,this.Br=new xi,this.targetCount=0,this.kr=Wt.Bn()}forEachTarget(e,t){return this.Nr.forEach((r,s)=>t(s)),P.resolve()}getLastRemoteSnapshotVersion(e){return P.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return P.resolve(this.Lr)}allocateTargetId(e){return this.highestTargetId=this.kr.next(),P.resolve(this.highestTargetId)}setTargetsMetadata(e,t,r){return r&&(this.lastRemoteSnapshotVersion=r),t>this.Lr&&(this.Lr=t),P.resolve()}Kn(e){this.Nr.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.kr=new Wt(t),this.highestTargetId=t),e.sequenceNumber>this.Lr&&(this.Lr=e.sequenceNumber)}addTargetData(e,t){return this.Kn(t),this.targetCount+=1,P.resolve()}updateTargetData(e,t){return this.Kn(t),P.resolve()}removeTargetData(e,t){return this.Nr.delete(t.target),this.Br.gr(t.targetId),this.targetCount-=1,P.resolve()}removeTargets(e,t,r){let s=0;const o=[];return this.Nr.forEach((a,c)=>{c.sequenceNumber<=t&&r.get(c.targetId)===null&&(this.Nr.delete(a),o.push(this.removeMatchingKeysForTargetId(e,c.targetId)),s++)}),P.waitFor(o).next(()=>s)}getTargetCount(e){return P.resolve(this.targetCount)}getTargetData(e,t){const r=this.Nr.get(t)||null;return P.resolve(r)}addMatchingKeys(e,t,r){return this.Br.Rr(t,r),P.resolve()}removeMatchingKeys(e,t,r){this.Br.mr(t,r);const s=this.persistence.referenceDelegate,o=[];return s&&t.forEach(a=>{o.push(s.markPotentiallyOrphaned(e,a))}),P.waitFor(o)}removeMatchingKeysForTargetId(e,t){return this.Br.gr(t),P.resolve()}getMatchingKeysForTargetId(e,t){const r=this.Br.yr(t);return P.resolve(r)}containsKey(e,t){return P.resolve(this.Br.containsKey(t))}}/**
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
 */class eg{constructor(e,t){this.qr={},this.overlays={},this.Qr=new wi(0),this.Kr=!1,this.Kr=!0,this.$r=new Qp,this.referenceDelegate=e(this),this.Ur=new Zp(this),this.indexManager=new jp,this.remoteDocumentCache=function(s){return new Xp(s)}(r=>this.referenceDelegate.Wr(r)),this.serializer=new Up(t),this.Gr=new Kp(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.Kr=!1,Promise.resolve()}get started(){return this.Kr}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new Wp,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let r=this.qr[e.toKey()];return r||(r=new Yp(t,this.referenceDelegate),this.qr[e.toKey()]=r),r}getGlobalsCache(){return this.$r}getTargetCache(){return this.Ur}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Gr}runTransaction(e,t,r){O("MemoryPersistence","Starting transaction:",e);const s=new tg(this.Qr.next());return this.referenceDelegate.zr(),r(s).next(o=>this.referenceDelegate.jr(s).next(()=>o)).toPromise().then(o=>(s.raiseOnCommittedEvent(),o))}Hr(e,t){return P.or(Object.values(this.qr).map(r=>()=>r.containsKey(e,t)))}}class tg extends xm{constructor(e){super(),this.currentSequenceNumber=e}}class Li{constructor(e){this.persistence=e,this.Jr=new xi,this.Yr=null}static Zr(e){return new Li(e)}get Xr(){if(this.Yr)return this.Yr;throw U()}addReference(e,t,r){return this.Jr.addReference(r,t),this.Xr.delete(r.toString()),P.resolve()}removeReference(e,t,r){return this.Jr.removeReference(r,t),this.Xr.add(r.toString()),P.resolve()}markPotentiallyOrphaned(e,t){return this.Xr.add(t.toString()),P.resolve()}removeTarget(e,t){this.Jr.gr(t.targetId).forEach(s=>this.Xr.add(s.toString()));const r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(e,t.targetId).next(s=>{s.forEach(o=>this.Xr.add(o.toString()))}).next(()=>r.removeTargetData(e,t))}zr(){this.Yr=new Set}jr(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return P.forEach(this.Xr,r=>{const s=F.fromPath(r);return this.ei(e,s).next(o=>{o||t.removeEntry(s,$.min())})}).next(()=>(this.Yr=null,t.apply(e)))}updateLimboDocument(e,t){return this.ei(e,t).next(r=>{r?this.Xr.delete(t.toString()):this.Xr.add(t.toString())})}Wr(e){return 0}ei(e,t){return P.or([()=>P.resolve(this.Jr.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Hr(e,t)])}}/**
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
 */class Mi{constructor(e,t,r,s){this.targetId=e,this.fromCache=t,this.$i=r,this.Ui=s}static Wi(e,t){let r=q(),s=q();for(const o of t.docChanges)switch(o.type){case 0:r=r.add(o.doc.key);break;case 1:s=s.add(o.doc.key)}return new Mi(e,t.fromCache,r,s)}}/**
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
 */class ng{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
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
 */class rg{constructor(){this.Gi=!1,this.zi=!1,this.ji=100,this.Hi=function(){return Bh()?8:Lm(Lh())>0?6:4}()}initialize(e,t){this.Ji=e,this.indexManager=t,this.Gi=!0}getDocumentsMatchingQuery(e,t,r,s){const o={result:null};return this.Yi(e,t).next(a=>{o.result=a}).next(()=>{if(!o.result)return this.Zi(e,t,s,r).next(a=>{o.result=a})}).next(()=>{if(o.result)return;const a=new ng;return this.Xi(e,t,a).next(c=>{if(o.result=c,this.zi)return this.es(e,t,a,c.size)})}).next(()=>o.result)}es(e,t,r,s){return r.documentReadCount<this.ji?(En()<=H.DEBUG&&O("QueryEngine","SDK will not create cache indexes for query:",Bt(t),"since it only creates cache indexes for collection contains","more than or equal to",this.ji,"documents"),P.resolve()):(En()<=H.DEBUG&&O("QueryEngine","Query:",Bt(t),"scans",r.documentReadCount,"local documents and returns",s,"documents as results."),r.documentReadCount>this.Hi*s?(En()<=H.DEBUG&&O("QueryEngine","The SDK decides to create cache indexes for query:",Bt(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,Le(t))):P.resolve())}Yi(e,t){if(Ba(t))return P.resolve(null);let r=Le(t);return this.indexManager.getIndexType(e,r).next(s=>s===0?null:(t.limit!==null&&s===1&&(t=ni(t,null,"F"),r=Le(t)),this.indexManager.getDocumentsMatchingTarget(e,r).next(o=>{const a=q(...o);return this.Ji.getDocuments(e,a).next(c=>this.indexManager.getMinOffset(e,r).next(h=>{const d=this.ts(t,c);return this.ns(t,d,a,h.readTime)?this.Yi(e,ni(t,null,"F")):this.rs(e,d,t,h)}))})))}Zi(e,t,r,s){return Ba(t)||s.isEqual($.min())?P.resolve(null):this.Ji.getDocuments(e,r).next(o=>{const a=this.ts(t,o);return this.ns(t,a,r,s)?P.resolve(null):(En()<=H.DEBUG&&O("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),Bt(t)),this.rs(e,a,t,Vm(s,-1)).next(c=>c))})}ts(e,t){let r=new ue(kc(e));return t.forEach((s,o)=>{Wr(e,o)&&(r=r.add(o))}),r}ns(e,t,r,s){if(e.limit===null)return!1;if(r.size!==t.size)return!0;const o=e.limitType==="F"?t.last():t.first();return!!o&&(o.hasPendingWrites||o.version.compareTo(s)>0)}Xi(e,t,r){return En()<=H.DEBUG&&O("QueryEngine","Using full collection scan to execute query:",Bt(t)),this.Ji.getDocumentsMatchingQuery(e,t,at.min(),r)}rs(e,t,r,s){return this.Ji.getDocumentsMatchingQuery(e,r,s).next(o=>(t.forEach(a=>{o=o.insert(a.key,a)}),o))}}/**
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
 */class sg{constructor(e,t,r,s){this.persistence=e,this.ss=t,this.serializer=s,this.os=new ee(K),this._s=new en(o=>Pi(o),Si),this.us=new Map,this.cs=e.getRemoteDocumentCache(),this.Ur=e.getTargetCache(),this.Gr=e.getBundleCache(),this.ls(r)}ls(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new Gp(this.cs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.cs.setIndexManager(this.indexManager),this.ss.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",t=>e.collect(t,this.os))}}function ig(n,e,t,r){return new sg(n,e,t,r)}async function Zc(n,e){const t=j(n);return await t.persistence.runTransaction("Handle user change","readonly",r=>{let s;return t.mutationQueue.getAllMutationBatches(r).next(o=>(s=o,t.ls(e),t.mutationQueue.getAllMutationBatches(r))).next(o=>{const a=[],c=[];let h=q();for(const d of s){a.push(d.batchId);for(const m of d.mutations)h=h.add(m.key)}for(const d of o){c.push(d.batchId);for(const m of d.mutations)h=h.add(m.key)}return t.localDocuments.getDocuments(r,h).next(d=>({hs:d,removedBatchIds:a,addedBatchIds:c}))})})}function og(n,e){const t=j(n);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",r=>{const s=e.batch.keys(),o=t.cs.newChangeBuffer({trackRemovals:!0});return function(c,h,d,m){const _=d.batch,w=_.keys();let b=P.resolve();return w.forEach(D=>{b=b.next(()=>m.getEntry(h,D)).next(k=>{const S=d.docVersions.get(D);Q(S!==null),k.version.compareTo(S)<0&&(_.applyToRemoteDocument(k,d),k.isValidDocument()&&(k.setReadTime(d.commitVersion),m.addEntry(k)))})}),b.next(()=>c.mutationQueue.removeMutationBatch(h,_))}(t,r,e,o).next(()=>o.apply(r)).next(()=>t.mutationQueue.performConsistencyCheck(r)).next(()=>t.documentOverlayCache.removeOverlaysForBatchId(r,s,e.batch.batchId)).next(()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(r,function(c){let h=q();for(let d=0;d<c.mutationResults.length;++d)c.mutationResults[d].transformResults.length>0&&(h=h.add(c.batch.mutations[d].key));return h}(e))).next(()=>t.localDocuments.getDocuments(r,s))})}function eu(n){const e=j(n);return e.persistence.runTransaction("Get last remote snapshot version","readonly",t=>e.Ur.getLastRemoteSnapshotVersion(t))}function ag(n,e){const t=j(n),r=e.snapshotVersion;let s=t.os;return t.persistence.runTransaction("Apply remote event","readwrite-primary",o=>{const a=t.cs.newChangeBuffer({trackRemovals:!0});s=t.os;const c=[];e.targetChanges.forEach((m,_)=>{const w=s.get(_);if(!w)return;c.push(t.Ur.removeMatchingKeys(o,m.removedDocuments,_).next(()=>t.Ur.addMatchingKeys(o,m.addedDocuments,_)));let b=w.withSequenceNumber(o.currentSequenceNumber);e.targetMismatches.get(_)!==null?b=b.withResumeToken(he.EMPTY_BYTE_STRING,$.min()).withLastLimboFreeSnapshotVersion($.min()):m.resumeToken.approximateByteSize()>0&&(b=b.withResumeToken(m.resumeToken,r)),s=s.insert(_,b),function(k,S,B){return k.resumeToken.approximateByteSize()===0||S.snapshotVersion.toMicroseconds()-k.snapshotVersion.toMicroseconds()>=3e8?!0:B.addedDocuments.size+B.modifiedDocuments.size+B.removedDocuments.size>0}(w,b,m)&&c.push(t.Ur.updateTargetData(o,b))});let h=Qe(),d=q();if(e.documentUpdates.forEach(m=>{e.resolvedLimboDocuments.has(m)&&c.push(t.persistence.referenceDelegate.updateLimboDocument(o,m))}),c.push(lg(o,a,e.documentUpdates).next(m=>{h=m.Ps,d=m.Is})),!r.isEqual($.min())){const m=t.Ur.getLastRemoteSnapshotVersion(o).next(_=>t.Ur.setTargetsMetadata(o,o.currentSequenceNumber,r));c.push(m)}return P.waitFor(c).next(()=>a.apply(o)).next(()=>t.localDocuments.getLocalViewOfDocuments(o,h,d)).next(()=>h)}).then(o=>(t.os=s,o))}function lg(n,e,t){let r=q(),s=q();return t.forEach(o=>r=r.add(o)),e.getEntries(n,r).next(o=>{let a=Qe();return t.forEach((c,h)=>{const d=o.get(c);h.isFoundDocument()!==d.isFoundDocument()&&(s=s.add(c)),h.isNoDocument()&&h.version.isEqual($.min())?(e.removeEntry(c,h.readTime),a=a.insert(c,h)):!d.isValidDocument()||h.version.compareTo(d.version)>0||h.version.compareTo(d.version)===0&&d.hasPendingWrites?(e.addEntry(h),a=a.insert(c,h)):O("LocalStore","Ignoring outdated watch update for ",c,". Current version:",d.version," Watch version:",h.version)}),{Ps:a,Is:s}})}function cg(n,e){const t=j(n);return t.persistence.runTransaction("Get next mutation batch","readonly",r=>(e===void 0&&(e=-1),t.mutationQueue.getNextMutationBatchAfterBatchId(r,e)))}function ug(n,e){const t=j(n);return t.persistence.runTransaction("Allocate target","readwrite",r=>{let s;return t.Ur.getTargetData(r,e).next(o=>o?(s=o,P.resolve(s)):t.Ur.allocateTargetId(r).next(a=>(s=new tt(e,a,"TargetPurposeListen",r.currentSequenceNumber),t.Ur.addTargetData(r,s).next(()=>s))))}).then(r=>{const s=t.os.get(r.targetId);return(s===null||r.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(t.os=t.os.insert(r.targetId,r),t._s.set(e,r.targetId)),r})}async function ai(n,e,t){const r=j(n),s=r.os.get(e),o=t?"readwrite":"readwrite-primary";try{t||await r.persistence.runTransaction("Release target",o,a=>r.persistence.referenceDelegate.removeTarget(a,s))}catch(a){if(!$n(a))throw a;O("LocalStore",`Failed to update sequence numbers for target ${e}: ${a}`)}r.os=r.os.remove(e),r._s.delete(s.target)}function Ya(n,e,t){const r=j(n);let s=$.min(),o=q();return r.persistence.runTransaction("Execute query","readwrite",a=>function(h,d,m){const _=j(h),w=_._s.get(m);return w!==void 0?P.resolve(_.os.get(w)):_.Ur.getTargetData(d,m)}(r,a,Le(e)).next(c=>{if(c)return s=c.lastLimboFreeSnapshotVersion,r.Ur.getMatchingKeysForTargetId(a,c.targetId).next(h=>{o=h})}).next(()=>r.ss.getDocumentsMatchingQuery(a,e,t?s:$.min(),t?o:q())).next(c=>(hg(r,tp(e),c),{documents:c,Ts:o})))}function hg(n,e,t){let r=n.us.get(e)||$.min();t.forEach((s,o)=>{o.readTime.compareTo(r)>0&&(r=o.readTime)}),n.us.set(e,r)}class Xa{constructor(){this.activeTargetIds=ap()}fs(e){this.activeTargetIds=this.activeTargetIds.add(e)}gs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Vs(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class dg{constructor(){this.so=new Xa,this.oo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,r){}addLocalQueryTarget(e,t=!0){return t&&this.so.fs(e),this.oo[e]||"not-current"}updateQueryState(e,t,r){this.oo[e]=t}removeLocalQueryTarget(e){this.so.gs(e)}isLocalQueryTarget(e){return this.so.activeTargetIds.has(e)}clearQueryState(e){delete this.oo[e]}getAllActiveQueryTargets(){return this.so.activeTargetIds}isActiveQueryTarget(e){return this.so.activeTargetIds.has(e)}start(){return this.so=new Xa,Promise.resolve()}handleUserChange(e,t,r){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
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
 */class fg{_o(e){}shutdown(){}}/**
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
 */class Ja{constructor(){this.ao=()=>this.uo(),this.co=()=>this.lo(),this.ho=[],this.Po()}_o(e){this.ho.push(e)}shutdown(){window.removeEventListener("online",this.ao),window.removeEventListener("offline",this.co)}Po(){window.addEventListener("online",this.ao),window.addEventListener("offline",this.co)}uo(){O("ConnectivityMonitor","Network connectivity changed: AVAILABLE");for(const e of this.ho)e(0)}lo(){O("ConnectivityMonitor","Network connectivity changed: UNAVAILABLE");for(const e of this.ho)e(1)}static D(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
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
 */let gr=null;function Fs(){return gr===null?gr=function(){return 268435456+Math.round(2147483648*Math.random())}():gr++,"0x"+gr.toString(16)}/**
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
 */const mg={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};/**
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
 */class pg{constructor(e){this.Io=e.Io,this.To=e.To}Eo(e){this.Ao=e}Ro(e){this.Vo=e}mo(e){this.fo=e}onMessage(e){this.po=e}close(){this.To()}send(e){this.Io(e)}yo(){this.Ao()}wo(){this.Vo()}So(e){this.fo(e)}bo(e){this.po(e)}}/**
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
 */const ge="WebChannelConnection";class gg extends class{constructor(t){this.databaseInfo=t,this.databaseId=t.databaseId;const r=t.ssl?"https":"http",s=encodeURIComponent(this.databaseId.projectId),o=encodeURIComponent(this.databaseId.database);this.Do=r+"://"+t.host,this.vo=`projects/${s}/databases/${o}`,this.Co=this.databaseId.database==="(default)"?`project_id=${s}`:`project_id=${s}&database_id=${o}`}get Fo(){return!1}Mo(t,r,s,o,a){const c=Fs(),h=this.xo(t,r.toUriEncodedString());O("RestConnection",`Sending RPC '${t}' ${c}:`,h,s);const d={"google-cloud-resource-prefix":this.vo,"x-goog-request-params":this.Co};return this.Oo(d,o,a),this.No(t,h,d,s).then(m=>(O("RestConnection",`Received RPC '${t}' ${c}: `,m),m),m=>{throw zt("RestConnection",`RPC '${t}' ${c} failed with error: `,m,"url: ",h,"request:",s),m})}Lo(t,r,s,o,a,c){return this.Mo(t,r,s,o,a)}Oo(t,r,s){t["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+Zt}(),t["Content-Type"]="text/plain",this.databaseInfo.appId&&(t["X-Firebase-GMPID"]=this.databaseInfo.appId),r&&r.headers.forEach((o,a)=>t[a]=o),s&&s.headers.forEach((o,a)=>t[a]=o)}xo(t,r){const s=mg[t];return`${this.Do}/v1/${r}:${s}`}terminate(){}}{constructor(e){super(e),this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}No(e,t,r,s){const o=Fs();return new Promise((a,c)=>{const h=new pc;h.setWithCredentials(!0),h.listenOnce(gc.COMPLETE,()=>{try{switch(h.getLastErrorCode()){case _r.NO_ERROR:const m=h.getResponseJson();O(ge,`XHR for RPC '${e}' ${o} received:`,JSON.stringify(m)),a(m);break;case _r.TIMEOUT:O(ge,`RPC '${e}' ${o} timed out`),c(new x(C.DEADLINE_EXCEEDED,"Request time out"));break;case _r.HTTP_ERROR:const _=h.getStatus();if(O(ge,`RPC '${e}' ${o} failed with status:`,_,"response text:",h.getResponseText()),_>0){let w=h.getResponseJson();Array.isArray(w)&&(w=w[0]);const b=w==null?void 0:w.error;if(b&&b.status&&b.message){const D=function(S){const B=S.toLowerCase().replace(/_/g,"-");return Object.values(C).indexOf(B)>=0?B:C.UNKNOWN}(b.status);c(new x(D,b.message))}else c(new x(C.UNKNOWN,"Server responded with status "+h.getStatus()))}else c(new x(C.UNAVAILABLE,"Connection failed."));break;default:U()}}finally{O(ge,`RPC '${e}' ${o} completed.`)}});const d=JSON.stringify(s);O(ge,`RPC '${e}' ${o} sending request:`,s),h.send(t,"POST",d,r,15)})}Bo(e,t,r){const s=Fs(),o=[this.Do,"/","google.firestore.v1.Firestore","/",e,"/channel"],a=vc(),c=_c(),h={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},d=this.longPollingOptions.timeoutSeconds;d!==void 0&&(h.longPollingTimeout=Math.round(1e3*d)),this.useFetchStreams&&(h.useFetchStreams=!0),this.Oo(h.initMessageHeaders,t,r),h.encodeInitMessageHeaders=!0;const m=o.join("");O(ge,`Creating RPC '${e}' stream ${s}: ${m}`,h);const _=a.createWebChannel(m,h);let w=!1,b=!1;const D=new pg({Io:S=>{b?O(ge,`Not sending because RPC '${e}' stream ${s} is closed:`,S):(w||(O(ge,`Opening RPC '${e}' stream ${s} transport.`),_.open(),w=!0),O(ge,`RPC '${e}' stream ${s} sending:`,S),_.send(S))},To:()=>_.close()}),k=(S,B,L)=>{S.listen(B,N=>{try{L(N)}catch(M){setTimeout(()=>{throw M},0)}})};return k(_,Tn.EventType.OPEN,()=>{b||(O(ge,`RPC '${e}' stream ${s} transport opened.`),D.yo())}),k(_,Tn.EventType.CLOSE,()=>{b||(b=!0,O(ge,`RPC '${e}' stream ${s} transport closed`),D.So())}),k(_,Tn.EventType.ERROR,S=>{b||(b=!0,zt(ge,`RPC '${e}' stream ${s} transport errored:`,S),D.So(new x(C.UNAVAILABLE,"The operation could not be completed")))}),k(_,Tn.EventType.MESSAGE,S=>{var B;if(!b){const L=S.data[0];Q(!!L);const N=L,M=N.error||((B=N[0])===null||B===void 0?void 0:B.error);if(M){O(ge,`RPC '${e}' stream ${s} received error:`,M);const X=M.status;let W=function(y){const E=re[y];if(E!==void 0)return qc(E)}(X),v=M.message;W===void 0&&(W=C.INTERNAL,v="Unknown error status: "+X+" with message "+M.message),b=!0,D.So(new x(W,v)),_.close()}else O(ge,`RPC '${e}' stream ${s} received:`,L),D.bo(L)}}),k(c,yc.STAT_EVENT,S=>{S.stat===Xs.PROXY?O(ge,`RPC '${e}' stream ${s} detected buffering proxy`):S.stat===Xs.NOPROXY&&O(ge,`RPC '${e}' stream ${s} detected no buffering proxy`)}),setTimeout(()=>{D.wo()},0),D}}function Bs(){return typeof document<"u"?document:null}/**
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
 */function Jr(n){return new Rp(n,!0)}/**
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
 */class tu{constructor(e,t,r=1e3,s=1.5,o=6e4){this.ui=e,this.timerId=t,this.ko=r,this.qo=s,this.Qo=o,this.Ko=0,this.$o=null,this.Uo=Date.now(),this.reset()}reset(){this.Ko=0}Wo(){this.Ko=this.Qo}Go(e){this.cancel();const t=Math.floor(this.Ko+this.zo()),r=Math.max(0,Date.now()-this.Uo),s=Math.max(0,t-r);s>0&&O("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.Ko} ms, delay with jitter: ${t} ms, last attempt: ${r} ms ago)`),this.$o=this.ui.enqueueAfterDelay(this.timerId,s,()=>(this.Uo=Date.now(),e())),this.Ko*=this.qo,this.Ko<this.ko&&(this.Ko=this.ko),this.Ko>this.Qo&&(this.Ko=this.Qo)}jo(){this.$o!==null&&(this.$o.skipDelay(),this.$o=null)}cancel(){this.$o!==null&&(this.$o.cancel(),this.$o=null)}zo(){return(Math.random()-.5)*this.Ko}}/**
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
 */class nu{constructor(e,t,r,s,o,a,c,h){this.ui=e,this.Ho=r,this.Jo=s,this.connection=o,this.authCredentialsProvider=a,this.appCheckCredentialsProvider=c,this.listener=h,this.state=0,this.Yo=0,this.Zo=null,this.Xo=null,this.stream=null,this.e_=0,this.t_=new tu(e,t)}n_(){return this.state===1||this.state===5||this.r_()}r_(){return this.state===2||this.state===3}start(){this.e_=0,this.state!==4?this.auth():this.i_()}async stop(){this.n_()&&await this.close(0)}s_(){this.state=0,this.t_.reset()}o_(){this.r_()&&this.Zo===null&&(this.Zo=this.ui.enqueueAfterDelay(this.Ho,6e4,()=>this.__()))}a_(e){this.u_(),this.stream.send(e)}async __(){if(this.r_())return this.close(0)}u_(){this.Zo&&(this.Zo.cancel(),this.Zo=null)}c_(){this.Xo&&(this.Xo.cancel(),this.Xo=null)}async close(e,t){this.u_(),this.c_(),this.t_.cancel(),this.Yo++,e!==4?this.t_.reset():t&&t.code===C.RESOURCE_EXHAUSTED?(We(t.toString()),We("Using maximum backoff delay to prevent overloading the backend."),this.t_.Wo()):t&&t.code===C.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.l_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.mo(t)}l_(){}auth(){this.state=1;const e=this.h_(this.Yo),t=this.Yo;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([r,s])=>{this.Yo===t&&this.P_(r,s)},r=>{e(()=>{const s=new x(C.UNKNOWN,"Fetching auth token failed: "+r.message);return this.I_(s)})})}P_(e,t){const r=this.h_(this.Yo);this.stream=this.T_(e,t),this.stream.Eo(()=>{r(()=>this.listener.Eo())}),this.stream.Ro(()=>{r(()=>(this.state=2,this.Xo=this.ui.enqueueAfterDelay(this.Jo,1e4,()=>(this.r_()&&(this.state=3),Promise.resolve())),this.listener.Ro()))}),this.stream.mo(s=>{r(()=>this.I_(s))}),this.stream.onMessage(s=>{r(()=>++this.e_==1?this.E_(s):this.onNext(s))})}i_(){this.state=5,this.t_.Go(async()=>{this.state=0,this.start()})}I_(e){return O("PersistentStream",`close with error: ${e}`),this.stream=null,this.close(4,e)}h_(e){return t=>{this.ui.enqueueAndForget(()=>this.Yo===e?t():(O("PersistentStream","stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class yg extends nu{constructor(e,t,r,s,o,a){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,r,s,a),this.serializer=o}T_(e,t){return this.connection.Bo("Listen",e,t)}E_(e){return this.onNext(e)}onNext(e){this.t_.reset();const t=Cp(this.serializer,e),r=function(o){if(!("targetChange"in o))return $.min();const a=o.targetChange;return a.targetIds&&a.targetIds.length?$.min():a.readTime?Me(a.readTime):$.min()}(e);return this.listener.d_(t,r)}A_(e){const t={};t.database=oi(this.serializer),t.addTarget=function(o,a){let c;const h=a.target;if(c=ti(h)?{documents:kp(o,h)}:{query:Np(o,h)._t},c.targetId=a.targetId,a.resumeToken.approximateByteSize()>0){c.resumeToken=Gc(o,a.resumeToken);const d=ri(o,a.expectedCount);d!==null&&(c.expectedCount=d)}else if(a.snapshotVersion.compareTo($.min())>0){c.readTime=Nr(o,a.snapshotVersion.toTimestamp());const d=ri(o,a.expectedCount);d!==null&&(c.expectedCount=d)}return c}(this.serializer,e);const r=xp(this.serializer,e);r&&(t.labels=r),this.a_(t)}R_(e){const t={};t.database=oi(this.serializer),t.removeTarget=e,this.a_(t)}}class _g extends nu{constructor(e,t,r,s,o,a){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,r,s,a),this.serializer=o}get V_(){return this.e_>0}start(){this.lastStreamToken=void 0,super.start()}l_(){this.V_&&this.m_([])}T_(e,t){return this.connection.Bo("Write",e,t)}E_(e){return Q(!!e.streamToken),this.lastStreamToken=e.streamToken,Q(!e.writeResults||e.writeResults.length===0),this.listener.f_()}onNext(e){Q(!!e.streamToken),this.lastStreamToken=e.streamToken,this.t_.reset();const t=Vp(e.writeResults,e.commitTime),r=Me(e.commitTime);return this.listener.g_(r,t)}p_(){const e={};e.database=oi(this.serializer),this.a_(e)}m_(e){const t={streamToken:this.lastStreamToken,writes:e.map(r=>Dp(this.serializer,r))};this.a_(t)}}/**
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
 */class vg extends class{}{constructor(e,t,r,s){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=r,this.serializer=s,this.y_=!1}w_(){if(this.y_)throw new x(C.FAILED_PRECONDITION,"The client has already been terminated.")}Mo(e,t,r,s){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([o,a])=>this.connection.Mo(e,si(t,r),s,o,a)).catch(o=>{throw o.name==="FirebaseError"?(o.code===C.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new x(C.UNKNOWN,o.toString())})}Lo(e,t,r,s,o){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([a,c])=>this.connection.Lo(e,si(t,r),s,a,c,o)).catch(a=>{throw a.name==="FirebaseError"?(a.code===C.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),a):new x(C.UNKNOWN,a.toString())})}terminate(){this.y_=!0,this.connection.terminate()}}class Eg{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.S_=0,this.b_=null,this.D_=!0}v_(){this.S_===0&&(this.C_("Unknown"),this.b_=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.b_=null,this.F_("Backend didn't respond within 10 seconds."),this.C_("Offline"),Promise.resolve())))}M_(e){this.state==="Online"?this.C_("Unknown"):(this.S_++,this.S_>=1&&(this.x_(),this.F_(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.C_("Offline")))}set(e){this.x_(),this.S_=0,e==="Online"&&(this.D_=!1),this.C_(e)}C_(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}F_(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.D_?(We(t),this.D_=!1):O("OnlineStateTracker",t)}x_(){this.b_!==null&&(this.b_.cancel(),this.b_=null)}}/**
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
 */class Ig{constructor(e,t,r,s,o){this.localStore=e,this.datastore=t,this.asyncQueue=r,this.remoteSyncer={},this.O_=[],this.N_=new Map,this.L_=new Set,this.B_=[],this.k_=o,this.k_._o(a=>{r.enqueueAndForget(async()=>{Ot(this)&&(O("RemoteStore","Restarting streams for network reachability change."),await async function(h){const d=j(h);d.L_.add(4),await zn(d),d.q_.set("Unknown"),d.L_.delete(4),await Zr(d)}(this))})}),this.q_=new Eg(r,s)}}async function Zr(n){if(Ot(n))for(const e of n.B_)await e(!0)}async function zn(n){for(const e of n.B_)await e(!1)}function ru(n,e){const t=j(n);t.N_.has(e.targetId)||(t.N_.set(e.targetId,e),$i(t)?Ui(t):tn(t).r_()&&Bi(t,e))}function Fi(n,e){const t=j(n),r=tn(t);t.N_.delete(e),r.r_()&&su(t,e),t.N_.size===0&&(r.r_()?r.o_():Ot(t)&&t.q_.set("Unknown"))}function Bi(n,e){if(n.Q_.xe(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo($.min())>0){const t=n.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(t)}tn(n).A_(e)}function su(n,e){n.Q_.xe(e),tn(n).R_(e)}function Ui(n){n.Q_=new Tp({getRemoteKeysForTarget:e=>n.remoteSyncer.getRemoteKeysForTarget(e),ot:e=>n.N_.get(e)||null,tt:()=>n.datastore.serializer.databaseId}),tn(n).start(),n.q_.v_()}function $i(n){return Ot(n)&&!tn(n).n_()&&n.N_.size>0}function Ot(n){return j(n).L_.size===0}function iu(n){n.Q_=void 0}async function Tg(n){n.q_.set("Online")}async function wg(n){n.N_.forEach((e,t)=>{Bi(n,e)})}async function Ag(n,e){iu(n),$i(n)?(n.q_.M_(e),Ui(n)):n.q_.set("Unknown")}async function bg(n,e,t){if(n.q_.set("Online"),e instanceof Hc&&e.state===2&&e.cause)try{await async function(s,o){const a=o.cause;for(const c of o.targetIds)s.N_.has(c)&&(await s.remoteSyncer.rejectListen(c,a),s.N_.delete(c),s.Q_.removeTarget(c))}(n,e)}catch(r){O("RemoteStore","Failed to remove targets %s: %s ",e.targetIds.join(","),r),await Or(n,r)}else if(e instanceof Ir?n.Q_.Ke(e):e instanceof zc?n.Q_.He(e):n.Q_.We(e),!t.isEqual($.min()))try{const r=await eu(n.localStore);t.compareTo(r)>=0&&await function(o,a){const c=o.Q_.rt(a);return c.targetChanges.forEach((h,d)=>{if(h.resumeToken.approximateByteSize()>0){const m=o.N_.get(d);m&&o.N_.set(d,m.withResumeToken(h.resumeToken,a))}}),c.targetMismatches.forEach((h,d)=>{const m=o.N_.get(h);if(!m)return;o.N_.set(h,m.withResumeToken(he.EMPTY_BYTE_STRING,m.snapshotVersion)),su(o,h);const _=new tt(m.target,h,d,m.sequenceNumber);Bi(o,_)}),o.remoteSyncer.applyRemoteEvent(c)}(n,t)}catch(r){O("RemoteStore","Failed to raise snapshot:",r),await Or(n,r)}}async function Or(n,e,t){if(!$n(e))throw e;n.L_.add(1),await zn(n),n.q_.set("Offline"),t||(t=()=>eu(n.localStore)),n.asyncQueue.enqueueRetryable(async()=>{O("RemoteStore","Retrying IndexedDB access"),await t(),n.L_.delete(1),await Zr(n)})}function ou(n,e){return e().catch(t=>Or(n,t,e))}async function es(n){const e=j(n),t=ct(e);let r=e.O_.length>0?e.O_[e.O_.length-1].batchId:-1;for(;Rg(e);)try{const s=await cg(e.localStore,r);if(s===null){e.O_.length===0&&t.o_();break}r=s.batchId,Pg(e,s)}catch(s){await Or(e,s)}au(e)&&lu(e)}function Rg(n){return Ot(n)&&n.O_.length<10}function Pg(n,e){n.O_.push(e);const t=ct(n);t.r_()&&t.V_&&t.m_(e.mutations)}function au(n){return Ot(n)&&!ct(n).n_()&&n.O_.length>0}function lu(n){ct(n).start()}async function Sg(n){ct(n).p_()}async function Cg(n){const e=ct(n);for(const t of n.O_)e.m_(t.mutations)}async function Dg(n,e,t){const r=n.O_.shift(),s=ki.from(r,e,t);await ou(n,()=>n.remoteSyncer.applySuccessfulWrite(s)),await es(n)}async function Vg(n,e){e&&ct(n).V_&&await async function(r,s){if(function(a){return vp(a)&&a!==C.ABORTED}(s.code)){const o=r.O_.shift();ct(r).s_(),await ou(r,()=>r.remoteSyncer.rejectFailedWrite(o.batchId,s)),await es(r)}}(n,e),au(n)&&lu(n)}async function Za(n,e){const t=j(n);t.asyncQueue.verifyOperationInProgress(),O("RemoteStore","RemoteStore received new credentials");const r=Ot(t);t.L_.add(3),await zn(t),r&&t.q_.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.L_.delete(3),await Zr(t)}async function kg(n,e){const t=j(n);e?(t.L_.delete(2),await Zr(t)):e||(t.L_.add(2),await zn(t),t.q_.set("Unknown"))}function tn(n){return n.K_||(n.K_=function(t,r,s){const o=j(t);return o.w_(),new yg(r,o.connection,o.authCredentials,o.appCheckCredentials,o.serializer,s)}(n.datastore,n.asyncQueue,{Eo:Tg.bind(null,n),Ro:wg.bind(null,n),mo:Ag.bind(null,n),d_:bg.bind(null,n)}),n.B_.push(async e=>{e?(n.K_.s_(),$i(n)?Ui(n):n.q_.set("Unknown")):(await n.K_.stop(),iu(n))})),n.K_}function ct(n){return n.U_||(n.U_=function(t,r,s){const o=j(t);return o.w_(),new _g(r,o.connection,o.authCredentials,o.appCheckCredentials,o.serializer,s)}(n.datastore,n.asyncQueue,{Eo:()=>Promise.resolve(),Ro:Sg.bind(null,n),mo:Vg.bind(null,n),f_:Cg.bind(null,n),g_:Dg.bind(null,n)}),n.B_.push(async e=>{e?(n.U_.s_(),await es(n)):(await n.U_.stop(),n.O_.length>0&&(O("RemoteStore",`Stopping write stream with ${n.O_.length} pending writes`),n.O_=[]))})),n.U_}/**
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
 */class ji{constructor(e,t,r,s,o){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=r,this.op=s,this.removalCallback=o,this.deferred=new it,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(a=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,t,r,s,o){const a=Date.now()+r,c=new ji(e,t,a,s,o);return c.start(r),c}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new x(C.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function qi(n,e){if(We("AsyncQueue",`${e}: ${n}`),$n(n))return new x(C.UNAVAILABLE,`${e}: ${n}`);throw n}/**
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
 */class jt{constructor(e){this.comparator=e?(t,r)=>e(t,r)||F.comparator(t.key,r.key):(t,r)=>F.comparator(t.key,r.key),this.keyedMap=wn(),this.sortedSet=new ee(this.comparator)}static emptySet(e){return new jt(e.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((t,r)=>(e(t),!1))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof jt)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),r=e.sortedSet.getIterator();for(;t.hasNext();){const s=t.getNext().key,o=r.getNext().key;if(!s.isEqual(o))return!1}return!0}toString(){const e=[];return this.forEach(t=>{e.push(t.toString())}),e.length===0?"DocumentSet ()":`DocumentSet (
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
 */class el{constructor(){this.W_=new ee(F.comparator)}track(e){const t=e.doc.key,r=this.W_.get(t);r?e.type!==0&&r.type===3?this.W_=this.W_.insert(t,e):e.type===3&&r.type!==1?this.W_=this.W_.insert(t,{type:r.type,doc:e.doc}):e.type===2&&r.type===2?this.W_=this.W_.insert(t,{type:2,doc:e.doc}):e.type===2&&r.type===0?this.W_=this.W_.insert(t,{type:0,doc:e.doc}):e.type===1&&r.type===0?this.W_=this.W_.remove(t):e.type===1&&r.type===2?this.W_=this.W_.insert(t,{type:1,doc:r.doc}):e.type===0&&r.type===1?this.W_=this.W_.insert(t,{type:2,doc:e.doc}):U():this.W_=this.W_.insert(t,e)}G_(){const e=[];return this.W_.inorderTraversal((t,r)=>{e.push(r)}),e}}class Qt{constructor(e,t,r,s,o,a,c,h,d){this.query=e,this.docs=t,this.oldDocs=r,this.docChanges=s,this.mutatedKeys=o,this.fromCache=a,this.syncStateChanged=c,this.excludesMetadataChanges=h,this.hasCachedResults=d}static fromInitialDocuments(e,t,r,s,o){const a=[];return t.forEach(c=>{a.push({type:0,doc:c})}),new Qt(e,t,jt.emptySet(t),a,r,s,!0,!1,o)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&Kr(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,r=e.docChanges;if(t.length!==r.length)return!1;for(let s=0;s<t.length;s++)if(t[s].type!==r[s].type||!t[s].doc.isEqual(r[s].doc))return!1;return!0}}/**
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
 */class Ng{constructor(){this.z_=void 0,this.j_=[]}H_(){return this.j_.some(e=>e.J_())}}class Og{constructor(){this.queries=tl(),this.onlineState="Unknown",this.Y_=new Set}terminate(){(function(t,r){const s=j(t),o=s.queries;s.queries=tl(),o.forEach((a,c)=>{for(const h of c.j_)h.onError(r)})})(this,new x(C.ABORTED,"Firestore shutting down"))}}function tl(){return new en(n=>Vc(n),Kr)}async function cu(n,e){const t=j(n);let r=3;const s=e.query;let o=t.queries.get(s);o?!o.H_()&&e.J_()&&(r=2):(o=new Ng,r=e.J_()?0:1);try{switch(r){case 0:o.z_=await t.onListen(s,!0);break;case 1:o.z_=await t.onListen(s,!1);break;case 2:await t.onFirstRemoteStoreListen(s)}}catch(a){const c=qi(a,`Initialization of query '${Bt(e.query)}' failed`);return void e.onError(c)}t.queries.set(s,o),o.j_.push(e),e.Z_(t.onlineState),o.z_&&e.X_(o.z_)&&zi(t)}async function uu(n,e){const t=j(n),r=e.query;let s=3;const o=t.queries.get(r);if(o){const a=o.j_.indexOf(e);a>=0&&(o.j_.splice(a,1),o.j_.length===0?s=e.J_()?0:1:!o.H_()&&e.J_()&&(s=2))}switch(s){case 0:return t.queries.delete(r),t.onUnlisten(r,!0);case 1:return t.queries.delete(r),t.onUnlisten(r,!1);case 2:return t.onLastRemoteStoreUnlisten(r);default:return}}function xg(n,e){const t=j(n);let r=!1;for(const s of e){const o=s.query,a=t.queries.get(o);if(a){for(const c of a.j_)c.X_(s)&&(r=!0);a.z_=s}}r&&zi(t)}function Lg(n,e,t){const r=j(n),s=r.queries.get(e);if(s)for(const o of s.j_)o.onError(t);r.queries.delete(e)}function zi(n){n.Y_.forEach(e=>{e.next()})}var li,nl;(nl=li||(li={})).ea="default",nl.Cache="cache";class hu{constructor(e,t,r){this.query=e,this.ta=t,this.na=!1,this.ra=null,this.onlineState="Unknown",this.options=r||{}}X_(e){if(!this.options.includeMetadataChanges){const r=[];for(const s of e.docChanges)s.type!==3&&r.push(s);e=new Qt(e.query,e.docs,e.oldDocs,r,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.na?this.ia(e)&&(this.ta.next(e),t=!0):this.sa(e,this.onlineState)&&(this.oa(e),t=!0),this.ra=e,t}onError(e){this.ta.error(e)}Z_(e){this.onlineState=e;let t=!1;return this.ra&&!this.na&&this.sa(this.ra,e)&&(this.oa(this.ra),t=!0),t}sa(e,t){if(!e.fromCache||!this.J_())return!0;const r=t!=="Offline";return(!this.options._a||!r)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}ia(e){if(e.docChanges.length>0)return!0;const t=this.ra&&this.ra.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}oa(e){e=Qt.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.na=!0,this.ta.next(e)}J_(){return this.options.source!==li.Cache}}/**
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
 */class du{constructor(e){this.key=e}}class fu{constructor(e){this.key=e}}class Mg{constructor(e,t){this.query=e,this.Ta=t,this.Ea=null,this.hasCachedResults=!1,this.current=!1,this.da=q(),this.mutatedKeys=q(),this.Aa=kc(e),this.Ra=new jt(this.Aa)}get Va(){return this.Ta}ma(e,t){const r=t?t.fa:new el,s=t?t.Ra:this.Ra;let o=t?t.mutatedKeys:this.mutatedKeys,a=s,c=!1;const h=this.query.limitType==="F"&&s.size===this.query.limit?s.last():null,d=this.query.limitType==="L"&&s.size===this.query.limit?s.first():null;if(e.inorderTraversal((m,_)=>{const w=s.get(m),b=Wr(this.query,_)?_:null,D=!!w&&this.mutatedKeys.has(w.key),k=!!b&&(b.hasLocalMutations||this.mutatedKeys.has(b.key)&&b.hasCommittedMutations);let S=!1;w&&b?w.data.isEqual(b.data)?D!==k&&(r.track({type:3,doc:b}),S=!0):this.ga(w,b)||(r.track({type:2,doc:b}),S=!0,(h&&this.Aa(b,h)>0||d&&this.Aa(b,d)<0)&&(c=!0)):!w&&b?(r.track({type:0,doc:b}),S=!0):w&&!b&&(r.track({type:1,doc:w}),S=!0,(h||d)&&(c=!0)),S&&(b?(a=a.add(b),o=k?o.add(m):o.delete(m)):(a=a.delete(m),o=o.delete(m)))}),this.query.limit!==null)for(;a.size>this.query.limit;){const m=this.query.limitType==="F"?a.last():a.first();a=a.delete(m.key),o=o.delete(m.key),r.track({type:1,doc:m})}return{Ra:a,fa:r,ns:c,mutatedKeys:o}}ga(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,r,s){const o=this.Ra;this.Ra=e.Ra,this.mutatedKeys=e.mutatedKeys;const a=e.fa.G_();a.sort((m,_)=>function(b,D){const k=S=>{switch(S){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return U()}};return k(b)-k(D)}(m.type,_.type)||this.Aa(m.doc,_.doc)),this.pa(r),s=s!=null&&s;const c=t&&!s?this.ya():[],h=this.da.size===0&&this.current&&!s?1:0,d=h!==this.Ea;return this.Ea=h,a.length!==0||d?{snapshot:new Qt(this.query,e.Ra,o,a,e.mutatedKeys,h===0,d,!1,!!r&&r.resumeToken.approximateByteSize()>0),wa:c}:{wa:c}}Z_(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({Ra:this.Ra,fa:new el,mutatedKeys:this.mutatedKeys,ns:!1},!1)):{wa:[]}}Sa(e){return!this.Ta.has(e)&&!!this.Ra.has(e)&&!this.Ra.get(e).hasLocalMutations}pa(e){e&&(e.addedDocuments.forEach(t=>this.Ta=this.Ta.add(t)),e.modifiedDocuments.forEach(t=>{}),e.removedDocuments.forEach(t=>this.Ta=this.Ta.delete(t)),this.current=e.current)}ya(){if(!this.current)return[];const e=this.da;this.da=q(),this.Ra.forEach(r=>{this.Sa(r.key)&&(this.da=this.da.add(r.key))});const t=[];return e.forEach(r=>{this.da.has(r)||t.push(new fu(r))}),this.da.forEach(r=>{e.has(r)||t.push(new du(r))}),t}ba(e){this.Ta=e.Ts,this.da=q();const t=this.ma(e.documents);return this.applyChanges(t,!0)}Da(){return Qt.fromInitialDocuments(this.query,this.Ra,this.mutatedKeys,this.Ea===0,this.hasCachedResults)}}class Fg{constructor(e,t,r){this.query=e,this.targetId=t,this.view=r}}class Bg{constructor(e){this.key=e,this.va=!1}}class Ug{constructor(e,t,r,s,o,a){this.localStore=e,this.remoteStore=t,this.eventManager=r,this.sharedClientState=s,this.currentUser=o,this.maxConcurrentLimboResolutions=a,this.Ca={},this.Fa=new en(c=>Vc(c),Kr),this.Ma=new Map,this.xa=new Set,this.Oa=new ee(F.comparator),this.Na=new Map,this.La=new xi,this.Ba={},this.ka=new Map,this.qa=Wt.kn(),this.onlineState="Unknown",this.Qa=void 0}get isPrimaryClient(){return this.Qa===!0}}async function $g(n,e,t=!0){const r=vu(n);let s;const o=r.Fa.get(e);return o?(r.sharedClientState.addLocalQueryTarget(o.targetId),s=o.view.Da()):s=await mu(r,e,t,!0),s}async function jg(n,e){const t=vu(n);await mu(t,e,!0,!1)}async function mu(n,e,t,r){const s=await ug(n.localStore,Le(e)),o=s.targetId,a=n.sharedClientState.addLocalQueryTarget(o,t);let c;return r&&(c=await qg(n,e,o,a==="current",s.resumeToken)),n.isPrimaryClient&&t&&ru(n.remoteStore,s),c}async function qg(n,e,t,r,s){n.Ka=(_,w,b)=>async function(k,S,B,L){let N=S.view.ma(B);N.ns&&(N=await Ya(k.localStore,S.query,!1).then(({documents:v})=>S.view.ma(v,N)));const M=L&&L.targetChanges.get(S.targetId),X=L&&L.targetMismatches.get(S.targetId)!=null,W=S.view.applyChanges(N,k.isPrimaryClient,M,X);return sl(k,S.targetId,W.wa),W.snapshot}(n,_,w,b);const o=await Ya(n.localStore,e,!0),a=new Mg(e,o.Ts),c=a.ma(o.documents),h=qn.createSynthesizedTargetChangeForCurrentChange(t,r&&n.onlineState!=="Offline",s),d=a.applyChanges(c,n.isPrimaryClient,h);sl(n,t,d.wa);const m=new Fg(e,t,a);return n.Fa.set(e,m),n.Ma.has(t)?n.Ma.get(t).push(e):n.Ma.set(t,[e]),d.snapshot}async function zg(n,e,t){const r=j(n),s=r.Fa.get(e),o=r.Ma.get(s.targetId);if(o.length>1)return r.Ma.set(s.targetId,o.filter(a=>!Kr(a,e))),void r.Fa.delete(e);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(s.targetId),r.sharedClientState.isActiveQueryTarget(s.targetId)||await ai(r.localStore,s.targetId,!1).then(()=>{r.sharedClientState.clearQueryState(s.targetId),t&&Fi(r.remoteStore,s.targetId),ci(r,s.targetId)}).catch(Un)):(ci(r,s.targetId),await ai(r.localStore,s.targetId,!0))}async function Hg(n,e){const t=j(n),r=t.Fa.get(e),s=t.Ma.get(r.targetId);t.isPrimaryClient&&s.length===1&&(t.sharedClientState.removeLocalQueryTarget(r.targetId),Fi(t.remoteStore,r.targetId))}async function Gg(n,e,t){const r=Zg(n);try{const s=await function(a,c){const h=j(a),d=ie.now(),m=c.reduce((b,D)=>b.add(D.key),q());let _,w;return h.persistence.runTransaction("Locally write mutations","readwrite",b=>{let D=Qe(),k=q();return h.cs.getEntries(b,m).next(S=>{D=S,D.forEach((B,L)=>{L.isValidDocument()||(k=k.add(B))})}).next(()=>h.localDocuments.getOverlayedDocuments(b,D)).next(S=>{_=S;const B=[];for(const L of c){const N=mp(L,_.get(L.key).overlayedDocument);N!=null&&B.push(new ht(L.key,N,Ac(N.value.mapValue),De.exists(!0)))}return h.mutationQueue.addMutationBatch(b,d,B,c)}).next(S=>{w=S;const B=S.applyToLocalDocumentSet(_,k);return h.documentOverlayCache.saveOverlays(b,S.batchId,B)})}).then(()=>({batchId:w.batchId,changes:Oc(_)}))}(r.localStore,e);r.sharedClientState.addPendingMutation(s.batchId),function(a,c,h){let d=a.Ba[a.currentUser.toKey()];d||(d=new ee(K)),d=d.insert(c,h),a.Ba[a.currentUser.toKey()]=d}(r,s.batchId,t),await Hn(r,s.changes),await es(r.remoteStore)}catch(s){const o=qi(s,"Failed to persist write");t.reject(o)}}async function pu(n,e){const t=j(n);try{const r=await ag(t.localStore,e);e.targetChanges.forEach((s,o)=>{const a=t.Na.get(o);a&&(Q(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1),s.addedDocuments.size>0?a.va=!0:s.modifiedDocuments.size>0?Q(a.va):s.removedDocuments.size>0&&(Q(a.va),a.va=!1))}),await Hn(t,r,e)}catch(r){await Un(r)}}function rl(n,e,t){const r=j(n);if(r.isPrimaryClient&&t===0||!r.isPrimaryClient&&t===1){const s=[];r.Fa.forEach((o,a)=>{const c=a.view.Z_(e);c.snapshot&&s.push(c.snapshot)}),function(a,c){const h=j(a);h.onlineState=c;let d=!1;h.queries.forEach((m,_)=>{for(const w of _.j_)w.Z_(c)&&(d=!0)}),d&&zi(h)}(r.eventManager,e),s.length&&r.Ca.d_(s),r.onlineState=e,r.isPrimaryClient&&r.sharedClientState.setOnlineState(e)}}async function Kg(n,e,t){const r=j(n);r.sharedClientState.updateQueryState(e,"rejected",t);const s=r.Na.get(e),o=s&&s.key;if(o){let a=new ee(F.comparator);a=a.insert(o,_e.newNoDocument(o,$.min()));const c=q().add(o),h=new Xr($.min(),new Map,new ee(K),a,c);await pu(r,h),r.Oa=r.Oa.remove(o),r.Na.delete(e),Hi(r)}else await ai(r.localStore,e,!1).then(()=>ci(r,e,t)).catch(Un)}async function Wg(n,e){const t=j(n),r=e.batch.batchId;try{const s=await og(t.localStore,e);yu(t,r,null),gu(t,r),t.sharedClientState.updateMutationState(r,"acknowledged"),await Hn(t,s)}catch(s){await Un(s)}}async function Qg(n,e,t){const r=j(n);try{const s=await function(a,c){const h=j(a);return h.persistence.runTransaction("Reject batch","readwrite-primary",d=>{let m;return h.mutationQueue.lookupMutationBatch(d,c).next(_=>(Q(_!==null),m=_.keys(),h.mutationQueue.removeMutationBatch(d,_))).next(()=>h.mutationQueue.performConsistencyCheck(d)).next(()=>h.documentOverlayCache.removeOverlaysForBatchId(d,m,c)).next(()=>h.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(d,m)).next(()=>h.localDocuments.getDocuments(d,m))})}(r.localStore,e);yu(r,e,t),gu(r,e),r.sharedClientState.updateMutationState(e,"rejected",t),await Hn(r,s)}catch(s){await Un(s)}}function gu(n,e){(n.ka.get(e)||[]).forEach(t=>{t.resolve()}),n.ka.delete(e)}function yu(n,e,t){const r=j(n);let s=r.Ba[r.currentUser.toKey()];if(s){const o=s.get(e);o&&(t?o.reject(t):o.resolve(),s=s.remove(e)),r.Ba[r.currentUser.toKey()]=s}}function ci(n,e,t=null){n.sharedClientState.removeLocalQueryTarget(e);for(const r of n.Ma.get(e))n.Fa.delete(r),t&&n.Ca.$a(r,t);n.Ma.delete(e),n.isPrimaryClient&&n.La.gr(e).forEach(r=>{n.La.containsKey(r)||_u(n,r)})}function _u(n,e){n.xa.delete(e.path.canonicalString());const t=n.Oa.get(e);t!==null&&(Fi(n.remoteStore,t),n.Oa=n.Oa.remove(e),n.Na.delete(t),Hi(n))}function sl(n,e,t){for(const r of t)r instanceof du?(n.La.addReference(r.key,e),Yg(n,r)):r instanceof fu?(O("SyncEngine","Document no longer in limbo: "+r.key),n.La.removeReference(r.key,e),n.La.containsKey(r.key)||_u(n,r.key)):U()}function Yg(n,e){const t=e.key,r=t.path.canonicalString();n.Oa.get(t)||n.xa.has(r)||(O("SyncEngine","New document in limbo: "+t),n.xa.add(r),Hi(n))}function Hi(n){for(;n.xa.size>0&&n.Oa.size<n.maxConcurrentLimboResolutions;){const e=n.xa.values().next().value;n.xa.delete(e);const t=new F(Z.fromString(e)),r=n.qa.next();n.Na.set(r,new Bg(t)),n.Oa=n.Oa.insert(t,r),ru(n.remoteStore,new tt(Le(Ci(t.path)),r,"TargetPurposeLimboResolution",wi.oe))}}async function Hn(n,e,t){const r=j(n),s=[],o=[],a=[];r.Fa.isEmpty()||(r.Fa.forEach((c,h)=>{a.push(r.Ka(h,e,t).then(d=>{var m;if((d||t)&&r.isPrimaryClient){const _=d?!d.fromCache:(m=t==null?void 0:t.targetChanges.get(h.targetId))===null||m===void 0?void 0:m.current;r.sharedClientState.updateQueryState(h.targetId,_?"current":"not-current")}if(d){s.push(d);const _=Mi.Wi(h.targetId,d);o.push(_)}}))}),await Promise.all(a),r.Ca.d_(s),await async function(h,d){const m=j(h);try{await m.persistence.runTransaction("notifyLocalViewChanges","readwrite",_=>P.forEach(d,w=>P.forEach(w.$i,b=>m.persistence.referenceDelegate.addReference(_,w.targetId,b)).next(()=>P.forEach(w.Ui,b=>m.persistence.referenceDelegate.removeReference(_,w.targetId,b)))))}catch(_){if(!$n(_))throw _;O("LocalStore","Failed to update sequence numbers: "+_)}for(const _ of d){const w=_.targetId;if(!_.fromCache){const b=m.os.get(w),D=b.snapshotVersion,k=b.withLastLimboFreeSnapshotVersion(D);m.os=m.os.insert(w,k)}}}(r.localStore,o))}async function Xg(n,e){const t=j(n);if(!t.currentUser.isEqual(e)){O("SyncEngine","User change. New user:",e.toKey());const r=await Zc(t.localStore,e);t.currentUser=e,function(o,a){o.ka.forEach(c=>{c.forEach(h=>{h.reject(new x(C.CANCELLED,a))})}),o.ka.clear()}(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,r.removedBatchIds,r.addedBatchIds),await Hn(t,r.hs)}}function Jg(n,e){const t=j(n),r=t.Na.get(e);if(r&&r.va)return q().add(r.key);{let s=q();const o=t.Ma.get(e);if(!o)return s;for(const a of o){const c=t.Fa.get(a);s=s.unionWith(c.view.Va)}return s}}function vu(n){const e=j(n);return e.remoteStore.remoteSyncer.applyRemoteEvent=pu.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=Jg.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=Kg.bind(null,e),e.Ca.d_=xg.bind(null,e.eventManager),e.Ca.$a=Lg.bind(null,e.eventManager),e}function Zg(n){const e=j(n);return e.remoteStore.remoteSyncer.applySuccessfulWrite=Wg.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=Qg.bind(null,e),e}class xr{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=Jr(e.databaseInfo.databaseId),this.sharedClientState=this.Wa(e),this.persistence=this.Ga(e),await this.persistence.start(),this.localStore=this.za(e),this.gcScheduler=this.ja(e,this.localStore),this.indexBackfillerScheduler=this.Ha(e,this.localStore)}ja(e,t){return null}Ha(e,t){return null}za(e){return ig(this.persistence,new rg,e.initialUser,this.serializer)}Ga(e){return new eg(Li.Zr,this.serializer)}Wa(e){return new dg}async terminate(){var e,t;(e=this.gcScheduler)===null||e===void 0||e.stop(),(t=this.indexBackfillerScheduler)===null||t===void 0||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}xr.provider={build:()=>new xr};class ui{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>rl(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=Xg.bind(null,this.syncEngine),await kg(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new Og}()}createDatastore(e){const t=Jr(e.databaseInfo.databaseId),r=function(o){return new gg(o)}(e.databaseInfo);return function(o,a,c,h){return new vg(o,a,c,h)}(e.authCredentials,e.appCheckCredentials,r,t)}createRemoteStore(e){return function(r,s,o,a,c){return new Ig(r,s,o,a,c)}(this.localStore,this.datastore,e.asyncQueue,t=>rl(this.syncEngine,t,0),function(){return Ja.D()?new Ja:new fg}())}createSyncEngine(e,t){return function(s,o,a,c,h,d,m){const _=new Ug(s,o,a,c,h,d);return m&&(_.Qa=!0),_}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await async function(s){const o=j(s);O("RemoteStore","RemoteStore shutting down."),o.L_.add(5),await zn(o),o.k_.shutdown(),o.q_.set("Unknown")}(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(t=this.eventManager)===null||t===void 0||t.terminate()}}ui.provider={build:()=>new ui};/**
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
 */class Eu{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ya(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ya(this.observer.error,e):We("Uncaught Error in snapshot listener:",e.toString()))}Za(){this.muted=!0}Ya(e,t){setTimeout(()=>{this.muted||e(t)},0)}}/**
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
 */class ey{constructor(e,t,r,s,o){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=r,this.databaseInfo=s,this.user=ye.UNAUTHENTICATED,this.clientId=Ic.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=o,this.authCredentials.start(r,async a=>{O("FirestoreClient","Received user=",a.uid),await this.authCredentialListener(a),this.user=a}),this.appCheckCredentials.start(r,a=>(O("FirestoreClient","Received new app check token=",a),this.appCheckCredentialListener(a,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new it;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const r=qi(t,"Failed to shutdown persistence");e.reject(r)}}),e.promise}}async function Us(n,e){n.asyncQueue.verifyOperationInProgress(),O("FirestoreClient","Initializing OfflineComponentProvider");const t=n.configuration;await e.initialize(t);let r=t.initialUser;n.setCredentialChangeListener(async s=>{r.isEqual(s)||(await Zc(e.localStore,s),r=s)}),e.persistence.setDatabaseDeletedListener(()=>n.terminate()),n._offlineComponents=e}async function il(n,e){n.asyncQueue.verifyOperationInProgress();const t=await ty(n);O("FirestoreClient","Initializing OnlineComponentProvider"),await e.initialize(t,n.configuration),n.setCredentialChangeListener(r=>Za(e.remoteStore,r)),n.setAppCheckTokenChangeListener((r,s)=>Za(e.remoteStore,s)),n._onlineComponents=e}async function ty(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){O("FirestoreClient","Using user provided OfflineComponentProvider");try{await Us(n,n._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!function(s){return s.name==="FirebaseError"?s.code===C.FAILED_PRECONDITION||s.code===C.UNIMPLEMENTED:!(typeof DOMException<"u"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11}(t))throw t;zt("Error using user provided cache. Falling back to memory cache: "+t),await Us(n,new xr)}}else O("FirestoreClient","Using default OfflineComponentProvider"),await Us(n,new xr);return n._offlineComponents}async function Iu(n){return n._onlineComponents||(n._uninitializedComponentsProvider?(O("FirestoreClient","Using user provided OnlineComponentProvider"),await il(n,n._uninitializedComponentsProvider._online)):(O("FirestoreClient","Using default OnlineComponentProvider"),await il(n,new ui))),n._onlineComponents}function ny(n){return Iu(n).then(e=>e.syncEngine)}async function hi(n){const e=await Iu(n),t=e.eventManager;return t.onListen=$g.bind(null,e.syncEngine),t.onUnlisten=zg.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=jg.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=Hg.bind(null,e.syncEngine),t}function ry(n,e,t={}){const r=new it;return n.asyncQueue.enqueueAndForget(async()=>function(o,a,c,h,d){const m=new Eu({next:w=>{m.Za(),a.enqueueAndForget(()=>uu(o,_)),w.fromCache&&h.source==="server"?d.reject(new x(C.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):d.resolve(w)},error:w=>d.reject(w)}),_=new hu(c,m,{includeMetadataChanges:!0,_a:!0});return cu(o,_)}(await hi(n),n.asyncQueue,e,t,r)),r.promise}/**
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
 */function Tu(n){const e={};return n.timeoutSeconds!==void 0&&(e.timeoutSeconds=n.timeoutSeconds),e}/**
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
 */const ol=new Map;/**
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
 */function wu(n,e,t){if(!t)throw new x(C.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${e}.`)}function sy(n,e,t,r){if(e===!0&&r===!0)throw new x(C.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)}function al(n){if(!F.isDocumentKey(n))throw new x(C.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function ll(n){if(F.isDocumentKey(n))throw new x(C.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${n} has ${n.length}.`)}function Gi(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const e=function(r){return r.constructor?r.constructor.name:null}(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":U()}function Ve(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new x(C.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=Gi(n);throw new x(C.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return n}/**
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
 */class cl{constructor(e){var t,r;if(e.host===void 0){if(e.ssl!==void 0)throw new x(C.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=(t=e.ssl)===null||t===void 0||t;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new x(C.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}sy("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Tu((r=e.experimentalLongPollingOptions)!==null&&r!==void 0?r:{}),function(o){if(o.timeoutSeconds!==void 0){if(isNaN(o.timeoutSeconds))throw new x(C.INVALID_ARGUMENT,`invalid long polling timeout: ${o.timeoutSeconds} (must not be NaN)`);if(o.timeoutSeconds<5)throw new x(C.INVALID_ARGUMENT,`invalid long polling timeout: ${o.timeoutSeconds} (minimum allowed value is 5)`);if(o.timeoutSeconds>30)throw new x(C.INVALID_ARGUMENT,`invalid long polling timeout: ${o.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(r,s){return r.timeoutSeconds===s.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class ts{constructor(e,t,r,s){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=r,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new cl({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new x(C.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new x(C.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new cl(e),e.credentials!==void 0&&(this._authCredentials=function(r){if(!r)return new Tm;switch(r.type){case"firstParty":return new Rm(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new x(C.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(t){const r=ol.get(t);r&&(O("ComponentProvider","Removing Datastore"),ol.delete(t),r.terminate())}(this),Promise.resolve()}}function iy(n,e,t,r={}){var s;const o=(n=Ve(n,ts))._getSettings(),a=`${e}:${t}`;if(o.host!=="firestore.googleapis.com"&&o.host!==a&&zt("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),n._setSettings(Object.assign(Object.assign({},o),{host:a,ssl:!1})),r.mockUserToken){let c,h;if(typeof r.mockUserToken=="string")c=r.mockUserToken,h=ye.MOCK_USER;else{c=Ll(r.mockUserToken,(s=n._app)===null||s===void 0?void 0:s.options.projectId);const d=r.mockUserToken.sub||r.mockUserToken.user_id;if(!d)throw new x(C.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");h=new ye(d)}n._authCredentials=new wm(new Ec(c,h))}}/**
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
 */class Gn{constructor(e,t,r){this.converter=t,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new Gn(this.firestore,e,this._query)}}class Ae{constructor(e,t,r){this.converter=t,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new ot(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new Ae(this.firestore,e,this._key)}}class ot extends Gn{constructor(e,t,r){super(e,t,Ci(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new Ae(this.firestore,null,new F(e))}withConverter(e){return new ot(this.firestore,e,this._path)}}function nt(n,e,...t){if(n=ke(n),wu("collection","path",e),n instanceof ts){const r=Z.fromString(e,...t);return ll(r),new ot(n,null,r)}{if(!(n instanceof Ae||n instanceof ot))throw new x(C.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(Z.fromString(e,...t));return ll(r),new ot(n.firestore,null,r)}}function dt(n,e,...t){if(n=ke(n),arguments.length===1&&(e=Ic.newId()),wu("doc","path",e),n instanceof ts){const r=Z.fromString(e,...t);return al(r),new Ae(n,null,new F(r))}{if(!(n instanceof Ae||n instanceof ot))throw new x(C.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(Z.fromString(e,...t));return al(r),new Ae(n.firestore,n instanceof ot?n.converter:null,new F(r))}}/**
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
 */class ul{constructor(e=Promise.resolve()){this.Pu=[],this.Iu=!1,this.Tu=[],this.Eu=null,this.du=!1,this.Au=!1,this.Ru=[],this.t_=new tu(this,"async_queue_retry"),this.Vu=()=>{const r=Bs();r&&O("AsyncQueue","Visibility state changed to "+r.visibilityState),this.t_.jo()},this.mu=e;const t=Bs();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.Vu)}get isShuttingDown(){return this.Iu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.fu(),this.gu(e)}enterRestrictedMode(e){if(!this.Iu){this.Iu=!0,this.Au=e||!1;const t=Bs();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.Vu)}}enqueue(e){if(this.fu(),this.Iu)return new Promise(()=>{});const t=new it;return this.gu(()=>this.Iu&&this.Au?Promise.resolve():(e().then(t.resolve,t.reject),t.promise)).then(()=>t.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Pu.push(e),this.pu()))}async pu(){if(this.Pu.length!==0){try{await this.Pu[0](),this.Pu.shift(),this.t_.reset()}catch(e){if(!$n(e))throw e;O("AsyncQueue","Operation failed with retryable error: "+e)}this.Pu.length>0&&this.t_.Go(()=>this.pu())}}gu(e){const t=this.mu.then(()=>(this.du=!0,e().catch(r=>{this.Eu=r,this.du=!1;const s=function(a){let c=a.message||"";return a.stack&&(c=a.stack.includes(a.message)?a.stack:a.message+`
`+a.stack),c}(r);throw We("INTERNAL UNHANDLED ERROR: ",s),r}).then(r=>(this.du=!1,r))));return this.mu=t,t}enqueueAfterDelay(e,t,r){this.fu(),this.Ru.indexOf(e)>-1&&(t=0);const s=ji.createAndSchedule(this,e,t,r,o=>this.yu(o));return this.Tu.push(s),s}fu(){this.Eu&&U()}verifyOperationInProgress(){}async wu(){let e;do e=this.mu,await e;while(e!==this.mu)}Su(e){for(const t of this.Tu)if(t.timerId===e)return!0;return!1}bu(e){return this.wu().then(()=>{this.Tu.sort((t,r)=>t.targetTimeMs-r.targetTimeMs);for(const t of this.Tu)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.wu()})}Du(e){this.Ru.push(e)}yu(e){const t=this.Tu.indexOf(e);this.Tu.splice(t,1)}}function hl(n){return function(t,r){if(typeof t!="object"||t===null)return!1;const s=t;for(const o of r)if(o in s&&typeof s[o]=="function")return!0;return!1}(n,["next","error","complete"])}class ut extends ts{constructor(e,t,r,s){super(e,t,r,s),this.type="firestore",this._queue=new ul,this._persistenceKey=(s==null?void 0:s.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new ul(e),this._firestoreClient=void 0,await e}}}function oy(n,e){const t=typeof n=="object"?n:gi(),r=typeof n=="string"?n:"(default)",s=Jt(t,"firestore").getImmediate({identifier:r});if(!s._initialized){const o=Ol("firestore");o&&iy(s,...o)}return s}function Ki(n){if(n._terminated)throw new x(C.FAILED_PRECONDITION,"The client has already been terminated.");return n._firestoreClient||ay(n),n._firestoreClient}function ay(n){var e,t,r;const s=n._freezeSettings(),o=function(c,h,d,m){return new Bm(c,h,d,m.host,m.ssl,m.experimentalForceLongPolling,m.experimentalAutoDetectLongPolling,Tu(m.experimentalLongPollingOptions),m.useFetchStreams)}(n._databaseId,((e=n._app)===null||e===void 0?void 0:e.options.appId)||"",n._persistenceKey,s);n._componentsProvider||!((t=s.localCache)===null||t===void 0)&&t._offlineComponentProvider&&(!((r=s.localCache)===null||r===void 0)&&r._onlineComponentProvider)&&(n._componentsProvider={_offline:s.localCache._offlineComponentProvider,_online:s.localCache._onlineComponentProvider}),n._firestoreClient=new ey(n._authCredentials,n._appCheckCredentials,n._queue,o,n._componentsProvider&&function(c){const h=c==null?void 0:c._online.build();return{_offline:c==null?void 0:c._offline.build(h),_online:h}}(n._componentsProvider))}/**
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
 */class Yt{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Yt(he.fromBase64String(e))}catch(t){throw new x(C.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new Yt(he.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
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
 */class ns{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new x(C.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new ce(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
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
 */class Wi{constructor(e){this._methodName=e}}/**
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
 */class Qi{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new x(C.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new x(C.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return K(this._lat,e._lat)||K(this._long,e._long)}}/**
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
 */class Yi{constructor(e){this._values=(e||[]).map(t=>t)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(r,s){if(r.length!==s.length)return!1;for(let o=0;o<r.length;++o)if(r[o]!==s[o])return!1;return!0}(this._values,e._values)}}/**
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
 */const ly=/^__.*__$/;class cy{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return this.fieldMask!==null?new ht(e,this.data,this.fieldMask,t,this.fieldTransforms):new jn(e,this.data,t,this.fieldTransforms)}}class Au{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return new ht(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function bu(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw U()}}class Xi{constructor(e,t,r,s,o,a){this.settings=e,this.databaseId=t,this.serializer=r,this.ignoreUndefinedProperties=s,o===void 0&&this.vu(),this.fieldTransforms=o||[],this.fieldMask=a||[]}get path(){return this.settings.path}get Cu(){return this.settings.Cu}Fu(e){return new Xi(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Mu(e){var t;const r=(t=this.path)===null||t===void 0?void 0:t.child(e),s=this.Fu({path:r,xu:!1});return s.Ou(e),s}Nu(e){var t;const r=(t=this.path)===null||t===void 0?void 0:t.child(e),s=this.Fu({path:r,xu:!1});return s.vu(),s}Lu(e){return this.Fu({path:void 0,xu:!0})}Bu(e){return Lr(e,this.settings.methodName,this.settings.ku||!1,this.path,this.settings.qu)}contains(e){return this.fieldMask.find(t=>e.isPrefixOf(t))!==void 0||this.fieldTransforms.find(t=>e.isPrefixOf(t.field))!==void 0}vu(){if(this.path)for(let e=0;e<this.path.length;e++)this.Ou(this.path.get(e))}Ou(e){if(e.length===0)throw this.Bu("Document fields must not be empty");if(bu(this.Cu)&&ly.test(e))throw this.Bu('Document fields cannot begin and end with "__"')}}class uy{constructor(e,t,r){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=r||Jr(e)}Qu(e,t,r,s=!1){return new Xi({Cu:e,methodName:t,qu:r,path:ce.emptyPath(),xu:!1,ku:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Ji(n){const e=n._freezeSettings(),t=Jr(n._databaseId);return new uy(n._databaseId,!!e.ignoreUndefinedProperties,t)}function Ru(n,e,t,r,s,o={}){const a=n.Qu(o.merge||o.mergeFields?2:0,e,t,s);Zi("Data must be an object, but it was:",a,r);const c=Pu(r,a);let h,d;if(o.merge)h=new Re(a.fieldMask),d=a.fieldTransforms;else if(o.mergeFields){const m=[];for(const _ of o.mergeFields){const w=di(e,_,t);if(!a.contains(w))throw new x(C.INVALID_ARGUMENT,`Field '${w}' is specified in your field mask but missing from your input data.`);Cu(m,w)||m.push(w)}h=new Re(m),d=a.fieldTransforms.filter(_=>h.covers(_.field))}else h=null,d=a.fieldTransforms;return new cy(new Te(c),h,d)}class rs extends Wi{_toFieldTransform(e){if(e.Cu!==2)throw e.Cu===1?e.Bu(`${this._methodName}() can only appear at the top level of your update data`):e.Bu(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof rs}}function hy(n,e,t,r){const s=n.Qu(1,e,t);Zi("Data must be an object, but it was:",s,r);const o=[],a=Te.empty();Nt(r,(h,d)=>{const m=eo(e,h,t);d=ke(d);const _=s.Nu(m);if(d instanceof rs)o.push(m);else{const w=ss(d,_);w!=null&&(o.push(m),a.set(m,w))}});const c=new Re(o);return new Au(a,c,s.fieldTransforms)}function dy(n,e,t,r,s,o){const a=n.Qu(1,e,t),c=[di(e,r,t)],h=[s];if(o.length%2!=0)throw new x(C.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let w=0;w<o.length;w+=2)c.push(di(e,o[w])),h.push(o[w+1]);const d=[],m=Te.empty();for(let w=c.length-1;w>=0;--w)if(!Cu(d,c[w])){const b=c[w];let D=h[w];D=ke(D);const k=a.Nu(b);if(D instanceof rs)d.push(b);else{const S=ss(D,k);S!=null&&(d.push(b),m.set(b,S))}}const _=new Re(d);return new Au(m,_,a.fieldTransforms)}function ss(n,e){if(Su(n=ke(n)))return Zi("Unsupported field value:",e,n),Pu(n,e);if(n instanceof Wi)return function(r,s){if(!bu(s.Cu))throw s.Bu(`${r._methodName}() can only be used with update() and set()`);if(!s.path)throw s.Bu(`${r._methodName}() is not currently supported inside arrays`);const o=r._toFieldTransform(s);o&&s.fieldTransforms.push(o)}(n,e),null;if(n===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),n instanceof Array){if(e.settings.xu&&e.Cu!==4)throw e.Bu("Nested arrays are not supported");return function(r,s){const o=[];let a=0;for(const c of r){let h=ss(c,s.Lu(a));h==null&&(h={nullValue:"NULL_VALUE"}),o.push(h),a++}return{arrayValue:{values:o}}}(n,e)}return function(r,s){if((r=ke(r))===null)return{nullValue:"NULL_VALUE"};if(typeof r=="number")return lp(s.serializer,r);if(typeof r=="boolean")return{booleanValue:r};if(typeof r=="string")return{stringValue:r};if(r instanceof Date){const o=ie.fromDate(r);return{timestampValue:Nr(s.serializer,o)}}if(r instanceof ie){const o=new ie(r.seconds,1e3*Math.floor(r.nanoseconds/1e3));return{timestampValue:Nr(s.serializer,o)}}if(r instanceof Qi)return{geoPointValue:{latitude:r.latitude,longitude:r.longitude}};if(r instanceof Yt)return{bytesValue:Gc(s.serializer,r._byteString)};if(r instanceof Ae){const o=s.databaseId,a=r.firestore._databaseId;if(!a.isEqual(o))throw s.Bu(`Document reference is for database ${a.projectId}/${a.database} but should be for database ${o.projectId}/${o.database}`);return{referenceValue:Oi(r.firestore._databaseId||s.databaseId,r._key.path)}}if(r instanceof Yi)return function(a,c){return{mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{values:a.toArray().map(h=>{if(typeof h!="number")throw c.Bu("VectorValues must only contain numeric values.");return Di(c.serializer,h)})}}}}}}(r,s);throw s.Bu(`Unsupported field value: ${Gi(r)}`)}(n,e)}function Pu(n,e){const t={};return Tc(n)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):Nt(n,(r,s)=>{const o=ss(s,e.Mu(r));o!=null&&(t[r]=o)}),{mapValue:{fields:t}}}function Su(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof ie||n instanceof Qi||n instanceof Yt||n instanceof Ae||n instanceof Wi||n instanceof Yi)}function Zi(n,e,t){if(!Su(t)||!function(s){return typeof s=="object"&&s!==null&&(Object.getPrototypeOf(s)===Object.prototype||Object.getPrototypeOf(s)===null)}(t)){const r=Gi(t);throw r==="an object"?e.Bu(n+" a custom object"):e.Bu(n+" "+r)}}function di(n,e,t){if((e=ke(e))instanceof ns)return e._internalPath;if(typeof e=="string")return eo(n,e);throw Lr("Field path arguments must be of type string or ",n,!1,void 0,t)}const fy=new RegExp("[~\\*/\\[\\]]");function eo(n,e,t){if(e.search(fy)>=0)throw Lr(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,t);try{return new ns(...e.split("."))._internalPath}catch{throw Lr(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,t)}}function Lr(n,e,t,r,s){const o=r&&!r.isEmpty(),a=s!==void 0;let c=`Function ${e}() called with invalid data`;t&&(c+=" (via `toFirestore()`)"),c+=". ";let h="";return(o||a)&&(h+=" (found",o&&(h+=` in field ${r}`),a&&(h+=` in document ${s}`),h+=")"),new x(C.INVALID_ARGUMENT,c+n+h)}function Cu(n,e){return n.some(t=>t.isEqual(e))}/**
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
 */class Du{constructor(e,t,r,s,o){this._firestore=e,this._userDataWriter=t,this._key=r,this._document=s,this._converter=o}get id(){return this._key.path.lastSegment()}get ref(){return new Ae(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new my(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(Vu("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class my extends Du{data(){return super.data()}}function Vu(n,e){return typeof e=="string"?eo(n,e):e instanceof ns?e._internalPath:e._delegate._internalPath}/**
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
 */function ku(n){if(n.limitType==="L"&&n.explicitOrderBy.length===0)throw new x(C.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class py{convertValue(e,t="none"){switch(Dt(e)){case 0:return null;case 1:return e.booleanValue;case 2:return ne(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(Ct(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw U()}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const r={};return Nt(e,(s,o)=>{r[s]=this.convertValue(o,t)}),r}convertVectorValue(e){var t,r,s;const o=(s=(r=(t=e.fields)===null||t===void 0?void 0:t.value.arrayValue)===null||r===void 0?void 0:r.values)===null||s===void 0?void 0:s.map(a=>ne(a.doubleValue));return new Yi(o)}convertGeoPoint(e){return new Qi(ne(e.latitude),ne(e.longitude))}convertArray(e,t){return(e.values||[]).map(r=>this.convertValue(r,t))}convertServerTimestamp(e,t){switch(t){case"previous":const r=bi(e);return r==null?null:this.convertValue(r,t);case"estimate":return this.convertTimestamp(Nn(e));default:return null}}convertTimestamp(e){const t=lt(e);return new ie(t.seconds,t.nanos)}convertDocumentKey(e,t){const r=Z.fromString(e);Q(Jc(r));const s=new On(r.get(1),r.get(3)),o=new F(r.popFirst(5));return s.isEqual(t)||We(`Document ${o} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),o}}/**
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
 */function Nu(n,e,t){let r;return r=n?t&&(t.merge||t.mergeFields)?n.toFirestore(e,t):n.toFirestore(e):e,r}/**
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
 */class bn{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class Ou extends Du{constructor(e,t,r,s,o,a){super(e,t,r,s,a),this._firestore=e,this._firestoreImpl=e,this.metadata=o}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new Tr(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const r=this._document.data.field(Vu("DocumentSnapshot.get",e));if(r!==null)return this._userDataWriter.convertValue(r,t.serverTimestamps)}}}class Tr extends Ou{data(e={}){return super.data(e)}}class xu{constructor(e,t,r,s){this._firestore=e,this._userDataWriter=t,this._snapshot=s,this.metadata=new bn(s.hasPendingWrites,s.fromCache),this.query=r}get docs(){const e=[];return this.forEach(t=>e.push(t)),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach(r=>{e.call(t,new Tr(this._firestore,this._userDataWriter,r.key,r,new bn(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new x(C.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=function(s,o){if(s._snapshot.oldDocs.isEmpty()){let a=0;return s._snapshot.docChanges.map(c=>{const h=new Tr(s._firestore,s._userDataWriter,c.doc.key,c.doc,new bn(s._snapshot.mutatedKeys.has(c.doc.key),s._snapshot.fromCache),s.query.converter);return c.doc,{type:"added",doc:h,oldIndex:-1,newIndex:a++}})}{let a=s._snapshot.oldDocs;return s._snapshot.docChanges.filter(c=>o||c.type!==3).map(c=>{const h=new Tr(s._firestore,s._userDataWriter,c.doc.key,c.doc,new bn(s._snapshot.mutatedKeys.has(c.doc.key),s._snapshot.fromCache),s.query.converter);let d=-1,m=-1;return c.type!==0&&(d=a.indexOf(c.doc.key),a=a.delete(c.doc.key)),c.type!==1&&(a=a.add(c.doc),m=a.indexOf(c.doc.key)),{type:gy(c.type),doc:h,oldIndex:d,newIndex:m}})}}(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}}function gy(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return U()}}class to extends py{constructor(e){super(),this.firestore=e}convertBytes(e){return new Yt(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new Ae(this.firestore,null,t)}}function dl(n){n=Ve(n,Gn);const e=Ve(n.firestore,ut),t=Ki(e),r=new to(e);return ku(n._query),ry(t,n._query).then(s=>new xu(e,r,n,s))}function Lu(n,e,t){n=Ve(n,Ae);const r=Ve(n.firestore,ut),s=Nu(n.converter,e,t);return is(r,[Ru(Ji(r),"setDoc",n._key,s,n.converter!==null,t).toMutation(n._key,De.none())])}function no(n,e,t,...r){n=Ve(n,Ae);const s=Ve(n.firestore,ut),o=Ji(s);let a;return a=typeof(e=ke(e))=="string"||e instanceof ns?dy(o,"updateDoc",n._key,e,t,r):hy(o,"updateDoc",n._key,e),is(s,[a.toMutation(n._key,De.exists(!0))])}function yy(n){return is(Ve(n.firestore,ut),[new Vi(n._key,De.none())])}function Mr(n,e){const t=Ve(n.firestore,ut),r=dt(n),s=Nu(n.converter,e);return is(t,[Ru(Ji(n.firestore),"addDoc",r._key,s,n.converter!==null,{}).toMutation(r._key,De.exists(!1))]).then(()=>r)}function ro(n,...e){var t,r,s;n=ke(n);let o={includeMetadataChanges:!1,source:"default"},a=0;typeof e[a]!="object"||hl(e[a])||(o=e[a],a++);const c={includeMetadataChanges:o.includeMetadataChanges,source:o.source};if(hl(e[a])){const _=e[a];e[a]=(t=_.next)===null||t===void 0?void 0:t.bind(_),e[a+1]=(r=_.error)===null||r===void 0?void 0:r.bind(_),e[a+2]=(s=_.complete)===null||s===void 0?void 0:s.bind(_)}let h,d,m;if(n instanceof Ae)d=Ve(n.firestore,ut),m=Ci(n._key.path),h={next:_=>{e[a]&&e[a](_y(d,n,_))},error:e[a+1],complete:e[a+2]};else{const _=Ve(n,Gn);d=Ve(_.firestore,ut),m=_._query;const w=new to(d);h={next:b=>{e[a]&&e[a](new xu(d,w,_,b))},error:e[a+1],complete:e[a+2]},ku(n._query)}return function(w,b,D,k){const S=new Eu(k),B=new hu(b,S,D);return w.asyncQueue.enqueueAndForget(async()=>cu(await hi(w),B)),()=>{S.Za(),w.asyncQueue.enqueueAndForget(async()=>uu(await hi(w),B))}}(Ki(d),m,c,h)}function is(n,e){return function(r,s){const o=new it;return r.asyncQueue.enqueueAndForget(async()=>Gg(await ny(r),s,o)),o.promise}(Ki(n),e)}function _y(n,e,t){const r=t.docs.get(e._key),s=new to(n);return new Ou(n,s,e._key,r,new bn(t.hasPendingWrites,t.fromCache),e.converter)}(function(e,t=!0){(function(s){Zt=s})(jl),Ke(new Fe("firestore",(r,{instanceIdentifier:s,options:o})=>{const a=r.getProvider("app").getImmediate(),c=new ut(new Am(r.getProvider("auth-internal")),new Sm(r.getProvider("app-check-internal")),function(d,m){if(!Object.prototype.hasOwnProperty.apply(d.options,["projectId"]))throw new x(C.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new On(d.options.projectId,m)}(a,s),a);return o=Object.assign({useFetchStreams:t},o),c._setSettings(o),c},"PUBLIC").setMultipleInstances(!0)),Ce(Ca,"4.7.3",e),Ce(Ca,"4.7.3","esm2017")})();/**
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
 */const Mu="firebasestorage.googleapis.com",vy="storageBucket",Ey=2*60*1e3,Iy=10*60*1e3;/**
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
 */class je extends Ye{constructor(e,t,r=0){super($s(e),`Firebase Storage: ${t} (${$s(e)})`),this.status_=r,this.customData={serverResponse:null},this._baseMessage=this.message,Object.setPrototypeOf(this,je.prototype)}get status(){return this.status_}set status(e){this.status_=e}_codeEquals(e){return $s(e)===this.code}get serverResponse(){return this.customData.serverResponse}set serverResponse(e){this.customData.serverResponse=e,this.customData.serverResponse?this.message=`${this._baseMessage}
${this.customData.serverResponse}`:this.message=this._baseMessage}}var $e;(function(n){n.UNKNOWN="unknown",n.OBJECT_NOT_FOUND="object-not-found",n.BUCKET_NOT_FOUND="bucket-not-found",n.PROJECT_NOT_FOUND="project-not-found",n.QUOTA_EXCEEDED="quota-exceeded",n.UNAUTHENTICATED="unauthenticated",n.UNAUTHORIZED="unauthorized",n.UNAUTHORIZED_APP="unauthorized-app",n.RETRY_LIMIT_EXCEEDED="retry-limit-exceeded",n.INVALID_CHECKSUM="invalid-checksum",n.CANCELED="canceled",n.INVALID_EVENT_NAME="invalid-event-name",n.INVALID_URL="invalid-url",n.INVALID_DEFAULT_BUCKET="invalid-default-bucket",n.NO_DEFAULT_BUCKET="no-default-bucket",n.CANNOT_SLICE_BLOB="cannot-slice-blob",n.SERVER_FILE_WRONG_SIZE="server-file-wrong-size",n.NO_DOWNLOAD_URL="no-download-url",n.INVALID_ARGUMENT="invalid-argument",n.INVALID_ARGUMENT_COUNT="invalid-argument-count",n.APP_DELETED="app-deleted",n.INVALID_ROOT_OPERATION="invalid-root-operation",n.INVALID_FORMAT="invalid-format",n.INTERNAL_ERROR="internal-error",n.UNSUPPORTED_ENVIRONMENT="unsupported-environment"})($e||($e={}));function $s(n){return"storage/"+n}function Ty(){const n="An unknown error occurred, please check the error payload for server response.";return new je($e.UNKNOWN,n)}function wy(){return new je($e.RETRY_LIMIT_EXCEEDED,"Max retry time for operation exceeded, please try again.")}function Ay(){return new je($e.CANCELED,"User canceled the upload/download.")}function by(n){return new je($e.INVALID_URL,"Invalid URL '"+n+"'.")}function Ry(n){return new je($e.INVALID_DEFAULT_BUCKET,"Invalid default bucket '"+n+"'.")}function fl(n){return new je($e.INVALID_ARGUMENT,n)}function Fu(){return new je($e.APP_DELETED,"The Firebase app was deleted.")}function Py(n){return new je($e.INVALID_ROOT_OPERATION,"The operation '"+n+"' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').")}/**
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
 */class Oe{constructor(e,t){this.bucket=e,this.path_=t}get path(){return this.path_}get isRoot(){return this.path.length===0}fullServerUrl(){const e=encodeURIComponent;return"/b/"+e(this.bucket)+"/o/"+e(this.path)}bucketOnlyServerUrl(){return"/b/"+encodeURIComponent(this.bucket)+"/o"}static makeFromBucketSpec(e,t){let r;try{r=Oe.makeFromUrl(e,t)}catch{return new Oe(e,"")}if(r.path==="")return r;throw Ry(e)}static makeFromUrl(e,t){let r=null;const s="([A-Za-z0-9.\\-_]+)";function o(M){M.path.charAt(M.path.length-1)==="/"&&(M.path_=M.path_.slice(0,-1))}const a="(/(.*))?$",c=new RegExp("^gs://"+s+a,"i"),h={bucket:1,path:3};function d(M){M.path_=decodeURIComponent(M.path)}const m="v[A-Za-z0-9_]+",_=t.replace(/[.]/g,"\\."),w="(/([^?#]*).*)?$",b=new RegExp(`^https?://${_}/${m}/b/${s}/o${w}`,"i"),D={bucket:1,path:3},k=t===Mu?"(?:storage.googleapis.com|storage.cloud.google.com)":t,S="([^?#]*)",B=new RegExp(`^https?://${k}/${s}/${S}`,"i"),N=[{regex:c,indices:h,postModify:o},{regex:b,indices:D,postModify:d},{regex:B,indices:{bucket:1,path:2},postModify:d}];for(let M=0;M<N.length;M++){const X=N[M],W=X.regex.exec(e);if(W){const v=W[X.indices.bucket];let p=W[X.indices.path];p||(p=""),r=new Oe(v,p),X.postModify(r);break}}if(r==null)throw by(e);return r}}class Sy{constructor(e){this.promise_=Promise.reject(e)}getPromise(){return this.promise_}cancel(e=!1){}}/**
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
 */function Cy(n,e,t){let r=1,s=null,o=null,a=!1,c=0;function h(){return c===2}let d=!1;function m(...S){d||(d=!0,e.apply(null,S))}function _(S){s=setTimeout(()=>{s=null,n(b,h())},S)}function w(){o&&clearTimeout(o)}function b(S,...B){if(d){w();return}if(S){w(),m.call(null,S,...B);return}if(h()||a){w(),m.call(null,S,...B);return}r<64&&(r*=2);let N;c===1?(c=2,N=0):N=(r+Math.random())*1e3,_(N)}let D=!1;function k(S){D||(D=!0,w(),!d&&(s!==null?(S||(c=2),clearTimeout(s),_(0)):S||(c=1)))}return _(0),o=setTimeout(()=>{a=!0,k(!0)},t),k}function Dy(n){n(!1)}/**
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
 */function Vy(n){return n!==void 0}function ml(n,e,t,r){if(r<e)throw fl(`Invalid value for '${n}'. Expected ${e} or greater.`);if(r>t)throw fl(`Invalid value for '${n}'. Expected ${t} or less.`)}function ky(n){const e=encodeURIComponent;let t="?";for(const r in n)if(n.hasOwnProperty(r)){const s=e(r)+"="+e(n[r]);t=t+s+"&"}return t=t.slice(0,-1),t}var Fr;(function(n){n[n.NO_ERROR=0]="NO_ERROR",n[n.NETWORK_ERROR=1]="NETWORK_ERROR",n[n.ABORT=2]="ABORT"})(Fr||(Fr={}));/**
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
 */function Ny(n,e){const t=n>=500&&n<600,s=[408,429].indexOf(n)!==-1,o=e.indexOf(n)!==-1;return t||s||o}/**
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
 */class Oy{constructor(e,t,r,s,o,a,c,h,d,m,_,w=!0){this.url_=e,this.method_=t,this.headers_=r,this.body_=s,this.successCodes_=o,this.additionalRetryCodes_=a,this.callback_=c,this.errorCallback_=h,this.timeout_=d,this.progressCallback_=m,this.connectionFactory_=_,this.retry=w,this.pendingConnection_=null,this.backoffId_=null,this.canceled_=!1,this.appDelete_=!1,this.promise_=new Promise((b,D)=>{this.resolve_=b,this.reject_=D,this.start_()})}start_(){const e=(r,s)=>{if(s){r(!1,new yr(!1,null,!0));return}const o=this.connectionFactory_();this.pendingConnection_=o;const a=c=>{const h=c.loaded,d=c.lengthComputable?c.total:-1;this.progressCallback_!==null&&this.progressCallback_(h,d)};this.progressCallback_!==null&&o.addUploadProgressListener(a),o.send(this.url_,this.method_,this.body_,this.headers_).then(()=>{this.progressCallback_!==null&&o.removeUploadProgressListener(a),this.pendingConnection_=null;const c=o.getErrorCode()===Fr.NO_ERROR,h=o.getStatus();if(!c||Ny(h,this.additionalRetryCodes_)&&this.retry){const m=o.getErrorCode()===Fr.ABORT;r(!1,new yr(!1,null,m));return}const d=this.successCodes_.indexOf(h)!==-1;r(!0,new yr(d,o))})},t=(r,s)=>{const o=this.resolve_,a=this.reject_,c=s.connection;if(s.wasSuccessCode)try{const h=this.callback_(c,c.getResponse());Vy(h)?o(h):o()}catch(h){a(h)}else if(c!==null){const h=Ty();h.serverResponse=c.getErrorText(),this.errorCallback_?a(this.errorCallback_(c,h)):a(h)}else if(s.canceled){const h=this.appDelete_?Fu():Ay();a(h)}else{const h=wy();a(h)}};this.canceled_?t(!1,new yr(!1,null,!0)):this.backoffId_=Cy(e,t,this.timeout_)}getPromise(){return this.promise_}cancel(e){this.canceled_=!0,this.appDelete_=e||!1,this.backoffId_!==null&&Dy(this.backoffId_),this.pendingConnection_!==null&&this.pendingConnection_.abort()}}class yr{constructor(e,t,r){this.wasSuccessCode=e,this.connection=t,this.canceled=!!r}}function xy(n,e){e!==null&&e.length>0&&(n.Authorization="Firebase "+e)}function Ly(n,e){n["X-Firebase-Storage-Version"]="webjs/"+(e??"AppManager")}function My(n,e){e&&(n["X-Firebase-GMPID"]=e)}function Fy(n,e){e!==null&&(n["X-Firebase-AppCheck"]=e)}function By(n,e,t,r,s,o,a=!0){const c=ky(n.urlParams),h=n.url+c,d=Object.assign({},n.headers);return My(d,e),xy(d,t),Ly(d,o),Fy(d,r),new Oy(h,n.method,d,n.body,n.successCodes,n.additionalRetryCodes,n.handler,n.errorHandler,n.timeout,n.progressCallback,s,a)}/**
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
 */function Uy(n){if(n.length===0)return null;const e=n.lastIndexOf("/");return e===-1?"":n.slice(0,e)}function $y(n){const e=n.lastIndexOf("/",n.length-2);return e===-1?n:n.slice(e+1)}/**
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
 */class Br{constructor(e,t){this._service=e,t instanceof Oe?this._location=t:this._location=Oe.makeFromUrl(t,e.host)}toString(){return"gs://"+this._location.bucket+"/"+this._location.path}_newRef(e,t){return new Br(e,t)}get root(){const e=new Oe(this._location.bucket,"");return this._newRef(this._service,e)}get bucket(){return this._location.bucket}get fullPath(){return this._location.path}get name(){return $y(this._location.path)}get storage(){return this._service}get parent(){const e=Uy(this._location.path);if(e===null)return null;const t=new Oe(this._location.bucket,e);return new Br(this._service,t)}_throwIfRoot(e){if(this._location.path==="")throw Py(e)}}function pl(n,e){const t=e==null?void 0:e[vy];return t==null?null:Oe.makeFromBucketSpec(t,n)}function jy(n,e,t,r={}){n.host=`${e}:${t}`,n._protocol="http";const{mockUserToken:s}=r;s&&(n._overrideAuthToken=typeof s=="string"?s:Ll(s,n.app.options.projectId))}class qy{constructor(e,t,r,s,o){this.app=e,this._authProvider=t,this._appCheckProvider=r,this._url=s,this._firebaseVersion=o,this._bucket=null,this._host=Mu,this._protocol="https",this._appId=null,this._deleted=!1,this._maxOperationRetryTime=Ey,this._maxUploadRetryTime=Iy,this._requests=new Set,s!=null?this._bucket=Oe.makeFromBucketSpec(s,this._host):this._bucket=pl(this._host,this.app.options)}get host(){return this._host}set host(e){this._host=e,this._url!=null?this._bucket=Oe.makeFromBucketSpec(this._url,e):this._bucket=pl(e,this.app.options)}get maxUploadRetryTime(){return this._maxUploadRetryTime}set maxUploadRetryTime(e){ml("time",0,Number.POSITIVE_INFINITY,e),this._maxUploadRetryTime=e}get maxOperationRetryTime(){return this._maxOperationRetryTime}set maxOperationRetryTime(e){ml("time",0,Number.POSITIVE_INFINITY,e),this._maxOperationRetryTime=e}async _getAuthToken(){if(this._overrideAuthToken)return this._overrideAuthToken;const e=this._authProvider.getImmediate({optional:!0});if(e){const t=await e.getToken();if(t!==null)return t.accessToken}return null}async _getAppCheckToken(){const e=this._appCheckProvider.getImmediate({optional:!0});return e?(await e.getToken()).token:null}_delete(){return this._deleted||(this._deleted=!0,this._requests.forEach(e=>e.cancel()),this._requests.clear()),Promise.resolve()}_makeStorageReference(e){return new Br(this,e)}_makeRequest(e,t,r,s,o=!0){if(this._deleted)return new Sy(Fu());{const a=By(e,this._appId,r,s,t,this._firebaseVersion,o);return this._requests.add(a),a.getPromise().then(()=>this._requests.delete(a),()=>this._requests.delete(a)),a}}async makeRequestWithTokens(e,t){const[r,s]=await Promise.all([this._getAuthToken(),this._getAppCheckToken()]);return this._makeRequest(e,t,r,s).getPromise()}}const gl="@firebase/storage",yl="0.13.2";/**
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
 */const Bu="storage";function zy(n=gi(),e){n=ke(n);const r=Jt(n,Bu).getImmediate({identifier:e}),s=Ol("storage");return s&&Hy(r,...s),r}function Hy(n,e,t,r={}){jy(n,e,t,r)}function Gy(n,{instanceIdentifier:e}){const t=n.getProvider("app").getImmediate(),r=n.getProvider("auth-internal"),s=n.getProvider("app-check-internal");return new qy(t,r,s,e,jl)}function Ky(){Ke(new Fe(Bu,Gy,"PUBLIC").setMultipleInstances(!0)),Ce(gl,yl,""),Ce(gl,yl,"esm2017")}Ky();const Wy={apiKey:"AIzaSyCj__TCfYSF-1y4uR-UOId_aPWWwy4-W5A",authDomain:"hscaterhub.firebaseapp.com",projectId:"hscaterhub",storageBucket:"hscaterhub.firebasestorage.app",messagingSenderId:"191852835453",appId:"1:191852835453:web:6e8498beaecbb85f637714",measurementId:"G-HL5SHGHK2C"},so=ql(Wy);_m(so);const Ie=oy(so);zy(so);let xe=[],Vt=[];function Ur(n){return n?{"cater2.me":"Cater2.me",ezcater:"ezCater","uber eats":"Uber Eats",doordash:"DoorDash",clubfeast:"ClubFeast",direct:"Direct",forkable:"Forkable",fooda:"Fooda",foodja:"Foodja",hungry:"Hungry",zerocater:"Zerocater"}[n.toLowerCase().trim()]||n.trim():"Unknown"}const Qy=[{id:"#ORD-7023",platform:"Forkable",customerName:"Acme Corp",typeOfOrder:"Meal Manager",deliveryDate:"2026-04-08",deliveryTime:"11:30 AM",deliveryMethod:"Platform",pickUpTime:"11:00 AM",subtotal:350,total:385,netPayout:310.5,status:"Completed",items:[{name:"Gourmet Salmon Bowl",amount:15,notes:"No onions on 5 of them"},{name:"Vegan Wrap Assortment",amount:5,notes:"Gluten-free wraps"}],overallNotes:"Leave at front desk with receptionist."},{id:"#ORD-7024",platform:"Doordash",customerName:"TechFlow HQ",typeOfOrder:"Catering",deliveryDate:"2026-04-09",deliveryTime:"12:00 PM",deliveryMethod:"Third-Party",pickUpTime:"11:15 AM",subtotal:540,total:590.25,netPayout:460,status:"New",items:[{name:"Artisan Sandwich Platter",amount:3,notes:"Half turkey, half roast beef"},{name:"Caesar Salad (Large)",amount:2,notes:"Dressing on the side"}],overallNotes:"Please call upon arrival."},{id:"#ORD-7025",platform:"ezCater",customerName:"Stark Industries",typeOfOrder:"Catering",deliveryDate:"2026-04-10",deliveryTime:"01:00 PM",deliveryMethod:"HolyShred",pickUpTime:"",subtotal:1200,total:1350,netPayout:1050,status:"Finalized",items:[{name:"Corporate Breakfast Box",amount:50,notes:""}],overallNotes:"VIP client, ensure impeccable presentation."}],Yy=[{title:"Artisan Sandwich Platter",desc:"A premium artisan sandwich platter, beautifully arranged. Includes turkey, club, and vegan options.",platform:"ezCater",imgPath:"https://images.unsplash.com/photo-1550507992-eb63ffee0847?auto=format&fit=crop&w=600&q=80"},{title:"Gourmet Salmon Bowls",desc:"Fresh, vibrant colors, organic ingredients, beautifully plated salmon bowls with quinoa.",platform:"Forkable",imgPath:"https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80"},{title:"Corporate Breakfast Box",desc:"Assorted pastries, fresh fruit, and premium coffee setup for early morning meetings.",platform:"DoorDash",imgPath:"https://images.unsplash.com/photo-1495147466023-ac5c588e2e40?auto=format&fit=crop&w=600&q=80"},{title:"Vegan Wrap Assortment",desc:"Plant-based wraps with house-made hummus, roasted veggies, and tahini drizzle.",platform:"Uber Eats",imgPath:"https://images.unsplash.com/photo-1626804475297-41609ea0adb4?auto=format&fit=crop&w=600&q=80"}];let At=null;function Xy(){const n=document.getElementById("calendar");n&&(At=new FullCalendar.Calendar(n,{initialView:"dayGridMonth",headerToolbar:{left:"prev,next today",center:"title",right:"dayGridMonth,timeGridWeek"},events:xe.map(e=>({id:e.fbId,title:`${e.platform} - ${e.id}`,start:e.deliveryDate,extendedProps:{order:e}})),dayMaxEvents:!1,height:"auto",eventClick:function(e){Uu(e.event.extendedProps.order)}}),At.render())}document.querySelectorAll(".nav-item").forEach(n=>{n.addEventListener("click",()=>{document.querySelectorAll(".nav-item").forEach(t=>t.classList.remove("active")),document.querySelectorAll(".tab-content").forEach(t=>t.classList.remove("active")),n.classList.add("active");const e=n.getAttribute("data-tab")+"-tab";document.getElementById(e).classList.add("active"),e==="calendar-tab"&&setTimeout(()=>{At?At.updateSize():Xy()},50)})});var vl;(vl=document.getElementById("sidebar-toggle-btn"))==null||vl.addEventListener("click",()=>{const n=document.querySelector(".sidebar");n&&n.classList.toggle("collapsed")});function Fn(n){if(n.status==="Cancelled"||n.status==="Archived")return n.status;try{if(!n.deliveryDate)return n.status||"New";const e=new Date(new Date().toLocaleString("en-US",{timeZone:"America/Los_Angeles"})),[t,r,s]=n.deliveryDate.split("-"),o=new Date(parseInt(t),parseInt(r)-1,parseInt(s)),a=new Date(parseInt(t),parseInt(r)-1,parseInt(s)-1,17,0,0);let c=n.pickUpTime||n.deliveryTime||"";if(c){c=c.trim().toUpperCase();let h=12,d=0;const m=c.match(/(\d+):(\d+)\s*(AM|PM)?/);if(m){h=parseInt(m[1]),d=parseInt(m[2]);const _=m[3];_==="PM"&&h<12&&(h+=12),_==="AM"&&h===12&&(h=0)}o.setHours(h,d,0)}else o.setHours(12,0,0);return e>o?"Completed":e>=a?"Finalize":"New"}catch{return n.status||"New"}}function io(){const n=document.getElementById("dash-total-orders"),e=document.getElementById("dash-total-amount"),t=document.getElementById("dash-net-payout"),r=document.getElementById("dash-avg-payout"),s=document.getElementById("dash-popular-dishes"),o=document.getElementById("dash-platform-breakdown");if(!n)return;let a=0,c=0;const h=new Set,d={},m={},_=document.getElementById("dash-start-date").value,w=document.getElementById("dash-end-date").value,b=xe.filter(N=>!(N.status==="Cancelled"||N.status==="Archived"||!N.deliveryDate||_&&N.deliveryDate<_||w&&N.deliveryDate>w)),D=b.length;b.forEach(N=>{a+=parseFloat(N.total)||0,c+=parseFloat(N.netPayout)||0,N.deliveryDate&&h.add(N.deliveryDate);const M=Ur(N.platform)||"Unknown";m[M]||(m[M]={count:0,total:0,netPayout:0}),m[M].count+=1,m[M].total+=parseFloat(N.total)||0,m[M].netPayout+=parseFloat(N.netPayout)||0,N.items&&Array.isArray(N.items)&&N.items.forEach(X=>{const W=X.name||"Unknown Item",v=parseInt(X.amount)||1;d[W]=(d[W]||0)+v})});let k=h.size;if(_){const[N,M]=_.split("-");k=new Date(parseInt(N),parseInt(M),0).getDate()}const S=k>0?c/k:0;n.innerText=D,e.innerText="$"+a.toFixed(2),t.innerText="$"+c.toFixed(2),r.innerText="$"+S.toFixed(2);const B=Object.entries(d).sort((N,M)=>M[1]-N[1]).slice(0,10);s.innerHTML=B.map(([N,M],X)=>`
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; ${X<B.length-1?"border-bottom: 1px solid rgba(255,255,255,0.05);":""}">
      <span style="font-weight: 500;">${N}</span>
      <span style="background: rgba(110, 231, 183, 0.2); color: #6ee7b7; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem; font-weight: bold;">${M}x</span>
    </div>
  `).join("");const L=Object.entries(m).sort((N,M)=>M[1].netPayout-N[1].netPayout);o.innerHTML=L.map(([N,M],X)=>`
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; ${X<L.length-1?"border-bottom: 1px solid rgba(255,255,255,0.05);":""}">
      <span style="font-weight: 500; font-size: 0.95rem;">${N} <span style="color:#9ca3af; font-size:0.8rem; margin-left:8px;">(${M.count} orders)</span></span>
      <div style="text-align: right;">
        <div style="color: #6ee7b7; font-weight: bold;">$${M.netPayout.toFixed(2)} <span style="font-size:0.75rem; color:#9ca3af; font-weight: normal;">net</span></div>
        <div style="font-size: 0.75rem; color: #9ca3af;">$${M.total.toFixed(2)} total</div>
      </div>
    </div>
  `).join("")}var El;(El=document.getElementById("dash-start-date"))==null||El.addEventListener("change",io);var Il;(Il=document.getElementById("dash-end-date"))==null||Il.addEventListener("change",io);function Kn(){var a,c,h,d;const n=document.getElementById("orders-tbody");n.innerHTML="";const e=((a=document.getElementById("orders-platform-filter"))==null?void 0:a.value)||"all",t=((c=document.getElementById("orders-status-filter"))==null?void 0:c.value)||"all",r=((h=document.getElementById("orders-start-date"))==null?void 0:h.value)||"",s=((d=document.getElementById("orders-end-date"))==null?void 0:d.value)||"";xe.filter(m=>{let _=!0;e!=="all"&&(!m.platform||m.platform.toLowerCase()!==e.toLowerCase())&&(_=!1);const w=Fn(m);return t!=="all"&&w.toLowerCase()!==t.toLowerCase()&&(_=!1),r&&(!m.deliveryDate||m.deliveryDate<r)&&(_=!1),s&&(!m.deliveryDate||m.deliveryDate>s)&&(_=!1),_}).forEach(m=>{try{const _=Fn(m);let w="status-pending";_==="Completed"&&(w="status-completed"),_==="Finalize"&&(w="status-finalize"),_==="Cancelled"&&(w="status-cancelled");const b=document.createElement("tr"),D=m.items&&m.items.length>0?m.items.map(L=>`${L.amount}x ${L.name||"Item"}`).join(", "):"No Items recorded";let k="",S=m.deliveryMethod||"Platform";S.toLowerCase()==="platform"||S.toLowerCase()==="partner"?k=`Pick up: <span style="color: #6ee7b7; font-weight: 500;">${m.pickUpTime||m.deliveryTime||"TBD"}</span>`:k=`Deliver: <span style="color: #6ee7b7; font-weight: 500;">${m.deliveryTime||"TBD"}</span>`;let B="0.00";typeof m.netPayout=="number"?B=m.netPayout.toFixed(2):m.netPayout&&(B=parseFloat(m.netPayout).toFixed(2)||"0.00"),b.innerHTML=`
      <td><strong>${m.id}</strong></td>
      <td>${Ur(m.platform)}</td>
      <td>${m.customerName}</td>
      <td style="white-space: nowrap;">${m.deliveryDate}</td>
      <td>
        <div style="font-weight: 500; margin-bottom: 0.25rem;">${S}</div>
        <div style="font-size: 0.8rem; color: #9ca3af;">${k}</div>
      </td>
      <td style="max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 0.85rem; color: #9ca3af;">${D}</td>
      <td>$${B}</td>
      <td><span class="status-badge ${w}">${_}</span></td>
      <td>
        <div style="display: flex; gap: 0.5rem;">
          <button class="secondary-btn edit-order-btn" data-id="${m.fbId}" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">Edit</button>
          <button class="delete-order-btn" data-id="${m.fbId}" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid #ef4444; border-radius: 8px; cursor: pointer;">Delete</button>
        </div>
      </td>
    `,b.style.cursor="pointer",b.addEventListener("click",async L=>{const N=L.target.closest("button");if(N&&N.classList.contains("delete-order-btn"))L.stopPropagation(),confirm("Are you sure you want to delete this order?")&&await no(dt(Ie,"orders",m.fbId),{isDeleted:!0});else if(N&&N.classList.contains("edit-order-btn")){L.stopPropagation();const M=document.getElementById("add-order-form");M.dataset.editingId=m.fbId,document.getElementById("new-order-platform").value=m.platform||"Direct",document.getElementById("new-order-id").value=m.id||"",document.getElementById("new-order-type").value=m.typeOfOrder||"Catering",document.getElementById("new-order-customer").value=m.customerName||"",document.getElementById("new-order-date").value=m.deliveryDate||"",document.getElementById("new-order-time").value=m.deliveryTime||"",document.getElementById("new-order-method").value=m.deliveryMethod||"Platform",document.getElementById("new-order-pickup").value=m.pickUpTime||"",document.getElementById("new-order-subtotal").value=m.subtotal||0,document.getElementById("new-order-total").value=m.total||0,document.getElementById("new-order-payout").value=m.netPayout||0,document.getElementById("new-order-notes").value=m.overallNotes||"";const X=document.getElementById("new-order-items-container");X.innerHTML="",m.items&&m.items.length>0&&m.items.forEach(W=>{oo();const v=X.lastElementChild;v.querySelector(".item-name-select").value=W.name||"",v.querySelector(".item-amount").value=W.amount||1,v.querySelector(".item-notes-input").value=W.notes||""}),document.getElementById("add-order-modal").classList.add("active")}else Uu(m)}),n.appendChild(b)}catch(_){console.error(_)}})}function Uu(n){const e=document.getElementById("panel-content"),t=document.getElementById("order-modal-overlay"),r=document.getElementById("order-details-panel"),s=n.items.map(m=>`
    <div class="item-row">
      <span><strong>${m.amount}x</strong> ${m.name}</span>
      ${m.notes?`<div class="item-notes">Note: ${m.notes}</div>`:""}
    </div>
  `).join("");let o="",a="",c=n.deliveryMethod||"Platform";c.toLowerCase()==="platform"||c.toLowerCase()==="partner"?(o="Pick Up Time",a=n.pickUpTime||n.deliveryTime):(o="Delivery Time",a=n.deliveryTime);const h=Fn(n);let d="status-pending";h==="Completed"&&(d="status-completed"),h==="Finalize"&&(d="status-finalize"),h==="Cancelled"&&(d="status-cancelled"),e.innerHTML=`
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
  `,t.classList.add("active"),r.classList.add("active")}const $u=n=>{const e=parseInt(n)||0;return e===0?'<span style="color: rgba(255,255,255,0.1);">-</span>':"🌶️".repeat(e)};function Jy(n){const e=document.getElementById("panel-content"),t=document.getElementById("order-modal-overlay"),r=document.getElementById("order-details-panel"),s=n.dietary?Object.entries(n.dietary).filter(([c,h])=>h).map(([c,h])=>c.charAt(0).toUpperCase()+c.slice(1)).join(", "):"None",o=n.allergens&&n.allergens.length>0?n.allergens.join(", "):"None specified",a=n.platformOverrides?Object.entries(n.platformOverrides).filter(([c,h])=>h.price||h.note).map(([c,h])=>`
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
      <div class="info-group"><label>Spicy Level</label><p>${$u(n.spicyLevel)}</p></div>
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
  `,t.classList.add("active"),r.classList.add("active")}function ju(){document.getElementById("order-modal-overlay").classList.remove("active"),document.getElementById("order-details-panel").classList.remove("active")}document.getElementById("close-panel-btn").addEventListener("click",ju);document.getElementById("order-modal-overlay").addEventListener("click",ju);function qu(n="all"){const e=document.getElementById("menu-table-body");if(!e)return;e.innerHTML="",Vt.filter(r=>n==="all"?!0:r.category&&r.category.toLowerCase().replace(" ","")===n).forEach(r=>{const s=document.createElement("tr");s.dataset.id=r.fbId,s.style.cursor="pointer",s.classList.add("menu-row"),r.platformOverrides&&Object.keys(r.platformOverrides).filter(c=>r.platformOverrides[c].price||r.platformOverrides[c].note).join(", ");const o=[r.base,r.proteins].filter(Boolean).join(" + "),a=c=>r.dietary&&r.dietary[c]?'<span style="color: #10b981; font-weight: bold; font-size: 1.1rem;">&#10003;</span>':'<span style="color: rgba(255,255,255,0.1);">-</span>';s.innerHTML=`
      <td>${r.category||""}</td>
      <td style="font-weight: 600;">${r.title||""}</td>
      <td style="font-weight: bold; color: #6ee7b7;">$${r.standardPrice||"0.00"}</td>
      <td style="font-size: 0.85rem; white-space: normal;">${o}</td>
      <td>${r.weightG||""}</td>
      <td style="font-size: 1.1rem;">${$u(r.spicyLevel)}</td>
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
    `,e.appendChild(s)})}var Tl;(Tl=document.getElementById("save-new-menu-btn"))==null||Tl.addEventListener("click",async()=>{});let Tt={};const Zy=["ezCater","ClubFeast","Cater2.me","Email Source"];ro(dt(Ie,"system","crawlers"),n=>{n.exists()?Tt=n.data():Tt={},e_()});function e_(){const n=document.getElementById("crawlers-configs-container");if(!n)return;let e="";Zy.forEach(r=>{const s=Tt[r]||{status:"Unknown",cookie:""},a=s.status==="Expired"?"#f87171":s.status==="Active"?"#6ee7b7":"#9ca3af";e+=`
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
     `}),n.innerHTML=e;const t=document.getElementById("force-sync-btn");t&&(Tt.isSyncing?(t.innerText="Syncing Orders...",t.disabled=!0,t.style.opacity="0.7"):(t.innerText=Tt.lastGlobalSync?`Refresh Immediately (Last: ${Tt.lastGlobalSync})`:"Refresh Immediately",t.disabled=!1,t.style.opacity="1"))}var wl;(wl=document.getElementById("force-sync-btn"))==null||wl.addEventListener("click",async()=>{await Lu(dt(Ie,"system","crawlers"),{forceSync:!0},{merge:!0})});window.saveCrawlerConfig=async n=>{const e=document.getElementById(`crawler-cookie-${n.replace(/\s+/g,"-")}`).value,t={[n]:{...Tt[n]||{},cookie:e,status:e?"Active":"Missing",updatedAt:new Date().toLocaleTimeString()}};await Lu(dt(Ie,"system","crawlers"),t,{merge:!0}),alert(`${n} configuration updated successfully! The scraper will automatically ingest your new token on its next cycle.`)};document.getElementById("menu-table-body").addEventListener("click",async n=>{if(n.target.classList.contains("delete-menu-btn")){const e=n.target.getAttribute("data-id");confirm("Are you sure you want to delete this menu item?")&&await yy(dt(Ie,"menus",e))}else if(n.target.classList.contains("edit-menu-btn")){const e=n.target.getAttribute("data-id"),t=Vt.find(r=>r.fbId===e);t&&(document.getElementById("add-menu-form").reset(),typeof Se<"u"&&(Se=[],Xt()),zu(),document.getElementById("add-menu-form").dataset.editingId=e,document.getElementById("menu-category").value=t.category||"",document.getElementById("menu-name").value=t.title||"",document.getElementById("menu-desc").value=t.desc||"",document.getElementById("menu-price").value=t.standardPrice||"",document.getElementById("menu-ingredient").value=t.ingredient||"",document.getElementById("menu-toppings").value=t.toppings||"",document.getElementById("menu-sauce").value=t.sauce||"",document.getElementById("menu-base").value=t.base||"",document.getElementById("menu-proteins").value=t.proteins||"",document.getElementById("menu-serving").value=t.serving||"",document.getElementById("menu-weight-g").value=t.weightG||"",t.weightG&&document.getElementById("menu-weight-g").dispatchEvent(new Event("input")),document.getElementById("menu-spicy").value=t.spicyLevel||"0",t.allergens&&Array.isArray(t.allergens)&&(Se=[...t.allergens],Xt()),t.dietary&&(document.getElementById("diet-vegan").checked=!!t.dietary.vegan,document.getElementById("diet-vegetarian").checked=!!t.dietary.vegetarian,document.getElementById("diet-gf").checked=!!t.dietary.gf,document.getElementById("diet-soy").checked=!!t.dietary.soy,document.getElementById("diet-sesame").checked=!!t.dietary.sesame,document.getElementById("diet-nut").checked=!!t.dietary.nut,document.getElementById("diet-dairy").checked=!!t.dietary.dairy,document.getElementById("diet-egg").checked=!!t.dietary.egg,document.getElementById("diet-shellfish").checked=!!t.dietary.shellfish,document.getElementById("diet-seafood").checked=!!t.dietary.seafood),t.platformOverrides&&(document.querySelectorAll("#platform-details-container .platform-alias").forEach(r=>{const s=r.getAttribute("data-platform");t.platformOverrides[s]&&(r.value=t.platformOverrides[s].alias||"",r.value&&(r.dataset.dirty="true"))}),document.querySelectorAll("#platform-details-container .platform-note").forEach(r=>{const s=r.getAttribute("data-platform");t.platformOverrides[s]&&(r.value=t.platformOverrides[s].note||"")}),document.querySelectorAll("#platform-details-container .platform-price").forEach(r=>{const s=r.getAttribute("data-platform");t.platformOverrides[s]&&(r.value=t.platformOverrides[s].price||"",r.value&&(r.dataset.dirty="true"))})),bt.classList.add("active"))}else{const e=n.target.closest("tr");if(e){const t=e.getAttribute("data-id"),r=Vt.find(s=>s.fbId===t);r&&Jy(r)}}});document.getElementById("category-filter").addEventListener("change",n=>{qu(n.target.value)});var Al;(Al=document.getElementById("orders-platform-filter"))==null||Al.addEventListener("change",Kn);var bl;(bl=document.getElementById("orders-status-filter"))==null||bl.addEventListener("change",Kn);var Rl;(Rl=document.getElementById("orders-start-date"))==null||Rl.addEventListener("change",Kn);var Pl;(Pl=document.getElementById("orders-end-date"))==null||Pl.addEventListener("change",Kn);const js=document.getElementById("dash-start-date"),qs=document.getElementById("dash-end-date");if(js&&qs&&!js.value&&!qs.value){const n=new Intl.DateTimeFormat("en-US",{timeZone:"America/Los_Angeles",year:"numeric",month:"numeric",day:"numeric"}).format(new Date),[e,t,r]=n.split("/"),s=parseInt(r),o=parseInt(e),a=new Date(s,o,0),c=h=>h.toString().padStart(2,"0");js.value=`${s}-${c(o)}-01`,qs.value=`${s}-${c(o)}-${c(a.getDate())}`}ro(nt(Ie,"orders"),n=>{xe=n.docs.map(e=>({fbId:e.id,...e.data()})).filter(e=>!e.isDeleted),xe.sort((e,t)=>{let r=new Date(e.deliveryDate||0);return new Date(t.deliveryDate||0)-r}),Kn(),io(),typeof kt=="function"&&kt(),At&&(At.removeAllEvents(),At.addEventSource(xe.map(e=>({id:e.fbId,title:`${e.platform} - ${e.id}`,start:e.deliveryDate,extendedProps:{order:e}}))))});ro(nt(Ie,"menus"),n=>{Vt=n.docs.map(s=>({fbId:s.id,...s.data()}));const e=document.getElementById("category-filter");qu(e?e.value:"all"),typeof kt=="function"&&kt();let t=document.getElementById("menu-items-global-list");t||(t=document.createElement("datalist"),t.id="menu-items-global-list",document.body.appendChild(t));const r=[...new Set(Vt.map(s=>s.title).filter(Boolean))];t.innerHTML=r.map(s=>`<option value="${s}"></option>`).join("")});const qt=document.getElementById("add-order-modal"),t_=document.getElementById("add-order-btn"),n_=document.getElementById("close-add-order-btn"),r_=document.getElementById("add-item-row-btn"),$r=document.getElementById("new-order-items-container"),_t=document.getElementById("add-order-form");function oo(){const n=document.createElement("div");n.className="dynamic-item-row",n.innerHTML=`
    <input type="text" class="item-name-select" list="menu-items-global-list" placeholder="Select or type Menu Item..." required />
    <input type="number" class="item-amount" placeholder="Qty" min="1" required />
    <input type="text" class="item-notes-input" placeholder="Notes (optional)" />
    <button type="button" class="remove-item-btn" title="Remove">&times;</button>
  `,n.querySelector(".remove-item-btn").addEventListener("click",()=>{n.remove()}),$r.appendChild(n)}t_.addEventListener("click",()=>{_t.reset(),delete _t.dataset.editingId,$r.innerHTML="",qt.classList.add("active"),$r.children.length===0&&oo()});n_.addEventListener("click",()=>{qt.classList.remove("active")});qt.addEventListener("click",n=>{n.target===qt&&qt.classList.remove("active")});r_.addEventListener("click",oo);_t.addEventListener("submit",n=>{n.preventDefault();const e=[];document.querySelectorAll(".dynamic-item-row").forEach(r=>{e.push({name:r.querySelector(".item-name-select").value,amount:parseInt(r.querySelector(".item-amount").value,10),notes:r.querySelector(".item-notes-input").value})});const t={id:document.getElementById("new-order-id").value,platform:document.getElementById("new-order-platform").value,customerName:document.getElementById("new-order-customer").value,typeOfOrder:document.getElementById("new-order-type").value,deliveryDate:document.getElementById("new-order-date").value,deliveryTime:document.getElementById("new-order-time").value,deliveryMethod:document.getElementById("new-order-method").value,pickUpTime:document.getElementById("new-order-pickup").value,subtotal:parseFloat(document.getElementById("new-order-subtotal").value),total:parseFloat(document.getElementById("new-order-total").value),netPayout:parseFloat(document.getElementById("new-order-payout").value),status:"New",overallNotes:document.getElementById("new-order-notes").value,items:e};_t.dataset.editingId?(t.manualOverride=!0,no(dt(Ie,"orders",_t.dataset.editingId),t),delete _t.dataset.editingId):Mr(nt(Ie,"orders"),t),_t.reset(),$r.innerHTML="",qt.classList.remove("active")});const bt=document.getElementById("add-menu-modal"),s_=document.getElementById("add-menu-btn"),i_=document.getElementById("close-add-menu-btn"),vt=document.getElementById("add-menu-form"),Bn=document.getElementById("platform-details-container"),o_=document.getElementById("menu-weight-g"),a_=document.getElementById("menu-price"),l_=["Cater2.me","ClubFeast","Direct","DoorDash","ezCater","Fooda","Foodja","Forkable","Uber Eats","Zerocater"];function zu(){Bn.innerHTML="",l_.forEach(n=>{const e=document.createElement("div");e.style.display="grid",e.style.gridTemplateColumns="1fr 2fr 2fr 1fr",e.style.gap="0.5rem",e.style.alignItems="center",e.style.background="rgba(255, 255, 255, 0.02)",e.style.padding="0.75rem",e.style.borderRadius="8px",e.style.border="1px solid var(--glass-border)",e.innerHTML=`
      <strong style="color: var(--text-primary); font-size: 0.85rem;">${n}</strong>
      <input type="text" class="platform-alias" data-platform="${n}" placeholder="Alias Name..." style="width: 100%; background: var(--bg-primary); border: 1px solid var(--glass-border); padding: 0.5rem; border-radius: 8px; color: var(--text-primary); outline: none;" />
      <input type="text" class="platform-note" data-platform="${n}" placeholder="Special Note..." style="width: 100%; background: var(--bg-primary); border: 1px solid var(--glass-border); padding: 0.5rem; border-radius: 8px; color: var(--text-primary); outline: none;" />
      <input type="number" step="0.01" class="platform-price" data-platform="${n}" placeholder="Price ($)" style="width: 100%; background: var(--bg-primary); border: 1px solid var(--glass-border); padding: 0.5rem; border-radius: 8px; color: var(--text-primary); outline: none;" />
    `,Bn.appendChild(e)})}o_.addEventListener("input",n=>{const e=parseFloat(n.target.value);isNaN(e)?(document.getElementById("menu-weight-oz").value="",document.getElementById("menu-weight-lbs").value=""):(document.getElementById("menu-weight-oz").value=(e/28.3495).toFixed(2),document.getElementById("menu-weight-lbs").value=(e/453.592).toFixed(2))});a_.addEventListener("input",n=>{const e=n.target.value;document.querySelectorAll(".platform-price").forEach(t=>{t.dataset.dirty||(t.value=e)})});document.getElementById("menu-name").addEventListener("input",n=>{const e=n.target.value;document.querySelectorAll(".platform-alias").forEach(t=>{t.dataset.dirty||(t.value=e)})});Bn.addEventListener("input",n=>{(n.target.classList.contains("platform-price")||n.target.classList.contains("platform-alias"))&&(n.target.dataset.dirty="true")});s_.addEventListener("click",()=>{vt.reset(),delete vt.dataset.editingId,typeof Se<"u"&&(Se=[],Xt()),Bn.children.length===0&&zu(),bt.classList.add("active")});i_.addEventListener("click",()=>{bt.classList.remove("active")});bt.addEventListener("click",n=>{n.target===bt&&bt.classList.remove("active")});vt.addEventListener("submit",async n=>{n.preventDefault();const e=vt.querySelector('button[type="submit"]'),t=e.innerText;e.innerText="Saving...",e.disabled=!0;const r={};document.querySelectorAll("#platform-details-container .platform-alias").forEach(a=>{const c=a.getAttribute("data-platform");r[c]||(r[c]={}),r[c].alias=a.value.trim()}),document.querySelectorAll("#platform-details-container .platform-note").forEach(a=>{const c=a.getAttribute("data-platform");r[c]||(r[c]={}),r[c].note=a.value.trim()}),document.querySelectorAll("#platform-details-container .platform-price").forEach(a=>{const c=a.getAttribute("data-platform");r[c]||(r[c]={}),r[c].price=a.value});const s={title:document.getElementById("menu-name").value,desc:document.getElementById("menu-desc").value,category:document.getElementById("menu-category").value,standardPrice:document.getElementById("menu-price").value,ingredient:document.getElementById("menu-ingredient").value,toppings:document.getElementById("menu-toppings").value,sauce:document.getElementById("menu-sauce").value,base:document.getElementById("menu-base").value,proteins:document.getElementById("menu-proteins").value,serving:document.getElementById("menu-serving").value,weightG:document.getElementById("menu-weight-g").value,spicyLevel:document.getElementById("menu-spicy").value,allergens:Se,dietary:{vegan:document.getElementById("diet-vegan").checked,vegetarian:document.getElementById("diet-vegetarian").checked,gf:document.getElementById("diet-gf").checked,soy:document.getElementById("diet-soy").checked,sesame:document.getElementById("diet-sesame").checked,nut:document.getElementById("diet-nut").checked,dairy:document.getElementById("diet-dairy").checked,egg:document.getElementById("diet-egg").checked,shellfish:document.getElementById("diet-shellfish").checked,seafood:document.getElementById("diet-seafood").checked},platformOverrides:r},o=vt.dataset.editingId;o?(await no(dt(Ie,"menus",o),s),delete vt.dataset.editingId):(s.id=Date.now(),s.platform="Custom",await Mr(nt(Ie,"menus"),s)),e.innerText=t,e.disabled=!1,vt.reset(),Bn.innerHTML="",typeof Se<"u"&&(Se=[],Xt()),bt.classList.remove("active")});const In=document.getElementById("menu-allergens-input"),zs=document.getElementById("allergen-tags-wrapper"),c_=document.getElementById("menu-allergens");let Se=[];function Xt(){zs.innerHTML="",Se.forEach((n,e)=>{const t=document.createElement("span");t.className="tag-pill",t.innerHTML=`${n} <span class="remove-tag" data-index="${e}">&times;</span>`,zs.appendChild(t)}),c_.value=Se.join(","),zs.querySelectorAll(".remove-tag").forEach(n=>{n.addEventListener("click",e=>{const t=e.target.getAttribute("data-index");Se.splice(t,1),Xt()})})}In&&In.addEventListener("keydown",n=>{if(n.key==="Enter"||n.key===","){n.preventDefault();const e=In.value.trim().replace(/,/g,"");e&&!Se.includes(e)?(Se.push(e),In.value="",Xt()):e&&(In.value="")}});(async function(){try{(await dl(nt(Ie,"orders"))).empty&&(console.log("Seeding mock orders..."),Qy.forEach(r=>Mr(nt(Ie,"orders"),r))),(await dl(nt(Ie,"menus"))).empty&&(console.log("Seeding mock menus..."),Yy.forEach(r=>Mr(nt(Ie,"menus"),r)))}catch(e){console.error("Failed to seed database. Are Firestore Security Rules set to true? Error:",e)}})();const u_=new Intl.DateTimeFormat("en-CA",{timeZone:"America/Los_Angeles",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date);document.getElementById("prep-date-filter").value=u_;let ao="dish";var Sl;(Sl=document.getElementById("prep-view-dish"))==null||Sl.addEventListener("click",n=>{ao="dish",n.target.classList.add("active"),n.target.style.background="var(--primary-accent)",n.target.style.color="white";let e=document.getElementById("prep-view-comp");e.classList.remove("active"),e.style.background="transparent",e.style.color="var(--text-secondary)",document.getElementById("prep-dish-container").style.display="block",document.getElementById("prep-comp-container").style.display="none",kt()});var Cl;(Cl=document.getElementById("prep-view-comp"))==null||Cl.addEventListener("click",n=>{ao="comp",n.target.classList.add("active"),n.target.style.background="var(--primary-accent)",n.target.style.color="white";let e=document.getElementById("prep-view-dish");e.classList.remove("active"),e.style.background="transparent",e.style.color="var(--text-secondary)",document.getElementById("prep-dish-container").style.display="none",document.getElementById("prep-comp-container").style.display="block",kt()});var Dl;(Dl=document.getElementById("prep-date-filter"))==null||Dl.addEventListener("change",kt);function kt(){if(!xe||!Vt)return;const n=document.getElementById("prep-date-filter").value;if(!n)return;const e=xe.filter(r=>r.status==="Cancelled"||r.status==="Archived"||!r.deliveryDate?!1:r.deliveryDate.startsWith(n));let t={};if(e.forEach(r=>{r.items&&Array.isArray(r.items)&&r.items.forEach(s=>{let o=s.name?s.name.trim():"Unknown Dish",a=parseInt(s.quantity)||1;t[o]||(t[o]={qty:0,servings:0,menuRef:null}),t[o].qty+=a})}),Object.keys(t).forEach(r=>{let s=r.toLowerCase().replace(/[^a-z0-9]/g,""),o=Vt.find(a=>{if(a.title.toLowerCase().replace(/[^a-z0-9]/g,"")===s)return!0;if(a.overrides){for(let c of Object.keys(a.overrides))if(a.overrides[c]&&a.overrides[c].alias&&a.overrides[c].alias.toLowerCase().replace(/[^a-z0-9]/g,"")===s)return!0}return!1});if(o){t[r].menuRef=o;let a=parseInt(o.serving)||1;t[r].servings=t[r].qty*a}else t[r].servings=t[r].qty}),ao==="dish"){const r=document.getElementById("prep-dish-tbody");let s="";const o=Object.keys(t).sort((a,c)=>t[c].qty-t[a].qty);o.forEach(a=>{s+=`<tr>
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
            `}),r.innerHTML=o}}const _l=document.getElementById("sidebar-toggle-btn");_l&&_l.addEventListener("click",()=>{document.querySelector(".sidebar").classList.toggle("collapsed"),document.querySelector(".main-content").classList.toggle("expanded")});var Vl;(Vl=document.getElementById("export-orders-btn"))==null||Vl.addEventListener("click",()=>{var d,m,_,w;if(!xe||xe.length===0){alert("No orders to export.");return}const n=((d=document.getElementById("orders-platform-filter"))==null?void 0:d.value)||"all",e=((m=document.getElementById("orders-status-filter"))==null?void 0:m.value)||"all",t=((_=document.getElementById("orders-start-date"))==null?void 0:_.value)||"",r=((w=document.getElementById("orders-end-date"))==null?void 0:w.value)||"",s=xe.filter(b=>{let D=!0;if(n!=="all"){const S=Ur(b.platform);(!S||S.toLowerCase()!==n.toLowerCase())&&(D=!1)}const k=Fn(b);return e!=="all"&&k.toLowerCase()!==e.toLowerCase()&&(D=!1),t&&(!b.deliveryDate||b.deliveryDate<t)&&(D=!1),r&&(!b.deliveryDate||b.deliveryDate>r)&&(D=!1),D});if(s.length===0){alert("No orders match the current filters.");return}let o=`Order ID,Platform,Customer Name,Delivery Date,Delivery Method,Time,Subtotal,Total,Net Payout,Status,Notes
`;s.forEach(b=>{const D=Fn(b),k=Ur(b.platform);let S="",B=b.deliveryMethod||"Platform";B.toLowerCase()==="platform"||B.toLowerCase()==="partner"?S=b.pickUpTime||b.deliveryTime||"TBD":S=b.deliveryTime||"TBD";const L=v=>v==null?'""':`"${String(v).replace(/"/g,'""')}"`;let N=typeof b.subtotal=="number"?b.subtotal.toFixed(2):parseFloat(b.subtotal||0).toFixed(2),M=typeof b.total=="number"?b.total.toFixed(2):parseFloat(b.total||0).toFixed(2),X=typeof b.netPayout=="number"?b.netPayout.toFixed(2):parseFloat(b.netPayout||0).toFixed(2),W=[L(b.id),L(k),L(b.customerName),L(b.deliveryDate),L(B),L(S),L(N),L(M),L(X),L(D),L(b.overallNotes)];o+=W.join(",")+`
`});const a=new Blob([o],{type:"text/csv;charset=utf-8;"}),c=URL.createObjectURL(a),h=document.createElement("a");h.setAttribute("href",c),h.setAttribute("download",`HSCaterHub_Export_${new Date().toISOString().split("T")[0]}.csv`),document.body.appendChild(h),h.click(),document.body.removeChild(h)});
