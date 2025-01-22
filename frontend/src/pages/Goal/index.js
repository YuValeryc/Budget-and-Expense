import React, { useState, useEffect, useContext } from 'react';
import './Goal.css';
import AuthContext from '../../components/AuthContext/AuthContext';
import { notify } from '../../components/Notify/notification';
import { CurrencyContext } from '../../components/AuthContext/CurrencyContext';
import { useLoading } from '../../components/AuthContext/Loading';
import { useAlert } from '../../components/Notify/Confirm';

const GoalPage = () => {
  const [goals, setGoals] = useState([]);
  const [name, setName] = useState('');
  const { currency, position } = useContext(CurrencyContext);
  const [targetAmount, setTargetAmount] = useState('');
  const [savedAmount, setSavedAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [contribution, setContribution] = useState({});
  const { user } = useContext(AuthContext);
  const [completedGoals, setCompletedGoals] = useState([]);
  const [ongoingGoals, setongoingGoals] = useState([]);
  const { startLoading, stopLoading } = useLoading();
  const [showModal, setShowModal] = useState(false);
  const { showConfirm } = useAlert();

  const fetchGoal = async (user) =>{
    fetch(`http://localhost:5000/goals/show?user_id=${user.user_id}`)
      .then((response) => response.json())
      .then((data) => {
        setGoals(data);
        setCompletedGoals(data.filter((goal) => goal.isCompleted));
        setongoingGoals(data.filter((goal) => !goal.isCompleted));
      })
      .catch((error) => {
        console.error('Error fetching goals:', error);
      });
  }
  useEffect(() => {
    startLoading();
    fetchGoal(user);
    stopLoading();
  }, [user, goals]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newGoal = {
      name,
      targetAmount: parseInt(targetAmount),
      savedAmount: parseInt(savedAmount),
      deadline,
      user_id: user.user_id,
    };
    if(new Date(deadline) < new Date()){
      notify(3, "Dealine phải sau ngày hôm nay", 'Warning');
      return;
    }
    console.log(newGoal);
    
    if(parseInt(targetAmount) < parseInt(savedAmount)){
      notify(3, "Mục tiêu có số tiền đã hoàn thành", 'Warning');
      return;
    }
    startLoading();
    fetch('http://localhost:5000/goals/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newGoal),
    })
      .then((response) => response.json())
      .then((data) => {
        setGoals([...goals, data]);
        setName('');
        setTargetAmount('');
        setSavedAmount('');
        setDeadline('');
      })
      .catch((error) => console.error('Error adding goal:', error));
    stopLoading();
  };

  const handleContribution = (goalId, amount, name) => {
    if (!amount || amount <= 0) {
      notify(2, 'Số tiền đóng góp phải lớn hơn 0', 'Error');
      return;
    }
    startLoading();
    fetch(`http://localhost:5000/goals/update/${goalId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ contribution: amount, user_id: user.user_id }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update goal');
        }
        return response.json();
      })
      .then((response) => {
        if (response.message === 'Goal completed') {
          notify(1, `Mục tiêu  ${name} đã hoàn thành`, 'Success');
        }
        fetchGoal(user); // Gọi lại hàm fetchGoal
        setContribution({ ...contribution, [goalId]: '' });
      })
      .catch((error) => {
        console.error('Error updating goal:', error);
        notify(2, 'Lỗi cập nhật mục tiêu', 'Error');
      })
      .finally(stopLoading);
  };
  

  const extendDeadline = (goalId, newDeadline) => {
    if (new Date(newDeadline) <= new Date()) {
      notify(2, 'Hạn mới phải lớn hơn hôm nay', 'Error');
      return;
    }
    startLoading();
    fetch(`http://localhost:5000/goals/updateDeadline/${goalId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newDeadline }),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to extend deadline');
        return response.json();
      })
      .then(() => {
        notify(1, 'Đã gia hạn thời gian thành công', 'Success');
        fetchGoal(user); // Gọi lại hàm fetchGoal
      })
      .catch((error) => {
        console.error('Error extending deadline:', error);
        notify(2, 'Lỗi khi gia hạn thời gian', 'Error');
      })
      .finally(stopLoading);
  };
  
  
  const deleteGoal = async (goalId) => {
    const confirmed = await showConfirm({
      title: 'Bạn có chắc không?',
      text: 'Hành động này không thể hoàn tác!',
      icon: 'warning',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
    });

    if (!confirmed) {
      return;
    } 
    startLoading();
    fetch(`http://localhost:5000/goals/delete/${goalId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to delete goal');
        return response.json();
      })
      .then(() => {
        notify(1, 'Đã xóa mục tiêu thành công', 'Success');
        fetchGoal(user); // Gọi lại hàm fetchGoal
      })
      .catch((error) => {
        console.error('Error deleting goal:', error);
        notify(2, 'Lỗi khi xóa mục tiêu', 'Error');
      })
      .finally(stopLoading);
  };

  const totalGoals = goals.length;
  const ongoingGoalsCount = goals.filter((goal) => !goal.isCompleted).length;
  const completedGoalsCount = completedGoals.length;

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  return (
    <div className="goal-page-container">
      <h1>Quản lý mục tiêu tài chính</h1>

      <div className="goal-summary">
        <div>
          <p>Tổng số mục tiêu</p>
          <p>{totalGoals}</p>
        </div>
        <div>
          <p>Số mục tiêu hoàn thành</p>
          <p>{completedGoalsCount}</p>
        </div>
        <div>
          <p>Số mục tiêu đang thực hiện</p>
          <p>{ongoingGoalsCount}</p>
        </div>
        <button onClick={toggleModal}>Lịch sử hoàn thành</button>
      </div>


      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Lịch sử các mục tiêu đã hoàn thành</h2>
            <button className="close-modal" onClick={toggleModal}>X</button>
            <ul>
              {completedGoals.map((goal) => (
                <li key={goal._id} className='completed-goal'>
                  <h3>{goal.name}</h3>
                  <p>Ngày hoàn thành: {formatDate(goal.deadline)}</p>
                  <button className='button-delete' onClick={() => deleteGoal(goal._id)}>Xóa</button> 
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="goal-form">
        <h3>Thêm mục tiêu tài chính</h3>
        <input
          type="text"
          placeholder="Tên mục tiêu"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Số tiền cần đạt"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Số tiền đã tiết kiệm"
          value={savedAmount}
          onChange={(e) => setSavedAmount(e.target.value)}
          required
        />
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          required
        />
        <button type="submit">Thêm mục tiêu</button>
      </form>

      <div className="goal-list">
        <h2>Mục tiêu tài chính của bạn</h2>
        <ul>
          {ongoingGoals.map((goal) => {
            const isOverdue = new Date(goal.deadline) < new Date(); 
            return (
              <li key={goal._id}>
                <h3>{goal.name}</h3>
                <p>Số tiền cần đạt: {position === 0 ? `${currency} ${goal.targetAmount}` : `${goal.targetAmount} ${currency}`}</p>
                <p>Số tiền đã tiết kiệm: {position === 0 ? `${currency} ${goal.savedAmount}` : `${goal.savedAmount} ${currency}`}</p>
                <p>Ngày hoàn thành: {goal.deadline}</p>
                {isOverdue &&<>
                  <p className="overdue">Quá thời hạn</p>
                  <div>
                    <p>Gia hạn thời gian</p>
                    <input
                      type="date"
                      onChange={(e) => extendDeadline(goal._id, e.target.value)}
                    />
                  </div>
                </> }
                
                {!isOverdue && <div>
                  <input
                    type="number"
                    placeholder="Số tiền đóng góp"
                    value={contribution[goal._id] || ''}
                    onChange={(e) =>
                      setContribution({ ...contribution, [goal._id]: e.target.value })
                    }
                  />
                  <button
                    onClick={() =>
                      handleContribution(goal._id, parseInt(contribution[goal._id]), goal.name)
                    }
                  >
                    Đóng góp
                  </button>
                </div>}
                <button onClick={() => deleteGoal(goal._id)}>Xóa mục tiêu</button> 
              </li>
            );
          })}
        </ul>
      </div>

    </div>
  );
};

export default GoalPage;
