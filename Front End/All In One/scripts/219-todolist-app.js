$(function() {
  var $inputToggle = $('#inputToggle');
  var $newTodoInput = $('#input input');
  var $todoListSection = $('#todoList');
  var $todoList = $('#todoList ul');

  init();

  function init() {
    // Event on input toggle button.
    setupInputToggle();
    // Event on new todo input field.
    setupNewTodoInput();
    // Event on todo list section.
    setupTodoListSection();
    // Load todo list from storage.
    loadTodo();
  }


  // setupInputToggle();
  // Hide or show new todo input.
  function setupInputToggle() {
    $inputToggle.on('click', function () {
      $(this).toggleClass('inputToggleSelected');
      $newTodoInput.slideToggle(400);
    });
  }

  function setupNewTodoInput() {
    $newTodoInput.on('keydown', function (event) {
      if (event.keyCode === 13) { // If the pressed key is a return key.
        createNewTodo(event.target.value)
      }
    });
  }

  function setupTodoListSection() {
    $todoListSection.on('click', function (event) {
      let target = event.target;
      let $el = $(target);
      
      if ($el.is('button.delBtn') || $el.is('i.fa-trash-alt')) { 
        let $elParent = $el.closest('li');
        let $text = $elParent.find('.todoItem').text();
        
        $elParent.fadeOut(function() {
          deleteTodoFromStorage($text);
          $elParent.remove();
        });
      } else if ($el.is('button.doneBtn') || $el.is('i.fa-check')) { 
        let $li = $el.closest('li');
        let $text = $li.find('span.todoItem');
        let $doneBtn = $li.find('button.doneBtn');
        
        $text.toggleClass('crossed');
        $doneBtn.toggleClass('doneBtnChecked');
      } else if ($el.is('span.todoItem')) {
        let $doneBtn = $el.prevAll('button.doneBtn');
        
        $el.toggleClass('crossed');
        $doneBtn.toggleClass('doneBtnChecked');
      }
    });
  }


  
  // createNewTodo(string)
  // Create new <li>, assign events, save to localStorage, and empty the input value afterwards.
  function createNewTodo(inputValue) {
    let $newLi = $('<li>');
    let $newDoneBtn = $('<button>').addClass('doneBtn').html('<i class="fas fa-check"></i>');
    let $newDelBtn = $('<button>').addClass('delBtn').html('<i class="fas fa-trash-alt"></i>');
    let $newSpan = $('<span>').addClass('todoItem').text(inputValue);

    assignMouseEvents($newLi);
    
    $newLi.append($newDoneBtn, $newDelBtn, $newSpan)
      .hide()
      .appendTo($todoList)
      .fadeIn(400);

    saveTodo(inputValue);

    $newTodoInput.val('');
  }

  // assignMouseEvents(jQuery)
  // Assign mouse events to <li>s.
  function assignMouseEvents($el) {
    $el.on('mouseenter', function () {
      let $elButton = $(this).find('button');
      let $elSpanText = $(this).find('span.todoItem');

      $elButton.stop().slideDown(200);
      $elSpanText.css('margin-left', '10px'); // Setting margin here is to adjust the space taken by buttons.
    });

    $el.on('mouseleave', function () {
      let $elButton = $(this).find('button');
      let $elSpanText = $(this).find('span.todoItem');

      $elButton.stop().slideUp(200, function() {
        $elSpanText.css('margin-left', ''); // Margin in here as well.
      });
    });
  }

  // Local Storage Functions

  // saveTodo(string)
  function saveTodo(inputValue) {
    let todoArray = getTodoArray();

    if (todoArray.indexOf(inputValue) >= 0) { // If there is an existing string value inside storage's array.
      return; // If yes, don't save the new entry to the storage.
    } else {
      todoArray.push(inputValue);
      localStorage.setItem('todos', JSON.stringify(todoArray));
    }
  }
  
  // loadTodo()
  // Load all todo items from localStorage
  function loadTodo() {
    let todoArray = getTodoArray();
    
    $.each(todoArray, function(index, value) {
      createNewTodo(value);
    });
  }

  function deleteTodoFromStorage(textValue) {
    let todoArray = getTodoArray();
    let valueIndex = todoArray.indexOf(textValue);
    
    todoArray.splice(valueIndex, 1);

    localStorage.setItem('todos', JSON.stringify(todoArray));
  }

  // getTodoArray();
  // Retrieve todo data from localStorage, and return a parsed array.
  function getTodoArray() {
    let arr = localStorage.getItem('todos');
    let todoArray;

    if (!arr) {
      todoArray = [];
      localStorage.setItem('todos', JSON.stringify(todoArray));
    } else {
      todoArray = JSON.parse(arr);
    }
    return todoArray;
  }

  /* $('li').each(function(index, value) {
    let $value = $(value);
    assignMouseEvents($value);
  }); */
});