import { Notes } from "../models/note.model.js";
import { User } from "../models/user.models.js";

const getAllNotes = async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user._id }).sort({ createdAt: -1 });
    const user = await User.findById(req.user._id).select("name email");

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    res.status(201).send({
      success: true,
      message: "All notes fetched successfully...",
      user: {
        name: user.name,
        email: user.email,
      },
      totalNotes: notes.length,
      notes,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      success: false,
      error,
      message: "Error in fetching  notes",
    });
  }
};

const createNote = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) return res.status(400).json({ error: "title is required" });
    if (!description)
      return res.status(400).json({ error: "description is required" });

    const user = await User.findById(req.user._id).select("name email");

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    const note = await Notes.create({
      user: req.user._id,
      title,
      description,
    });
    res.status(201).json({
      message: "succesfully note created",
      note,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      success: false,
      error,
      message: "Error in creating notes",
    });
  }
};

const updateNote = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Check if the note exists
    const note = await Notes.findById(req.params._id);
    if (!note) {
      return res.status(404).send({
        success: false,
        message: "Note not found",
      });
    }

    const updateNote = await Notes.findByIdAndUpdate(
      req.params._id,
      {
        title: title || note.title,
        description: description || note.description,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "note updated successfully",
      updateNote,
    });
  } catch (error) {
    console.error(error);
    res.status(400).send({
      success: false,
      message: "Error while updating profile",
      error,
    });
  }
};

const deleteNote = async (req, res) => {
  try {
    const note = await Notes.findByIdAndDelete(req.params._id);
    if (!note) {
      return res.status(404).send({
        success: false,
        message: "Note not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Note Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting note",
      error,
    });
  }
};


const getSingleNote=async(req,res)=>{
  try{
  const note = await Notes.findOne({_id : req.params._id})
  res.status(200).send({
    success: true,
    message: "Note Fetched",
    note,
  });
}catch (error) {
  console.log(error);
  res.status(500).send({
    success: false,
    message: "Eror while getitng single note",
    error,
  });
}
}
export { getAllNotes, createNote, updateNote , deleteNote , getSingleNote};
