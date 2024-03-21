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
      /* 
        Создаем новый массив, в который переносим старые задачи
        и добавляем изменненую, сравнивая по id
      */
      ...oldTasks,
      [status]: oldTasks[status].map(
        task => changedTask.id === task.id ? changedTask : task
      )
    }));
  }

  const deleteTask = (deletedTask, status) => {
    setTasks(oldTasks => ({
      /* 
        Создаем новый массив, в который переносим старые задачи
        и добавляем задачи в заданном статусе, кроме удаленного
      */
      ...oldTasks,
      [status]: oldTasks[status].filter(task => deletedTask.id !== task.id)
    }));
  }

  /* Создание статусов-столбцов */
  return (
    <div className='taskboard'>
      <Status title="Todo" tasks={tasks.todo} addTask={addTask} changeTask={changeTask} deleteTask={deleteTask} />
      <Status title="In progress" tasks={tasks.inProgress} addTask={addTask} changeTask={changeTask} deleteTask={deleteTask} />
      <Status title="Done" tasks={tasks.done} addTask={addTask} changeTask={changeTask} deleteTask={deleteTask} />
    </div>
  );
}

function Status({ title, tasks, addTask, changeTask, deleteTask }) {
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
          task={task}
          setEditingTask={setEditingTask}
          /* Сообщаем, редактируется ли задача */
          isEditing={task === editingTask}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
        />
      ))}
    </div>
  );
}

function Task({ task, setEditingTask, isEditing, onSave, onDelete }) {
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

  /* Редактирование нередактируемой задачи на двойной клик по ней */
  const handleDoubleClick = () => {
    setEditingTask(task);
  }

  const handleDeleteTask = () => {
    onDelete(task);
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
        <button className='button' onClick={() => handleDeleteTask()}>Delete</button>
      </div>
      <p className="text_wrapped">{task.task}</p>
    </div>
  );
}

export default App;
