import"./5uFLRXWz.js";import{j as o}from"./Cp7Md9uy.js";const a=()=>{const e=t=>s=>{const r=o("/api/_github",t,`${i(s)||"index"}.json`);return $fetch(r,{responseType:"json"})};return{fetchRepository:e("repository"),fetchReleases:e("releases"),fetchRelease:e("releases"),fetchLastRelease:t=>e("releases")({...t,last:!0}),fetchContributors:e("contributors"),fetchFileContributors:e("contributors/file"),fetchReadme:e("readme"),fetchCommits:e("commits")}};function i(e){return Object.entries(e).map(([t,s])=>`${t}_${String(s)}`).join(":")}export{a as u};