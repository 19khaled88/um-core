import bcrypt from 'bcrypt';


async function verifyPassword(plainTextPassword:string,hassPassword:string){
    try {
        const isMatch = await bcrypt.compare(plainTextPassword,hassPassword)
        return isMatch
    } catch (error) {
        throw new Error("Failed to verify password");
    }
}

export default verifyPassword