"use strict"

//todo uploaded
//Upload file - https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications
//Read the file - https://stackoverflow.com/questions/31746837/reading-uploaded-text-file-contents-in-html
//Replace newline with br - https://stackoverflow.com/questions/784539/how-do-i-replace-all-line-breaks-in-a-string-with-br-elements
/*
document.getElementById('todo_file').addEventListener('change', getFile)
  
function getFile(event) 
{
	const input = event.target;
	if ('files' in input && input.files.length > 0) 
	{
		placeFileContent(document.getElementById('file_content'), input.files[0]);
	}
}

function placeFileContent(target, file) {
	readFileContent(file).then(content => {
  	target.innerHTML = content.replace(/(?:\r\n|\r|\n)/g, '<br>');
  }).catch(error => console.log(error))
}

function readFileContent(file) {
	const reader = new FileReader()
  return new Promise((resolve, reject) => {
    reader.onload = event => resolve(event.target.result)
    reader.onerror = error => reject(error)
    reader.readAsText(file)
  })
}
*/

//Read and write the file
// https://web.dev/file-system-access/
// https://web.dev/browser-fs-access/

//file variable to create and save file
let file_handle;
let fileOptions = {
	types: [
		{
			description: "TODOLOH",
			accept: {
				"text/plain": [".todoloh"]
			},
			excludeAcceptAllOption: true,
			multiple: false
		}
	]
};

//load todo.html into index.html
//https://reactgo.com/get-element-from-iframe-javascript/
//https://stackoverflow.com/questions/1088544/get-element-from-within-an-iframe
let todo_web = document.getElementById("todo_iframe");
let todo_web_content = "";
todo_web.onload = () => {
    todo_web_content = todo_web.contentDocument || todo_web.contentWindow.document;
}

let upload_file = document.getElementById("upload_todo_list");
if (upload_file)
	upload_file.addEventListener("click", uploadFile);

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
			todo_web_content.getElementById("text_area").innerHTML = content;
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
	
	//TEST: show the text content in html
	document.getElementById("file_content").innerHTML = contents.replace(/(?:\r\n|\r|\n)/g, '<br>');
	
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
				  "text/plain": [".todoloh"],
				},
			  },
			],
		  };
		file_handle = await window.showSaveFilePicker(options);
	}
	
	let content = document.getElementById("text_area").value;
	
	let writable = await file_handle.createWritable();
	await writable.write(content);
	await writable.close();
}



