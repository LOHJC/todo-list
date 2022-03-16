"use strict"

//load all images 
let img_idx = 0;
let img_list = ["home.png","save.png", "delete.png", "dropdown.png", "pullup.png", "add.png", "not_saved.png", "saving.png", "done_saved.png", "move.png"]
let img = new Image();
img.src = img_list[img_idx];
img.onload = () => {
	if (img_idx < img_list.length - 1)
	{
		img_idx += 1
		img.src = img_list[img_idx];
	}
}

//file variable to create and save file
let file_handle;
let fileOptions = {
	types: [
		{
			description: "TODOLOH",
			accept: {
				"text/markdown": [".tdl"]
			},
			excludeAcceptAllOption: true,
			multiple: false
		}
	]
};

let ITEM_ID = 0;
let todo_array = [];
let working_array = [];
let done_array = [];


//load todo.html into index.html
//https://reactgo.com/get-element-from-iframe-javascript/
//https://stackoverflow.com/questions/1088544/get-element-from-within-an-iframe
let todo_web = document.getElementById("todo_iframe");
let todo_web_content = "";
todo_web.onload = () => {
    todo_web_content = todo_web.contentDocument || todo_web.contentWindow.document;
}

//go to todo.html
function gotoToDoHTML(filename, content)
{
	if (todo_web_content)
	{
		let index_header = document.getElementsByTagName("header")[0];
		let index_footer = document.getElementsByTagName("footer")[0];
		let index_section = document.getElementsByTagName("section")[0];
		
		index_header.innerHTML = todo_web_content.getElementsByTagName("header")[0].innerHTML;
		index_footer.innerHTML = todo_web_content.getElementsByTagName("footer")[0].innerHTML;
		index_section.innerHTML = todo_web_content.getElementsByTagName("section")[0].innerHTML;
		
		if (filename && content)
		{
			//check if the uploaded file is normal todo list
			let parts = content.split("\r\n\r\n")
			if (parts.length == 3)
			{
				//set the todo array
				setToDoArray(parts[0]);
				//console.log(todo_array);
				
				//set the working array
				setWorkingArray(parts[1]);
				//console.log(working_array);
				
				//set the done array
				setDoneArray(parts[2]);
				//console.log(done_array);
				
				//show the uploaded todo list
				if (todo_array.length != 0 || working_array.length != 0 || done_array.length != 0)
				{
					//set the file name
					let todo_filename = document.getElementById("todo_filename")
					todo_filename.innerHTML = filename.replace(".tdl","");
					todo_filename.contentEditable = false;
					
					//todo
					let items = document.getElementById("todo_items");
					items.innerHTML = "";
					
					for (let i=0; i < todo_array.length; i++)
					{
						let item = document.createElement("div");
						item.classList.add("item");
						//item.setAttribute("draggable",true);
						
						let main_item = document.createElement("div");
						main_item.classList.add("main_todo_item");
						main_item.id = "main_todo_item_" + todo_array[i].id;
						let move_icon = document.createElement("div");
						move_icon.classList.add("move_icon");
						move_icon.onmousedown = () => {moveItem(item);};						
						let main_input = document.createElement("div");
						main_input.classList.add("textarea");
						main_input.contentEditable = true;
						main_input.spellcheck = false;
						main_input.innerHTML = todo_array[i].main;
						main_input.addEventListener("DOMSubtreeModified", () => {contentChanged()}) //trigger content change for textarea
						let delete_icon = document.createElement("div");
						delete_icon.classList.add("delete_item");
						delete_icon.onclick = () => {deleteItem(main_item.id);}
						main_item.appendChild(move_icon);
						main_item.appendChild(main_input);
						main_item.appendChild(delete_icon);
						item.appendChild(main_item);
						
						for (let j=0; j < todo_array[i].sub.length; j++)
						{
							let sub_item = document.createElement("div");
							sub_item.classList.add("sub_todo_item");
							sub_item.id = "sub_todo_item_"+todo_array[i].id+"_"+j;
							sub_item.setAttribute("draggable", true);
							let checkbox_div = document.createElement("div");
							let checkbox_input = document.createElement("input");
							let checkbox_tick =  todo_array[i].sub[j].split(",")[1];
							checkbox_input.type = "checkbox";
							checkbox_input.onchange = () => {checkCheckbox(sub_item.id); contentChanged()}; //trigger content change for checkbox
							if (checkbox_tick == "Y")
								checkbox_input.checked = true;
							else if (checkbox_tick == "N")
								checkbox_input.checked = false;
							checkbox_div.appendChild(checkbox_input);
							let sub_input = document.createElement("div");
							sub_input.classList.add("textarea");
							sub_input.contentEditable = true;
							sub_input.spellcheck = false;
							sub_input.addEventListener("DOMSubtreeModified", () => {contentChanged()}) //trigger content change for textarea
							let sub_content = todo_array[i].sub[j].split(",")[0];
							sub_input.innerHTML = sub_content;
							let delete_icon = document.createElement("div");
							delete_icon.classList.add("delete_item");
							delete_icon.onclick = () => {deleteItem(sub_item.id)};
							sub_item.appendChild(checkbox_div);	
							sub_item.appendChild(sub_input);
							sub_item.appendChild(delete_icon);
							item.appendChild(sub_item);
						}
						
						let add_sub_item_button = document.createElement("div");
						add_sub_item_button.classList.add("round_button");
						add_sub_item_button.classList.add("add_sub_todo_item");
						add_sub_item_button.onclick = () => {addSubToDoItem(main_item.id)};
						item.appendChild(add_sub_item_button);
						items.appendChild(item);
					}
					
					//working
					items = document.getElementById("working_items");
					items.innerHTML = "";
					
					for (let i=0; i < working_array.length; i++)
					{
						let item = document.createElement("div");
						item.classList.add("item");
						//item.setAttribute("draggable",true);
						
						let main_item = document.createElement("div");
						main_item.classList.add("main_working_item");
						main_item.id = "main_working_item_" + working_array[i].id;
						let move_icon = document.createElement("div");
						move_icon.classList.add("move_icon");
						move_icon.onmousedown = () => {moveItem(item);};						
						let main_input = document.createElement("div");
						main_input.classList.add("textarea");
						main_input.contentEditable = true;
						main_input.spellcheck = false;
						main_input.innerHTML = working_array[i].main;
						main_input.addEventListener("DOMSubtreeModified", () => {contentChanged()}) //trigger content change for textarea
						let delete_icon = document.createElement("div");
						delete_icon.classList.add("delete_item");
						delete_icon.onclick = () => {deleteItem(main_item.id);}
						main_item.appendChild(move_icon);
						main_item.appendChild(main_input);
						main_item.appendChild(delete_icon);
						item.appendChild(main_item);
						
						for (let j=0; j < working_array[i].sub.length; j++)
						{
							let sub_item = document.createElement("div");
							sub_item.classList.add("sub_working_item");
							sub_item.id = "sub_working_item_"+working_array[i].id+"_"+j;
							sub_item.setAttribute("draggable", true);
							let checkbox_div = document.createElement("div");
							let checkbox_input = document.createElement("input");
							let checkbox_tick =  working_array[i].sub[j].split(",")[1];
							checkbox_input.type = "checkbox";
							checkbox_input.onchange = () => {checkCheckbox(sub_item.id); contentChanged()}; //trigger content change for checkbox
							if (checkbox_tick == "Y")
								checkbox_input.checked = true;
							else if (checkbox_tick == "N")
								checkbox_input.checked = false;
							checkbox_div.appendChild(checkbox_input);
							let sub_input = document.createElement("div");
							sub_input.classList.add("textarea");
							sub_input.contentEditable = true;
							sub_input.spellcheck = false;
							sub_input.innerHTML = working_array[i].sub[j].split(",")[0];
							sub_input.addEventListener("DOMSubtreeModified", () => {contentChanged()}) //trigger content change for textarea
							let delete_icon = document.createElement("div");
							delete_icon.classList.add("delete_item");
							delete_icon.onclick = () => {deleteItem(sub_item.id)};
							sub_item.appendChild(checkbox_div);	
							sub_item.appendChild(sub_input);
							sub_item.appendChild(delete_icon);
							item.appendChild(sub_item);
						}
						
						let add_sub_item_button = document.createElement("div");
						add_sub_item_button.classList.add("round_button");
						add_sub_item_button.classList.add("add_sub_working_item");
						add_sub_item_button.onclick = () => {addSubWorkingItem(main_item.id)};
						item.appendChild(add_sub_item_button);
						items.appendChild(item);
					}
					
					//done
					items = document.getElementById("done_items");
					items.innerHTML = "";
					
					for (let i=0; i < done_array.length; i++)
					{
						let item = document.createElement("div");
						item.classList.add("item");
						//item.setAttribute("draggable",true);
						
						let main_item = document.createElement("div");
						main_item.classList.add("main_done_item");
						main_item.id = "main_done_item_" + done_array[i].id;
						let move_icon = document.createElement("div");
						move_icon.classList.add("move_icon");
						move_icon.onmousedown = () => {moveItem(item);};						
						let main_input = document.createElement("div");
						main_input.classList.add("textarea");
						main_input.contentEditable = true;
						main_input.spellcheck = false;
						main_input.innerHTML = done_array[i].main;
						main_input.addEventListener("DOMSubtreeModified", () => {contentChanged()}) //trigger content change for textarea
						let delete_icon = document.createElement("div");
						delete_icon.classList.add("delete_item");
						main_item.appendChild(move_icon);
						main_item.appendChild(main_input);
						main_item.appendChild(delete_icon);
						delete_icon.onclick = () => {deleteItem(main_item.id);}
						item.appendChild(main_item);
						
						for (let j=0; j < done_array[i].sub.length; j++)
						{
							let sub_item = document.createElement("div");
							sub_item.classList.add("sub_done_item");
							sub_item.id = "sub_done_item_" + done_array[i].id + "_" + j;
							sub_item.setAttribute("draggable", true);
							let checkbox_div = document.createElement("div");
							let checkbox_input = document.createElement("input");
							checkbox_input.onchange = () => {checkCheckbox(sub_item.id); contentChanged()}; //trigger content change for checkbox
							let checkbox_tick =  done_array[i].sub[j].split(",")[1];
							checkbox_input.type = "checkbox";
							if (checkbox_tick == "Y")
								checkbox_input.checked = true;
							else if (checkbox_tick == "N")
								checkbox_input.checked = false;
							checkbox_div.appendChild(checkbox_input);
							let sub_input = document.createElement("div");
							sub_input.classList.add("textarea");
							sub_input.contentEditable = true;
							sub_input.spellcheck = false;
							sub_input.innerHTML = done_array[i].sub[j].split(",")[0];
							sub_input.addEventListener("DOMSubtreeModified", () => {contentChanged()}) //trigger content change for textarea
							let delete_icon = document.createElement("div");
							delete_icon.classList.add("delete_item");
							delete_icon.onclick = () => {deleteItem(sub_item.id)};
							sub_item.appendChild(checkbox_div);	
							sub_item.appendChild(sub_input);
							sub_item.appendChild(delete_icon);
							item.appendChild(sub_item);
						}
						
						let add_sub_item_button = document.createElement("div");
						add_sub_item_button.classList.add("round_button");
						add_sub_item_button.classList.add("add_sub_done_item");
						add_sub_item_button.onclick = () => {addSubDoneItem(main_item.id)};
						item.appendChild(add_sub_item_button);
						items.appendChild(item);
					}
					
					//check all the checkbox of sub items
					let checkboxes = document.querySelectorAll("input[type=checkbox]")
					for (let i=0; i < checkboxes.length; i++)
					{
						checkCheckbox(checkboxes[i].parentNode.parentNode.id);
					}
					
					//enable drag and drop
					enableDragAndDrop();
				}
			}
		}
		
		//bind save button
		let save_file = document.getElementById("save_file");
		if (save_file)
			save_file.addEventListener("click", saveFile);
		
		//bind home button
		let home_button = document.getElementById("home_button");
		if (home_button)
			home_button.addEventListener("click", backToHome)
	}
}

