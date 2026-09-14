/**
 * The Polish demo bank: 22 sections × 5 questions, in the exam's own format.
 *
 * Basic sections are answered TAK/NIE, specialist ones A/B/C — the same shape a
 * candidate meets at WORD. Every question is written against the Prawo o ruchu
 * drogowym as it stands after the 2021 amendments (50 km/h round the clock in
 * built-up areas, pedestrian priority on entering a crossing, 1 m when passing
 * a cyclist, the half-speed gap on motorways). `sourceRef` names the article so
 * a claim can be checked; nothing here is an official exam question.
 *
 * This is demo content. The licensed bank arrives through content.json and
 * replaces it wholesale; what this one has to get right is the format, so the
 * paper generator, the per-question clock and the TAK/NIE screens are exercised
 * for real before the full bank exists.
 */
import type { Question } from '@/types/content';

/** Shorthand rows: [id, text, correct, explanation, subtopic, sourceRef]. */
type BasicRow = [string, string, 'T' | 'N', string, string, string];
/** [id, text, [A, B, C], correct, explanation, subtopic, sourceRef]. */
type SpecialistRow = [string, string, [string, string, string], 'A' | 'B' | 'C', string, string, string];

const BASIC: Record<string, BasicRow[]> = {
  'zasady-ogolne': [
    ['zasady-ogolne-1', 'Czy uczestnik ruchu jest obowiązany zachować ostrożność albo — gdy ustawa tego wymaga — szczególną ostrożność?', 'T',
      'Ostrożność obowiązuje zawsze. Szczególna ostrożność to jej wyższy stopień, wymagany tam, gdzie przepis wprost tego żąda: przy przejściach, skrzyżowaniach, cofaniu, w tunelu.', 'Zasady ogólne', 'PoRD art. 3 ust. 1'],
    ['zasady-ogolne-2', 'Czy w Polsce obowiązuje ruch prawostronny?', 'T',
      'Kierujący jest obowiązany jechać możliwie blisko prawej krawędzi jezdni. Ruch lewostronny obowiązuje m.in. w Wielkiej Brytanii i Irlandii, nie w Polsce.', 'Zasady ogólne', 'PoRD art. 16 ust. 1–2'],
    ['zasady-ogolne-3', 'Czy „ustąpienie pierwszeństwa” oznacza powstrzymanie się od ruchu, jeżeli ruch mógłby zmusić innego kierującego do zmiany kierunku, pasa ruchu lub istotnej zmiany prędkości, a pieszego — do zatrzymania się, zwolnienia lub przyspieszenia kroku?', 'T',
      'To ustawowa definicja. Ustąpienie pierwszeństwa nie oznacza samego zwolnienia — oznacza, że drugi uczestnik ruchu nie musi niczego zmieniać z twojego powodu.', 'Definicje', 'PoRD art. 2 pkt 23'],
    ['zasady-ogolne-4', 'Czy kierujący pojazdem może podczas jazdy korzystać z telefonu wymagającego trzymania słuchawki lub mikrofonu w ręku?', 'N',
      'Zabronione jest korzystanie z telefonu wymagającego trzymania słuchawki lub mikrofonu w ręku. Zestaw głośnomówiący lub słuchawkowy jest dozwolony.', 'Zakazy', 'PoRD art. 45 ust. 2 pkt 1'],
    ['zasady-ogolne-5', 'Czy „droga twarda” to droga z jezdnią o nawierzchni bitumicznej, betonowej, kostkowej, klinkierowej lub brukowcowej?', 'T',
      'Droga twarda ma nawierzchnię bitumiczną, betonową, kostkową, klinkierową, brukowcową albo z płyt betonowych lub kamienno-betonowych. Wyjeżdżając z drogi gruntowej na twardą, włączasz się do ruchu.', 'Definicje', 'PoRD art. 2 pkt 2'],
  ],
  'znaki-ostrzegawcze': [
    ['znaki-ostrzegawcze-1', 'Czy znaki ostrzegawcze mają kształt trójkąta z czerwoną obwódką?', 'T',
      'Żółte tło i czerwona obwódka trójkąta to grupa A — ostrzeżenia. Sam kształt mówi „przed tobą coś jest”, zanim odczytasz symbol.', 'Znaki ostrzegawcze', 'Rozp. w sprawie znaków i sygnałów, § 3'],
    ['znaki-ostrzegawcze-2', 'Czy znak A-7 „ustąp pierwszeństwa” ma kształt trójkąta odwróconego wierzchołkiem w dół?', 'T',
      'A-7 to jedyny odwrócony trójkąt wśród znaków — rozpoznawalny nawet od tyłu i pod śniegiem. Nakazuje ustąpić pierwszeństwa na najbliższym skrzyżowaniu.', 'Znaki ostrzegawcze', 'Rozp. w sprawie znaków i sygnałów, § 5'],
    ['znaki-ostrzegawcze-3', 'Czy znak A-17 „dzieci” oznacza przejście dla pieszych?', 'N',
      'A-17 ostrzega o miejscu szczególnie uczęszczanym przez dzieci — przy szkole, placu zabaw. Przejście dla pieszych ma swój znak informacyjny D-6.', 'Znaki ostrzegawcze', 'Rozp. w sprawie znaków i sygnałów, § 15'],
    ['znaki-ostrzegawcze-4', 'Czy poza obszarem zabudowanym znak ostrzegawczy umieszcza się zazwyczaj w odległości 150–300 m przed miejscem niebezpiecznym?', 'T',
      'Poza obszarem zabudowanym 150–300 m, w obszarze zabudowanym do 100 m. Inną odległość podaje tabliczka T-1 pod znakiem.', 'Znaki ostrzegawcze', 'Rozp. w sprawie znaków i sygnałów, § 3 ust. 3'],
    ['znaki-ostrzegawcze-5', 'Czy tabliczka T-1 pod znakiem ostrzegawczym wskazuje odległość do miejsca niebezpiecznego?', 'T',
      'T-1 podaje odległość znaku od miejsca, o którym ostrzega, gdy jest inna niż standardowa. T-2 podaje długość odcinka, na którym niebezpieczeństwo występuje.', 'Tabliczki', 'Rozp. w sprawie znaków i sygnałów, § 3 ust. 4'],
  ],
  'znaki-zakazu': [
    ['znaki-zakazu-1', 'Czy znak B-1 „zakaz ruchu w obu kierunkach” obowiązuje również kierującego rowerem?', 'T',
      'B-1 dotyczy wszystkich pojazdów, rowerów też. Wyjątki wskazuje tabliczka pod znakiem, np. „nie dotyczy rowerów”. Rower można na tym odcinku prowadzić.', 'Znaki zakazu', 'Rozp. w sprawie znaków i sygnałów, § 16'],
    ['znaki-zakazu-2', 'Czy znak B-20 „stop” zobowiązuje do zatrzymania pojazdu także wtedy, gdy nie widać innych pojazdów?', 'T',
      'Zatrzymanie jest bezwarunkowe — przed linią P-12, a gdy jej nie ma, w miejscu, z którego widać skrzyżowanie. Pusta droga niczego nie zmienia.', 'Znaki zakazu', 'Rozp. w sprawie znaków i sygnałów, § 21'],
    ['znaki-zakazu-3', 'Czy znak B-36 „zakaz zatrzymywania się” dopuszcza postój pojazdu?', 'N',
      'B-36 zabrania zatrzymania i postoju. Postój jest przecież dłuższym zatrzymaniem — skoro nie wolno stanąć na chwilę, tym bardziej nie wolno na dłużej.', 'Znaki zakazu', 'Rozp. w sprawie znaków i sygnałów, § 28'],
    ['znaki-zakazu-4', 'Czy pod znakiem B-35 „zakaz postoju” wolno zatrzymać pojazd na czas nie dłuższy niż 1 minutę?', 'T',
      'B-35 zabrania tylko postoju. Zatrzymanie, czyli unieruchomienie do 1 minuty — np. żeby wysadzić pasażera — jest dozwolone.', 'Znaki zakazu', 'Rozp. w sprawie znaków i sygnałów, § 28'],
    ['znaki-zakazu-5', 'Czy znak B-33 „ograniczenie prędkości” obowiązuje do najbliższego skrzyżowania, jeżeli wcześniej nie został odwołany?', 'T',
      'Zakaz wyrażony znakiem B-33 obowiązuje do najbliższego skrzyżowania, do znaku B-34 „koniec ograniczenia” albo do znaku z inną wartością.', 'Znaki zakazu', 'Rozp. w sprawie znaków i sygnałów, § 32'],
  ],
  'znaki-nakazu': [
    ['znaki-nakazu-1', 'Czy znak C-12 „ruch okrężny” oznacza, że ruch na skrzyżowaniu odbywa się dookoła wyspy w kierunku wskazanym na znaku?', 'T',
      'C-12 nakazuje jazdę dookoła wyspy lub placu w kierunku strzałek. Najczęściej stoi razem z A-7 — wtedy wjeżdżający ustępuje pierwszeństwa będącym już na rondzie.', 'Znaki nakazu', 'Rozp. w sprawie znaków i sygnałów, § 36'],
    ['znaki-nakazu-2', 'Czy znak C-13 „droga dla rowerów” zobowiązuje kierującego rowerem do korzystania z tej drogi, jeżeli jest ona wyznaczona dla kierunku, w którym się porusza?', 'T',
      'Jeżeli droga dla rowerów prowadzi w twoim kierunku, masz obowiązek z niej korzystać. Jezdnia obok jest wtedy dla rowerzysty zamknięta.', 'Znaki nakazu', 'PoRD art. 33 ust. 1'],
    ['znaki-nakazu-3', 'Czy znak C-16 „droga dla pieszych” dopuszcza ruch samochodów osobowych?', 'N',
      'C-16 oznacza drogę tylko dla pieszych. Wjazd samochodem jest zabroniony, chyba że tabliczka dopuszcza wyjątek, np. dojazd do posesji.', 'Znaki nakazu', 'Rozp. w sprawie znaków i sygnałów, § 40'],
    ['znaki-nakazu-4', 'Czy znak C-2 „nakaz jazdy w prawo za znakiem” pozwala skręcić w lewo?', 'N',
      'C-2 nakazuje skręt w prawo za znakiem i wyklucza inne kierunki. Jazda na wprost lub w lewo jest niezgodna z nakazem.', 'Znaki nakazu', 'Rozp. w sprawie znaków i sygnałów, § 35'],
    ['znaki-nakazu-5', 'Czy znak C-14 „prędkość minimalna” oznacza, że nie wolno jechać wolniej niż wskazana wartość, chyba że wymagają tego warunki ruchu?', 'T',
      'C-14 zakazuje jazdy wolniej, niż podaje znak — o ile warunki ruchu lub jego bezpieczeństwo nie wymagają zmniejszenia prędkości. Korek nie jest wykroczeniem.', 'Znaki nakazu', 'Rozp. w sprawie znaków i sygnałów, § 38'],
  ],
  'znaki-informacyjne': [
    ['znaki-informacyjne-1', 'Czy znak D-1 „droga z pierwszeństwem” oznacza początek lub kontynuację drogi z pierwszeństwem?', 'T',
      'D-1 informuje, że jedziesz drogą z pierwszeństwem — na skrzyżowaniach ustępują ci pojazdy z dróg podporządkowanych. Koniec takiej drogi oznacza D-2.', 'Znaki informacyjne', 'Rozp. w sprawie znaków i sygnałów, § 44'],
    ['znaki-informacyjne-2', 'Czy zbliżając się do przejścia oznaczonego znakiem D-6, kierujący jest obowiązany zmniejszyć prędkość tak, aby nie narazić na niebezpieczeństwo pieszego?', 'T',
      'D-6 to nie tylko informacja. Przed przejściem obowiązuje szczególna ostrożność i taka prędkość, która pozwoli ustąpić pieszemu wchodzącemu na przejście.', 'Znaki informacyjne', 'PoRD art. 26 ust. 1'],
    ['znaki-informacyjne-3', 'Czy za znakiem D-42 „obszar zabudowany” obowiązuje prędkość 50 km/h, jeżeli inny znak nie stanowi inaczej?', 'T',
      'D-42 włącza limit obszaru zabudowanego: 50 km/h przez całą dobę. Wyższą lub niższą wartość może wprowadzić tylko znak B-33.', 'Znaki informacyjne', 'PoRD art. 20 ust. 1'],
    ['znaki-informacyjne-4', 'Czy znak D-7 „droga ekspresowa” oznacza, że samochód osobowy może na niej jechać z prędkością 140 km/h?', 'N',
      '140 km/h obowiązuje na autostradzie (D-9). Na drodze ekspresowej dwujezdniowej limit wynosi 120 km/h, a na jednojezdniowej 100 km/h.', 'Znaki informacyjne', 'PoRD art. 20 ust. 3'],
    ['znaki-informacyjne-5', 'Czy drogowskazy na autostradzie mają niebieskie tło?', 'T',
      'Na autostradach znaki kierunku mają tło niebieskie, na pozostałych drogach zielone. Kolor od razu mówi, na jaką drogę prowadzi zjazd.', 'Znaki kierunku', 'Rozp. w sprawie znaków i sygnałów, § 61'],
  ],
  'znaki-poziome': [
    ['znaki-poziome-1', 'Czy linia pojedyncza ciągła P-2 oznacza zakaz przejeżdżania przez nią i najeżdżania na nią?', 'T',
      'P-2 rozdziela pasy ruchu i zabrania jej przekraczania oraz najeżdżania. Wyprzedzanie przez linię ciągłą jest wykroczeniem, nawet gdy droga jest pusta.', 'Znaki poziome', 'Rozp. w sprawie znaków i sygnałów, § 86'],
    ['znaki-poziome-2', 'Czy linię pojedynczą przerywaną P-1 wolno przekraczać?', 'T',
      'Linia przerywana rozdziela pasy i można ją przekraczać — przy zmianie pasa, wyprzedzaniu, omijaniu — o ile jest to bezpieczne.', 'Znaki poziome', 'Rozp. w sprawie znaków i sygnałów, § 86'],
    ['znaki-poziome-3', 'Czy strzałki kierunkowe P-8 na jezdni są tylko zaleceniem, którego można nie stosować?', 'N',
      'Strzałka na pasie nakazuje jazdę w wyznaczonym kierunku. Z pasa „w lewo” nie wolno pojechać na wprost, choćby był pusty.', 'Znaki poziome', 'Rozp. w sprawie znaków i sygnałów, § 87'],
    ['znaki-poziome-4', 'Czy tabliczka T-6a pod znakiem A-6 pokazuje rzeczywisty przebieg drogi z pierwszeństwem przez skrzyżowanie?', 'T',
      'Gruba linia na T-6a to droga z pierwszeństwem, cienkie to podporządkowane. Gdy pierwszeństwo skręca, kierujący jadący nim na wprost musi włączyć kierunkowskaz.', 'Tabliczki', 'Rozp. w sprawie znaków i sygnałów, § 3 ust. 5'],
    ['znaki-poziome-5', 'Czy znak P-10 „przejście dla pieszych” to białe pasy na jezdni, tzw. zebra?', 'T',
      'P-10 wyznacza przejście na jezdni. Zatrzymanie pojazdu na nim oraz w odległości mniejszej niż 10 m przed nim jest zabronione.', 'Znaki poziome', 'Rozp. w sprawie znaków i sygnałów, § 89'],
  ],
  'sygnalizacja': [
    ['sygnalizacja-1', 'Czy sygnał żółty ciągły zabrania wjazdu za sygnalizator, chyba że pojazd jest tak blisko, że nie da się go zatrzymać bez gwałtownego hamowania?', 'T',
      'Żółty to zakaz wjazdu, nie zaproszenie do przyspieszenia. Jedyny wyjątek: gdy zatrzymanie wymagałoby gwałtownego hamowania.', 'Sygnały świetlne', 'Rozp. w sprawie znaków i sygnałów, § 95'],
    ['sygnalizacja-2', 'Czy zielona strzałka (sygnał S-2) pozwala skręcić bez zatrzymania się przed sygnalizatorem?', 'N',
      'Przy S-2 najpierw zatrzymujesz się przed sygnalizatorem, potem ustępujesz pieszym i pojazdom i dopiero wtedy skręcasz. Przejazd bez zatrzymania to wykroczenie.', 'Sygnały świetlne', 'Rozp. w sprawie znaków i sygnałów, § 96'],
    ['sygnalizacja-3', 'Czy migający sygnał żółty zobowiązuje do zachowania szczególnej ostrożności i stosowania się do znaków drogowych?', 'T',
      'Migający żółty oznacza, że sygnalizacja nie kieruje ruchem. Obowiązują wtedy znaki i ogólne zasady pierwszeństwa, przy szczególnej ostrożności.', 'Sygnały świetlne', 'Rozp. w sprawie znaków i sygnałów, § 95 ust. 3'],
    ['sygnalizacja-4', 'Czy polecenia i sygnały osoby kierującej ruchem mają pierwszeństwo przed sygnałami świetlnymi i znakami drogowymi?', 'T',
      'Kolejność jest ustawowa: polecenia kierującego ruchem, potem sygnały świetlne, potem znaki, na końcu przepisy ogólne. Policjant na skrzyżowaniu unieważnia światła.', 'Kierujący ruchem', 'PoRD art. 5 ust. 2'],
    ['sygnalizacja-5', 'Czy ręka policjanta kierującego ruchem uniesiona do góry oznacza zezwolenie na wjazd na skrzyżowanie?', 'N',
      'Ręka uniesiona w górę odpowiada sygnałowi żółtemu: zapowiada zmianę i zabrania wjazdu na skrzyżowanie. Zezwoleniem jest postawa bokiem do kierunku jazdy.', 'Kierujący ruchem', 'Rozp. w sprawie znaków i sygnałów, § 108'],
  ],
  'pierwszenstwo': [
    ['pierwszenstwo-1', 'Czy na skrzyżowaniu równorzędnym kierujący ustępuje pierwszeństwa pojazdowi nadjeżdżającemu z prawej strony?', 'T',
      'Bez znaków i sygnalizacji obowiązuje reguła prawej ręki. Skręcając w lewo, ustępujesz dodatkowo pojazdowi z naprzeciwka jadącemu na wprost lub w prawo.', 'Skrzyżowania równorzędne', 'PoRD art. 25 ust. 1'],
    ['pierwszenstwo-2', 'Czy na skrzyżowaniu równorzędnym tramwaj ma pierwszeństwo przed samochodem także wtedy, gdy nadjeżdża z lewej strony?', 'T',
      'Pojazd szynowy ma na skrzyżowaniu równorzędnym pierwszeństwo bez względu na to, z której strony nadjeżdża. Reguła prawej ręki go nie dotyczy.', 'Tramwaje', 'PoRD art. 25 ust. 2'],
    ['pierwszenstwo-3', 'Czy skręcając w lewo, kierujący jest obowiązany ustąpić pierwszeństwa pojazdowi jadącemu z kierunku przeciwnego na wprost?', 'T',
      'Skręt w lewo przecina tor pojazdów z naprzeciwka. Ustępujesz tym, którzy jadą na wprost i tym, którzy skręcają w prawo.', 'Skręt w lewo', 'PoRD art. 25 ust. 1'],
    ['pierwszenstwo-4', 'Czy wyjeżdżając z drogi gruntowej na drogę twardą, kierujący ma pierwszeństwo przed pojazdem jadącym drogą twardą?', 'N',
      'Wjazd z drogi gruntowej na twardą to włączanie się do ruchu. Włączający się ustępuje pierwszeństwa wszystkim, nawet jeśli nadjeżdżają z lewej.', 'Włączanie się do ruchu', 'PoRD art. 17 ust. 1 pkt 1'],
    ['pierwszenstwo-5', 'Czy pojazd uprzywilejowany z włączonymi sygnałami świetlnymi i dźwiękowymi może wjechać na skrzyżowanie przy czerwonym świetle?', 'T',
      'Pojazd uprzywilejowany może nie stosować się do sygnałów i znaków, jeśli zachowa szczególną ostrożność. Pozostali mają obowiązek ułatwić mu przejazd.', 'Pojazdy uprzywilejowane', 'PoRD art. 53 ust. 2'],
  ],
  'wlaczanie-zmiana': [
    ['wlaczanie-zmiana-1', 'Czy wyjeżdżając z posesji na drogę, kierujący włącza się do ruchu i musi ustąpić pierwszeństwa innym uczestnikom ruchu?', 'T',
      'Wyjazd z nieruchomości, parkingu, strefy zamieszkania czy drogi gruntowej to włączanie się do ruchu: ustępujesz pierwszeństwa pojazdom i pieszym.', 'Włączanie się do ruchu', 'PoRD art. 17'],
    ['wlaczanie-zmiana-2', 'Czy zamiar zmiany pasa ruchu należy sygnalizować kierunkowskazem zawczasu i wyraźnie?', 'T',
      'Kierunkowskaz włączasz przed manewrem, nie w jego trakcie, i wyłączasz zaraz po jego zakończeniu. Sygnał ma dać innym czas na reakcję.', 'Zmiana pasa', 'PoRD art. 22 ust. 5'],
    ['wlaczanie-zmiana-3', 'Czy kierujący zmieniający pas ruchu ma pierwszeństwo przed pojazdem jadącym tym pasem?', 'N',
      'Zmieniający pas ustępuje pierwszeństwa pojazdowi, który już tym pasem jedzie. Kierunkowskaz sygnalizuje zamiar, nie daje pierwszeństwa.', 'Zmiana pasa', 'PoRD art. 22 ust. 4'],
    ['wlaczanie-zmiana-4', 'Czy zawracanie w tunelu jest dozwolone?', 'N',
      'Zawracanie jest zabronione w tunelu, na moście, wiadukcie oraz na autostradzie i drodze ekspresowej — poza skrzyżowaniem lub miejscem do tego wyznaczonym.', 'Zawracanie', 'PoRD art. 22 ust. 6'],
    ['wlaczanie-zmiana-5', 'Czy przed skrętem w lewo na jezdni dwukierunkowej należy zbliżyć się do środka jezdni?', 'T',
      'Przed skrętem w lewo zjeżdżasz do środka jezdni dwukierunkowej lub do lewej krawędzi jednokierunkowej. Przed skrętem w prawo — do prawej krawędzi.', 'Zmiana kierunku', 'PoRD art. 22 ust. 2'],
  ],
  'wyprzedzanie': [
    ['wyprzedzanie-1', 'Czy wyprzedzanie na przejściu dla pieszych i bezpośrednio przed nim jest zabronione?', 'T',
      'Na przejściu i przed nim zakaz wyprzedzania jest bezwzględny, z wyjątkiem przejścia, na którym ruch jest kierowany. Wyprzedzany pojazd zasłania pieszego.', 'Zakazy wyprzedzania', 'PoRD art. 26 ust. 3 pkt 1'],
    ['wyprzedzanie-2', 'Czy wyprzedzając rowerzystę, kierujący pojazdem silnikowym musi zachować odstęp co najmniej 1 m?', 'T',
      'Od 2021 r. ustawa podaje konkretną wartość: co najmniej 1 m od roweru, hulajnogi i pieszego na jezdni. Wcześniej był tylko „bezpieczny odstęp”.', 'Odstęp', 'PoRD art. 24 ust. 2'],
    ['wyprzedzanie-3', 'Czy wolno wyprzedzać z lewej strony pojazd, który sygnalizuje zamiar skrętu w lewo?', 'N',
      'Pojazd sygnalizujący skręt w lewo wyprzedza się tylko z prawej strony. Wyprzedzanie z lewej prowadzi wprost pod skręcające auto.', 'Sposób wyprzedzania', 'PoRD art. 24 ust. 5'],
    ['wyprzedzanie-4', 'Czy omijanie to przejeżdżanie obok nieporuszającego się pojazdu, uczestnika ruchu lub przeszkody?', 'T',
      'Omijanie dotyczy tego, co stoi; wyprzedzanie — tego, co jedzie; wymijanie — tego, co jedzie z naprzeciwka. Na każde z nich obowiązują inne zakazy.', 'Definicje', 'PoRD art. 2 pkt 27'],
    ['wyprzedzanie-5', 'Czy wyprzedzanie na skrzyżowaniu jest zabronione, z wyjątkiem skrzyżowania o ruchu okrężnym lub takiego, na którym ruch jest kierowany?', 'T',
      'Zakaz obejmuje skrzyżowania i miejsca bezpośrednio przed nimi. Wyjątkiem są ronda oraz skrzyżowania z sygnalizacją lub kierującym ruchem.', 'Zakazy wyprzedzania', 'PoRD art. 24 ust. 7 pkt 3'],
  ],
  'predkosc': [
    ['predkosc-1', 'Czy dopuszczalna prędkość samochodu osobowego w obszarze zabudowanym wynosi 50 km/h przez całą dobę?', 'T',
      'Od 1 czerwca 2021 r. limit 50 km/h obowiązuje całą dobę. Wcześniejsze 60 km/h w godzinach 23:00–5:00 zostało zniesione — i wciąż jest jedną z najczęstszych pomyłek.', 'Limity prędkości', 'PoRD art. 20 ust. 1'],
    ['predkosc-2', 'Czy w strefie zamieszkania dopuszczalna prędkość wynosi 20 km/h?', 'T',
      'W strefie zamieszkania (znak D-40) obowiązuje 20 km/h, pieszy ma pierwszeństwo na całej szerokości drogi, a postój jest dozwolony tylko w miejscach wyznaczonych.', 'Limity prędkości', 'PoRD art. 20 ust. 2'],
    ['predkosc-3', 'Czy na autostradzie samochód osobowy może jechać z prędkością 140 km/h?', 'T',
      '140 km/h to limit dla samochodu osobowego, motocykla i ciężarowego do 3,5 t na autostradzie. Zespół pojazdów z przyczepą — 80 km/h.', 'Limity prędkości', 'PoRD art. 20 ust. 3 pkt 1'],
    ['predkosc-4', 'Czy na drodze ekspresowej jednojezdniowej dopuszczalna prędkość samochodu osobowego wynosi 120 km/h?', 'N',
      'Na ekspresowej jednojezdniowej obowiązuje 100 km/h. 120 km/h dotyczy ekspresowej dwujezdniowej i drogi dwujezdniowej o co najmniej dwóch pasach w każdą stronę.', 'Limity prędkości', 'PoRD art. 20 ust. 3'],
    ['predkosc-5', 'Czy na autostradzie i drodze ekspresowej kierujący musi zachować odstęp od poprzedzającego pojazdu nie mniejszy niż połowa prędkości wyrażonej w metrach?', 'T',
      'Przy 100 km/h to co najmniej 50 m, przy 140 km/h — 70 m. Zasada nie obowiązuje podczas manewru wyprzedzania.', 'Odstęp', 'PoRD art. 19 ust. 3a'],
  ],
  'zatrzymanie-postoj': [
    ['zatrzymanie-postoj-1', 'Czy zabronione jest zatrzymanie pojazdu w odległości mniejszej niż 10 m przed przejściem dla pieszych?', 'T',
      'Stojący pojazd przed przejściem zasłania pieszego. Dlatego zakaz obejmuje samo przejście i 10 m przed nim, a na drodze dwukierunkowej o dwóch pasach także 10 m za nim.', 'Zakazy zatrzymania', 'PoRD art. 49 ust. 1 pkt 2'],
    ['zatrzymanie-postoj-2', 'Czy wolno zatrzymać pojazd w odległości 5 m od skrzyżowania?', 'N',
      'Zakaz zatrzymania obowiązuje na skrzyżowaniu i w odległości mniejszej niż 10 m od niego. 5 m to za blisko — pojazd ogranicza widoczność na skrzyżowaniu.', 'Zakazy zatrzymania', 'PoRD art. 49 ust. 1 pkt 1'],
    ['zatrzymanie-postoj-3', 'Czy postój samochodu osobowego na chodniku jest dopuszczalny, jeżeli dla pieszych pozostaje co najmniej 1,5 m szerokości i pojazd nie utrudnia im ruchu?', 'T',
      'Warunki są trzy: masa do 2,5 t, co najmniej 1,5 m chodnika dla pieszych i brak utrudnienia ruchu. Bez ich spełnienia chodnik jest dla pieszych.', 'Postój na chodniku', 'PoRD art. 47 ust. 1'],
    ['zatrzymanie-postoj-4', 'Czy zatrzymanie pojazdu to jego unieruchomienie niewynikające z warunków lub przepisów ruchu, trwające nie dłużej niż 1 minutę?', 'T',
      'Granicą jest minuta: do niej — zatrzymanie, powyżej — postój. Rozróżnienie decyduje o tym, który znak zakazu cię dotyczy.', 'Definicje', 'PoRD art. 2 pkt 29–30'],
    ['zatrzymanie-postoj-5', 'Czy wolno zatrzymać pojazd w tunelu?', 'N',
      'Zatrzymanie w tunelu, na moście i na wiadukcie jest zabronione. Wyjątkiem jest awaria — wtedy pojazd trzeba oznaczyć i jak najszybciej usunąć.', 'Zakazy zatrzymania', 'PoRD art. 49 ust. 1 pkt 10'],
  ],
  'piesi-rowerzysci': [
    ['piesi-rowerzysci-1', 'Czy pieszy wchodzący na przejście dla pieszych ma pierwszeństwo przed pojazdem, z wyłączeniem tramwaju?', 'T',
      'Od 1 czerwca 2021 r. pierwszeństwo ma już pieszy wchodzący na przejście, nie tylko znajdujący się na nim. Tramwaju to nie dotyczy — nie zdąży wyhamować.', 'Przejścia dla pieszych', 'PoRD art. 13 ust. 1a'],
    ['piesi-rowerzysci-2', 'Czy kierujący zbliżający się do przejścia dla pieszych musi zmniejszyć prędkość tak, aby nie narazić na niebezpieczeństwo pieszego wchodzącego na przejście?', 'T',
      'Prędkość przed przejściem ma pozwolić na ustąpienie pieszemu, który dopiero wchodzi. Jazda „na tempo” obok przejścia to wykroczenie, nawet bez kolizji.', 'Przejścia dla pieszych', 'PoRD art. 26 ust. 1'],
    ['piesi-rowerzysci-3', 'Czy kierujący rowerem może jechać po chodniku, jeżeli opiekuje się osobą w wieku do 10 lat kierującą rowerem?', 'T',
      'To jeden z trzech wyjątków. Pozostałe: chodnik o szerokości co najmniej 2 m przy drodze z limitem powyżej 50 km/h oraz bardzo złe warunki pogodowe.', 'Rowerzyści', 'PoRD art. 33 ust. 5'],
    ['piesi-rowerzysci-4', 'Czy wolno objeżdżać opuszczone zapory na przejeździe kolejowym?', 'N',
      'Objeżdżanie opuszczonych lub opuszczających się zapór jest zabronione, podobnie jak wjazd na przejazd, gdy nie ma za nim miejsca na kontynuację jazdy.', 'Przejazdy kolejowe', 'PoRD art. 28 ust. 3'],
    ['piesi-rowerzysci-5', 'Czy pieszy wchodzący na jezdnię lub przechodzący przez nią ma obowiązek zachować szczególną ostrożność i nie może korzystać z telefonu w sposób ograniczający obserwację drogi?', 'T',
      'Pierwszeństwo pieszego przyszło razem z obowiązkiem: zakazem używania telefonu na przejściu w sposób, który odciąga uwagę od drogi.', 'Piesi', 'PoRD art. 14 pkt 8'],
  ],
  'sytuacje-szczegolne': [
    ['sytuacje-szczegolne-1', 'Czy tylnych świateł przeciwmgłowych wolno używać tylko wtedy, gdy widoczność spadła poniżej 50 m?', 'T',
      'Tylne przeciwmgłowe są oślepiająco jasne; włącza się je poniżej 50 m widoczności i wyłącza, gdy poprawi się ona. Przednich można używać przy każdej mgle.', 'Mgła', 'PoRD art. 30 ust. 3'],
    ['sytuacje-szczegolne-2', 'Czy w Polsce świateł mijania używa się przez całą dobę, także w dzień przy dobrej widoczności?', 'T',
      'Światła mijania obowiązują całą dobę i cały rok. W dzień, przy dobrej pogodzie, mogą je zastąpić światła do jazdy dziennej.', 'Oświetlenie', 'PoRD art. 51 ust. 1'],
    ['sytuacje-szczegolne-3', 'Czy na mokrej nawierzchni droga hamowania samochodu wydłuża się?', 'T',
      'Woda obniża przyczepność — droga hamowania rośnie nawet dwukrotnie. Przy większej warstwie wody koła mogą stracić kontakt z jezdnią (aquaplaning).', 'Trudne warunki', 'Technika jazdy'],
    ['sytuacje-szczegolne-4', 'Czy w razie unieruchomienia pojazdu na autostradzie trójkąt ostrzegawczy ustawia się w odległości 100 m za pojazdem?', 'T',
      'Na autostradzie i drodze ekspresowej 100 m, na innych drogach poza obszarem zabudowanym 30–50 m, w obszarze zabudowanym za pojazdem lub na nim.', 'Awaria', 'PoRD art. 50 ust. 1'],
    ['sytuacje-szczegolne-5', 'Czy oślepiony przez pojazd z naprzeciwka kierujący powinien zjechać do prawej krawędzi jezdni i w razie potrzeby zatrzymać się?', 'T',
      'Oślepienie to kilka sekund jazdy na ślepo. Zwalniasz, trzymasz się prawej strony, patrzysz na prawą krawędź jezdni, a nie w reflektory.', 'Trudne warunki', 'Technika jazdy'],
  ],
  'pierwsza-pomoc': [
    ['pierwsza-pomoc-1', 'Czy numer alarmowy 112 działa w Polsce także z telefonu bez karty SIM?', 'T',
      '112 jest bezpłatny i łączy z centrum powiadamiania ratunkowego z każdego telefonu — również bez karty SIM i bez środków na koncie.', 'Wezwanie pomocy', 'Ustawa o systemie powiadamiania ratunkowego'],
    ['pierwsza-pomoc-2', 'Czy podczas resuscytacji dorosłego klatkę piersiową uciska się z częstotliwością 100–120 uciśnięć na minutę?', 'T',
      '30 uciśnięć na głębokość 5–6 cm, potem 2 wdechy. Tempo 100–120 na minutę — mniej więcej rytm szybkiej piosenki. Bez przerw dłuższych niż 10 s.', 'Resuscytacja', 'Wytyczne ERC'],
    ['pierwsza-pomoc-3', 'Czy nieprzytomną osobę, która oddycha, należy ułożyć w pozycji bocznej bezpiecznej?', 'T',
      'Pozycja boczna chroni drogi oddechowe przed zapadaniem się języka i zachłyśnięciem. Co minutę sprawdzaj, czy poszkodowany nadal oddycha.', 'Nieprzytomny', 'Wytyczne ERC'],
    ['pierwsza-pomoc-4', 'Czy motocykliście po wypadku należy zawsze natychmiast zdjąć kask?', 'N',
      'Kask zdejmuje się tylko wtedy, gdy poszkodowany nie oddycha i trzeba rozpocząć resuscytację. Inaczej ryzykujesz uszkodzenie kręgosłupa szyjnego.', 'Motocykliści', 'Wytyczne ERC'],
    ['pierwsza-pomoc-5', 'Czy nieudzielenie pomocy osobie w stanie zagrożenia życia jest w Polsce przestępstwem?', 'T',
      'Kodeks karny przewiduje do 3 lat pozbawienia wolności. Obowiązek nie wymaga narażania siebie — czasem wystarczy wezwać pomoc i zabezpieczyć miejsce.', 'Obowiązek pomocy', 'Kodeks karny art. 162'],
  ],
  'ekologia': [
    ['ekologia-1', 'Czy zbyt niskie ciśnienie w oponach zwiększa zużycie paliwa?', 'T',
      'Niedopompowana opona ma większy opór toczenia: więcej paliwa, szybsze zużycie bieżnika i dłuższa droga hamowania. Ciśnienie sprawdza się na zimnych oponach.', 'Eksploatacja', 'Eco-driving'],
    ['ekologia-2', 'Czy podczas postoju w obszarze zabudowanym zabronione jest pozostawianie pracującego silnika?', 'T',
      'Przepis zabrania pozostawiania pracującego silnika podczas postoju w obszarze zabudowanym. Wyjątek: gdy silnik zasila urządzenie pojazdu specjalnego.', 'Emisja spalin', 'PoRD art. 60 ust. 2 pkt 3'],
    ['ekologia-3', 'Czy jazda na wysokich obrotach silnika zmniejsza zużycie paliwa?', 'N',
      'Ekonomiczna jazda to wczesna zmiana biegów na wyższy i utrzymywanie niskich obrotów. Wysokie obroty to więcej paliwa, hałasu i spalin.', 'Eco-driving', 'Eco-driving'],
    ['ekologia-4', 'Czy bagażnik dachowy zwiększa opór powietrza i zużycie paliwa?', 'T',
      'Pusty bagażnik dachowy potrafi zwiększyć zużycie paliwa o kilkanaście procent na autostradzie. Zdejmij go, gdy go nie używasz.', 'Eco-driving', 'Eco-driving'],
    ['ekologia-5', 'Czy kierujący ma obowiązek ułatwić przejazd pojazdowi uprzywilejowanemu, w szczególności przez niezwłoczne usunięcie się z jego drogi?', 'T',
      'Ułatwienie przejazdu oznacza zjazd na bok, a w korku utworzenie korytarza życia. Jazda za pojazdem uprzywilejowanym „na jego światłach” jest zabroniona.', 'Kultura jazdy', 'PoRD art. 9'],
  ],
};

