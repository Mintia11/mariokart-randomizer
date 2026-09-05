document.getElementById("randomize").addEventListener("click", function () {
    this.animate(
        [
            { transform: "scale(1) rotate(0deg)" },
            { transform: "scale(1.15) rotate(360deg)" },
            { transform: "scale(1) rotate(360deg)" }
        ],
        { duration: 500, easing: "ease-out" }
    );
});

function buildFlatPool(data, selectedCategories, toursEnabled, wiiOnly) {
    const pool = [];
    const isTrackEligible = (track) => {
        if (!toursEnabled && track.tour) return false;
        if (wiiOnly && !track.name.startsWith("Wii ")) return false;
        return true;
    }

    selectedCategories.forEach((categoryId) => {
        data[categoryId].forEach((cup) => {
            cup.tracks.forEach((track) => {
                if (!isTrackEligible(track)) return;
                pool.push({
                    cupName: cup.name,
                    cupImg: cup.img,
                    trackName: track.name,
                    trackImg: track.img
                });
            });
        });
    });

    return pool
}

function shuffle(array) {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function getSettingsKey(selectedCategories, toursEnabled, wiiOnly) {
    return JSON.stringify({
        categories: [...selectedCategories].sort(),
        toursEnabled,
        wiiOnly
    });
}

function randomTrack() {
    const data = window.tracks;
    if (!data) {
        alert("Track data not loaded yet. Just wait a moment and try again.");
        return 1;
    }

    const toursEnabled = document.getElementById("tour").checked;
    const wiiOnly = document.getElementById("wii").checked;

    const categoryIds = ["base", "deluxe", "ctgp"];
    const selectedCategories = categoryIds.filter((id) => {
        const checkbox = document.getElementById(id);
        return checkbox && checkbox.checked && Array.isArray(data[id]) && data[id].length > 0;
    });

    if (selectedCategories.length === 0) {
        alert("Please select at least one category (Base, Deluxe, or CTGP) that has track data available.");
        return 1;
    }

    const settingsKey = getSettingsKey(selectedCategories, toursEnabled, wiiOnly);

    let deck = null;
    try {
        const saved = JSON.parse(localStorage.getItem("mariokart_randomizer_deck"));
        if (saved && saved.key === settingsKey && Array.isArray(saved.deck) && saved.deck.length > 0) {
            deck = saved.deck;
        }
    } catch (e) {
        deck = null;
    }

    if (!deck || deck.length === 0) {
        const fullPool = buildFlatPool(data, selectedCategories, toursEnabled, wiiOnly);
        if (fullPool.length === 0) {
            alert("No tracks available with the current settings. Please adjust your selections.");
            return 1;
        }
        deck = shuffle(fullPool);
    }

    const selected = deck.pop();
    localStorage.setItem("mariokart_randomizer_deck", JSON.stringify({ key: settingsKey, deck }));

    const trackPanel = document.querySelector(".track-panel");

    trackPanel.innerHTML = `
        <h2>${selected.cupName}</h2>
        <img src="${selected.cupImg}" alt="${selected.cupName}" />
        <h3>${selected.trackName}</h3>
        <img src="${selected.trackImg}" alt="${selected.trackName}" />
    `;

    trackPanel.animate(
        [
            { transform: "scale(1) rotate(0deg)" },
            { transform: "scale(1.15) rotate(-360deg)" },
            { transform: "scale(1) rotate(-360deg)" }
        ],
        { duration: 500, easing: "ease-out" }
    );

    return 0;
}

document.getElementById("randomize").addEventListener("click", function () {
    const trackPanel = document.querySelector(".track-panel");
    if (randomTrack() == 0) {
        trackPanel.style.display = "block";
    } else {
        trackPanel.style.display = "none";
    }
});

document.getElementById("reset").addEventListener("click", function () {
    localStorage.removeItem("mariokart_randomizer_deck");
});