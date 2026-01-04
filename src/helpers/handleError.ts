export default function handleError(message:string):never{
  throw new Error(message);
};