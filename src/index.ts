import { PrismaClient } from '@prisma/client'
import express from "express";
import { Request, Response } from "express";
import cors from 'cors';

const prisma = new PrismaClient()

async function main() {

    const app = express();        
    app.use(cors());
    app.use(express.json());

    app.listen(3000, async () => {
        console.log(`🚀 Service started and listening at: http://127.0.0.1:3000`);
        try {
            await prisma.$connect();
            console.log(`😄 Connected successfuly to the database!`);

            app.get("/", (req: Request, res: Response) => {
                res.json({ message: "Servidor funcionando com sucesso" });
            });
            app.get("/store", async (req: Request, res: Response) => {
                
                await prisma.user.create({
                    data: {
                        name: 'Rich',
                        email: 'hello@prisma.com',
                        posts: {
                            create: {
                                title: 'My first post',
                                body: 'Lots of really interesting stuff',
                                slug: 'my-first-post',
                                comments: {
                                    create: {
                                        comment: "First!"
                                    }
                                }
                            },
                        },
                    },
                });
                res.json({ message: "Usuário criado com sucesso!" });
            });
            app.get("/get-all", async (req: Request, res: Response) => {
                const users = await prisma.user.findMany();
                res.json({ message: "Usuários recuperados com sucesso!", users });
            });

        } catch (error) {
            console.log(`😕 Failed connecting to the database! Please check the logs`);
        }
    });
    
}

main()
    .catch(async (e) => {

        console.error(e)
        await prisma.$disconnect()
        process.exit(1)

    })