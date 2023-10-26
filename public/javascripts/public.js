
const sendDeletionEmail = (apiUrl) => {
  document.getElementById('error').innerText = "";
  document.getElementById('response').innerText = "";
  const email = document.getElementById("email").value;
  const isValidEmail = /^[a-z0-9.]{1,64}@[a-z0-9.]{1,64}$/i.test(email);
  if (!isValidEmail) {
    document.getElementById('error').innerText = "Invalid email address"
    return;
  }
  const xhr = new XMLHttpRequest();
  xhr.open("GET", `${apiUrl}/api/v1/users/sendAccountDeletionEmail?email=${email}`);
  xhr.send();
  xhr.responseType = "json";
  document.getElementById('loading').style.display = "inline-block";
  document.getElementById('submit').style.display = "none";
  xhr.onload = () => {
    document.getElementById('loading').style.display = "none";
    document.getElementById('submit').style.display = "inline-block";
    const responseEl = document.getElementById("response")
    const data = xhr.response;
    if (xhr.readyState == 4 && xhr.status == 200) {
      responseEl.innerHTML = "Email sent. Please allow 5 minutes for it to arrive.<br>You can now close this page.";
    } else {
      if (data && data.message) {
        responseEl.innerText = data.message;
      }
      else {
        responseEl.innerText = "An error has occurred";
      }
    }
    responseEl.style.display = "block";
  };
}