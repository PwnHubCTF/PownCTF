import { PrismaClient } from "@prisma/client";
import cookieParser from "cookie-parser"
import jwt from 'jsonwebtoken'
import { v1 } from 'uuid'
const prisma = new PrismaClient()
import express, { Request, Response } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || "S3ecretCUSTOMNOONEWILLFINDITIHOPE:)";
const FLAG = process.env.FLAG || "Flag not set";
const PORT = process.env.PORT || 4000;

const app = express();
app.set('view engine', 'ejs');
app.use(express.json());
app.use(cookieParser());

start()

app.get('/', async (req: Request, res: Response) => {
    let token = req.cookies["jwt"];
    if (!token) {
        res.render('pages/index');
    } else {
        try {
            const decodedToken: any = jwt.verify(token, JWT_SECRET);
            if (decodedToken) {
                let flag = null
                if (decodedToken.name === 'admin') {
                    flag = FLAG
                }
                res.render('pages/auth/index', {
                    username: decodedToken.name,
                    flag
                });
            } else {
                res.redirect("/logout");
            }
        } catch (error) {
            res.redirect("/logout");
        }
    }
});

app.get("/logout", (req, res) => {
    res.cookie("jwt", "", { maxAge: 0 });
    res.redirect("/");
});

app.post('/register', async (req: Request, res: Response) => {
    const { name, password } = req.body;

    if (!name || !password) {
        res.status(422).json({ message: "error", reason: 'Empty fields' });
        return
    }
    if (name.length > 99 || password.length > 99) {
        res.status(422).json({ message: "error", reason: 'Value too long' });
        return
    }
    if (await prisma.user.findUnique({
        where: {
            name: String(name)
        }
    })) {
        res.status(409).json({ message: "error", reason: 'There is already a user with this name' });
        return
    }

    const user = await prisma.user.create({
        data: {
            name: String(name),
            password: String(password)
        }
    });
    const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, { expiresIn: "3h" });
    res.cookie("jwt", token);
    res.status(201).json({ message: "success", token: token });
});



app.post('/login', async (req: Request, res: Response) => {
    const { name, password } = req.body;

    if (!name || !password) {
        res.status(422).json({ message: "error", reason: 'Empty fields' });
        return
    }
    if (name.length > 99 || password.length > 99) {
        res.status(422).json({ message: "error", reason: 'Value too long' });
        return
    }
    const user = await prisma.user.findFirst({
        where: {
            AND: { name: String(name), password: String(password) }
        }
    })

    if (!user) {
        res.status(401).json({ message: "error", reason: 'Invalid credentials' });
        return
    }

    const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, { expiresIn: "3h" });
    res.cookie("jwt", token);
    res.status(200).json({ message: "success", token: token });
});

app.get('/reset_token/:name', async (req: Request, res: Response) => {
    const { name } = req.params;
    const user = await prisma.user.findUnique({
        where: {
            name: String(name)
        }
    })
    if (!user) {
        return res.status(404).json({ reason: "User not found" })
    }

    const token = await prisma.uniqueLink.create({
        data: {
            userId: user.id,
            token: v1()
        }
    });
    const date = new Date()
        .toISOString()
        .replace(/T/, " ")
        .replace(/\..+/, "")
    if (name == 'admin') {
        res.status(200).json({
            message: "success", for_user: name, info: 'email', generatedAt: date
        });
    } else {
        res.status(200).json({
            message: "success", for_user: name, info: `noEmail`, token: token.token, generatedAt: date
        });
    }

});

app.get('/connect/:token', async (req: Request, res: Response) => {
    const { token } = req.params;
    const tokenObject = await prisma.uniqueLink.findUnique({
        where: {
            token
        }
    })
    if (!tokenObject || !tokenObject.userId) {
        return res.status(401).json({ reason: "Invalid token" })
    }
    const user = await prisma.user.findUnique({
        where: {
            id: tokenObject.userId
        }
    })
    if (!user) {
        return res.status(404).json({ reason: "Unknow error" })
    }
    await prisma.uniqueLink.delete({
        where: {
            token
        }
    })
    const jwtToken = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, { expiresIn: "3h" });
    res.cookie("jwt", jwtToken);
    res.redirect('/')

});

async function start(){
    try {
        console.log('Create admin..');
        await prisma.user.upsert({
            where: { name: 'admin' },
            update: {},
            create: {
                name: 'admin',
                password: FLAG
            }
        });
        console.log('Admin created');
        app.listen(PORT, async () => {
            console.log(`Chall is running on port ${PORT}`);
        });
    } catch (error) {
        console.error(error);
        setTimeout(() => {
            process.exit()
        }, 2000);
    }
}