let kanban = new KanbanJS("#kanban-js");

// дополнительные параметры карточки
kanban.setTaskParams([
    {   
        name: 'technical_task',
        title: '',
        template: '<p>{%value%}</p>'
    },
    {   
        name: 'source',
        title: '', //'Источник заказа',
        varibles: {
            1: 'Eatsy',
            2: 'ВК',
        
            3: 'Сайт'
        },
        template: '{%value%}'
    },
    {   
        name: 'tags',
        title: '',
        varibles: tags,
        template: '{%value%}'
    },
    {   
        name: 'electronics',
        title: '',
        varibles: electronics,
        template: '{%value%}'
    }
]);
        
kanban.newTaskTitle ='+ Добавить заказ';

kanban.loadBoards(kanban_data, function (el, target, source, sibling) {
    let task_id = el.getAttribute('data-id');
    let board_id = target.getAttribute('data-board-id');
    let prev_board_id = source.getAttribute('data-board-id');
        
    let pos = Array.from(el.parentNode.children).indexOf(el) + 1;
    
    // CHANGE COUNTERS
    let counter = document.querySelectorAll('#board' + board_id + ' .task');
    let prev_count = document.querySelectorAll('#board' + prev_board_id + ' .task');
    document.querySelector('#board' + board_id + '_counter').innerHTML = counter.length;
    document.querySelector('#board' + prev_board_id + '_counter').innerHTML = prev_count.length;

        
    // Custom code to handle the drop event
    console.log('task_id=', task_id, 'borad id=', board_id, 'pos=', pos);
    $.get( "/sklad/orders/change-board", { id: task_id, board_id: board_id, pos: pos })
        .done(function( data ) {
            console.log('asd');
        }, "json" );
});
        
$(document).on('click', ".add-new-task", function() {
    document.location  = '/sklad/orders/create';
});
$(document).on('click', ".task-edit", function() {
    document.location  = '/sklad/orders/update?id=' + $(this).data('id');
});

$(".kanban-js-filter input").on('change keyup', function() {
    
    let text = $(this).val().toLowerCase();
    let tasks = $('.tasks .task');
    for (let i = 0; i < tasks.length; i++) {
            let content = $(tasks[i]).find('.main-content');
            let content2 = $(tasks[i]).find('.technical_task');
            console.log(content.html());
            if (text == '' || content.html().toLowerCase().indexOf(text) !== -1 || content2.html().toLowerCase().indexOf(text) !== -1) {
                $(tasks[i]).show();
            } else {
                $(tasks[i]).hide();
            }
            //console.log(this.boardTemplate(this.boards[i]));
            
        }
            //main-content
    console.log(text); 
});

// ENABLE AUTOSCROLL FOR GOALS LIST
/*var scroll = autoScroll([
    document.querySelector('.tasks'),
    // document.querySelector('#board2')
], {
    margin: 5,
    maxSpeed: 10,
    scrollWhenOutside: false,
    autoScroll: function () {
        //Only scroll when the pointer is down
        return this.down
    }
});*/

// **list-items** are the dom elements that you need to include for scrolling
    const elements = Array.from(document.querySelectorAll('.tasks'));
    // Enable autoscrolling
    autoScroll(elements, {
      margin: 50,
      maxSpeed: 50,
      scrollWhenOutside: false,
      autoScroll: function () {
        // Only scroll when the pointer is down
        return this.down;
      }
    });

console.log('scroll', scroll);

document.addEventListener('touchmove', (e) => {
    if (kanban.kanban_drag.dragging) {
        e.preventDefault();
    }
}, {passive: false});