//create new file
function newToDoList()
{
	gotoToDoHTML();
}

//upload file
async function uploadFile()
{
	try {
		[file_handle] = await window.showOpenFilePicker(fileOptions);
		let file = await file_handle.getFile();
		let filename = file.name;
		let contents = await file.text();
		
		//load the uploaded file data into text area
		gotoToDoHTML(filename, contents);
	} 
	catch (err) {}
}

//save file
async function saveFile()
{
	//save the data to previous uploaded file
	if (!file_handle)
	{
		const options = {
			suggestedName: "UNTITLED",
			types: [
			{
				description: "TODOLOH",
				accept: {
				  "text/markdown": [".tdl"],
				},
			  },
			],
		  };
		file_handle = await window.showSaveFilePicker(options);
		document.getElementById("todo_filename").innerHTML = file_handle.name.replace(".tdl","");
	}
	
	//write the content into file
	
	//get all the arrays and write it into file
	document.getElementById("todo_saving_process").style.backgroundImage = "url('saving.png')";
	
	//get all the new contents from the todo.html
	updateArrays();
	
	//save everything into the local file
	let content = "";
	content += "## TODO\r\n";
	for (let i = 0; i < todo_array.length; i++)
	{
		content += "- "  + todo_array[i].main + "\r\n";
		for (let j=0; j < todo_array[i].sub.length; j++)
		{
			content += "    - " + todo_array[i].sub[j] + "\r\n"
		}
	}
	
	content += "\r\n";
	content += "## WORKING\r\n";
	for (let i = 0; i < working_array.length; i++)
	{
		content += "- "  + working_array[i].main + "\r\n";
		for (let j=0; j < working_array[i].sub.length; j++)
		{
			content += "    - " + working_array[i].sub[j] + "\r\n";
		}
	}
	
	content += "\r\n";
	content += "## DONE\r\n";
	for (let i = 0; i < done_array.length; i++)
	{
		content += "- "  + done_array[i].main + "\r\n";
		for (let j=0; j < done_array[i].sub.length; j++)
		{
			content += "    - " + done_array[i].sub[j] + "\r\n";
		}
	}
	
	
	try {
		let writable = await file_handle.createWritable();
		await writable.write(content);
		await writable.close();
		document.getElementById("todo_saving_process").style.backgroundImage = "url('done_saved.png')";
	} catch(err) {
		document.getElementById("todo_saving_process").style.backgroundImage = "url('not_saved.png')";
	}
}

