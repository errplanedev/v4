const API_KEY = "f21088bf9097b49ad4e7f487abab981e";
const USERNAME = "familiar1337";

let currentTrackId = null;
let localStart = null;

const trackData = {
  title: "Unknown",
  artist: "Unknown",
  image: "https://placehold.co/174",
};

async function poll() {
  const res = await axios.get("https://ws.audioscrobbler.com/2.0/", {
    params: {
      method: "user.getrecenttracks",
      user: USERNAME,
      api_key: API_KEY,
      format: "json",
      limit: 1,
    },
  });

  const track = res.data.recenttracks.track[0];
  if (!track?.["@attr"]?.nowplaying) {
    return;
  }

  trackData.title = track.name;
  trackData.artist = track.artist["#text"];
  trackData.image = track.image[2]["#text"];
}

poll().catch(console.error);

setInterval(() => {
  poll().catch(console.error);
}, 1500);

function updateTrackData() {
  const title = document.getElementById("track-title");
  const artists = document.getElementById("track-artist");
  const cover = document.getElementById("track-cover");

  title.textContent = trackData.title;
  if (trackData.title.length >= 20) {
    title.textContent = trackData.title.slice(0, 20) + "...";
  }
  artists.textContent = trackData.artist;
  cover.src = trackData.image;
}

updateTrackData();

setInterval(updateTrackData, 1000);

const card = document.querySelector(".card");

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

document.body.addEventListener("mousemove", (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 2;
  const y = (e.clientY / window.innerHeight - 0.5) * 2;

  const rotateY = clamp(x * 25, -25, 25);
  const rotateX = clamp(-y * 25, -25, 25);

  card.style.transform = `
    rotateX(${rotateX}deg)
    rotateY(${rotateY}deg)
    translateZ(20px)
  `;
});
