// Seleção de elementos
const todoForm = document.querySelector('#todo-form');
const todoInput = document.querySelector('#todo-input');
const todoList = document.querySelector('#todo-list');
const editForm = document.querySelector('#edit-form');
const editInput = document.querySelector('#edit-input');
const cancelEdition = document.querySelector('#cancel-edit-btn');

let oldTodoTitle;

// Funções
const saveTodo = (text) => {
    const todo = document.createElement('div')
    todo.classList.add('todo')

    const todoTitle = document.createElement('h3')
    todoTitle.innerText = text
    todo.appendChild(todoTitle)

    const finishTodo = document.createElement('button')
    finishTodo.classList.add('finish-todo')
    const finishIcon = document.createElement('i')
    finishIcon.classList.add('fa-solid')
    finishIcon.classList.add('fa-check')
    finishTodo.appendChild(finishIcon)

    todo.appendChild(finishTodo)

    const editTodo = document.createElement('button')
    editTodo.classList.add('edit-todo')
    editTodo.innerHTML = '<i class="fa-solid fa-pen"></i>'
    todo.appendChild(editTodo)

    const removeTodo = document.createElement('button')
    removeTodo.classList.add('remove-todo')
    removeTodo.innerHTML = '<i class="fa-solid fa-xmark"></i>'
    todo.appendChild(removeTodo)

    todoList.appendChild(todo);

    todoInput.value = ""
    todoInput.focus()
}

const toggleForms = () => {
    editForm.classList.toggle('hide')
    todoForm.classList.toggle('hide')
    todoList.classList.toggle('hide')
}

const updateTodo = (text) => {
    const todos = document.querySelectorAll('.todo')

    todos.forEach((todos) => {
        let todoTitle = todos.querySelector('h3')

        if (todoTitle.innerText === oldTodoTitle) {
            todoTitle.innerText = text
        }
    })
}

// Eventos
todoForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const inputValue = todoInput.value;

    if(inputValue) {
        saveTodo(inputValue)
        
    }
})

document.addEventListener('click', (e) => {
    const targetEl = e.target
    const parentEl = targetEl.closest('div')
    let todoTitle;

    if (parentEl && parentEl.querySelector('h3')) {
        todoTitle = parentEl.querySelector('h3').innerText
    }

    if (targetEl.classList.contains("finish-todo")) {
        parentEl.classList.toggle('done')
    }

    if (targetEl.classList.contains("edit-todo")) {
        toggleForms()

        editInput.value = todoTitle;
        oldTodoTitle = todoTitle;
    }

    if (targetEl.classList.contains("remove-todo")) {
        parentEl.remove();
    }
})

cancelEdition.addEventListener('click', (e) => {
    e.preventDefault()

    toggleForms()
})

editForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const editInputValue = editInput.value

    if (editInput) {
        updateTodo(editInputValue)
    }

    toggleForms()
})