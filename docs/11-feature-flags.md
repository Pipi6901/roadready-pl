# Фича-флаги: что выключено и как включить обратно

Все флаги живут в одном файле — [`src/constants/flags.ts`](../src/constants/flags.ts).

**Ничего не удалено.** Экраны за выключенным флагом полностью написаны, проходят проверку типов и остаются доступны по прямому URL — недоступен только штатный путь к ним. Включение = смена `false` на `true`.

---

## Текущее состояние

| Флаг | Значение | Комментарий |
|---|---|---|
| `ONBOARDING_ENABLED` | `true` | Подключён |
| `COUNTRY_SELECTOR_ENABLED` | `false` | Один билд — одна страна (ADR-013). Не временное — обратно включать не планируется в этом приложении |
| `PAYWALL_ENABLED` | `true` | react-native-purchases(-ui), RevenueCat-хостед пейвол (ADR-014). iOS настроен, Android — нет. Ни разу не проверялось на реальном билде — риск New Architecture из ADR-012 не снят |
| `HAZARD_ENABLED` | `false` | Клипы входят в лицензионный пакет DVSA, которого нет (ADR-006) |

---

## Онбординг

**Статус: включён.** Welcome → Language → Goal → Paywall (шаг Country пропущен — см. ниже). Файлы: `app/(onboarding)/`, компоненты — `src/components/onboarding/`.

`ONBOARDING_SKIP_DEFAULTS = { countryCode: 'GB', localeCode: null }` — эти значения используются, только если флаг снова выключат; `localeCode: null` означает «English only».

**Проверить:**
- у пользователя, который уже открывал приложение, в хранилище стоит `onboarded: true` — он онбординг не увидит. Для проверки сбросить прогресс (Settings → Reset progress) или очистить хранилище приложения;
- последний шаг цепочки зависит от `PAYWALL_ENABLED`: при выключенном пейволле `goal.tsx` сам завершает онбординг и уходит на вкладки, при включённом (сейчас) — передаёт управление пейволлу.

**Билинг:** точка входа одна — `src/store/SubscriptionProvider.tsx`. Метод `restore` и вычисление `isPro` реализованы через `react-native-purchases` (ADR-014; не `react-native-iap` из ADR-012 и не Adapty из ещё более раннего ADR-005). Покупку теперь ведёт сам компонент `RevenueCatUI.Paywall`, а не код приложения — `startTrial`/`cancel` в контексте больше нет.

---

## Выбор страны

**Статус: выключен, не временно (ADR-013).** `countryCode` жёстко `'GB'`. Убраны из навигации:
- шаг `Country` в онбординге (`welcome.tsx` ведёт сразу на `/language`);
- строка «Country» в Settings (`app/settings/index.tsx`);
- country-пилюля на вкладке Learn (`app/(tabs)/learn.tsx`).

Экраны `app/(onboarding)/country.tsx` и `app/(modals)/change-country.tsx`, а также модель `Country`/`COUNTRIES` (`src/data/demo-bundle.ts`) и `ContentProvider` — не удалены, только отключены от навигации. В отличие от остальных флагов на этой странице, `COUNTRY_SELECTOR_ENABLED` не планируется включать обратно в этом приложении — вторая страна означает новое дочернее приложение, а не переключатель здесь.

---

## Пейволл

**Статус: включён (iOS).** Экран `app/(onboarding)/paywall.tsx` теперь просто рендерит `<RevenueCatUI.Paywall />` — весь визуал (заголовок, фичи, тарифы, цены) редактируется в дашборде RevenueCat, не в коде (ADR-014). Ограничения бесплатного тарифа активны, логика в `SubscriptionProvider`, переменная `unlocked`.

**Где ещё это учтено:**
- `app/(onboarding)/goal.tsx` — передаёт управление пейволлу вместо завершения онбординга самостоятельно;
- `app/lesson/[topicId].tsx` — кнопка «See Pro plans» на экране дневного лимита ведёт туда же;
- `app/(tabs)/practice.tsx` — бейджи «Pro» появляются там, где `can()` запрещает функцию.

**Что реально настроено:**
- RevenueCat: приложение для App Store подключено, ключи (`In-app purchase key`, `App Store Connect API`) валидны, паблик API-ключ SDK вписан в `src/constants/billing.ts`.
- App Store Connect: группа подписок `RoadReady Pro`, продукты `com.astonio.roadready.pro.monthly` (£4.99) и `.pro.yearly` (£39.99) — созданы, с ценами, 3-дневным бесплатным триалом и локализацией, но **не отправлены на проверку** (статус Missing Metadata/черновик).
- Offering `default` в RevenueCat привязан к этим двум реальным продуктам (не к тестовым Test Store).
- Пейвол собран в их визуальном редакторе (шаблон/AI + правки), опубликован (`Publish paywall`).
- `react-native-purchases` + `react-native-purchases-ui` (10.5.0) установлены и подключены в `SubscriptionProvider.tsx`; `react-native-iap` из ADR-012 удалён.
- Android — не настроен: `REVENUECAT_API_KEY.android` — плейсхолдер.

**Что осталось перед реальным релизом:**
1. **Собрать реальный билд (Codemagic) и проверить, что приложение не падает на старте** — это главный открытый риск: `react-native-purchases` — тот самый пакет с неисправленным багом New Architecture, от которого ADR-012 сознательно отказался. Если упадёт — откат к `react-native-iap` через git history (коммит с ADR-012).
2. Добавить screenshot и отправить обе подписки на проверку вместе с первой версией приложения.
3. Прогнать сценарии на реальном билде (TestFlight/sandbox): покупка, восстановление, истечение триала, упор в дневной лимит.
4. Android — завести приложение в RevenueCat, продукты в Google Play Console, заполнить `REVENUECAT_API_KEY.android`.

Чек-лист требований App Review — в [06-monetization.md](06-monetization.md), раздел 5.

---

## Hazard Perception

**Что выключено:** карточка в Practice Hub не нажимается и показывает «Coming soon», экран `app/hazard/[clipId].tsx` рендерит заглушку.

**Как включить:** `HAZARD_ENABLED = true` **и** наполнить каталог `src/features/practice/hazardClips.ts` — сейчас он пуст. Для каждого клипа нужно окно засчитываемой реакции (`hazardWindow`).

Механика замера, скоринг и плеер написаны полностью. Перед включением обязательно замерить латентность чтения `player.currentTime` на бюджетном Android и заложить её в окна — см. [09-tech-stack.md](09-tech-stack.md), раздел 4.

Отдельно: при включении вернуть пункт «Hazard perception clips» в список преимуществ на пейволле — он был убран, чтобы не обещать недоступную функцию.

---

## Правило

Флаг — это временный выключатель, а не продуктовое решение. Если функция выключается навсегда, она удаляется из кода, а решение фиксируется записью в [00-decisions.md](00-decisions.md). Флаг, проживший дольше пары месяцев, — это мёртвый код, который все боятся тронуть.
