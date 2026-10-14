# Локализации листинга в App Store Connect

Польский лежит в `app-store-pl.md`. Здесь остальные шесть — те же языки, что
в интерфейсе приложения.

## Зачем это нужно именно здесь

Язык карточки App Store выбирается **по языку телефона, а не по стране
магазина**. Украинец в Польше с украинским айфоном увидит украинскую
локализацию, если она есть, и польскую, если нет. Аудитория приложения — люди
в Польше, которые по-польски читают плохо, то есть ровно те, кому польская
карточка и не поможет.

Второе: **поле ключевых слов своё у каждой локализации**. Сто знаков на язык,
а не сто на всех. Для приложения, которое ищут словами «права», «іспит»,
«ehliyet», это и есть основной канал.

## В каком порядке добавлять

| Язык | Код в ASC | Приоритет |
|---|---|---|
| Польский | Polish | основной, уже есть |
| Украинский | Ukrainian | **первым**: крупнейшая группа сдающих не по-польски |
| Русский | Russian | **вторым** |
| Английский | English (U.K.) | третьим: запасной для всех прочих языков и для ревьюера |
| Немецкий | German | потом |
| Испанский | Spanish (Spain) | потом |
| Турецкий | Turkish | потом |

Локализацию можно добавить в любой следующей версии, а промотекст и ключевые
слова меняются вообще без ревью. Так что если времени мало — украинский,
русский, английский сейчас, остальные после релиза.

**Скриншоты по локализациям не обязательны.** Локализация без своих скриншотов
берёт их у основного языка. Для первого релиза этого достаточно: на скриншотах
видно интерфейс, а не текст карточки.

**Проверь основной язык приложения** (Общая информация → Основной язык). Он и
есть запасной для всех магазинов, где своей локализации нет.

---

# Украинский

**Подзаголовок** (19/30)

```
Тести WORD 7 мовами
```

**Промотекст** (121/170)

```
Офіційні питання з бази міністерства, переклад під кожним питанням і пробний іспит як у WORD. Без акаунта, працює офлайн.
```

**Ключові слова** (87/100)

```
права,іспит,теорія,категорія B,питання,Польща,ПДР,українською,переклад,водій,курси,2026
```

**Опис**

```
RoadReady PL — застосунок для підготовки до теоретичного іспиту на право керування в Польщі. Усі питання взято з офіційної бази питань Міністерства інфраструктури — тієї самої, якою користується WORD.

НАВЧАННЯ ТВОЄЮ МОВОЮ
Під кожним питанням можна увімкнути переклад: українська, російська, англійська, іспанська, німецька, турецька. Інтерфейс застосунку теж перекладено. Іспит складають польською, тому польське формулювання завжди залишається зверху, а переклад під ним — щоб допомогти зрозуміти, а не замінити.

КОРОТКІ УРОКИ
Матеріал поділено на розділи та уроки по 10 питань. Після кожної відповіді одразу видно пояснення: чому правильна відповідь саме така.

ПРОБНИЙ ІСПИТ
Проходить точно як у WORD: 32 питання, 25 хвилин, 68 із 74 балів, без можливості повернутися до попереднього питання. Базові питання з часом на прочитання та відповіддю ТАК/НІ, спеціальні — з трьома варіантами.

ПОМИЛКИ ПОВЕРТАЮТЬСЯ
Питання, у якому ти помилився, повертається на повторення і зникає зі списку лише тоді, коли відповіси на нього правильно двічі поспіль.

ОЗВУЧЕННЯ
Кожне питання можна прослухати польською — стане в пригоді, коли читати повільніше, ніж слухати.

БЕЗ АКАУНТА, ОФЛАЙН
Не треба реєструватися і вказувати пошту. Прогрес залишається на телефоні. Після завантаження матеріалів застосунок працює без інтернету.

ЩО БЕЗКОШТОВНО
Уроки без обмежень, усі переклади, пояснення, озвучення та офлайн-режим безкоштовні. RoadReady Pro додає пробний іспит і роботу над помилками.

ROADREADY PRO
Підписка на місяць або на рік. Оплата списується з акаунта App Store після підтвердження покупки. Підписка поновлюється автоматично, якщо не вимкнути поновлення щонайменше за 24 години до кінця поточного періоду. Керувати підпискою можна в налаштуваннях акаунта App Store.

Умови: https://pmoffice.space/roadready-pl-terms.html
Політика конфіденційності: https://pmoffice.space/roadready-pl-privacy.html

RoadReady PL — незалежний навчальний застосунок. Він не пов'язаний з Міністерством інфраструктури, воєводськими центрами дорожнього руху (WORD) чи будь-яким державним органом. Переклади та пояснення — наша власна робота.
```

