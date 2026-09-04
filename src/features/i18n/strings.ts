/**
 * Interface string catalogue.
 *
 * English is the source of truth: every key exists here, and `t()` falls back
 * to it whenever a translation is missing. That fallback is deliberate and not
 * a temporary measure — a missing Ukrainian button label should read in English,
 * never as a blank or a raw key, and the app should not have to ship complete
 * translations before it can ship a new screen.
 *
 * Only strings that have actually been translated appear in the other
 * catalogues. Coverage grows screen by screen; see docs for what is still
 * English-only.
 */

export const EN = {
  'tabs.home': 'Home',
  'tabs.learn': 'Learn',
  'tabs.practice': 'Practice',
  'tabs.profile': 'Profile',

  'common.cancel': 'Cancel',
  'common.delete': 'Delete',
  'common.reset': 'Reset',
  'common.notSet': 'Not set',

  'settings.title': 'Settings',
  'settings.progressOnDevice': 'Progress is stored on this device',
  'settings.section.country': 'Country',
  'settings.row.country': 'Country',
  'settings.section.language': 'Language',
  'settings.row.translationLanguage': 'Translation language',
  'settings.row.interfaceLanguage': 'Interface language',
  'settings.section.examDate': 'Exam date',
  'settings.row.testDate': 'Test date',
  'settings.daysAway': '{days} days away',
  'settings.section.notifications': 'Notifications',
  'settings.row.dailyReminder': 'Daily reminder',
  'settings.row.reminderTime': 'Reminder time',
  'settings.row.questionOfTheDay': 'Question of the Day',
  'settings.section.offline': 'Offline',
  'settings.row.questionsExplanations': 'Questions and explanations',
  'settings.value.includedInApp': 'Included in the app',
  'settings.row.imagesClips': 'Images and clips',
  'settings.offline.nothingToDownload':
    'No illustrated questions in the current content — nothing to download.',
  'settings.offline.cached': '{cached} of {total} · {size}',
  'settings.offline.downloading': 'Downloading… {percent}%',
  'settings.offline.downloadAll': 'Download all media for offline use',
  'settings.offline.failed': '{count} file(s) could not be downloaded. Tap to try again.',
  'settings.offline.allCached':
    'Everything is on this device — illustrated questions work with no connection.',
  'settings.offline.downloadHint':
    'Downloads every question illustration and video clip to this device',
  'settings.offline.delete': 'Delete downloaded media',
  'settings.section.purchases': 'Purchases',
  'settings.row.currentPlan': 'Current plan',
  'settings.row.renewalDate': 'Renewal date',
  'settings.row.manageSubscription': 'Manage Subscription',
  'settings.row.restoring': 'Restoring…',
  'settings.row.restorePurchase': 'Restore Purchase',
  'settings.restoreHint': 'Looks for a subscription bought with this store account',
  'settings.row.resetProgress': 'Reset progress',
  'settings.section.audio': 'Audio',
  'settings.row.voiceSpeed': 'Voice speed',
  'settings.row.autoRead': 'Auto-read questions',
  'settings.section.feedback': 'Feedback',
  'settings.row.vibration': 'Vibration',
  'settings.vibrationSubtitle': 'Buzz on a correct answer during lessons, quizzes and reviews',
  'settings.section.about': 'About',
  'settings.row.appVersion': 'App version',
  'settings.row.privacyPolicy': 'Privacy Policy',

  'settings.restore.restoredTitle': 'Purchase restored',
  'settings.restore.restoredBody': 'Your subscription is active again on this device.',
  'settings.restore.nothingTitle': 'Nothing to restore',
  'settings.restore.nothingBody':
    'We could not find an active subscription for this store account.',
  'settings.reset.title': 'Reset progress?',
  'settings.reset.body':
    'This erases your XP, streak, mastered questions and mock test history on this device. It cannot be undone.',
  'settings.notifOff.title': 'Notifications are off',
  'settings.notifOff.body':
    'Enable notifications for this app in your device Settings to get a daily reminder.',
  'settings.deleteMedia.title': 'Delete downloaded media?',
  'settings.deleteMedia.body':
    'Illustrations and clips will be streamed again next time you need them, so this only frees space — no progress is lost.',
  'settings.legal.openFailed': 'Could not open the browser. The document is at {url}',

  'uiLang.navTitle': 'Interface language',
  'uiLang.heading': 'Choose your interface language',
  'uiLang.subtitle': 'Changes what the app itself says. Questions are not affected.',
  'uiLang.followDevice': 'Match my device',
  'uiLang.followDeviceHint': 'Follows the language your phone is set to',

  'transLang.navTitle': 'Language',
  'transLang.heading': 'Choose your translation language',
  'transLang.subtitle': 'Questions will show in Polish + your chosen language.',
  'transLang.note':
    'The exam itself is sat in Polish, English, German or Polish sign language. A translation here is a study aid, not something you can use on the day.',
  'transLang.polishOnly': 'Polish only (no translation)',
  'transLang.polishOnlyA11y': 'Polish only, no translation',
} as const;

