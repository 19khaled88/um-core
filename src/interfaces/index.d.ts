import { JwtPayload } from "jsonwebtoken";

// Define your custom user interface
interface UserPayload extends JwtPayload {
    role: string; // Include other properties as needed
}

declare global{
    namespace Express{
        interface Request {
            user:JwtPayload | string
            // user?:UserPayload
        }
    }
}