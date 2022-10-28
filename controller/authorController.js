const { Author, Book } = require("../model/model");

const authorController = {
  //Add author
  addAuthor: async (req, res) => {
    try {
      // req.body của Author bắt buộc người dùng phải nhập đúng những gì Author có ở model.js(name, year, books)
      const newAuthor = new Author(req.body);
      // save() dùng để save data vào database
      const savedAuthor = await newAuthor.save();
      res.status(200).json(savedAuthor);
    } catch (error) {
      res.status(500).json(error); //HTTP ERROR CODE
    }
  },

  //
  getAllAuthor: async (req, res) => {
    try {
      // lệnh find giúp tìm tất cả đối tượng mà gọi(.) đến nó
      const authors = await Author.find();
      res.status(200).json(authors);
    } catch (error) {
      res.status(500).json(error); //HTTP ERROR CODE
    }
  },

  //
  getAnAuthor: async (req, res) => {
    try {
      // author.js: params là : và id là id(ở đây là gì thì phụ thuộc vào ta đặt tên bên file author)
      // populate là hàm sẽ hiện ra giá trị của đối tượng(name, year, books, publishedDate, genres,..)
      // ta truyền vào mà không còn là id nữa
      const author = await Author.findById(req.params.id).populate("books");
      res.status(200).json(author);
    } catch (error) {
      res.status(500).json(error); //HTTP ERROR CODE
    }
  },

  //UPDATE AN AUTHOR
  updateAuthor: async (req, res) => {
    try {
      const author = await Author.findById(req.params.id);
      //   $set la 1 function cho phep cap nhat gia tri chi dinh
      await author.updateOne({ $set: req.body });
      res.status(200).json("Updated successfully!");
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //   DELETE AN AUTHOR
  deleteAuthor: async (req, res) => {
    try {
      // author trong model.js
      // bên này không dùng được pull tại vì author chỉ có 1 nên nó k phải mảng
      // xóa khi xóa tác giả thì author nên null
      await Book.updateMany({ author: req.params.id }, { author: null });
      await Author.findByIdAndDelete(req.params.id);
      res.status(200).json("Deleted successfully!");
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = authorController;