const SPECIALIST: Record<string, SpecialistRow[]> = {
  'technika-manewry': [
    ['technika-manewry-1', 'Podczas jazdy w deszczu wraz ze wzrostem prędkości przyczepność opon do nawierzchni:',
      ['rośnie', 'maleje', 'nie zmienia się'], 'B',
      'Im szybciej jedziesz, tym mniej wody bieżnik zdąży odprowadzić. Przyczepność spada, a przy większej prędkości koło może unieść się na warstwie wody.', 'Trudne warunki', 'Technika jazdy'],
    ['technika-manewry-2', 'Prawidłowe ułożenie rąk na kierownicy podczas jazdy to:',
      ['„za kwadrans trzecia” — na wysokości godzin 9 i 3', '„dziesięć po dziesiątej” — na wysokości godzin 10 i 2', 'obie ręce u góry koła kierownicy'], 'A',
      'Chwyt na godzinach 9 i 3 daje największą kontrolę i trzyma ręce poza torem poduszki powietrznej. Wyższy chwyt to sposób sprzed epoki poduszek.', 'Technika kierowania', 'Technika jazdy'],
    ['technika-manewry-3', 'Podczas hamowania awaryjnego samochodem z ABS należy:',
      ['naciskać pedał hamulca pulsacyjnie', 'nacisnąć pedał hamulca mocno i nieprzerwanie', 'wcisnąć sprzęgło i zwolnić hamulec'], 'B',
      'Pulsowanie w pedale to praca ABS, nie sygnał do puszczenia. Hamujesz mocno do końca i jednocześnie kierujesz — system zachowuje sterowność.', 'Hamowanie', 'Technika jazdy'],
    ['technika-manewry-4', 'Na długim, stromym zjeździe należy:',
      ['hamować silnikiem, jadąc na niższym biegu', 'jechać na luzie, aby oszczędzać paliwo', 'trzymać nogę na hamulcu przez cały zjazd'], 'A',
      'Ciągłe hamowanie przegrzewa hamulce, aż przestaną działać. Niższy bieg pozwala silnikowi utrzymać prędkość, a hamulca używasz tylko do korekty.', 'Technika kierowania', 'Technika jazdy'],
    ['technika-manewry-5', 'Przed rozpoczęciem cofania kierujący jest obowiązany:',
      ['włączyć światła awaryjne', 'upewnić się, że nie spowoduje zagrożenia, a w razie potrzeby zapewnić sobie pomoc innej osoby', 'użyć sygnału dźwiękowego'], 'B',
      'Cofanie wymaga szczególnej ostrożności: sprawdzasz, czy za pojazdem nikogo nie ma, i w razie potrzeby prosisz kogoś o kierowanie. Cofanie w tunelu i na autostradzie jest zabronione.', 'Cofanie', 'PoRD art. 23 ust. 1 pkt 3'],
  ],
  'warunki-techniczne': [
    ['warunki-techniczne-1', 'Minimalna dopuszczalna głębokość bieżnika opony samochodu osobowego wynosi:',
      ['1,6 mm', '3 mm', '0,8 mm'], 'A',
      'Prawo wymaga 1,6 mm, ale na mokrej drodze opona poniżej 3 mm hamuje wyraźnie gorzej. Wskaźniki zużycia (TWI) w rowkach pokazują granicę 1,6 mm.', 'Opony', 'Rozp. w sprawie warunków technicznych pojazdów, § 11'],
    ['warunki-techniczne-2', 'Światła mijania powinny oświetlać drogę na odległość co najmniej:',
      ['20 m', '40 m', '100 m'], 'B',
      'Mijania: co najmniej 40 m, drogowe: co najmniej 100 m. Przy 90 km/h pojazd pokonuje 25 m w sekundę — 40 m to niecałe dwie sekundy reakcji.', 'Oświetlenie', 'Rozp. w sprawie warunków technicznych pojazdów, § 12'],
    ['warunki-techniczne-3', 'Kontrolka ciśnienia oleju, która zapala się podczas jazdy, oznacza, że należy:',
      ['dojechać do najbliższej stacji obsługi', 'niezwłocznie zatrzymać się i wyłączyć silnik', 'zwiększyć obroty silnika'], 'B',
      'Czerwona lampka oleju to brak smarowania. Każdy kilometr dalej może oznaczać zatarty silnik — zatrzymujesz się, gasisz i sprawdzasz poziom oleju.', 'Kontrolki', 'Eksploatacja'],
    ['warunki-techniczne-4', 'Pierwsze okresowe badanie techniczne nowego samochodu osobowego przeprowadza się przed upływem:',
      ['1 roku od pierwszej rejestracji', '2 lat od pierwszej rejestracji', '3 lat od pierwszej rejestracji'], 'C',
      'Nowe auto: pierwszy przegląd po 3 latach, drugi po kolejnych 2, potem co roku. Termin jest wpisany w dowodzie rejestracyjnym.', 'Badania techniczne', 'PoRD art. 81'],
    ['warunki-techniczne-5', 'Nadmierny luz na kole kierownicy wpływa przede wszystkim na:',
      ['zużycie paliwa', 'precyzję prowadzenia pojazdu', 'skuteczność hamowania'], 'B',
      'Luz w układzie kierowniczym opóźnia reakcję kół na ruch kierownicy — pojazd „pływa” na prostej i spóźnia się w zakręcie. To usterka do natychmiastowej naprawy.', 'Układ kierowniczy', 'Eksploatacja'],
  ],
  'wyposazenie': [
    ['wyposazenie-1', 'Obowiązkowym wyposażeniem samochodu osobowego w Polsce jest:',
      ['apteczka', 'gaśnica i trójkąt ostrzegawczy', 'kamizelka odblaskowa'], 'B',
      'Wymagane są gaśnica i trójkąt ostrzegawczy. Apteczka i kamizelka są tylko zalecane — choć za granicą, np. w Niemczech czy Austrii, bywają obowiązkowe.', 'Wyposażenie obowiązkowe', 'Rozp. w sprawie warunków technicznych pojazdów, § 11'],
    ['wyposazenie-2', 'Dziecko o wzroście poniżej 150 cm przewozi się w samochodzie osobowym:',
      ['w foteliku lub innym urządzeniu przytrzymującym dobranym do jego masy i wzrostu', 'na przednim siedzeniu bez fotelika, w pasach', 'na kolanach dorosłego pasażera'], 'A',
      'Poniżej 150 cm wzrostu obowiązuje fotelik lub inne urządzenie przytrzymujące. Wyjątek: dziecko powyżej 135 cm na tylnym siedzeniu, gdy fotelik się nie mieści.', 'Przewóz dzieci', 'PoRD art. 39 ust. 3'],
    ['wyposazenie-3', 'Przewożenie dziecka w foteliku zwróconym tyłem do kierunku jazdy na przednim siedzeniu jest dozwolone:',
      ['zawsze', 'tylko wtedy, gdy poduszka powietrzna pasażera jest wyłączona', 'nigdy'], 'B',
      'Poduszka otwiera się z siłą, która przy foteliku tyłem do kierunku jazdy uderza prosto w dziecko. Fotelik tyłem z przodu tylko przy wyłączonej poduszce.', 'Przewóz dzieci', 'PoRD art. 39 ust. 3b'],
    ['wyposazenie-4', 'Ładunek wystający z tyłu pojazdu na odległość większą niż 0,5 m należy oznaczyć:',
      ['czerwoną chorągiewką, a w nocy czerwonym światłem lub odblaskiem', 'tabliczką z napisem „ładunek”', 'nie wymaga oznaczenia'], 'A',
      'Wystający ładunek oznacza się chorągiewką barwy czerwonej o wymiarach co najmniej 50 × 50 cm, a po zmroku dodatkowo czerwonym światłem lub światłem odblaskowym.', 'Ładunek', 'PoRD art. 61 ust. 8'],
    ['wyposazenie-5', 'Kamizelka odblaskowa w samochodzie osobowym jest w Polsce:',
      ['obowiązkowa przez cały rok', 'nieobowiązkowa, ale zalecana', 'obowiązkowa tylko od listopada do marca'], 'B',
      'Polskie przepisy nie wymagają kamizelki w samochodzie osobowym. Pieszy poza obszarem zabudowanym po zmroku musi jednak nosić element odblaskowy.', 'Wyposażenie zalecane', 'Rozp. w sprawie warunków technicznych pojazdów'],
  ],
  'dokumenty': [
    ['dokumenty-1', 'Kierujący samochodem osobowym zarejestrowanym w Polsce podczas kontroli drogowej:',
      ['musi mieć przy sobie prawo jazdy, dowód rejestracyjny i polisę OC', 'nie musi mieć przy sobie prawa jazdy ani dowodu rejestracyjnego — policja sprawdza je w systemie', 'musi mieć przy sobie tylko dowód rejestracyjny'], 'B',
      'Od 2018 r. dowód rejestracyjny i OC, a od grudnia 2020 r. także polskie prawo jazdy sprawdzane są w CEPiK. Wystarczy dokument tożsamości. Zagraniczne prawo jazdy trzeba mieć przy sobie.', 'Dokumenty', 'PoRD art. 38'],
    ['dokumenty-2', 'Dopuszczalna zawartość alkoholu we krwi kierującego wynosi mniej niż:',
      ['0,2‰', '0,5‰', '0,8‰'], 'A',
      'Od 0,2‰ to stan po użyciu alkoholu (wykroczenie), od 0,5‰ — stan nietrzeźwości (przestępstwo). Jedno piwo może już przekroczyć 0,2‰.', 'Alkohol', 'PoRD art. 45; Ustawa o wychowaniu w trzeźwości art. 46'],
    ['dokumenty-3', 'Okres próbny dla osoby, która po raz pierwszy uzyskała prawo jazdy kategorii B, trwa:',
      ['1 rok', '2 lata', '3 lata'], 'B',
      'Przez 2 lata od wydania prawa jazdy obowiązują ostrzejsze zasady: dwa wykroczenia wydłużają okres próbny, trzy — cofają uprawnienia.', 'Okres próbny', 'Ustawa o kierujących pojazdami art. 91'],
    ['dokumenty-4', 'Kierujący uczestniczący w wypadku drogowym, w którym są ranni, jest obowiązany:',
      ['niezwłocznie odjechać, aby nie tamować ruchu', 'udzielić pomocy ofiarom oraz wezwać pogotowie i policję', 'usunąć pojazdy z jezdni przed przybyciem policji'], 'B',
      'Przy rannych: pomoc, wezwanie służb, pozostanie na miejscu i nieprzemieszczanie pojazdów. Oddalenie się z miejsca wypadku jest przestępstwem.', 'Wypadek', 'PoRD art. 44 ust. 2'],
    ['dokumenty-5', 'Prawo jazdy kategorii B uprawnia do kierowania pojazdem samochodowym o dopuszczalnej masie całkowitej nieprzekraczającej:',
      ['3,5 t', '5 t', '7,5 t'], 'A',
      'Kategoria B: pojazd do 3,5 t DMC, także z lekką przyczepą do 750 kg, a z cięższą — gdy zespół nie przekracza 3,5 t (4,25 t po 3 latach i kodzie 96).', 'Uprawnienia', 'Ustawa o kierujących pojazdami art. 6'],
  ],
  'przewoz': [
    ['przewoz-1', 'Liczba osób przewożonych samochodem osobowym nie może przekraczać:',
      ['liczby miejsc określonej w dowodzie rejestracyjnym', 'pięciu osób łącznie z kierującym', 'liczby pasów bezpieczeństwa powiększonej o jedną osobę'], 'A',
      'Obowiązuje liczba miejsc z dowodu rejestracyjnego. Dzieci liczy się jak dorosłych; „na kolanach” nie jest miejscem.', 'Przewóz osób', 'PoRD art. 63 ust. 1'],
    ['przewoz-2', 'Podczas holowania na holu sztywnym odległość między pojazdami nie może przekraczać:',
      ['3 m', '6 m', '10 m'], 'A',
      'Hol sztywny: do 3 m. Hol giętki: od 4 do 6 m, a jego środek oznacza się na przemian białymi i czerwonymi pasami lub chorągiewką.', 'Holowanie', 'PoRD art. 31 ust. 1 pkt 4'],
    ['przewoz-3', 'Dopuszczalna prędkość samochodu osobowego z przyczepą na autostradzie wynosi:',
      ['140 km/h', '80 km/h', '100 km/h'], 'B',
      'Zespół pojazdów ma własne limity: 80 km/h na autostradzie, drodze ekspresowej i drodze dwujezdniowej, 70 km/h na pozostałych drogach poza obszarem zabudowanym.', 'Zespół pojazdów', 'PoRD art. 20 ust. 3 pkt 2'],
    ['przewoz-4', 'Holowanie pojazdu na autostradzie:',
      ['jest dozwolone tylko przez pomoc drogową, do najbliższego zjazdu lub miejsca obsługi podróżnych', 'jest zabronione w każdym przypadku', 'jest dozwolone bez ograniczeń'], 'A',
      'Na autostradzie holować może tylko pojazd przeznaczony do holowania i tylko do najbliższego wyjazdu lub MOP. Zwykłe auto z linką musi zjechać z autostrady.', 'Holowanie', 'PoRD art. 31 ust. 2'],
    ['przewoz-5', 'Dopuszczalna prędkość podczas holowania pojazdu w obszarze zabudowanym wynosi:',
      ['30 km/h', '50 km/h', '60 km/h'], 'A',
      'Holowanie: 30 km/h w obszarze zabudowanym i 60 km/h poza nim. Pojazd holujący ma przy tym włączone światła mijania także w dzień.', 'Holowanie', 'PoRD art. 31 ust. 1 pkt 1'],
  ],
  'autostrady': [
    ['autostrady-1', 'Na autostradzie zabronione jest:',
      ['zatrzymywanie i postój poza miejscami do tego wyznaczonymi', 'jazda z prędkością 130 km/h', 'wyprzedzanie samochodów ciężarowych'], 'A',
      'Na autostradzie stajesz tylko w MOP lub w zatoce awaryjnej. Zatrzymanie na pasie awaryjnym dopuszczalne jest wyłącznie w razie awarii, z trójkątem 100 m za pojazdem.', 'Zakazy', 'PoRD art. 49 ust. 1 pkt 11'],
    ['autostrady-2', 'Kierujący wjeżdżający na autostradę z pasa włączania:',
      ['ma pierwszeństwo przed pojazdami jadącymi autostradą', 'musi ustąpić pierwszeństwa pojazdom jadącym autostradą', 'ma pierwszeństwo tylko przed samochodami ciężarowymi'], 'B',
      'Pas włączania służy do rozpędzenia się i wybrania luki. Wjeżdżający ustępuje pierwszeństwa wszystkim na autostradzie — to włączanie się do ruchu.', 'Wjazd', 'PoRD art. 17 ust. 1 pkt 3'],
    ['autostrady-3', 'Po autostradzie mogą poruszać się pojazdy samochodowe o prędkości konstrukcyjnej co najmniej:',
      ['40 km/h', '60 km/h', '80 km/h'], 'A',
      'Autostrada jest tylko dla pojazdów samochodowych o prędkości konstrukcyjnej nie mniejszej niż 40 km/h. Rowery, motorowery i ciągniki rolnicze nie mają na nią wstępu.', 'Dostęp', 'Rozp. w sprawie znaków i sygnałów, § 58'],
    ['autostrady-4', 'Zawracanie na autostradzie:',
      ['jest dozwolone przez pas rozdzielający, gdy nie ma barier', 'jest zabronione', 'jest dozwolone tylko w nocy'], 'B',
      'Na autostradzie i drodze ekspresowej zawracanie jest zabronione. Pomyłkę naprawiasz na najbliższym węźle — nigdy przez przerwę w pasie rozdzielającym.', 'Zakazy', 'PoRD art. 22 ust. 6 pkt 3'],
    ['autostrady-5', 'Na drodze ekspresowej dwujezdniowej dopuszczalna prędkość samochodu osobowego wynosi:',
      ['100 km/h', '120 km/h', '140 km/h'], 'B',
      'Ekspresowa dwujezdniowa: 120 km/h; jednojezdniowa: 100 km/h; autostrada: 140 km/h. Znak B-33 może każdą z tych wartości obniżyć.', 'Limity prędkości', 'PoRD art. 20 ust. 3 pkt 1'],
  ],
};

