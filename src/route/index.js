// Підключаємо технологію express для back-end сервера
const express = require("express");
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router();

// ==============================================

class UniqueIdGenerator {
  static productCounter = 0;
  static purchaseCounter = 0;

  static getNextProductId() {
    return ++this.productCounter;
  }

  static getNextPurchaseId() {
    return ++this.purchaseCounter;
  }
}

class Product {
  static #list = [];

  // static #count = 0

  constructor(img, title, description, category, price, amount = 0) {
    this.id = UniqueIdGenerator.getNextProductId(); // Генеруємо унікальний id для товару
    this.img = img;
    this.title = title;
    this.description = description;
    this.category = category;
    this.price = price;
    this.amount = amount;
  }

  static add = (...data) => {
    const newProduct = new Product(...data);

    this.#list.push(newProduct);
  };

  static getList = () => {
    return this.#list;
  };

  static getById = (id) => {
    return this.#list.find((product) => product.id === id);
  };

  static getRandomList = (id) => {
    // фільтруємо товари, щоб вилучити той, з яким порівнюємо id
    const filteredList = this.#list.filter((product) => product.id !== id);
    // Відсортуємо за допомогою Math.random() та перемішаємо масив
    const shuffledList = filteredList.sort(() => Math.random() - 0.5);
    // Повертаємо перші 3 елементи з перемішаного масиву
    return shuffledList.slice(0, 3);
  };
}

// ==============================================
Product.add(
  "https://picsum.photos/200/300",
  `1 Комп'ютер Artline Gaming (X43v31) AMD Ryzen 5 3600`,
  `AMD Ryzen 5 3600 (3.6 - 4.2 ГГц) / RAM 16 ГБ / HDD 1 ТБ + SSD 480 ГБ / nVidia GeForce RTX 3050, 8 ГБ / без ОД / LAN / без ОС`,
  [
    { id: 1, text: "Готовий до відправки" },
    { id: 2, text: "Ton продажів" },
  ],
  27000,
  10
);

Product.add(
  "https://picsum.photos/210/315",
  `2 Комп'ютер COBRA Advanced (I11F.8.H1S2.15T.13356) Intel`,
  `Intel Core i3-10100F (3.6 - 4.3 ГГц) / RAM 8 ГБ / HDD 1 ТБ + SSD 240 ГБ / GeForce GTX 1050 Ti, 4 ГБ / без ОД / LAN / Linux`,
  [{ id: 2, text: "Топ продажів" }],
  17000,
  10
);

Product.add(
  "https://picsum.photos/202/303",
  `3 Комп'ютер ARTLINE Gaming by ASUS TUF v119 (TUFv119)`,
  `Intel Core i9-13900KF (3.0 - 5.8 ГГц) / RAM 64 ГБ / SSD 2 ТБ (2 x 1 ТБ) / nVidia GeForce RTX 4070 Ti, 12 ГБ / без ОД / LAN / Wi-Fi / Bluetooth / без ОС`,
  [{ id: 1, text: "Готовий до відправки" }],
  113009,
  10
);

Product.add(
  "https://picsum.photos/204/306",
  `4 Комп'ютер Artline Gaming (X43v31) AMD Ryzen 5 3600/`,
  `AMD Ryzen 5 3600 (3.6 - 4.2 ГГц) / RAM 16 ГБ / HDD 1 ТБ + SSD 480 ГБ / nVidia GeForce RTX 3050, 8 ГБ / без ОД / LAN / без ОС`,
  [
    { id: 1, text: "Готовий до відправки" },
    { id: 2, text: "Ton продажів" },
  ],
  27200,
  10
);

Product.add(
  "https://picsum.photos/206/309",
  `5 Комп'ютер COBRA Advanced (I11F.8.H1S2.15T.13356) Intel`,
  `Intel Core i3-10100F (3.6 - 4.3 ГГц) / RAM 8 ГБ / HDD 1 ТБ + SSD 240 ГБ / GeForce GTX 1050 Ti, 4 ГБ / без ОД / LAN / Linux`,
  [
    { id: 2, text: "Топ продажів" },
    { id: 1, text: "Готовий до відправки" },
  ],

  17200,
  10
);

