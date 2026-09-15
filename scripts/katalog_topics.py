# -*- coding: utf-8 -*-
"""Topic classifier for the official Polish question catalogue.

The ministry's catalogue carries no thematic taxonomy — only the exam class
(basic / specialist) and the point weight. The app teaches by section, so
every question has to be filed under one of the sections from
src/data/demo-bundle.ts. This is done by keyword rules over the Polish
question text and, for specialist questions, the answer texts.

Rules are ordered: the first matching rule wins, so the specific comes before
the general. Some rules need two things at once (a sign-family rule only
fires when the text also says "znak"), which is what `require` is for. Basic
questions can only land in basic sections and specialist ones in specialist
sections — with two deliberate exceptions, first aid and eco-driving, which
the exam asks in both classes and which would be absurd to split in two.

Media questions that ask "czy w tej sytuacji…" and name nothing else go to
`sytuacje-drogowe`: the picture or clip is the question, and the text alone
cannot say more. That section exists for them.
"""
import re

BASIC_FALLBACK_MEDIA = 'sytuacje-drogowe'
BASIC_FALLBACK = 'zasady-ogolne'
SPECIALIST_FALLBACK = 'technika-manewry'

SIGN = r'znak|tabliczk|oznakowan|drogowskaz|\b[ABCDEFGT]-\d'


def _rx(*words):
    return re.compile('|'.join(words), re.IGNORECASE)


