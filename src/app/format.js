export const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  const ye = new Intl.DateTimeFormat('fr', { year: 'numeric' }).format(date)
  const mo = new Intl.DateTimeFormat('fr', { month: 'short' }).format(date)
  const da = new Intl.DateTimeFormat('fr', { day: '2-digit' }).format(date)
  const month = mo.charAt(0).toUpperCase() + mo.slice(1)
  return `${parseInt(da)} ${month.substr(0,3)}. ${ye.toString().substr(2,4)}`
}
 
export const formatStatus = (status) => {
  switch (status) {
    case "pending":
      return "En attente"
    case "accepted":
      return "Accepté"
    case "refused":
      return "Refused"
  }
}

export const formatFile = (filePath,fileNameWithExt) => {

  const formatFile = ['jpg','jpeg','png','gif']
  const extension =  fileNameWithExt.split('.')
  const fileNameExt = extension[extension.length-1]
  let fileName = '';
  const div = document.querySelector('#fileExt');
  if(formatFile.find(ext => ext === fileNameExt )){
    fileName = filePath[filePath.length-1]
    $('.formatError').remove()
    div.style.color = 'black'
  }else {
    fileName = 'nope'
    $('#fileExt').append(`<small data-testid="file-error" class="formatError" style="color: red">format attendu .jpeg,.jpg, .png, .gif</small>`)
    div.style.color = 'red'
    throw new Error("le format n'est pas conforme")
  }
    return fileName;
}