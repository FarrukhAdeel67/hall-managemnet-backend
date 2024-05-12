import DataUriParser from "datauri/parser.js";
import path from "path";

const getDataUri = (files) => {
  const parser = new DataUriParser();
  const dataUris = [];

  files.forEach((file) => {
    const extName = path.extname(file.originalname).toString();
    const dataUri = parser.format(extName, file.buffer);
    dataUris.push(dataUri.content);
  });

  return dataUris;
};

export default getDataUri;
