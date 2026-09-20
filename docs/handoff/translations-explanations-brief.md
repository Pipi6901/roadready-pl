# RoadReady PL — задание: переводы ES/TR и объяснения к вопросам (6 языков)

Документ из двух частей:

- **Часть A — для владельца проекта**: какие доступы выдать исполнителю (чек-лист).
- **Часть B — для исполнителя (человека или ИИ-ассистента)**: самодостаточное задание — можно целиком вставить как промт в Claude Code / другой агент, работающий в терминале на машине исполнителя.

---

## Часть A. Что выдать исполнителю (владелец)

Секретов в этом файле нет намеренно. Передавайте их отдельным защищённым каналом (менеджер паролей, одноразовая ссылка), не почтой и не в чате.

| # | Доступ | Как выдать | Зачем |
|---|--------|-----------|-------|
| 1 | GitHub `Pipi6901/roadready-pl` (мобильное приложение, ветка `master`) | Settings → Collaborators → Write | контент, переводы, объяснения, скрипты импорта |
| 2 | GitHub `Pipi6901/roadready-pl-admin` (админка + Cloud Functions, ветка `main`) | то же | `seed.js`, `publish.js`, `translate-questions.js` |
| 3 | Firebase-проект `roadready-pl` | Firebase Console → Project settings → Users and permissions → добавить Google-аккаунт исполнителя с ролью **Editor** (или Owner, если нужен деплой функций) | Firestore, Hosting, просмотр логов |
| 4 | Ключ сервисного аккаунта `firebase-adminsdk-fbsvc@roadready-pl.iam.gserviceaccount.com` | Firebase Console → Project settings → Service accounts → **Generate new private key** → отдать JSON защищённым каналом. Исполнитель сохраняет его как `roadready-admin-pl/serviceAccountKey.json` (файл в `.gitignore`). **После окончания работ ключ удалить** (Google Cloud Console → IAM → Service accounts → Keys). Текущий ключ на машине владельца лучше тоже перевыпустить — он ранее попадал в переписку. | `seed.js`, `publish.js`, `verify-media.js` |
| 5 | Каталог вопросов `KATALOG_dla_kandydatow_na_kierowcow_072026_ES_TR_wyjasnienia.xlsx` | у владельца: `D:\стажа\media\source\`. Официальный источник: https://www.gov.pl/web/infrastruktura/prawo-jazdy («Baza pytań egzaminacyjnych»). В git его нет. | `import_katalog.py` собирает из него `content.json` |
| 6 | (опционально) Anthropic API key | https://console.anthropic.com → API keys | автоматизированный перевод/генерация объяснений через `translate-questions.js`; без ключа всё делается вручную чанками, как делались RU/UK |
| 7 | Медиа-архивы **не нужны** | — | медиа уже загружены в Storage и привязаны к вопросам |

Аккаунт Firebase CLI (`maifidarsi@gmail.com`) передавать **не надо** — исполнитель логинится под своим аккаунтом (`firebase login`), добавленным в проект по п. 3. Firebase CLI нужен только если придётся деплоить функции; для переводов и объяснений он не требуется.

Что уже сделано (чтобы не переделывать): PL 3518 (оригинал), EN/DE/UK 3518, RU 3518 — всё опубликовано; медиа привязаны и проверены. Объяснений нет ни на одном языке (0 из 3518).

---

## Часть B. Задание для исполнителя (самодостаточный промт)

> Скопируйте всё ниже этой строки как одно задание.

### Контекст

Ты работаешь над **RoadReady PL** — мобильным приложением для подготовки к польскому экзамену по ПДД (теория, prawo jazdy). База — официальный каталог вопросов Министерства инфраструктуры Польши: **3518 вопросов**, 23 темы, категории AM/A1/A2/A/B1/B/C1/C/D1/D/T/PT. Приложение показывает вопрос на польском + перевод на язык пользователя. Языки приложения: `pl` (оригинал), `en`, `de`, `uk`, `ru`, `es`, `tr`.

Два репозитория (клонируй оба рядом, в одну папку — скрипты админки ищут мобильный репо по относительному пути `../roadready-pl`):

- `roadready-pl` — Expo/React Native приложение + контент и скрипты сборки контента (Python). Ветка `master`.
- `roadready-admin-pl` — админка (Next.js) + Firebase Cloud Functions + Node-скрипты заливки/публикации. Ветка `main`.

Backend: Firebase-проект `roadready-pl` — Firestore (`europe-central2`), Storage (медиа), Hosting (`https://roadready-pl.web.app/content.json` — то, что скачивает приложение), Cloud Function `publishTestSet` (`us-central1`).

