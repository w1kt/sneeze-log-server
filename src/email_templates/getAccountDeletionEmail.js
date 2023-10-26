export default link => {
  return {
    html: `
    <p>
      This message has been sent because a request to delete your Loggable account was made.
      <br>
      If it wasn't you, please ignore this message.
    </p>
    <p>
      Warning: by deleting your account all associated data you have logged will also be deleted.
      Please click <a href="${link}">delete my account</a> to continue. 
    </p>
    <p>
      This link is valid for 1 hour.
    </p>
   `,
    text: `
      This message has been sent because a request to delete your Loggable account was made.
      If it wasn't you, please ignore this message.
      Warning: by deleting your account all associated data you have logged will also be deleted.
      Please click delete my account to continue.
      This link is valid for 1 hour.
    `
  };
};