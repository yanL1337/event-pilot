import PocketBase from 'pocketbase';

const pb = new PocketBase(`${import.meta.env.VITE_POCKET_FETCH_URL}`);

export default pb;
