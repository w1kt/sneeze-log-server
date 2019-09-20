export default vCode => {
  return {
    html: `
    <p>
      This message has been sent because a request to recover the password for your Loggable account was made.
      <br>
      If it wasn't you, please ignore this message.
    </p>
    <p>
      Please enter the following code in the Loggable app to continue with the password recovery process:
      <p>
        <b style="font-size:22px">${vCode}</b>
      </p>
    </p>
    <p>
      This code is valid for 30 minutes and can only be used once.
    </p>
   `,
    text: `
      This message has been sent because a request to recover the password for your Loggable account was made.
      If it wasn't you, please ignore this message.
      Please enter the following code in the Loggable app to continue with the password recovery process:
      ${vCode}
      This code is valid for 30 minutes and can only be used once.
    `
  };
};