export type StringKey = keyof typeof EN;
export type Catalogue = Partial<Record<StringKey, string>>;

const PL: Catalogue = {
  'tabs.home': 'Start',
  'tabs.learn': 'Nauka',
  'tabs.practice': 'Trening',
  'tabs.profile': 'Profil',

  'common.cancel': 'Anuluj',
  'common.delete': 'Usuń',
  'common.reset': 'Zresetuj',
  'common.notSet': 'Nie ustawiono',

  'settings.title': 'Ustawienia',
  'settings.progressOnDevice': 'Postępy są zapisane na tym urządzeniu',
  'settings.section.country': 'Kraj',
  'settings.row.country': 'Kraj',
  'settings.section.language': 'Język',
  'settings.row.translationLanguage': 'Język tłumaczenia',
  'settings.row.interfaceLanguage': 'Język aplikacji',
  'settings.section.examDate': 'Data egzaminu',
  'settings.row.testDate': 'Data egzaminu',
  'settings.daysAway': 'za {days} dni',
  'settings.section.notifications': 'Powiadomienia',
  'settings.row.dailyReminder': 'Codzienne przypomnienie',
  'settings.row.reminderTime': 'Godzina przypomnienia',
  'settings.row.questionOfTheDay': 'Pytanie dnia',
  'settings.section.offline': 'Tryb offline',
  'settings.row.questionsExplanations': 'Pytania i wyjaśnienia',
  'settings.value.includedInApp': 'W aplikacji',
  'settings.row.imagesClips': 'Zdjęcia i filmy',
  'settings.offline.nothingToDownload':
    'W obecnej bazie nie ma pytań ze zdjęciami — nie ma czego pobierać.',
  'settings.offline.cached': '{cached} z {total} · {size}',
  'settings.offline.downloading': 'Pobieranie… {percent}%',
  'settings.offline.downloadAll': 'Pobierz wszystko do trybu offline',
  'settings.offline.failed': 'Nie udało się pobrać {count} plików. Dotknij, aby spróbować ponownie.',
  'settings.offline.allCached':
    'Wszystko jest na tym urządzeniu — pytania ze zdjęciami działają bez internetu.',
  'settings.offline.downloadHint':
    'Pobiera na to urządzenie wszystkie ilustracje i filmy do pytań',
  'settings.offline.delete': 'Usuń pobrane pliki',
  'settings.section.purchases': 'Zakupy',
  'settings.row.currentPlan': 'Obecny plan',
  'settings.row.renewalDate': 'Data odnowienia',
  'settings.row.manageSubscription': 'Zarządzaj subskrypcją',
  'settings.row.restoring': 'Przywracanie…',
  'settings.row.restorePurchase': 'Przywróć zakup',
  'settings.restoreHint': 'Szuka subskrypcji kupionej na tym koncie w sklepie',
  'settings.row.resetProgress': 'Zresetuj postępy',
  'settings.section.audio': 'Dźwięk',
  'settings.row.voiceSpeed': 'Szybkość lektora',
  'settings.row.autoRead': 'Czytaj pytania automatycznie',
  'settings.section.feedback': 'Wibracje',
  'settings.row.vibration': 'Wibracje',
  'settings.vibrationSubtitle': 'Wibracja przy poprawnej odpowiedzi w lekcjach, quizach i powtórkach',
  'settings.section.about': 'O aplikacji',
  'settings.row.appVersion': 'Wersja aplikacji',
  'settings.row.privacyPolicy': 'Polityka prywatności',

  'settings.restore.restoredTitle': 'Zakup przywrócony',
  'settings.restore.restoredBody': 'Subskrypcja jest znów aktywna na tym urządzeniu.',
  'settings.restore.nothingTitle': 'Nie ma czego przywracać',
  'settings.restore.nothingBody':
    'Nie znaleźliśmy aktywnej subskrypcji na tym koncie w sklepie.',
  'settings.reset.title': 'Zresetować postępy?',
  'settings.reset.body':
    'To usunie z tego urządzenia punkty XP, serię dni, opanowane pytania i historię egzaminów próbnych. Nie da się tego cofnąć.',
  'settings.notifOff.title': 'Powiadomienia są wyłączone',
  'settings.notifOff.body':
    'Włącz powiadomienia dla tej aplikacji w ustawieniach telefonu, aby otrzymywać codzienne przypomnienie.',
  'settings.deleteMedia.title': 'Usunąć pobrane pliki?',
  'settings.deleteMedia.body':
    'Zdjęcia i filmy zostaną pobrane ponownie, gdy będą potrzebne — zwalniasz tylko miejsce, postępy zostają.',
  'settings.legal.openFailed': 'Nie udało się otworzyć przeglądarki. Dokument jest pod adresem {url}',

  'uiLang.navTitle': 'Język aplikacji',
  'uiLang.heading': 'Wybierz język aplikacji',
  'uiLang.subtitle': 'Zmienia język samej aplikacji. Pytania pozostają bez zmian.',
  'uiLang.followDevice': 'Jak w telefonie',
  'uiLang.followDeviceHint': 'Używa języka ustawionego w telefonie',

  'transLang.navTitle': 'Język',
  'transLang.heading': 'Wybierz język tłumaczenia',
  'transLang.subtitle': 'Pytania będą pokazywane po polsku i w wybranym języku.',
  'transLang.note':
    'Egzamin zdaje się po polsku, angielsku, niemiecku lub w polskim języku migowym. Tłumaczenie tutaj pomaga w nauce, ale nie będzie dostępne na egzaminie.',
  'transLang.polishOnly': 'Tylko polski (bez tłumaczenia)',
  'transLang.polishOnlyA11y': 'Tylko polski, bez tłumaczenia',
};

