import { Request, Response } from 'express';

export class AuthController{
    private authUseCase;
    constructor(authUseCase){
        this.authUseCase = authUseCase;
    }
    async signup(req: Request, res: Response) {
        const { email, password } = req.body;
        try {
            // const result = await this.authUseCase.signup(user_name, email, password);
            // res.status(201).json(result);
            res.status(201).send({message: "회원가입 성공"});
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async signin(req: Request, res: Response) {
        const { email, password } = req.body;
        try {
            // const result = await this.authUseCase.signin(email, password);
            // res.status(200).json(result);
            res.status(200).send({message: "로그인 성공"});
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async withdraw(req: Request, res: Response) {
        const { email } = req.body;
        try {
            // const result = await this.authUseCase.withdraw(email);
            // res.status(200).json(result);
            res.status(200).send({message: "회원 탈퇴 성공"});
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}