//back to home page
function backToHome()
{
	if (confirm("Do you want to save the changes made?"))
	{
		try {
			saveFile();
			setTimeout(() => {window.location.href = "index.html"},500);
		}
		
		catch (err)
		{
			setTimeout(() => {window.location.href = "index.html"},500);
		}
	}
	else
	{
			setTimeout(() => {window.location.href = "index.html"},500);
	}
}
class Item 
{
	constructor ()
	{
		this.id = ITEM_ID;
		this.main = "";
		this.sub = [];
		ITEM_ID += 1;
	}
	
	clear_all()
	{
		this.id = "";
		this.main = "";
		this.sub = [];
	}
	
	has_items()
	{
		if (this.main != "")
			return true;
		else
			return false;
	}
	
	add_sub(item)
	{
		this.sub.push(item);
	}
	
	set_main(item)
	{
		this.main = item;
	}
}

function setToDoArray(todo_content)
{
	if (todo_content.substring(0,9) == "## TODO\r\n")
	{
		todo_content = todo_content.replace("## TODO\r\n","");
		todo_content = todo_content.split("\r\n");
		let current_content = "";
		let got_main = false;
		let item = new Item();
		
		for (let i=0; i < todo_content.length; i++)
		{
			current_content = todo_content[i];
			if (current_content.substring(0,2) == "- ")
			{				
				got_main = true;
				if (item.has_items())
				{
					todo_array.push(item);
					
					item = new Item();
					current_content = current_content.replace("- ","");
					item.set_main(current_content);
				}
				
				else
				{
					current_content = current_content.replace("- ","");
					item.set_main(current_content);
				}
			}
			
			else if (got_main && current_content.substring(0,6) == "    - ")
			{
				current_content = current_content.replace("    - ","")
				item.add_sub(current_content);
			}
		}
		
		if (item.has_items())
		{
			todo_array.push(item);
		}		
	}
}

function setWorkingArray(working_content)
{
	if (working_content.substring(0,12) == "## WORKING\r\n")
	{
		working_content = working_content.replace("## WORKING\r\n","");
		working_content = working_content.split("\r\n");
		let current_content = "";
		let got_main = false;
		let item = new Item();
		
		for (let i=0; i < working_content.length; i++)
		{
			current_content = working_content[i];
			if (current_content.substring(0,2) == "- ")
			{				
				got_main = true;
				if (item.has_items())
				{
					working_array.push(item);
					
					item = new Item();
					current_content = current_content.replace("- ","");
					item.set_main(current_content);
				}
				
				else
				{
					current_content = current_content.replace("- ","");
					item.set_main(current_content);
				}
			}
			
			else if (got_main && current_content.substring(0,6) == "    - ")
			{
				current_content = current_content.replace("    - ","")
				item.add_sub(current_content);
			}
		}
		
		if (item.has_items())
		{
			working_array.push(item);
		}
	}
}

function setDoneArray(done_content)
{
	if (done_content.substring(0,9) == "## DONE\r\n")
	{
		done_content = done_content.replace("## DONE\r\n","");
		done_content = done_content.split("\r\n");
		let current_content = "";
		let got_main = false;
		let item = new Item();
		
		for (let i=0; i < done_content.length; i++)
		{
			current_content = done_content[i];
			if (current_content.substring(0,2) == "- ")
			{				
				got_main = true;
				if (item.has_items())
				{
					done_array.push(item);
					
					item = new Item();
					current_content = current_content.replace("- ","");
					item.set_main(current_content);
				}
				
				else
				{
					current_content = current_content.replace("- ","");
					item.set_main(current_content);
				}
			}
			
			else if (got_main && current_content.substring(0,6) == "    - ")
			{
				current_content = current_content.replace("    - ","")
				item.add_sub(current_content);
			}
		}
		
		if (item.has_items())
		{
			done_array.push(item);
		}
	}
}

function addMainToDoItem()
{
	let new_item = new Item();
	new_item.main = "New Todo";
	
	let items = document.getElementById("todo_items");
	let item = document.createElement("div");
	item.classList.add("item");
	//item.setAttribute("draggable",true);
						
	let main_item = document.createElement("div");
	main_item.classList.add("main_todo_item");
	main_item.id = "main_todo_item_" + new_item.id;	
	let move_icon = document.createElement("div");
	move_icon.onmousedown = () => {moveItem(item);};
	move_icon.classList.add("move_icon");
	let main_input = document.createElement("div");
	main_input.classList.add("textarea");
	main_input.contentEditable = true;
	main_input.spellcheck = false;
	main_input.innerHTML = new_item.main;
	main_input.addEventListener("DOMSubtreeModified", () => {contentChanged()}) //trigger content change for textarea
	let delete_icon = document.createElement("div");
	delete_icon.classList.add("delete_item");
	delete_icon.onclick = () => {deleteItem("main_todo_item_" + new_item.id)};
	let add_sub_item_button = document.createElement("div");
	add_sub_item_button.classList.add("round_button");
	add_sub_item_button.classList.add("add_sub_todo_item");
	add_sub_item_button.onclick = () => {addSubToDoItem("main_todo_item_" + new_item.id)};
	main_item.appendChild(move_icon);
	main_item.appendChild(main_input);
	main_item.appendChild(delete_icon);
	item.appendChild(main_item);
	item.appendChild(add_sub_item_button);
	items.appendChild(item);
	
	todo_array.push(new_item);
	
	contentChanged();
}

function addMainWorkingItem()
{
	let new_item = new Item();
	new_item.main = "New Working";
	
	let items = document.getElementById("working_items");
	let item = document.createElement("div");
	item.classList.add("item");
	//item.setAttribute("draggable",true);
						
	let main_item = document.createElement("div");
	main_item.classList.add("main_working_item");
	main_item.id = "main_working_item_" + new_item.id;
	let move_icon = document.createElement("div");
	move_icon.onmousedown = () => {moveItem(item);};
	move_icon.classList.add("move_icon");
	let main_input = document.createElement("div");
	main_input.classList.add("textarea");
	main_input.contentEditable = true;
	main_input.spellcheck = false;
	main_input.innerHTML = new_item.main;
	main_input.addEventListener("DOMSubtreeModified", () => {contentChanged()}) //trigger content change for textarea
	let delete_icon = document.createElement("div");
	delete_icon.classList.add("delete_item");
	delete_icon.onclick = () => {deleteItem("main_working_item_" + new_item.id)};
	let add_sub_item_button = document.createElement("div");
	add_sub_item_button.classList.add("round_button");
	add_sub_item_button.classList.add("add_sub_working_item");
	add_sub_item_button.onclick = () => {addSubWorkingItem("main_working_item_" + new_item.id)};
	main_item.appendChild(move_icon);
	main_item.appendChild(main_input);
	main_item.appendChild(delete_icon);
	item.appendChild(main_item);
	item.appendChild(add_sub_item_button);
	items.appendChild(item);
	
	working_array.push(new_item);
	
	contentChanged();
}

