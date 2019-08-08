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

  console.log(jsonData)
}