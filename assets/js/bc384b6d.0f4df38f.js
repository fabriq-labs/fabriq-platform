"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[804],{3905:(e,t,o)=>{o.d(t,{Zo:()=>l,kt:()=>f});var n=o(7294);function r(e,t,o){return t in e?Object.defineProperty(e,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[t]=o,e}function a(e,t){var o=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),o.push.apply(o,n)}return o}function c(e){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?a(Object(o),!0).forEach((function(t){r(e,t,o[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(o)):a(Object(o)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(o,t))}))}return e}function i(e,t){if(null==e)return{};var o,n,r=function(e,t){if(null==e)return{};var o,n,r={},a=Object.keys(e);for(n=0;n<a.length;n++)o=a[n],t.indexOf(o)>=0||(r[o]=e[o]);return r}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)o=a[n],t.indexOf(o)>=0||Object.prototype.propertyIsEnumerable.call(e,o)&&(r[o]=e[o])}return r}var s=n.createContext({}),u=function(e){var t=n.useContext(s),o=t;return e&&(o="function"==typeof e?e(t):c(c({},t),e)),o},l=function(e){var t=u(e.components);return n.createElement(s.Provider,{value:t},e.children)},p="mdxType",k={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var o=e.components,r=e.mdxType,a=e.originalType,s=e.parentName,l=i(e,["components","mdxType","originalType","parentName"]),p=u(o),d=r,f=p["".concat(s,".").concat(d)]||p[d]||k[d]||a;return o?n.createElement(f,c(c({ref:t},l),{},{components:o})):n.createElement(f,c({ref:t},l))}));function f(e,t){var o=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var a=o.length,c=new Array(a);c[0]=d;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i[p]="string"==typeof e?e:r,c[1]=i;for(var u=2;u<a;u++)c[u]=o[u];return n.createElement.apply(null,c)}return n.createElement.apply(null,o)}d.displayName="MDXCreateElement"},2946:(e,t,o)=>{o.r(t),o.d(t,{assets:()=>s,contentTitle:()=>c,default:()=>k,frontMatter:()=>a,metadata:()=>i,toc:()=>u});var n=o(7462),r=(o(7294),o(3905));const a={sidebar_position:2,sidebar_label:"Facebook Marketing"},c="Facebook Marketing",i={unversionedId:"connectors/facebook_marketing",id:"connectors/facebook_marketing",title:"Facebook Marketing",description:"This page contains the setup guide and reference information for the Facebook Marketing source connector.",source:"@site/docs/connectors/facebook_marketing.mdx",sourceDirName:"connectors",slug:"/connectors/facebook_marketing",permalink:"/docs/connectors/facebook_marketing",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/connectors/facebook_marketing.mdx",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2,sidebar_label:"Facebook Marketing"},sidebar:"tutorialSidebar",previous:{title:"Facebook Pages",permalink:"/docs/connectors/facebook_page"},next:{title:"Google Ads",permalink:"/docs/connectors/google_ads"}},s={},u=[{value:"Prerequisite",id:"prerequisite",level:3},{value:"Authentication",id:"authentication",level:3},{value:"Configuration",id:"configuration",level:3}],l={toc:u},p="wrapper";function k(e){let{components:t,...a}=e;return(0,r.kt)(p,(0,n.Z)({},l,a,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"facebook-marketing"},"Facebook Marketing"),(0,r.kt)("p",null,"This page contains the setup guide and reference information for the Facebook Marketing source connector."),(0,r.kt)("h3",{id:"prerequisite"},"Prerequisite"),(0,r.kt)("p",null,"You require the login details of your Facebook account, along with the necessary permissions to access your advertising account."),(0,r.kt)("h3",{id:"authentication"},"Authentication"),(0,r.kt)("p",null,"The connector currently uses OAuth 2.0 for authentication. Follow these steps:"),(0,r.kt)("h3",{id:"configuration"},"Configuration"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"Click the ",(0,r.kt)("strong",{parentName:"p"},"Connect")," button to authenticate your Facebook account. In the pop-up, select the appropriate Facebook account, and click ",(0,r.kt)("strong",{parentName:"p"},"Continue")," to proceed.")),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"To input the ",(0,r.kt)("strong",{parentName:"p"},"Account ID"),", provide the numerical Facebook Ad Account ID, which you'll use for data retrieval from the Facebook Marketing API. You can locate this ID by accessing your Meta Ads Manager. You'll find the Ad Account ID number within the Account dropdown menu or in your browser's address bar. For more details, consult the Facebook documentation, ",(0,r.kt)("a",{class:"custom-link",href:"https://www.facebook.com/business/help/1492627900875762?_gl=1*1jknky5*_ga*NzMzNjA3ODEwLjE2ODE4MTgzMzQ.*_ga_EDX3TPP6H7*MTY5NzExMjM1My43My4xLjE2OTcxMTIzNzAuMC4wLjA"},"Click here"))),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"Finally, click ",(0,r.kt)("strong",{parentName:"p"},"Continue")," to proceed with the configuration."))),(0,r.kt)("p",null,"By following these steps and updating the necessary details in the Fabriq UI, you can successfully create the Facebook Marketing source connector for your account."),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"Facebook Marketing Image",src:o(9721).Z,width:"1846",height:"796"})))}k.isMDXComponent=!0},9721:(e,t,o)=>{o.d(t,{Z:()=>n});const n=o.p+"assets/images/facebook_marketing_-eb16f878502d769e172b7640d67cbb91.png"}}]);