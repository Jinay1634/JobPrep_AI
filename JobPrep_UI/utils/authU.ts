export interface DecodedToken{
    exp:number
}

export const isTokenExpired = (token:string):boolean=>{
   try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiry = payload.exp * 1000; 
    const now = Date.now();
    return now > expiry;
  } catch (error) {
    console.error("Error parsing token:", error);
    return true; 
  }
}