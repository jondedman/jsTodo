let todoItems = [
  {id: 1, task: "code", delegated: "Jon", due: new Date('2024-12-08T23:59:59Z')},
  {id:2, task: "tidy", delegated: "Farrah", due: new Date('2024-12-10T23:59:59Z')},
  {id: 3, task: "shop", delegated: "Marcelo", due: new Date('2024-12-09T23:59:59Z')}
];

// Function to convert ISO string to a more readable format
function formatDate(isoString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(isoString).toLocaleDateString(undefined, options);
}

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
  let taskSpan = document.createElement('span');
  let personSpan = document.createElement('span');
  let dateSpan = document.createElement('span');
  taskSpan.textContent = item["task"];
  personSpan.textContent = item["delegated"];
  dateSpan.textContent = formatDate(item["due"]);
  li.className = 'todo-item';
  li.appendChild(taskSpan);
  li.appendChild(personSpan);
  li.appendChild(dateSpan);
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
    li.classList.add('dragging');
    event.dataTransfer.setData('text/plain', event.target.id); // Store the item’s ID
  });
  li.addEventListener('dragend', () => {
    li.classList.remove('dragging');
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
