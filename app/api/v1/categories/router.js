// Mengimpor modul express untuk membuat router
const express = require("express");
const router = express();

// Mengimpor fungsi-fungsi dari file "controller" untuk mengelola operasi CRUD kategori
const { create, index, find, update, destroy } = require("./controller");

// Rute untuk mengambil daftar kategori (HTTP GET)
router.get("/categories", index);

// Rute untuk membuat daftar kategori (HTTP POST)
router.post("/categories", create);

// Rute untuk mencari kategori berdasarkan ID (HTTP GET)
router.get("/categories/:id", find);

// Rute untuk memperbarui kategori berdasarkan ID (HTTP PUT)
router.put("/categories/:id", update);

// Rute untuk menghapus kategori berdasarkan ID (HTTP DELETE)
router.delete("/categories/:id", destroy);

// Penanganan rute yang tidak ditemukan: Mengirimkan respons status 404 dengan pesan "Rute tidak ditemukan" (fallback handler)
router.use((req, res) => {
  res.status(404).json({ message: "Rute tidak ditemukan" });
});

// Ekspor router yang telah dikonfigurasi
module.exports = router;
