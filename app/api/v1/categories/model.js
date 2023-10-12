const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      minLength: [3, "Panjang nama Kategori minimal 3 Karakter"],
      maxLength: [20, "Panjang nama kategori maksimum 20 Karakter"],
      required: [true, "Nama Kategori harus diisi ya bre"],
    },
    organizer: {
      type: mongoose.Types.ObjectId,
      ref: 'Organizer',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = model("Category", categorySchema);
