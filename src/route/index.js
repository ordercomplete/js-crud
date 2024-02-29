// Підключаємо технологію express для back-end сервера
const express = require("express");
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router();

// ==============================================
class Track {
  // Статичне приватне поле для зберігання списку об’єктів Track
  static #list = [];

  constructor(name, author, image) {
    this.id = Math.floor(1000 + Math.random() * 9000); // Генеруємо випадкове id
    this.name = name;
    this.author = author;
    this.image = image;
  }

  // Статичний метод для створення об'єкту Track і додавання його до списку #list
  static create(name, author, image) {
    const newTrack = new Track(name, author, image);
    this.#list.push(newTrack);
    return newTrack;
  }

  // Статичний метод для отримання всього списку треків
  static getList() {
    return this.#list.reverse();
  }

  // Статичний метод для отримання певного треку
  static getById(id) {
    return this.#list.find((track) => track.id === id) || null;
  }
}

Track.create("Інь Ян", "MONATIK i ROXOLANA", "https://picsum.photos/101/101");
Track.create(
  "Baila Conmigo (Remix)",
  "Selena Gomez i Rauw Alejandro",
  "https://picsum.photos/102/102"
);
Track.create("Shameless", "Camila Cabello", "https://picsum.photos/103/103");
Track.create("DАКIТI", "BAD BUNNY i JHAY", "https://picsum.photos/104/104");
Track.create("11 PM", "Maluma", "https://picsum.photos/105/105");
Track.create("Інша любов", "Enleo", "https://picsum.photos/106/106");

console.log(Track.getList());

class Playlist {
  // Статичне приватне поле для зберігання списку об'єктів Playlist
  static #list = [];

  constructor(name) {
    this.id = Math.floor(1000 + Math.random() * 9000); // Генеруємо випадкове id
    this.name = name;
    this.tracks = [];
    this.image = "https://picsum.photos/300/300";
  }

  // Статичний метод для створення об'єкту Playlist і додавання його до списку #list
  static сreate(name) {
    const newPlaylist = new Playlist(name);
    this.#list.push(newPlaylist);
    return newPlaylist;
  }

  // Статичний метод для отримання всього списку плейлістів
  static getList() {
    return this.#list.reverse();
  }

  static makeMix(playlist) {
    const allTracks = Track.getList();

    let randomTracks = allTracks.sort(() => 0.5 - Math.random()).slice(0, 3);
    playlist.tracks.push(...randomTracks);
  }

  static getById(id) {
    return Playlist.#list.find((playlist) => playlist.id === id) || null;
  }

  deleteTrackById(trackId) {
    this.tracks = this.tracks.filter((track) => track.id !== trackId);
  }

  addTrackById(trackId) {
    const trackToAdd = Track.getById(trackId);
    if (trackToAdd) {
      this.tracks.push(trackToAdd);
    }
  }
}

//===================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get("/", function (req, res) {
  // Отримуємо список усіх плейлістів
  const playlists = Playlist.getList().map((playlist) => ({
    ...playlist,
    amount: playlist.tracks.length, // Додаємо поле з кількістю треків у плейлісті
  }));

  res.render("spotify-lib", {
    style: "spotify-lib",
    data: {
      list: playlists,
    },
  });
});

//===================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get("/spotify-search", function (req, res) {
  // Отримуємо список усіх плейлістів
  const playlists = Playlist.getList().map((playlist) => ({
    ...playlist,
    amount: playlist.tracks.length, // Додаємо поле з кількістю треків у плейлісті
  }));

  res.render("spotify-search", {
    style: "spotify-search",
    data: {
      list: playlists,
    },
  });
});

// Обробник для пошуку плейлістів
router.post("/spotify-search", function (req, res) {
  const searchQuery = req.body.value.toLowerCase(); // Отримуємо значення введене користувачем у полі пошуку та переводимо у нижній регістр для нечутливого до регістру пошуку

  // Фільтруємо список плейлістів на основі запиту користувача
  const filteredPlaylists = Playlist.getList()
    .filter((playlist) => playlist.name.toLowerCase().includes(searchQuery))
    .map((playlist) => ({
      ...playlist,
      amount: playlist.tracks.length, // Додаємо поле з кількістю треків у плейлісті
    }));

  // Рендеримо сторінку з результатами пошуку
  res.render("spotify-search", {
    style: "spotify-search",
    data: {
      list: filteredPlaylists, // Передаємо знайдені плейлісти до шаблону з доданим полем кількості треків
    },
  });
});