Ключ сервисного аккаунта тебе выдан отдельно — положи его в `roadready-admin-pl/serviceAccountKey.json` (он в `.gitignore`; **никогда не коммить и не вставлять в переписку**).

### Задача (три части, в этом порядке)

1. **Перевести все 3518 вопросов на испанский** (`es`). Сейчас 0.
2. **Перевести все 3518 вопросов на турецкий** (`tr`). Сейчас 0.
3. **Написать объяснения** к каждому из 3518 вопросов — почему правильный ответ именно такой, со ссылкой на официальный нормативный акт — сначала **на польском** (`pl`, базовый текст), затем перевести на **en, de, uk, ru, es, tr**. Сейчас объяснений нет ни на одном языке.

После каждой законченной части (и периодически внутри, раз в 3–5 чанков) — импорт → seed → publish → проверка live-файла → коммит (см. «Публикация»).

### Установка

```bash
# roadready-pl
cd roadready-pl
pip install openpyxl                # для import_katalog.py (Python 3.10+)
npm install                         # не обязательно для контента, нужно только для запуска приложения

# roadready-admin-pl
cd ../roadready-admin-pl
npm install
# положить serviceAccountKey.json в корень
```

Каталог `KATALOG_dla_kandydatow_na_kierowcow_072026_ES_TR_wyjasnienia.xlsx` (выдан отдельно) положи в любое место и передавай его путь в `import_katalog.py`. Все Python-скрипты запускай как `python -X utf8 …` (Windows: иначе ломается вывод кириллицы/польских букв).

### Как устроены данные

`roadready-pl/content/katalog/`:

- `content.json` — **генерируется** скриптом `scripts/import_katalog.py` из xlsx + файлов ниже. Руками не править. Форма вопроса:
  ```json
  { "id": "q-2374", "topicId": "piesi-rowerzysci", "type": "single",
    "text": "Czy w tej sytuacji masz obowiązek ustąpić pierwszeństwa pieszym?",
    "options": [{"id":"T","text":"Tak"},{"id":"N","text":"Nie"}],
    "correctOptionId": "T", "explanation": "", "category": "basic", "points": 3,
    "licences": ["B","A", "..."], "mediaId": "...", "sourceMedia": "...", "sourceRef": "..." }
  ```
  У специализированных вопросов (`category: "specialist"`) варианты `A/B/C`. У базовых (`basic`) — `T/N` (Tak/Nie).
  `translations[lang][id] = { "text": "...", "options": {"A": "...", ...}, "explanation": "" }`.
- `translations/{lang}/NNN.json` — **рукописные чанки переводов** (мой способ для UK/RU, ~150 вопросов в файле). Компактный формат:
  ```json
  {
    "q-2374": "¿Está usted obligado en esta situación a ceder el paso a los peatones?",
    "q-3625": ["Texto de la pregunta", "opción A", "opción B", "opción C"]
  }
  ```
  строка — для вопроса Tak/Nie (варианты «Sí/No», «Evet/Hayır» подставляются автоматически), массив `[текст, A, B, C]` — для specialist. Порядок A/B/C — как в польском оригинале. Официальный перевод (EN/DE/UK из xlsx) всегда имеет приоритет над чанком.
