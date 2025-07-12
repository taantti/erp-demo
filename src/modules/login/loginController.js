import loginService from './services/index.js';

export const login = async (req, res) => {
    console.log("loginService.login(): ");
    const login = await loginService.login(req, res);
    console.log("loginService.login(): login = " + login);  
    if(!login) return res.status(404).json({error: 'Wrong username or password'});
     res.status(200).json(login);
};
























