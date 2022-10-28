const { response } = require("express");
const { Author, Book } = require("../model/model");

const bookController = {
  //Add book
  addABook: async (req, res) => {
    try {
      // req.body của Book bắt buộc người dùng phải nhập đúng những gì Book có ở model.js
      const newBook = new Book(req.body);
      // save() dùng để save data vào database
      const savedBook = await newBook.save();
      // nếu người dùng có thêm tác giả thì
      // đầu tiên tìm ra tác giả đó bằng id của tác giả
      // sau đó ta sẽ update tác giả bằng cách thêm id của cuốn sách vào mục books (model.js) của tác giả
      if (req.body.author) {
        // _id nằm trong database được tự động tạo
        // const author = Author.find({_id: req.body.author})
        // Ta có thể sử dụng câu lệnh có sẵn của mongodb
        const author = Author.findById(req.body.author);
        await author.updateOne({
          // books khai báo bên model.js
          // vì là mảng nên push =))
          $push: { books: savedBook._id },
        });
      }
      res.status(200).json(savedBook);
    } catch (error) {
      res.status(500).json(error); //HTTP ERROR CODE
    }
  },

  // GET ALL BOOKS
  getAllBooks: async (req, res) => {
    try {
      const books = await Book.find();
      res.status(200).json(books);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  //GET A BOOK
  getABook: async (req, res) => {
    try {
      const book = await Book.findById(req.params.id).populate("author");
      res.status(200).json(book);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  //UPDATE A BOOK
  updateBook: async (req, res) => {
    try {
      const book = await Book.findById(req.params.id);
      // Chỉ update được 1 thứ duy nhất với hàm updateOne, nên có $set với hàm update
      await book.updateOne({ $set: req.body });
      res.status(200).json("Updated successfully!");
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //DELETE A BOOK
  deleteBook: async (req, res) => {
    try {
      // Hàm này sẽ tìm những cuốn cách lq đến cái id mình đưa vào
      //và gỡ cuốn sách có trùng id ra khỏi mảng books nằm trong AuthorDatabase
      // Ta thêm sách vào với $push thì ta xóa xách ra khỏi mảng bằng $pull
      //books nằm trong model.js
      await Author.updateMany({books: req.params.id}, {$pull: {books: req.params.id}});
      // Hàm này chỉ xóa đi sách ở BookDatabase chứ không xóa đi book ở AuthorDatabase nên ta cần sử dụng hàm bên trên
      await Book.findByIdAndDelete(req.params.id);
      res.status(200).json("Deleted successfully");
    } catch (error) {
      res.status(500).json(error);
    }
  }
};

module.exports = bookController;