const UK: Catalogue = {
  'tabs.home': 'Головна',
  'tabs.learn': 'Навчання',
  'tabs.practice': 'Практика',
  'tabs.profile': 'Профіль',

  'common.cancel': 'Скасувати',
  'common.delete': 'Видалити',
  'common.reset': 'Скинути',
  'common.notSet': 'Не вказано',

  'settings.title': 'Налаштування',
  'settings.progressOnDevice': 'Прогрес зберігається на цьому пристрої',
  'settings.section.country': 'Країна',
  'settings.row.country': 'Країна',
  'settings.section.language': 'Мова',
  'settings.row.translationLanguage': 'Мова перекладу',
  'settings.row.interfaceLanguage': 'Мова застосунку',
  'settings.section.examDate': 'Дата іспиту',
  'settings.row.testDate': 'Дата іспиту',
  'settings.daysAway': 'через {days} дн.',
  'settings.section.notifications': 'Сповіщення',
  'settings.row.dailyReminder': 'Щоденне нагадування',
  'settings.row.reminderTime': 'Час нагадування',
  'settings.row.questionOfTheDay': 'Питання дня',
  'settings.section.offline': 'Офлайн',
  'settings.row.questionsExplanations': 'Питання та пояснення',
  'settings.value.includedInApp': 'Уже в застосунку',
  'settings.row.imagesClips': 'Зображення та відео',
  'settings.offline.nothingToDownload':
    'У поточній базі немає питань із зображеннями — завантажувати нічого.',
  'settings.offline.cached': '{cached} з {total} · {size}',
  'settings.offline.downloading': 'Завантаження… {percent}%',
  'settings.offline.downloadAll': 'Завантажити все для роботи офлайн',
  'settings.offline.failed': 'Не вдалося завантажити {count} файл(ів). Торкніться, щоб повторити.',
  'settings.offline.allCached':
    'Усе вже на пристрої — питання із зображеннями працюють без інтернету.',
  'settings.offline.downloadHint':
    'Завантажує на пристрій усі ілюстрації та відео до питань',
  'settings.offline.delete': 'Видалити завантажені файли',
  'settings.section.purchases': 'Покупки',
  'settings.row.currentPlan': 'Поточний план',
  'settings.row.renewalDate': 'Дата поновлення',
  'settings.row.manageSubscription': 'Керувати підпискою',
  'settings.row.restoring': 'Відновлення…',
  'settings.row.restorePurchase': 'Відновити покупку',
  'settings.restoreHint': 'Шукає підписку, куплену на цьому обліковому записі магазину',
  'settings.row.resetProgress': 'Скинути прогрес',
  'settings.section.audio': 'Звук',
  'settings.row.voiceSpeed': 'Швидкість озвучення',
  'settings.row.autoRead': 'Озвучувати питання автоматично',
  'settings.section.feedback': 'Вібрація',
  'settings.row.vibration': 'Вібрація',
  'settings.vibrationSubtitle': 'Вібрація на правильну відповідь у уроках, вікторинах і повтореннях',
  'settings.section.about': 'Про застосунок',
  'settings.row.appVersion': 'Версія застосунку',
  'settings.row.privacyPolicy': 'Політика конфіденційності',

  'settings.restore.restoredTitle': 'Покупку відновлено',
  'settings.restore.restoredBody': 'Підписка знову активна на цьому пристрої.',
  'settings.restore.nothingTitle': 'Нічого відновлювати',
  'settings.restore.nothingBody':
    'Не вдалося знайти активну підписку для цього облікового запису магазину.',
  'settings.reset.title': 'Скинути прогрес?',
  'settings.reset.body':
    'Це зітре на цьому пристрої ваш досвід, серію днів, опановані питання та історію пробних іспитів. Скасувати неможливо.',
  'settings.notifOff.title': 'Сповіщення вимкнено',
  'settings.notifOff.body':
    'Увімкніть сповіщення для цього застосунку в налаштуваннях телефона, щоб отримувати щоденне нагадування.',
  'settings.deleteMedia.title': 'Видалити завантажені файли?',
  'settings.deleteMedia.body':
    'Зображення та відео завантажаться знову, коли знадобляться, — ви лише звільните місце, прогрес не втрачається.',
  'settings.legal.openFailed': 'Не вдалося відкрити браузер. Документ за адресою {url}',

  'uiLang.navTitle': 'Мова застосунку',
  'uiLang.heading': 'Оберіть мову застосунку',
  'uiLang.subtitle': 'Змінює мову самого застосунку. Питання залишаються як є.',
  'uiLang.followDevice': 'Як на телефоні',
  'uiLang.followDeviceHint': 'Використовує мову, встановлену на телефоні',

  'transLang.navTitle': 'Мова',
  'transLang.heading': 'Оберіть мову перекладу',
  'transLang.subtitle': 'Питання показуватимуться польською та обраною мовою.',
  'transLang.note':
    'Іспит складають польською, англійською, німецькою або польською жестовою мовою. Переклад тут — допомога в підготовці, на іспиті його не буде.',
  'transLang.polishOnly': 'Тільки польська (без перекладу)',
  'transLang.polishOnlyA11y': 'Тільки польська, без перекладу',
};

