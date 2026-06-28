const boardModel = require('../models/board')

module.exports.createBoard = async (req, res) => {
    try {
        const { description, title } = req.body

        //Validate  
        if (!title || !title.trim()) {
            return res.status(400).json({
                message: "Give Valid Title"
            })
        }
        //User Loggged in
        const owner = req.user.id;

        //Create  Board 
        const board = await boardModel.create({
            description,
            title, owner
        })

        //Success Msg
        return res.status(201).json({
            message: "Your board has been saved",
            board,
        })
    }
    //Error Handle
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Board Creation Failed"
        })
    }
}

module.exports.getBoards = async (req, res) => {
    try {
        const ownerBoards = await boardModel.find({ owner: req.user.id })
        res.status(200).json({
            ownerBoards
        })
    }
    catch (err) {
        console.error(err)
        return res.status(500).json({
            message: "No Boards Found!!"
        })
    }
}

module.exports.getBoardById = async (req, res) => {
    try {
        const boardData = await boardModel.findOne({
            _id: req.params.id,
            owner: req.user.id
        })
        if (!boardData) {
            return res.status(404).json({
                message: "Board not found"
            })
        }
        return res.status(200).json({
            boardData
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

module.exports.updateBoard = async (req, res) => {
    try {
        const { title, description } = req.body
        if (!title || !title.trim()) {
            return res.status(400).json({
                message: "Enter title"
            })
        }
        const updatedBoard = await boardModel.findOneAndUpdate(
            {
                _id: req.params.id,
                owner: req.user.id,
            },
            {
                title,
                description
            },
            {
                new: true,
                runValidators: true
            }
        )
        if (!updatedBoard) {
            return res.status(404).json({
                message: "Board not founnd"
            })
        }
        return res.status(200).json({
            message: "Board Updated Successfully",
            updatedBoard,
        })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal Error"
        })
    }
}

module.exports.deleteBoard = async (req, res) => {
    try {
        const { id } = req.params
        const deletedBoard= await boardModel.findOneAndDelete({
            _id: id,
            owner: req.user.id
        }
        )
        if (!deletedBoard) {
            return res.status(404).json({
                 message: "Board not found"
            })
        }
        return res.status(200).json({
            message: "Board Deleted Successfully"
        })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal ServerError"
        })
    }
}
