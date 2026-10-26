const assert = require('assert');
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const config = JSON.parse(fs.readFileSync(path.join(root,'project.config.json'), 'utf8'));
assert.strictEqual(config.appid, 'touristappid', 'Public project must not include real AppID');
assert(!fs.existsSync(path.join(root,'cloudfunctions')), 'No cloud functions allowed in V2.1.7');
const appJs = fs.readFileSync(path.join(root,'miniprogram/app.js'),'utf8');
assert(!appJs.includes('wx.cloud'), 'This version must stay local only');
const keys = ['maa_v2_tasks','maa_v2_personal_events','maa_v2_custom_exams','maa_v2_reschedules','maa_v2_settings'];
const data = {};
keys.forEach((k)=>{data[k]=[{id:'sample-only'}]});
let captured;
global.Page=(x)=>{captured=x};
global.wx={
 getStorageSync:(k)=>data[k]||undefined,
 setStorageSync:(k,v)=>{data[k]=v},
 removeStorageSync:(k)=>{delete data[k]},
 showModal:({success})=>{success({confirm:true})},
 showToast:()=>{}
};
require('../miniprogram/pages/settings/settings.js');
assert(typeof captured.clearAllLocal==='function');
captured.setData=()=>{};
captured.clearAllLocal();
keys.forEach((k)=>assert(!Object.prototype.hasOwnProperty.call(data,k),`${k} not cleared`));
const share = require('../miniprogram/utils/share.js');
assert(!JSON.stringify(share.appMessage()).includes('sample-only'));
assert(share.appMessage().path.startsWith('/pages/today/today'));
console.log('PASS: local data wipe + public AppID + no cloud + safe share');
