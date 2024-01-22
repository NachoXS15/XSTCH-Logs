import express from 'express';
import { createLog, deleteLog, getAllLogs, getOneLog, updateLog } from '../controllers/logsController.js';
const router = express.Router();

router.get("/", getAllLogs)
router.get("/:id", getOneLog);
router.post("/", createLog);
router.put("/:id", updateLog);
router.delete("/:id", deleteLog);

export default router;