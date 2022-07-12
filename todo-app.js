(function() {
  //создаем и возвращаем заголовок приложения
  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }

  //создаем и возвращаем форму для создания дела
  function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить дело';

    buttonWrapper.append(button);
    button.disabled = true;
    form.append(input);
    form.append(buttonWrapper);

    input.addEventListener('input', () => {
      if (input.value === '') 
        button.disabled = true;
      else  
        button.disabled = false;
    })

    return {
      form,
      input,
      button
    }
  }

  //создаем и возвращаем список элементов
  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

  //создать элемент списка дел
  function createTodoItem(objectItem, arrayItem, key) {
    let item = document.createElement('li');
    //кнопки помещаем в элемент, который красиво покажет их в одной группе
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    //устанавливаем стили для элемента списка, а также для размещения кнопок
    //в его правой части с помощью flex
    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    if (objectItem.done)
      item.classList.add('list-group-item-success');
    item.textContent = objectItem.name;

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    //добавляем обработчики на кнопки
    doneButton.addEventListener('click', (e) => {
      item.classList.toggle('list-group-item-success');
      //изменить в массиве значение done и записать в localStorage
      for (let i = 0; i < item.parentNode.childNodes.length; i++) {
        if (item.parentNode.childNodes[i] === item) {
          arrayItem[i].done = !arrayItem[i].done; // начиная с позиции i, удалить 1 элемент
        }
      }
      localStorage.setItem(key, JSON.stringify(arrayItem));
    })
    deleteButton.addEventListener('click', () => {
      if (confirm('Вы уверены?')) {
        //удалить в массиве дело и записать в localStorage
        for (let i = 0; i < item.parentNode.childNodes.length; i++) {
          if (item.parentNode.childNodes[i] === item) {
            arrayItem.splice(i,1); // начиная с позиции i, удалить 1 элемент
          }
        }
        //удалить из localStorage
        localStorage.setItem(key, JSON.stringify(arrayItem));
        item.remove();
      }
    })

    //вкладываем кнопки в отдельный элемент, чтобы они объеденились а один блок
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    return {
      item,
      doneButton,
      deleteButton
    }
  }

  function createTodoApp(container, title = 'Список дел', arrayItem = [], key='myTodo') {
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm(); //form, input, button
    let todoList = createTodoList(); //ul

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    if (arrayItem.length != 0) {
      for (let i = 0; i < arrayItem.length; i++) {
        if (arrayItem[i].name != '') {
          let todoItem = createTodoItem(arrayItem[i], arrayItem, key);
          todoList.append(todoItem.item);
        }
      }
      localStorage.setItem(key, JSON.stringify(arrayItem));
    }

    //браузер создает событие submit на форме по нажатию на Enter или на кнопку создания дела
    todoItemForm.form.addEventListener('submit', function(e) {
      //эта строка необходима, чтобы предотвратить стандартное действие браузера
      //в даннном случае мы не хотим, чтобы страницы перезагружалась при отправке формы
      e.preventDefault();

      //игнорируем создание элемента, если пользователь ничего не ввел в поле
      if (!todoItemForm.input.value) {
        return;
      }

      //добавить в массив новое дело
      arrayItem.push({name: todoItemForm.input.value, done: false});
      //добавить массив в locacStorage
      localStorage.setItem(key, JSON.stringify(arrayItem));
      //console.log(JSON.parse(localStorage.getItem(key)));

      let todoItem = createTodoItem({name: todoItemForm.input.value, done: false}, arrayItem, key);

      //создаем и добавляем в список новое дело с названием из поля для ввода
      todoList.append(todoItem.item);
      todoItemForm.input.value = '';
      todoItemForm.button.disabled = true;
    })
  }

  window.createTodoApp = createTodoApp;
})();