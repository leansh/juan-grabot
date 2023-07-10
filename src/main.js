const {webhookVerification} = require("./handlers/webhookHandler");
const {handleMessage} = require("./handlers/messageHandler");

module.exports.hello = async (event)  => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
  const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;

  let response;
  if (event?.requestContext?.http?.method === "GET") {
    response = webhookVerification(event, VERIFY_TOKEN);
  } else if (event?.requestContext?.http?.method === "POST") {
    response = await handleMessage(event, WHATSAPP_TOKEN);
  } else {
    const responseBody = "Unsupported method";
    response = {
        "statusCode": 403,
        "body": JSON.stringify(responseBody),
        "isBase64Encoded": false
    };
  }
  
  return response;
}
