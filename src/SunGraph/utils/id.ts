export function id(): string {
  let newId: string = (
    "0000" + ((Math.random() * Math.pow(36, 4)) << 0).toString(36)
  ).slice(-4);

  newId = `a${newId}`;

  return newId;
}