**Що нового**

```
Перший випуск RoadReady PL.

Офіційна база питань, переклади шістьма мовами, пояснення до кожного питання, озвучення, пробний іспит у форматі WORD і робота над помилками.
```

---

# Русский

**Подзаголовок** (22/30)

```
Тесты WORD на 7 языках
```

**Промотекст** (130/170)

```
Официальные вопросы из базы министерства, перевод под каждым вопросом и пробный экзамен как в WORD. Без аккаунта, работает офлайн.
```

**Ключевые слова** (90/100)

```
права,экзамен,теория,категория B,вопросы,Польша,ПДД,на русском,перевод,водитель,курсы,2026
```

**Описание**

```
RoadReady PL — приложение для подготовки к теоретическому экзамену на водительские права в Польше. Все вопросы взяты из официальной базы вопросов Министерства инфраструктуры — той самой, которой пользуется WORD.

УЧЁБА НА ТВОЁМ ЯЗЫКЕ
Под каждым вопросом можно включить перевод: украинский, русский, английский, испанский, немецкий, турецкий. Интерфейс приложения тоже переведён. Экзамен сдают по-польски, поэтому польская формулировка всегда остаётся сверху, а перевод под ней — чтобы помочь понять, а не заменить.

КОРОТКИЕ УРОКИ
Материал разделён на разделы и уроки по 10 вопросов. После каждого ответа сразу видно объяснение: почему верный ответ именно такой.

ПРОБНЫЙ ЭКЗАМЕН
Проходит точно как в WORD: 32 вопроса, 25 минут, 68 из 74 баллов, без возможности вернуться к предыдущему вопросу. Базовые вопросы с временем на прочтение и ответом ДА/НЕТ, специальные — с тремя вариантами.

ОШИБКИ ВОЗВРАЩАЮТСЯ
Вопрос, в котором ты ошибся, возвращается на повторение и уходит из списка только тогда, когда ответишь на него верно два раза подряд.

ОЗВУЧКА
Каждый вопрос можно прослушать по-польски — пригодится, когда читать медленнее, чем слушать.

БЕЗ АККАУНТА, ОФЛАЙН
Не нужно регистрироваться и указывать почту. Прогресс остаётся на телефоне. После загрузки материалов приложение работает без интернета.

ЧТО БЕСПЛАТНО
Уроки без ограничений, все переводы, объяснения, озвучка и офлайн-режим бесплатны. RoadReady Pro добавляет пробный экзамен и работу над ошибками.

ROADREADY PRO
Подписка на месяц или на год. Оплата списывается с аккаунта App Store после подтверждения покупки. Подписка продлевается автоматически, если не отключить продление минимум за 24 часа до конца текущего периода. Управлять подпиской можно в настройках аккаунта App Store.

Условия: https://pmoffice.space/roadready-pl-terms.html
Политика конфиденциальности: https://pmoffice.space/roadready-pl-privacy.html

RoadReady PL — независимое учебное приложение. Оно не связано с Министерством инфраструктуры, воеводскими центрами дорожного движения (WORD) или каким-либо государственным органом. Переводы и объяснения — наша собственная работа.
```

**Что нового**

