import { useEffect, useState } from 'react';
import './App.css';

function App() {
  /* Задаем массив заданий и функцию для его изменения */
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: [],
    status: 'null'
  });

  /* Загрузка задач из localStorage */
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('tasks'));
    if (savedData) {
      console.log("SUCCESS\n" + Object.entries(savedData));
      setTasks(savedData);
    }
  }, []);

  /* Сохранение задач в localStorage */
  useEffect(() => {
    /* 
      Проверяем, что есть задачи,
      иначе при перзапуске будет загружен пустой массив,
      объявленный в начале функции App
    */
    if (tasks.status !== 'null'/*tasks['todo'].length > 0 || tasks['inProgress'].length > 0 || tasks['done'].length > 0*/) {
      console.log(Object.entries(tasks));
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  /* Функция добавления нового задания */
  const addTask = (newTask, status) => {
    const newTaskIded = { ...newTask, id: Date.now() };
    setTasks(oldTasks => ({
      ...oldTasks,
      [status]: [...oldTasks[status], newTaskIded],
      status: 'filled'
    }));
    return newTaskIded;
  };

  const changeTask = (changedTask, status) => {
    setTasks(oldTasks => ({
      /* 
        Создаем новый массив, в который переносим старые задачи
        и добавляем изменненую, сравнивая по id
      */
      ...oldTasks,
      [status]: oldTasks[status].map(
        task => changedTask.id === task.id ? changedTask : task
      )
    }));
  };

  const deleteTask = (deletedTask, status) => {
    setTasks(oldTasks => ({
      /* 
        Создаем новый массив, в который переносим старые задачи
        и добавляем задачи в заданном статусе, кроме удаленного
      */
      ...oldTasks,
      [status]: oldTasks[status].filter(task => deletedTask.id !== task.id)
    }));
  };

  const changeTaskStatus = (changedTask, oldStatus, newStatus) => {
    setTasks(oldTasks => {
      const changedTasks = { ...oldTasks };

      /* Находим задачу для изменения статуса */
      const taskToChange = oldTasks[oldStatus].find(task => task.id === changedTask.id);

      /* Меняем ей статус */
      changedTasks[newStatus] = [...changedTasks[newStatus], taskToChange];

      /* Удаляем задачу из старого статуса */
      changedTasks[oldStatus] = changedTasks[oldStatus].filter(task => task.id !== changedTask.id);

      return changedTasks;
    })
  }

  /* Создание статусов-столбцов */
  return (
    <div className='taskboard'>
      <Status 
        title="Todo" 
        tasks={tasks.todo} 
        addTask={addTask} 
        changeTask={changeTask} 
        deleteTask={deleteTask} 
        changeTaskStatus={changeTaskStatus} 
      />
      <Status 
        title="In progress" 
        tasks={tasks.inProgress} 
        addTask={addTask} 
        changeTask={changeTask} 
        deleteTask={deleteTask} 
        changeTaskStatus={changeTaskStatus} 
      />
      <Status 
        title="Done" 
        tasks={tasks.done} 
        addTask={addTask} 
        changeTask={changeTask} 
        deleteTask={deleteTask} 
        changeTaskStatus={changeTaskStatus} 
      />
    </div>
  );
}

function Status({ title, tasks, addTask, changeTask, deleteTask, changeTaskStatus }) {
  let taskStatus = 'todo';
  if (title === "In progress") {
    taskStatus = 'inProgress';
  }
  if (title === "Done") {
    taskStatus = 'done';
  }

  /* Запоминаем редактируемую задачу */
  const [editingTask, setEditingTask] = useState();

  const handleAddTask = () => {
    /* Создание пустой задачи */
    const newTask = { title: 'test', task: 'test' };
    const newTaskIded = addTask(newTask, taskStatus);
    /* Добавление задачи на редактирование */
    setEditingTask(newTaskIded);
  };

  const handleSaveTask = (editedTask) => {
    changeTask(editedTask, taskStatus);
    /* Удаляем отредактированную задачу */
    setEditingTask(null);
  }

  const handleDeleteTask = (task) => {
    deleteTask(task, taskStatus);
  }

  const handleChangeTaskStatus = (task, oldStatus, newStatus) => {
    changeTaskStatus(task, oldStatus, newStatus);
  }

  return (
    <div className='status'>
      <div className='statusAndAddTaskButton'>
        <h2>{title}</h2>
        <button className='button' onClick={handleAddTask}>
          Add Task
        </button>
      </div>
      {tasks.map(task => (
        <Task
          key={task.id}
          task={task}
          taskStatus={taskStatus}
          setEditingTask={setEditingTask}
          /* Сообщаем, редактируется ли задача */
          isEditing={task === editingTask}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
          onChangeTaskStatus={handleChangeTaskStatus}
        />
      ))}
    </div>
  );
}

function Task({ task, taskStatus, setEditingTask, isEditing, onSave, onDelete, onChangeTaskStatus }) {
  /* Запоминаем изменение задачи */
  const [editedTask, setEditedTask] = useState(task);

  /* Определяем, куда можно переместить текущую задачу */
  let alternativeTaskStatuses = [];
  if(taskStatus === 'todo'){
    alternativeTaskStatuses = ['inProgress', 'done'];
  }
  else if (taskStatus === 'inProgress'){
    alternativeTaskStatuses = ['todo', 'done'];
  }
  else{
    alternativeTaskStatuses = ['todo', 'inProgress'];
  }

  /* Изменение задачи */
  const handleTaskChange = (event) => {
    setEditedTask({
      /* Изменяем только часть задания (название или текст) */
      ...editedTask,
      [event.target.name]: event.target.value
    });
  };

  /* Редактирование нередактируемой задачи на двойной клик по ней */
  const handleDoubleClick = () => {
    setEditingTask(task);
  }

  const handleDeleteTask = () => {
    onDelete(task);
  }

  const changeTaskStatus = (newStatus) => {
    onChangeTaskStatus(task, taskStatus, newStatus);
  }

  if (isEditing) {
    return (
      <div className='task'>
        <input
          className='header'
          type="text"
          name="title"
          value={editedTask.title}
          onChange={handleTaskChange}
        />
        <input
          className='regular'
          type="text"
          name="task"
          value={editedTask.task}
          onChange={handleTaskChange}
        />
        <button className='button' onClick={() => onSave(editedTask)}>Save</button>
      </div>
    );
  }

  return (
    <div className='task' onDoubleClick={handleDoubleClick}>
      <div className='taskTitleAndDeleteButton'>
        <h3 className='text_wrapped'>{task.title}</h3>
        <button className='delete_button' onClick={() => handleDeleteTask()}>Delete</button>
      </div>
      <p className="text_wrapped">{task.task}</p>
      <div className='taskTitleAndDeleteButton'>
        <button className='button' onClick={() => changeTaskStatus(alternativeTaskStatuses[0])}>{alternativeTaskStatuses[0]}</button>
        <button className='button' onClick={() => changeTaskStatus(alternativeTaskStatuses[1])}>{alternativeTaskStatuses[1]}</button>
      </div>
    </div>
  );
}

export default App;
