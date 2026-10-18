(() => {
  'use strict';
  const form = document.querySelector('[data-simulation]');
  const output = document.querySelector('[data-sim-output]');
  if (!form || !output) return;
  let result = null;
  const t = (tr, en) => document.documentElement.lang === 'tr' ? tr : en;
  function el(tag, text, className) {
    const node = document.createElement(tag);
    node.textContent = text;
    if (className) node.className = className;
    return node;
  }
  function render() {
    if (!result) {
      output.replaceChildren(el('p',t('İzinleri seçip akışı çalıştır. Hangi adımın neden durduğunu veya geçtiğini burada göreceksin.','Choose permissions and run the flow. See which step passes or stops, and why.')));
      return;
    }
    const list = el('ol','');
    list.append(el('li',t('Öneri: model, demo-01 kaydı için memory.read önerir.','Proposal: the model proposes memory.read for record demo-01.')));
    let title, conclusion;
    if (!result.read) {
      title=t('Yerel okuma izninde durdu.','Stopped at the local read grant.');
      list.append(el('li',t('Kontrol: bu kaydı okumak için izin yok. Aktarım izni tek başına yeterli değil.','Check: there is no grant to read this record. Export permission alone is insufficient.')),el('li',t('Sonuç: araç ve hafıza deposu çağrılmadan öneri reddedilir.','Result: the proposal is denied before calling the tool or memory store.')));
      conclusion=t('Temsili sonuç: permission_denied. Örnek kayıt okunmadı ve modele aktarılmadı.','Illustrative result: permission_denied. The example record was not read or shared with a model.');
    } else if (!result.export) {
      title=t('Modele aktarım izninde durdu.','Stopped at the export grant.');
      list.append(el('li',t('Kontrol: yerel okuma izni var; ancak model hedefine aktarım izni yok.','Check: a local read grant exists, but there is no export grant for the model destination.')),el('li',t('Sonuç: model için hazırlanan bu akış, hafıza deposuna erişmeden durur. Ayrı bir yerel okuma yolu mümkün olabilir.','Result: this provider-bound flow stops before accessing the memory store. A separate local-only read path may be allowed.')));
      conclusion=t('Temsili sonuç: permission_denied. Yerel okuma izni, modele paylaşım izni vermez.','Illustrative result: permission_denied. Local read permission does not grant permission to share with a model.');
    } else {
      title=t('Bu örnekte iki izin de sağlandı.','Both grants are present in this example.');
      list.append(el('li',t('Kontrol: sabit görev kapsamı, kayıt kimliği ve hedef eşleşir; okuma ve aktarım izinleri vardır.','Check: the fixed task scope, record ID and destination match; read and export grants are present.')),el('li',t('Hafıza: gerçek sistemde kayıt ve kaynak bütünlüğü kontrol edilir. Bu simülasyonda bütünlüğün geçerli olduğu varsayılır.','Memory: the real system validates the record and source integrity. This simulation assumes those checks pass.')),el('li',t('Yanıt: izinli içerik modele veri olarak sunulabilir. Burada model çağrısı yerine önceden yazılmış örnek gösterilir.','Answer: authorised content may be supplied to the model as data. Here a prewritten example replaces the model call.')));
      conclusion=t('Önceden yazılmış örnek yanıt: “Kaydedilen karar, ilk prototipi masa üzerinde test etmek.”','Prewritten example answer: “The saved decision is to test the first prototype on a desk.”');
    }
    output.replaceChildren(el('h3',title),list,el('p',conclusion,'sim-conclusion'),el('p',t('Yalnız açıklayıcı tarayıcı simülasyonu. Gerçek veri erişimi ve model çağrısı yapılmadı.','Illustrative browser simulation only. No real data access or model call occurred.')));
  }
  form.addEventListener('submit',event=>{
    event.preventDefault();
    result={read:form.elements.read.checked,export:form.elements.export.checked};
    render();
  });
  form.addEventListener('reset',()=>{result=null;render();});
  form.addEventListener('input',()=>{result=null;render();});
  document.addEventListener('localechange',render);
  render();
})();