//===================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get("/spotify-choose", function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render("spotify-choose", {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: "spotify-choose",

    data: {},
  });
  // ↑↑ сюди вводимо JSON дані
});

//===================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get("/spotify-create", function (req, res) {
  const isMix = !!req.query.isMix;

  console.log(isMix);

  res.render("spotify-create", {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: "spotify-create",

    data: {
      isMix,
    },
  });
  // ↑↑ сюди вводимо JSON дані
});

//===================================================

// ↙️ тут вводимо шлях (PATH) до сторінки
router.post("/spotify-create", function (req, res) {
  const isMix = !!req.query.isMix;

  const name = req.body.name;

  if (!name) {
    return res.render("spotify-alert", {
      style: "spotify-alert",

      data: {
        message: "Помилка",
        info: "Введіть назву плейліста",
        link: isMix ? "/spotify-create?isMix=true" : "/spotify-create",
      },
    });
  }

  const playlist = Playlist.сreate(name);

  if (isMix) {
    Playlist.makeMix(playlist);
  }

  console.log(playlist);

  res.render("spotify-playlist", {
    style: "spotify-playlist",
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  });
});

router.get("/spotify-playlist", function (req, res) {
  const id = Number(req.query.id);
  const playlist = Playlist.getById(id);
  if (!playlist) {
    return res.render("spotify-alert", {
      style: "spotify-alert",
      data: {
        message: "Помилка",
        info: "Такого плейліста не знайдено",
        link: `/`,
      },
    });
  }
  res.render("spotify-playlist", {
    style: "spotify-playlist",
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  });
});

router.get("/spotify-track-delete", function (req, res) {
  const playlistId = Number(req.query.playlistId);

  const trackId = Number(req.query.trackId);

  const playlist = Playlist.getById(playlistId);

  if (!playlist) {
    return res.render("spotify-alert", {
      style: "spotify-alert",
      data: {
        message: "Помилка",
        info: "Такого плейліста не знайдено",
        link: `/spotify-playlist?id=${playlistId}`,
      },
    });
  }

  playlist.deleteTrackById(trackId);

  res.render("spotify-playlist", {
    style: "spotify-playlist",
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  });
});

router.get("/spotify-playlist-add", function (req, res) {
  const playlistId = req.query.playlistId;

  // Перевірка наявності ID плейліста у запиті
  if (!playlistId) {
    return res.render("spotify-alert", {
      style: "spotify-alert",
      data: {
        message: "Помилка",
        info: "ID плейліста не вказано",
        link: "/",
      },
    });
  }

  // Відображення сторінки з можливістю додавання треків до плейліста з вказаним ID
  res.render("spotify-playlist-add", {
    style: "spotify-playlist-add",
    data: {
      playlistId: playlistId,
      tracks: Track.getList(), // Показуємо список усіх доступних треків для додавання
    },
  });

  playlistId.addTrackById(Track);

  res.render("spotify-playlist", {
    style: "spotify-playlist",
    data: {
      playlistId: playlistId.id,
      tracks: playlistId.tracks,
      name: playlistId.name,
    },
  });
});

router.get("/spotify-track-add", function (req, res) {
  const playlistId = Number(req.query.playlistId);
  const trackId = Number(req.query.trackId);

  const playlist = Playlist.getById(playlistId);
  if (!playlist) {
    return res.render("spotify-alert", {
      style: "spotify-alert",
      data: {
        message: "Помилка",
        info: "Такого плейліста не знайдено",
        link: `/`,
      },
    });
  }

  // Додаємо трек до плейліста
  playlist.addTrackById(trackId);

  // Після успішного добавлення трека, перенаправляємо користувача на сторінку плейліста
  res.redirect(`/spotify-playlist?id=${playlistId}`);
});

// Підключаємо роутер до бек-енду
module.exports = router;
