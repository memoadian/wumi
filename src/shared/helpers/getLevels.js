import axios from "axios"

const getLevels = async token => {
    const client = axios.create({
        baseURL: 'https://api.wumi.app/api/v1',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        mode: 'no-cors'
    })

    if (token) {
        const resp = await client.get('/catalog/levels/')
        
        const {results} = await resp.data

        const data = results.map(item => {
            return {
                id: item.id,
                url: item.url,
                title: item.title,
                is_active: item.is_active,
            }
        })

        return data
    }
}

export default getLevels