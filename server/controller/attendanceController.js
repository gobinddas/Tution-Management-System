import Attendance from "../model/attendanceModel.js";


// create attendance 
export const createAttendance = async (req, res) => {
    try {
        const { batchId, date, students, attendanceBy } = req.body;
        const existingAttendance = await Attendance.findOne({ batchId, date });
        if (existingAttendance) {
            return res.status(400).json({ success: false, message: "Attendance for this batch and date alredy exists." });
        }
        const newAttendance = await Attendance.create({
            batchId, date, students, attendanceBy
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}



// get attendance by batch and date particular 

export const getAttendanceByBatchNameAndDate = async (req, res) => {
    try {
        const { batchId, date } = req.body;

        if (!batchId || !date) {
            return res.status(400).json({ success: false, message: "Batch Id and date are required" });
        }
        // make date normalize by fixing hour minute and minute and millisecond 
        const selectedDate = new Date(date);
        const startofDay = new Date(selectedDate.setHours(0, 0, 0, 0));
        const endofDay = new Date(selectedDate.setHours(23, 59, 59, 999));

        // find attendance 

        const attendance = await Attendance.findOne({
            batchId,
            date: { $gte: startofDay, $lte: endofDay },
        })
            .populate("students.studentId", "firstName  middleName lastName emial phone")
            .populate("batchId", "name");

        if (!attendance) {
            return res.status(400).json({ success: false, message: "No attendance found for the selected batch and date" });
        }

        return res.status(200).json({ success: true, date: attendance, })





    } catch (error) {
        console.log("Error fetching attendacne", error)
        return res.status(500).json({ success: false, message: "Server error while retriving attendance" });
    }
}