- `translations/{lang}.json` — то же в подробной форме `{ "q-1": {"text": "...", "options": {...}} }`; сюда пишет автоматический `translate-questions.js`.
- `explanations/{lang}/NNN.json` (или `explanations/{lang}.json`) — **объяснения**: `{ "q-2374": "текст объяснения" }`. `pl` заполняет поле `explanation` самого вопроса; любой другой язык — `explanation` в переводе этого языка (перевод должен уже существовать, иначе запись пропускается с предупреждением).

Приложение показывает объяснение в карточке ответа, если оно непустое (`src/components/learning/FeedbackSheet.tsx`): польский текст + перевод на язык пользователя.

### Рабочие команды

```bash
cd roadready-pl

# что ещё не переведено (TSV: id, класс b/s, польский текст, [A, B, C]); сначала вопросы категории B
python -X utf8 scripts/katalog_next.py es 150
python -X utf8 scripts/katalog_next.py tr 150 --offset 150

# что ещё без объяснения (TSV: id, класс, правильный ответ T/N|A/B/C, польский текст, варианты,
# и — для не-pl — уже существующий перевод текста и вариантов на этот язык)
python -X utf8 scripts/katalog_next.py pl 150 --expl
python -X utf8 scripts/katalog_next.py es 150 --expl

# пересобрать content.json (мерж переводов и объяснений; печатает счётчики по языкам)
python -X utf8 scripts/import_katalog.py "<путь>/KATALOG_dla_kandydatow_na_kierowcow_072026_ES_TR_wyjasnienia.xlsx"
```

Валидация чанка перед коммитом (обязательна — один битый JSON ломает импорт):

```bash
python -X utf8 -c "import json,sys;d=json.load(open(sys.argv[1],encoding='utf-8'));print(len(d),[k for k,v in d.items() if isinstance(v,list) and len(v)!=4])" content/katalog/translations/es/001.json
```
Ожидаемо: `150 []` (число записей и пустой список массивов неправильной длины).

### Публикация

```bash
cd roadready-pl
python -X utf8 scripts/import_katalog.py "<путь к xlsx>"      # смотри строки translations:/explanations:
git add content scripts && git commit -m "content: Spanish translations chunks 001-005"

cd ../roadready-admin-pl
node scripts/seed.js          # Firestore ← ../roadready-pl/content/katalog/content.json (~1–2 мин)
node scripts/publish.js       # вызывает publishTestSet, печатает versionHash (~30–60 с)

# проверка live-файла
curl -s "https://roadready-pl.web.app/content.json?v=$(date +%s)" -o /tmp/live.json
python -X utf8 -c "import json;d=json.load(open('/tmp/live.json',encoding='utf-8'));print(d.get('versionHash'),{k:len(v) for k,v in d['translations'].items()}, sum(1 for q in d['questions'] if q['explanation']))"
```

Если `seed.js`/`publish.js` падают с ошибкой вида `invalid_grant`/`JWT … issued in the future` — на машине уходят часы; синхронизируй системное время. `publish.js` использует uid первого админа по умолчанию; свой можно передать через `PUBLISH_UID=…`. Публикация ставит новую версию контента, приложение подхватывает её при следующем запуске.

Коммить каждый чанк (или каждые 2–3) — это защищает от потери работы. Пушить в GitHub после каждого сеанса.

### Часть 1–2. Переводы: требования и глоссарий

Общие правила (так сделаны RU/UK — держи тот же стиль):

