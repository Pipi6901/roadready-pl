# Ответ Apple: Guideline 2.1 — Information Needed (RoadReady PL 1.0)

16 октября 2026. Apple не отклонила приложение, а запросила информацию. Нужно
три вещи: ответ в App Store Connect (Resolution Center), то же самое в поле
Notes («Информация для проверки приложения»), и запись экрана с реального
телефона.

## Сначала поправить, потом отвечать

В ответе мы перечисляем внешние сервисы. Ревьюер сверяет их с анкетой
конфиденциальности и с тем, что видит в приложении, поэтому расхождения надо
убрать до отправки.

**1. Анкета конфиденциальности неполная.** Я советовал одну строку («Покупки →
История покупок, функциональность приложения»). По документации самих SDK этого
мало:

- Adapty о себе: «Adapty collects IDFA, so you have to select Device ID». В коде
  `adapty.activate(key)` вызван без параметров, то есть с настройками по
  умолчанию.
- RevenueCat для «Покупок» называет цели **Analytics и App Functionality**,
  обе обязательные.

Что сделать: App Store → Конфиденциальность приложения → Типы данных →
добавить **Идентификаторы → Идентификатор устройства** (цели: функциональность
приложения, аналитика) и к «История покупок» добавить цель **Аналитика**.
Связано ли с личностью — нет (аккаунтов нет), отслеживание — нет. Опубликовать.
Политика конфиденциальности уже написана честнее анкеты: там RevenueCat и Adapty
названы.

**2. Подписки должны быть добавлены к версии.** Страница версии 1.0 → раздел
«Покупки в приложении и подписки» → добавить обе подписки. Без этого ревьюер не
сможет проверить покупку (это пункт 3.1.1 из их списка).

**3. Пробный период на 3 дня** должен быть заведён на обоих продуктах. Кнопка в
пейволле обещает его; если его нет, в ответе уберите слова про trial.

**4. Текст пейволла в RevenueCat** (серверный, меняется без ревью). Сейчас он
продаёт то, что бесплатно (переводы, офлайн), а бейдж «Сэкономьте 19%» неверен.
Ревьюер будет проверять пейволл первым. Замена на 7 языков в
`docs/paywall-copy.md`.

**5. Пункт 6 ответа — единственное юридическое допущение продукта.** На
странице gov.pl нет условий использования базы вопросов. По моему инструменту,
единственный лицензионный текст там — общий подвал портала: текст под
CC BY-SA 4.0, а **аудиовизуальные материалы под CC BY-NC-ND 4.0** (то есть без
коммерческого использования), «если не указано иное». У нас подписка, и в базе
около 2,6 тыс. картинок и клипов. Прочитайте подвал страницы сами; я не юрист.
Ниже есть черновик письма в министерство с просьбой подтвердить условия.
Отправлять его не обязательно для этого ответа, но это единственное, что
превращает «мы так считаем» в документ.

## Текст ответа в Resolution Center (английский)

