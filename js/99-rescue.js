/* The rescue page: this old address only hands each trainer's save over to the game's new home. */
const RESCUE_HOME = 'https://bokemon.netlify.app';
function rescueBundle(p){
  return { format:'bokemon-backup', version:2, savedAt:new Date().toISOString(), profile:p, localWords, hiddenWords, wordlist:masterWords };
}
function renderProfileSelect(){
  setScreenBg('home');
  $('#brandSub').textContent = 'A new home';
  const list = ui.profileList || [];
  const link = `<a href="${RESCUE_HOME}" style="color:var(--cinnabar);font-weight:900;">HERE (bokemon.netlify.app)</a>`;
  screenEl.innerHTML = `
    <div style="text-align:center;margin:10px 0 20px;">
      <div style="font-family:'Noto Serif SC',serif;font-weight:900;font-size:38px;line-height:1;">博刻<span style="font-family:'Baloo 2',cursive;font-size:28px;color:var(--cinnabar);margin-left:5px;">MON</span></div>
    </div>
    <div class="hp-card" style="font-size:17px;font-weight:700;line-height:1.6;">
      <p style="margin:0 0 12px;">Bokemon has a new and upgraded home ${link}.</p>
      <p style="margin:0;">Please download your save file HERE and load it on the main page by clicking <b>'Restore from a backup file'</b>.</p>
    </div>
    <div id="rescueList" style="display:flex;flex-direction:column;gap:10px;margin-top:14px;">
      ${list.length ? list.map(pr=>`
        <div class="region-card">
          ${pr.avatar ? avatarImg(pr.avatar, 48) : ''}
          <div class="region-info" style="flex:1;"><h3>${escapeHtml(pr.name)}</h3><p>Lv ${pr.level||5}</p></div>
          <button class="btn btn-primary" data-save="${pr.id}" style="width:auto;padding:10px 16px;">Download HERE</button>
        </div>`).join('')
      : `<div class="placeholder-note">No saved trainer was found in this browser. Open this page in the browser this device always played in.</div>`}
    </div>
    <a class="btn btn-jade" href="${RESCUE_HOME}" style="margin-top:16px;display:block;text-align:center;text-decoration:none;">Go to the new home</a>
  `;
  screenEl.querySelectorAll('[data-save]').forEach(b=> b.addEventListener('click', async ()=>{
    const p = await loadProfileById(b.dataset.save);
    if(!p){ toast("Couldn't open that trainer's save."); return; }
    const safe = (p.name || 'trainer').replace(/[^\w-]/g, '') || 'trainer';
    download(`bokemon-${safe}-${new Date().toISOString().slice(0,10)}.json`, JSON.stringify(rescueBundle(p), null, 2), 'application/json');
    toast(`${p.name}'s save file downloaded.`);
  }));
}
/* nowhere else to go from here: every screen comes back to this one */
go = (function(orig){ return function(screen){ return orig(screen === 'profileSelect' ? screen : 'profileSelect'); }; })(go);
