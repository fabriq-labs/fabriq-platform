"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[303],{3905:(e,t,a)=>{a.d(t,{Zo:()=>u,kt:()=>f});var r=a(7294);function n(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function i(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function o(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?i(Object(a),!0).forEach((function(t){n(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):i(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function s(e,t){if(null==e)return{};var a,r,n=function(e,t){if(null==e)return{};var a,r,n={},i=Object.keys(e);for(r=0;r<i.length;r++)a=i[r],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)a=i[r],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var l=r.createContext({}),p=function(e){var t=r.useContext(l),a=t;return e&&(a="function"==typeof e?e(t):o(o({},t),e)),a},u=function(e){var t=p(e.components);return r.createElement(l.Provider,{value:t},e.children)},c="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},b=r.forwardRef((function(e,t){var a=e.components,n=e.mdxType,i=e.originalType,l=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),c=p(a),b=n,f=c["".concat(l,".").concat(b)]||c[b]||d[b]||i;return a?r.createElement(f,o(o({ref:t},u),{},{components:a})):r.createElement(f,o({ref:t},u))}));function f(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var i=a.length,o=new Array(i);o[0]=b;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s[c]="string"==typeof e?e:n,o[1]=s;for(var p=2;p<i;p++)o[p]=a[p];return r.createElement.apply(null,o)}return r.createElement.apply(null,a)}b.displayName="MDXCreateElement"},6837:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>l,contentTitle:()=>o,default:()=>d,frontMatter:()=>i,metadata:()=>s,toc:()=>p});var r=a(7462),n=(a(7294),a(3905));const i={sidebar_position:1,sidebar_label:"Guide to Start Fabriq"},o="Guide to Start Fabriq",s={unversionedId:"quickstart/start_fabriq",id:"quickstart/start_fabriq",title:"Guide to Start Fabriq",description:"This guide will show you how to start with Fabriq step by step.",source:"@site/docs/quickstart/start_fabriq.md",sourceDirName:"quickstart",slug:"/quickstart/start_fabriq",permalink:"/docs/quickstart/start_fabriq",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/quickstart/start_fabriq.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1,sidebar_label:"Guide to Start Fabriq"},sidebar:"tutorialSidebar",previous:{title:"Quickstart",permalink:"/docs/category/quickstart"},next:{title:"Create a Firebase Project",permalink:"/docs/quickstart/setup_firebase_project"}},l={},p=[{value:"1. Clone the Project",id:"1-clone-the-project",level:3},{value:"2. Firebase setup",id:"2-firebase-setup",level:3},{value:"3. Database Initialization",id:"3-database-initialization",level:3},{value:"4. Organizationa and user creation setup",id:"4-organizationa-and-user-creation-setup",level:3},{value:"5. Start the server",id:"5-start-the-server",level:3}],u={toc:p},c="wrapper";function d(e){let{components:t,...i}=e;return(0,n.kt)(c,(0,r.Z)({},u,i,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"guide-to-start-fabriq"},"Guide to Start Fabriq"),(0,n.kt)("p",null,"This guide will show you how to start with Fabriq step by step."),(0,n.kt)("h3",{id:"1-clone-the-project"},"1. Clone the Project"),(0,n.kt)("p",null,"To begin, clone the Fabriq Github repository by using the following command:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-shell"},"git clone https://github.com/fabriq-labs/fabriq-platform.git\n")),(0,n.kt)("p",null,"If you don't have the project already, you can access it ",(0,n.kt)("a",{parentName:"p",href:"https://github.com/fabriq-labs/fabriq-platform/tree/master/"},"here"),"."),(0,n.kt)("h3",{id:"2-firebase-setup"},"2. Firebase setup"),(0,n.kt)("p",null,"Create the Firebase project by following the steps detailed ",(0,n.kt)("a",{parentName:"p",href:"/docs/quickstart/setup_firebase_project"},"here"),"."),(0,n.kt)("h3",{id:"3-database-initialization"},"3. Database Initialization"),(0,n.kt)("p",null,"Next, initialize the database by following the instructions provided ",(0,n.kt)("a",{parentName:"p",href:"./init_database"},"here"),"."),(0,n.kt)("h3",{id:"4-organizationa-and-user-creation-setup"},"4. Organizationa and user creation setup"),(0,n.kt)("p",null,"If you have completed the Database Initialization step, the initial user and organization have already been created in both the database and Firebase. In that case, you can skip this part and proceed to the next section."),(0,n.kt)("p",null,"However, if you haven't done the Database Initialization yet, follow the steps below to manually create an ",(0,n.kt)("a",{parentName:"p",href:"./org_setup"},"organization and user"),"."),(0,n.kt)("h3",{id:"5-start-the-server"},"5. Start the server"),(0,n.kt)("p",null,"Once the initial setups are completed, you can proceed to set up a Fabriq app. First, create a ",(0,n.kt)("a",{parentName:"p",href:"https://github.com/fabriq-labs/fabriq-platform/blob/master/sample.env"},".env")," file using the sample.env as a template and update it with the necessary details. Now you are ready to run a Fabriq app."),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-shell"},"git clone https://github.com/fabriq-labs/fabriq-platform.git\ncd fabriq-platform\ndocker-compose up -d\n")),(0,n.kt)("p",null,"After the successful execution of the ",(0,n.kt)("inlineCode",{parentName:"p"},"docker-compose up -d")," command, the following components are now running:"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"The server component is up and running."),(0,n.kt)("li",{parentName:"ul"},"The worker component is up and running."),(0,n.kt)("li",{parentName:"ul"},"The ELT-wrapper component is up and running."),(0,n.kt)("li",{parentName:"ul"},"Hasura is up and running."),(0,n.kt)("li",{parentName:"ul"},"OpenAI is up and running.")),(0,n.kt)("p",null,(0,n.kt)("img",{alt:"flyway_running",src:a(6766).Z,width:"1920",height:"1080"})),(0,n.kt)("p",null,"This indicates that all the necessary components of the system are active and ready for use."))}d.isMDXComponent=!0},6766:(e,t,a)=>{a.d(t,{Z:()=>r});const r=a.p+"assets/images/fabriq_running-cfd83f046c1b644947cf7e9faf6cded7.png"}}]);