function addMainDoneItem()
{
	let new_item = new Item();
	new_item.main = "New Done";
	
	let items = document.getElementById("done_items");
	let item = document.createElement("div");
	item.classList.add("item");
	//item.setAttribute("draggable",true);
						
	let main_item = document.createElement("div");
	main_item.classList.add("main_done_item");
	main_item.id = "main_done_item_" + new_item.id;
	let move_icon = document.createElement("div");
	move_icon.onmousedown = () => {moveItem(item);};
	move_icon.classList.add("move_icon");
	let main_input = document.createElement("div");
	main_input.classList.add("textarea");
	main_input.contentEditable = true;
	main_input.spellcheck = false;
	main_input.innerHTML = new_item.main;
	main_input.addEventListener("DOMSubtreeModified", () => {contentChanged()}) //trigger content change for textarea
	let delete_icon = document.createElement("div");
	delete_icon.classList.add("delete_item");
	delete_icon.onclick = () => {deleteItem("main_done_item_" + new_item.id)};
	let add_sub_item_button = document.createElement("div");
	add_sub_item_button.classList.add("round_button");
	add_sub_item_button.classList.add("add_sub_done_item");
	add_sub_item_button.onclick = () => {addSubDoneItem("main_done_item_" + new_item.id)};
	main_item.appendChild(move_icon);
	main_item.appendChild(main_input);
	main_item.appendChild(delete_icon);
	item.appendChild(main_item);
	item.appendChild(add_sub_item_button);
	items.appendChild(item);
	
	done_array.push(new_item);
	
	contentChanged();
}

function addSubToDoItem(main_id)
{
	if (todo_array.length <= 0)
		return;
	
	//check the main id to see which one is the one, add add new item to sublist
	let main_item = document.getElementById(main_id);
	let array_id = main_id.replace("main_todo_item_","");
	for (let i=0; i < todo_array.length; i++)
	{
		if (todo_array[i].id == array_id)
		{
			let current_todo_item = todo_array[i];
			current_todo_item.sub.push("New Todo,N");
			
			let parent_item = main_item.parentNode;
			let add_sub_item_button = parent_item.getElementsByClassName("round_button add_sub_todo_item")[0];
			
			let sub_item = document.createElement("div");
			sub_item.classList.add("sub_todo_item");
			sub_item.id = "sub_todo_item_" + current_todo_item.id + "_" + (current_todo_item.sub.length - 1);
			sub_item.setAttribute("draggable", true);
			let checkbox_div = document.createElement("div");
			let checkbox_input = document.createElement("input");
			checkbox_input.onchange = () => {checkCheckbox(sub_item.id); contentChanged()}; //trigger content change for checkbox
			let checkbox_tick =  current_todo_item.sub[current_todo_item.sub.length -1].split(",")[1];
			checkbox_input.type = "checkbox";
			if (checkbox_tick == "Y")
				checkbox_input.checked = true;
			else if (checkbox_tick == "N")
				checkbox_input.checked = false;
			checkbox_div.appendChild(checkbox_input);
			let sub_input = document.createElement("div");
			sub_input.classList.add("textarea");
			sub_input.contentEditable = true;
			sub_input.spellcheck = false;
			sub_input.addEventListener("DOMSubtreeModified", () => {contentChanged()}) //trigger content change for textarea
			let sub_content = current_todo_item.sub[current_todo_item.sub.length - 1].split(",")[0];
			sub_input.innerHTML = sub_content;
			let delete_icon = document.createElement("div");
			delete_icon.classList.add("delete_item");
			delete_icon.onclick = () => {deleteItem(sub_item.id)};
			sub_item.appendChild(checkbox_div);	
			sub_item.appendChild(sub_input);
			sub_item.appendChild(delete_icon);
			parent_item.insertBefore(sub_item,add_sub_item_button);
		}
	}
	enableDragAndDrop();
	contentChanged();
}

function addSubWorkingItem(main_id)
{
	if (working_array.length <= 0)
		return;
	
	let main_item = document.getElementById(main_id);
	let array_id = main_id.replace("main_working_item_","");
	for (let i=0; i < working_array.length; i++)
	{
		if (working_array[i].id == array_id)
		{
			let current_working_item = working_array[i];
			current_working_item.sub.push("New Working,N");
			
			let parent_item = main_item.parentNode;
			let add_sub_item_button = parent_item.getElementsByClassName("round_button add_sub_working_item")[0];
			
			let sub_item = document.createElement("div");
			sub_item.classList.add("sub_working_item");
			sub_item.id = "sub_working_item_" + current_working_item.id + "_" + (current_working_item.sub.length - 1);
			sub_item.setAttribute("draggable", true);
			let checkbox_div = document.createElement("div");
			let checkbox_input = document.createElement("input");
			checkbox_input.onchange = () => {checkCheckbox(sub_item.id); contentChanged()}; //trigger content change for checkbox
			let checkbox_tick =  current_working_item.sub[current_working_item.sub.length -1].split(",")[1];
			checkbox_input.type = "checkbox";
			if (checkbox_tick == "Y")
				checkbox_input.checked = true;
			else if (checkbox_tick == "N")
				checkbox_input.checked = false;
			checkbox_div.appendChild(checkbox_input);
			let sub_input = document.createElement("div");
			sub_input.classList.add("textarea");
			sub_input.contentEditable = true;
			sub_input.spellcheck = false;
			sub_input.addEventListener("DOMSubtreeModified", () => {contentChanged()}) //trigger content change for textarea
			let sub_content = current_working_item.sub[current_working_item.sub.length - 1].split(",")[0];
			sub_input.innerHTML = sub_content;
			let delete_icon = document.createElement("div");
			delete_icon.classList.add("delete_item");
			delete_icon.onclick = () => {deleteItem(sub_item.id)};
			sub_item.appendChild(checkbox_div);	
			sub_item.appendChild(sub_input);
			sub_item.appendChild(delete_icon);
			parent_item.insertBefore(sub_item,add_sub_item_button);
		}
	}
	enableDragAndDrop();
	contentChanged();
}

