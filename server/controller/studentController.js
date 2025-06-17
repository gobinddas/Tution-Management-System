import Student from "../model/studentModel.js";
import fs from 'fs';
import path from "path";


// create student 
export const createStudent = async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      batch,
      shift,
      phone,
      email,
      address,
      stream,
      parentName,
      parentPhone,
      pastEducation,
    } = req.body;
    // validate phone Number
    if (!/^9\d{9}$/.test(phone)) {
      return res.status(400).json({ error: "Invalid phone number" });
    }
    if (parentPhone && !/^9\d{9}$/.test(parentPhone)) {
      return res.status(400).json({ error: "Invalid parent number." });
    }
    let profile = "";
    if (req.file) {
      profile = req.file.filename;
    }
    const student = new Student({
      profile,
      firstName,
      middleName,
      lastName,
      batch,
      shift,
      phone,
      email,
      address,
      stream,
      parentName,
      parentPhone,
      pastEducation,
    });
    await student.save();
    res.status(201).json({message:"Student created successfully", student})
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({error: "Server error"});
  }
};



// get all the student 

export const getAllStudent = async (req, res)=>{
  try {
    const studentData = await Student.find().populate("batch", "name");
    if(!studentData || studentData.length ===0){
      return res.status(404).json({message: "User data not found."});
    }
    res.status(200).json(studentData);
    
  } catch (error) {
    res.status(500).json({errorMessage: error.message})
    
  }

}


// get studen by id 

export const getStudentById = async(req, res) =>{
  try {
    const id = req.params.id;
    const studentExist = await Student.findById(id).populate("batch", "name");
    if(!studentExist){
      return res.status(404).json({message: "user not found"});
    }

    return res.status(200).json(studentExist);
    
  } catch (error) {
    res.status(500).json({errorMessage : error.message})
  }
}



// update student 

export const updateStudent = async(req, res) =>{
  try {
    const id = req.params.id;
    const studentExist = await Student.findById(id);
    if(!studentExist){
      return res.status(404).json({message:"student not foune."});
    }

    // if there is new file , delete old one and set new filename 

    if(req.file){
      if(studentExist.profile){
        const oldImagePath = path.join('uploads', studentExist.profile);
        if(fs.existsSync(oldImagePath)){
          fs.unlinkSync(oldImagePath);
        }
      }
      req.body.profile = req.file.filename
    }


    const updatedData = await Student.findByIdAndUpdate(id, req.body,{
      new:true
    })
    res.status(200).json({message: "Student updated successfully."});
    
  } catch (error) {
    res.status(500).json({errorMessage: error.message});
  }
}


// delete student 

export const deleteStudent = async(req, res) =>{
  try {
    const id = req.params.id;
    const studentExist = await Student.findById(id);
    if(!studentExist){
      return res.status(404).json({message:"student not found."})
    }

    // delete profile image if existe
    if(studentExist.profile){
      const imagePath = path.join('uploads', studentExist.profile);
      if(fs.existsSync(imagePath)){
        fs.unlinkSync(imagePath);
      }
    }





    await Student.findByIdAndDelete(id);
    res.status(200).json({message: "User deleted succesfuly"})
    
  } catch (error) {
    res.status(500).join({errorMessage: error.meessage})
    
  }
}

