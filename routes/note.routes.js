

import express from "express";
import requireLogIn from "../middlewares/auth.middleware.js";
import { createNote, getAllNotes,updateNote,deleteNote ,getSingleNote } from "../controllers/note.controller.js";



const router = express.Router();

router.get("/get-all-notes",requireLogIn, getAllNotes);

router.post("/create-note",requireLogIn, createNote);

router.get("/getNote/:_id",requireLogIn,getSingleNote);

router.put("/update-note/:_id",requireLogIn, updateNote);

router.delete("/delete/:_id",requireLogIn, deleteNote);








export default router;
