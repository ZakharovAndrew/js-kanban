class KanbanJS  {
    constructor(name) {
        this.name = name;
        this.el = document.querySelector(name);
        this.init();
    }
    
    init = () => {
        this.el.innerHTML = '<div class="kanban-js-filter"><input type="text"></div><div class="boards"></div>';
        this.el.classList.add("kanban-js");
        this.el.boards = this.el.querySelector(".boards");
        this.taskParams = [];
        this.newTaskTitle = '+ Добавить задачу';
        this.mousedown = false;
        this.mouse_event = false;

    }
    
    // set new color list
    loadBoards = (boards, func) => {
        // compiled boards to html
        this.boards = boards;
        for (let i = 0; i < this.boards.length; i++) {
            this.el.boards.innerHTML += this.boardTemplate(this.boards[i]);
            
            //console.log(this.boardTemplate(this.boards[i]));
            
        }
        
        // counters
        for (let i = 0; i < this.boards.length; i++) {
            let counter = this.el.querySelector("#board"+(this.boards[i].id)+"_counter");
            counter.innerHTML =  this.boards[i].tasks.length;
        }
        
        
        // for drag-and-drop
        this.initDragAndDrop(func);
    }
    
    initDragAndDrop = (func) => {
        let kanban_select = [];
        for (let i = 0; i < this.boards.length; i++) {
            kanban_select.push(document.querySelector("#board"+this.boards[i].id+" .tasks"));
        }
        
        // init dragula
        this.kanban_drag = dragula(kanban_select, {
            revertOnSpill: true
        });
        
        // Add a custom drop event handler (optional)
        this.kanban_drag.on('drop', (el, target, source, sibling) => {
            func(el, target, source, sibling);
        });
        
        let timerId;
        
        function countdown(){
            this.el.scrollLeft += 5;
              console.log('x, y');

          }
  
        document.addEventListener('mousemove', (e) => {
            
            if (this.kanban_drag.dragging) {
                var width = window.innerWidth
                            || document.documentElement.clientWidth
                            || document.body.clientWidth;
                let x = e.pageX;
                let y = e.pageY;
                console.log(x, y);
                console.log(e, window.width, x);
                /*if (x > width - 40) {

                    timerId = setTimeout(() => {this.el.scrollLeft += 15;
              console.log('x, y')}, 1000);
                        
                } else if (x < 40) {
                    this.el.scrollLeft -= 5;
                } else {
                    clearTimeout(timerId);
                }*/
            }
        });
        
        this.el.addEventListener('mousedown', (e) => {
            if (e.button === 0) {
                console.log(e);
                this.mousedown = true;
                this.mouse_event = e;
            }
        }, true);
        
        this.el.addEventListener('mousemove', (e) => {
            
            if (this.kanban_drag.dragging) {
                console.log(e);
            }
            if (this.mousedown) {
                console.log(e)
                this.el.scrollLeft += this.mouse_event.clientX - e.clientX;
                this.mouse_event = e;
            }
        }, true);
        
        document.addEventListener('mouseup', (e) => {this.mousedown = false;}, true);
    }
    
    taskTemplate = (task) => {
        let params = '';
        for (let i = 0; i < this.taskParams.length; i++) {
            let paramName = this.taskParams[i].name;
            let template = this.taskParams[i].template || '<p class=par-'+paramName+'><b>{%title%}</b>: {%value%}</p>';
            if (typeof task[paramName] !== 'undefined') {
                let html = template.replace('{%title%}', (this.taskParams[i].title || ''));
                
                if (typeof task[paramName] === 'object') {
                    let value_html = '';
                    task[paramName].forEach((arrayItem) => {
                        value_html += '<span class="'+this.taskParams[i].name+arrayItem+'">' + this.taskParams[i].varibles[arrayItem] + '</span>';
                    });
                    params += html.replace('{%value%}', value_html);
                } else {
                    if (typeof this.taskParams[i].varibles !== 'undefined') {
                        params += html.replace('{%value%}', '<span class="'+this.taskParams[i].name+task[paramName]+'">' +(this.taskParams[i].varibles[task[paramName]] || '') + '</span>');
                    } else {
                        params += html.replace('{%value%}', '<span class="'+this.taskParams[i].name + ' ' + this.taskParams[i].name+task[paramName]+'">' + (task[paramName] || '') + '</span>');
                    }
                }
            }
        }
        
        let deadline = '';
        if (task.datetime_deadline !== 'undefined') {
            //console.log('deadline', task['datetime_deadline']);
            var parts = task.datetime_deadline.split('.');
            const date = new Date(parts[2], parts[1] - 1, parts[0]);  // 2009-11-10
            const month = date.toLocaleString('default', { month: 'short' });
            console.log(month);
            
            
            //
            deadline = '<div class="deadline"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 10V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3m16 0v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-9m16 0H4m4-7v4m8-4v4" stroke="#fff" stroke-width="2" stroke-linecap="round"/><rect x="13" y="14" width="5" height="5" rx="1" fill="#fff"/></svg><div>'+parts[0]+' '+ month+'</div></div>';
        }
                
        return `<div class="task" data-id="${task.id}" draggable="true">
                    <img src="${task['img']}" class="img-preview">
                    <p><span class="main-content">${task['order_number']} ${task['title']}</span> <span class="task-edit" data-id="${task.id}"><svg aria-hidden="true" style="display:inline-block;font-size:inherit;height:1em;overflow:visible;vertical-align:-.125em;width:1em" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M498 142l-46 46c-5 5-13 5-17 0L324 77c-5-5-5-12 0-17l46-46c19-19 49-19 68 0l60 60c19 19 19 49 0 68zm-214-42L22 362 0 484c-3 16 12 30 28 28l122-22 262-262c5-5 5-13 0-17L301 100c-4-5-12-5-17 0zM124 340c-5-6-5-14 0-20l154-154c6-5 14-5 20 0s5 14 0 20L144 340c-6 5-14 5-20 0zm-36 84h48v36l-64 12-32-31 12-65h36v48z"></path></svg></span></p>
                    ${params}
                    <div class="task-footer">${deadline}</div>
                </div>`;
    }
    
    boardTemplate = (board) => {
        let tasks = '';
        if (typeof board.tasks !== 'undefined') {
            for (let i = 0; i < board.tasks.length; i++) {
                tasks += this.taskTemplate(board.tasks[i]);
            }
        }
        return `<div class="board-item board-item__${board.color}" id="board${board.id}" data-id="${board.id}">
                    <div class="board-header">
                        <div><span contenteditable="true" class="board-title">${board.title}</span><span id="board${board.id}_counter" class="counter"></span></div>
                        <div class="add-new-task">${this.newTaskTitle}</div>
                    </div>
                    <div class="tasks" data-board-id="${board.id}">${tasks}
                    </div>
		</div>`;
    }
    
    setTaskParams = (params) => {
        this.taskParams = params;
    }
    
    setTaskTemplate = (text) => {
        
    }
}