- Формальное обращение к экзаменуемому: es — **usted** (`¿Está usted obligado a…?`, `¿Tiene usted derecho a…?`, `¿Le está permitido…?`), tr — **siz** (`… zorunda mısınız?`, `… hakkınız var mı?`, `… izin verilir mi?`).
- Переводить **смысл юридической нормы**, а не слово в слово; но не добавлять и не убирать условия («w tej sytuacji», «na obszarze zabudowanym», «bez zatrzymania» и т.п. должны остаться).
- Единицы и числа как в оригинале (`0,5 m`, `50 km/h`, `3,5 t`, `0,2 ‰`).
- Стандартные обороты переводить одинаково по всему банку — от этого зависит, будет ли учащийся узнавать формулировки. Ключевые:

| Польский | Español | Türkçe |
|---|---|---|
| Czy masz obowiązek… | ¿Está usted obligado a…? | … zorunda mısınız? / … yükümlü müsünüz? |
| Czy masz prawo… / Czy wolno Ci… | ¿Tiene usted derecho a…? / ¿Le está permitido…? | … hakkınız var mı? / … izin verilir mi? |
| w tej sytuacji / w przedstawionej sytuacji | en esta situación / en la situación presentada | bu durumda / gösterilen durumda |
| ustąpić pierwszeństwa | ceder el paso | yol vermek (geçiş hakkı vermek) |
| mieć pierwszeństwo | tener prioridad (de paso) | geçiş üstünlüğüne sahip olmak |
| zachować szczególną ostrożność | extremar la precaución | özel dikkat göstermek |
| zasada ograniczonego zaufania | principio de confianza limitada | sınırlı güven ilkesi |
| włączać się do ruchu | incorporarse a la circulación | trafiğe katılmak |
| wyprzedzanie / omijanie / wymijanie | adelantar / rebasar (un obstáculo o vehículo parado) / cruzarse con | sollama / yanından geçme (duran araç/engel) / karşılaşma |
| pas ruchu / jezdnia / pobocze / chodnik | carril / calzada / arcén / acera | şerit / taşıt yolu / banket / yaya yolu (kaldırım) |
| skrzyżowanie / obszar zabudowany / strefa zamieszkania / strefa ruchu | intersección / zona urbana / zona residencial / zona de circulación | kavşak / yerleşim yeri / konut bölgesi / trafik bölgesi |
| droga z pierwszeństwem / podporządkowana | vía con prioridad / vía secundaria | anayol / tali yol |
| przejście dla pieszych / przejazd dla rowerzystów / przejazd kolejowy / przejazd tramwajowy | paso de peatones / paso para ciclistas / paso a nivel / cruce con vías de tranvía | yaya geçidi / bisiklet geçidi / hemzemin geçit / tramvay geçidi |
| pojazd uprzywilejowany | vehículo prioritario (con señales luminosas y acústicas) | geçiş üstünlüğüne sahip araç (öncelikli araç) |
| pojazd silnikowy / pojazd samochodowy / samochód osobowy / ciężarowy | vehículo de motor / vehículo automóvil / automóvil (turismo) / camión | motorlu araç / motorlu taşıt / otomobil / kamyon |
| motocykl / motorower / czterokołowiec (lekki) / ciągnik rolniczy / autobus / tramwaj | motocicleta / ciclomotor / cuatriciclo (ligero) / tractor agrícola / autobús / tranvía | motosiklet / motorlu bisiklet / (hafif) dört tekerlekli motosiklet / tarım traktörü / otobüs / tramvay |
| motorniczy / pojazd szynowy / zespół pojazdów / przyczepa / pojazd członowy / pojazd wolnobieżny / pojazd nienormatywny | conductor de tranvía / vehículo sobre raíles / conjunto de vehículos / remolque / vehículo articulado / vehículo de marcha lenta / vehículo de dimensiones o pesos no reglamentarios | vatman / raylı araç / araç kombinasyonu (katar) / römork / mafsallı araç / yavaş hareket eden araç / standart dışı araç |
| dopuszczalna masa całkowita (dmc) / rzeczywista masa całkowita / masa własna | masa máxima autorizada (MMA) / masa total real / masa en vacío | azami yüklü ağırlık / gerçek toplam ağırlık / boş ağırlık |
| światła mijania / drogowe / pozycyjne / przeciwmgłowe / do jazdy dziennej / awaryjne | luces de cruce / de carretera / de posición / antiniebla / de circulación diurna / de emergencia | kısa huzmeli farlar / uzun huzmeli farlar / park lambaları / sis lambaları / gündüz farları / dörtlü flaşör |
| sygnał dźwiękowy / kierunkowskaz | señal acústica (bocina) / intermitente | korna (sesli uyarı) / sinyal lambası |
| linia bezwzględnego zatrzymania (stop) / warunkowego zatrzymania | línea de detención (stop) / línea de detención condicional | dur çizgisi / koşullu duruş çizgisi |
| znak ostrzegawczy / zakazu / nakazu / informacyjny / tabliczka | señal de advertencia / de prohibición / de obligación / de indicación / placa complementaria | tehlike uyarı işareti / yasak işareti / zorunluluk işareti / bilgi işareti / ek levha |
| dowód rejestracyjny / prawo jazdy / pozwolenie czasowe / ubezpieczenie OC / starosta | permiso de circulación / permiso de conducir / permiso temporal / seguro obligatorio de responsabilidad civil / starosta (autoridad del distrito) | tescil belgesi / sürücü belgesi / geçici izin belgesi / zorunlu trafik sigortası / starosta (ilçe yöneticisi) |
| autostrada / droga ekspresowa / droga dwujezdniowa / jednojezdniowa | autopista / vía rápida / vía de doble calzada / vía de calzada única | otoyol / ekspres yol / bölünmüş yol / bölünmemiş yol |
| zator drogowy („korek”) / „korytarz życia” | atasco / pasillo de emergencia | trafik sıkışıklığı / hayat koridoru (acil geçiş koridoru) |
| hulajnoga elektryczna / urządzenie transportu osobistego / urządzenie wspomagające ruch | patinete eléctrico / dispositivo de transporte personal / dispositivo de asistencia a la movilidad | elektrikli scooter / kişisel taşıma aracı / hareket destek cihazı |
| osoba niepełnosprawna / karta parkingowa | persona con discapacidad / tarjeta de estacionamiento | engelli kişi / park kartı |
| resuscytacja krążeniowo-oddechowa / pozycja boczna ustalona / opatrunek uciskowy / zespół ratownictwa medycznego | reanimación cardiopulmonar (RCP) / posición lateral de seguridad / vendaje compresivo / equipo de emergencias médicas | kalp-akciğer canlandırması (CPR) / yan yatış (derlenme) pozisyonu / basınçlı bandaj / acil sağlık ekibi |
| tachograf / wykresówka / karta kierowcy | tacógrafo / disco diagrama / tarjeta de conductor | takograf / takograf diski / sürücü kartı |
| zwrotnica / iglica / krzyżownica / pantograf / sieć trakcyjna / czuwak / nawrotnik / piasecznica / hamulec szynowy | aguja (cambio de agujas) / lengüeta / cruzamiento / pantógrafo / catenaria / pedal de hombre muerto / inversor de marcha / arenero / freno electromagnético de vía | makas / makas dili / kruvazman / pantograf / katener / uyanıklık pedalı / yön değiştirici / kum sandığı / ray freni |

