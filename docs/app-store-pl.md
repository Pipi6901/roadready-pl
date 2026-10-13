# Тексты для App Store Connect — RoadReady PL 1.0

Всё готово к копированию. Длина полей проверена против лимитов Apple.

Важно про модель: **бесплатно** — уроки без лимита, все переводы, объяснения,
лектор и офлайн. **Pro** — только пробный экзамен и работа над ошибками.
Тексты ниже написаны именно так; если модель поменяется, их надо переписать,
иначе описание разойдётся с приложением и это заметят на ревью.

---

## Подзаголовок (макс. 30)

Основной вариант:

```
Testy WORD w 7 językach
```

Запасной, если захочется подчеркнуть официальность:

```
Oficjalne testy z tłumaczeniem
```

Ровно 30 знаков, впритык.

## Промотекст (макс. 170, меняется без ревью)

```
Oficjalne pytania z bazy ministerstwa, tłumaczenie pod każdym pytaniem i egzamin próbny taki jak w WORD. Bez konta, działa offline.
```

## Ключевые слова (макс. 100, через запятую, без пробелов после запятых)

```
prawo jazdy,egzamin,teoria,kategoria B,pytania,kurs,szkoła,ukraiński,rosyjski,tłumaczenie,2026
```

93 знака. Слова из названия и подзаголовка здесь не повторяются — Apple
индексирует их и так, повтор только тратит лимит.

## Описание

```
RoadReady PL to aplikacja do nauki na egzamin teoretyczny na prawo jazdy w Polsce. Wszystkie pytania pochodzą z oficjalnej bazy pytań Ministerstwa Infrastruktury — tej samej, z której korzysta WORD.

NAUKA W TWOIM JĘZYKU
Pod każdym pytaniem możesz włączyć tłumaczenie: ukraiński, rosyjski, angielski, hiszpański, niemiecki, turecki. Cały interfejs aplikacji również jest przetłumaczony. Egzamin zdaje się po polsku, dlatego polskie brzmienie pytania zawsze zostaje na wierzchu, a tłumaczenie jest pod nim — po to, żeby pomóc zrozumieć, a nie zastąpić.

KRÓTKIE LEKCJE
Materiał podzielony na działy i lekcje po 10 pytań. Po każdej odpowiedzi od razu widzisz wyjaśnienie: dlaczego poprawna odpowiedź jest właśnie taka.

EGZAMIN PRÓBNY
Przebiega dokładnie tak jak w WORD: 32 pytania, 25 minut, 68 z 74 punktów, bez możliwości powrotu do poprzedniego pytania. Pytania podstawowe z czasem na przeczytanie i odpowiedź TAK/NIE, specjalistyczne z trzema odpowiedziami.

BŁĘDY WRACAJĄ
Pytanie, w którym się pomylisz, wraca do powtórki i znika z listy dopiero wtedy, gdy odpowiesz na nie poprawnie dwa razy z rzędu.

LEKTOR
Każde pytanie można odsłuchać po polsku — przydaje się, gdy czytanie idzie wolniej niż słuchanie.

BEZ KONTA, OFFLINE
Nie zakładasz konta i nie podajesz adresu e-mail. Postępy zostają na telefonie. Po pobraniu materiałów aplikacja działa bez internetu.

CO JEST ZA DARMO
Lekcje bez limitu, wszystkie tłumaczenia, wyjaśnienia, lektor i tryb offline są bezpłatne. RoadReady Pro dokłada egzamin próbny i tryb pracy nad błędami.

ROADREADY PRO
Subskrypcja miesięczna lub roczna. Płatność pobierana jest z konta App Store po potwierdzeniu zakupu. Subskrypcja odnawia się automatycznie, jeśli nie wyłączysz odnawiania co najmniej 24 godziny przed końcem bieżącego okresu. Subskrypcją zarządzasz w ustawieniach swojego konta App Store.

Regulamin: https://pmoffice.space/roadready-pl-terms.html
Polityka prywatności: https://pmoffice.space/roadready-pl-privacy.html

RoadReady PL jest niezależną aplikacją do nauki. Nie jest powiązana z Ministerstwem Infrastruktury, Wojewódzkimi Ośrodkami Ruchu Drogowego (WORD) ani żadnym organem państwowym. Tłumaczenia i wyjaśnienia są naszym własnym opracowaniem.
```

## Что нового в версии (1.0)

```
Pierwsze wydanie RoadReady PL.

Oficjalna baza pytań, tłumaczenia na sześć języków, wyjaśnienia do każdego pytania, lektor, egzamin próbny w formule WORD i tryb pracy nad błędami.
```

---

## Локализация подписок

Создаётся отдельно на каждый продукт в разделе Subscriptions. Поля: Display
Name (видно в диалоге покупки) и Description.

### `com.astonio.roadreadypl.pro.monthly`

Польский:

```
RoadReady Pro — miesiąc
Egzamin próbny w formule WORD i tryb pracy nad błędami. Odnawia się co miesiąc, anulujesz w każdej chwili.
```

Английский:

```
RoadReady Pro — Monthly
The WORD-style mock exam and weak-spot practice. Renews monthly, cancel anytime.
```

### `com.astonio.roadreadypl.pro.yearly`

Польский:

```
RoadReady Pro — rok
Egzamin próbny w formule WORD i tryb pracy nad błędami przez cały rok, taniej niż dwanaście miesięcy osobno.
```

Английский:

```
RoadReady Pro — Yearly
The WORD-style mock exam and weak-spot practice for a year, cheaper than twelve months bought separately.
```

---

## Анкета App Privacy

Если **Amplitude подключается**:

| Категория | Данные | Цель | Связано с личностью | Трекинг |
|---|---|---|---|---|
| Identifiers → Device ID | UUID, который приложение генерирует само, не IDFA | Analytics | нет | нет |
| Usage Data → Product Interaction | события воронки | Analytics | нет | нет |
| Purchases → Purchase History | статус подписки через RevenueCat | App Functionality | нет | нет |

Если **Amplitude не подключается** — остаётся только третья строка.

Имя, прогресс, XP, серия и отмеченные вопросы **не собираются**: они лежат в
AsyncStorage на устройстве и никуда не уходят. Так написано на экране
редактирования имени, и анкета должна с этим совпадать.

ATT-промпт не нужен: IDFA не используется, межприложенческого трекинга нет.

---

## Информация для проверки (App Review Information)

Демо-аккаунт не нужен — входа в приложении нет. В поле Notes:

```
No sign-in: the app has no accounts and stores progress on the device only.

Question content comes from the official bank of questions used in the Polish
state driving examination, published by the Ministry of Infrastructure. The app
is not affiliated with the Ministry or with WORD, and says so in Settings →
About and in the App Store description.

Free: unlimited lessons, all six translations, explanations, text-to-speech and
offline mode.
RoadReady Pro: the mock exam and weak-spot practice.

To reach the paywall: Practice tab → Mock Test, or Practice tab → Your Weak
Spots. Both are Pro-locked and open the subscription screen.
```

---

## Чего ещё не хватает в листинге

- **Support URL** — обязательное поле, сейчас его нет. Нужна страница вроде
  `https://pmoffice.space/roadready-pl-support.html` с описанием и адресом
  help@pmoffice.space. Могу собрать по образцу юридических страниц.
- **Marketing URL** — необязательное, можно не заполнять.
- **URL страницы о возрастной приемлемости** — необязательное.
- Проверить, что скриншоты из библиотеки материалов **прикреплены к версии
  1.0**, а не только загружены: в списке они помечены «Добавить для проверки».
