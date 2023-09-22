export const subscribeEvents = async (payload) => {
  const {  event, data } = payload;
  // parse data
  console.log("Received data from notification service", data);

  // manage event
  switch (event) {
    case "UNICAST":
      break;
    default:
      break;
  }
};