Спорные термины решай один раз и придерживайся решения; при необходимости дополни таблицу в этом файле.

Порядок работы над языком: `katalog_next.py <lang> 150` → написать `translations/<lang>/NNN.json` (нумерация 001, 002, …) → валидация → коммит → следующий чанк. Список детерминирован: пока чанк не записан, команда выдаёт те же 150 вопросов. ≈24 чанка на язык.

### Часть 3. Объяснения

Цель — чтобы учащийся понял **правило**, а не запомнил ответ. Формат — один-два коротких абзаца (обычно 1–3 предложения, до ~350 знаков), структура:

1. Прямой ответ и правило: *что* требует/запрещает норма в этой ситуации.
2. Почему остальные варианты неверны (для specialist-вопросов, если не очевидно).
3. **Ссылка на источник** в скобках в конце, в единообразном формате.

Формат ссылок (сокращения одинаковые во всех языках, только текст переводится):

| Сокращение | Акт | Где смотреть |
|---|---|---|
| `PoRD art. 26 ust. 1` | Ustawa z 20.06.1997 Prawo o ruchu drogowym (Dz.U. 1997 nr 98 poz. 602, tekst jedn.) | https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU19970980602 |
| `Rozp. znaki § 5 ust. 1` | Rozporządzenie MI i MSWiA z 31.07.2002 w sprawie znaków i sygnałów drogowych (Dz.U. 2002 nr 170 poz. 1393) | https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20021701393 |
| `Rozp. war. techn. § 11` | Rozporządzenie MI z 31.12.2002 w sprawie warunków technicznych pojazdów oraz zakresu ich niezbędnego wyposażenia (Dz.U. 2003 nr 32 poz. 262) | https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20030320262 |
| `UoKP art. 6` | Ustawa z 5.01.2011 o kierujących pojazdami (Dz.U. 2011 nr 30 poz. 151) | https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20110300151 |
| `UoTD art. …` | Ustawa z 6.09.2001 o transporcie drogowym (Dz.U. 2001 nr 125 poz. 1371) | https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20011251371 |
| `UoCzPK art. …` | Ustawa z 16.04.2004 o czasie pracy kierowców (Dz.U. 2004 nr 92 poz. 879) | https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20040920879 |
| `Rozp. (WE) 561/2006 art. 6` | Регламент ЕС о времени вождения и отдыха | https://eur-lex.europa.eu/eli/reg/2006/561/oj |
| `Rozp. tramwaje § …` | Rozporządzenie MI z 2.03.2011 w sprawie warunków technicznych tramwajów i trolejbusów (Dz.U. 2011 nr 65 poz. 344) | https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20110650344 |
| `Wytyczne ERC 2021` | Первая помощь — Wytyczne resuscytacji ERC 2021 (Polska Rada Resuscytacji) | https://www.prc.krakow.pl/wytyczne.html |
| `Kodeks karny art. 162` | неоказание помощи | https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU19970880553 |