const RU: Catalogue = {
  'tabs.home': 'Главная',
  'tabs.learn': 'Обучение',
  'tabs.practice': 'Практика',
  'tabs.profile': 'Профиль',

  'common.cancel': 'Отмена',
  'common.delete': 'Удалить',
  'common.reset': 'Сбросить',
  'common.notSet': 'Не указано',

  'settings.title': 'Настройки',
  'settings.progressOnDevice': 'Прогресс хранится на этом устройстве',
  'settings.section.country': 'Страна',
  'settings.row.country': 'Страна',
  'settings.section.language': 'Язык',
  'settings.row.translationLanguage': 'Язык перевода',
  'settings.row.interfaceLanguage': 'Язык приложения',
  'settings.section.examDate': 'Дата экзамена',
  'settings.row.testDate': 'Дата экзамена',
  'settings.daysAway': 'через {days} дн.',
  'settings.section.notifications': 'Уведомления',
  'settings.row.dailyReminder': 'Ежедневное напоминание',
  'settings.row.reminderTime': 'Время напоминания',
  'settings.row.questionOfTheDay': 'Вопрос дня',
  'settings.section.offline': 'Офлайн',
  'settings.row.questionsExplanations': 'Вопросы и объяснения',
  'settings.value.includedInApp': 'Уже в приложении',
  'settings.row.imagesClips': 'Изображения и видео',
  'settings.offline.nothingToDownload':
    'В текущей базе нет вопросов с изображениями — скачивать нечего.',
  'settings.offline.cached': '{cached} из {total} · {size}',
  'settings.offline.downloading': 'Загрузка… {percent}%',
  'settings.offline.downloadAll': 'Скачать всё для работы офлайн',
  'settings.offline.failed': 'Не удалось скачать {count} файл(ов). Нажмите, чтобы повторить.',
  'settings.offline.allCached':
    'Всё уже на устройстве — вопросы с изображениями работают без интернета.',
  'settings.offline.downloadHint':
    'Скачивает на устройство все иллюстрации и видео к вопросам',
  'settings.offline.delete': 'Удалить скачанные файлы',
  'settings.section.purchases': 'Покупки',
  'settings.row.currentPlan': 'Текущий план',
  'settings.row.renewalDate': 'Дата продления',
  'settings.row.manageSubscription': 'Управлять подпиской',
  'settings.row.restoring': 'Восстановление…',
  'settings.row.restorePurchase': 'Восстановить покупку',
  'settings.restoreHint': 'Ищет подписку, купленную на этом аккаунте магазина',
  'settings.row.resetProgress': 'Сбросить прогресс',
  'settings.section.audio': 'Звук',
  'settings.row.voiceSpeed': 'Скорость озвучки',
  'settings.row.autoRead': 'Озвучивать вопросы автоматически',
  'settings.section.feedback': 'Вибрация',
  'settings.row.vibration': 'Вибрация',
  'settings.vibrationSubtitle': 'Вибрация на правильный ответ в уроках, викторинах и повторениях',
  'settings.section.about': 'О приложении',
  'settings.row.appVersion': 'Версия приложения',
  'settings.row.privacyPolicy': 'Политика конфиденциальности',

  'settings.restore.restoredTitle': 'Покупка восстановлена',
  'settings.restore.restoredBody': 'Подписка снова активна на этом устройстве.',
  'settings.restore.nothingTitle': 'Нечего восстанавливать',
  'settings.restore.nothingBody':
    'Не удалось найти активную подписку для этого аккаунта магазина.',
  'settings.reset.title': 'Сбросить прогресс?',
  'settings.reset.body':
    'Это сотрёт на этом устройстве ваш опыт, серию дней, освоенные вопросы и историю пробных экзаменов. Отменить нельзя.',
  'settings.notifOff.title': 'Уведомления выключены',
  'settings.notifOff.body':
    'Включите уведомления для этого приложения в настройках телефона, чтобы получать ежедневное напоминание.',
  'settings.deleteMedia.title': 'Удалить скачанные файлы?',
  'settings.deleteMedia.body':
    'Изображения и видео загрузятся снова, когда понадобятся, — вы только освободите место, прогресс не теряется.',
  'settings.legal.openFailed': 'Не удалось открыть браузер. Документ по адресу {url}',

  'uiLang.navTitle': 'Язык приложения',
  'uiLang.heading': 'Выберите язык приложения',
  'uiLang.subtitle': 'Меняет язык самого приложения. Вопросы остаются как есть.',
  'uiLang.followDevice': 'Как на телефоне',
  'uiLang.followDeviceHint': 'Использует язык, установленный на телефоне',

  'transLang.navTitle': 'Язык',
  'transLang.heading': 'Выберите язык перевода',
  'transLang.subtitle': 'Вопросы будут показываться на польском и на выбранном языке.',
  'transLang.note':
    'Экзамен сдают на польском, английском, немецком или польском жестовом языке. Перевод здесь — помощь в подготовке, на экзамене его не будет.',
  'transLang.polishOnly': 'Только польский (без перевода)',
  'transLang.polishOnlyA11y': 'Только польский, без перевода',
};

