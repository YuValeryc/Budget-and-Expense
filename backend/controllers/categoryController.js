const Categories = require("../models/Category"); 

const getCategories = async (req, res) => {
  try {
    const { user_id, type } = req.query;
    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Tìm tất cả danh mục của người dùng
    let categories = await Categories.find({ user_id, type });

    if (categories.length === 0) {
      const defaultCategories = [
        { name: 'Ăn uống', type: 'expense', user_id },
        { name: 'Đi lại', type: 'expense', user_id },
        { name: 'Tiền nhà', type: 'expense', user_id },
        { name: 'Tiền điện', type: 'expense', user_id },
        { name: 'Tiền lương', type: 'income', user_id },
        { name: 'Đầu tư', type: 'income', user_id },
        { name: 'Tiền thưởng', type: 'income', user_id },
        { name: 'Đầu tư cho mục tiêu', type: 'expense', user_id },
      ];

      await Categories.insertMany(defaultCategories);

      // Lấy lại danh sách sau khi thêm
      categories = await Categories.find({ user_id, type });
    }

    res.status(200).json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// Thêm danh mục
const addCategory = async (req, res) => {
  try {
    const { name, user_id, type } = req.body; // Lấy tên danh mục và user_id từ body

    if (!name || !user_id) {
      return res.status(400).json({ message: "Name and user_id are required" });
    }

    // Tạo mới một danh mục
    const newCategory = new Categories({
      name,
      user_id,
      type,
    });

    // Lưu danh mục vào cơ sở dữ liệu
    await newCategory.save();

    // Trả về danh mục vừa tạo
    res.status(201).json(newCategory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Xóa danh mục
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID từ URL parameters
    const { user_id, type } = req.query; // Lấy user_id từ query string
    
    if (!id || !user_id) {
      return res.status(400).json({ message: "Category ID and user ID are required" });
    }

    // Xóa danh mục theo ID và user_id
    const deletedCategory = await Categories.findOneAndDelete({
      _id: id,
      user_id,
      type
    });

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Trả về thông báo thành công
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getCategories,
  addCategory,
  deleteCategory,
};
