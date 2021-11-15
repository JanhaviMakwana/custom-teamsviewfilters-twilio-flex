export const fetchWorkersData = async (workspaceSid) => {
  const body = {
    workspaceSid,
  };
  const res = await fetch("http://localhost:3000/fetch-worker-skills-roles", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-type": "application/json",
    },
  });
  return await res.json();
};
