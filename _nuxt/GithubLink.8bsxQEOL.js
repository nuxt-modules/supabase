import{d as y,m as u,G as c,be as v,a$ as w}from"./entry.L8aXr2se.js";const p=y({props:{owner:{type:String,default:()=>{var e,t;return(t=(e=u())==null?void 0:e.github)==null?void 0:t.owner},required:!1},repo:{type:String,default:()=>{var e,t;return(t=(e=u())==null?void 0:e.github)==null?void 0:t.repo},required:!1},branch:{type:String,default:()=>{var e,t;return(t=(e=u())==null?void 0:e.github)==null?void 0:t.branch},required:!1},dir:{type:String,default:()=>{var e,t;return(t=(e=u())==null?void 0:e.github)==null?void 0:t.dir},required:!1},source:{type:String,required:!1,default:void 0},page:{type:Object,required:!1,default:void 0},contentDir:{type:String,required:!1,default:"content"},edit:{type:Boolean,required:!1,default:!0}},setup(e){if(!e.owner||!e.repo||!e.branch)throw new Error("If you want to use `GithubLink` component, you must specify: `owner`, `repo` and `branch`.");const t=c(()=>{var h,s;let{repo:r,owner:a,branch:f,contentDir:l}=e,d="";if((s=(h=u())==null?void 0:h.public)!=null&&s.content){let n;const{sources:b}=u().public.content;for(const g in b||[])if(e.page._id.startsWith(g)){n=b[g];break}(n==null?void 0:n.driver)==="github"&&(r=n.repo||e.repo||"",a=n.owner||e.owner||"",f=n.branch||e.branch||"main",l=n.dir||e.contentDir||"",d=n.prefix||"")}return{repo:r,owner:a,branch:f,contentDir:l,prefix:d}}),i=c(()=>v("https://github.com",`${t.value.owner}/${t.value.repo}`)),o=c(()=>{var a;const r=[];return(a=e==null?void 0:e.page)!=null&&a._path?(t.value.contentDir&&r.push(t.value.contentDir),r.push(e.page._file.substring(t.value.prefix.length)),r):(e.dir&&r.push(e.dir),e.source&&r.push(e.source),r)});return{url:c(()=>{const r=[i.value];return e.edit?r.push("edit"):r.push("tree"),r.push(t.value.branch,...o.value),r.filter(Boolean).join("/")})}},render(e){var o;const{url:t}=e,i=w();return(o=i==null?void 0:i.default)==null?void 0:o.call(i,{url:t})}});export{p as default};
