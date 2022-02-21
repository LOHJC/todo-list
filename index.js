"use strict"

//todo uploaded
//Upload file - https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications
//Read the file - https://stackoverflow.com/questions/31746837/reading-uploaded-text-file-contents-in-html
//Replace newline with br - https://stackoverflow.com/questions/784539/how-do-i-replace-all-line-breaks-in-a-string-with-br-elements
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