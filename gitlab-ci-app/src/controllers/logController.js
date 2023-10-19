import { createLogService, getLogService } from "../services/logServices.js";

export const postLog = async (req, res) => {
  const { type, message, stack, email } = req.body;

  const { error, status, data } = await createLogService({
    type,
    message,
    stack,
    email,
  });

  if (error)
    return res.code(status).send({
      message: error,
      data,
    });

  return res.code(201).send({
    message: "log added",
    data,
  });
};

export const getLog = async (req, res) => {
  const { error, status, data } = await getLogService(
    {
      email: req.query.email || null,
      domain: req.query.domain || null,
    },
    {
      per_page: parseInt(req.query.per_page) || null,
      current_page: parseInt(req.query.current_page) || null,
    },
  );

  if (error)
    return res.code(status).send({
      message: error,
      data,
    });

  return res.view("src/views/index.ejs", {
    error: data.error,
    logs: data.logs,
    pagination: data.pagination,
    params: data.params,
  });
};
