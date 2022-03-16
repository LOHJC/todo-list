

//https://developer.mozilla.org/en-US/docs/Web/API/Document/drag_event
function sub_todo_drag_start(e)
{
	e.dataTransfer.effectAllowed = "move";
	this.style.opacity = 0.5;
}

function sub_todo_drag(e)
{
	item_dragged = this;
	this.style.opacity = 0;
}

function sub_todo_drag_over(e)
{
	e.preventDefault();
	this.style.opacity = 0.5;
}

function sub_todo_drag_leave(e)
{
	this.style.opacity = 1;
}

function sub_todo_drag_end(e)
{
	this.style.opacity = 1;
}

function sub_todo_drop(e)
{
	this.style.opacity = 0.8;
	
	//check which item it is dropped
	//console.log("item_dragged:", item_dragged)
	//console.log("item_placed:",this)
	
	//need to make sure both have same parent
	if (this.parentNode == item_dragged.parentNode)
	{
		//console.log("same parent");
		let parent_item = this.parentNode;
		let parent_id = parent_item.id;
		
		//just change both places and id and position in Array
		let drag_id = item_dragged.id;
		let drop_id = this.id;
		
		for (let i=0; i < todo_array.length; i++)
		{
			if (todo_array.id == parent_id)
			{
				let drag_idx = drag_id.replace("sub_todo_item_","").substring(drag_id.replace("sub_todo_item_","").indexOf("_")+1, drag_id.length);
				let drop_idx = drop_id.replace("sub_todo_item_","").substring(drag_id.replace("sub_todo_item_","").indexOf("_")+1, drop_idx.length);
				
				//exhange list item
				let temp = todo_array[i].sub[drag_idx];
				todo_array[i].sub[drag_idx] = todo_array[i].sub[drop_idx];
				todo_array[i].sub[drop_idx] = temp;
				updateArrays()
				break;
			}
		}
	}
}

//add event listener for drag item
let sub_items = document.getElementsByClassName("sub_todo_item");
let item_dragged;
for (let i=0; i < sub_items.length; i++)
{
	let item = sub_items[i];
	item.addEventListener("dragstart", sub_todo_drag_start);
	item.addEventListener("drag", sub_todo_drag);
	item.addEventListener("dragend", sub_todo_drag_end);
	item.addEventListener("dragover", sub_todo_drag_over);
	item.addEventListener("dragenter", sub_todo_drag_over);
	item.addEventListener("dragleave", sub_todo_drag_leave);
	item.addEventListener("drop", sub_todo_drop);
}