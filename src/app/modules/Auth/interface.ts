export type IAuth = {
    userId:string;
    password:string;
}

export type LoginResponse = {
    accessToken:string,
    refreshToken?:string,
    isNeededPassChange:boolean
}

export type IChngePassword = {
    oldPassword:string,
    newPassword:string
  }