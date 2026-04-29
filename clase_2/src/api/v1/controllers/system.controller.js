import { exec } from "child_process";
import { env } from "../../../config/env.js";
import { stderr } from "process";

export const createBackup = (req, res) => {
  const fileName = `backup-database`;
  // validar que solo el admin haga bacup
  const command = `mongodump --uri="${env.db_uri}" --out="./backups/${fileName}"`;

  exec(command, (error, stout, stderr) => {
    if (error) {
      console.log("Fallo critico");
      return res.status(500).json({ message: "fallo la copia" });
    }

    if (stderr) console.log("Log backup", stderr);
    if (stdout) console.log("Resultado", stdout);
    res
      .status(200)
      .json({ message: "cpopia exitosa", ruta: `/backup/${fileName}` });
  });
};