const ES: Catalogue = {
  'tabs.home': 'Inicio',
  'tabs.learn': 'Aprender',
  'tabs.practice': 'Practicar',
  'tabs.profile': 'Perfil',

  'common.cancel': 'Cancelar',
  'common.delete': 'Eliminar',
  'common.reset': 'Restablecer',
  'common.notSet': 'Sin definir',

  'settings.title': 'Ajustes',
  'settings.progressOnDevice': 'Tu progreso se guarda en este dispositivo',
  'settings.section.country': 'País',
  'settings.row.country': 'País',
  'settings.section.language': 'Idioma',
  'settings.row.translationLanguage': 'Idioma de la traducción',
  'settings.row.interfaceLanguage': 'Idioma de la aplicación',
  'settings.section.examDate': 'Fecha del examen',
  'settings.row.testDate': 'Fecha del examen',
  'settings.daysAway': 'en {days} días',
  'settings.section.notifications': 'Notificaciones',
  'settings.row.dailyReminder': 'Recordatorio diario',
  'settings.row.reminderTime': 'Hora del recordatorio',
  'settings.row.questionOfTheDay': 'Pregunta del día',
  'settings.section.offline': 'Sin conexión',
  'settings.row.questionsExplanations': 'Preguntas y explicaciones',
  'settings.value.includedInApp': 'Incluidas en la app',
  'settings.row.imagesClips': 'Imágenes y vídeos',
  'settings.offline.nothingToDownload':
    'El contenido actual no tiene preguntas con imágenes: no hay nada que descargar.',
  'settings.offline.cached': '{cached} de {total} · {size}',
  'settings.offline.downloading': 'Descargando… {percent}%',
  'settings.offline.downloadAll': 'Descargar todo para usar sin conexión',
  'settings.offline.failed': 'No se pudieron descargar {count} archivos. Toca para reintentar.',
  'settings.offline.allCached':
    'Todo está en este dispositivo: las preguntas con imágenes funcionan sin conexión.',
  'settings.offline.downloadHint':
    'Descarga en este dispositivo todas las ilustraciones y vídeos de las preguntas',
  'settings.offline.delete': 'Eliminar archivos descargados',
  'settings.section.purchases': 'Compras',
  'settings.row.currentPlan': 'Plan actual',
  'settings.row.renewalDate': 'Fecha de renovación',
  'settings.row.manageSubscription': 'Gestionar suscripción',
  'settings.row.restoring': 'Restaurando…',
  'settings.row.restorePurchase': 'Restaurar compra',
  'settings.restoreHint': 'Busca una suscripción comprada con esta cuenta de la tienda',
  'settings.row.resetProgress': 'Restablecer progreso',
  'settings.section.audio': 'Audio',
  'settings.row.voiceSpeed': 'Velocidad de la voz',
  'settings.row.autoRead': 'Leer las preguntas en voz alta',
  'settings.section.feedback': 'Vibración',
  'settings.row.vibration': 'Vibración',
  'settings.vibrationSubtitle': 'Vibra al acertar en lecciones, cuestionarios y repasos',
  'settings.section.about': 'Información',
  'settings.row.appVersion': 'Versión de la app',
  'settings.row.privacyPolicy': 'Política de privacidad',

  'settings.restore.restoredTitle': 'Compra restaurada',
  'settings.restore.restoredBody': 'Tu suscripción vuelve a estar activa en este dispositivo.',
  'settings.restore.nothingTitle': 'Nada que restaurar',
  'settings.restore.nothingBody':
    'No encontramos ninguna suscripción activa para esta cuenta de la tienda.',
  'settings.reset.title': '¿Restablecer el progreso?',
  'settings.reset.body':
    'Esto borra de este dispositivo tu XP, tu racha, las preguntas dominadas y el historial de exámenes de prueba. No se puede deshacer.',
  'settings.notifOff.title': 'Las notificaciones están desactivadas',
  'settings.notifOff.body':
    'Activa las notificaciones de esta app en los ajustes del teléfono para recibir el recordatorio diario.',
  'settings.deleteMedia.title': '¿Eliminar los archivos descargados?',
  'settings.deleteMedia.body':
    'Las imágenes y los vídeos se volverán a descargar cuando hagan falta, así que solo liberas espacio: no pierdes progreso.',
  'settings.legal.openFailed': 'No se pudo abrir el navegador. El documento está en {url}',

  'uiLang.navTitle': 'Idioma de la aplicación',
  'uiLang.heading': 'Elige el idioma de la aplicación',
  'uiLang.subtitle': 'Cambia el idioma de la app. Las preguntas no cambian.',
  'uiLang.followDevice': 'Como en el teléfono',
  'uiLang.followDeviceHint': 'Usa el idioma configurado en el teléfono',

  'transLang.navTitle': 'Idioma',
  'transLang.heading': 'Elige tu idioma de traducción',
  'transLang.subtitle': 'Las preguntas se mostrarán en polaco y en el idioma que elijas.',
  'transLang.note':
    'El examen se hace en polaco, inglés, alemán o lengua de signos polaca. La traducción aquí es una ayuda para estudiar, no algo que puedas usar el día del examen.',
  'transLang.polishOnly': 'Solo polaco (sin traducción)',
  'transLang.polishOnlyA11y': 'Solo polaco, sin traducción',
};

