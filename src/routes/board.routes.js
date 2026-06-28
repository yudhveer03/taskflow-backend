const express = require('express')
const router= express.Router()
const boardController = require('../../controllers/board.controller')
const jwtMiddleware = require('../../middleware/jwt.middleware')


router.post('/',
    jwtMiddleware,
    boardController.createBoard
)


router.get('/',
        jwtMiddleware,
    boardController.getBoards
)
        
router.get('/:id',
    jwtMiddleware,
    boardController.getBoardById
)

router.put('/:id',
    jwtMiddleware,
    boardController.updateBoard
)

router.delete('/:id',
    jwtMiddleware,
    boardController.deleteBoard
)

module.exports = router;