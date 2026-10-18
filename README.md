# Kuzey Mete Kardeş — Portfolio

Türkçe ve İngilizce, çok sayfalı kişisel portföy sitesi.

## Sayfalar / Pages

- `index.html` — profil, seçili çalışmalar, eğitim ve iletişim
- `jarvis.html` — JARVIS'in problemi, mimarisi, hafıza modeli ve yol haritası
- `iron-man.html` — Iron Man kaskı ve kolu için sistem ve üretim planı

## Tasarım ilkeleri

- Koyu, tipografi odaklı ve özgün arayüz
- Sistem imleci her zaman görünür
- Framework, WebGL, canvas ve özel imleç yok
- Sürekli çalışan animasyon yok
- `prefers-reduced-motion` ve veri tasarrufu desteği
- Haricî font, takip kodu ve çerez yok
- Klavye odağı, atlama bağlantısı ve mobil uyum

Dil seçimi tarayıcıda yerel olarak saklanır ve tüm sayfalarda korunur.

## JARVIS canlı ilerleme

Ana sayfa projeleri ve kısa bir ilerleme bağlantısını öne çıkarır. JARVIS sayfası
`progress.js` ile aşama haritasını gösterir. Kaynak, bu deponun
[#1 ilerleme kaydı](https://github.com/AKKSYkardes/AKKSYkardes.github.io/issues/1)
gövdesindeki `jarvis-progress:start/end` işaretleri arasındaki kontrol listesidir.
Tamamlanan aşamayı `[x]` yapın, aktif aşamaya `<!-- active -->` ekleyin (en fazla bir tane).
Her satır `- [ ] Türkçe | English` biçiminde olmalıdır. Commit sayısı ilerleme sayılmaz.
Sayfa açık ve görünürken 60 saniyede bir GitHub API kontrol edilir; yeniden deploy gerekmez.
Bu kayıt elle veya yetkili bir geliştirme iş akışı tarafından güncellenmelidir;
özel JARVIS deposundaki commit'ler kendiliğinden aşama tamamlamaz.

API hatası veya kota aşımında son yerel kayıt / `progress.json` görüntülenir ve
canlı kaynağın alınamadığı belirtilir. Tarihler İstanbul saatidir. Tarayıcıda token yoktur.
Yeni sürümde `progress.json` kaydını da güncel tutun. Yüzde toplam ürün tamamlanması
iddiası taşımaması için tamamlanma oranı gösterilmez.

Panelde oran veya yüzde yerine uygulanan, aktif ve hedef aşamaların sayıları ile
numaralı durum haritası bulunur. İlk istek tamamlanana kadar kontrol ediliyor mesajı
gösterilir; ağ hatası yalnız başarısız bir canlı istekten sonra belirtilir.
JARVIS örnek akışı temsili senaryodur, gerçek yürütme kaydı veya canlı demo değildir.
Kaynak kodu özel olduğu için ziyaretçi özel depoya yönlendirilmez.
Hypium okul takımı bağlantısı: https://teamhypium.com.tr/

`jarvis-memory.html` ve `jarvis-runtime.html` tarihli teknik anlatımlardır;
uygulama değiştiğinde metinleri ayrıca güncelleyin. Canlı panel teknik metni yeniden yazmaz.

