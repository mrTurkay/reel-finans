const sectionStyle = {
  marginBottom: 32,
};

const h2Style = {
  fontSize: 18,
  fontWeight: 700,
  color: "#d69e2e",
  margin: "0 0 12px 0",
};

const pStyle = {
  fontSize: 13,
  color: "#a0aec0",
  lineHeight: 1.8,
  margin: "0 0 10px 0",
};

const detailsStyle = {
  background: "#161b22",
  border: "1px solid #21262d",
  borderRadius: 8,
  marginBottom: 8,
};

const summaryStyle = {
  fontSize: 13,
  fontWeight: 600,
  color: "#e2e8f0",
  cursor: "pointer",
  padding: "12px 14px",
  listStyle: "none",
};

const answerStyle = {
  fontSize: 13,
  color: "#a0aec0",
  lineHeight: 1.7,
  padding: "0 14px 12px",
};

export default function SEOContent() {
  return (
    <div
      style={{
        marginTop: 48,
        borderTop: "1px solid #21262d",
        paddingTop: 32,
      }}
    >
      {/* A. Sıfır Faizli Taksit Nedir? */}
      <section style={sectionStyle}>
        <h2 style={h2Style}>Sıfır Faizli Taksit Nedir?</h2>
        <p style={pStyle}>
          Eminevim, Fuzul Ev, Birevim, Katılımevim, Sinpaş, İmece, Emlak Katılım, Adil ve
          Albayrak gibi konut tasarruf ve finans şirketleri, "sıfır faizli taksit" adı altında
          konut edinme modelleri sunmaktadır. Bu sistemlerde katılımcılar belirli bir süre boyunca
          düzenli taksit öder; belirlenen teslim ayında konut bedeli satıcıya ödenir ve
          katılımcı kalan taksitleri ödemeye devam eder.
        </p>
        <p style={pStyle}>
          Ancak "sıfır faiz" ifadesi yanıltıcı olabilir. Hizmet bedeli (organizasyon ücreti),
          teslim tarihine kadar geçen süredeki enflasyon etkisi ve paranın zaman değeri
          hesaba katıldığında, bu sistemlerin gerçek maliyeti ortaya çıkar. Reel Finans
          hesaplayıcısı, IRR (İç Verim Oranı) yöntemiyle bu gerçek maliyeti şeffaf bir
          şekilde hesaplar.
        </p>
        <p style={pStyle}>
          Konut tasarruf sistemi Türkiye'de Eminevim, Fuzul Ev (Fuzul), Birevim, Katılımevim
          ve Albayrak gibi özel sektör şirketlerinin yanı sıra Emlak Katılım Bankası
          bünyesindeki kamu destekli yapılar tarafından da sunulmaktadır. Her birinin
          hizmet bedeli oranı, teslim süresi ve taksit yapısı farklılık gösterebilir.
        </p>
      </section>

      {/* B. Eminevim vs Banka Kredisi */}
      <section style={sectionStyle}>
        <h2 style={h2Style}>Konut Tasarruf Sistemi vs Banka Kredisi</h2>
        <p style={pStyle}>
          Konut almak isteyenler genellikle iki seçenekle karşı karşıyadır: Eminevim,
          Fuzul Ev, Birevim gibi konut tasarruf sistemleri veya banka konut kredisi.
          Banka kredisinde faiz oranı açıkça belirtilir ve toplam maliyet kolayca
          hesaplanabilir. Konut tasarruf sistemlerinde ise "sıfır faiz" iddiası nedeniyle
          gerçek maliyet ilk bakışta görünmez.
        </p>
        <p style={pStyle}>
          Gerçek bir karşılaştırma yapabilmek için her iki seçeneğin de aynı koşullar altında
          değerlendirilmesi gerekir. Reel Finans, peşinat oranı, hizmet bedeli, taksit sayısı,
          teslim ayı ve enflasyon beklentisini dikkate alarak Eminevim, Fuzul, Birevim,
          Katılımevim, Sinpaş, İmece, Adil veya Albayrak gibi herhangi bir konut tasarruf
          sistemini banka kredisiyle yan yana karşılaştırmanızı sağlar.
        </p>
      </section>

      {/* C. Hesaplama Yöntemi */}
      <section style={sectionStyle}>
        <h2 style={h2Style}>Hesaplama Yöntemi</h2>
        <p style={pStyle}>
          Bu araç, konut taksit hesaplama işlemini iki temel finansal yöntemle gerçekleştirir.
          İlk olarak, <strong style={{ color: "#e2e8f0" }}>IRR (Internal Rate of Return — İç Verim Oranı)</strong> yöntemiyle
          tüm nakit akışları (peşinat, hizmet bedeli, aylık taksitler ve teslim tarihindeki
          ödeme) analiz edilerek gerçek aylık ve yıllık faiz oranı hesaplanır.
        </p>
        <p style={pStyle}>
          İkinci olarak, <strong style={{ color: "#e2e8f0" }}>Fisher denklemi</strong> kullanılarak
          enflasyonun etkisi ayrıştırılır. Nominal faiz oranından enflasyon çıkarılarak
          reel faiz oranı bulunur. Böylece "sıfır faizli" taksit sistemlerinin enflasyon
          sonrası gerçek maliyeti ve reel faiz oranı ortaya konur.
        </p>
      </section>

      {/* D. Sıkça Sorulan Sorular */}
      <section style={sectionStyle}>
        <h2 style={h2Style}>Sıkça Sorulan Sorular</h2>

        <details style={detailsStyle}>
          <summary style={summaryStyle}>Eminevim gerçek maliyeti nasıl hesaplanır?</summary>
          <p style={answerStyle}>
            Eminevim'in gerçek maliyeti, IRR (İç Verim Oranı) yöntemiyle hesaplanır.
            Peşinat, hizmet bedeli, taksit tutarları ve teslim tarihi dikkate alınarak
            nakit akışları analiz edilir. Bu yöntem, "sıfır faiz" iddiasının arkasındaki
            gerçek finansman maliyetini ortaya koyar.
          </p>
        </details>

        <details style={detailsStyle}>
          <summary style={summaryStyle}>Sıfır faizli taksit gerçekten sıfır faiz mi?</summary>
          <p style={answerStyle}>
            Hayır. "Sıfır faiz" ifadesi yanıltıcıdır. Hizmet bedeli, geç teslim ve
            enflasyon etkisi hesaba katıldığında, Eminevim, Fuzul Ev, Birevim ve benzeri
            sistemlerin gerçek maliyeti banka kredisi faiz oranlarına yaklaşabilir veya
            geçebilir.
          </p>
        </details>

        <details style={detailsStyle}>
          <summary style={summaryStyle}>Hizmet bedeli nedir ve ne kadardır?</summary>
          <p style={answerStyle}>
            Hizmet bedeli, Eminevim, Fuzul Ev, Birevim, Katılımevim gibi şirketlerin
            organizasyon ücreti olarak aldığı tutardır. Genellikle toplam tutarın
            %3-6'sı arasında değişir ve peşin olarak tahsil edilir. Bu bedel, gerçek
            finansman maliyetinin önemli bir bileşenidir.
          </p>
        </details>

        <details style={detailsStyle}>
          <summary style={summaryStyle}>Teslim tarihi maliyeti nasıl etkiler?</summary>
          <p style={answerStyle}>
            Satıcıya ödeme ne kadar geç yapılırsa, enflasyon nedeniyle paranın reel
            değeri o kadar düşer. Erken teslim daha düşük reel maliyet anlamına gelir.
            Teslim ayı parametresini değiştirerek bu etkiyi hesaplayıcıda görebilirsiniz.
          </p>
        </details>

        <details style={detailsStyle}>
          <summary style={summaryStyle}>Banka kredisi mi yoksa konut tasarruf sistemi mi daha ucuz?</summary>
          <p style={answerStyle}>
            Bu, birçok faktöre bağlıdır: banka faiz oranı, hizmet bedeli oranı, teslim
            tarihi ve enflasyon beklentisi. Eminevim, Fuzul Ev, Birevim, Sinpaş veya
            diğer sistemlerin hangisinin daha avantajlı olduğunu kendi koşullarınıza göre
            bu hesaplayıcı ile karşılaştırabilirsiniz.
          </p>
        </details>

        <details style={detailsStyle}>
          <summary style={summaryStyle}>Konut tasarruf sistemi nasıl çalışır?</summary>
          <p style={answerStyle}>
            Konut tasarruf sisteminde katılımcılar düzenli taksit öder. Belirli bir süre
            sonra (teslim ayı) konut bedeli satıcıya ödenir. Kalan taksitler ödemeye devam
            edilir. Eminevim, Fuzul, Birevim, Katılımevim, Sinpaş, İmece, Emlak Katılım,
            Adil ve Albayrak bu modelle faaliyet gösteren başlıca şirketlerdir.
          </p>
        </details>

        <details style={detailsStyle}>
          <summary style={summaryStyle}>Farklı konut finans şirketleri arasında fark var mı?</summary>
          <p style={answerStyle}>
            Eminevim, Fuzul Ev, Birevim, Katılımevim, Sinpaş, İmece, Emlak Katılım, Adil
            ve Albayrak benzer konut tasarruf modeli ile çalışsa da hizmet bedeli oranları,
            teslim süreleri ve taksit yapıları farklılık gösterebilir. Bu hesaplayıcı ile
            parametreleri ayarlayarak her birinin gerçek maliyetini analiz edebilirsiniz.
          </p>
        </details>
      </section>
    </div>
  );
}
