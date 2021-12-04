import axios from 'axios';

export default async function handler(req, res) {
    const { data, status } = await axios.get('https://faucetworld.in/faucet-list/data.json');
    if (status === 200) {
        res.status(200).send(data)
    } else {
        res.status(400).send({})
    }
}