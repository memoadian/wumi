import axios from "axios"

const getUsers = async token => {
    const client = axios.create({
        baseURL: 'https://api.wumi.app/api/v1',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        mode: 'no-cors'
    })

    if (token) {
        const resp = await client.get('/users/')
        
        const {results} = await resp.data

        const data = results.map(item => {
            return {
                id: item.id,
                first_name: item.first_name,
                last_name: item.last_name,
                email: item.email,
                gender: {
                    title: item.gender.title
                },
                age: {
                    title: item.age.title
                },
                my_time: {
                    title: item.my_time.title
                },
                opportunity: {
                    title: item.opportunity.title
                }
            }
        })

        return data
    }
}

export default getUsers