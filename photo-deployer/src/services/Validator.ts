import { PhotoFileEntry } from "./model/Model";

export class MissingFieldError extends Error {
  constructor(missingField: string) {
    super(`Value for ${missingField} expected!`);
  }
}

export class JsonError extends Error {}

export function validateAsProjectEntry(arg: any) {
  if ((arg as PhotoFileEntry).photo == undefined) {
    throw new MissingFieldError("photo");
  }
}
