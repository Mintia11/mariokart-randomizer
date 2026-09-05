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

function randomTrack() {
    const data = window.tracks;
    if (!data) {
        alert("Track data not loaded yet. Just wait a moment and try again.");
        return 1;
    }

    const toursEnabled = document.getElementById("tour").checked;

    // Only offer categories that are checked AND actually present in the data
    const categoryIds = ["base", "deluxe", "ctgp"];
    const selectedCategories = categoryIds.filter((id) => {
        const checkbox = document.getElementById(id);
        return checkbox && checkbox.checked && Array.isArray(data[id]) && data[id].length > 0;
    });

    if (selectedCategories.length === 0) {
        alert("Please select at least one category (Base, Deluxe, or CTGP) that has track data available.");
        return 1;
    }

    // Helper: tracks eligible under the current tour setting
    const eligibleTracks = (cup) =>
        cup.tracks.filter((track) => toursEnabled || !track.tour);

    // Build a flat pool of { cup, tracks } for every category/cup that has
    // at least one eligible track, so we never pick a cup with nothing to show.
    const pool = [];
    selectedCategories.forEach((categoryId) => {
        data[categoryId].forEach((cup) => {
            const tracks = eligibleTracks(cup);
            if (tracks.length > 0) {
                pool.push({ cup, tracks });
            }
        });
    });

    if (pool.length === 0) {
        alert("No tracks match your current settings. Try enabling Tours or a different category.");
        return 1;
    }

    const { cup: randomCup, tracks: cupTracks } = pool[Math.floor(Math.random() * pool.length)];
    const selectedTrack = cupTracks[Math.floor(Math.random() * cupTracks.length)];

    const trackPanel = document.querySelector(".track-panel");
    if (!trackPanel) {
        console.error('Missing ".track-panel" element in the DOM.');
        return 1;
    }

    trackPanel.innerHTML = `
        <h2>${randomCup.name}</h2>
        <img src="${randomCup.img}" alt="${randomCup.name}" />
        <h3>${selectedTrack.name}</h3>
        <img src="${selectedTrack.img}" alt="${selectedTrack.name}" />
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
    trackPanel.innerHTML = ""; // Clear previous tracks
    if (randomTrack() == 0) {
        trackPanel.style.display = "block"; // Show the track panel
    } else {
        trackPanel.style.display = "none"; // Hide the track panel if no track was selected
    }
});