```
Первый выпуск RoadReady PL.

Официальная база вопросов, переводы на шесть языков, объяснения к каждому вопросу, озвучка, пробный экзамен в формате WORD и работа над ошибками.
```

---

# Английский (U.K.)

**Subtitle** (25/30)

```
WORD tests in 7 languages
```

**Promotional text** (141/170)

```
Official questions from the ministry's bank, a translation under every question and a mock exam exactly like WORD. No account, works offline.
```

**Keywords** (89/100)

```
driving,licence,theory,test,Poland,category B,questions,translation,exam,WORD,course,2026
```

**Description**

```
RoadReady PL prepares you for the theory part of the Polish state driving examination. Every question comes from the official bank of questions published by the Ministry of Infrastructure — the same one WORD uses.

STUDY IN YOUR OWN LANGUAGE
A translation can be shown under every question: Ukrainian, Russian, English, Spanish, German, Turkish. The app's own interface is translated too. The exam is sat in Polish, so the Polish wording always stays on top and the translation sits beneath it — there to help you understand, not to replace it.

SHORT LESSONS
The material is split into sections and lessons of 10 questions. After every answer you see the explanation straight away: why the correct answer is the one it is.

MOCK EXAM
It runs exactly as WORD does: 32 questions, 25 minutes, 68 of 74 points, and no going back to a previous question. Basic questions give you reading time and a YES/NO answer, specialist ones have three options.

MISTAKES COME BACK
A question you get wrong returns for review, and leaves the list only once you have answered it correctly twice in a row.

TEXT-TO-SPEECH
Every question can be read aloud in Polish — useful when listening is faster than reading.

NO ACCOUNT, OFFLINE
No sign-up and no email address. Your progress stays on the phone. Once the material is downloaded the app works without a connection.

WHAT IS FREE
Unlimited lessons, all translations, explanations, text-to-speech and offline mode are free. RoadReady Pro adds the mock exam and weak-spot practice.

ROADREADY PRO
A monthly or yearly subscription. Payment is charged to your App Store account on confirmation of purchase. The subscription renews automatically unless auto-renewal is turned off at least 24 hours before the end of the current period. You manage it in your App Store account settings.

Terms of Use: https://pmoffice.space/roadready-pl-terms.html
Privacy Policy: https://pmoffice.space/roadready-pl-privacy.html

RoadReady PL is an independent study app. It is not affiliated with the Ministry of Infrastructure, the Voivodeship Road Traffic Centres (WORD) or any government body. The translations and explanations are our own work.
```

**What's New**

```
The first release of RoadReady PL.

The official question bank, translations into six languages, an explanation for every question, text-to-speech, a WORD-style mock exam and weak-spot practice.
```

---

# Немецкий

**Untertitel** (24/30)

```
WORD-Tests in 7 Sprachen
```

**Werbetext** (149/170)

```
Offizielle Fragen aus dem Katalog des Ministeriums, eine Übersetzung unter jeder Frage und eine Prüfungssimulation wie bei WORD. Ohne Konto, offline.
```

**Schlüsselwörter** (86/100)

```
Führerschein,Theorie,Prüfung,Polen,Klasse B,Fragen,Übersetzung,Fahrschule,Verkehr,2026
```

**Beschreibung**

