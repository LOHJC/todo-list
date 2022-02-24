"use strict"

//file variable to create and save file
let file_handle;
let fileOptions = {
	types: [
		{
			description: "TODOLOH",
			accept: {
				"text/markdown": [".todoloh", ".md"]
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
function gotoToDoHTML(content)
{
	if (todo_web_content)
	{
		let index_header = document.getElementsByTagName("header")[0];
		let index_footer = document.getElementsByTagName("footer")[0];
		let index_section = document.getElementsByTagName("section")[0];
		
		if (content)
		{
			//TODO: need to check if the uploaded file is normal todo list
			let item = new Item();
			let parts = content.split("\r\n\r\n")
			if (parts.length == 3)
			{
				//get the todo array
				setToDoArray(parts[0]);
				console.log(todo_array);
				
				//get the working array
				setWorkingArray(parts[1]);
				console.log(working_array);
				
				//get the done array
				setDoneArray(parts[2]);
				console.log(done_array);
			}
		}
		
		index_header.innerHTML = todo_web_content.getElementsByTagName("header")[0].innerHTML;
		index_footer.innerHTML = todo_web_content.getElementsByTagName("footer")[0].innerHTML;
		index_section.innerHTML = todo_web_content.getElementsByTagName("section")[0].innerHTML;
		
		//bind save button
		let save_file = document.getElementById("save_file");
		if (save_file)
			save_file.addEventListener("click", saveFile);
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
	[file_handle] = await window.showOpenFilePicker(fileOptions);
	
	if (!file_handle)
		return;
	
	let file = await file_handle.getFile();
	let contents = await file.text();
	
	//load the uploaded file data into text area
	gotoToDoHTML(contents);
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
				  "text/markdown": [".todoloh", ".md"],
				},
			  },
			],
		  };
		file_handle = await window.showSaveFilePicker(options);
	}
	
	
	//TODO: write the content into file
	//let content = document.getElementById("text_area").value;
	
	let writable = await file_handle.createWritable();
	await writable.write(content);
	await writable.close();
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
