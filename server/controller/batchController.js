import Batch from "../model/batchModel.js";
import Student from "../model/studentModel.js";


// creating batch 
export const createBatch = async (req, res) => {
    try {
        const { name } = req.body;

        const existingBatch = await Batch.findOne({ name });
        if (existingBatch) {
            return res.status(400).json({ error: "Batch already exists" });
        }

        const batch = new Batch({
            name,
        })
        await batch.save();
        res.status(201).json({ message: "Batch created successfully", batch });

    } catch (error) {
        console.error('Error creating batch:', error);
        res.status(500).json({ error: "Server error" })

    }
}

// get all the batch 

export const getAllBatch = async (req, res) => {
    try {
        const batchData = await Batch.find();
        if (!batchData || batchData.length === 0) {
            return res.status(404).json({ message: "Batch not found" })
        }
        res.status(200).json(batchData);
    } catch (error) {
        res.status(500).json({ errorMessage: error.message })
    }
}


// edit batch m 

export const editBatch = async (req, res) =>{
    try {
        const id = req.params.id;
        const batchExist = await Batch.findById(id);
        if(!batchExist){
            return res.status(400).json({message:"Batch not found"})
        }

        const updateData = await Batch.findByIdAndUpdate(id, req.body,{
            new:true
        })
        
        res.status(200).json({message: "Student updated successfully."})

    } catch (error) {
        res.status(500).json({errorMessage:error.message})
    }
}


// delete batch 

export const deleteBatch = async(req, res) =>{
    try {
        const id = req.params.id;
        const batchExist = await Batch.findById(id);
        if(!batchExist){
            return res.status(404).json({message:"Batch not found."})
        }

        const studentInBatch = await Student.findOne({batch :id});
        if(studentInBatch){
            return res.status(400).json({message: "Cannot delete batch. Student are enrolled in the batch"})
        }

        await Batch.findByIdAndDelete(id);
        res.status(200).json({message:"Batch deleted successfully."})
        
    } catch (error) {
        res.status(500).json({errorMessage:error.message})
    }
}