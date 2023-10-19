import { database as db } from "../../src/config/connection.js";

export const seed = async () => {
  const table = "logs";
  const errors = [
    {
      type: "ReferenceError",
      message: "isLoading is not defined",
      stack:
        "{ componentStack: '\nmyComponent@https://localhost:5173/src/components/something/deep.tsx?t=1690181178921:34:20 }",
      email: "john@worldcompany.com",
      date: new Date(1679946943219),
    },
    {
      type: "TypeError",
      message: "error loading dynamically imported module",
      stack:
        "{ componentStack: '\nmyComponent@https://localhost:5173/src/components/something/deep.tsx?t=1690181178921:34:20 }",
      email: "chouchou@beignet.fr",
      date: new Date(1689888571184),
    },
    {
      type: "ReferenceError",
      message: "useRef is not defined",
      stack:
        "{ componentStack: '\nmyComponent@https://localhost:5173/src/components/something/deep.tsx?t=1690181178921:34:20 }",
      email: "jane@doe.fr",
      date: new Date(1689997571184),
    },
    {
      type: "TypeError",
      message: "error loading dynamically imported module",
      stack:
        "{ componentStack: '\nmyComponent@https://localhost:5173/src/components/something/deep.tsx?t=1690181178921:34:20 }",
      email: "super@yoyo.fr",
      date: new Date(1689947490432),
    },
    {
      type: "TypeError",
      message: "error loading dynamically imported module",
      stack:
        "{ componentStack: '\nmyComponent@https://localhost:5173/src/components/something/deep.tsx?t=1690181178921:34:20 }",
      email: "superman@space.org",
      date: new Date(1689888571184),
    },
    {
      type: "undefined uuid",
      message: "UUID undefined",
      stack: "-",
      email: "john@worldcompany.com",
      date: new Date(1689888571184),
    },
  ];

  for (let i = 0; i < errors.length; i++) {
    let log = await db(table)
      .where({ id: i + 1 })
      .first();

    if (!log) {
      await db(table).insert({
        email: errors[i].email,
        domain:
          errors[i].email.substring(
            errors[i].email.indexOf("@") + 1,
            errors[i].email.lastIndexOf("."),
          ) || "",
        type: errors[i].type,
        message: errors[i].message,
        stack: errors[i].stack,
        createdat: errors[i].date,
      });
    }
  }
};
