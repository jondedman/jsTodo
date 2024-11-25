let todoItems = [
  {id: 1, task: "code all day", delegated: "Jon", due: new Date('2024-12-08T23:59:59Z')},
  {id:2, task: "tidy", delegated: "Farrah", due: new Date('2024-12-10T23:59:59Z')},
  {id: 3, task: "shop", delegated: "Marcelo", due: new Date('2024-12-09T23:59:59Z')},
  {id: 4, task: "emails", delegated: "Marcelo", due: new Date('2024-12-09T23:59:59Z')}
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

const getDragAfterElement = (container, y) => {
  // Select all draggable elements within the container that are not currently being dragged
  const draggableElements = [...container.querySelectorAll('.todo-item:not(.dragging)')];

  // Use the reduce method to find the closest element below the current mouse position
  return draggableElements.reduce((closest, child) => {
    // Get the bounding rectangle of the current element
    const box = child.getBoundingClientRect();
    // Calculate the offset of the mouse Y-coordinate from the middle of the current element
    const offset = y - box.top - box.height / 2;

    // Check if the offset is less than 0 (mouse is above the middle of the element)
    // and greater than the closest offset found so far
    if (offset < 0 && offset > closest.offset) {
      // If both conditions are met, update the closest element and offset
      return { offset: offset, element: child };
    } else {
      // Otherwise, keep the current closest element and offset
      return closest;
    }
  },
  // Initial value for the reduce function: an object with offset set to negative infinity
  // This ensures that any valid element will be closer than the initial value
  { offset: Number.NEGATIVE_INFINITY }).element; // Return the closest element found
};
const todoList = document.getElementById('todo-list');

// Allow the drop
todoList.addEventListener('dragover', (event) => {
  event.preventDefault(); // Necessary to enable dropping
  const afterElement = getDragAfterElement(todoList, event.clientY);
  const draggingElement =document.querySelector('.dragging');
  // draggingElement.classList.remove('dragging');
if (draggingElement) {
  if (afterElement == null) {
    todoList.appendChild(draggingElement);
  } else {
    todoList.insertBefore(draggingElement, afterElement)
  }
}
});

// Handle the drop
// todoList.addEventListener('drop', (event) => {
//   event.preventDefault();
//   const droppedItemId = event.dataTransfer.getData('text/plain'); // Get the dragged item’s ID
//   console.log(droppedItemId);

//   const droppedItem = document.getElementById(droppedItemId);

//   console.log('Dropped item:', droppedItem);
//   todoList.appendChild(droppedItem); // Add the item to the new container
// });

todoList.addEventListener('drop', (event) => {
  event.preventDefault();
  const draggingElement = document.querySelector('.dragging');
  draggingElement.classList.remove('dragging');
});

const completeTask = (checkbox, li) => {
  console.log("complete task called");
  console.log(li, checkbox);

  if (checkbox.checked) {
    li.classList.add('completed');
  } else {
    li.classList.remove('completed')
  }
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

const createCheckbox = (itemId) => {
  let checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  return checkbox;
};

const createSpan = (textContent) => {
  let span = document.createElement('span');
  span.textContent = textContent;
  return span;
};

const createRemoveButton = (li, itemId) => {
  let removeButton = document.createElement('button');
  removeButton.textContent = 'Remove';
  removeButton.addEventListener('click', () => {
    removeItem(li, itemId);
  });
  return removeButton;
};

const renderTodoItem = (item) => {
  let li = document.createElement('li');
  li.className = 'todo-item';
  li.id = item.id;
  li.setAttribute('draggable', true);

  let checkbox = createCheckbox(item.id);
  let taskSpan = createSpan(item.task);
  taskSpan.className = 'title-span';
  let personSpan = createSpan(item.delegated);
  let dateSpan = createSpan(formatDate(item.due));
  let removeButton = createRemoveButton(li, item.id);

  li.appendChild(checkbox);
  li.appendChild(taskSpan);
  li.appendChild(personSpan);
  li.appendChild(dateSpan);
  li.appendChild(removeButton);

  checkbox.addEventListener('change', () =>{
    completeTask(checkbox, li);
  })

  li.addEventListener('dblclick', () => {
    editItem(li, item.id);
  });
  li.addEventListener('dragstart', (event) => {
    li.classList.add('dragging');
    event.dataTransfer.setData('text/plain', event.target.id); // Store the item’s ID
  });
  li.addEventListener('dragend', () => {
    li.classList.remove('dragging');
  });

  todoList.appendChild(li);
};

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

todoItems.forEach(item =>{
  renderTodoItem(item)
});

const addButton = document.getElementById('add-item');
const deleteLastItemButton = document.getElementById('delete-last-item');

addButton.addEventListener('click', addItem);
deleteLastItemButton.addEventListener('click', deleteLastItem);
