export function webhookVerification(event, VERIFY_TOKEN) {
  // https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests
  // to learn more about GET request for webhook verification
  let queryParams = event?.queryStringParameters;
  if (queryParams != null) {
    const mode = queryParams["hub.mode"];
    if (mode == "subscribe") {
      const verifyToken = queryParams["hub.verify_token"];
      if (verifyToken == VERIFY_TOKEN) {
        let challenge = queryParams["hub.challenge"];
        return {
          "statusCode": 200,
          "body": parseInt(challenge),
          "isBase64Encoded": false
        };
      } else {
        const responseBody = "Error, wrong validation token";
        return {
          "statusCode": 403,
          "body": JSON.stringify(responseBody),
          "isBase64Encoded": false
        };
      }
    } else {
      const responseBody = "Error, wrong mode";
      return {
        "statusCode": 403,
        "body": JSON.stringify(responseBody),
        "isBase64Encoded": false
      };
    }
  } else {
    const responseBody = "Error, no query parameters";
    return {
      "statusCode": 403,
      "body": JSON.stringify(responseBody),
      "isBase64Encoded": false
    };
  }
}