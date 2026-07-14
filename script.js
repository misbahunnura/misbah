function goProfile() {
    document.getElementById("home").classList.add("hidden");
    const profil = document.getElementById("profil");
    profil.classList.remove("hidden");
    restartAnimation(profil);
}

function goBack() {
    document.getElementById("profil").classList.add("hidden");
    const home = document.getElementById("home");
    home.classList.remove("hidden");
    restartAnimation(home);
}

function restartAnimation(el) {
    el.classList.remove("fade-in");
    void el.offsetWidth; // force reflow so the animation replays
    el.classList.add("fade-in");
}
