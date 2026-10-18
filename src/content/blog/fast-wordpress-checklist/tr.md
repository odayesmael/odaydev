Bir müşteri "site yavaş" dediğinde ilk refleks genellikle bir optimizasyon eklentisi daha kurmaktır. Bu nadiren sorunu çözer. Hızlı bir WordPress sitesi, doğru sırayla alınmış birkaç kararın sonucudur. Elementor ile yapılmış kurumsal sitelerden WooCommerce mağazalarına kadar müşteri projelerinde izlediğim kontrol listesi aşağıda.

## 1. Bir şeye dokunmadan önce ölçün

[PageSpeed Insights](https://pagespeed.web.dev/) aracını açın ve önce **saha verilerine** bakın: bunlar gerçek ziyaretçilerin son 28 gündeki deneyimidir. Altındaki laboratuvar puanı hata ayıklamak için faydalıdır, ancak Google sıralamada saha verilerini kullanır. İzlenecek üç Core Web Vitals metriği ve "iyi" eşikleri:

- **LCP** (Largest Contentful Paint), ana içeriğin göründüğü an: en fazla 2,5 sn
- **INP** (Interaction to Next Paint), sayfanın dokunma ve tıklamalara ne kadar hızlı tepki verdiği: en fazla 200 ms
- **CLS** (Cumulative Layout Shift), yükleme sırasında öğelerin ne kadar kaydığı: en fazla 0,1

Ana sayfa ve iki üç önemli şablon için, örneğin ürün, hizmet ve blog sayfası için, değerleri not alın. "Önce" durumunu daha sonra karşılaştırmak isteyeceksiniz.

## 2. Önce sunucuyu düzeltin

Hiçbir ön yüz hilesi yavaş bir sunucuyu telafi edemez. Önbelleğe alınmış bir sayfada **Time to First Byte** yaklaşık 600 ms'nin üzerindeyse buradan başlayın.

- Güncel ve desteklenen bir PHP sürümü kullanın. Her büyük PHP 8 sürümü, PHP 7'ye göre belirgin şekilde daha hızlıdır.
- **OPcache**'in açık olduğundan emin olun. İyi barındırma firmalarının çoğunda varsayılan olarak açıktır.
- **Sayfa önbelleği** kullanın: barındırmanız sunuyorsa sunucu seviyesinde (Nginx, LiteSpeed), değilse bilinen bir önbellek eklentisiyle. WooCommerce'te sepet, ödeme ve hesap sayfalarını hariç tutun.
- Dinamik siteler (mağazalar, üyelik siteleri, LMS) için Redis gibi kalıcı bir **nesne önbelleği** ekleyin. Böylece tekrarlanan veritabanı sorguları bellekten gelir.
- Sitenin önüne bir CDN koyun. Çoğu kurumsal site için Cloudflare'in ücretsiz planı yeterlidir.

## 3. Görseller: en büyük ve en kolay kazanç

İncelediğim sitelerin çoğunda LCP öğesi bir görseldir, genellikle de ana banner.

- Görselleri **WebP veya AVIF** olarak, gösterildikleri boyuta küçültülmüş şekilde sunun. 1200 px'te göstermek için asla 4000 px fotoğraf yüklemeyin.
- WordPress'in `srcset` üretmesine izin verin (ortam kütüphanesi kullanıldığında varsayılan olarak yapar). Böylece telefonlar daha küçük dosyalar indirir.
- **Ekranın altında kalan görselleri tembel yükleyin, ama LCP görselini asla.** WordPress olası LCP görselini `fetchpriority="high"` ile işaretler ve tembel yüklemez, ancak sayfa oluşturucular ve slider'lar bunu çoğu zaman bozar. Ana görseli DevTools'ta kontrol edin.
- Her zaman `width` ve `height` (ya da `aspect-ratio`) belirtin ki tarayıcı alanı ayırsın. Bu tek adım çoğu CLS sorununu çözer.

## 4. Sayfa oluşturucuyu dizginleyin

Elementor ve benzeri araçlar müşteri siteleri için gayet uygundur, sadece biraz disiplin gerektirir:

- Eski bölüm → sütun → widget yapısı yerine **Flexbox Container** kullanın. Çok daha az HTML üretir.
- Oluşturucunun performans özelliklerini açın. Elementor'da bunlar arasında optimize edilmiş varlık yükleme, arka plan görsellerinin tembel yüklenmesi ve satır içi font ikonları bulunur. Tam adları sürüme göre değişir.
- Her biri kendi CSS ve JS dosyasını her sayfada yükleyen birden fazla "eklenti paketi" kullanmaktan kaçının.
- Tek bir iyi sıkıştırılmış görsel yeterliyse sayfanın en üstüne ağır bir slider veya video arka plan koymayın.

## 5. Fontlar

- Fontları üçüncü taraf bir servisten yüklemek yerine kendi sunucunuzda barındırın. Bir bağlantıdan tasarruf edersiniz ve AB'de ziyaretçi IP adreslerini başka yere göndermemiş olursunuz.
- Sadece gerçekten kullandığınız ağırlıkları, mümkünse tek bir değişken font olarak yükleyin.
- Ekranın üst kısmında kullanılan fontu önceden yükleyin (preload) ve `font-display: swap` kullanın.
- Mümkün olan yerlerde ikon fontlarını satır içi SVG'lerle değiştirin.

## 6. Eklentiler: biriktirmeyin, denetleyin

**Query Monitor**'ü geçici olarak kurun ve en yavaş sayfalarınızı açın. Hangi eklentilerin yavaş veritabanı sorguları veya hook'lar çalıştırdığını görürsünüz. Ardından:

- Kullanılmayan ve birbirinin işini yapan eklentileri kaldırın.
- Yalnızca tek bir sayfada gerekirken dosyalarını **tüm sitede** yükleyen eklentileri bulun. İletişim formu eklentileri bunun klasik örneğidir. Formu olmayan sayfalarda betiklerini kaldırın.
- "Her şeyi yapan" eklentileri küçük, odaklı eklentilerle ya da child theme'e eklenen birkaç satır kodla değiştirin.

## 7. Üçüncü taraf betikler

Canlı destek widget'ları, ısı haritaları, birden fazla analitik etiketi ve gömülü sosyal medya akışları, kötü INP değerinin çoğu zaman ana sebebidir. Her biri için verinin gerçekten kullanılıp kullanılmadığını sorun. Kalanları sayfa etkileşime hazır olduktan sonra ya da ziyaretçinin ilk etkileşiminden sonra yükleyin ve çerez onay kurallarına uyun.

## 8. Veritabanı bakımı

Eski siteler her isteği yavaşlatan bir yığın gereksiz veri biriktirir:

- **Otomatik yüklenen seçenekler:** `wp_options` tablosundaki autoload verisinin boyutunu kontrol edin. Eski eklentiler genellikle büyük autoload satırları bırakır. Güncel WordPress sürümleri Site Sağlığı ekranında bu konuda uyarır.
- Süresi dolmuş **transient**'ler, spam yorumlar ve binlerce **yazı revizyonu**. Revizyonları `wp-config.php` dosyasında `define('WP_POST_REVISIONS', 10);` ile sınırlayın.
- Çok siparişi olan WooCommerce mağazalarında **HPOS**'un (High-Performance Order Storage) açık olduğundan emin olun.

## 9. Yeniden ölçün ve izlemeye devam edin

PageSpeed Insights'ı aynı sayfalarda tekrar çalıştırın ve "önce" değerlerinizle karşılaştırın. Saha verilerinin bir değişikliği tam olarak yansıtmasının 28 güne kadar sürebileceğini unutmayın. Ardından, örneğin Search Console'daki Core Web Vitals raporuyla bir izleme kurun. Böylece yeni bir eklenti veya pazarlama betiği siteyi tekrar yavaşlattığında fark edersiniz.

> Deneyimime göre, tipik bir kurumsal sitede sorunun büyük kısmını barındırma, önbellek ve görseller çözer. Sayfa oluşturucu ve eklentiler üzerindeki çalışma da kalanın çoğunu çözer. Listenin en üstünden başlayın.
