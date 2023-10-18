// Mengimpor modul express untuk membuat router
const express = require("express");
const router = express();

// Mengimpor fungsi-fungsi dari file "controller" untuk mengelola operasi CRUD kategori
const { create, index, find, update, destroy } = require("./controller");
const { authenticateUser, authorizedRoles, } = require('../../../middlewares/auth')


// Rute untuk mengambil daftar kategori (HTTP GET)
router.get("/categories", authenticateUser, authorizedRoles('organizer'), index);

// Rute untuk membuat daftar kategori (HTTP POST)
router.post("/categories", authenticateUser, authorizedRoles('organizer'), create);

// Rute untuk mencari kategori berdasarkan ID (HTTP GET)
router.get("/categories/:id", authenticateUser, authorizedRoles('organizer'), find);

// Rute untuk memperbarui kategori berdasarkan ID (HTTP PUT)
router.put("/categories/:id", authenticateUser, authorizedRoles('organizer'), update);

// Rute untuk menghapus kategori berdasarkan ID (HTTP DELETE)
router.delete("/categories/:id", authenticateUser, authorizedRoles('organizer'), destroy);

// Penanganan rute yang tidak ditemukan: Mengirimkan respons status 404 dengan pesan "Rute tidak ditemukan" (fallback handler)
router.use((req, res) => {
  res.status(404).json({ message: "Rute tidak ditemukan" });
});

// Ekspor router yang telah dikonfigurasi
module.exports = router;
