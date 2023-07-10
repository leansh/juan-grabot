const https = require("https");

module.exports.handleMessage = async (event, WHATSAPP_TOKEN) => {
  // process POST request (WhatsApp chat messages)
  // https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
  // to learn about WhatsApp text message payload structure
  let response;
  let body = JSON.parse(event.body)
  console.log(body);
  let entries = body.entry;
  for (let entry of entries) {
    for (let change of entry.changes) {
      let value = change.value;
      if (value != null) {
        let phone_number_id = value.metadata.phone_number_id;
        if (value.messages != null) {
          for (let message of value.messages) {
            if (message.type === 'text') {
              await doHandleMessage(message, phone_number_id, WHATSAPP_TOKEN);
              const responseBody = "Done";
              response = {
                "statusCode": 200,
                "body": JSON.stringify(responseBody),
                "isBase64Encoded": false
              };
            }
          }
        }
      }
    }
  }
  return response;
}

async function doHandleMessage(message, phone_number_id, WHATSAPP_TOKEN) {
  let from = message.from;
  let message_body = message.text.body;
  // console.log(from, message_body);
  let reply_message = "Ack from AWS lambda: " + message_body;
  await sendReply(phone_number_id, WHATSAPP_TOKEN, from,
      reply_message);
}

const sendReply = (phone_number_id, whatsapp_token, to, reply_message) => {
  return new Promise((resolve, reject) => {
    let json = {
      messaging_product: "whatsapp",
      to: to,
      text: { body: reply_message },
    };
    let data = JSON.stringify(json);
    let path = "/v17.0/"+phone_number_id+"/messages";
    let options = {
      host: "graph.facebook.com",
      path: path,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + whatsapp_token
      }
    };
    let callback = (response) => {
      // console.log(`Status Code: ${response.statusCode}`);
      let str = "";
      response.on("data", (chunk) => {
        str += chunk;
      });
      response.on("end", () => {
        // console.log(str);
      });
    };
    let req = https.request(options, callback);

    req.on("error", (e) => {});
    req.write(data);
    req.end();
  });
}