function addSubDoneItem(main_id)
{
	if (done_array.length <= 0)
		return;
	
	let main_item = document.getElementById(main_id);
	let array_id = main_id.replace("main_done_item_","");
	for (let i=0; i < done_array.length; i++)
	{
		if (done_array[i].id == array_id)
		{
			let current_done_item = done_array[i];
			current_done_item.sub.push("New Done,Y");
			
			let parent_item = main_item.parentNode;
			let add_sub_item_button = parent_item.getElementsByClassName("round_button add_sub_done_item")[0];
			
			let sub_item = document.createElement("div");
			sub_item.classList.add("sub_done_item");
			sub_item.id = "sub_done_item_" + current_done_item.id + "_" + (current_done_item.sub.length - 1);
			sub_item.setAttribute("draggable", true);
			let checkbox_div = document.createElement("div");
			let checkbox_input = document.createElement("input");
			checkbox_input.onchange = () => {checkCheckbox(sub_item.id); contentChanged()}; //trigger content change for checkbox
			let checkbox_tick =  current_done_item.sub[current_done_item.sub.length -1].split(",")[1];
			checkbox_input.type = "checkbox";
			if (checkbox_tick == "Y")
				checkbox_input.checked = true;
			else if (checkbox_tick == "N")
				checkbox_input.checked = false;
			checkbox_div.appendChild(checkbox_input);
			let sub_input = document.createElement("div");
			sub_input.classList.add("textarea");
			sub_input.contentEditable = true;
			sub_input.spellcheck = false;
			sub_input.addEventListener("DOMSubtreeModified", () => {contentChanged()}) //trigger content change for textarea
			let sub_content = current_done_item.sub[current_done_item.sub.length - 1].split(",")[0];
			sub_input.innerHTML = sub_content;
			let delete_icon = document.createElement("div");
			delete_icon.classList.add("delete_item");
			delete_icon.onclick = () => {deleteItem(sub_item.id)};
			sub_item.appendChild(checkbox_div);	
			sub_item.appendChild(sub_input);
			sub_item.appendChild(delete_icon);
			parent_item.insertBefore(sub_item,add_sub_item_button);
			checkCheckbox(sub_item.id);
		}
	}
	enableDragAndDrop();
	contentChanged();
}

// main delete will delete the class="item"
// sub delete will delete the class="sub_XX_item"
function deleteItem(id)
{
	if (id.substring(0,14) == "main_todo_item")
	{
		let array_id = id.replace("main_todo_item_","");
		for (let i=0; i < todo_array.length; i++)
		{
			if (todo_array[i].id == array_id)
			{
				//destroy the whole item
				delete todo_array[i];
				
				let item_div = document.getElementById(id);
				item_div.innerHTML = "";
				item_div.parentNode.remove();
				
				todo_array.splice(i,1);
				
			}
		}
	}
	
	else if (id.substring(0,13) == "sub_todo_item")
	{
		for (let i=0; i < todo_array.length; i++)
		{
			let all_id = id.replace("sub_todo_item_","")
			let array_id = all_id.substring(0,all_id.indexOf("_"));
			let sub_list_id = all_id.substring(all_id.indexOf("_")+1, all_id.length);
			
			if (todo_array[i].id == array_id)
			{
				//remove the sub item from sub list				
				let item_div = document.getElementById(id);
				let parent_div =  item_div.parentNode
				item_div.innerHTML = "";
				parent_div.removeChild(item_div);
				
				let sub_list = todo_array[i].sub;
				sub_list.splice(sub_list_id,1);
				
				//rename all the id for the sub list
				let sub_list_divs = parent_div.getElementsByClassName("sub_todo_item");
				for (let k=0; k < sub_list_divs.length; k++)
				{
					sub_list_divs[k].id = "sub_todo_item_" + array_id + "_" + k;
				}
			}
		}
	}
	
	else if (id.substring(0,17) == "main_working_item") 
	{
		let array_id = id.replace("main_working_item_","");
		for (let i=0; i < working_array.length; i++)
		{
			if (working_array[i].id == array_id)
			{
				//destroy the whole item
				delete working_array[i];
				
				let item_div = document.getElementById(id);
				item_div.innerHTML = "";
				item_div.parentNode.remove();
				
				working_array.splice(i,1);
				
			}
		}
	}
	
	else if (id.substring(0,16) == "sub_working_item") 
	{
		for (let i=0; i < working_array.length; i++)
		{
			let all_id = id.replace("sub_working_item_","")
			let array_id = all_id.substring(0,all_id.indexOf("_"));
			let sub_list_id = all_id.substring(all_id.indexOf("_")+1, all_id.length);
			
			if (working_array[i].id == array_id)
			{
				//remove the sub item from sub list				
				let item_div = document.getElementById(id);
				let parent_div =  item_div.parentNode
				item_div.innerHTML = "";
				parent_div.removeChild(item_div);
				
				let sub_list = working_array[i].sub;
				sub_list.splice(sub_list_id,1);
				
				//rename all the id for the sub list
				let sub_list_divs = parent_div.getElementsByClassName("sub_working_item");
				for (let k=0; k < sub_list_divs.length; k++)
				{
					sub_list_divs[k].id = "sub_working_item_" + array_id + "_" + k;
				}
			}
		}
	}

	else if (id.substring(0,14) == "main_done_item") 
	{
		
		let array_id = id.replace("main_done_item_","");
		for (let i=0; i < done_array.length; i++)
		{
			if (done_array[i].id == array_id)
			{
				//destroy the whole item
				delete done_array[i];
				
				let item_div = document.getElementById(id);
				item_div.innerHTML = "";
				item_div.parentNode.remove();
				
				done_array.splice(i,1);
				
			}
		}
	}
	
	else if (id.substring(0,13) == "sub_done_item") 
	{
		for (let i=0; i < done_array.length; i++)
		{
			let all_id = id.replace("sub_done_item_","")
			let array_id = all_id.substring(0,all_id.indexOf("_"));
			let sub_list_id = all_id.substring(all_id.indexOf("_")+1, all_id.length);
			
			if (done_array[i].id == array_id)
			{
				//remove the sub item from sub list				
				let item_div = document.getElementById(id);
				let parent_div =  item_div.parentNode
				item_div.innerHTML = "";
				parent_div.removeChild(item_div);
				
				let sub_list = done_array[i].sub;
				sub_list.splice(sub_list_id,1);
				
				//rename all the id for the sub list
				let sub_list_divs = parent_div.getElementsByClassName("sub_done_item");
				for (let k=0; k < sub_list_divs.length; k++)
				{
					sub_list_divs[k].id = "sub_done_item_" + array_id + "_" + k;
				}
			}
		}
	}
	
	contentChanged();
}

// TODO: move main item
function moveItem(item)
{
	item_dragged = item;
	item.setAttribute("draggable", true)
}

//add reaction to checkbox and also to contenteditable, so data in item is updated
//shows the content has been changed by changing the saving icon
//will be triggered by add, delete, content modified (checkbox and textarea)
//update the contents before save file