```
RoadReady PL bereitet auf den theoretischen Teil der staatlichen Fahrprüfung in Polen vor. Alle Fragen stammen aus dem offiziellen Fragenkatalog des Infrastrukturministeriums — demselben, den WORD verwendet.

LERNEN IN DEINER SPRACHE
Unter jeder Frage lässt sich eine Übersetzung einblenden: Ukrainisch, Russisch, Englisch, Spanisch, Deutsch, Türkisch. Auch die Oberfläche der App ist übersetzt. Die Prüfung wird auf Polnisch abgelegt, deshalb steht der polnische Wortlaut immer oben und die Übersetzung darunter — als Verständnishilfe, nicht als Ersatz.

KURZE LEKTIONEN
Der Stoff ist in Abschnitte und Lektionen zu je 10 Fragen gegliedert. Nach jeder Antwort siehst du sofort die Erklärung: warum die richtige Antwort die richtige ist.

PRÜFUNGSSIMULATION
Sie läuft genau wie bei WORD: 32 Fragen, 25 Minuten, 68 von 74 Punkten, ohne Rückkehr zu einer vorherigen Frage. Grundfragen mit Lesezeit und JA/NEIN-Antwort, Fachfragen mit drei Optionen.

FEHLER KOMMEN WIEDER
Eine Frage, bei der du dich geirrt hast, kehrt zur Wiederholung zurück und verschwindet erst dann aus der Liste, wenn du sie zweimal hintereinander richtig beantwortest.

VORLESEFUNKTION
Jede Frage lässt sich auf Polnisch vorlesen — hilfreich, wenn Zuhören schneller geht als Lesen.

OHNE KONTO, OFFLINE
Keine Registrierung, keine E-Mail-Adresse. Dein Fortschritt bleibt auf dem Telefon. Nach dem Laden der Materialien funktioniert die App ohne Internet.

WAS KOSTENLOS IST
Unbegrenzte Lektionen, alle Übersetzungen, Erklärungen, Vorlesefunktion und Offline-Modus sind kostenlos. RoadReady Pro ergänzt die Prüfungssimulation und die Arbeit an Fehlern.

ROADREADY PRO
Ein Monats- oder Jahresabo. Die Zahlung wird nach Bestätigung des Kaufs über dein App-Store-Konto abgerechnet. Das Abo verlängert sich automatisch, sofern die automatische Verlängerung nicht mindestens 24 Stunden vor Ende des laufenden Zeitraums deaktiviert wird. Verwalten kannst du es in den Einstellungen deines App-Store-Kontos.

Nutzungsbedingungen: https://pmoffice.space/roadready-pl-terms.html
Datenschutzerklärung: https://pmoffice.space/roadready-pl-privacy.html

RoadReady PL ist eine unabhängige Lern-App. Sie steht in keiner Verbindung zum Infrastrukturministerium, zu den Woiwodschaftszentren für Straßenverkehr (WORD) oder zu einer Behörde. Die Übersetzungen und Erklärungen sind unsere eigene Arbeit.
```

**Neue Funktionen**

```
Die erste Version von RoadReady PL.

Der offizielle Fragenkatalog, Übersetzungen in sechs Sprachen, eine Erklärung zu jeder Frage, Vorlesefunktion, eine Prüfungssimulation im WORD-Format und die Arbeit an Fehlern.
```

---

# Испанский

**Subtítulo** (22/30)

```
Test WORD en 7 idiomas
```

**Texto promocional** (149/170)

```
Preguntas oficiales del banco del ministerio, una traducción bajo cada pregunta y un simulacro igual que en WORD. Sin cuenta y funciona sin conexión.
```

**Palabras clave** (84/100)

```
carnet,conducir,teórico,examen,Polonia,clase B,preguntas,traducción,autoescuela,2026
```

**Descripción**