Product.add(
  "https://picsum.photos/208/312",
  `6 Комп'ютер ARTLINE Gaming by ASUS TUF v119 (TUFv119)`,
  `Intel Core i9-13900KF (3.0 - 5.8 ГГц) / RAM 64 ГБ / SSD 2 ТБ (2 x 1 ТБ) / nVidia GeForce RTX 4070 Ti, 12 ГБ / без ОД / LAN / Wi-Fi / Bluetooth / без ОС`,
  [{ id: 1, text: "Готовий до відправки" }],
  113209,
  10
);
// ==============================================

class Purchase {
  static DELIVERY_PRICE = 150;
  static #BONUS_FACTOR = 0.1;

  static #count = 0;
  static #list = [];

  static #bonusAccount = new Map();

  static getBonusBalance = (email) => {
    return Purchase.#bonusAccount.get(email) || 0;
  };

  static calcBonusAmount = (value) => {
    // return Math.ceil(value * Purchase.#BONUS_FACTOR)
    // return parseFloat(
    //   (value * Purchase.#BONUS_FACTOR).toFixed(2),
    // )
    return (value * Purchase.#BONUS_FACTOR).toFixed(2);
  };

  static updateBonusBalance = (email, price, bonusUse = 0) => {
    //Додав округлення до найближчого більшого цілого числа
    const amount = this.calcBonusAmount(price);

    const currentBalance = Purchase.getBonusBalance(email);

    const updatedBalance = currentBalance + amount - bonusUse;

    Purchase.#bonusAccount.set(email, updatedBalance);

    console.log(email, updatedBalance);

    return amount;
  };

  constructor(data, product) {
    this.id = UniqueIdGenerator.getNextPurchaseId();

    this.firstname = data.firstname;
    this.lastname = data.lastname;

    this.phone = data.phone;
    this.email = data.email;

    this.comment = data.comment || null;

    this.bonus = data.bonus || 0;

    this.promocode = data.promocode || null;

    this.totalPrice = data.totalPrice;
    this.productPrice = data.productPrice;
    this.deliveryPrice = data.deliveryPrice;
    this.amount = data.amount;

    this.product = product;
  }

  static add = (...arg) => {
    const newPurchase = new Purchase(...arg);
    this.#list.push(newPurchase);
    return newPurchase;
  };

  static getList = () => {
    return Purchase.#list.reverse();
  };

  static getById = (id) => {
    return Purchase.#list.find((item) => item.id === id);
  };

  static updateById = (id, data) => {
    const purchase = Purchase.getById(id);

    if (purchase) {
      if (data.firstname) purchase.firstname = data.firstname;
      if (data.lastname) purchase.lastname = data.lastname;
      if (data.phone) purchase.phone = data.phone;
      if (data.email) purchase.email = data.email;

      return true;
    } else {
      return false;
    }
  };
}

// ==============================================

class Promocode {
  static #list = [];

  constructor(name, factor) {
    this.name = name;
    this.factor = factor;
  }

  static add = (name, factor) => {
    const newPromoCode = new Promocode(name, factor);
    Promocode.#list.push(newPromoCode);
    return newPromoCode;
  };

  static getByName = (name) => {
    return this.#list.find((promo) => promo.name === name);
  };

  static calc = (promo, price) => {
    return price * promo.factor;
  };
}

Promocode.add("SUMMER2023", 0.9);
Promocode.add("DISCOUNT50", 0.5);
Promocode.add("SALE25", 0.75);

//===================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get("/", function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render("purchase-index", {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: "purchase-index",

    data: {
      list: Product.getList(),
    },
  });
  // ↑↑ сюди вводимо JSON дані
});