//update arrays
function updateArrays()
{
	//todo
	let todo_items = document.getElementById("todo_items").getElementsByClassName("item");
	for (let i=0; i < todo_items.length; i++)
	{
		//main
		let main_item = document.getElementsByClassName("main_todo_item")[i];
		let main_id = main_item.id.replace("main_todo_item_","");
		
		for (let temp=0; temp < todo_array.length; temp++)
		{
			if (todo_array[temp].id == main_id)
			{
				todo_array[temp].main = main_item.getElementsByClassName("textarea")[0].innerHTML;
				break;
			}
		}
		
		//subs
		let sub_items = todo_items[i].getElementsByClassName("sub_todo_item");
		for (let j=0; j < sub_items.length; j++)
		{
			let all_id = sub_items[j].id.replace("sub_todo_item_","")
			let main_id = all_id.substring(0,all_id.indexOf("_"));
			let sub_id = all_id.substring(all_id.indexOf("_")+1, all_id.length);
			
			for (let temp=0; temp < todo_array.length; temp++)
			{
				if (todo_array[temp].id == main_id)
				{
					if (todo_array[temp].sub.length > sub_id)
					{
						let checked = sub_items[j].getElementsByTagName("input")[0].checked;
						let final_checked = "";
						if (checked)
							final_checked = "Y";
						else
							final_checked = "N";
						todo_array[temp].sub[sub_id] = sub_items[j].getElementsByClassName("textarea")[0].innerHTML + "," + final_checked;
						break;
					}
				}
			}
		}
	}
	
	//working
	let working_items = document.getElementById("working_items").getElementsByClassName("item");
	for (let i=0; i < working_items.length; i++)
	{
		//main
		let main_item = document.getElementsByClassName("main_working_item")[i];
		let main_id = main_item.id.replace("main_working_item_","");
		
		for (let temp=0; temp < working_array.length; temp++)
		{
			if (working_array[temp].id == main_id)
			{
				working_array[temp].main = main_item.getElementsByClassName("textarea")[0].innerHTML;
				break;
			}
		}
		
		//subs
		let sub_items = working_items[i].getElementsByClassName("sub_working_item");
		for (let j=0; j < sub_items.length; j++)
		{
			let all_id = sub_items[j].id.replace("sub_working_item_","")
			let main_id = all_id.substring(0,all_id.indexOf("_"));
			let sub_id = all_id.substring(all_id.indexOf("_")+1, all_id.length);
			
			for (let temp=0; temp < working_array.length; temp++)
			{
				if (working_array[temp].id == main_id)
				{
					if (working_array[temp].sub.length > sub_id)
					{
						let checked = sub_items[j].getElementsByTagName("input")[0].checked;
						let final_checked = "";
						if (checked)
							final_checked = "Y";
						else
							final_checked = "N";
						working_array[temp].sub[sub_id] = sub_items[j].getElementsByClassName("textarea")[0].innerHTML + "," + final_checked;
						break;
					}
				}
			}
		}
	}
	
	//done
	let done_items = document.getElementById("done_items").getElementsByClassName("item");
	for (let i=0; i < done_items.length; i++)
	{
		//main
		let main_item = document.getElementsByClassName("main_done_item")[i];
		let main_id = main_item.id.replace("main_done_item_","");
		
		for (let temp=0; temp < done_array.length; temp++)
		{
			if (done_array[temp].id == main_id)
			{
				done_array[temp].main = main_item.getElementsByClassName("textarea")[0].innerHTML;
				break;
			}
		}
		
		//subs
		let sub_items = done_items[i].getElementsByClassName("sub_done_item");
		for (let j=0; j < sub_items.length; j++)
		{
			let all_id = sub_items[j].id.replace("sub_done_item_","")
			let main_id = all_id.substring(0,all_id.indexOf("_"));
			let sub_id = all_id.substring(all_id.indexOf("_")+1, all_id.length);
			
			for (let temp=0; temp < done_array.length; temp++)
			{
				if (done_array[temp].id == main_id)
				{
					if (done_array[temp].sub.length > sub_id)
					{
						let checked = sub_items[j].getElementsByTagName("input")[0].checked;
						let final_checked = "";
						if (checked)
							final_checked = "Y";
						else
							final_checked = "N";
						done_array[temp].sub[sub_id] = sub_items[j].getElementsByClassName("textarea")[0].innerHTML + "," + final_checked;
						break;
					}
				}
			}
		}
	}
}

function contentChanged()
{
	//change the saving process icon to not saved
	document.getElementById("todo_saving_process").style.backgroundImage = "url('not_saved.png')";
}

function checkCheckbox(sub_item_id)
{
	let sub_item = document.getElementById(sub_item_id);
	let check_box = sub_item.getElementsByTagName("input")[0];
	if (check_box.checked)
		sub_item.getElementsByClassName("textarea")[0].style.textDecoration =  "line-through";
	else
		sub_item.getElementsByClassName("textarea")[0].style.textDecoration =  "none";
}

//sub item drag and drop
//https://developer.mozilla.org/en-US/docs/Web/API/Document/drag_event
function drag_start(e)
{
	item_dragged = this;
	this.style.opacity = 0.3;
}

function drag(e)
{
	item_dragged.style.opacity = 0; //need to specify item_dragged instead of this as item and sub item using this
}

function drag_over(e)
{
	e.preventDefault();
	if (item_dragged.className.includes("sub"))
		this.style.opacity = 0.5;
}


function item_drag_over(e)
{
	e.preventDefault();
	if (this.parentNode == item_dragged.parentNode && !item_dragged.className.includes("sub"))
	{
		this.style.opacity = 0.5;
		this.style.backgroundColor = "white";
	}
}

function drag_leave(e)
{
	if (item_dragged.className.includes("sub"))
		this.style.opacity = 1;
}

function item_drag_leave(e)
{
	if (!item_dragged.className.includes("sub"))
	{
		this.style.opacity = 1;
		this.style.backgroundColor = "transparent";	
	}
}


function drag_end(e)
{
	this.style.opacity = 1;
	saveFile();
}

//TODO: make sure it rearrange the item
function item_drag_end(e)
{
	if (this.parentNode == item_dragged.parentNode && !item_dragged.className.includes("sub"))
	{
		this.style.opacity = 1;
		this.style.backgroundColor = "transparent";
		saveFile();
	}
}