```
RoadReady PL te prepara para la parte teórica del examen estatal de conducir en Polonia. Todas las preguntas proceden del banco oficial de preguntas del Ministerio de Infraestructuras, el mismo que utiliza WORD.

ESTUDIA EN TU IDIOMA
Bajo cada pregunta puedes activar una traducción: ucraniano, ruso, inglés, español, alemán, turco. La interfaz de la aplicación también está traducida. El examen se hace en polaco, así que el enunciado polaco siempre queda arriba y la traducción debajo: está para ayudarte a entender, no para sustituirlo.

LECCIONES CORTAS
El material está dividido en secciones y lecciones de 10 preguntas. Después de cada respuesta ves la explicación al momento: por qué la respuesta correcta es esa.

SIMULACRO DE EXAMEN
Funciona exactamente como en WORD: 32 preguntas, 25 minutos, 68 de 74 puntos y sin volver atrás. Las preguntas básicas dan tiempo de lectura y se responden SÍ/NO; las especializadas tienen tres opciones.

LOS FALLOS VUELVEN
Una pregunta que fallas vuelve para repasarla y solo sale de la lista cuando la aciertas dos veces seguidas.

LECTURA EN VOZ ALTA
Cada pregunta se puede escuchar en polaco, útil cuando escuchar va más rápido que leer.

SIN CUENTA, SIN CONEXIÓN
No hay registro ni correo electrónico. Tu progreso se queda en el teléfono. Una vez descargado el material, la aplicación funciona sin conexión.

QUÉ ES GRATIS
Lecciones ilimitadas, todas las traducciones, las explicaciones, la lectura en voz alta y el modo sin conexión son gratis. RoadReady Pro añade el simulacro de examen y la práctica de fallos.

ROADREADY PRO
Suscripción mensual o anual. El cargo se realiza en tu cuenta de App Store al confirmar la compra. La suscripción se renueva automáticamente salvo que desactives la renovación al menos 24 horas antes de que termine el periodo en curso. Puedes gestionarla en los ajustes de tu cuenta de App Store.

Términos de uso: https://pmoffice.space/roadready-pl-terms.html
Política de privacidad: https://pmoffice.space/roadready-pl-privacy.html

RoadReady PL es una aplicación de estudio independiente. No está afiliada al Ministerio de Infraestructuras, a los Centros Regionales de Tráfico (WORD) ni a ningún organismo público. Las traducciones y las explicaciones son obra nuestra.
```

**Novedades**

```
Primera versión de RoadReady PL.

El banco oficial de preguntas, traducciones a seis idiomas, una explicación para cada pregunta, lectura en voz alta, un simulacro con el formato de WORD y práctica de fallos.
```

---

# Турецкий

**Alt başlık** (21/30)

```
7 dilde WORD testleri
```

**Tanıtım metni** (140/170)

```
Bakanlık soru bankasından resmî sorular, her sorunun altında çeviri ve WORD'deki gibi bir deneme sınavı. Hesap gerekmez, çevrimdışı çalışır.
```

**Anahtar kelimeler** (76/100)

```
ehliyet,teori,sınav,Polonya,B sınıfı,sorular,çeviri,sürücü kursu,trafik,2026
```

**Açıklama**

```
RoadReady PL, Polonya'daki devlet sürücü sınavının teori bölümüne hazırlar. Tüm sorular Altyapı Bakanlığı'nın resmî soru bankasından alınmıştır — WORD'ün kullandığı bankanın aynısı.

KENDİ DİLİNDE ÇALIŞ
Her sorunun altında çeviriyi açabilirsin: Ukraynaca, Rusça, İngilizce, İspanyolca, Almanca, Türkçe. Uygulamanın arayüzü de çevrilmiştir. Sınav Lehçe yapılır, bu yüzden Lehçe metin her zaman üstte kalır, çeviri ise altında durur: anlamana yardım etmek için, yerine geçmek için değil.

KISA DERSLER
İçerik bölümlere ve 10 soruluk derslere ayrılmıştır. Her cevaptan sonra açıklamayı hemen görürsün: doğru cevabın neden o olduğunu.

DENEME SINAVI
Tam WORD'deki gibi ilerler: 32 soru, 25 dakika, 74 puanın 68'i ve önceki soruya dönüş yok. Temel sorularda okuma süresi ve EVET/HAYIR cevabı, uzmanlık sorularında üç seçenek vardır.

HATALAR GERİ GELİR
Yanlış yaptığın soru tekrara döner ve listeden ancak üst üste iki kez doğru cevapladığında çıkar.

SESLİ OKUMA
Her soruyu Lehçe dinleyebilirsin — dinlemek okumaktan hızlı geldiğinde işe yarar.

HESAP YOK, ÇEVRİMDIŞI
Kayıt olmak ve e-posta vermek gerekmez. İlerlemen telefonda kalır. Materyaller indirildikten sonra uygulama internetsiz çalışır.

NELER ÜCRETSİZ
Sınırsız ders, tüm çeviriler, açıklamalar, sesli okuma ve çevrimdışı mod ücretsizdir. RoadReady Pro deneme sınavını ve hata çalışmasını ekler.

ROADREADY PRO
Aylık veya yıllık abonelik. Ödeme, satın alma onaylandığında App Store hesabından tahsil edilir. Mevcut dönem bitmeden en az 24 saat önce otomatik yenileme kapatılmazsa abonelik kendiliğinden yenilenir. Aboneliği App Store hesap ayarlarından yönetirsin.

Kullanım koşulları: https://pmoffice.space/roadready-pl-terms.html
Gizlilik politikası: https://pmoffice.space/roadready-pl-privacy.html

RoadReady PL bağımsız bir çalışma uygulamasıdır. Altyapı Bakanlığı, Voyvodalık Karayolu Trafik Merkezleri (WORD) veya herhangi bir resmî kurumla bağlantısı yoktur. Çeviriler ve açıklamalar bize aittir.
```