# (topic, match regex, require regex or None). A rule fires when `match` hits
# and, if present, `require` hits as well.
BASIC_RULES = [
    ('pierwsza-pomoc', _rx(r'pierwsz\w* pomoc', r'poszkodowan', r'\brann', r'resuscytac', r'reanimac', r'krwawi', r'opatrun', r'oddech', r'\bofiar', r'apteczk',
                           r'pozycj\w+ boczn', r'nieprzytomn', r'ucisk', r'masaż serca', r'resuscyt', r'uraz', r'kręgosłup', r'\bszok', r'złaman', r'oparzen', r'udziel\w* pomocy', r'numer\w* alarmow', r'\b112\b', r'\b999\b', r'ratown'), None),
    ('zatrzymanie-postoj', _rx(r'chodnik'), _rx(r'zatrzym\w+ (pojazd|samoch|autobus|się)|postój|postoj|parkow|zaparkow|pozostawi')),
    ('sygnalizacja', _rx(r'sygnalizator', r'sygnał\w* (świetln|czerwon|zielon|żółt|migając)', r'światł\w+ (czerwon|zielon|żółt)', r'zielon\w+ strzałk', r'kierując\w+ ruchem', r'policjant',
                         r'układ\w* świateł', r'sygnalizacj\w+ świetln', r'\bS-\d', r'nadawan\w+ sygnał', r'sygnał\w* .*(zabrania|zezwala)'), None),
    ('znaki-ostrzegawcze', _rx(r'ostrzegawcz', r'ostrzegan', r'ostrzega', r'\bA-\d', r'niebezpieczn\w+ zakręt', r'zwężeni', r'nierówn', r'śliska', r'sypki', r'zwierzęt', r'odłamk', r'boczn\w+ wiatr', r'próg zwalniając'), _rx(SIGN)),
    ('znaki-zakazu', _rx(r'zakaz', r'zabrania', r'\bB-\d', r'\bstop\b', r'ograniczeni\w+ prędkości', r'koniec ograniczen'), _rx(SIGN)),
    ('znaki-nakazu', _rx(r'nakaz', r'\bC-\d', r'ruch\w* okrężn', r'droga dla (rowerów|pieszych)', r'prędkoś\w+ minimaln'), _rx(SIGN)),
    ('znaki-poziome', _rx(r'poziom', r'\bP-\d', r'lini\w+ (ciągł|przerywan|podwójn|pojedyncz|warunkow|jednostronn|zatrzymania|bezwarunkow|przystankow)', r'strzałk\w+ (kierunkow|naprowadzając)',
                          r'powierzchni\w+ wyłączon', r'namalowan', r'wymalowan'), None),
    ('znaki-informacyjne', _rx(r'informacyjn', r'\bD-\d', r'\bE-\d', r'\bF-\d', r'drogowskaz', r'znak\w* kierunku', r'droga z pierwszeństwem', r'koniec drogi', r'droga ekspresow', r'autostrad', r'jednokierunkow',
                               r'obszar\w* zabudowan', r'\bBUS\b', r'parking', r'stacj\w+ paliw', r'tunel', r'strefa (zamieszkania|ruchu)', r'przystan\w+'), _rx(SIGN)),
    ('piesi-rowerzysci', _rx(r'piesz', r'rowerzyst', r'rower', r'hulajnog', r'przejazd\w* (kolejow|tramwajow)', r'przed (tym )?przejazdem', r'na przejazd\b', r'przez przejazd\b', r'zapor', r'rogatk', r'torowisk', r'tor\w* (kolejow|tramwajow)', r'dzieci', r'dzieck',
                             r'niepełnosprawn', r'przejści\w+ dla pieszych', r'wózk', r'urządzeni\w+ transportu osobistego', r'pociąg', r'chodnik', r'przejazd\w* dla rower'), None),
    ('pierwszenstwo', _rx(r'pierwszeństw', r'równorzędn', r'z prawej strony', r'z lewej strony', r'rond', r'okrężn', r'kolejność przejazdu', r'podporządkowan', r'pojazd\w* nr \d', r'przejeżdża (jako )?(pierwszy|ostatni|drugi|trzeci)',
                          r'ustąpi', r'ustęp', r'przecinani\w+ się kierunków', r'nadjeżdżając\w+ z (prawej|lewej|przeciwka)'), None),
    ('wyprzedzanie', _rx(r'wyprzedz', r'omij', r'omin', r'wymij', r'wymin'), None),
    ('predkosc', _rx(r'prędkoś', r'odstęp', r'\bkm/h', r'hamowan', r'odległoś\w+ (od|między|za) pojazd'), None),
    ('wlaczanie-zmiana', _rx(r'włącz\w+ się do ruchu', r'włączani\w+', r'zmian\w+ (pasa|kierunku)', r'zmieni\w+ (pas|kierunek)', r'pas\w* ruchu', r'kierunkowskaz', r'skręc', r'skręt', r'zawrac', r'zawróc', r'cofa', r'cofn',
                             r'zjazd', r'zjecha', r'zjeżdża', r'wjecha', r'wjeżdża', r'wyjeżdża', r'wyjecha', r'sygnalizowa\w+ zamiar', r'zamiar (zmiany|skrętu|jazdy)', r'\brusz', r'na wprost', r'\bpas\w* .*(zajm|wolno|właściw|zaj[ąę])',
                             r'zaj\w+ .*\bpas', r'środk\w+ jezdni', r'lewej krawędzi', r'prawej krawędzi', r'wjazd\w* na skrzyżowanie', r'oczekiwa\w+ na wjazd'), None),
    ('zatrzymanie-postoj', _rx(r'postój', r'postoj', r'parkow', r'zaparkow', r'unieruchomi', r'awaryjn\w+ zatrzym', r'trójkąt', r'pozostawi\w+ pojazd', r'zostawi\w+ pojazd', r'silnik\w* (w ruchu|pracuj)', r'miejsce zatrzymania',
                                r'zatrzyma\w+ (pojazd|samoch|autobus|motocykl) (na|w|przy|obok|przed|tuż)', r'zatrzymani\w+ pojazdu', r'zatrzym\w+.*w tym miejscu', r'w tym miejscu.*zatrzym', r'zabezpiecz\w+ pojazd', r'przed (jego )?opuszczeniem'), None),
    ('sytuacje-szczegolne', _rx(r'mgł', r'światł', r'oślepi', r'\bnoc', r'zmierzch', r'świt', r'deszcz', r'śnieg', r'gołoledź', r'oblodz', r'\blód', r'mokr', r'poślizg', r'wiatr', r'tunel', r'\bmost', r'wiadukt', r'warunk\w+ atmosferyczn',
                                r'widoczn', r'zderzeni', r'kolizj', r'wypadk', r'awari', r'holow', r'zmęczeni', r'alkohol', r'\blek\w', r'telefon', r'pas\w+ bezpieczeństwa', r'fotelik', r'uprzywilejowan', r'karetk', r'syren', r'korytarz życia',
                                r'\bdrzwi', r'sygnał\w+ dźwiękow', r'klakson', r'zwierz', r'dane personalne', r'zaśnież', r'\bszyb', r'lusterk', r'korytarz\w* życia', r'służb\w+ ratunkow', r'miejsc\w+ zdarzenia', r'zdarzeni'), None),
    ('ekologia', _rx(r'ekolog', r'środowisk', r'paliw', r'spalin', r'zużyci', r'ekonomiczn', r'emisj', r'hałas', r'kultur', r'agresj', r'uprzejm'), None),
    ('zasady-ogolne', _rx(r'ostrożnoś', r'ograniczon\w+ zaufani', r'uczestnik ruchu', r'jezdni\w+ (dwukierunkow|jednokierunkow)', r'strefa zamieszkania', r'obszar\w* zabudowan', r'pobocz', r'droga twarda', r'\bdefinic', r'oznacza, że',
                          r'przepis', r'ustaw', r'kodeks', r'prawo o ruchu', r'uprawnion', r'\bwiek', r'zasad'), None),
]