Всегда указывай **статью/пункт** (`art./ust./pkt`, `§`), а не только акт; проверяй по консолидированному тексту на ISAP (нумерация статей PoRD стабильна; пункты внутри — сверяй). Если норма — это поведение, а не закон (техника вождения, эргономика), пиши «zasady techniki jazdy / instrukcja producenta» без ссылки на акт; не выдумывай статьи.

Ключевые статьи PoRD, на которые ложится большинство вопросов: art. 2 (определения), 3 (ostrożność, ograniczone zaufanie), 5 (знаки и сигналы, приоритет), 13–14 (пешеходы), 16–17 (движение по правой стороне, включение в движение), 18 (автобус с остановки), 19–20 (скорость, дистанция, лимиты), 22 (изменение направления/полосы), 23 (wymijanie/omijanie/cofanie), 24 (wyprzedzanie), 25 (перекрёстки, приоритет), 26 (пешеходные переходы), 27 (велосипедисты), 28 (ж/д переезды), 29 (звуковые сигналы), 30 (условия видимости, противотуманные), 31 (буксировка), 33 (велосипед/скутер), 35–36 (пиктограммы), 39 (ремни, дети), 45 (запреты: телефон, алкоголь), 46–49 (остановка/стоянка), 50–51 (обозначение стоянки, световые приборы), 53 (pojazd uprzywilejowany), 61 (груз), 63 (перевозка людей), 66 (техническое состояние), 71–81 (регистрация, техосмотр), 135 (изъятие прав). Знаки — по номерам групп: A- ostrzegawcze, B- zakazu, C- nakazu, D- informacyjne, P- poziome, S- sygnały, BT-/AT- tramwajowe (Rozp. znaki).