**Yenilikler**

```
RoadReady PL'in ilk sürümü.

Resmî soru bankası, altı dile çeviri, her soru için açıklama, sesli okuma, WORD formatında deneme sınavı ve hata çalışması.
```

---

# Локализация подписок

Польский и английский лежат в `app-store-pl.md`. Остальные — здесь. Это то,
что человек видит в системном окне покупки, поэтому стоит добавить хотя бы
украинский и русский.

### `com.astonio.roadreadypl.pro.monthly`

Украинский:

```
RoadReady Pro — місяць
Пробний іспит у форматі WORD і робота над помилками. Поновлюється щомісяця, скасувати можна будь-коли.
```

Русский:

```
RoadReady Pro — месяц
Пробный экзамен в формате WORD и работа над ошибками. Продлевается ежемесячно, отменить можно в любой момент.
```

Немецкий:

```
RoadReady Pro — Monat
Prüfungssimulation im WORD-Format und Arbeit an Fehlern. Verlängert sich monatlich, jederzeit kündbar.
```

Испанский:

```
RoadReady Pro — mes
Simulacro con el formato de WORD y práctica de fallos. Se renueva cada mes, puedes cancelar cuando quieras.
```

Турецкий:

```
RoadReady Pro — ay
WORD formatında deneme sınavı ve hata çalışması. Her ay yenilenir, istediğin zaman iptal edebilirsin.
```

### `com.astonio.roadreadypl.pro.yearly`

Украинский:

```
RoadReady Pro — рік
Пробний іспит у форматі WORD і робота над помилками цілий рік, дешевше за дванадцять місяців окремо.
```

Русский:

```
RoadReady Pro — год
Пробный экзамен в формате WORD и работа над ошибками целый год, дешевле двенадцати месяцев по отдельности.
```

Немецкий:

```
RoadReady Pro — Jahr
Prüfungssimulation im WORD-Format und Arbeit an Fehlern ein Jahr lang, günstiger als zwölf Monate einzeln.
```

Испанский:

```
RoadReady Pro — año
Simulacro con el formato de WORD y práctica de fallos durante un año, más barato que doce meses por separado.
```

Турецкий:

```
RoadReady Pro — yıl
Bir yıl boyunca WORD formatında deneme sınavı ve hata çalışması, on iki ayı ayrı almaktan ucuz.
```

---

## Что держать одинаковым во всех локализациях

Эти утверждения ревьюер сверяет с приложением, и разойтись им нельзя:

- **что бесплатно** — уроки, все переводы, объяснения, озвучка, офлайн;
- **что в Pro** — только пробный экзамен и работа над ошибками;
- **параметры экзамена** — 32 вопроса, 25 минут, 68 из 74, в одну сторону;
- **отсутствие аккаунта** — ни регистрации, ни почты, прогресс на устройстве;
- **непричастность к WORD и министерству**.

Если модель монетизации поменяется, переписывать придётся все семь.
