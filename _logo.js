const sharp=require('sharp');
(async()=>{const {data,info}=await sharp('../_quelle/logo1.png').trim().ensureAlpha().raw().toBuffer({resolveWithObject:true});
for(let i=0;i<data.length;i+=4){const m=Math.min(data[i],data[i+1],data[i+2]);if(m>235){data[i+3]=0}else if(m>190){data[i+3]=Math.round((235-m)/45*255)}}
await sharp(data,{raw:info}).resize({width:800}).png({compressionLevel:9}).toFile('img/logo.png');
// favicon: mark only (left 28%)
const mk=await sharp(data,{raw:info}).extract({left:0,top:0,width:Math.round(info.width*0.29),height:info.height}).trim().resize({width:96,height:96,fit:'contain',background:{r:0,g:0,b:0,alpha:0}}).png().toFile('favicon.png');console.log('ok',info.width,info.height)})();