Пример (q-2374, ответ T):

- pl: `Kierujący, zbliżając się do przejścia dla pieszych, jest obowiązany zachować szczególną ostrożność, zmniejszyć prędkość tak, aby nie narazić na niebezpieczeństwo pieszego znajdującego się na przejściu lub na nie wchodzącego, i ustąpić mu pierwszeństwa. (PoRD art. 26 ust. 1)`
- ru: `Приближаясь к пешеходному переходу, водитель обязан соблюдать особую осторожность, снизить скорость так, чтобы не подвергать опасности пешехода, находящегося на переходе или выходящего на него, и уступить ему дорогу. (PoRD art. 26 ust. 1)`

Порядок работы: `katalog_next.py pl 150 --expl` → `explanations/pl/NNN.json` → импорт (чтобы pl-объяснения попали в content.json) → затем для каждого языка `katalog_next.py <lang> 150 --expl` (в выводе уже есть перевод вопроса на этот язык — используй ту же терминологию) → `explanations/<lang>/NNN.json`. Перевод объяснения делай с польского оригинала, ссылку не переводи.

У многих вопросов один и тот же смысл с разными картинками (например, десятки «Czy w tej sytuacji masz obowiązek zachować szczególną ostrożność?»). Объяснение всё равно должно быть **у каждого id**, но текст может повторяться; при этом не пиши того, чего не видно без картинки — опирайся на формулировку вопроса и правильный ответ.

### Автоматизация через Claude API (если выдан ANTHROPIC_API_KEY)

`roadready-admin-pl/scripts/translate-questions.js` уже умеет переводить оставшиеся вопросы батчами (резюмируемо, пишет `translations/{lang}.json`):

```bash
cd roadready-admin-pl
ANTHROPIC_API_KEY=sk-ant-… node scripts/translate-questions.js --lang es --limit 2   # 40 вопросов для оценки качества
ANTHROPIC_API_KEY=sk-ant-… node scripts/translate-questions.js --lang es,tr           # всё
```

Результат обязательно **вычитать по глоссарию** (хотя бы выборочно каждый батч) — модель может менять терминологию между батчами. Для объяснений аналогичного скрипта нет; сделай его по образцу `translate-questions.js` (вход: вопрос + варианты + правильный ответ + тема, JSON-schema выход `{id: explanation}`, системный промт с правилами и таблицей ссылок из этого файла), сначала pl, затем переводы объяснений. Без ключа — вручную чанками, как переводы.

### Критерии приёмки

1. `python -X utf8 scripts/import_katalog.py …` печатает `translations: {'en': 3518, 'de': 3518, 'uk': 3518, 'ru': 3518, 'es': 3518, 'tr': 3518}` и `explanations: {'pl': 3518, 'en': 3518, 'de': 3518, 'uk': 3518, 'ru': 3518, 'es': 3518, 'tr': 3518}`; строки `skipped` нет.
2. Live `https://roadready-pl.web.app/content.json` содержит те же счётчики (`versionHash` новый).
3. У specialist-вопросов переведены все три варианта, порядок A/B/C сохранён; у basic — только текст.
4. Каждое объяснение заканчивается ссылкой в формате из таблицы (или пометкой про технику вождения); ссылки на акты проверяемы на ISAP.
5. Терминология единообразна по глоссарию; обращение формальное.
6. Все чанки закоммичены и запушены в GitHub (`content/katalog/translations/{es,tr}/`, `content/katalog/explanations/{pl,en,de,uk,ru,es,tr}/`, обновлённый `content.json`); `serviceAccountKey.json` в git не попал.
7. В приложении (Expo web: `npm run web` в `roadready-pl`, или сборка) карточка ответа показывает объяснение на выбранном языке.
