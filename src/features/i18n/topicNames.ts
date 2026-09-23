/**
 * Section names, per interface language.
 *
 * The names live here and not in content.json for the same reason the section
 * list itself is ours: the regulation fixes the question classes, the weights
 * and the counts, but it publishes no thematic taxonomy — these 23 headings
 * are a product decision, which makes them interface copy that happens to be
 * keyed by topic id. Translating them in the bundle would mean a publish for
 * every wording change and a translation catalogue per locale for 23 strings.
 *
 * Polish is the fallback and is deliberately absent: it is what the bundle
 * already carries, so an id with no entry here (a topic added by a later
 * publish) reads in Polish rather than as a blank.
 */
type TopicNames = Record<string, string>;

const EN: TopicNames = {
  'zasady-ogolne': 'General rules and definitions',
  'znaki-ostrzegawcze': 'Warning signs',
  'znaki-zakazu': 'Prohibition signs',
  'znaki-nakazu': 'Mandatory signs',
  'znaki-informacyjne': 'Information and direction signs',
  'znaki-poziome': 'Road markings and plates',
  sygnalizacja: 'Traffic lights and signals',
  pierwszenstwo: 'Right of way and junctions',
  'wlaczanie-zmiana': 'Joining traffic and changing direction',
  wyprzedzanie: 'Overtaking and passing',
  predkosc: 'Speed and distances',
  'zatrzymanie-postoj': 'Stopping and parking',
  'piesi-rowerzysci': 'Pedestrians, cyclists, level crossings',
  'sytuacje-szczegolne': 'Special cases and hard conditions',
  'sytuacje-drogowe': 'Road situations — clips and photos',
  'pierwsza-pomoc': 'First aid',
  ekologia: 'Eco-driving and road manners',
  'technika-manewry': 'Driving technique and manoeuvres',
  'warunki-techniczne': 'Vehicle roadworthiness',
  wyposazenie: 'Equipment and vehicle load',
  dokumenty: 'Documents and driver duties',
  przewoz: 'Carrying people, loads and towing',
  autostrady: 'Motorways and expressways',
};

const DE: TopicNames = {
  'zasady-ogolne': 'Grundregeln und Begriffe',
  'znaki-ostrzegawcze': 'Gefahrenzeichen',
  'znaki-zakazu': 'Verbotszeichen',
  'znaki-nakazu': 'Gebotszeichen',
  'znaki-informacyjne': 'Hinweis- und Richtungszeichen',
  'znaki-poziome': 'Markierungen und Zusatzzeichen',
  sygnalizacja: 'Ampeln und Zeichen der Polizei',
  pierwszenstwo: 'Vorfahrt und Kreuzungen',
  'wlaczanie-zmiana': 'Einfahren und Richtungswechsel',
  wyprzedzanie: 'Überholen und Vorbeifahren',
  predkosc: 'Geschwindigkeit und Abstände',
  'zatrzymanie-postoj': 'Halten und Parken',
  'piesi-rowerzysci': 'Fußgänger, Radfahrer, Bahnübergänge',
  'sytuacje-szczegolne': 'Sonderfälle und schwierige Bedingungen',
  'sytuacje-drogowe': 'Verkehrssituationen — Videos und Fotos',
  'pierwsza-pomoc': 'Erste Hilfe',
  ekologia: 'Ökologisches Fahren und Verhalten',
  'technika-manewry': 'Fahrtechnik und Manöver',
  'warunki-techniczne': 'Technischer Zustand des Fahrzeugs',
  wyposazenie: 'Ausrüstung und Beladung',
  dokumenty: 'Dokumente und Pflichten des Fahrers',
  przewoz: 'Personen- und Lastentransport, Abschleppen',
  autostrady: 'Autobahnen und Schnellstraßen',
};

const UK: TopicNames = {
  'zasady-ogolne': 'Загальні правила та поняття',
  'znaki-ostrzegawcze': 'Попереджувальні знаки',
  'znaki-zakazu': 'Заборонні знаки',
  'znaki-nakazu': 'Наказові знаки',
  'znaki-informacyjne': 'Інформаційні знаки та напрямки',
  'znaki-poziome': 'Дорожня розмітка та таблички',
  sygnalizacja: 'Світлофори та сигнали регулювальника',
  pierwszenstwo: 'Першочерговість і перехрестя',
  'wlaczanie-zmiana': 'Виїзд на дорогу та зміна напрямку',
  wyprzedzanie: 'Обгін, об’їзд, роз’їзд',
  predkosc: 'Швидкість і дистанція',
  'zatrzymanie-postoj': 'Зупинка та стоянка',
  'piesi-rowerzysci': 'Пішоходи, велосипедисти, переїзди',
  'sytuacje-szczegolne': 'Особливі випадки та складні умови',
  'sytuacje-drogowe': 'Дорожні ситуації — відео та фото',
  'pierwsza-pomoc': 'Перша допомога',
  ekologia: 'Екологія та культура водіння',
  'technika-manewry': 'Техніка керування та маневри',
  'warunki-techniczne': 'Технічний стан автомобіля',
  wyposazenie: 'Обладнання та завантаження',
  dokumenty: 'Документи й обов’язки водія',
  przewoz: 'Перевезення людей, вантажу, буксирування',
  autostrady: 'Автомагістралі та швидкісні дороги',
};