```
Hello,

Thank you for the review. The requested information follows; the same text is in the Notes field. The screen recording is attached.

1. SCREEN RECORDING
Recorded on a physical iPhone running the latest iOS, from launching the app: first launch and introduction, the free features, the paywall reached from the locked Mock Test, the 3-day free trial with a sandbox account, the unlocked Mock Test and Weak Spots, and Restore Purchase. The app has no accounts (so no registration, login or account deletion) and no user-generated content (so no reporting or blocking).

2. PURPOSE AND AUDIENCE
RoadReady PL prepares people for the theory part of the Polish state driving licence exam. It contains the official exam question bank, an explanation after every answer, a translation under each question (English, German, Ukrainian, Russian, Spanish, Turkish) and a mock exam in the real format: 32 questions, 25 minutes, 68 of 74 points to pass, no going back. The audience is candidates for any driving licence category in Poland, many of whom do not read Polish well.

3. ACCESSING THE FEATURES
No account, login, demo credentials or sample files are needed. First launch: tap the start screen, go through the introduction, choose a licence category (for example B). The subscription screen can be closed with "Skip for now". Free: Learn tab (sections and lessons), Practice > Quick Quiz, Profile, Settings. Paid (RoadReady Pro): Practice > Mock Test and Practice > Your Weak Spots. Both are locked for free users; tapping either opens the subscription screen (monthly and yearly plans, each with a 3-day free trial for new subscribers). In the sandbox, buying a plan unlocks both at once. Settings > Restore Purchase restores the subscription on another device.

4. EXTERNAL SERVICES
- Apple App Store / StoreKit: payments and subscription management.
- RevenueCat (revenuecat.com): subscription status and the hosted paywall. It receives the App Store receipt and an anonymous app user ID.
- Adapty (adapty.io): shows the introductory screens at first launch.
- Google Firebase: Hosting serves the question bank as one JSON file (roadready-pl.web.app) and Cloud Storage serves the images and video clips attached to questions. Plain HTTPS downloads; no Firebase SDK in the app.
- Our own site pmoffice.space: privacy policy, terms and support page.
- On the device only: Apple's speech synthesis (read-aloud) and local notifications (daily reminder).
No AI service is called by the app. An analytics integration is prepared but switched off in this version; no events are sent.

5. REGIONAL DIFFERENCES
None. Features, content and the free/paid split are the same in every region. The content is about the Polish driving exam by design. The interface follows the device language (7 languages) and can be changed in Settings. Subscription prices come from App Store pricing for each storefront.

6. THIRD-PARTY MATERIAL
The questions, answer keys, point weights and categories are the Polish Ministry of Infrastructure's official exam question database, published openly on gov.pl (https://www.gov.pl/web/infrastruktura/prawo-jazdy: catalogue file and "Multimedia do pytań" image and clip archives). A commission appointed by the minister prepared it, and the regional exam centres (WORD) use it. Official documents and materials are not protected works under Polish copyright law (Art. 4(2) of the Act of 4 February 1994). The English, German and Ukrainian wordings are the ministry's own official translations. The Russian, Spanish and Turkish translations and all explanations are our own, prepared offline with AI-assisted tools and shipped as static content. The App Store description, Settings and the support page state that the app is independent and not affiliated with the Ministry or the exam centres. It is not in a regulated industry. We will gladly provide anything further you need.

Thank you,
Astonio Ltd
```

## Текст для поля Notes (английский, не длиннее 4000 знаков)

```
NO ACCOUNT: the app has no sign-in, accounts or user-generated content. No demo credentials or sample files are needed. Progress is stored on the device only.

HOW TO REACH THE MAIN FEATURES
1. First launch: tap the start screen, go through the introduction, choose a licence category (e.g. B). The subscription screen can be closed with "Skip for now".
2. Free: Learn tab (sections, lessons, explanations, translation under each question, text-to-speech), Practice > Quick Quiz, Profile, Settings.
3. Paid (RoadReady Pro, auto-renewable subscription, monthly or yearly, 3-day free trial for new subscribers): Practice > Mock Test and Practice > Your Weak Spots. Both are locked for free users; tapping either opens the subscription screen. Buying a plan in the sandbox unlocks both immediately. Settings > Restore Purchase restores it.

PURPOSE: theory-exam preparation for the Polish driving licence (official question bank, explanations, translations into 6 languages, mock exam: 32 questions, 25 minutes, 68 of 74 points, no going back). Audience: licence candidates in Poland, many of whom do not read Polish well.

EXTERNAL SERVICES: Apple StoreKit (payments); RevenueCat (subscription status, hosted paywall); Adapty (introductory screens); Google Firebase Hosting and Cloud Storage (question bank JSON, images and video clips; plain HTTPS, no Firebase SDK); our site pmoffice.space (privacy policy, terms, support). On device only: speech synthesis, local notifications. No AI service is called by the app; analytics is switched off in this version.

REGIONS: identical in every region. Content is about the Polish exam by design; interface language follows the device (7 languages); prices follow App Store storefronts.

THIRD-PARTY MATERIAL: questions, answers, point weights and categories are the Ministry of Infrastructure's official exam question database, published at https://www.gov.pl/web/infrastruktura/prawo-jazdy (catalogue file and "Multimedia do pytań" archives). Official documents and materials are not protected works under Polish copyright law (Art. 4(2), Act of 4 Feb 1994). English, German and Ukrainian wordings are the ministry's official translations; Russian, Spanish and Turkish translations and all explanations are our own, prepared offline with AI-assisted tools and shipped as static content. The app says it is independent and not affiliated with the Ministry or exam centres (App Store description, Settings, support page).

A screen recording from a physical device was sent in the App Review reply (Guideline 2.1).
```

