import express from "express";
import { getActiveCartForUser } from "../../services/cartService.js";
import validateJWT from "../../middlewares/ValidatwJWT.js";


const router = express.Router();


router.get("/", validateJWT , async (req, res) =>  {
     const userId = (req as any).user._id;
    //TO do get the user id from the token
const cart = await getActiveCartForUser({userId})
res.status(200).send(cart);

});



export default router;