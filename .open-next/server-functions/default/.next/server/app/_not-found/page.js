(()=>{var e={};e.id=492,e.ids=[492],e.modules={846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},9121:e=>{"use strict";e.exports=require("next/dist/server/app-render/action-async-storage.external.js")},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},9294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},3033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},3873:e=>{"use strict";e.exports=require("path")},7834:(e,r,t)=>{"use strict";t.r(r),t.d(r,{GlobalError:()=>o.a,__next_app__:()=>u,pages:()=>c,routeModule:()=>p,tree:()=>l});var n=t(260),s=t(8203),i=t(5155),o=t.n(i),a=t(7292),d={};for(let e in a)0>["default","tree","pages","GlobalError","__next_app__","routeModule"].indexOf(e)&&(d[e]=()=>a[e]);t.d(r,d);let l=["",{children:["/_not-found",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(t.t.bind(t,9937,23)),"next/dist/client/components/not-found-error"]}]},{}]},{layout:[()=>Promise.resolve().then(t.bind(t,9611)),"C:\\Users\\eyeha\\.gemini\\antigravity\\scratch\\ncaa-sim-v2\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(t.t.bind(t,9937,23)),"next/dist/client/components/not-found-error"],forbidden:[()=>Promise.resolve().then(t.t.bind(t,9116,23)),"next/dist/client/components/forbidden-error"],unauthorized:[()=>Promise.resolve().then(t.t.bind(t,1485,23)),"next/dist/client/components/unauthorized-error"]}],c=[],u={require:t,loadChunk:()=>Promise.resolve()},p=new n.AppPageRouteModule({definition:{kind:s.RouteKind.APP_PAGE,page:"/_not-found/page",pathname:"/_not-found",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:l}})},5187:()=>{},2139:()=>{},9997:(e,r,t)=>{Promise.resolve().then(t.t.bind(t,3219,23)),Promise.resolve().then(t.t.bind(t,4863,23)),Promise.resolve().then(t.t.bind(t,5155,23)),Promise.resolve().then(t.t.bind(t,802,23)),Promise.resolve().then(t.t.bind(t,9350,23)),Promise.resolve().then(t.t.bind(t,8530,23)),Promise.resolve().then(t.t.bind(t,8921,23))},317:(e,r,t)=>{Promise.resolve().then(t.t.bind(t,6959,23)),Promise.resolve().then(t.t.bind(t,3875,23)),Promise.resolve().then(t.t.bind(t,8903,23)),Promise.resolve().then(t.t.bind(t,7174,23)),Promise.resolve().then(t.t.bind(t,4178,23)),Promise.resolve().then(t.t.bind(t,7190,23)),Promise.resolve().then(t.t.bind(t,1365,23))},9611:(e,r,t)=>{"use strict";t.r(r),t.d(r,{default:()=>i,metadata:()=>s});var n=t(2740);t(6301),t(2704);let s={title:"JJ NCAASIM2026",description:"NCAA Basketball Simulation Engine"};function i({children:e}){return(0,n.jsxs)("html",{lang:"en",children:[(0,n.jsxs)("head",{children:[(0,n.jsx)("link",{href:"https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&family=Teko:wght@500;600;700&display=swap",rel:"stylesheet"}),(0,n.jsx)("style",{dangerouslySetInnerHTML:{__html:`
          body {
            background-color: #050505;
            color: #f1f5f9;
            overflow-x: hidden;
            font-family: 'Inter', sans-serif;
            background-image: radial-gradient(circle at 50% -20%, #171717 0%, #000000 70%);
            background-attachment: fixed;
          }
          .scanline {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100px;
            z-index: 10;
            background: linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(255, 255, 255, 0.02) 50%, rgba(0,0,0,0) 100%);
            opacity: 0.1;
            background-size: 100% 4px;
            animation: scanline 10s linear infinite;
            pointer-events: none;
          }
          @keyframes scanline {
            0% { top: -100px; }
            100% { top: 100%; }
          }
          ::-webkit-scrollbar {
            width: 6px;
          }
          ::-webkit-scrollbar-track {
            background: #0f172a; 
          }
          ::-webkit-scrollbar-thumb {
            background: #334155; 
          }
          ::-webkit-scrollbar-thumb:hover {
            background: #475569; 
          }
        `}})]}),(0,n.jsxs)("body",{children:[(0,n.jsx)("div",{id:"root",children:e}),(0,n.jsx)("div",{className:"scanline"})]})]})}},2704:()=>{}};var r=require("../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),n=r.X(0,[638,403],()=>t(7834));module.exports=n})();