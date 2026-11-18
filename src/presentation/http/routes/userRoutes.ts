import { Router } from "express";
import { userController } from "../containers/UserContainer.js";
import { uploadImagesValidator } from "../middlewares/uploadImagesValidator.js";
import { validateRequestParams } from "../middlewares/paramsValidator.js";
import { registerSchema } from "../schemas/userValidationSchemas.js";
import { imagesValidateNormalize } from "../middlewares/imagesValidateNormalize.js";

const router = Router();

// public routes
//router.post("/login"); //login
router.post(
  "/register",
  uploadImagesValidator.single("profilePic"),
  imagesValidateNormalize,
  validateRequestParams(registerSchema),
  userController.create.bind(userController),
); //register
//passwordresetreq
//validatepasswordresetreq

export { router as userRouter };
