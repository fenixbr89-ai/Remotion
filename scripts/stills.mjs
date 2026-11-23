import {selectComposition, renderStill, openBrowser} from '@remotion/renderer';
const [,, bundle, outDir, framesCsv, scale='0.4', id='CheGuevara'] = process.argv;
const browserExecutable='/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const puppeteerInstance = await openBrowser('chrome', {browserExecutable});
const composition = await selectComposition({serveUrl: bundle, id, puppeteerInstance, browserExecutable});
for (const fr of framesCsv.split(',').map(Number)) {
  await renderStill({composition, serveUrl: bundle, frame: fr, output: `${outDir}/f${String(fr).padStart(4,'0')}.jpg`, imageFormat:'jpeg', scale: Number(scale), puppeteerInstance, browserExecutable});
}
await puppeteerInstance.close({silent:true});
console.log('done');
