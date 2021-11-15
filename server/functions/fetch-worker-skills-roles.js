exports.handler = (context, event, callback) => {
  const response = new Twilio.Response();
  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, POST, GET, OPTIONS"
  );
  response.appendHeader("Access-Control-Allow-Headers", "Content-Type");

  const client = context.getTwilioClient();
  const workspaceSid = event.workspaceSid;

  client.taskrouter
    .workspaces(workspaceSid)
    .workers.list()
    .then(
      (workers) => {
        let roles = [];
        let skills = [];
        workers.map((worker) => {
          const attributes = JSON.parse(worker.attributes);
          if (
            attributes.routing &&
            attributes.routing.skills &&
            attributes.routing.skills.length > 0
          ) {
            attributes.routing.skills.map((skill) => {
              skills.push(skill);
            });
          }
          if (attributes.roles && attributes.roles.length > 0) {
            attributes.roles.map((role) => {
              roles.push(role);
            });
          }
        });
        response.setBody({ success: true, roles, skills });
        return callback(null, response);
      },
      (err) => {
        console.log(err.message);
        response.setBody({ success: false, error: err });
        return callback(null, response);
      }
    );
};