const RU: TopicNames = {
  'zasady-ogolne': 'Общие правила и понятия',
  'znaki-ostrzegawcze': 'Предупреждающие знаки',
  'znaki-zakazu': 'Запрещающие знаки',
  'znaki-nakazu': 'Предписывающие знаки',
  'znaki-informacyjne': 'Информационные знаки и направления',
  'znaki-poziome': 'Разметка и таблички',
  sygnalizacja: 'Светофоры и сигналы регулировщика',
  pierwszenstwo: 'Приоритет и перекрёстки',
  'wlaczanie-zmiana': 'Выезд на дорогу и смена направления',
  wyprzedzanie: 'Обгон, объезд, разъезд',
  predkosc: 'Скорость и дистанция',
  'zatrzymanie-postoj': 'Остановка и стоянка',
  'piesi-rowerzysci': 'Пешеходы, велосипедисты, переезды',
  'sytuacje-szczegolne': 'Особые случаи и трудные условия',
  'sytuacje-drogowe': 'Дорожные ситуации — видео и фото',
  'pierwsza-pomoc': 'Первая помощь',
  ekologia: 'Экология и культура вождения',
  'technika-manewry': 'Техника вождения и манёвры',
  'warunki-techniczne': 'Техническое состояние автомобиля',
  wyposazenie: 'Оснащение и загрузка',
  dokumenty: 'Документы и обязанности водителя',
  przewoz: 'Перевозка людей, груза, буксировка',
  autostrady: 'Автомагистрали и скоростные дороги',
};

const ES: TopicNames = {
  'zasady-ogolne': 'Normas generales y conceptos',
  'znaki-ostrzegawcze': 'Señales de advertencia',
  'znaki-zakazu': 'Señales de prohibición',
  'znaki-nakazu': 'Señales de obligación',
  'znaki-informacyjne': 'Señales informativas y de dirección',
  'znaki-poziome': 'Marcas viales y paneles',
  sygnalizacja: 'Semáforos y señales del agente',
  pierwszenstwo: 'Prioridad e intersecciones',
  'wlaczanie-zmiana': 'Incorporación y cambio de dirección',
  wyprzedzanie: 'Adelantamiento y cruce',
  predkosc: 'Velocidad y distancias',
  'zatrzymanie-postoj': 'Parada y estacionamiento',
  'piesi-rowerzysci': 'Peatones, ciclistas, pasos a nivel',
  'sytuacje-szczegolne': 'Casos especiales y condiciones difíciles',
  'sytuacje-drogowe': 'Situaciones de tráfico — vídeos y fotos',
  'pierwsza-pomoc': 'Primeros auxilios',
  ekologia: 'Conducción ecológica y civismo',
  'technika-manewry': 'Técnica de conducción y maniobras',
  'warunki-techniczne': 'Estado técnico del vehículo',
  wyposazenie: 'Equipamiento y carga',
  dokumenty: 'Documentos y obligaciones del conductor',
  przewoz: 'Transporte de personas, carga y remolque',
  autostrady: 'Autopistas y autovías',
};

const TR: TopicNames = {
  'zasady-ogolne': 'Genel kurallar ve kavramlar',
  'znaki-ostrzegawcze': 'Tehlike uyarı işaretleri',
  'znaki-zakazu': 'Yasaklama işaretleri',
  'znaki-nakazu': 'Mecburiyet işaretleri',
  'znaki-informacyjne': 'Bilgi ve yön işaretleri',
  'znaki-poziome': 'Yol çizgileri ve levhalar',
  sygnalizacja: 'Işıklar ve görevli işaretleri',
  pierwszenstwo: 'Geçiş hakkı ve kavşaklar',
  'wlaczanie-zmiana': 'Trafiğe katılma ve yön değiştirme',
  wyprzedzanie: 'Sollama ve yandan geçme',
  predkosc: 'Hız ve takip mesafesi',
  'zatrzymanie-postoj': 'Durma ve park etme',
  'piesi-rowerzysci': 'Yayalar, bisikletliler, hemzemin geçitler',
  'sytuacje-szczegolne': 'Özel durumlar ve zor koşullar',
  'sytuacje-drogowe': 'Trafik durumları — video ve fotoğraf',
  'pierwsza-pomoc': 'İlk yardım',
  ekologia: 'Çevreci sürüş ve trafik nezaketi',
  'technika-manewry': 'Sürüş tekniği ve manevralar',
  'warunki-techniczne': 'Aracın teknik durumu',
  wyposazenie: 'Donanım ve yükleme',
  dokumenty: 'Belgeler ve sürücü yükümlülükleri',
  przewoz: 'Yolcu, yük taşıma ve çekme',
  autostrady: 'Otoyollar ve hızlı yollar',
};

const TOPIC_NAMES: Record<string, TopicNames> = { en: EN, de: DE, uk: UK, ru: RU, es: ES, tr: TR };

/** The section's name in `locale`, falling back to the bundle's Polish. */
export function topicName(locale: string, id: string, polish: string): string {
  return TOPIC_NAMES[locale]?.[id] ?? polish;
}
