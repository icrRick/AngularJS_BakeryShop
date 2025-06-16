export default function handler(req, res) {
  res.status(200).json([
    {
      "name": "Bread",
      "icon": "/assets/img/categories-bread.png",
      "id": "d906"
    },
    {
      "name": "Sweet Cake",
      "icon": "/assets/img/categories-donut.png",
      "id": "dfb8"
    },
    {
      "name": "Burger",
      "icon": "/assets/img/categories-burger.png",
      "id": "ca74"
    },
    {
      "name": "Pizza",
      "icon": "/assets/img/categories-pizza.png",
      "id": "92c4"
    }
  ]);
}
