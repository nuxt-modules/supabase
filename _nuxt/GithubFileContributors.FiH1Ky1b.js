import{d as o,ah as n,N as i,aM as c,aR as f,a$ as d}from"./entry.L8aXr2se.js";import{u as h}from"./useGithub.PIZR5Ksg.js";const l=o({props:{query:{type:Object,required:!1,default:()=>({})}},async setup(r){const a=n(r.query,"source"),{fetchFileContributors:u}=h();i(a,()=>{t&&t()});const{data:e,refresh:t,pending:s}=await c(`github-file-contributors-${f(r.query)}`,()=>u(r.query));return{contributors:e,refresh:t,pending:s}},render({contributors:r,refresh:a,pending:u}){var t;const e=d();return(t=e==null?void 0:e.default)==null?void 0:t.call(e,{contributors:r,refresh:a,pending:u})}});export{l as default};
