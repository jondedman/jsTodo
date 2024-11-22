let todoItems = [
  {id: 1, task: "code"},
  {id:2, task: "tidy"},
  {id: 3, task: "shop"}
];

const findItemById = (id) => {
  return todoItems.find(item =>item.id == id);
}

const removeFromCache = (itemId) => {
  todoItems = todoItems.filter(item => item.id !== itemId);
}

const addToCache =  (newTask) => {
  todoItems.push(newTask)
}

const todoList = document.getElementById('todo-list');

// Allow the drop
todoList.addEventListener('dragover', (event) => {
  event.preventDefault(); // Necessary to enable dropping
  console.log('Drag over a drop zone');
});

// Handle the drop
todoList.addEventListener('drop', (event) => {
  event.preventDefault();
  const droppedItemId = event.dataTransfer.getData('text/plain'); // Get the dragged item’s ID
  console.log(droppedItemId);

  const droppedItem = document.getElementById(droppedItemId);

  console.log('Dropped item:', droppedItem);
  todoList.appendChild(droppedItem); // Add the item to the new container
});

const completeTask = (checkbox, li) => {
  checkbox.addEventListener('change', () =>{
    if (checkbox.checked) {
      li.classList.add('completed');
    } else {
      li.classList.remove('completed')
    }
  })
}

const editItem = (li, itemId) => {
  let newtext = prompt('Edit item');
  let span = li.querySelector('span');
  if (newtext){
    span.textContent = newtext;
    }
    let item = findItemById(itemId);
    item.task = newtext;
  }

  const removeItem = (li, itemId) => {
    removeFromCache(itemId);
    todoList.removeChild(li);
  }

const renderTodoItem = (item) => {
  let checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  let li =  document.createElement('li');
  let span = document.createElement('span');
  span.textContent = item["task"];
  li.className = 'todo-item';
  li.appendChild(span);
  li.setAttribute('draggable', true);
  let itemId = item["id"];
  li.id = itemId;

  let removeButton = createRemoveButton();
  removeButton.addEventListener('click', ()=>{
    removeItem(li, itemId);
  });
  completeTask(checkbox, li);
  li.prepend(checkbox);
  li.appendChild(removeButton);
  li.addEventListener('dblclick', ()=>{
    editItem(li, itemId);
  });
  li.addEventListener('dragstart', (event) => {
    console.log('Drag started:', event.target);
    event.dataTransfer.setData('text/plain', event.target.id); // Store the item’s ID
  });
  todoList.appendChild(li);
}

const addItem = () => {
  let text = prompt('Enter a new Item');
  let newId = todoItems[todoItems.length-1]['id'] + 1
  item = {id: newId, task: text}
  addToCache(item);
  renderTodoItem(item);
}

const deleteLastItem = () => {
  let lastItem =  todoList.lastChild;
  todoList.removeChild(lastItem);
}

const createRemoveButton = () => {
  let removeButton = document.createElement('button');
  removeButton.textContent = "X";
  removeButton.className = "deleteButton";
  return removeButton;
}

todoItems.forEach(item =>{
  renderTodoItem(item)
});

const addButton = document.getElementById('add-item');
const deleteLastItemButton = document.getElementById('delete-last-item');

addButton.addEventListener('click', addItem);
deleteLastItemButton.addEventListener('click', deleteLastItem);