function sub_todo_drop(e)
{
	this.style.opacity = 1;
	
	//need to make sure both have same parent
	if (this.parentNode == item_dragged.parentNode)
	{
		let parent_item = this.parentNode;
		let parent_id = parent_item.id;
		
		//just change both places and id and position in Array
		let drag_id = item_dragged.id;
		let drop_id = this.id;
		
		let drag_main_id = drag_id.replace("sub_todo_item_","").substring(0, drag_id.replace("sub_todo_item_","").indexOf("_"));
		let drop_main_id = drop_id.replace("sub_todo_item_","").substring(0, drop_id.replace("sub_todo_item_","").indexOf("_"));
		
		if (drag_main_id == drop_main_id)
		{
			for (let i=0; i < todo_array.length; i++)
			{
				if (todo_array[i].id == drag_main_id)
				{
					let drag_idx = drag_id.replace("sub_todo_item_","").substring(drag_id.replace("sub_todo_item_","").indexOf("_")+1, drag_id.length);
					let drop_idx = drop_id.replace("sub_todo_item_","").substring(drop_id.replace("sub_todo_item_","").indexOf("_")+1, drop_id.length);
					
					//exchange list item
					let temp = todo_array[i].sub[drag_idx];
					todo_array[i].sub[drag_idx] = todo_array[i].sub[drop_idx];
					todo_array[i].sub[drop_idx] = temp;
					
					//update sub item div
					let drag_item = document.getElementById(drag_id);
					let drop_item = document.getElementById(drop_id);
					
					let drag_checkbox = drag_item.getElementsByTagName("input")[0];
					if (todo_array[i].sub[drag_idx].split(",")[1] == "Y")
						drag_checkbox.checked = true;
					else
						drag_checkbox.checked = false;
					checkCheckbox(drag_id);
					drag_item.getElementsByClassName("textarea")[0].innerHTML = todo_array[i].sub[drag_idx].split(",")[0];
					
					let drop_checkbox = drop_item.getElementsByTagName("input")[0];
					if (todo_array[i].sub[drop_idx].split(",")[1] == "Y")
						drop_checkbox.checked = true;
					else
						drop_checkbox.checked = false;
					checkCheckbox(drop_id);
					drop_item.getElementsByClassName("textarea")[0].innerHTML = todo_array[i].sub[drop_idx].split(",")[0];
					
					break;
				}
			}
		}
	}
}

function sub_working_drop(e)
{
	this.style.opacity = 1;
	
	//need to make sure both have same parent
	if (this.parentNode == item_dragged.parentNode)
	{
		let parent_item = this.parentNode;
		let parent_id = parent_item.id;
		
		//just change both places and id and position in Array
		let drag_id = item_dragged.id;
		let drop_id = this.id;
		
		let drag_main_id = drag_id.replace("sub_working_item_","").substring(0, drag_id.replace("sub_working_item_","").indexOf("_"));
		let drop_main_id = drop_id.replace("sub_working_item_","").substring(0, drop_id.replace("sub_working_item_","").indexOf("_"));
		
		if (drag_main_id == drop_main_id)
		{
			for (let i=0; i < working_array.length; i++)
			{
				if (working_array[i].id == drag_main_id)
				{
					let drag_idx = drag_id.replace("sub_working_item_","").substring(drag_id.replace("sub_working_item_","").indexOf("_")+1, drag_id.length);
					let drop_idx = drop_id.replace("sub_working_item_","").substring(drop_id.replace("sub_working_item_","").indexOf("_")+1, drop_id.length);
					
					//exchange list item
					let temp = working_array[i].sub[drag_idx];
					working_array[i].sub[drag_idx] = working_array[i].sub[drop_idx];
					working_array[i].sub[drop_idx] = temp;
					
					//update sub item div
					let drag_item = document.getElementById(drag_id);
					let drop_item = document.getElementById(drop_id);
					
					let drag_checkbox = drag_item.getElementsByTagName("input")[0];
					if (working_array[i].sub[drag_idx].split(",")[1] == "Y")
						drag_checkbox.checked = true;
					else
						drag_checkbox.checked = false;
					checkCheckbox(drag_id);
					drag_item.getElementsByClassName("textarea")[0].innerHTML = working_array[i].sub[drag_idx].split(",")[0];
					
					let drop_checkbox = drop_item.getElementsByTagName("input")[0];
					if (working_array[i].sub[drop_idx].split(",")[1] == "Y")
						drop_checkbox.checked = true;
					else
						drop_checkbox.checked = false;
					checkCheckbox(drop_id);
					drop_item.getElementsByClassName("textarea")[0].innerHTML = working_array[i].sub[drop_idx].split(",")[0];
					
					break;
				}
			}
		}
	}
}

function sub_done_drop(e)
{
	this.style.opacity = 1;
	
	//need to make sure both have same parent
	if (this.parentNode == item_dragged.parentNode)
	{
		let parent_item = this.parentNode;
		let parent_id = parent_item.id;
		
		//just change both places and id and position in Array
		let drag_id = item_dragged.id;
		let drop_id = this.id;
		
		let drag_main_id = drag_id.replace("sub_done_item_","").substring(0, drag_id.replace("sub_done_item_","").indexOf("_"));
		let drop_main_id = drop_id.replace("sub_done_item_","").substring(0, drop_id.replace("sub_done_item_","").indexOf("_"));
		
		if (drag_main_id == drop_main_id)
		{
			for (let i=0; i < done_array.length; i++)
			{
				if (done_array[i].id == drag_main_id)
				{
					let drag_idx = drag_id.replace("sub_done_item_","").substring(drag_id.replace("sub_done_item_","").indexOf("_")+1, drag_id.length);
					let drop_idx = drop_id.replace("sub_done_item_","").substring(drop_id.replace("sub_done_item_","").indexOf("_")+1, drop_id.length);
					
					//exchange list item
					let temp = done_array[i].sub[drag_idx];
					done_array[i].sub[drag_idx] = done_array[i].sub[drop_idx];
					done_array[i].sub[drop_idx] = temp;
					
					//update sub item div
					let drag_item = document.getElementById(drag_id);
					let drop_item = document.getElementById(drop_id);
					
					let drag_checkbox = drag_item.getElementsByTagName("input")[0];
					if (done_array[i].sub[drag_idx].split(",")[1] == "Y")
						drag_checkbox.checked = true;
					else
						drag_checkbox.checked = false;
					checkCheckbox(drag_id);
					drag_item.getElementsByClassName("textarea")[0].innerHTML = done_array[i].sub[drag_idx].split(",")[0];
					
					let drop_checkbox = drop_item.getElementsByTagName("input")[0];
					if (done_array[i].sub[drop_idx].split(",")[1] == "Y")
						drop_checkbox.checked = true;
					else
						drop_checkbox.checked = false;
					checkCheckbox(drop_id);
					drop_item.getElementsByClassName("textarea")[0].innerHTML = done_array[i].sub[drop_idx].split(",")[0];
					
					break;
				}
			}
		}
	}
}

function item_drop(e)
{	

	this.style.opacity = 1;
	this.style.backgroundColor = "transparent";
	
	//check if it is same parent
	if (this.parentNode == item_dragged.parentNode && !item_dragged.className.includes("sub")) //same parent, change position
	{
		//just change both places and position in Array
		//use the main_item in item to check the position
		let item_type = "";
		if(item_dragged.parentNode.id == "todo_items")
			item_type = "todo";
		else if (item_dragged.parentNode.id == "working_items")
			item_type = "working";
		else if (item_dragged.parentNode.id == "done_items")
			item_type = "done";
		
		let drag_main = item_dragged.getElementsByClassName("main_"+item_type+"_item")[0]
		let drop_main = this.getElementsByClassName("main_"+item_type+"_item")[0];
		
		let drag_id = drag_main.id.replace("main_"+item_type+"_item_","");
		let drop_id = drop_main.id.replace("main_"+item_type+"_item_","");
		
		
		//remove the previous one and drop a new one in front of the drop
		let drag_y = item_dragged.getBoundingClientRect().top;
		let drop_y = this.getBoundingClientRect().top;
		if (drag_y > drop_y)
			this.parentNode.insertBefore(item_dragged,this);
		else
			this.parentNode.insertBefore(this,item_dragged);
		
		let array = []
		if (item_type == "todo")
			array = todo_array;
		else if (item_type == "working")
			array = working_array;
		else if (item_type == "done")
			array = done_array;
		
		
		let drag_item = "";
		let drag_index = "";
		let drop_item = "";
		let drop_index = "";
		for (let i=0; i<array.length; i++)
		{
			if (array[i].id == drag_id)
			{
				drag_index = i;
				drag_item = array[i];
			}
			
			if (array[i].id == drop_id)
			{
				drop_index = i;
				drop_item = array[i];
			}
			
			if (drag_item != "" && drop_item != "")
			{
				let temp = array[drop_index];
				
				array[drop_index] = array[drag_index];
				array[drag_index] = temp;
				break;
			}
		}
	}
	
	item_dragged.setAttribute("draggable",false); //need to set it back to undraggable once done drop
}