## Запись экрана: что снимать

Apple требует: реальный телефон, **последняя версия iOS**, запись начинается с
запуска приложения, показан типичный сценарий и платные функции. Аккаунтов и
пользовательского контента нет, и об этом уже сказано текстом.

**Подготовка**
- Ставить **ту самую сборку**, которую отправили на проверку (TestFlight).
- Удалить приложение и поставить заново, чтобы первый запуск был чистым.
- Покупка идёт через песочницу автоматически (в окне Apple будет
  «Environment: Sandbox»). Ту подписку, что куплена вчера, песочница уже
  погасила: месячная живёт минуты. Если кнопка покупки покажет «вы уже
  подписаны», подожди или войди другим Apple ID.
- Включить запись: Пункт управления → кнопка записи экрана. Начни запись,
  когда приложение **ещё не запущено**, на домашнем экране.

**Сценарий, 3–4 минуты**
1. Домашний экран → нажать иконку RoadReady PL.
2. Стартовый экран → нажать → экраны знакомства → выбор категории (B).
3. Пейволл: показать два тарифа с ценами, нажать **Skip for now**.
4. Learn → любой раздел → урок → ответить на 2–3 вопроса: видно польский текст,
   перевод под ним и пояснение после ответа.
5. Settings (шестерёнка в Profile) → язык интерфейса и язык перевода.
6. Practice → **Quick Quiz** → пара вопросов.
7. Practice → **Mock Test** → «Mock Test is a Pro feature» → **See Pro plans** →
   пейволл → начать пробный период → окно Apple с «Sandbox» → подтвердить.
8. Mock Test открылся → начать → 3–4 вопроса (виден таймер) → завершить → итог.
9. Practice → **Your Weak Spots** — теперь открыт.
10. Profile → Settings → **Restore Purchase** → нажать, видно сообщение.

Файл прикрепить к ответу в App Store Connect. Если он не загружается по
размеру, дать ссылку (облако, доступ по ссылке).

## Куда нажимать в App Store Connect

1. App Store Connect → приложение → **Проверка приложения** (App Review) →
   сообщение Apple → **Ответить**: вставить английский текст выше, прикрепить
   видео, отправить.
2. Версия 1.0 → «Информация для проверки» → поле **Notes** → вставить второй
   текст → Сохранить.
3. Если на странице версии появится кнопка повторной отправки на проверку,
   нажать её.

## Письмо в министерство (по желанию, на польском)

Адрес возьмите на странице gov.pl в разделе контактов Министерства
инфраструктуры или у департамента, который ведёт базу вопросов; я адрес не
выдумываю.

```
Szanowni Państwo,

tworzymy niezależną aplikację mobilną do nauki na egzamin teoretyczny na prawo jazdy w Polsce (RoadReady PL). Korzystamy z publicznie udostępnionej Bazy pytań egzaminacyjnych (plik KATALOG_dla_kandydatów_na_kierowców_072026.xlsx) oraz z archiwów „Multimedia do pytań” dostępnych na stronie https://www.gov.pl/web/infrastruktura/prawo-jazdy.

Aplikacja jest odpłatna (subskrypcja), nie twierdzi, że jest powiązana z Ministerstwem ani z ośrodkami egzaminowania, i wyraźnie to zaznacza. Prosimy o potwierdzenie na piśmie:

1. czy treść pytań i odpowiedzi z Bazy pytań może być wykorzystywana w aplikacji komercyjnej służącej do przygotowania do egzaminu,
2. czy dotyczy to także materiałów graficznych i filmowych z archiwów „Multimedia do pytań”,
3. na jakich warunkach (np. wskazanie źródła), oraz
4. czy do tych materiałów mają zastosowanie licencje wymienione w stopce portalu gov.pl.

Z poważaniem
Astonio Ltd
```
