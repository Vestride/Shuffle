"use strict";(globalThis.webpackChunkshuffle_docs=globalThis.webpackChunkshuffle_docs||[]).push([[456],{876:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>h});var r=n(2784);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var s=r.createContext({}),c=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},u=function(e){var t=c(e.components);return r.createElement(s.Provider,{value:t},e.children)},p="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},f=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,o=e.originalType,s=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),p=c(n),f=i,h=p["".concat(s,".").concat(f)]||p[f]||m[f]||o;return n?r.createElement(h,a(a({ref:t},u),{},{components:n})):r.createElement(h,a({ref:t},u))}));function h(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var o=n.length,a=new Array(o);a[0]=f;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l[p]="string"==typeof e?e:i,a[1]=l;for(var c=2;c<o;c++)a[c]=n[c];return r.createElement.apply(null,a)}return r.createElement.apply(null,n)}f.displayName="MDXCreateElement"},9764:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>a,default:()=>m,frontMatter:()=>o,metadata:()=>l,toc:()=>c});var r=n(8427),i=(n(2784),n(876));const o={sidebar_position:3},a="How column widths work",l={unversionedId:"column-widths",id:"column-widths",title:"How column widths work",description:"There are 4 options for defining the width of the columns:",source:"@site/docs/column-widths.md",sourceDirName:".",slug:"/column-widths",permalink:"/Shuffle/docs/column-widths",draft:!1,editUrl:"https://github.com/Vestride/Shuffle/tree/main/apps/website/docs/docs/column-widths.md",tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3},sidebar:"tutorialSidebar",previous:{title:"Getting started",permalink:"/Shuffle/docs/getting-started"},next:{title:"Configuring Shuffle",permalink:"/Shuffle/docs/configuration"}},s={},c=[],u={toc:c},p="wrapper";function m(e){let{components:t,...n}=e;return(0,i.kt)(p,(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"how-column-widths-work"},"How column widths work"),(0,i.kt)("p",null,"There are 4 options for defining the width of the columns:"),(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("p",{parentName:"li"},"Use a ",(0,i.kt)("strong",{parentName:"p"},"sizer")," element. This is the easiest way to specify column and gutter widths. Add the sizer element and make it 1 column wide. Shuffle will measure the ",(0,i.kt)("inlineCode",{parentName:"p"},"width")," and ",(0,i.kt)("inlineCode",{parentName:"p"},"margin-left")," of this ",(0,i.kt)("inlineCode",{parentName:"p"},"sizer")," element each time the grid resizes. This is awesome for responsive or fluid grids where the width of a column is a percentage."),(0,i.kt)("pre",{parentName:"li"},(0,i.kt)("code",{parentName:"pre",className:"language-js"},"const shuffleInstance = new Shuffle(element, {\n  itemSelector: '.picture-item',\n  // highlight-next-line\n  sizer: '.js-shuffle-sizer',\n});\n"))),(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("p",{parentName:"li"},"Use a ",(0,i.kt)("strong",{parentName:"p"},"function"),". When a function is used, its first parameter will be the width of the shuffle element. You need to return the column width for shuffle to use (in pixels)."),(0,i.kt)("pre",{parentName:"li"},(0,i.kt)("code",{parentName:"pre",className:"language-js"},"const shuffleInstance = new Shuffle(element, {\n  itemSelector: '.picture-item',\n  // highlight-next-line\n  columnWidth: (containerWidth) => 0.18 * containerWidth,\n});\n"))),(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("p",{parentName:"li"},"A ",(0,i.kt)("strong",{parentName:"p"},"number"),". This will explicitly set the column width to your number (in pixels)."),(0,i.kt)("pre",{parentName:"li"},(0,i.kt)("code",{parentName:"pre",className:"language-js"},"const shuffleInstance = new Shuffle(element, {\n  itemSelector: '.picture-item',\n  // highlight-next-line\n  columnWidth: 200,\n});\n"))),(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("p",{parentName:"li"},"By default, shuffle will use the width of the first item to calculate the column width."),(0,i.kt)("pre",{parentName:"li"},(0,i.kt)("code",{parentName:"pre",className:"language-js"},"const shuffleInstance = new Shuffle(element, {\n  itemSelector: '.picture-item',\n});\n")))))}m.isMDXComponent=!0}}]);