const BE: Catalogue = {
  'tabs.home': 'Галоўная',
  'tabs.learn': 'Навучанне',
  'tabs.practice': 'Практыка',
  'tabs.profile': 'Профіль',

  'common.cancel': 'Скасаваць',
  'common.delete': 'Выдаліць',
  'common.reset': 'Скінуць',
  'common.notSet': 'Не пазначана',

  'settings.title': 'Налады',
  'settings.progressOnDevice': 'Прагрэс захоўваецца на гэтай прыладзе',
  'settings.section.country': 'Краіна',
  'settings.row.country': 'Краіна',
  'settings.section.language': 'Мова',
  'settings.row.translationLanguage': 'Мова перакладу',
  'settings.row.interfaceLanguage': 'Мова праграмы',
  'settings.section.examDate': 'Дата экзамену',
  'settings.row.testDate': 'Дата экзамену',
  'settings.daysAway': 'праз {days} дз.',
  'settings.section.notifications': 'Апавяшчэнні',
  'settings.row.dailyReminder': 'Штодзённае напаміну',
  'settings.row.reminderTime': 'Час напаміну',
  'settings.row.questionOfTheDay': 'Пытанне дня',
  'settings.section.offline': 'Афлайн',
  'settings.row.questionsExplanations': 'Пытанні і тлумачэнні',
  'settings.value.includedInApp': 'Ужо ў праграме',
  'settings.row.imagesClips': 'Выявы і відэа',
  'settings.offline.nothingToDownload':
    'У цяперашняй базе няма пытанняў з выявамі — спампоўваць няма чаго.',
  'settings.offline.cached': '{cached} з {total} · {size}',
  'settings.offline.downloading': 'Спампоўванне… {percent}%',
  'settings.offline.downloadAll': 'Спампаваць усё для працы афлайн',
  'settings.offline.failed': 'Не ўдалося спампаваць {count} файл(аў). Націсніце, каб паўтарыць.',
  'settings.offline.allCached':
    'Усё ўжо на прыладзе — пытанні з выявамі працуюць без інтэрнэту.',
  'settings.offline.downloadHint':
    'Спампоўвае на прыладу ўсе ілюстрацыі і відэа да пытанняў',
  'settings.offline.delete': 'Выдаліць спампаваныя файлы',
  'settings.section.purchases': 'Пакупкі',
  'settings.row.currentPlan': 'Цяперашні план',
  'settings.row.renewalDate': 'Дата падаўжэння',
  'settings.row.manageSubscription': 'Кіраваць падпіскай',
  'settings.row.restoring': 'Аднаўленне…',
  'settings.row.restorePurchase': 'Аднавіць пакупку',
  'settings.restoreHint': 'Шукае падпіску, купленую на гэтым уліковым запісе крамы',
  'settings.row.resetProgress': 'Скінуць прагрэс',
  'settings.section.audio': 'Гук',
  'settings.row.voiceSpeed': 'Хуткасць агучвання',
  'settings.row.autoRead': 'Агучваць пытанні аўтаматычна',
  'settings.section.feedback': 'Вібрацыя',
  'settings.row.vibration': 'Вібрацыя',
  'settings.vibrationSubtitle': 'Вібрацыя на правільны адказ ва ўроках, віктарынах і паўторах',
  'settings.section.about': 'Пра праграму',
  'settings.row.appVersion': 'Версія праграмы',
  'settings.row.privacyPolicy': 'Палітыка прыватнасці',

  'settings.restore.restoredTitle': 'Пакупка адноўлена',
  'settings.restore.restoredBody': 'Падпіска зноў актыўная на гэтай прыладзе.',
  'settings.restore.nothingTitle': 'Няма чаго аднаўляць',
  'settings.restore.nothingBody':
    'Не ўдалося знайсці актыўную падпіску для гэтага ўліковага запісу крамы.',
  'settings.reset.title': 'Скінуць прагрэс?',
  'settings.reset.body':
    'Гэта сатрэ на гэтай прыладзе ваш вопыт, серыю дзён, засвоеныя пытанні і гісторыю пробных экзаменаў. Адмяніць немагчыма.',
  'settings.notifOff.title': 'Апавяшчэнні выключаныя',
  'settings.notifOff.body':
    'Уключыце апавяшчэнні для гэтай праграмы ў наладах тэлефона, каб атрымліваць штодзённае напаміну.',
  'settings.deleteMedia.title': 'Выдаліць спампаваныя файлы?',
  'settings.deleteMedia.body':
    'Выявы і відэа спампуюцца зноў, калі спатрэбяцца, — вы толькі вызваліце месца, прагрэс не губляецца.',
  'settings.legal.openFailed': 'Не ўдалося адкрыць браўзер. Дакумент па адрасе {url}',

  'uiLang.navTitle': 'Мова праграмы',
  'uiLang.heading': 'Абярыце мову праграмы',
  'uiLang.subtitle': 'Змяняе мову самой праграмы. Пытанні застаюцца як ёсць.',
  'uiLang.followDevice': 'Як у тэлефоне',
  'uiLang.followDeviceHint': 'Выкарыстоўвае мову, устаноўленую ў тэлефоне',

  'transLang.navTitle': 'Мова',
  'transLang.heading': 'Абярыце мову перакладу',
  'transLang.subtitle': 'Пытанні будуць паказвацца па-польску і на абранай мове.',
  'transLang.note':
    'Экзамен здаюць на польскай, англійскай, нямецкай або польскай жэставай мове. Пераклад тут — дапамога ў падрыхтоўцы, на экзамене яго не будзе.',
  'transLang.polishOnly': 'Толькі польская (без перакладу)',
  'transLang.polishOnlyA11y': 'Толькі польская, без перакладу',
};

export const CATALOGUES: Record<string, Catalogue> = { en: EN, pl: PL, uk: UK, ru: RU, es: ES, be: BE };
