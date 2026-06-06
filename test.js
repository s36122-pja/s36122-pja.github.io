const pytania = [
    { p: "Z jakich głównych części składa się ciało krewetki?", o: ["Głowa, tułów, odwłok", "Cefalotoraks, pleon, telson", "Pancerz, czułki, odnóża"], poprawna: 1 },
    { p: "Czym jest cefalotoraks?", o: ["Ogonem krewetki", "Sercem krewetki", "Zrośniętą głową z tułowiem"], poprawna: 2 },
    { p: "Gdzie występują krewetki?", o: ["Wszędzie, poza Antarktydą", "Tylko w ciepłych krajach", "Na lądzie"], poprawna: 0 },
    { p: "Gdzie krewetka ma żołądek?", o: ["W głowotułowiu", "W brzuchu", "W odwłoku"], poprawna: 0 },
    { p: "Ile par czułków ma krewetka?", o: ["Jedną", "Dwie", "Dziesięć"], poprawna: 1 },
    { p: "Czy większość krewetek jest wszystkożerna?", o: ["Tylko niektóre są wszystkożerne", "Nie", "Tak"], poprawna: 2 },
    { p: "Czym są pleopody?", o: ["To odnóża kroczne", "To odnóża pływne", "To czułki"], poprawna: 1 },
    { p: "Która para szczękonóży służy do czyszczenia skrzeli?", o: ["Trzecia", "Pierwsza", "Druga"], poprawna: 2 },
];

let aktualnePytanie = 0;
let punkty = 0;

function wyswietlFiszke() {
    const q = pytania[aktualnePytanie];
    const obszar = document.getElementById('obszar-fiszki');
    
    obszar.innerHTML = `
        <h2 class="naglowekpost_test">${q.p}</h2>
        <div id="odpowiedzi">
            ${q.o.map((odp, index) => `<button class="fiszka-btn" onclick="sprawdz(${index})">${odp}</button>`).join('')}
        </div>
        <p id="feedback"></p>
    `;
}

function sprawdz(wybor) {
    const q = pytania[aktualnePytanie];
    const przyciski = document.querySelectorAll('.fiszka-btn');
    const feedback = document.getElementById('feedback');
    przyciski.forEach(btn => btn.disabled = true);
    
    if (wybor === q.poprawna) {
        punkty++;
        przyciski[wybor].style.backgroundColor = "#a0e6cc";
    } else {
        przyciski[wybor].style.backgroundColor = "#fd908a";
        przyciski[q.poprawna].style.backgroundColor = "#a8e6cf";
    }
    setTimeout(() => {
        aktualnePytanie++;
        if (aktualnePytanie < pytania.length) {
            wyswietlFiszke();
        } else {
            pokazWynik();
        }
    }, 1500);
}

function pokazWynik() {
    const obszar = document.getElementById('obszar-fiszki');
    let wiadomosc = "";
    if (punkty === 8) {
        wiadomosc = "Gratulacje! Jesteś gotowy, aby dbać o krewetkę! ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧";
    } else {
        wiadomosc = "Nie jesteś gotowy, żeby dbać o krewetkę... Musisz jeszcze nad tym popracować! .·°՞(¯□¯)՞°·.";
    }
    obszar.innerHTML = `
                    <div class="test_wiadomosc">
                        <h2>Twój wynik: ${punkty}/${pytania.length}</h2>
                        <p>${wiadomosc}</p>
                    </div>
                        <button class="fiszka-btn-again" onclick="location.reload()">Spróbuj jeszcze raz</button>`;
}