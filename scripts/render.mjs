import {selectComposition, renderMedia, openBrowser} from '@remotion/renderer';
const [,, bundle, out, fps='30'] = process.argv;
const browserExecutable='/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const comp = await selectComposition({serveUrl: bundle, id: 'CheGuevara', browserExecutable});
const composition = {...comp, fps: Number(fps), durationInFrames: Math.round(comp.durationInFrames*Number(fps)/30)};
let last=0;
await renderMedia({composition, serveUrl: bundle, codec:'h264', crf: 16, outputLocation: out, browserExecutable, concurrency: 4, imageFormat:'jpeg', jpegQuality: 92,
  onProgress: ({progress}) => { if (progress-last>0.1){ last=progress; console.log(Math.round(progress*100)+'%'); } }});
console.log('done');
