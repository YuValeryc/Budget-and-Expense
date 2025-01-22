const Goals = require('../models/Goal');
const Expenses = require('../models/ExpenseModel');

// Lấy danh sách mục tiêu
const getGoals = async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const goals = await Goals.find({ user_id });
    res.status(200).json(Array.isArray(goals) ? goals : []);
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Thêm mục tiêu mới
const addGoal = async (req, res) => {
  try {
    const { name, targetAmount, savedAmount, deadline, user_id } = req.body;

    if (!name || !targetAmount || !deadline || !user_id) {
      return res.status(400).json({ message: 'Name, targetAmount, deadline, and user_id are required' });
    }

    // Tạo mục tiêu mới
    const newGoal = new Goals({
      name,
      targetAmount: parseFloat(targetAmount),
      savedAmount: parseFloat(savedAmount) || 0,
      deadline: new Date(deadline),
      user_id,
      isCompleted: false,
    });

    const savedGoal = await newGoal.save();
    res.status(201).json(savedGoal);
  } catch (error) {
    console.error('Error adding goal and expense:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Cập nhật mục tiêu
const updateGoal = async (req, res) => {
  try {
    const { id } = req.params; // Lấy _id từ params
    const { contribution, user_id } = req.body; // Lấy dữ liệu từ body

    if (!contribution || contribution <= 0) {
      return res.status(400).json({ message: 'Contribution must be greater than 0' });
    }

    // Tìm kiếm mục tiêu bằng _id và user_id
    const goal = await Goals.findOne({ _id: id, user_id });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    // Cập nhật số tiền đã tiết kiệm
    goal.savedAmount += parseFloat(contribution);

    // Lưu mục chi tiêu mới
    const newExpense = new Expenses({
      source: goal.name,
      amount: parseFloat(contribution),
      description: "",
      category: "Đầu tư cho mục tiêu",
      user_id,
    });

    // Thực hiện song song việc lưu mục chi tiêu và cập nhật mục tiêu
    const goalPromise = goal.save();
    const expensePromise = newExpense.save();

    // Đợi cả hai promise hoàn thành
    const [updatedGoal, savedExpense] = await Promise.all([goalPromise, expensePromise]);

    if (updatedGoal.savedAmount >= updatedGoal.targetAmount) {
      // Nếu hoàn thành mục tiêu, xóa mục tiêu
      goal.isCompleted = true;
      await goal.save();
      return res.status(200).json({ message: 'Goal completed', goalId: id });
    }

    res.status(200).json(updatedGoal); // Trả về mục tiêu đã cập nhật
  } catch (error) {
    console.error('Error updating goal and expense:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Xóa mục tiêu
const deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedGoal = await Goals.findByIdAndDelete(id);

    if (!deletedGoal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.status(200).json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Error deleting goal:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  getGoals,
  addGoal,
  updateGoal,
  deleteGoal,
};
