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


let upload_file = document.getElementById("upload_todo_list");
if (upload_file)
	upload_file.addEventListener("click", uploadFile);

let save_file = document.getElementById("save_file");
if (save_file)
	save_file.addEventListener("click", saveFile);

let text_area = document.getElementById("text_area");
if (text_area)
	text_area.value = localStorage.getItem("todo_list");

//create new file
function newToDoList()
{
	localStorage.clear();
	window.location.href = "todo.html";
}

//upload file
async function uploadFile()
{
	[file_handle] = await window.showOpenFilePicker(fileOptions);
	
	if (!file_handle)
		return;
	
	let file = await file_handle.getFile();
	let contents = await file.text();
	
	localStorage.setItem("todo_list",contents);
	localStorage.setItem("file_uploaded",true);
	window.location.href = "todo.html"
	
	//TEST: show the text content in html
	document.getElementById("file_content").innerHTML = contents.replace(/(?:\r\n|\r|\n)/g, '<br>');
}

//save file
async function saveFile()
{
	let content = "hello world";
	
	//TODO: got some problems here as the file handle is gone when it comes to this page
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
		[file_handle] = await window.showSaveFilePicker(options);
	}
	
	
	let writable = await file_handle.createWritable();
	await writable.write(content);
	await writable.close();
}