// ==============================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get("/purchase-product", function (req, res) {
  // res.render генерує нам HTML сторінку

  const id = Number(req.query.id);

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render("purchase-product", {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: "purchase-product",

    data: {
      list: Product.getRandomList(id),
      product: Product.getById(id),
    },
  });
  // ↑↑ сюди вводимо JSON дані
});

// ==============================================
// Створення та оформлення товару

router.post("/purchase-create", function (req, res) {
  const id = Number(req.query.id);
  const amount = Number(req.body.amount);

  if (amount < 1) {
    return res.render("purchase-alert", {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: "purchase-alert",

      data: {
        message: "Помилка",
        info: "Некоректна кількість товару",
        link: `/purchase-product?id=${id}`,
      },
    });
  }

  const product = Product.getById(id);

  if (amount > 10) {
    return res.render("purchase-alert", {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: "purchase-alert",

      data: {
        message: "Помилка",
        info: "Такої кількості товару немає в наявності",
        link: `/purchase-product?id=${id}`,
      },
    });
  }

  console.log(product, amount);

  const productPrice = product.price * amount;
  const totalPrice = productPrice + Purchase.DELIVERY_PRICE;
  const bonus = Purchase.calcBonusAmount(totalPrice);

  res.render("purchase-create", {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: "purchase-create",

    data: {
      id: product.id,

      cart: [
        {
          text: `${product.title} (${amount} шт)`,
          price: productPrice,
        },
        {
          text: `Вартість доставки`,

          price: Purchase.DELIVERY_PRICE,
        },
      ],
      totalPrice,
      productPrice,
      deliveryPrice: Purchase.DELIVERY_PRICE,
      amount,
      bonus,
    },
  });
  // сюди вводимо JSON дані
});

//===============================================

router.post("/purchase-submit", function (req, res) {
  const id = Number(req.query.id);

  let {
    totalPrice,
    productPrice,
    deliveryPrice,
    amount,

    firstname,
    lastname,
    email,
    phone,
    comment,

    promocode,
    bonus,
  } = req.body;

  const product = Product.getById(id);

  if (!product) {
    return res.render("purchase-alert", {
      style: "purchase-alert",

      data: {
        message: "Помилка",
        info: "Товар не знайдено",
        link: `/`,
      },
    });
  }

  if (product.amount < amount) {
    return res.render("purchase-alert", {
      style: "purchase-alert",
      data: {
        message: "Помилка",
        info: "Такої кількості товару немає в наявності",
        link: `/purchase-product?id=${id}`,
      },
    });
  }

  totalPrice = Number(totalPrice);
  productPrice = Number(productPrice);
  deliveryPrice = Number(deliveryPrice);
  amount = Number(amount);
  bonus = Number(bonus);

  if (
    isNaN(totalPrice) ||
    isNaN(productPrice) ||
    isNaN(deliveryPrice) ||
    isNaN(amount) ||
    isNaN(bonus)
  ) {
    return res.render("purchase-alert", {
      style: "purchase-alert",
      data: {
        message: "Помилка",
        info: "Некоректні дані",
        link: `/purchase-product?id=${id}`,
      },
    });
  }

  if (!firstname || !lastname || !email || !phone) {
    return res.render("purchase-alert", {
      style: "purchase-alert",

      data: {
        message: `Заповніть обов'язкові поля`,
        info: "Некоректні дані",
        link: `/purchase-product?id=${id}`,
      },
    });
  }

  if (bonus || bonus > 0) {
    const bonusAmount = Purchase.getBonusBalance(email);

    console.log(bonusAmount);

    if (bonus > bonusAmount) {
      bonus = bonusAmount;
    }

    Purchase.updateBonusBalance(email, totalPrice, bonus);

    totalPrice -= bonus;
  } else {
    Purchase.updateBonusBalance(email, totalPrice, 0);
  }

  if (promocode) {
    promocode = Promocode.getByName(promocode);

    if (promocode) {
      totalPrice = Promocode.calc(promocode, totalPrice);
    }
  }

  if (totalPrice < 0) totalPrice = 0;

  const purchase = Purchase.add(
    {
      totalPrice,
      productPrice,
      deliveryPrice,
      amount,
      bonus,

      firstname,
      lastname,
      email,
      phone,

      promocode,
      comment,
    },
    product
  );

  console.log(purchase);

  res.render("purchase-alert", {
    style: "purchase-alert",

    data: {
      message: "Успішно",
      info: "Замовлення створено",
      link: `/purchase-orderinfo?id=${id}`,
    },
  });
});

