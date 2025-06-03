import { v4 as uuidv4 } from 'uuid';

const getOrCreateClientId = () => {
  let id = localStorage.getItem('client-uuid');
  if (!id) {
    id = uuidv4();
    localStorage.setItem('client-uuid', id);
  }
  return id;
};

export default getOrCreateClientId; 