import { useState } from 'react';
import './App.css';

function App() {
  /* Задаем массив заданий и функцию для его изменения */
  const [tasks, setTasks] = useState({
    todo: [{id: Date.now(), title: "Clean", task: "Wash dishes" }],
    inProgress: [{id: Date.now(), title: "Cook", task: "Pizza" }],
    done: []
  });

  /* Функция добавления нового задания */
  const addTask = (newTask, status) => {
    const newTaskIded = { ...newTask, id: Date.now() };
    setTasks(oldTasks => ({
      ...oldTasks,
      [status]: [...oldTasks[status], newTaskIded]
    }));
    return newTaskIded;
  };

  const changeTask = (changedTask, status) => {
      setTasks(oldTasks => ({
      ...oldTasks,
      /* 
        Создаем новый массив, в который переносим старые задачи
        и добавляем изменненую, сравнивая по id
      */
      [status]: oldTasks[status].map(
        task => changedTask.id === task.id ? changedTask : task
      )
    }));
  }

  /* Создание статусов-столбцов */
  return (
    <div className='taskboard'>
      <Status title="Todo" tasks={tasks.todo} addTask={addTask} changeTask={changeTask} />
      <Status title="In progress" tasks={tasks.inProgress} addTask={addTask} changeTask={changeTask} />
      <Status title="Done" tasks={tasks.done} addTask={addTask} changeTask={changeTask} />
    </div>
  );
}

function Status({ title, tasks, addTask, changeTask }) {
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

  return (
    <div className='status'>
      <div className='statAddTask'>
        <h2>{title}</h2>
        <button className='button' onClick={handleAddTask}>
          Add Task
        </button>
      </div>
      {tasks.map(task => (
        <Task
          task={task}
          /* Сообщаем, редактируется ли задача */
          isEditing={task === editingTask}
          onSave={handleSaveTask}
        />
      ))}
    </div>
  );
}

function Task({ task, isEditing, onSave }) {
  /* Запоминаем изменение задачи */
  const [editedTask, setEditedTask] = useState(task);

  /* Изменение задачи */
  const handleTaskChange = (event) => {
    setEditedTask({
      /* Изменяем только часть задания (название или текст) */
      ...editedTask,
      [event.target.name]: event.target.value
    });
  };

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
    <div className='task'>
      <h3 className='text_wrapped'>{task.title}</h3>
      <p className="text_wrapped">{task.task}</p>
    </div>
  );
}

export default App;