SPECIALIST_RULES = [
    ('pierwsza-pomoc', BASIC_RULES[0][1], None),
    ('ekologia', _rx(r'ekolog', r'środowisk', r'zużyci\w+ paliwa', r'oszczędn', r'ekonomiczn\w+ (jazd|styl)', r'eco', r'emisj', r'spalin', r'hałas', r'kultur\w+ jazdy', r'agresj'), None),
    ('autostrady', _rx(r'autostrad', r'drog\w+ ekspresow', r'pas\w* (włączania|wyłączania|awaryjn|rozbieg)', r'\bMOP\b', r'miejsc\w+ obsługi podróżnych'), None),
    ('dokumenty', _rx(r'prawo jazdy', r'prawa jazdy', r'prawem jazdy', r'kategori', r'dokument', r'dowód rejestracyjn', r'\bOC\b', r'ubezpiecz', r'polis', r'kontrol\w+ drogow', r'\bpolicj', r'mandat', r'punkt\w+ karn', r'starost', r'okres\w* próbn',
                      r'alkohol', r'nietrzeźw', r'promil', r'‰', r'narkoty', r'odurzając', r'psychoaktyw', r'badani\w+ lekarsk', r'uprawni', r'\bwiek', r'ukończ\w+ \d+', r'\blat\b', r'egzamin', r'szkoleni', r'\bkurs', r'kwalifikacj', r'świadectw',
                      r'przepis', r'\bustaw[aęyą]\b', r'\bustawie\b', r'ustawow', r'kodeks', r'\bkarn', r'przestępstw', r'wykroczen', r'rejestracj', r'homologacj', r'tachograf', r'czas\w* (pracy|prowadzenia)', r'dzienn\w+ czas', r'tygodniow\w+ (czas|odpoczyn)', r'przerw\w+ w (jeździe|pracy)', r'odpoczyn', r'zatrzymani\w+ prawa',
                      r'cofnięci', r'zakaz\w* prowadzenia', r'\bkierowc\w+ zawodow', r'kart\w+ kierowcy', r'zezwoleni', r'licencj', r'\bAETR\b', r'\bADR\b', r'zaświadczen'), None),
    ('przewoz', _rx(r'przew[oó]z', r'przewoż', r'przewie', r'pasażer', r'ładun', r'ładow', r'bagaż', r'przyczep(?!n)', r'naczep', r'holow', r'zespoł\w+ pojazdów', r'zespół pojazdów', r'\bhol\w*\b', r'liczb\w+ (osób|miejsc)', r'dzieck', r'dzieci',
                    r'fotelik', r'mas\w+ całkowit', r'\bDMC\b', r'nacisk\w* (na )?o[śs]', r'wystając', r'zabezpiecz\w+ ładun', r'rozmieszcz', r'balast', r'cystern', r'materiał\w+ niebezpieczn', r'wsiada', r'wysiada', r'przystan\w+', r'\bosob\w+ (na|w) (motocykl|przyczep|autobus)',
                    r'zwierz', r'wymiar', r'szerokoś\w+ (pojazdu|ładunku)', r'wysokoś\w+ (pojazdu|ładunku)', r'długoś\w+ (pojazdu|zespołu|ładunku)', r'\bton\b', r'\bt\b.*mas'), None),
    ('wyposazenie', _rx(r'wyposaż', r'gaśnic', r'trójkąt', r'kamizelk', r'apteczk', r'\bkask', r'odblask', r'lusterk', r'pas\w+ bezpieczeństwa', r'zagłówk', r'poduszk\w+ powietrzn', r'\bABS\b', r'\bESP\b', r'\bASR\b', r'ogumieni', r'\bopon',
                        r'łańcuch', r'koł\w+ zapasow', r'lamp\w* kontroln', r'wskaźnik', r'kontrolk', r'symbol', r'tablic\w+ (rejestracyjn|wyróżniając)', r'klin', r'podnośnik', r'gaśni'), None),
    ('warunki-techniczne', _rx(r'stan\w* techniczn', r'warunk\w+ techniczn', r'badani\w+ techniczn', r'przegląd', r'usterk', r'niesprawn', r'awari', r'hamulc', r'hamuln', r'układ\w* (kierownicz|hamulcow|wydechow|chłodz|zasilan|zawieszen|napędow|elektryczn|kierowania|jezdn)',
                               r'silnik', r'\bolej', r'płyn', r'chłodz', r'akumulator', r'świec', r'żarów', r'reflektor', r'ustawieni\w+ świateł', r'bieżnik', r'ciśnieni', r'\bluz', r'sprzęgł', r'skrzyni\w+ biegów', r'\bbieg', r'zawieszen', r'amortyzator',
                               r'klock', r'tarcz', r'przegub', r'wycieraczk', r'spryskiwacz', r'szyb', r'sprężon\w+ powietrz', r'kompresor', r'retarder', r'zwalniacz', r'hamulec', r'piasecznic', r'pantograf', r'nastawni', r'zwrotnic', r'wagon',
                               r'ogrzewani', r'klimatyzac', r'wentylac', r'paliw', r'zbiornik', r'przewod', r'pasek', r'łożysk', r'geometri', r'zbieżnoś', r'katalizator', r'filtr', r'turbo', r'moc\w* silnika', r'moment'), None),
    ('technika-manewry', _rx(r'technik', r'manewr', r'zakręt', r'\błuk', r'poślizg', r'nadsterown', r'podsterown', r'siła odśrodkow', r'przyczepnoś', r'kierownic', r'rąk', r'pozycj', r'fotel', r'cofani', r'parkowani', r'ruszani', r'zawracani', r'wzniesieni',
                              r'spadk', r'pochyłoś', r'obserwac', r'pole widzenia', r'wzrok', r'koncentracj', r'uwag', r'zmęczeni', r'\bsen\b', r'senno', r'stres', r'emocj', r'reakcj', r'hamowania', r'prędkoś', r'odstęp', r'odległoś', r'światł', r'oślepi', r'mgł', r'\bnoc',
                              r'deszcz', r'śnieg', r'\blód', r'gołoledź', r'wiatr', r'kolizj', r'wypadk', r'motocykl', r'motorower', r'jednośla', r'przechyl', r'kontrpodpar', r'ciągnik', r'aquaplan', r'poduszk\w+ wodn', r'jazd', r'skręc', r'skręt', r'wyprzedz', r'zatrzym'), None),
]


def classify(structure: str, text: str, answers: str, has_media: bool) -> str:
    """Returns a topic id for one catalogue row."""
    haystack = text or ''
    if structure == 'basic':
        for topic, match, require in BASIC_RULES:
            if match.search(haystack) and (require is None or require.search(haystack)):
                return topic
        if re.search(SIGN, haystack, re.IGNORECASE):
            return 'znaki-informacyjne'
        return BASIC_FALLBACK_MEDIA if has_media else BASIC_FALLBACK
    # Specialist questions: the answers carry a lot of the signal ("Założyć
    # opatrunek uciskowy" says first aid when the question only says "rana").
    # Two passes: the question text alone first, and only when it names
    # nothing do the answers get a say. Answers are noisy — "przyczepność" in an
    # option is not a trailer question, "ustawienie" is not a statute.
    for topic, match, require in SPECIALIST_RULES:
        if match.search(haystack):
            return topic
    full = haystack + ' ' + (answers or '')
    for topic, match, require in SPECIALIST_RULES:
        if match.search(full):
            return topic
    return SPECIALIST_FALLBACK
