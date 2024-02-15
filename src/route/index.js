// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ==============================================

class User {
  static #list = []

  constructor(email, login, password) {
    this.email = email
    this.login = login
    this.password = password
    this.id = new Date().getTime()
  }

  verifyPassword = (password) => this.password === password

  static add = (user) => {
    this.#list.push(user)
  }

  static getList = () => {
    return this.#list
  }

  static getById = (id) =>
    this.#list.find((user) => user.id === id)

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (user) => user.id === id,
    )

    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }
  static updateById = (id, data) => {
    const user = this.getById(id)

    if (user) {
      this.update(user, data)

      return true
    } else {
      return false
    }
  }

  static update = (user, { email }) => {
    if (email) {
      user.email = email
    }
  }
}

// ==============================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  const list = User.getList()

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'index',

    data: {
      users: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ==============================================

router.post('/user-create', function (req, res) {
  const { email, login, password } = req.body

  const user = new User(email, login, password)

  User.add(user)

  console.log(User.getList())

  res.render('success-info', {
    style: 'success-info',
    info: 'Користувач створений',
  })
})

// ==============================================

router.get('/user-delete', function (req, res) {
  const { id } = req.query

  // console.log(id)

  User.deleteById(Number(id))

  res.render('success-info', {
    style: 'sucsess-info',
    info: 'Користувача видалено',
  })
})

// ==============================================

router.post('/user-update', function (req, res) {
  const { email, password, id } = req.body

  let result = false

  const user = User.getById(Number(id))

  if (user.verifyPassword(password)) {
    User.update(user, { email })

    result = true
  }

  res.render('success-info', {
    style: 'sucsess-info',
    info: result ? 'Email оновлено' : 'Сталася помилка',
  })
})

// ==============================================

class Product {
  static #list = []

  constructor(name, price, description) {
    this.id = Math.floor(10000 + Math.random() * 90000) // Унікальне число з 5 цифр
    this.createDate = new Date().toISOString() // Дата створення
    this.name = name // Назва товару
    this.price = price // Ціна товару
    this.description = description // Опис товару
  }

  static getList() {
    return Product.#list
  }

  static add(product) {
    Product.#list.push(product)
  }

  static getById(id) {
    return Product.#list.find(
      (product) => product.id === id,
    )
  }

  static editById(id, data) {
    const productIndex = Product.#list.findIndex(
      (product) => product.id === id,
    )
    if (productIndex > -1) {
      Product.#list[productIndex] = {
        ...Product.#list[productIndex],
        ...data,
      }
      return true
    }
    return false
  }

  static cloneById(id) {
    const productIndex = Product.#list.findIndex(
      (product) => product.id === id,
    )
    if (productIndex > -1) {
      const productClone = {
        ...Product.#list[productIndex],
      }
      productClone.id = Math.floor(
        10000 + Math.random() * 90000,
      ) // Гарантуємо унікальний ID для копії
      productClone.createDate = new Date().toISOString() // Встановлює нову дату створення для копії
      Product.#list.push(productClone)
      return productClone
    }
    return null
  }

  static deleteById(id) {
    const productIndex = Product.#list.findIndex(
      (product) => product.id === id,
    )
    if (productIndex > -1) {
      Product.#list.splice(productIndex, 1)
      return true
    }
    return false
  }
}

// ============================================

router.get('/product-create', function (req, res) {
  // res.render генерує нам HTML сторінку

  const list = Product.getList()

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('product-create', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'product-create',

    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ==============================================

router.post('/product-create', function (req, res) {
  const { name, price, description } = req.body

  const newProduct = new Product(name, price, description)

  Product.add(newProduct)

  console.log(Product.getList())

  res.render('alert', {
    style: 'alert',
    info: `Створено товар ${name}`,
  })
})

// ==============================================

router.get('/product-list', function (req, res) {
  // res.render генерує нам HTML сторінку

  const list = Product.getList()

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('product-list', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'product-list',

    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ==============================================

router.get('/product-edit', function (req, res) {
  // Отримуємо id з req.query та перетворимо у число
  const id = parseInt(req.query.id)

  // Шукаємо товар з таким id
  const product = Product.getById(id)

  // Якщо товар знайдено, відображаємо сторінку для редагування
  if (product) {
    res.render('product-edit', {
      style: 'product-edit',
      product,
    })
    // Якщо товар не знайдено, показуємо повідомлення про помилку
  } else {
    res.render('alert', {
      style: 'alert',
      info: 'Товар з таким ID не знайдено',
    })
  }
})

// ==============================================

router.post('/product-edit', function (req, res) {
  // Отримуємо оновлені дані та id товару
  const { name, price, description, id } = req.body
  const updatedData = { name, price, description }

  // Оновлюємо дані товару
  const success = Product.editById(
    parseInt(id),
    updatedData,
  )

  // Виводимо результат операції
  let infoMessage = success
    ? `Інформацію про товар успішно оновлено`
    : `Не вдалося оновити інформацію про товар з ID ${id}`

  res.render('alert', {
    style: 'alert',
    info: infoMessage,
  })
})

// ==============================================

router.get('/product-delete', function (req, res) {
  const id = parseInt(req.query.id)
  const success = Product.deleteById(id)

  // Виведення результату операції
  const info = success
    ? 'Товар успішно видалено.'
    : 'Не вдалося видалити товар або товар з таким ID не знайдено.'
  res.render('alert', {
    style: 'alert',
    info: info,
  })
})

// ==============================================

router.get('/product-copy', function (req, res) {
  const id = parseInt(req.query.id)
  const clonedProduct = Product.cloneById(id)

  // Після клонування переглянемо список товарів з копією
  if (clonedProduct) {
    res.redirect('/product-list')
  } else {
    res.render('alert', {
      style: 'alert',
      info: 'Не вдалося скопіювати товар або товар із заданим ID не знайдено.',
    })
  }
})
// Підключаємо роутер до бек-енду
module.exports = router