//===================================================

// Ендпоїнт для відображення інформації про замовлення
router.get("/purchase-orderinfo", function (req, res) {
  const id = Number(req.query.id); // Можливо, використати ID користувача чи замовлення

  const purchase = Purchase.getById(id);

  if (!purchase) {
    return res.render("purchase-alert", {
      style: "purchase-alert",
      data: {
        message: "Помилка",
        info: "Замовлення не знайдено",
        link: `/`,
      },
    });
  }

  res.render("purchase-orderinfo", {
    style: "purchase-orderinfo",
    data: purchase,
    actions: {
      editLink: `/purchase-edit?id=${id}`, // Посилання для редагування замовлення
    },
  });
});

// Ендпоїнт для редагування особистих даних покупця
router.get("/purchase-edit", function (req, res) {
  const id = Number(req.query.id);
  const purchase = Purchase.getById(id);

  if (!purchase) {
    return res.render("purchase-alert", {
      style: "purchase-alert",
      data: {
        message: "Помилка",
        info: "Замовлення для редагування не знайдено",
        link: "/purchase-orderinfo",
      },
    });
  }

  res.render("purchase-edit", {
    style: "purchase-edit",
    data: {
      id,
      firstname: purchase.firstname,
      lastname: purchase.lastname,
      email: purchase.email,
      phone: purchase.phone,
    },
  });
});

// Пости для оновлення інформації про користувача
// router.post('/purchase-edit', function (req, res) {
//   const id = Number(req.query.id)
//   const updatedData = {
//     firstname: req.body.firstname,
//     lastname: req.body.lastname,
//     email: req.body.email,
//     phone: req.body.phone,
//   }

//   const success = Purchase.updateById(id, updatedData)

//   if (success) {
//     res.redirect(`/purchase-orderinfo?id=${id}`)
//   } else {
//     // ... повертати помилку у разі невдалого оновлення
//     return res.render('purchase-alert', {
//       style: 'purchase-alert',
//       data: {
//         message: 'Помилка',
//         info: 'Помилка при оновленні даних',
//         link: '/purchase-orderinfo',
//       },
//     })
//   }
// })

router.post("/purchase-edit", function (req, res) {
  const id = Number(req.body.id);
  // Отримуємо ID з тіла запиту

  const updatedData = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    phone: req.body.phone,
  };

  console.log("ID отриманий з тіла запиту:", id); // Виводимо ID для перевірки

  console.log("Оновлені дані:", updatedData); // Виводимо оновлені дані для перевірки

  const success = Purchase.updateById(id, updatedData);

  if (success) {
    res.redirect(`/purchase-orderinfo?id=${id}`);
  } else {
    return res.render("purchase-alert", {
      style: "purchase-alert",
      data: {
        message: "Помилка",
        info: "Помилка при оновленні даних",
        link: "/purchase-orderinfo",
      },
    });
  }
});

// Ендпоїнт для відображення списку замовлених товарів
router.get("/purchase-list", function (req, res) {
  const purchases = Purchase.getList();

  res.render("purchase-list", {
    style: "purchase-list",
    data: purchases.map((purchase) => ({
      productID: purchase.product.id,
      productName: purchase.product.title,
      totalPrice: purchase.totalPrice,
      earnedBonus: Purchase.calcBonusAmount(purchase.totalPrice),
    })),
  });
});

// Підключаємо роутер до бек-енду
module.exports = router;
