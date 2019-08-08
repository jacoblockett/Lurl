async function processURL() {
  const urlToProcess = document.getElementById('input')
  const response = await fetch('/api/shorturl/new', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    referrer: 'no-referrer',
    body: JSON.stringify({url: urlToProcess.value})
  })
  const jsonData = await response.json()

  //add logic to backfire bad url

  window.location.href = '/api/shorturl/new/present'
}

function copyURL() {
  const urlToCopy = document.getElementById('input')

  urlToCopy.select()
  document.execCommand('copy')
}
