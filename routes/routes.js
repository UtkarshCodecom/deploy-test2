const express = require("express");
const {
    registerUser,
    loginUser,
    logout,
    getUserDetails,
    updateProfile,
    getAllUser,
    getSingleUser,
    deleteUser,
    getAllTask,
} = require("../controller/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const Task = require("../models/taskModel")

const router = express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);


router.route("/logout").get(logout);

router.route('/getalltask').get(getAllTask);

router.route("/me").get(isAuthenticatedUser, getUserDetails);

router
    .route("/users")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getAllUser);

router
    .route("/user/:id")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateProfile)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);






router.route('/tasks').post(isAuthenticatedUser, authorizeRoles("admin"), async (req, res) => {


    try {
        const createdTasks = await Task.create(req.body);
        res.status(201).json({ tasks: createdTasks });
    } catch (error) {
        console.error('Error creating tasks:', error);
        res.status(500).json({ error: 'Failed to create tasks' });
    }
});




router.route('/tasks/:userId').get(isAuthenticatedUser, authorizeRoles("employee"), async (req, res) => {
    const userId = req.params.userId;

    try {
        // Find tasks assigned to the user
        const tasks = await Task.find({ 'users.user': req.params.userId });
        // Check if tasks exist
        if (tasks.length > 0) {
            res.status(200).json({ success: true, tasks: tasks });
        } else {
            res.status(404).json({ success: false, message: 'No tasks found for the user' });
        }
    } catch (error) {
        console.error('Error finding tasks:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


router.route('/tasks/:id').put(isAuthenticatedUser, authorizeRoles("employee"), async (req, res) => {
    const userId = req.params.userId;


    // Find tasks assigned to the user
    await Task.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        message: "Task Updated Successfully"
    });
});

router.post('/book', async (req, res) => {
    // Destructure the fields from the request body
    const { name, email, phone, service, reason } = req.body;

    // Create a new instance of the Book model
    const newUser = new Book({
        name,
        email,
        phone,
        service,
        reason
    });

    try {
        // Save the new user to the database
        await newUser.save();

        // Send a success response
        res.status(201).json({ message: 'Booking successful', user: newUser });
    } catch (error) {
        // Handle any errors that occur during save
        console.error(error);
        res.status(500).json({ message: 'Server error, please try again later' });
    }
});



router.route('/alltask').post(isAuthenticatedUser, authorizeRoles("admin"), async (req, res) => {

    const { title, description, status, day, month, year } = req.body

    const task = new Regulartask({
        title,
        description,
        status,
        deadline: {
            day,
            month,
            year
        }

    })

    await task.save();
    res.status(201).json({ message: 'Task created successfully' });
})


router.get("/regulartask", async (req, res) => {
    const regulartask = await Regulartask.find()


    res.status(201).json(regulartask);

})

module.exports = router;