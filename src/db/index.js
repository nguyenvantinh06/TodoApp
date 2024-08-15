import * as SQLite from 'expo-sqlite';

const db = await SQLite.openDatabaseAsync('database');

const executeSql = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        sql,
        params,
        (_, result) => resolve(result),
        (_, err) => reject(err)
      );
    });
  });
};

export const init = () => {
  const createTasksTable = `
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      priority TEXT NOT NULL,
      done INTEGER NOT NULL
    );`;
  const createRemindersTable = `
    CREATE TABLE IF NOT EXISTS reminders (
      id INTEGER PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      time TEXT NOT NULL,
      notifications INTEGER NOT NULL
    );`;

  return Promise.all([
    executeSql(createTasksTable),
    executeSql(createRemindersTable)
  ]);
};

export const insertTask = (data) => {
  const sql = `INSERT INTO tasks (title, description, priority, done) VALUES (?, ?, ?, ?);`;
  const params = [data.title, data.description, data.priority, data.done];
  return executeSql(sql, params);
};

export const updateTask = (id, data) => {
  const sql = `UPDATE tasks SET title = ?, description = ?, priority = ?, done = ? WHERE id = ?;`;
  const params = [data.title, data.description, data.priority, data.done, id];
  return executeSql(sql, params);
};

export const toggleDone = (id) => {
  const sql = `UPDATE tasks SET done = NOT done WHERE id = ?;`;
  return executeSql(sql, [id]);
};

export const deleteTask = (id) => {
  const sql = `DELETE FROM tasks WHERE id = ?;`;
  return executeSql(sql, [id]);
};

export const getTasks = () => {
  const sql = `SELECT * FROM tasks;`;
  return executeSql(sql);
};

export const insertReminder = (data) => {
  const sql = `INSERT INTO reminders (title, description, time, notifications) VALUES (?, ?, ?, ?);`;
  const params = [data.title, data.description, data.time, data.notifications];
  return executeSql(sql, params);
};

export const updateReminder = (id, data) => {
  const sql = `UPDATE reminders SET title = ?, description = ?, time = ?, notifications = ? WHERE id = ?;`;
  const params = [data.title, data.description, data.time, data.notifications, id];
  return executeSql(sql, params);
};

export const toggleNotifications = (id) => {
  const sql = `UPDATE reminders SET notifications = NOT notifications WHERE id = ?;`;
  return executeSql(sql, [id]);
};

export const deleteReminder = (id) => {
  const sql = `DELETE FROM reminders WHERE id = ?;`;
  return executeSql(sql, [id]);
};

export const getReminders = () => {
  const sql = `SELECT * FROM reminders;`;
  return executeSql(sql);
};
