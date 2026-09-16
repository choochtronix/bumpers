import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { chromium, webkit } from "playwright";
import {mkdir} from 'node:fs/promises';
const root = fileURLToPath(new URL("..", import.meta.url));
const baseUrl = process.argv[2] || "http://127.0.0.1:5173";
const engine = process.env.BROWSER === "webkit" ? webkit : chromium;
const browser = await engine.launch(engine === chromium ? { executablePath: process.env.CHROME_PATH || "/usr/bin/google-chrome-stable", args: ["--no-sandbox"] } : {});
const output=`${root}/card-snapshots/system-repairs`;
await mkdir(output,{recursive:true});
const listings=Array.from({length:60},(_,i)=>({id:`audit-${i}`,source:'yahoo-auctions',region:'japan',currency:'JPY',title:`Moog Voyager synthesizer ${i}`,price:120000+i,condition:'Used',listedAt:new Date().toISOString(),url:`https://example.invalid/${i}`,image:'/assets/ICONS-site/brrtz_logo.svg'}));
try {
 for(const width of [320,390,770,1440]){
  for(const theme of ['light','dark']){
   const context=await browser.newContext({viewport:{width,height:900},locale:'ja-JP',timezoneId:'Asia/Tokyo',reducedMotion:'reduce'});
   const page=await context.newPage();
   const errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.addInitScript(theme=>{localStorage.setItem('bumpers.theme',theme);localStorage.setItem('bumpers.welcomeDismissed','true');},theme);
   await page.route('**/api/**',route=>{
    const u=new URL(route.request().url());
    return route.fulfill({json:u.pathname==='/api/auth/config'?{enabled:false}:{listings,meta:{liveSources:['yahoo-auctions'],errors:[],sourceStats:[{source:'yahoo-auctions',status:'ok',rawCount:listings.length}]}}});
   });
   for(const [view,url] of [['home','/'],['search','/?q=Moog&region=japan&resultView=gallery'],['watchlist','/?view=watchlist'],['saved','/?view=my-page'],['settings','/settings#account']]){
    await page.goto(`${baseUrl}${url}`,{waitUntil:'load'});
    await page.waitForFunction(()=>typeof isSearching!=='undefined'&&!isSearching);
    await page.evaluate(()=>document.fonts.ready);
    const metrics=await page.evaluate(()=>{
     const box=s=>{const el=document.querySelector(s);if(!el||!el.getClientRects().length)return null;const r=el.getBoundingClientRect();return {x:r.x,right:r.right,width:r.width};};
     return {pageWidth:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth,search:box('#terms'),field:box('.search-terms-field'),cards:document.querySelectorAll('#resultGrid .listing-card').length,theme:document.body.dataset.theme};
    });
    assert.ok(metrics.scrollWidth <= metrics.pageWidth, `${view} overflows at ${width} ${theme}`);
    console.log(JSON.stringify({view,width,theme,metrics}));
    if([390,1440].includes(width)&&['home','search','settings'].includes(view)) await page.screenshot({path:`${output}/${view}-${width}-${theme}.png`,animations:'disabled'});
    if(view==='search'){
     const order=()=>page.locator('#resultGrid .listing-card').evaluateAll(els=>els.slice(0,8).map(e=>({id:e.dataset.listingKey,y:Math.round(e.getBoundingClientRect().y+scrollY)})));
     const before=await order();
     await page.evaluate(()=>window.scrollTo(0,800));
     await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
     const after=await order();
     assert.deepEqual(after, before, 'gallery moved during scroll');
     console.log(JSON.stringify({check:'gallery-stability',width,theme,stable:JSON.stringify(before)===JSON.stringify(after)}));
     await page.evaluate(()=>window.scrollTo(0,0));
     await page.locator('#openRefineSearch').click();
     await page.locator('#refineSourceOptions > summary').click();
     await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))));
     const refine=await page.locator('.refine-panel').evaluate(el=>({scrollTop:el.scrollTop,width:el.clientWidth,scrollWidth:el.scrollWidth,background:getComputedStyle(el).backgroundColor,labels:[...el.querySelectorAll('label')].slice(0,4).map(l=>({text:l.textContent.trim().slice(0,24),color:getComputedStyle(l).color}))}));
     console.log(JSON.stringify({check:'refine',width,theme,...refine}));
     if(width===390||width===1440) await page.screenshot({path:`${output}/refine-${width}-${theme}.png`,animations:'disabled'});
    }
   }
   assert.deepEqual(errors, [], 'browser errors');
   console.log(JSON.stringify({check:'browser-errors',width,theme,errors}));
   await context.close();
  }
 }
}finally{await browser.close();}
