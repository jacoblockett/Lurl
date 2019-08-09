document.addEventListener('keyup', event => {
  if (event.keyCode === 13) {
    event.preventDefault()
    processURL()
  }
})

async function processURL() {
  const urlToProcess = document.getElementById('input')
  const submitBtn = document.getElementById('submit')

  submitBtn.innerHTML = '<i class="fas fa-fan fa-spin"></i>'

  const response = await fetch('/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    referrer: 'no-referrer',
    body: JSON.stringify({url: urlToProcess.value})
  })
  const json = await response.json()

  if (!json.error) {
    window.location.href = '/present'
  } else {
    document.getElementById('field').classList.add('is-danger')
    submitBtn.innerHTML = 'Send'
  }
}

function copyURL() {
  const urlToCopy = document.getElementById('input')
  const copyBtn = document.getElementById('copy')

  urlToCopy.select()
  document.execCommand('copy')
  copy.innerHTML = 'Copied!'
}
