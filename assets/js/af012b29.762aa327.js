"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[131],{3905:(e,t,o)=>{o.d(t,{Zo:()=>u,kt:()=>f});var r=o(7294);function n(e,t,o){return t in e?Object.defineProperty(e,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[t]=o,e}function a(e,t){var o=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),o.push.apply(o,r)}return o}function c(e){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?a(Object(o),!0).forEach((function(t){n(e,t,o[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(o)):a(Object(o)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(o,t))}))}return e}function i(e,t){if(null==e)return{};var o,r,n=function(e,t){if(null==e)return{};var o,r,n={},a=Object.keys(e);for(r=0;r<a.length;r++)o=a[r],t.indexOf(o)>=0||(n[o]=e[o]);return n}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)o=a[r],t.indexOf(o)>=0||Object.prototype.propertyIsEnumerable.call(e,o)&&(n[o]=e[o])}return n}var s=r.createContext({}),l=function(e){var t=r.useContext(s),o=t;return e&&(o="function"==typeof e?e(t):c(c({},t),e)),o},u=function(e){var t=l(e.components);return r.createElement(s.Provider,{value:t},e.children)},p="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},g=r.forwardRef((function(e,t){var o=e.components,n=e.mdxType,a=e.originalType,s=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),p=l(o),g=n,f=p["".concat(s,".").concat(g)]||p[g]||d[g]||a;return o?r.createElement(f,c(c({ref:t},u),{},{components:o})):r.createElement(f,c({ref:t},u))}));function f(e,t){var o=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var a=o.length,c=new Array(a);c[0]=g;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i[p]="string"==typeof e?e:n,c[1]=i;for(var l=2;l<a;l++)c[l]=o[l];return r.createElement.apply(null,c)}return r.createElement.apply(null,o)}g.displayName="MDXCreateElement"},3958:(e,t,o)=>{o.r(t),o.d(t,{assets:()=>s,contentTitle:()=>c,default:()=>d,frontMatter:()=>a,metadata:()=>i,toc:()=>l});var r=o(7462),n=(o(7294),o(3905));const a={sidebar_position:3,sidebar_label:"Google Ads"},c="Google Ads",i={unversionedId:"connectors/google_ads",id:"connectors/google_ads",title:"Google Ads",description:"This page contains the setup guide and reference information for the Google Ads source connector.",source:"@site/docs/connectors/google_ads.mdx",sourceDirName:"connectors",slug:"/connectors/google_ads",permalink:"/docs/connectors/google_ads",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/connectors/google_ads.mdx",tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3,sidebar_label:"Google Ads"},sidebar:"tutorialSidebar",previous:{title:"Facebook Marketing",permalink:"/docs/connectors/facebook_marketing"},next:{title:"Google Analytics",permalink:"/docs/connectors/google_analytics"}},s={},l=[{value:"Prerequisite",id:"prerequisite",level:3},{value:"Configuration",id:"configuration",level:3}],u={toc:l},p="wrapper";function d(e){let{components:t,...a}=e;return(0,n.kt)(p,(0,r.Z)({},u,a,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"google-ads"},"Google Ads"),(0,n.kt)("p",null,"This page contains the setup guide and reference information for the Google Ads source connector."),(0,n.kt)("h3",{id:"prerequisite"},"Prerequisite"),(0,n.kt)("p",null,"Ensure you have a Google Ads account linked to a Google Ads Manager account."),(0,n.kt)("h3",{id:"configuration"},"Configuration"),(0,n.kt)("ol",null,(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},"Click the ",(0,n.kt)("strong",{parentName:"p"},"Connect")," button to authenticate your Google Ads account. In the pop-up, select the appropriate Google account, and click ",(0,n.kt)("strong",{parentName:"p"},"Continue")," to proceed.")),(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},"Enter a comma-separated list of the ",(0,n.kt)("strong",{parentName:"p"},"Customer ID(s)")," for your account. These IDs are 10-digit numbers that uniquely identify your account. To find your Customer ID, ",(0,n.kt)("a",{class:"custom-link",href:"https://support.google.com/google-ads/answer/1704344?_gl=1*11hymcs*_ga*MTAyMzEzNzY4OS4xNjk2ODM5NDkw*_ga_EDX3TPP6H7*MTY5NzA5NzYyMi4xNi4xLjE2OTcwOTc2MzguMC4wLjA"},"Click here"),".")),(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},"Finally, click ",(0,n.kt)("strong",{parentName:"p"},"Continue")," to proceed with the configuration."))),(0,n.kt)("p",null,"By following these steps and updating the necessary details in the Fabriq UI, you can successfully create the Google Ads source connector for your account."),(0,n.kt)("p",null,(0,n.kt)("img",{alt:"Google Ads Image",src:o(9718).Z,width:"1845",height:"797"})))}d.isMDXComponent=!0},9718:(e,t,o)=>{o.d(t,{Z:()=>r});const r=o.p+"assets/images/google_ads-45ddbca7a2de9f9f1edb990b38145206.png"}}]);