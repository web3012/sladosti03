import { people } from '@app/data/people'

export default (req, res) => {
    res.status(200).json(people)
    
    // res.statusCode = 200
    // res.setHeader('Content-Type', 'application/json')
    // res.end(JSON.stringify(people))
}