//TODO: item drop in div, need to append the item
function div_drop(e)
{	
	//make sure not same div
	if (this.parentNode != item_dragged.parentNode.parentNode)
	{
		this.style.opacity = 1;
		this.style.backgroundColor = "transparent";
		
		//get the dragged item type
		let drag_item_type = item_dragged.parentNode.parentNode.id.replace("_div","");
		
		//get the drop div type 
		let drop_item_type = this.parentNode.id.replace("_div","");
		
		//change the dragged item type to drop div type
		let drag_main_item = item_dragged.getElementsByClassName("main_"+drag_item_type+"_item")[0];
		drag_main_item.className = "main_"+drop_item_type+"_item";
		let ori_main_id = drag_main_item.id.replace("main_"+drag_item_type+"_item","");
		drag_main_item.id = "main_"+drop_item_type+"_item"+ori_main_id.substring(ori_main_id.indexOf("_"),drag_main_item.length);
		
		let drag_sub_items = item_dragged.getElementsByClassName("sub_"+drag_item_type+"_item");
		while(drag_sub_items.length != 0)
		{
			let sub_item = drag_sub_items[0];
			sub_item.className = "sub_"+drop_item_type+"_item";
			let ori_sub_id = sub_item.id.replace("sub_"+drag_item_type+"_item","");
			sub_item.id = "sub_"+drop_item_type+"_item"+ori_sub_id.substring(ori_sub_id.indexOf("_"),sub_item.length);
		}
		
		let drag_add_button = item_dragged.getElementsByClassName("round_button")[0];
		drag_add_button.classList.remove("add_sub_"+drag_item_type+"_item");
		drag_add_button.classList.add("add_sub_"+drop_item_type+"_item");
		
		//remove the item from its ori div and move to drop div
		item_dragged.parentNode.removeChild(item_dragged)
		document.getElementById(drop_item_type+"_items").appendChild(item_dragged);
		
		//remove item from ori array and add into new array
		let ori_array = []
		let dest_array = []
		if (drag_item_type == "todo")
			ori_array = todo_array;
		else if (drag_item_type == "working")
			ori_array = working_array;
		else if (drag_item_type == "done")
			ori_array = done_array;
		
		if (drop_item_type == "todo")
			dest_array = todo_array;
		else if (drop_item_type == "working")
			dest_array = working_array;
		else if (drop_item_type == "done")
			dest_array = done_array;
		
		let drag_main = item_dragged.getElementsByClassName("main_"+drop_item_type+"_item")[0]
		
		let drag_id = drag_main.id.replace("main_"+drop_item_type+"_item_","");
		
		for (let i=0; i < ori_array.length; i++)
		{
			let ori_item = ori_array[i];
			if (ori_item.id == drag_id)
			{
				dest_array.push(ori_item);
				ori_array.splice(i,1);
				break;
			}
		}
		
		
	}
}


//TODO: add event listener for drag item
let item_dragged;
function enableDragAndDrop()
{
	//todo subitems
	let sub_items = document.getElementsByClassName("sub_todo_item");
	for (let i=0; i < sub_items.length; i++)
	{
		let item = sub_items[i];
		item.addEventListener("dragstart", drag_start);
		item.addEventListener("drag", drag);
		item.addEventListener("dragend", drag_end);
		item.addEventListener("dragover", drag_over);
		item.addEventListener("dragenter", drag_over);
		item.addEventListener("dragleave", drag_leave);
		item.addEventListener("drop", sub_todo_drop);
	}

	//working subitems
	sub_items = document.getElementsByClassName("sub_working_item");
	for (let i=0; i < sub_items.length; i++)
	{
		let item = sub_items[i];
		item.addEventListener("dragstart", drag_start);
		item.addEventListener("drag", drag);
		item.addEventListener("dragend", drag_end);
		item.addEventListener("dragover", drag_over);
		item.addEventListener("dragenter", drag_over);
		item.addEventListener("dragleave", drag_leave);
		item.addEventListener("drop", sub_working_drop);
	}
	
	//done subitems
	sub_items = document.getElementsByClassName("sub_done_item");
	for (let i=0; i < sub_items.length; i++)
	{
		let item = sub_items[i];
		item.addEventListener("dragstart", drag_start);
		item.addEventListener("drag", drag);
		item.addEventListener("dragend", drag_end);
		item.addEventListener("dragover", drag_over);
		item.addEventListener("dragenter", drag_over);
		item.addEventListener("dragleave", drag_leave);
		item.addEventListener("drop", sub_done_drop);
	}
	
	//TODO: all the main items (fix this, might need to add 1 more icon on the main)
	
	let items = document.getElementsByClassName("item");
	for (let i=0; i < items.length; i++)
	{
		let item = items[i];
		item.addEventListener("drag", drag);
		item.addEventListener("dragend", item_drag_end);
		item.addEventListener("dragover", item_drag_over);
		item.addEventListener("dragenter", item_drag_over);
		item.addEventListener("dragleave", item_drag_leave);
		item.addEventListener("drop", item_drop);
	}
	
	//items divs
	let add_todo_button = document.getElementById("add_main_todo_item");
	let add_working_button = document.getElementById("add_main_working_item");
	let add_done_button = document.getElementById("add_main_done_item");
	
	let temp_items = [];
	temp_items.push(add_todo_button);
	temp_items.push(add_working_button);
	temp_items.push(add_done_button);
	for (let i=0; i < temp_items.length; i++)
	{
		let item = temp_items[i];
		item.addEventListener("dragend", item_drag_end);
		item.parentNode.addEventListener("dragover", item_drag_over);
		item.parentNode.addEventListener("dragenter", item_drag_over);
		item.parentNode.addEventListener("dragleave", item_drag_leave);
		item.parentNode.addEventListener("drop", div_drop);
	}
}




//bind Ctrl+S to save file
document.addEventListener("keydown", e => {
  if (e.ctrlKey && e.key === "s") {
    e.preventDefault(); // Prevent the Save dialog to open
    
	try {
		saveFile();
	}
	catch (err) {}
  }
});


