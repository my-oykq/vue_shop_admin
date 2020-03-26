// import axios from 'axios'

// export function request(config){
//     // 创建axios的实例
//     const instence = axios.create({
//         baseUrl:'http://127.0.0.1:8888/api/private/v1/',
//         timeout:5000
//     })
//     instence.interceptors.request.use(config =>{
//         return config
//     },err =>{
//         console.log(err)
//     })
//     instence.interceptors.response.use(res =>{
//         return res
//     },err =>{
//         console.log(err)
//     })
//     return instence(config)
// }