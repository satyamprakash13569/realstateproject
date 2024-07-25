import jwt from 'jsonwebtoken'
export async function getDataFromToken(request){
    try{
       const encodedToken=await request.cookies.get("token")?.value || '';
       if(encodedToken){
            const decodedToken=jwt.verify(encodedToken,process.env.JWT_SECRET);
            return decodedToken.id;
        }
        return "";
    }catch(error){
        console.log("Error has been occured while decodeing token:->",error.message);
        return "";
    }
}