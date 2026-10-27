const express = require("express");
module.exports = function menuRouter(db) {
  const router = express.Router();
  router.get("/", (req, res) => {
    const categories = db.prepare("SELECT * FROM categories ORDER BY sort_order, id").all();
    const dishes = db.prepare(`SELECT id, category_id, name, description, price_grosz
      FROM dishes WHERE available = 1 ORDER BY id`).all();
    res.json({ categories: categories.map((category) => ({
      id: category.id, name: category.name,
      dishes: dishes.filter((dish) => dish.category_id === category.id),
    })) });
  });
  return router;
};
