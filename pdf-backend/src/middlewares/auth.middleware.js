import userModel from "../models/user.model.js";
import ApiError from "../utils/ApiErrors.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";


export const verifyJWT = asyncHandler(async (req, res, next) => {
        try {
                const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
                if (!token)
                        throw new ApiError(401, "Unauthorized")
    
                const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
                const user = await userModel.findById(decodedToken?._id).select("-password -refreshToken")
    
                if (!user)
                        throw new ApiError(401, "Invalid Access Token")
    
                req.user = user
                next()
        } catch (error) {
             throw new ApiError(401, error?.message || "Invalid Access Token")
        }
})