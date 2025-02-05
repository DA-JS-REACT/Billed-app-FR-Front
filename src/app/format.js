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


function errorExtension(message) {
  const error = new Error(message)
  return error
}


export const formatFile = (file) => {
  const formatFile = ['image/jpg','image/jpeg','image/png','image/gif']
  // const extension =  fileNameWithExt.split('.')
  // const fileNameExt = extension[extension.length-1]
  let fileName = '';
  const div = document.querySelector('#fileExt');
  const result = formatFile.includes(file.type)

  if(result){
    fileName = file.name
    $('.formatError').remove()
    div.style.color = 'black'
  }else {
    fileName = 'nope'
    $('#fileExt').append(`<small data-testid="file-error" class="formatError" style="color: red">format attendu .jpeg,.jpg, .png, .gif</small>`)
    div.style.color = 'red'
    throw new errorExtension("le format n'est pas conforme")

  }
    return fileName;
}