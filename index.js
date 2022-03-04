"use strict"

//load all images 
let img_idx = 0;
let img_list = ["home.png","save.png", "delete.png", "dropdown.png", "pullup.png", "add.png", "not_saved.png", "saving.png", "done_saved.png"]
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
				"text/markdown": [".tdl", ".md"]
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
					todo_filename.innerHTML = filename.replace(".tdl","").replace(".md","");
					todo_filename.contentEditable = false;
					
					//todo
					let items = document.getElementById("todo_items");
					items.innerHTML = "";
					
					for (let i=0; i < todo_array.length; i++)
					{
						let item = document.createElement("div");
						item.classList.add("item");
						item.setAttribute("draggable",true);
						
						let main_item = document.createElement("div");
						main_item.classList.add("main_todo_item");
						main_item.id = "main_todo_item_" + todo_array[i].id;
						let main_input = document.createElement("div");
						main_input.classList.add("textarea");
						main_input.contentEditable = true;
						main_input.spellcheck = false;
						main_input.innerHTML = todo_array[i].main;
						main_input.addEventListener("DOMSubtreeModified", () => {contentChanged()}) //trigger content change for textarea
						let delete_icon = document.createElement("div");
						delete_icon.classList.add("delete_item");
						delete_icon.onclick = () => {deleteItem(main_item.id);}
						main_item.appendChild(main_input);
						main_item.appendChild(delete_icon);
						item.appendChild(main_item);
						
						for (let j=0; j < todo_array[i].sub.length; j++)
						{
							let sub_item = document.createElement("div");
							sub_item.classList.add("sub_todo_item");
							sub_item.id = "sub_todo_item_"+todo_array[i].id+"_"+j;
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
						item.setAttribute("draggable",true);
						
						let main_item = document.createElement("div");
						main_item.classList.add("main_working_item");
						main_item.id = "main_working_item_" + working_array[i].id;
						let main_input = document.createElement("div");
						main_input.classList.add("textarea");
						main_input.contentEditable = true;
						main_input.spellcheck = false;
						main_input.innerHTML = working_array[i].main;
						main_input.addEventListener("DOMSubtreeModified", () => {contentChanged()}) //trigger content change for textarea
						let delete_icon = document.createElement("div");
						delete_icon.classList.add("delete_item");
						delete_icon.onclick = () => {deleteItem(main_item.id);}
						main_item.appendChild(main_input);
						main_item.appendChild(delete_icon);
						item.appendChild(main_item);
						
						for (let j=0; j < working_array[i].sub.length; j++)
						{
							let sub_item = document.createElement("div");
							sub_item.classList.add("sub_working_item");
							sub_item.id = "sub_working_item_"+working_array[i].id+"_"+j;
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
						item.setAttribute("draggable",true);
						
						let main_item = document.createElement("div");
						main_item.classList.add("main_done_item");
						main_item.id = "main_done_item_" + done_array[i].id;
						let main_input = document.createElement("div");
						main_input.classList.add("textarea");
						main_input.contentEditable = true;
						main_input.spellcheck = false;
						main_input.innerHTML = done_array[i].main;
						main_input.addEventListener("DOMSubtreeModified", () => {contentChanged()}) //trigger content change for textarea
						let delete_icon = document.createElement("div");
						delete_icon.classList.add("delete_item");
						main_item.appendChild(main_input);
						main_item.appendChild(delete_icon);
						delete_icon.onclick = () => {deleteItem(main_item.id);}
						item.appendChild(main_item);
						
						for (let j=0; j < done_array[i].sub.length; j++)
						{
							let sub_item = document.createElement("div");
							sub_item.classList.add("sub_done_item");
							sub_item.id = "sub_done_item_" + done_array[i].id + "_" + j;
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
	catch (err) {
		alert("You did not upload any file");
	}
}

//save file
async function saveFile()
{
	//save the data to previous uploaded file
	if (!file_handle)
	{
		const options = {
			types: [
			{
				description: "TODOLOH",
				accept: {
				  "text/markdown": [".tdl", ".md"],
				},
			  },
			],
		  };
		file_handle = await window.showSaveFilePicker(options);
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
	item.setAttribute("draggable",true);
						
	let main_item = document.createElement("div");
	main_item.classList.add("main_todo_item");
	main_item.id = "main_todo_item_" + new_item.id;
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
	item.setAttribute("draggable",true);
						
	let main_item = document.createElement("div");
	main_item.classList.add("main_working_item");
	main_item.id = "main_working_item_" + new_item.id;
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
	item.setAttribute("draggable",true);
						
	let main_item = document.createElement("div");
	main_item.classList.add("main_done_item");
	main_item.id = "main_done_item_" + new_item.id;
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

//TODO: add reaction to checkbox and also to contenteditable, so data in item is updated
//shows the content has been changed by changing the saving icon
//will be triggered by add, delete, content modified (checkbox and textarea)
//update the contents before save file

//TODO: update arrays
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
