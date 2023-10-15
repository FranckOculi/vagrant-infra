import logRepository from "../repositories/LogRepository.js";

export const createLogService = async ({ type, message, stack, email }) => {
  if (!type || !message || !stack || !email) {
    return { error: "Body fields can't be empty", status: 406, data: null };
  }

  let error;
  let newLog;
  if (typeof email === "string" && email.includes("@")) {
    newLog = {
      email,
      domain:
        email.substring(email?.indexOf("@") + 1, email?.lastIndexOf(".")) || "",
      type,
      message,
      stack,
      createdat: new Date(),
    };
  } else return { error: "Email adress is invalid", status: 422, data: null };

  const log = await logRepository.createLog(newLog).catch(err => {
    error = { error: "Unable to create log", status: 500, data: null };
  });

  if (error) return error;

  return { error: null, status: null, data: log };
};

export const getLogService = async (query, pagination) => {
  let error;

  const logs = await logRepository.getLogs(query, pagination).catch(() => {
    error = {
      error: "Unable to fetch logs",
      status: 500,
      data: null,
    };
  });

  if (error) return error;

  const newLogs = logs.data.map(log => {
    const date = log.createdat;
    let options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    const newDate = new Date(date).toLocaleDateString("fr-FR", options);
    log.createdat = newDate;

    return log;
  });

  const params = {
    email: query.email,
    domain: query.domain,
    origin: query.origin,
  };

  return {
    error: null,
    status: null,
    data: { logs: newLogs, pagination: logs.pagination, params },
  };
};

export const deleteLogService = async id => {
  let error;

  await logRepository
    .deleteLogById(id)
    .catch(
      err =>
        (error = { error: "Unable to delete log", status: 500, data: null }),
    );

  if (error) return error;

  return { error: null, status: null, data: id };
};