/**
 * Points per section of five: 2 x 3pt, 2 x 2pt, 1 x 1pt — the exam's own
 * 10:6:4 ratio rounded to five. Every (class, weight) bucket the paper
 * generator draws from stays non-empty: 16 basic sections give 32/32/16
 * questions, 6 specialist ones 12/12/6, against a paper that needs 10/6/4 and
 * 6/4/2.
 */
const POINT_PATTERN = [3, 3, 2, 2, 1];

function build(): Question[] {
  const out: Question[] = [];
  for (const [topicId, rows] of Object.entries(BASIC)) {
    rows.forEach(([id, text, correct, explanation, subtopic, sourceRef], i) => {
      out.push({
        id, topicId, type: 'single_choice', text,
        options: [{ id: 'T', text: 'TAK' }, { id: 'N', text: 'NIE' }],
        correctOptionId: correct, explanation, mediaId: null, subtopic, sourceRef,
        category: 'basic', points: POINT_PATTERN[i % POINT_PATTERN.length],
      });
    });
  }
  for (const [topicId, rows] of Object.entries(SPECIALIST)) {
    rows.forEach(([id, text, [a, b, c], correct, explanation, subtopic, sourceRef], i) => {
      out.push({
        id, topicId, type: 'single_choice', text,
        options: [{ id: 'A', text: a }, { id: 'B', text: b }, { id: 'C', text: c }],
        correctOptionId: correct, explanation, mediaId: null, subtopic, sourceRef,
        category: 'specialist', points: POINT_PATTERN[i % POINT_PATTERN.length],
      });
    });
  }
  return out;
}

export const PL_QUESTIONS: Question[] = build();
